import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { recordAuditLog } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body || {};

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Email dan kata sandi wajib diisi' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Cari user di database
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    // 2. Jika user tidak ditemukan -> 401 generik & catat audit LOGIN_FAILED
    if (!user || !user.passwordHash) {
      await recordAuditLog({
        actorId: user?.id ?? 'anonymous',
        action: 'LOGIN_FAILED',
        resource: 'auth/session',
        details: { reason: 'INVALID_CREDENTIALS' },
      });

      return NextResponse.json(
        { error: 'Email atau kata sandi tidak valid' },
        { status: 401 }
      );
    }

    // 3. Verifikasi kata sandi bcrypt
    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      await recordAuditLog({
        actorId: user.id,
        action: 'LOGIN_FAILED',
        resource: 'auth/session',
        details: { reason: 'INVALID_CREDENTIALS' },
      });

      return NextResponse.json(
        { error: 'Email atau kata sandi tidak valid' },
        { status: 401 }
      );
    }

    // 4. Buat sesi via Better Auth
    const authResponse = await auth.api.signInEmail({
      body: {
        email: cleanEmail,
        password,
      },
      asResponse: true,
    });

    // 5. Catat audit LOGIN_SUCCESS (Strict PRD §5: Tanpa IP, UA, atau email)
    await recordAuditLog({
      actorId: user.id,
      action: 'LOGIN_SUCCESS',
      resource: 'auth/session',
      details: { role: user.role },
    });

    // 6. Teruskan response dan header Set-Cookie dari Better Auth
    const setCookieHeader = authResponse.headers.get('set-cookie');
    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
        },
      },
      { status: 200 }
    );

    if (setCookieHeader) {
      response.headers.set('set-cookie', setCookieHeader);
    }

    return response;
  } catch (error) {
    console.error('[API /api/auth/login] Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem internal' },
      { status: 500 }
    );
  }
}
