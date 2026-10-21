import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import bcrypt from 'bcryptjs';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { prisma } from './db';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  secret: process.env.BETTER_AUTH_SECRET || 'f6c8d7e9a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8',
  emailAndPassword: {
    enabled: true,
    disableSignUp: true, // Dilarang registrasi publik (PRD §4.3)
    password: {
      hash: async (password: string) => bcrypt.hash(password, 10),
      verify: async ({ password, hash }: { password: string; hash: string }) =>
        bcrypt.compare(password, hash),
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'PATIENT',
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 menit
    },
  },
});

export interface AuthSessionUser {
  id: string;
  name: string;
  email: string;
  role: 'PATIENT' | 'ADMIN';
}

export interface AuthSession {
  user: AuthSessionUser;
  session: {
    id: string;
    token: string;
    expiresAt: Date;
  };
}

/**
 * Mengambil sesi server yang valid dari request headers.
 */
export async function getServerSession(reqHeaders?: Headers): Promise<AuthSession | null> {
  const activeHeaders = reqHeaders ?? (await headers());
  const session = await auth.api.getSession({
    headers: activeHeaders,
  });

  if (!session || !session.user) {
    return null;
  }

  return {
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: (session.user as unknown as { role?: string }).role === 'ADMIN' ? 'ADMIN' : 'PATIENT',
    },
    session: {
      id: session.session.id,
      token: session.session.token,
      expiresAt: session.session.expiresAt,
    },
  };
}

/**
 * Memastikan request memiliki sesi terautentikasi (401 bila tidak ada).
 * US-3: Otorisasi diperiksa di dalam setiap handler, identitas selalu dari sesi server.
 */
export async function requireAuth(reqHeaders?: Headers): Promise<AuthSession | NextResponse> {
  const session = await getServerSession(reqHeaders);
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized: Sesi tidak ditemukan atau telah kedaluwarsa' },
      { status: 401 }
    );
  }
  return session;
}

/**
 * Memastikan request memiliki peran spesifik (PATIENT / ADMIN).
 * 401 jika tanpa sesi, 403 jika sesi tidak memiliki hak akses yang cukup.
 */
export async function requireRole(
  requiredRole: 'PATIENT' | 'ADMIN',
  reqHeaders?: Headers
): Promise<AuthSession | NextResponse> {
  const authResult = await requireAuth(reqHeaders);
  if (authResult instanceof NextResponse) {
    return authResult; // 401
  }

  if (authResult.user.role !== requiredRole && requiredRole === 'ADMIN') {
    return NextResponse.json(
      { error: 'Forbidden: Akses ditolak. Diperlukan hak akses administrator.' },
      { status: 403 }
    );
  }

  return authResult;
}
