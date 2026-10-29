import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { checkRateLimit, resetRateLimitStore } from '@/lib/rate-limit';
import { POST as loginPostHandler } from '@/app/api/auth/login/route';
import { POST as appointmentPostHandler } from '@/app/api/patient/appointments/route';
import { NextRequest, NextResponse } from 'next/server';
import nextConfig from '../../../next.config.mjs';

describe('Phase 11 Hardening, Security Headers, Rate Limiting (S10) & S1–S11 Matrix Audit', () => {
  let patientSessionHeader: Headers;
  let testDoctorId: string;

  beforeAll(async () => {
    // 1. Ambil dokter dari DB
    const doc = await prisma.doctor.findFirst();
    if (!doc) throw new Error('Fixture dokter belum tersedia di database!');
    testDoctorId = doc.id;

    // 2. Buat sesi Better Auth untuk pasien demo
    const pRes = await auth.api.signInEmail({
      body: { email: 'pasien.demo@rsi-surabaya.test', password: 'PasswordDemo123!' },
      asResponse: true,
    });
    const pCookie = pRes.headers.get('set-cookie')?.split(';')[0] || '';
    patientSessionHeader = new Headers({ cookie: pCookie, 'Content-Type': 'application/json' });
  });

  beforeEach(() => {
    resetRateLimitStore();
  });

  afterAll(async () => {
    resetRateLimitStore();
    await prisma.$disconnect();
  });

  // ===========================================================================
  // S10 · RATE LIMITING (P2) & DOKUMENTASI SERVERLESS
  // ===========================================================================
  describe('S10 · Rate Limiter In-Memory & Proteksi Abuse', () => {
    it('checkRateLimit mengizinkan request di bawah kuota dan memblokir saat batas terlampaui', () => {
      const id = 'client-test-s10';
      const opts = { windowMs: 1000, max: 3 };

      // Request 1, 2, 3 harus lolos
      expect(checkRateLimit(id, opts).allowed).toBe(true);
      expect(checkRateLimit(id, opts).allowed).toBe(true);
      const res3 = checkRateLimit(id, opts);
      expect(res3.allowed).toBe(true);
      expect(res3.remaining).toBe(0);

      // Request 4 harus ditolak (allowed: false)
      const res4 = checkRateLimit(id, opts);
      expect(res4.allowed).toBe(false);
      expect(res4.remaining).toBe(0);
      expect(res4.resetSeconds).toBeGreaterThan(0);
    });

    it('POST /api/auth/login mengembalikan HTTP 429 Too Many Requests saat melebihi batas percobaan', async () => {
      const email = 'spam.login@rsi-surabaya.test';
      const headers = new Headers({
        'Content-Type': 'application/json',
        'x-forwarded-for': '192.0.2.10',
      });

      // Lakukan 5 percobaan salah
      for (let i = 0; i < 5; i++) {
        const req = new NextRequest('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers,
          body: JSON.stringify({ email, password: 'WrongPassword!' }),
        });
        const res = await loginPostHandler(req);
        expect(res.status).toBe(401); // 401 Unauthorized
      }

      // Percobaan ke-6 harus kena Rate Limit (429)
      const reqBlocked = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers,
        body: JSON.stringify({ email, password: 'WrongPassword!' }),
      });
      const resBlocked = await loginPostHandler(reqBlocked);
      expect(resBlocked.status).toBe(429);
      expect(resBlocked.headers.get('Retry-After')).toBeTruthy();
      expect(resBlocked.headers.get('X-RateLimit-Remaining')).toBe('0');

      const jsonBlocked = await resBlocked.json();
      expect(jsonBlocked.error).toContain('Terlalu banyak percobaan');
    });

    it('POST /api/patient/appointments mengembalikan HTTP 429 saat pasien melakukan spam permintaan', async () => {
      // 10 request awal (diisi dengan payload invalid agar cepat divalidasi)
      for (let i = 0; i < 10; i++) {
        const req = new NextRequest('http://localhost:3000/api/patient/appointments', {
          method: 'POST',
          headers: patientSessionHeader,
          body: JSON.stringify({ doctorId: testDoctorId }),
        });
        const res = await appointmentPostHandler(req);
        expect(res.status).toBe(422); // Gagal validasi payload, tetapi kuota rate limit terhitung
      }

      // Request ke-11 harus diblokir oleh rate limiter (429)
      const reqSpam = new NextRequest('http://localhost:3000/api/patient/appointments', {
        method: 'POST',
        headers: patientSessionHeader,
        body: JSON.stringify({ doctorId: testDoctorId }),
      });
      const resSpam = await appointmentPostHandler(reqSpam);
      expect(resSpam.status).toBe(429);
      expect(resSpam.headers.get('Retry-After')).toBeTruthy();
      expect(resSpam.headers.get('X-RateLimit-Limit')).toBe('10');

      const jsonSpam = await resSpam.json();
      expect(jsonSpam.error).toContain('Batas frekuensi');
    });
  });

  // ===========================================================================
  // SECURITY HEADERS & PRIVACY AUDIT (PRD §5)
  // ===========================================================================
  describe('Security Headers & Privacy Invariants', () => {
    it('next.config.mjs mendefinisikan security headers lengkap sesuai spesifikasi PRD v3', async () => {
      const headerConfigs = await nextConfig.headers();
      expect(headerConfigs.length).toBeGreaterThan(0);

      const rootHeaders = headerConfigs.find((h: { source: string }) => h.source === '/:path*');
      expect(rootHeaders).toBeDefined();
      if (!rootHeaders) throw new Error('Root headers config not found');

      const headerMap = new Map(rootHeaders.headers.map((h: { key: string; value: string }) => [h.key, h.value]));

      // 1. Content-Security-Policy (Allowlist)
      const csp = headerMap.get('Content-Security-Policy');
      expect(csp).toBeDefined();
      expect(csp).toContain("default-src 'self'");
      expect(csp).toContain("frame-ancestors 'none'");
      expect(csp).toContain("object-src 'none'");

      // 2. X-Robots-Tag (PRD §5: noindex, nofollow, tanpa Disallow)
      expect(headerMap.get('X-Robots-Tag')).toBe('noindex, nofollow, noarchive, nosnippet');

      // 3. X-Frame-Options & MIME sniffing
      expect(headerMap.get('X-Frame-Options')).toBe('DENY');
      expect(headerMap.get('X-Content-Type-Options')).toBe('nosniff');

      // 4. Referrer & Permissions Policy
      expect(headerMap.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
      expect(headerMap.get('Permissions-Policy')).toContain('camera=()');
    });

    it('semua entri di tabel auditLog tidak mengandung IP, user-agent, atau surel pasien (PRD §5)', async () => {
      const auditLogs = await prisma.auditLog.findMany({
        take: 20,
        orderBy: { timestamp: 'desc' },
      });

      for (const log of auditLogs) {
        // Kolom di skema DB PRD §5: actorId, action, resource, statusBefore, statusAfter, details, timestamp
        // Verifikasi tidak ada field terlarang yang bocor di details JSON
        const detailsStr = JSON.stringify(log.details || {});
        expect(detailsStr).not.toMatch(/127\.0\.0\.1/);
        expect(detailsStr).not.toMatch(/Mozilla/i);
        expect(detailsStr).not.toMatch(/Chrome/i);
        expect(detailsStr).not.toMatch(/@rsi-surabaya\.test/i);
      }
    });
  });

  // ===========================================================================
  // S1–S11 METRICS & ACCEPTANCE CHECK
  // ===========================================================================
  describe('S1–S11 Fullstack Portfolio Success Verification', () => {
    it('S1 & S2: database terisi 24 dokter fiktif, spesialisasi, dan lantai tower', async () => {
      const docCount = await prisma.doctor.count({ where: { isFictional: true } });
      expect(docCount).toBe(24);

      const specCount = await prisma.specialty.count();
      expect(specCount).toBe(17);

      const floorCount = await prisma.towerFloor.count({ where: { buildingId: 'tower' } });
      expect(floorCount).toBe(13);
    });

    it('S3: kata sandi di database tersimpan dalam bentuk hash bcrypt (bukan plaintext)', async () => {
      const users = await prisma.user.findMany();
      for (const u of users) {
        expect(u.passwordHash).toBeTruthy();
        expect(u.passwordHash).toMatch(/^\$2[aby]\$\d{2}\$/); // Format hash bcrypt standar
        expect(u.passwordHash).not.toBe('AdminSecure123!');
        expect(u.passwordHash).not.toBe('PasswordDemo123!');
      }
    });

    it('S4 & S7 & S9: otorisasi RBAC menolak akses non-admin', async () => {
      // Verifikasi bahwa modul RBAC requireRole menolak role selain ADMIN
      const { requireRole } = await import('@/lib/auth');
      const authDenied = await requireRole('ADMIN', patientSessionHeader);
      expect(authDenied instanceof NextResponse).toBe(true);
      if (authDenied instanceof NextResponse) {
        expect(authDenied.status).toBe(403);
      }
    });
  });
});
