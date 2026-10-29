import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog } from '@/lib/audit';

/**
 * Endpoint Khusus Administrator (RBAC US-3 & S9)
 * - Tanpa sesi -> 401
 * - Sesi PATIENT -> 403 Forbidden
 * - Sesi ADMIN -> 200 OK
 */
export async function GET(req: NextRequest) {
  const authResult = await requireRole('ADMIN', req.headers);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const beds = await prisma.bedStatus.findMany({
    orderBy: { unit: 'asc' },
  });

  return NextResponse.json({ beds });
}

export async function PUT(req: NextRequest) {
  const authResult = await requireRole('ADMIN', req.headers);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const body = await req.json();
    const { unit, status, note } = body || {};

    if (!unit || !status) {
      return NextResponse.json(
        { error: 'Unit dan status tempat tidur wajib diisi' },
        { status: 400 }
      );
    }

    const currentBed = await prisma.bedStatus.findUnique({
      where: { unit },
    });

    if (!currentBed) {
      return NextResponse.json(
        { error: `Unit ${unit} tidak ditemukan` },
        { status: 404 }
      );
    }

    const statusBefore = currentBed.status;

    // Mutasi DB dalam transaksi atomik bersama audit log (US-7)
    const updatedBed = await prisma.$transaction(async (tx) => {
      const updated = await tx.bedStatus.update({
        where: { unit },
        data: {
          status,
          note: note !== undefined ? note : currentBed.note,
        },
      });

      await recordAuditLog({
        actorId: authResult.user.id,
        action: 'BED_STATUS_CHANGED',
        resource: `bed-status/${unit}`,
        statusBefore,
        statusAfter: status,
        tx,
      });

      return updated;
    });

    return NextResponse.json({
      success: true,
      bed: updatedBed,
    });
  } catch (error) {
    console.error('[API /api/admin/bed-status] Error:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui status bed' },
      { status: 500 }
    );
  }
}
