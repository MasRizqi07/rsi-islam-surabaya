import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/audit';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * Endpoint Detail & Pembatalan Janji Temu (US-3, US-5, S-3, S-4)
 * - Tanpa sesi -> 401
 * - Sesi selain PATIENT (mis. ADMIN) -> 403 Forbidden (S-3 Pemisahan Peran Tegas)
 * - Sesi PATIENT mencoba akses/batal janji pasien lain -> 403 Forbidden
 * - Transisi status COMPLETED / NO_SHOW -> 409 Conflict
 * - Pembatalan dan audit dilakukan atomik dalam satu transaksi (S-4)
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  const authResult = await requireRole('PATIENT', req.headers);
  if (authResult instanceof NextResponse) {
    return authResult; // 401 atau 403
  }

  const { id } = await params;
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: {
      doctor: {
        select: { id: true, name: true, title: true, slug: true, specialtyId: true },
      },
      polyclinic: {
        select: { id: true, name: true, buildingId: true, floor: true },
      },
    },
  });

  if (!appointment) {
    return NextResponse.json(
      { error: 'Janji temu tidak ditemukan' },
      { status: 404 }
    );
  }

  // Pengecekan Kepemilikan (Ownership Check US-3)
  if (appointment.patientId !== authResult.user.id) {
    return NextResponse.json(
      { error: 'Forbidden: Anda tidak memiliki akses ke janji temu pasien lain' },
      { status: 403 }
    );
  }

  return NextResponse.json({ appointment });
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const authResult = await requireRole('PATIENT', req.headers);
  if (authResult instanceof NextResponse) {
    return authResult; // 401 atau 403
  }

  const { id } = await params;
  const appointment = await prisma.appointment.findUnique({
    where: { id },
  });

  if (!appointment) {
    return NextResponse.json(
      { error: 'Janji temu tidak ditemukan' },
      { status: 404 }
    );
  }

  // Pengecekan Kepemilikan (Ownership Check US-3)
  if (appointment.patientId !== authResult.user.id) {
    return NextResponse.json(
      { error: 'Forbidden: Dilarang membatalkan janji temu milik pasien lain' },
      { status: 403 }
    );
  }

  // US-5: Jika status sudah COMPLETED atau NO_SHOW, tolak 409 (transisi tidak valid)
  if (appointment.status === 'COMPLETED' || appointment.status === 'NO_SHOW') {
    return NextResponse.json(
      { error: `Tidak dapat membatalkan janji temu yang berstatus ${appointment.status}` },
      { status: 409 }
    );
  }

  const statusBefore = appointment.status;

  try {
    // Lakukan pembatalan dalam transaksi atomik bersama audit log (US-7 & S-4)
    const cancelledAppointment = await prisma.$transaction(async (tx) => {
      const updated = await tx.appointment.update({
        where: { id },
        data: { status: 'CANCELLED' },
        include: {
          doctor: { select: { id: true, name: true, title: true, slug: true } },
          polyclinic: { select: { id: true, name: true, buildingId: true, floor: true } },
        },
      });

      await recordAuditLog({
        actorId: authResult.user.id,
        action: 'APPOINTMENT_CANCELLED',
        resource: `appointment/${id}`,
        statusBefore,
        statusAfter: 'CANCELLED',
        appointmentId: id,
        tx,
      });

      return updated;
    });

    return NextResponse.json({
      success: true,
      message: 'Janji temu berhasil dibatalkan',
      appointment: cancelledAppointment,
    });
  } catch (error) {
    console.error('[API /api/patient/appointments/[id] DELETE] Error:', error);
    return NextResponse.json(
      { error: 'Gagal membatalkan janji temu' },
      { status: 500 }
    );
  }
}
