import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/audit';

/**
 * Endpoint Janji Temu Pasien (RBAC US-3, S4, S5, S6)
 * - Tanpa sesi -> 401
 * - Sesi PATIENT -> Hanya melihat/membuat janji untuk dirinya sendiri (patientId di body diabaikan)
 * - Sesi ADMIN -> Memiliki visibilitas penuh
 */
export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req.headers);
  if (authResult instanceof NextResponse) {
    return authResult; // 401
  }

  // Jika PATIENT, filter mutlak berdasarkan user.id sesi server
  const whereClause =
    authResult.user.role === 'ADMIN'
      ? {}
      : { patientId: authResult.user.id };

  const appointments = await prisma.appointment.findMany({
    where: whereClause,
    include: {
      doctor: {
        select: { name: true, title: true, slug: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ appointments });
}

export async function POST(req: NextRequest) {
  const authResult = await requireAuth(req.headers);
  if (authResult instanceof NextResponse) {
    return authResult; // 401
  }

  try {
    const body = await req.json();
    const {
      doctorId,
      polyclinicId,
      appointmentDate,
      timeSlot,
      penjamin,
      poli,
      idempotencyKey,
    } = body || {};

    // PRD US-3: Jika body memuat userId atau patientId, abaikan secara sadar!
    // Identitas SELALU berasal dari sesi server (authResult.user.id)
    const effectivePatientId = authResult.user.id;

    if (!doctorId || !appointmentDate || !timeSlot || !penjamin || !poli) {
      return NextResponse.json(
        { error: 'Field janji temu (dokter, tanggal, slot waktu, penjamin, poli) wajib diisi lengkap' },
        { status: 422 }
      );
    }

    // Nomor janji temu unik
    const appointmentNumber = `APT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAppointment = await prisma.$transaction(async (tx) => {
      const apt = await tx.appointment.create({
        data: {
          appointmentNumber,
          patientId: effectivePatientId,
          doctorId,
          polyclinicId: polyclinicId ?? null,
          appointmentDate,
          timeSlot,
          penjamin,
          poli,
          status: 'BOOKED',
          idempotencyKey: idempotencyKey ?? null,
        },
      });

      await recordAuditLog({
        actorId: authResult.user.id,
        action: 'APPOINTMENT_CREATED',
        resource: `appointment/${apt.id}`,
        statusBefore: null,
        statusAfter: 'BOOKED',
        appointmentId: apt.id,
        tx,
      });

      return apt;
    });

    return NextResponse.json(
      { success: true, appointment: newAppointment },
      { status: 201 }
    );
  } catch (error: unknown) {
    // Tangani pelanggaran constraint unik database (P2002 / Postgres 23505)
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2002'
    ) {
      return NextResponse.json(
        { error: 'Slot waktu dokter telah dipesan oleh pasien lain' },
        { status: 409 }
      );
    }

    console.error('[API /api/patient/appointments POST] Error:', error);
    return NextResponse.json(
      { error: 'Gagal membuat janji temu' },
      { status: 500 }
    );
  }
}
