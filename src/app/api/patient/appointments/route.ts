import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/audit';
import { checkRateLimit } from '@/lib/rate-limit';

/**
 * Endpoint Janji Temu Pasien (RBAC US-3, US-4, US-5, S-3, S-4)
 * - Tanpa sesi -> 401
 * - Sesi selain PATIENT (mis. ADMIN) -> 403 Forbidden (S-3 Pemisahan Peran Tegas: ADMIN wajib via /api/admin/appointments)
 * - Sesi PATIENT -> Hanya melihat/membuat janji untuk dirinya sendiri (patientId di body diabaikan)
 */
export async function GET(req: NextRequest) {
  const authResult = await requireRole('PATIENT', req.headers);
  if (authResult instanceof NextResponse) {
    return authResult; // 401 atau 403
  }

  // Filter mutlak berdasarkan user.id sesi server pasien
  const appointments = await prisma.appointment.findMany({
    where: { patientId: authResult.user.id },
    include: {
      doctor: {
        select: { id: true, name: true, title: true, slug: true, specialtyId: true },
      },
      polyclinic: {
        select: { id: true, name: true, buildingId: true, floor: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ appointments });
}

export async function POST(req: NextRequest) {
  const authResult = await requireRole('PATIENT', req.headers);
  if (authResult instanceof NextResponse) {
    return authResult; // 401 atau 403
  }

  // Rate Limiting Pembuatan Janji (PRD v3.0 S10 - P2)
  const rateCheck = checkRateLimit(`appointment:${authResult.user.id}`, {
    windowMs: 60 * 1000,
    max: 10,
  });

  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: 'Batas frekuensi pembuatan janji tercapai. Silakan coba beberapa saat lagi.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateCheck.resetSeconds),
          'X-RateLimit-Limit': String(rateCheck.limit),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
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
    } = body || {};

    // 1. Ekstrak Idempotency-Key (dari Header atau Body)
    const idempotencyKey =
      req.headers.get('idempotency-key')?.trim() ||
      (body.idempotencyKey && typeof body.idempotencyKey === 'string'
        ? body.idempotencyKey.trim()
        : null);

    // 2. PRD US-3: Invarian Identitas Server
    // Jika body memuat userId atau patientId, abaikan secara sadar!
    // Identitas SELALU berasal dari sesi server (authResult.user.id)
    const effectivePatientId = authResult.user.id;

    // 3. Validasi kelengkapan field wajib
    if (!doctorId || !appointmentDate || !timeSlot || !penjamin || !poli) {
      return NextResponse.json(
        { error: 'Field janji temu (dokter, tanggal, slot waktu, penjamin, poli) wajib diisi lengkap' },
        { status: 422 }
      );
    }

    // 4. Validasi nilai penjamin dan tipe poli
    const validPenjamin = ['bpjs', 'umum', 'asuransi'];
    const validPoli = ['reguler', 'eksekutif'];
    if (!validPenjamin.includes(penjamin) || !validPoli.includes(poli)) {
      return NextResponse.json(
        { error: 'Nilai penjamin atau tipe poli tidak valid' },
        { status: 422 }
      );
    }

    // 5. Validasi tanggal dan waktu tidak boleh di masa lalu (US-4)
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
    if (appointmentDate < todayStr) {
      return NextResponse.json(
        { error: 'Tanggal janji temu tidak boleh di masa lalu' },
        { status: 422 }
      );
    }

    // 6. Validasi eksistensi dokter di DB (bisa via id atau slug)
    const doctor = await prisma.doctor.findFirst({
      where: {
        OR: [
          { id: doctorId },
          { slug: doctorId },
        ],
      },
    });
    if (!doctor) {
      return NextResponse.json(
        { error: 'Dokter tidak ditemukan atau tidak valid' },
        { status: 422 }
      );
    }

    // 7. Validasi eksistensi poliklinik jika dicantumkan
    let resolvedPolyclinicId: string | null = null;
    if (polyclinicId) {
      const poliRecord = await prisma.polyclinic.findUnique({
        where: { id: polyclinicId },
      });
      if (!poliRecord) {
        return NextResponse.json(
          { error: 'Poliklinik tidak ditemukan atau tidak valid' },
          { status: 422 }
        );
      }
      resolvedPolyclinicId = poliRecord.id;
    } else if (doctor.specialtyId) {
      // Hubungkan otomatis dengan poliklinik spesialisasi dokter
      const poliRecord = await prisma.polyclinic.findUnique({
        where: { id: doctor.specialtyId },
      });
      if (poliRecord) {
        resolvedPolyclinicId = poliRecord.id;
      }
    }

    // 8. Penanganan Idempotensi (US-4)
    if (idempotencyKey) {
      const existingApt = await prisma.appointment.findUnique({
        where: { idempotencyKey },
        include: {
          doctor: { select: { id: true, name: true, title: true, slug: true } },
          polyclinic: { select: { id: true, name: true, buildingId: true, floor: true } },
        },
      });

      if (existingApt) {
        // Cek kesesuaian payload
        const isSamePayload =
          existingApt.doctorId === doctorId &&
          existingApt.appointmentDate === appointmentDate &&
          existingApt.timeSlot === timeSlot &&
          existingApt.penjamin === penjamin &&
          existingApt.poli === poli;

        if (isSamePayload) {
          // Replay respons tersimpan tanpa membuat record baru
          return NextResponse.json(
            {
              success: true,
              appointment: existingApt,
              replayed: true,
            },
            { status: 200 }
          );
        } else {
          // Key sama tetapi body berbeda -> tolak 409 Conflict
          return NextResponse.json(
            {
              error: 'Idempotency-Key mismatch: Key ini telah digunakan untuk permintaan dengan parameter berbeda',
            },
            { status: 409 }
          );
        }
      }
    }

    // 9. Nomor janji temu unik
    const appointmentNumber = `APT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 10. Mutasi Atomik dalam Transaksi Prisma bersama Audit Log (US-7)
    const newAppointment = await prisma.$transaction(async (tx) => {
      const apt = await tx.appointment.create({
        data: {
          appointmentNumber,
          patientId: effectivePatientId,
          doctorId: doctor.id,
          polyclinicId: resolvedPolyclinicId,
          appointmentDate,
          timeSlot,
          penjamin,
          poli,
          status: 'BOOKED',
          idempotencyKey: idempotencyKey ?? null,
        },
        include: {
          doctor: { select: { id: true, name: true, title: true, slug: true } },
          polyclinic: { select: { id: true, name: true, buildingId: true, floor: true } },
        },
      });

      await recordAuditLog({
        actorId: effectivePatientId,
        action: 'APPOINTMENT_CREATED',
        resource: `appointment/${apt.id}`,
        statusBefore: null,
        statusAfter: 'BOOKED',
        appointmentId: apt.id,
        details: {
          doctorId,
          appointmentDate,
          timeSlot,
          penjamin,
          poli,
        },
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
