/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { POST as authAllPostHandler } from '@/app/api/auth/[...all]/route';
import { POST as patientAptPostHandler } from '@/app/api/patient/appointments/route';
import { DELETE as patientAptDeleteHandler } from '@/app/api/patient/appointments/[id]/route';
import { NextRequest } from 'next/server';

describe('Phase 11.1 Security Hardening Tests (S-1, S-4, S-5)', () => {
  let patientSessionHeader: Headers;
  let patientUser: { id: string; email: string; role: string };
  let dummyDoctorId: string;

  beforeAll(async () => {
    // 1. Ambil data dokter fixture
    const doc = await prisma.doctor.findFirst();
    if (!doc) throw new Error('Fixture dokter belum tersedia!');
    dummyDoctorId = doc.id;

    // 2. Ambil user pasien demo
    const p = await prisma.user.findUnique({
      where: { email: 'pasien.demo@rsi-surabaya.test' },
    });
    if (!p) throw new Error('Akun pasien demo belum di-seed!');
    patientUser = { id: p.id, email: p.email, role: p.role };

    // Pastikan role pasien awalnya PATIENT
    await prisma.user.update({
      where: { id: p.id },
      data: { role: 'PATIENT' },
    });

    // 3. Login untuk mendapatkan sesi signed cookie
    const pRes = await auth.api.signInEmail({
      body: { email: 'pasien.demo@rsi-surabaya.test', password: 'PasswordDemo123!' },
      asResponse: true,
    });
    const pCookie = pRes.headers.get('set-cookie')?.split(';')[0] || '';
    patientSessionHeader = new Headers({
      cookie: pCookie,
      'Content-Type': 'application/json',
    });
  });

  afterAll(async () => {
    // Kembalikan role pasien ke PATIENT
    if (patientUser) {
      await prisma.user.update({
        where: { id: patientUser.id },
        data: { role: 'PATIENT' },
      });
    }
    await prisma.$disconnect();
  });

  // ===========================================================================
  // S-1 · KRITIS: Pasien Dilarang Menjadi ADMIN & Allowlist Handler Auth
  // ===========================================================================
  describe('S-1 · Proteksi Eksploitasi Peran & Pembatasan Handler Better Auth', () => {
    it('S-1.1: Percobaan eskalasi hak akses role ADMIN via POST /api/auth/update-user harus ditolak (404/403) dan role di DB tetap PATIENT', async () => {
      const req = new NextRequest('http://localhost:3000/api/auth/update-user', {
        method: 'POST',
        headers: patientSessionHeader,
        body: JSON.stringify({ role: 'ADMIN' }),
      });

      const res = await authAllPostHandler(req);

      // Endpoint tidak boleh berhasil dieksekusi oleh pasien
      expect([403, 404]).toContain(res.status);

      // Verifikasi mutlak di database: role pasien TIDAK PERNAH berubah menjadi ADMIN
      const dbUser = await prisma.user.findUnique({
        where: { id: patientUser.id },
      });
      expect(dbUser?.role).toBe('PATIENT');
    });

    it('S-1.2: Endpoint non-allowlist Better Auth harus ditolak 404 Not Found', async () => {
      const forbiddenPaths = [
        '/api/auth/sign-up/email',
        '/api/auth/change-email',
        '/api/auth/delete-user',
        '/api/auth/change-password',
        '/api/auth/revoke-sessions',
      ];

      for (const path of forbiddenPaths) {
        const req = new NextRequest(`http://localhost:3000${path}`, {
          method: 'POST',
          headers: patientSessionHeader,
          body: JSON.stringify({}),
        });

        const res = await authAllPostHandler(req);
        expect(res.status, `Path ${path} harus ditolak dengan 404`).toBe(404);
      }
    });
  });

  // ===========================================================================
  // S-4 · SEDANG: Atomisitas Transaksi Pembuatan & Pembatalan Janji (US-7)
  // ===========================================================================
  describe('S-4 · Atomisitas Transaksi & Rollback jika Pencatatan Audit Gagal', () => {
    it('S-4.1: POST /api/patient/appointments melakukan rollback penuh bila audit log gagal', async () => {
      const uniqueDate = `2099-09-${Math.floor(10 + Math.random() * 18)}`;
      const uniqueSlot = `${Math.floor(10 + Math.random() * 12)}:45`;
      const idempotencyKey = `atomicity-test-${Date.now()}`;

      // Mock atau trigger audit log error dengan menginterupsi transaksi
      const prismaAny = prisma as any;
      const originalTx = prismaAny.$transaction;

      prismaAny.$transaction = async (fn: any, options: any) => {
        return originalTx.call(prismaAny, async (tx: any) => {
          // Spy pada tx.auditLog.create agar sengaja melempar error
          tx.auditLog.create = async () => {
            throw new Error('SIMULATED_AUDIT_LOG_FAILURE');
          };
          return fn(tx);
        }, options);
      };

      try {
        const req = new NextRequest('http://localhost:3000/api/patient/appointments', {
          method: 'POST',
          headers: patientSessionHeader,
          body: JSON.stringify({
            doctorId: dummyDoctorId,
            appointmentDate: uniqueDate,
            timeSlot: uniqueSlot,
            penjamin: 'umum',
            poli: 'reguler',
            idempotencyKey,
          }),
        });

        const res = await patientAptPostHandler(req);
        expect(res.status).toBe(500);

        // Verifikasi mutlak: Tidak ada row appointment yang tersimpan di DB karena transaksi di-rollback
        const aptInDb = await prisma.appointment.findFirst({
          where: { idempotencyKey },
        });
        expect(aptInDb).toBeNull();
      } finally {
        prismaAny.$transaction = originalTx;
      }
    });

    it('S-4.2: DELETE /api/patient/appointments/[id] melakukan rollback bila audit log gagal', async () => {
      const uniqueDate = `2099-08-${Math.floor(10 + Math.random() * 18)}`;
      const uniqueSlot = `${Math.floor(10 + Math.random() * 12)}:50`;

      // 1. Buat janji temu valid terlebih dahulu
      const apt = await prisma.appointment.create({
        data: {
          appointmentNumber: `APT-ROLLBACK-${Date.now()}`,
          patientId: patientUser.id,
          doctorId: dummyDoctorId,
          appointmentDate: uniqueDate,
          timeSlot: uniqueSlot,
          penjamin: 'bpjs',
          poli: 'reguler',
          status: 'BOOKED',
        },
      });

      // 2. Interupsi transaksi pembatalan pada auditLog.create
      const prismaAny = prisma as any;
      const originalTx = prismaAny.$transaction;

      prismaAny.$transaction = async (fn: any, options: any) => {
        return originalTx.call(prismaAny, async (tx: any) => {
          tx.auditLog.create = async () => {
            throw new Error('SIMULATED_CANCEL_AUDIT_FAILURE');
          };
          return fn(tx);
        }, options);
      };

      try {
        const req = new NextRequest(`http://localhost:3000/api/patient/appointments/${apt.id}`, {
          method: 'DELETE',
          headers: patientSessionHeader,
        });

        const res = await patientAptDeleteHandler(req, {
          params: Promise.resolve({ id: apt.id }),
        });

        // Handler harus mengembalikan 500
        expect(res.status).toBe(500);

        // Verifikasi mutlak: status di DB HARUS TETAP 'BOOKED' (tidak menjadi 'CANCELLED')
        const untouchedApt = await prisma.appointment.findUnique({
          where: { id: apt.id },
        });
        expect(untouchedApt?.status).toBe('BOOKED');
      } finally {
        prismaAny.$transaction = originalTx;
      }
    });
  });

  // ===========================================================================
  // S-5 · SEDANG: Constraint Unik Database Anti-Double-Booking dari db:setup
  // ===========================================================================
  describe('S-5 · Keberadaan Partial Unique Index unique_active_doctor_slot di Database', () => {
    it('S-5.1: pg_indexes memuat partial unique index unique_active_doctor_slot pada tabel Appointment', async () => {
      const indexes: any[] = await prisma.$queryRaw`
        SELECT indexname, indexdef
        FROM pg_indexes
        WHERE tablename = 'Appointment' AND indexname = 'unique_active_doctor_slot';
      `;

      expect(indexes.length).toBe(1);
      expect(indexes[0].indexname).toBe('unique_active_doctor_slot');
      expect(indexes[0].indexdef).toContain('unique_active_doctor_slot');
      expect(indexes[0].indexdef).toContain('CANCELLED');
    });
  });
});
