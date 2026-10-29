import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getServerSession(req.headers);

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized: Sesi tidak aktif' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    user: session.user,
  });
}
