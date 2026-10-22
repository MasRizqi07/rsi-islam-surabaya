import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/audit';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * Endpoint Khusus Administrator: Mengubah Status Janji Temu (US-6 & S7)
 * - Tanpa sesi -> 401
 * - Sesi PATIENT -> 403 Forbidden
 * - Sesi ADMIN -> Mengubah status BOOKED -> COMPLETED atau NO_SHOW
 * - Transisi tidak valid (mis. CANCELLED -> COMPLETED) -> 409 Conflict
 */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const authResult = await requireRole('ADMIN', req.headers);
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

  try {
    const body = await req.json();
    const { status } = body || {};

    if (!status || !['COMPLETED', 'NO_SHOW'].includes(status)) {
      return NextResponse.json(
        { error: 'Status baru tidak valid. Nilai yang diperbolehkan: COMPLETED atau NO_SHOW' },
        { status: 422 }
      );
    }

    const currentStatus = appointment.status;

    // US-6: Validasi transisi status
    // Transisi hanya diizinkan dari BOOKED menuju COMPLETED atau NO_SHOW
    if (currentStatus === 'CANCELLED') {
      return NextResponse.json(
        { error: 'Tidak dapat mengubah status janji temu yang telah dibatalkan (CANCELLED)' },
        { status: 409 }
      );
    }

    if (currentStatus === 'COMPLETED' || currentStatus === 'NO_SHOW') {
      return NextResponse.json(
        { error: `Tidak dapat mengubah janji temu yang telah berada dalam status terminal (${currentStatus})` },
        { status: 409 }
      );
    }

    // Eksekusi mutasi atomik dalam transaksi bersama audit log (US-7)
    const updatedAppointment = await prisma.$transaction(async (tx) => {
      const updated = await tx.appointment.update({
        where: { id },
        data: { status },
        include: {
          patient: { select: { id: true, name: true, email: true } },
          doctor: { select: { id: true, name: true, title: true, slug: true } },
          polyclinic: { select: { id: true, name: true, buildingId: true, floor: true } },
        },
      });

      await recordAuditLog({
        actorId: authResult.user.id,
        action: 'APPOINTMENT_STATUS_CHANGED',
        resource: `appointment/${id}`,
        statusBefore: currentStatus,
        statusAfter: status,
        appointmentId: id,
        tx,
      });

      return updated;
    });

    return NextResponse.json({
      success: true,
      message: `Status janji temu berhasil diubah menjadi ${status}`,
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error('[API /api/admin/appointments/[id] PATCH] Error:', error);
    return NextResponse.json(
      { error: 'Gagal mengubah status janji temu' },
      { status: 500 }
    );
  }
}
