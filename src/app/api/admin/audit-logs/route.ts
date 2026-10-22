import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/db';

/**
 * Endpoint Khusus Administrator: Mengambil Jejak Audit Log (US-7 & S8)
 * - Tanpa sesi -> 401
 * - Sesi PATIENT -> 403 Forbidden
 * - Sesi ADMIN -> 200 OK (Maksimal 100 log terbaru)
 * - Menegakkan aturan privasi PRD §5 (Nol IP, User-Agent, atau Email)
 */
export async function GET(req: NextRequest) {
  const authResult = await requireRole('ADMIN', req.headers);
  if (authResult instanceof NextResponse) {
    return authResult; // 401 atau 403
  }

  const { searchParams } = new URL(req.url);
  const actionFilter = searchParams.get('action');
  const limitParam = parseInt(searchParams.get('limit') || '50', 10);
  const limit = isNaN(limitParam) ? 50 : Math.min(Math.max(limitParam, 1), 100);

  const whereClause: { action?: string } = {};
  if (actionFilter) {
    whereClause.action = actionFilter;
  }

  const logs = await prisma.auditLog.findMany({
    where: whereClause,
    take: limit,
    orderBy: { timestamp: 'desc' },
    include: {
      actor: {
        select: { id: true, name: true, role: true },
      },
    },
  });

  return NextResponse.json({ logs });
}
