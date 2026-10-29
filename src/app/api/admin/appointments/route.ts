import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/db';

/**
 * Endpoint Khusus Administrator: Melihat Semua Janji Temu Pasien (US-6 & S7)
 * - Tanpa sesi -> 401
 * - Sesi PATIENT -> 403 Forbidden
 * - Sesi ADMIN -> 200 OK (Seluruh janji dari semua pasien)
 */
export async function GET(req: NextRequest) {
  const authResult = await requireRole('ADMIN', req.headers);
  if (authResult instanceof NextResponse) {
    return authResult; // 401 atau 403
  }

  const { searchParams } = new URL(req.url);
  const statusFilter = searchParams.get('status');

  const whereClause: { status?: string } = {};
  if (statusFilter && ['BOOKED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(statusFilter)) {
    whereClause.status = statusFilter;
  }

  const appointments = await prisma.appointment.findMany({
    where: whereClause,
    include: {
      patient: {
        select: { id: true, name: true, email: true, role: true },
      },
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
