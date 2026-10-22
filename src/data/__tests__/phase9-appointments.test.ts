import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { resetRateLimitStore } from '@/lib/rate-limit';
import { GET as aptListGetHandler, POST as aptCreatePostHandler } from '@/app/api/patient/appointments/route';
import { DELETE as aptCancelDeleteHandler } from '@/app/api/patient/appointments/[id]/route';
import { NextRequest } from 'next/server';

describe('Phase 9 Appointment Workflows, Concurrency & Idempotency (US-4, US-5, US-7)', () => {
  let patientSessionHeader: Headers;
  let otherPatientSessionHeader: Headers;

  let patientUser: { id: string; email: string };
  let otherPatientUser: { id: string; email: string };
  let testDoctor: { id: string; name: string };

  beforeAll(async () => {
    // 1. Ambil fixture dokter dari database
    const doc = await prisma.doctor.findFirst();
    if (!doc) throw new Error('Fixture dokter belum tersedia di database!');
    testDoctor = { id: doc.id, name: doc.name };

    // 2. Ambil akun pasien utama & admin demo
    const p1 = await prisma.user.findUnique({
      where: { email: 'pasien.demo@rsi-surabaya.test' },
    });
    const adm = await prisma.user.findUnique({
      where: { email: 'admin.demo@rsi-surabaya.test' },
    });
    if (!p1 || !adm) throw new Error('Akun demo belum di-seed!');
    patientUser = { id: p1.id, email: p1.email };

    // 3. Ambil/buat akun pasien kedua untuk uji kepemilikan dan konkurensi
    const bcrypt = (await import('bcryptjs')).default;
    const pwdHash = await bcrypt.hash('PasswordDemo123!', 10);
    const p2 = await prisma.user.upsert({
      where: { email: 'pasien2.demo@rsi-surabaya.test' },
      update: { passwordHash: pwdHash },
      create: {
        email: 'pasien2.demo@rsi-surabaya.test',
        name: 'Pasien Demo Kedua',
        passwordHash: pwdHash,
        role: 'PATIENT',
      },
    });
    otherPatientUser = { id: p2.id, email: p2.email };

    await prisma.account.upsert({
      where: { id: `acc-${p2.id}` },
      update: { password: pwdHash },
      create: {
        id: `acc-${p2.id}`,
        accountId: p2.id,
        providerId: 'credential',
        userId: p2.id,
        password: pwdHash,
      },
    });

    // 4. Buat sesi Better Auth untuk ketiga pengguna
    const p1Res = await auth.api.signInEmail({
      body: { email: 'pasien.demo@rsi-surabaya.test', password: 'PasswordDemo123!' },
      asResponse: true,
    });
    const p1Cookie = p1Res.headers.get('set-cookie')?.split(';')[0] || '';
    patientSessionHeader = new Headers({ cookie: p1Cookie, 'Content-Type': 'application/json' });

    const p2Res = await auth.api.signInEmail({
      body: { email: 'pasien2.demo@rsi-surabaya.test', password: 'PasswordDemo123!' },
      asResponse: true,
    });
    const p2Cookie = p2Res.headers.get('set-cookie')?.split(';')[0] || '';
    otherPatientSessionHeader = new Headers({ cookie: p2Cookie, 'Content-Type': 'application/json' });



    // 5. Bersihkan data janji uji tahun 2099 sebelum mulai agar idempoten
    await prisma.auditLog.deleteMany({
      where: { appointment: { appointmentDate: { startsWith: '2099-' } } },
    });
    await prisma.appointment.deleteMany({
      where: { appointmentDate: { startsWith: '2099-' } },
    });
  });

  beforeEach(() => {
    resetRateLimitStore();
  });

  afterAll(async () => {
    // Bersihkan kembali setelah pengujian selesai
    await prisma.auditLog.deleteMany({
      where: { appointment: { appointmentDate: { startsWith: '2099-' } } },
    });
    await prisma.appointment.deleteMany({
      where: { appointmentDate: { startsWith: '2099-' } },
    });
    await prisma.$disconnect();
  });

  // ===========================================================================
  // US-4: PEMBUATAN JANJI TEMU (S5) & ATRIBUT VALIDASI
  // ===========================================================================
  describe('US-4 · Pembuatan Janji Temu & Validasi Input', () => {
    it('berhasil membuat janji baru pada slot kosong (201 Created + Audit APPOINTMENT_CREATED)', async () => {
      const slotDate = '2099-05-15';
      const slotTime = '08:30';

      const req = new NextRequest('http://localhost:3000/api/patient/appointments', {
        method: 'POST',
        headers: patientSessionHeader,
        body: JSON.stringify({
          doctorId: testDoctor.id,
          appointmentDate: slotDate,
          timeSlot: slotTime,
          penjamin: 'bpjs',
          poli: 'reguler',
        }),
      });

      const res = await aptCreatePostHandler(req);
      expect(res.status).toBe(201);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.appointment.status).toBe('BOOKED');
      expect(json.appointment.patientId).toBe(patientUser.id);
      expect(json.appointment.appointmentNumber).toBeDefined();

      // Verifikasi audit log tercatat dalam transaksi atomik
      const audit = await prisma.auditLog.findFirst({
        where: {
          appointmentId: json.appointment.id,
          action: 'APPOINTMENT_CREATED',
        },
      });
      expect(audit).toBeDefined();
      expect(audit?.actorId).toBe(patientUser.id);
      expect(audit?.statusAfter).toBe('BOOKED');
    });

    it('menolak pembuatan janji dengan tanggal di masa lalu (422 Unprocessable Entity)', async () => {
      const req = new NextRequest('http://localhost:3000/api/patient/appointments', {
        method: 'POST',
        headers: patientSessionHeader,
        body: JSON.stringify({
          doctorId: testDoctor.id,
          appointmentDate: '2020-01-01', // Tanggal di masa lalu
          timeSlot: '09:00',
          penjamin: 'umum',
          poli: 'reguler',
        }),
      });

      const res = await aptCreatePostHandler(req);
      expect(res.status).toBe(422);

      const json = await res.json();
      expect(json.error).toContain('masa lalu');
    });

    it('menolak pembuatan janji dengan dokter tidak valid / tidak ada (422 Unprocessable Entity)', async () => {
      const req = new NextRequest('http://localhost:3000/api/patient/appointments', {
        method: 'POST',
        headers: patientSessionHeader,
        body: JSON.stringify({
          doctorId: 'dokter-tidak-ada-999',
          appointmentDate: '2099-06-01',
          timeSlot: '09:00',
          penjamin: 'umum',
          poli: 'reguler',
        }),
      });

      const res = await aptCreatePostHandler(req);
      expect(res.status).toBe(422);

      const json = await res.json();
      expect(json.error).toContain('Dokter tidak ditemukan');
    });

    it('menolak penjamin atau tipe poli yang tidak valid (422 Unprocessable Entity)', async () => {
      const req = new NextRequest('http://localhost:3000/api/patient/appointments', {
        method: 'POST',
        headers: patientSessionHeader,
        body: JSON.stringify({
          doctorId: testDoctor.id,
          appointmentDate: '2099-06-01',
          timeSlot: '09:00',
          penjamin: 'penjamin_ilegal',
          poli: 'vip_khayalan',
        }),
      });

      const res = await aptCreatePostHandler(req);
      expect(res.status).toBe(422);
    });

    it('invarian server: mengabaikan patientId/userId lain yang diinjeksikan di body', async () => {
      const slotDate = '2099-05-16';
      const slotTime = '10:00';

      const req = new NextRequest('http://localhost:3000/api/patient/appointments', {
        method: 'POST',
        headers: patientSessionHeader, // Sesi milik patientUser
        body: JSON.stringify({
          patientId: otherPatientUser.id, // Percobaan injeksi ID lain
          userId: otherPatientUser.id,
          doctorId: testDoctor.id,
          appointmentDate: slotDate,
          timeSlot: slotTime,
          penjamin: 'asuransi',
          poli: 'eksekutif',
        }),
      });

      const res = await aptCreatePostHandler(req);
      expect(res.status).toBe(201);

      const json = await res.json();
      expect(json.appointment.patientId).toBe(patientUser.id);
      expect(json.appointment.patientId).not.toBe(otherPatientUser.id);
    });
  });

  // ===========================================================================
  // US-4: IDEMPOTENSI (IDEMPOTENCY-KEY)
  // ===========================================================================
  describe('US-4 · Idempotensi Permintaan (Idempotency-Key Header & Body)', () => {
    it('permintaan berulang dengan Idempotency-Key dan body identik memutar ulang respons (200 OK & tidak menduplikasi data)', async () => {
      const uniqueKey = `idemp-key-${Date.now()}-${Math.random()}`;
      const slotDate = '2099-05-17';
      const slotTime = '11:15';

      const payload = {
        doctorId: testDoctor.id,
        appointmentDate: slotDate,
        timeSlot: slotTime,
        penjamin: 'bpjs',
        poli: 'reguler',
      };

      // Request 1: Pembuatan pertama
      const req1Headers = new Headers(patientSessionHeader);
      req1Headers.set('Idempotency-Key', uniqueKey);
      const req1 = new NextRequest('http://localhost:3000/api/patient/appointments', {
        method: 'POST',
        headers: req1Headers,
        body: JSON.stringify(payload),
      });

      const res1 = await aptCreatePostHandler(req1);
      expect(res1.status).toBe(201);
      const json1 = await res1.json();
      const firstAptId = json1.appointment.id;

      // Request 2: Replay dengan key dan body yang sama persis
      const req2Headers = new Headers(patientSessionHeader);
      req2Headers.set('Idempotency-Key', uniqueKey);
      const req2 = new NextRequest('http://localhost:3000/api/patient/appointments', {
        method: 'POST',
        headers: req2Headers,
        body: JSON.stringify(payload),
      });

      const res2 = await aptCreatePostHandler(req2);
      expect(res2.status).toBe(200); // Replay status 200 OK
      const json2 = await res2.json();
      expect(json2.replayed).toBe(true);
      expect(json2.appointment.id).toBe(firstAptId);

      // Verifikasi di database: hanya ada tepat 1 janji dengan key ini
      const totalCreated = await prisma.appointment.count({
        where: { idempotencyKey: uniqueKey },
      });
      expect(totalCreated).toBe(1);
    });

    it('permintaan dengan Idempotency-Key sama tetapi body berbeda ditolak (409 Conflict)', async () => {
      const uniqueKey = `idemp-conflict-${Date.now()}-${Math.random()}`;
      const slotDate = '2099-05-18';

      // Request 1: Kunci pertama didaftarkan untuk slot 08:00
      const req1Headers = new Headers(patientSessionHeader);
      req1Headers.set('Idempotency-Key', uniqueKey);
      const req1 = new NextRequest('http://localhost:3000/api/patient/appointments', {
        method: 'POST',
        headers: req1Headers,
        body: JSON.stringify({
          doctorId: testDoctor.id,
          appointmentDate: slotDate,
          timeSlot: '08:00',
          penjamin: 'bpjs',
          poli: 'reguler',
        }),
      });

      const res1 = await aptCreatePostHandler(req1);
      expect(res1.status).toBe(201);

      // Request 2: Menggunakan key yang sama tetapi mengganti parameter timeSlot & penjamin
      const req2Headers = new Headers(patientSessionHeader);
      req2Headers.set('Idempotency-Key', uniqueKey);
      const req2 = new NextRequest('http://localhost:3000/api/patient/appointments', {
        method: 'POST',
        headers: req2Headers,
        body: JSON.stringify({
          doctorId: testDoctor.id,
          appointmentDate: slotDate,
          timeSlot: '09:00', // Berbeda!
          penjamin: 'umum',   // Berbeda!
          poli: 'reguler',
        }),
      });

      const res2 = await aptCreatePostHandler(req2);
      expect(res2.status).toBe(409);
      const json2 = await res2.json();
      expect(json2.error).toContain('Idempotency-Key mismatch');
    });
  });

  // ===========================================================================
  // US-4: PENEGAKAN CONSTRAINT DB & UJI KONKURENSI PARALEL
  // ===========================================================================
  describe('US-4 · Penegakan Constraint Database & Uji Konkurensi Paralel', () => {
    it('penegakan constraint database: pemesanan slot aktif yang sama menghasilkan 409 Conflict', async () => {
      const slotDate = '2099-05-19';
      const slotTime = '13:00';

      // 1. Pasien A memesan slot
      const reqA = new NextRequest('http://localhost:3000/api/patient/appointments', {
        method: 'POST',
        headers: patientSessionHeader,
        body: JSON.stringify({
          doctorId: testDoctor.id,
          appointmentDate: slotDate,
          timeSlot: slotTime,
          penjamin: 'bpjs',
          poli: 'reguler',
        }),
      });
      const resA = await aptCreatePostHandler(reqA);
      expect(resA.status).toBe(201);

      // 2. Pasien B mencoba memesan slot yang persis sama
      const reqB = new NextRequest('http://localhost:3000/api/patient/appointments', {
        method: 'POST',
        headers: otherPatientSessionHeader,
        body: JSON.stringify({
          doctorId: testDoctor.id,
          appointmentDate: slotDate,
          timeSlot: slotTime,
          penjamin: 'umum',
          poli: 'reguler',
        }),
      });
      const resB = await aptCreatePostHandler(reqB);
      expect(resB.status).toBe(409);

      const jsonB = await resB.json();
      expect(jsonB.error).toContain('telah dipesan');
    });

    it('dua permintaan paralel ke slot yang sama: tepat satu berhasil (201) dan tepat satu ditolak (409)', async () => {
      const slotDate = '2099-05-20';
      const slotTime = '14:30';

      const payloadA = {
        doctorId: testDoctor.id,
        appointmentDate: slotDate,
        timeSlot: slotTime,
        penjamin: 'bpjs',
        poli: 'reguler',
      };

      const payloadB = {
        doctorId: testDoctor.id,
        appointmentDate: slotDate,
        timeSlot: slotTime,
        penjamin: 'asuransi',
        poli: 'eksekutif',
      };

      // Jalankan kedua request secara paralel serentak menggunakan Promise.all
      const [res1, res2] = await Promise.all([
        aptCreatePostHandler(
          new NextRequest('http://localhost:3000/api/patient/appointments', {
            method: 'POST',
            headers: patientSessionHeader,
            body: JSON.stringify(payloadA),
          })
        ),
        aptCreatePostHandler(
          new NextRequest('http://localhost:3000/api/patient/appointments', {
            method: 'POST',
            headers: otherPatientSessionHeader,
            body: JSON.stringify(payloadB),
          })
        ),
      ]);

      const statuses = [res1.status, res2.status];
      // Tepat satu harus 201, tepat satu harus 409!
      expect(statuses).toContain(201);
      expect(statuses).toContain(409);

      // Verifikasi di basis data hanya ada 1 record aktif untuk slot tersebut
      const activeRecords = await prisma.appointment.count({
        where: {
          doctorId: testDoctor.id,
          appointmentDate: slotDate,
          timeSlot: slotTime,
          status: 'BOOKED',
        },
      });
      expect(activeRecords).toBe(1);
    });
  });

  // ===========================================================================
  // US-5: LIHAT, BATALKAN, & SLOT RE-BOOKING (S6)
  // ===========================================================================
  describe('US-5 · Melihat & Membatalkan Janji Temu Pasien', () => {
    it('pasien hanya melihat daftar janji temu miliknya sendiri', async () => {
      const req = new NextRequest('http://localhost:3000/api/patient/appointments', {
        headers: patientSessionHeader,
      });

      const res = await aptListGetHandler(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(Array.isArray(json.appointments)).toBe(true);

      for (const apt of json.appointments) {
        expect(apt.patientId).toBe(patientUser.id);
        expect(apt.patientId).not.toBe(otherPatientUser.id);
      }
    });

    it('pasien membatalkan janji miliknya sendiri -> status CANCELLED + slot bisa dipesan lagi', async () => {
      const slotDate = '2099-05-21';
      const slotTime = '15:00';

      // 1. Buat janji milik Pasien A
      const reqCreate = new NextRequest('http://localhost:3000/api/patient/appointments', {
        method: 'POST',
        headers: patientSessionHeader,
        body: JSON.stringify({
          doctorId: testDoctor.id,
          appointmentDate: slotDate,
          timeSlot: slotTime,
          penjamin: 'umum',
          poli: 'reguler',
        }),
      });
      const resCreate = await aptCreatePostHandler(reqCreate);
      expect(resCreate.status).toBe(201);
      const jsonCreate = await resCreate.json();
      const aptId = jsonCreate.appointment.id;

      // 2. Pasien A membatalkan janji miliknya
      const reqCancel = new NextRequest(`http://localhost:3000/api/patient/appointments/${aptId}`, {
        method: 'DELETE',
        headers: patientSessionHeader,
      });
      const resCancel = await aptCancelDeleteHandler(reqCancel, {
        params: Promise.resolve({ id: aptId }),
      });
      expect(resCancel.status).toBe(200);

      const jsonCancel = await resCancel.json();
      expect(jsonCancel.appointment.status).toBe('CANCELLED');

      // Verifikasi audit log pembatalan
      const cancelAudit = await prisma.auditLog.findFirst({
        where: {
          appointmentId: aptId,
          action: 'APPOINTMENT_CANCELLED',
        },
      });
      expect(cancelAudit).toBeDefined();
      expect(cancelAudit?.statusBefore).toBe('BOOKED');
      expect(cancelAudit?.statusAfter).toBe('CANCELLED');

      // 3. PRD US-5: Slot yang sudah dibatalkan DAPAT DIPESAN LAGI oleh pasien lain!
      const reqRebook = new NextRequest('http://localhost:3000/api/patient/appointments', {
        method: 'POST',
        headers: otherPatientSessionHeader, // Pasien B memesan slot yang telah kosong kembali
        body: JSON.stringify({
          doctorId: testDoctor.id,
          appointmentDate: slotDate,
          timeSlot: slotTime,
          penjamin: 'bpjs',
          poli: 'reguler',
        }),
      });
      const resRebook = await aptCreatePostHandler(reqRebook);
      expect(resRebook.status).toBe(201);
    });

    it('menolak pembatalan janji yang berstatus COMPLETED atau NO_SHOW (409 Conflict)', async () => {
      const slotDate = '2099-05-22';
      const slotTime = '16:00';

      // 1. Buat janji yang sudah berstatus COMPLETED
      const completedApt = await prisma.appointment.create({
        data: {
          appointmentNumber: `APT-COMP-${Date.now()}`,
          patientId: patientUser.id,
          doctorId: testDoctor.id,
          appointmentDate: slotDate,
          timeSlot: slotTime,
          penjamin: 'umum',
          poli: 'reguler',
          status: 'COMPLETED',
        },
      });

      // 2. Pasien mencoba membatalkan janji yang sudah selesai
      const req = new NextRequest(`http://localhost:3000/api/patient/appointments/${completedApt.id}`, {
        method: 'DELETE',
        headers: patientSessionHeader,
      });
      const res = await aptCancelDeleteHandler(req, {
        params: Promise.resolve({ id: completedApt.id }),
      });

      expect(res.status).toBe(409);
      const json = await res.json();
      expect(json.error).toContain('COMPLETED');
    });

    it('pelanggaran hak milik: Pasien A mencoba membatalkan janji milik Pasien B ditolak 403 Forbidden', async () => {
      const slotDate = '2099-05-23';
      const slotTime = '17:00';

      // 1. Janji milik Pasien B
      const aptB = await prisma.appointment.create({
        data: {
          appointmentNumber: `APT-B2-${Date.now()}`,
          patientId: otherPatientUser.id,
          doctorId: testDoctor.id,
          appointmentDate: slotDate,
          timeSlot: slotTime,
          penjamin: 'bpjs',
          poli: 'reguler',
          status: 'BOOKED',
        },
      });

      // 2. Pasien A mencoba menghapus janji Pasien B
      const req = new NextRequest(`http://localhost:3000/api/patient/appointments/${aptB.id}`, {
        method: 'DELETE',
        headers: patientSessionHeader, // Sesi Pasien A
      });
      const res = await aptCancelDeleteHandler(req, {
        params: Promise.resolve({ id: aptB.id }),
      });

      expect(res.status).toBe(403);

      // Verifikasi status di DB tidak terpengaruh
      const checkApt = await prisma.appointment.findUnique({
        where: { id: aptB.id },
      });
      expect(checkApt?.status).toBe('BOOKED');
    });
  });

  // ===========================================================================
  // US-7 & PRD §5: INTEGRITAS AUDIT LOG
  // ===========================================================================
  describe('US-7 & PRD §5 · Integritas Audit Transaksional & Nol Pelanggaran Privasi', () => {
    it('setiap perubahan status janji temu selalu memiliki baris audit di DB', async () => {
      const logs = await prisma.auditLog.findMany({
        where: {
          action: { in: ['APPOINTMENT_CREATED', 'APPOINTMENT_CANCELLED'] },
        },
      });

      expect(logs.length).toBeGreaterThan(0);

      for (const log of logs) {
        expect(log.actorId).toBeDefined();
        expect(log.resource).toContain('appointment/');
        expect(log.timestamp).toBeDefined();

        // Verifikasi tidak ada PII bocor di kolom details
        if (log.details) {
          const lower = log.details.toLowerCase();
          expect(lower).not.toContain('password');
          expect(lower).not.toContain('useragent');
          expect(lower).not.toContain('ipaddress');
          expect(lower).not.toContain('@');
        }
      }
    });
  });
});
