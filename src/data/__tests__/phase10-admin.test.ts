import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { GET as adminAppointmentsGetHandler } from '@/app/api/admin/appointments/route';
import { PATCH as adminAppointmentPatchHandler } from '@/app/api/admin/appointments/[id]/route';
import { PUT as adminBedPutHandler } from '@/app/api/admin/bed-status/route';
import { GET as adminAuditLogsGetHandler } from '@/app/api/admin/audit-logs/route';
import { GET as publicBedGetHandler } from '@/app/api/bed-status/route';
import { NextRequest } from 'next/server';

describe('Phase 10 Admin Workflows, Bed Status, Audit Trail & RBAC (US-6, US-7, US-8, S7, S9, S11)', () => {
  let adminSessionHeader: Headers;
  let patientSessionHeader: Headers;

  let adminUser: { id: string; email: string };
  let patientUser: { id: string; email: string };
  let testDoctor: { id: string; name: string };

  beforeAll(async () => {
    // 1. Ambil fixture dokter dari database
    const doc = await prisma.doctor.findFirst();
    if (!doc) throw new Error('Fixture dokter belum tersedia di database!');
    testDoctor = { id: doc.id, name: doc.name };

    // 2. Ambil user admin dan user pasien demo
    const a = await prisma.user.findUnique({
      where: { email: 'admin.demo@rsi-surabaya.test' },
    });
    const p = await prisma.user.findUnique({
      where: { email: 'pasien.demo@rsi-surabaya.test' },
    });
    if (!a || !p) throw new Error('Akun demo admin/pasien belum di-seed!');
    adminUser = { id: a.id, email: a.email };
    patientUser = { id: p.id, email: p.email };

    // 3. Buat sesi Better Auth dengan signed cookie untuk Admin & Patient
    const aRes = await auth.api.signInEmail({
      body: { email: 'admin.demo@rsi-surabaya.test', password: 'AdminSecure123!' },
      asResponse: true,
    });
    const aCookie = aRes.headers.get('set-cookie')?.split(';')[0] || '';
    adminSessionHeader = new Headers({ cookie: aCookie, 'Content-Type': 'application/json' });

    const pRes = await auth.api.signInEmail({
      body: { email: 'pasien.demo@rsi-surabaya.test', password: 'PasswordDemo123!' },
      asResponse: true,
    });
    const pCookie = pRes.headers.get('set-cookie')?.split(';')[0] || '';
    patientSessionHeader = new Headers({ cookie: pCookie, 'Content-Type': 'application/json' });

    // 4. Bersihkan data uji tahun 2098 sebelum mulai
    await prisma.auditLog.deleteMany({
      where: { appointment: { appointmentDate: { startsWith: '2098-' } } },
    });
    await prisma.appointment.deleteMany({
      where: { appointmentDate: { startsWith: '2098-' } },
    });
  });

  afterAll(async () => {
    // Bersihkan data uji tahun 2098 setelah selesai
    await prisma.auditLog.deleteMany({
      where: { appointment: { appointmentDate: { startsWith: '2098-' } } },
    });
    await prisma.appointment.deleteMany({
      where: { appointmentDate: { startsWith: '2098-' } },
    });
    await prisma.$disconnect();
  });

  // ===========================================================================
  // US-6 & S7: KELOLA JANJI TEMU OLEH ADMINISTRATOR
  // ===========================================================================
  describe('US-6 & S7 · Manajemen Janji Temu oleh Administrator & Validasi Transisi', () => {
    it('endpoint GET /api/admin/appointments menolak request tanpa sesi (401) dan sesi PATIENT (403)', async () => {
      // 1. Tanpa sesi
      const reqAnon = new NextRequest('http://localhost:3000/api/admin/appointments');
      const resAnon = await adminAppointmentsGetHandler(reqAnon);
      expect(resAnon.status).toBe(401);

      // 2. Sesi PATIENT
      const reqPatient = new NextRequest('http://localhost:3000/api/admin/appointments', {
        headers: patientSessionHeader,
      });
      const resPatient = await adminAppointmentsGetHandler(reqPatient);
      expect(resPatient.status).toBe(403);
    });

    it('endpoint GET /api/admin/appointments mengembalikan semua janji temu untuk sesi ADMIN (200 OK)', async () => {
      const req = new NextRequest('http://localhost:3000/api/admin/appointments', {
        headers: adminSessionHeader,
      });
      const res = await adminAppointmentsGetHandler(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(Array.isArray(json.appointments)).toBe(true);
    });

    it('admin berhasil mengubah status BOOKED -> COMPLETED (200 OK + Audit APPOINTMENT_STATUS_CHANGED)', async () => {
      // 1. Buat janji berstatus BOOKED
      const apt = await prisma.appointment.create({
        data: {
          appointmentNumber: `APT-ADM-COMP-${Date.now()}`,
          patientId: patientUser.id,
          doctorId: testDoctor.id,
          appointmentDate: '2098-08-10',
          timeSlot: '09:30',
          penjamin: 'bpjs',
          poli: 'reguler',
          status: 'BOOKED',
        },
      });

      // 2. Admin mengubah status menjadi COMPLETED
      const req = new NextRequest(`http://localhost:3000/api/admin/appointments/${apt.id}`, {
        method: 'PATCH',
        headers: adminSessionHeader,
        body: JSON.stringify({ status: 'COMPLETED' }),
      });
      const res = await adminAppointmentPatchHandler(req, {
        params: Promise.resolve({ id: apt.id }),
      });
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.appointment.status).toBe('COMPLETED');

      // 3. Verifikasi di database & baris audit log dalam transaksi atomik (US-7)
      const updatedDb = await prisma.appointment.findUnique({ where: { id: apt.id } });
      expect(updatedDb?.status).toBe('COMPLETED');

      const audit = await prisma.auditLog.findFirst({
        where: {
          appointmentId: apt.id,
          action: 'APPOINTMENT_STATUS_CHANGED',
        },
      });
      expect(audit).toBeDefined();
      expect(audit?.actorId).toBe(adminUser.id);
      expect(audit?.statusBefore).toBe('BOOKED');
      expect(audit?.statusAfter).toBe('COMPLETED');
    });

    it('admin berhasil mengubah status BOOKED -> NO_SHOW (200 OK + Audit APPOINTMENT_STATUS_CHANGED)', async () => {
      // 1. Buat janji berstatus BOOKED
      const apt = await prisma.appointment.create({
        data: {
          appointmentNumber: `APT-ADM-NOSHOW-${Date.now()}`,
          patientId: patientUser.id,
          doctorId: testDoctor.id,
          appointmentDate: '2098-08-11',
          timeSlot: '10:00',
          penjamin: 'umum',
          poli: 'reguler',
          status: 'BOOKED',
        },
      });

      // 2. Admin mengubah status menjadi NO_SHOW
      const req = new NextRequest(`http://localhost:3000/api/admin/appointments/${apt.id}`, {
        method: 'PATCH',
        headers: adminSessionHeader,
        body: JSON.stringify({ status: 'NO_SHOW' }),
      });
      const res = await adminAppointmentPatchHandler(req, {
        params: Promise.resolve({ id: apt.id }),
      });
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.appointment.status).toBe('NO_SHOW');

      const audit = await prisma.auditLog.findFirst({
        where: {
          appointmentId: apt.id,
          action: 'APPOINTMENT_STATUS_CHANGED',
        },
      });
      expect(audit).toBeDefined();
      expect(audit?.statusBefore).toBe('BOOKED');
      expect(audit?.statusAfter).toBe('NO_SHOW');
    });

    it('menolak transisi tidak valid: CANCELLED -> COMPLETED menghasilkan 409 Conflict', async () => {
      // 1. Janji berstatus CANCELLED
      const apt = await prisma.appointment.create({
        data: {
          appointmentNumber: `APT-ADM-CANC-${Date.now()}`,
          patientId: patientUser.id,
          doctorId: testDoctor.id,
          appointmentDate: '2098-08-12',
          timeSlot: '11:00',
          penjamin: 'asuransi',
          poli: 'eksekutif',
          status: 'CANCELLED',
        },
      });

      // 2. Admin mencoba mengubah CANCELLED -> COMPLETED
      const req = new NextRequest(`http://localhost:3000/api/admin/appointments/${apt.id}`, {
        method: 'PATCH',
        headers: adminSessionHeader,
        body: JSON.stringify({ status: 'COMPLETED' }),
      });
      const res = await adminAppointmentPatchHandler(req, {
        params: Promise.resolve({ id: apt.id }),
      });
      expect(res.status).toBe(409);

      const json = await res.json();
      expect(json.error).toContain('CANCELLED');
    });

    it('menolak transisi tidak valid: COMPLETED -> NO_SHOW menghasilkan 409 Conflict', async () => {
      const apt = await prisma.appointment.create({
        data: {
          appointmentNumber: `APT-ADM-TERM-${Date.now()}`,
          patientId: patientUser.id,
          doctorId: testDoctor.id,
          appointmentDate: '2098-08-13',
          timeSlot: '13:00',
          penjamin: 'umum',
          poli: 'reguler',
          status: 'COMPLETED',
        },
      });

      const req = new NextRequest(`http://localhost:3000/api/admin/appointments/${apt.id}`, {
        method: 'PATCH',
        headers: adminSessionHeader,
        body: JSON.stringify({ status: 'NO_SHOW' }),
      });
      const res = await adminAppointmentPatchHandler(req, {
        params: Promise.resolve({ id: apt.id }),
      });
      expect(res.status).toBe(409);
    });

    it('menolak nilai status yang tidak diizinkan (422 Unprocessable Entity)', async () => {
      const apt = await prisma.appointment.create({
        data: {
          appointmentNumber: `APT-ADM-INV-${Date.now()}`,
          patientId: patientUser.id,
          doctorId: testDoctor.id,
          appointmentDate: '2099-08-14',
          timeSlot: '14:00',
          penjamin: 'bpjs',
          poli: 'reguler',
          status: 'BOOKED',
        },
      });

      const req = new NextRequest(`http://localhost:3000/api/admin/appointments/${apt.id}`, {
        method: 'PATCH',
        headers: adminSessionHeader,
        body: JSON.stringify({ status: 'STATUS_SEMUA_SALAH' }),
      });
      const res = await adminAppointmentPatchHandler(req, {
        params: Promise.resolve({ id: apt.id }),
      });
      expect(res.status).toBe(422);
    });
  });

  // ===========================================================================
  // US-8 & S9: KETERSEDIAAN BED & REFLEKSI RUNTIME
  // ===========================================================================
  describe('US-8 & S9 · Pembaruan Status Bed oleh Admin & Akses Publik', () => {
    it('admin berhasil mengubah status ketersediaan bed (200 OK + Audit BED_STATUS_CHANGED)', async () => {
      const req = new NextRequest('http://localhost:3000/api/admin/bed-status', {
        method: 'PUT',
        headers: adminSessionHeader,
        body: JSON.stringify({
          unit: 'ICU',
          status: 'terbatas',
          note: 'Tersisa 1 bed dengan ventilator terpasang',
        }),
      });

      const res = await adminBedPutHandler(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.bed.status).toBe('terbatas');

      // Verifikasi audit log BED_STATUS_CHANGED
      const audit = await prisma.auditLog.findFirst({
        where: {
          resource: 'bed-status/ICU',
          action: 'BED_STATUS_CHANGED',
        },
        orderBy: { timestamp: 'desc' },
      });
      expect(audit).toBeDefined();
      expect(audit?.actorId).toBe(adminUser.id);
      expect(audit?.statusAfter).toBe('terbatas');
    });

    it('sesi PATIENT ditolak saat mencoba mengubah status bed (403 Forbidden)', async () => {
      const req = new NextRequest('http://localhost:3000/api/admin/bed-status', {
        method: 'PUT',
        headers: patientSessionHeader,
        body: JSON.stringify({
          unit: 'ICU',
          status: 'penuh',
        }),
      });

      const res = await adminBedPutHandler(req);
      expect(res.status).toBe(403);
    });

    it('endpoint publik GET /api/bed-status mencerminkan status bed terbaru secara runtime (200 OK)', async () => {
      const res = await publicBedGetHandler();
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(Array.isArray(json.beds)).toBe(true);

      const icu = json.beds.find((b: { unit: string }) => b.unit === 'ICU');
      expect(icu).toBeDefined();
      expect(icu.status).toBe('terbatas');
    });
  });

  // ===========================================================================
  // US-7 & S8: JEJAK AUDIT SISTEM & NOL PII
  // ===========================================================================
  describe('US-7 & S8 · Jejak Audit Log & Privasi Ketat PRD §5', () => {
    it('admin dapat mengambil jejak audit log (200 OK)', async () => {
      const req = new NextRequest('http://localhost:3000/api/admin/audit-logs', {
        headers: adminSessionHeader,
      });

      const res = await adminAuditLogsGetHandler(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(Array.isArray(json.logs)).toBe(true);
      expect(json.logs.length).toBeGreaterThan(0);
    });

    it('sesi PATIENT ditolak mengambil jejak audit log (403 Forbidden)', async () => {
      const req = new NextRequest('http://localhost:3000/api/admin/audit-logs', {
        headers: patientSessionHeader,
      });

      const res = await adminAuditLogsGetHandler(req);
      expect(res.status).toBe(403);
    });

    it('seluruh audit log sistem tidak memuat data pribadi atau identifier jaringan (PRD §5)', async () => {
      const logs = await prisma.auditLog.findMany();
      for (const log of logs) {
        if (log.details) {
          const lower = log.details.toLowerCase();
          expect(lower).not.toContain('ipaddress');
          expect(lower).not.toContain('useragent');
          expect(lower).not.toContain('password');
          expect(lower).not.toContain('@rsi-surabaya.test');
        }
      }
    });
  });
});
