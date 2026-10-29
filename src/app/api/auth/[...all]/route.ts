import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';
import { NextRequest, NextResponse } from 'next/server';

const betterAuthHandler = toNextJsHandler(auth.handler);

/**
 * S-1 · Allowlist Path Better Auth (Hanya path yang diizinkan untuk diakses).
 * Semua path di luar allowlist ditolak secara eksplisit dengan 404 Not Found.
 */
const ALLOWED_AUTH_PATHS = new Set([
  '/sign-in/email',
  '/sign-out',
  '/get-session',
  '/ok',
]);

function extractSubPath(req: NextRequest): string {
  const url = new URL(req.url);
  let pathname = url.pathname;
  if (pathname.startsWith('/api/auth')) {
    pathname = pathname.slice('/api/auth'.length);
  }
  if (!pathname.startsWith('/')) {
    pathname = `/${pathname}`;
  }
  if (pathname.length > 1 && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }
  return pathname;
}

export async function GET(req: NextRequest) {
  const subPath = extractSubPath(req);
  if (!ALLOWED_AUTH_PATHS.has(subPath)) {
    return NextResponse.json(
      { error: 'Not Found: Endpoint autentikasi tidak ditemukan atau dinonaktifkan' },
      { status: 404 }
    );
  }
  return betterAuthHandler.GET(req);
}

export async function POST(req: NextRequest) {
  const subPath = extractSubPath(req);
  if (!ALLOWED_AUTH_PATHS.has(subPath)) {
    return NextResponse.json(
      { error: 'Not Found: Endpoint autentikasi tidak ditemukan atau dinonaktifkan' },
      { status: 404 }
    );
  }
  return betterAuthHandler.POST(req);
}
