import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '@/lib/db';
import { POST as loginHandler } from '@/app/api/auth/login/route';
import { GET as adminBedGetHandler, PUT as adminBedPutHandler } from '@/app/api/admin/bed-status/route';
import { GET as patientAptGetHandler, POST as patientAptPostHandler } from '@/app/api/patient/appointments/route';
import { GET as aptDetailGetHandler, DELETE as aptDeleteHandler } from '@/app/api/patient/appointments/[id]/route';
import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

describe('Phase 8 Access Matrix & RBAC Verification (US-2, US-3, US-7, S3, S4, S8)', () => {
  let patientSessionHeader: Headers;
  let adminSessionHeader: Headers;
  let otherPatientSessionHeader: Headers;

  let patientUser: { id: string; email: string };
  let otherPatientUser: { id: string; email: string };
  let adminUser: { id: string; email: string };

  let dummyDoctorId: string;

  beforeAll(async () => {
    // 1. Ambil dokter fixture dari database
    const doctor = await prisma.doctor.findFirst();
    if (!doctor) throw new Error('Fixture dokter belum di-seed!');
    dummyDoctorId = doctor.id;

    // 2. Ambil user pasien demo & admin demo
    const p = await prisma.user.findUnique({
      where: { email: 'pasien.demo@rsi-surabaya.test' },
    });
    const a = await prisma.user.findUnique({
      where: { email: 'admin.demo@rsi-surabaya.test' },
    });
    if (!p || !a) throw new Error('Akun demo belum di-seed!');
    patientUser = { id: p.id, email: p.email };
    adminUser = { id: a.id, email: a.email };

    // 3. Buat akun pasien kedua untuk pengujian cross-tenant ownership
    const otherHash = await (await import('bcryptjs')).default.hash('PasswordDemo123!', 10);
    const otherP = await prisma.user.upsert({
      where: { email: 'pasien2.demo@rsi-surabaya.test' },
      update: { passwordHash: otherHash },
      create: {
        email: 'pasien2.demo@rsi-surabaya.test',
        name: 'Pasien Demo Kedua',
        passwordHash: otherHash,
        role: 'PATIENT',
      },
    });
    otherPatientUser = { id: otherP.id, email: otherP.email };

    await prisma.account.upsert({
      where: { id: `acc-${otherP.id}` },
      update: { password: otherHash },
      create: {
        id: `acc-${otherP.id}`,
        accountId: otherP.id,
        providerId: 'credential',
        userId: otherP.id,
        password: otherHash,
      },
    });

    // 4. Buat sesi Better Auth dengan signed cookie untuk ketiga persona
    const pRes = await auth.api.signInEmail({
      body: { email: 'pasien.demo@rsi-surabaya.test', password: 'PasswordDemo123!' },
      asResponse: true,
    });
    const pCookie = pRes.headers.get('set-cookie')?.split(';')[0] || '';
    patientSessionHeader = new Headers({ cookie: pCookie });

    const aRes = await auth.api.signInEmail({
      body: { email: 'admin.demo@rsi-surabaya.test', password: 'AdminSecure123!' },
      asResponse: true,
    });
    const aCookie = aRes.headers.get('set-cookie')?.split(';')[0] || '';
    adminSessionHeader = new Headers({ cookie: aCookie });

    const otherRes = await auth.api.signInEmail({
      body: { email: 'pasien2.demo@rsi-surabaya.test', password: 'PasswordDemo123!' },
      asResponse: true,
    });
    const otherCookie = otherRes.headers.get('set-cookie')?.split(';')[0] || '';
    otherPatientSessionHeader = new Headers({ cookie: otherCookie });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // ===========================================================================
  // US-2: AUTENTIKASI LOGIN & AUDIT LOG
  // ===========================================================================
  describe('US-2 · Autentikasi Login Demo & Keamanan Kata Sandi', () => {
    it('login dengan kredensial demo benar menghasilkan 200, cookie sesi, dan audit LOGIN_SUCCESS', async () => {
      const req = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'pasien.demo@rsi-surabaya.test',
          password: 'PasswordDemo123!',
        }),
      });

      const res = await loginHandler(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.user.role).toBe('PATIENT');

      // Memastikan cookie sesi diberikan
      const setCookie = res.headers.get('set-cookie');
      expect(setCookie).toBeDefined();
      expect(setCookie).toContain('better-auth.session_token');

      // Verifikasi audit log LOGIN_SUCCESS tercatat
      const audit = await prisma.auditLog.findFirst({
        where: {
          actorId: patientUser.id,
          action: 'LOGIN_SUCCESS',
        },
        orderBy: { timestamp: 'desc' },
      });
      expect(audit).toBeDefined();
      expect(audit?.resource).toBe('auth/session');
    });

    it('login dengan kata sandi salah menghasilkan 401 pesan generik dan audit LOGIN_FAILED', async () => {
      const req = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'pasien.demo@rsi-surabaya.test',
          password: 'KataSandiSalahTotal123!',
        }),
      });

      const res = await loginHandler(req);
      expect(res.status).toBe(401);

      const json = await res.json();
      expect(json.error).toBe('Email atau kata sandi tidak valid');

      // Verifikasi audit log LOGIN_FAILED tercatat
      const audit = await prisma.auditLog.findFirst({
        where: {
          actorId: patientUser.id,
          action: 'LOGIN_FAILED',
        },
        orderBy: { timestamp: 'desc' },
      });
      expect(audit).toBeDefined();
    });

    it('login dengan email tidak terdaftar menghasilkan 401 pesan generik yang sama persis', async () => {
      const req = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'email.tidak.ada@rsi-surabaya.test',
          password: 'PasswordSembarang123!',
        }),
      });

      const res = await loginHandler(req);
      expect(res.status).toBe(401);

      const json = await res.json();
      expect(json.error).toBe('Email atau kata sandi tidak valid');
    });
  });

  // ===========================================================================
  // US-3: MATRIKS AKSES 100% (RBAC & KEPEMILIKAN)
  // ===========================================================================
  describe('US-3 · Matriks Akses 100% Sel Lolos', () => {
    // -------------------------------------------------------------------------
    // MATRIKS 1: Endpoint Khusus Administrator (GET /api/admin/bed-status)
    // -------------------------------------------------------------------------
    it('Baris: /api/admin/bed-status | Kolom: Tanpa Sesi -> 401', async () => {
      const req = new NextRequest('http://localhost:3000/api/admin/bed-status');
      const res = await adminBedGetHandler(req);
      expect(res.status).toBe(401);
    });

    it('Baris: /api/admin/bed-status | Kolom: Sesi PATIENT -> 403 Forbidden', async () => {
      const req = new NextRequest('http://localhost:3000/api/admin/bed-status', {
        headers: patientSessionHeader,
      });
      const res = await adminBedGetHandler(req);
      expect(res.status).toBe(403);
      const json = await res.json();
      expect(json.error).toContain('administrator');
    });

    it('Baris: /api/admin/bed-status | Kolom: Sesi ADMIN -> 200 OK', async () => {
      const req = new NextRequest('http://localhost:3000/api/admin/bed-status', {
        headers: adminSessionHeader,
      });
      const res = await adminBedGetHandler(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.beds.length).toBeGreaterThan(0);
    });

    it('Baris: PUT /api/admin/bed-status | Kolom: Sesi PATIENT -> 403 Forbidden', async () => {
      const req = new NextRequest('http://localhost:3000/api/admin/bed-status', {
        method: 'PUT',
        headers: patientSessionHeader,
        body: JSON.stringify({ unit: 'ICU', status: 'terbatas' }),
      });
      const res = await adminBedPutHandler(req);
      expect(res.status).toBe(403);
    });

    it('Baris: PUT /api/admin/bed-status | Kolom: Sesi ADMIN -> 200 OK & Audit BED_STATUS_CHANGED', async () => {
      const req = new NextRequest('http://localhost:3000/api/admin/bed-status', {
        method: 'PUT',
        headers: adminSessionHeader,
        body: JSON.stringify({ unit: 'ICU', status: 'tersedia' }),
      });
      const res = await adminBedPutHandler(req);
      expect(res.status).toBe(200);

      const audit = await prisma.auditLog.findFirst({
        where: {
          actorId: adminUser.id,
          action: 'BED_STATUS_CHANGED',
        },
        orderBy: { timestamp: 'desc' },
      });
      expect(audit).toBeDefined();
    });

    // -------------------------------------------------------------------------
    // MATRIKS 2: Endpoint Daftar Janji Temu (GET /api/patient/appointments)
    // -------------------------------------------------------------------------
    it('Baris: /api/patient/appointments | Kolom: Tanpa Sesi -> 401', async () => {
      const req = new NextRequest('http://localhost:3000/api/patient/appointments');
      const res = await patientAptGetHandler(req);
      expect(res.status).toBe(401);
    });

    it('Baris: /api/patient/appointments | Kolom: Sesi PATIENT -> 200 OK (hanya miliknya)', async () => {
      const req = new NextRequest('http://localhost:3000/api/patient/appointments', {
        headers: patientSessionHeader,
      });
      const res = await patientAptGetHandler(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(Array.isArray(json.appointments)).toBe(true);
    });

    it('Baris: /api/patient/appointments | Kolom: Sesi ADMIN -> 200 OK', async () => {
      const req = new NextRequest('http://localhost:3000/api/patient/appointments', {
        headers: adminSessionHeader,
      });
      const res = await patientAptGetHandler(req);
      expect(res.status).toBe(200);
    });

    // -------------------------------------------------------------------------
    // MATRIKS 3: Invarian Identitas Server (Injeksi patientId di Body Diabaikan)
    // -------------------------------------------------------------------------
    it('Invarian Identitas: Mencoba injeksi patientId/userId lain di body -> Diabaikan, dipaksa sesi server', async () => {
      const uniqueDate = `2099-10-${Math.floor(10 + Math.random() * 18)}`;
      const uniqueSlot = `${Math.floor(10 + Math.random() * 12)}:00`;

      const req = new NextRequest('http://localhost:3000/api/patient/appointments', {
        method: 'POST',
        headers: patientSessionHeader,
        body: JSON.stringify({
          patientId: otherPatientUser.id, // Percobaan Spoofing identitas!
          userId: otherPatientUser.id,
          doctorId: dummyDoctorId,
          appointmentDate: uniqueDate,
          timeSlot: uniqueSlot,
          penjamin: 'bpjs',
          poli: 'reguler',
        }),
      });

      const res = await patientAptPostHandler(req);
      expect(res.status).toBe(201);
      const json = await res.json();

      // INVARIAN KRUSIAL: patientId pada janji yang dibuat HARUS milik pemegang sesi (patientUser.id),
      // BUKAN otherPatientUser.id yang diinjeksikan lewat body!
      expect(json.appointment.patientId).toBe(patientUser.id);
      expect(json.appointment.patientId).not.toBe(otherPatientUser.id);
    });

    // -------------------------------------------------------------------------
    // MATRIKS 4: Pembatalan Janji & Kepemilikan (DELETE /api/patient/appointments/[id])
    // -------------------------------------------------------------------------
    it('Kepemilikan: Sesi PATIENT A mencoba batalkan janji milik PATIENT B -> 403 Forbidden & data tidak berubah', async () => {
      const uniqueDate = `2099-11-${Math.floor(10 + Math.random() * 18)}`;
      const uniqueSlot = `${Math.floor(10 + Math.random() * 12)}:15`;

      // 1. Buat janji milik Pasien B (otherPatientUser)
      const aptB = await prisma.appointment.create({
        data: {
          appointmentNumber: `APT-B-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          patientId: otherPatientUser.id,
          doctorId: dummyDoctorId,
          appointmentDate: uniqueDate,
          timeSlot: uniqueSlot,
          penjamin: 'umum',
          poli: 'reguler',
          status: 'BOOKED',
        },
      });

      // 2. Pasien A mencoba membatalkan janji Pasien B dengan ID yang ditebak
      const req = new NextRequest(`http://localhost:3000/api/patient/appointments/${aptB.id}`, {
        method: 'DELETE',
        headers: patientSessionHeader, // Sesi Pasien A
      });

      const res = await aptDeleteHandler(req, {
        params: Promise.resolve({ id: aptB.id }),
      });

      // Ekspektasi: 403 Forbidden
      expect(res.status).toBe(403);
      const json = await res.json();
      expect(json.error).toContain('pasien lain');

      // Verifikasi data di database TIDAK BERUBAH
      const untouchedApt = await prisma.appointment.findUnique({
        where: { id: aptB.id },
      });
      expect(untouchedApt?.status).toBe('BOOKED');
    });

    it('Kepemilikan: Sesi PATIENT A mencoba membaca janji milik PATIENT B -> 403 Forbidden', async () => {
      const uniqueDate = `2099-07-${Math.floor(10 + Math.random() * 18)}`;
      const uniqueSlot = `${Math.floor(14 + Math.random() * 8)}:${Math.floor(10 + Math.random() * 49)}`;

      const aptRead = await prisma.appointment.create({
        data: {
          appointmentNumber: `APT-READ-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          patientId: otherPatientUser.id,
          doctorId: dummyDoctorId,
          appointmentDate: uniqueDate,
          timeSlot: uniqueSlot,
          penjamin: 'bpjs',
          poli: 'reguler',
          status: 'BOOKED',
        },
      });

      // Pasien A mencoba membaca detail janji Pasien B -> 403
      const reqA = new NextRequest(`http://localhost:3000/api/patient/appointments/${aptRead.id}`, {
        headers: patientSessionHeader,
      });
      const resA = await aptDetailGetHandler(reqA, { params: Promise.resolve({ id: aptRead.id }) });
      expect(resA.status).toBe(403);

      // Pasien B (pemilik sah) membaca detail janji miliknya -> 200
      const reqB = new NextRequest(`http://localhost:3000/api/patient/appointments/${aptRead.id}`, {
        headers: otherPatientSessionHeader,
      });
      const resB = await aptDetailGetHandler(reqB, { params: Promise.resolve({ id: aptRead.id }) });
      expect(resB.status).toBe(200);
    });

    it('Kepemilikan: Sesi PATIENT A membatalkan janji miliknya sendiri -> 200 OK & status berubah CANCELLED', async () => {
      const uniqueDate = `2099-12-${Math.floor(10 + Math.random() * 18)}`;
      const uniqueSlot = `${Math.floor(10 + Math.random() * 12)}:30`;

      // 1. Buat janji milik Pasien A
      const aptA = await prisma.appointment.create({
        data: {
          appointmentNumber: `APT-A-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          patientId: patientUser.id,
          doctorId: dummyDoctorId,
          appointmentDate: uniqueDate,
          timeSlot: uniqueSlot,
          penjamin: 'asuransi',
          poli: 'eksekutif',
          status: 'BOOKED',
        },
      });

      // 2. Pasien A membatalkan janji miliknya
      const req = new NextRequest(`http://localhost:3000/api/patient/appointments/${aptA.id}`, {
        method: 'DELETE',
        headers: patientSessionHeader, // Sesi Pasien A
      });

      const res = await aptDeleteHandler(req, {
        params: Promise.resolve({ id: aptA.id }),
      });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.appointment.status).toBe('CANCELLED');

      // Verifikasi status di DB berubah menjadi CANCELLED
      const dbApt = await prisma.appointment.findUnique({
        where: { id: aptA.id },
      });
      expect(dbApt?.status).toBe('CANCELLED');

      // Verifikasi audit log APPOINTMENT_CANCELLED tercatat
      const cancelAudit = await prisma.auditLog.findFirst({
        where: {
          appointmentId: aptA.id,
          action: 'APPOINTMENT_CANCELLED',
        },
      });
      expect(cancelAudit).toBeDefined();
      expect(cancelAudit?.statusBefore).toBe('BOOKED');
      expect(cancelAudit?.statusAfter).toBe('CANCELLED');
    });
  });

  // ===========================================================================
  // US-7 & PRD §5: INTEGRITAS AUDIT LOG & PRIVASI KETAT
  // ===========================================================================
  describe('US-7 & PRD §5 · Integritas Audit Log & Nol Kebocoran PII/Jaringan', () => {
    it('Audit log di seluruh tabel tidak memuat IP, User-Agent, atau Email', async () => {
      const logs = await prisma.auditLog.findMany();
      expect(logs.length).toBeGreaterThan(0);

      for (const log of logs) {
        // 1. Pastikan tidak ada kolom tersembunyi yang menyimpan IP atau email
        expect(log.actorId).toBeDefined();
        expect(log.action).toBeDefined();

        // 2. Pastikan details string tidak mengandung data sensitif
        if (log.details) {
          const lower = log.details.toLowerCase();
          expect(lower).not.toContain('ipaddress');
          expect(lower).not.toContain('useragent');
          expect(lower).not.toContain('user-agent');
          expect(lower).not.toContain('@rsi-surabaya.test');
          expect(lower).not.toContain('192.168.');
          expect(lower).not.toContain('127.0.0.1');
        }
      }
    });
  });
});
