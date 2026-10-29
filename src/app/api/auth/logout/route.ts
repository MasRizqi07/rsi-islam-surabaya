import { NextRequest, NextResponse } from 'next/server';
import { auth, getServerSession } from '@/lib/auth';
import { recordAuditLog } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(req.headers);

    if (session) {
      await recordAuditLog({
        actorId: session.user.id,
        action: 'LOGOUT',
        resource: 'auth/session',
      });

      await auth.api.signOut({
        headers: req.headers,
      });
    }

    const response = NextResponse.json(
      { success: true, message: 'Logout berhasil' },
      { status: 200 }
    );

    // Hapus session cookies
    response.cookies.delete('better-auth.session_token');
    response.cookies.delete('better-auth.session_data');

    return response;
  } catch (error) {
    console.error('[API /api/auth/logout] Error:', error);
    return NextResponse.json(
      { error: 'Gagal melakukan logout' },
      { status: 500 }
    );
  }
}
