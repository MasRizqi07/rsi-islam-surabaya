import { describe, it, expect } from 'vitest';
import { prisma } from '@/lib/db';
import { getDoctorsFromDb, getSpecialtiesFromDb, getServicesFromDb, getTowerFloorsFromDb } from '@/lib/db-queries';

describe('Phase 7 Acceptance & DB Integrity Tests (US-1, US-2, S1, S2)', () => {
  it('US-1 · Database memuat tepat 24 dokter fiktif dengan isFictional=true', async () => {
    const doctors = await prisma.doctor.findMany();
    expect(doctors).toHaveLength(24);
    doctors.forEach((d) => {
      expect(d.isFictional).toBe(true);
      expect(d.penjamin.length).toBeGreaterThan(0);
      expect(d.poli.length).toBeGreaterThan(0);
    });
  });

  it('US-1 · Database memuat tepat 17 spesialisasi dokter aktif', async () => {
    const specialties = await prisma.specialty.findMany();
    expect(specialties).toHaveLength(17);
  });

  it('US-1 · Database memuat tepat 20 poliklinik rawat jalan terverifikasi', async () => {
    const polyclinics = await prisma.polyclinic.findMany();
    expect(polyclinics).toHaveLength(20);
  });

  it('US-1 · Database memuat tepat 8 layanan medis terpadu', async () => {
    const services = await prisma.service.findMany();
    expect(services).toHaveLength(8);
  });

  it('US-1 · Tower memiliki 13 lantai dengan data hanya di Lt. 2, 3, 4, 7', async () => {
    const towerFloors = await prisma.towerFloor.findMany({
      where: { buildingId: 'tower' },
      orderBy: { floor: 'asc' },
    });
    expect(towerFloors).toHaveLength(13);

    const knownFloors = towerFloors.filter((f) => f.known);
    expect(knownFloors).toHaveLength(4);
    const knownFloorNumbers = knownFloors.map((f) => f.floor).sort((a, b) => a - b);
    expect(knownFloorNumbers).toEqual([2, 3, 4, 7]);
  });

  it('S2 · getDoctorsFromDb() membaca 24 dokter dari database lengkap dengan jadwal', async () => {
    const doctors = await getDoctorsFromDb();
    expect(doctors).toHaveLength(24);
    doctors.forEach((doc) => {
      expect(doc.schedule.length).toBeGreaterThan(0);
      expect(doc.isFictional).toBe(true);
    });
  });

  it('S2 · getSpecialtiesFromDb() membaca spesialisasi dari database', async () => {
    const specialties = await getSpecialtiesFromDb();
    expect(specialties).toHaveLength(17);
  });

  it('S2 · getServicesFromDb() membaca 8 layanan dari database', async () => {
    const services = await getServicesFromDb();
    expect(services).toHaveLength(8);
  });

  it('S2 · getTowerFloorsFromDb() membaca 13 lantai tower dari database', async () => {
    const floors = await getTowerFloorsFromDb();
    expect(floors).toHaveLength(13);
  });

  it('US-2 · Akun demo (PATIENT & ADMIN) tersimpan dengan hash kata sandi bcrypt, tidak plaintext', async () => {
    const users = await prisma.user.findMany({
      where: {
        email: {
          in: ['pasien.demo@rsi-surabaya.test', 'admin.demo@rsi-surabaya.test'],
        },
      },
    });

    expect(users).toHaveLength(2);
    const patient = users.find((u) => u.role === 'PATIENT');
    const admin = users.find((u) => u.role === 'ADMIN');

    expect(patient).toBeDefined();
    expect(admin).toBeDefined();

    // Verifikasi hash bcrypt ($2a$ atau $2b$)
    expect(patient?.passwordHash).toMatch(/^\$2[ab]\$\d{2}\$/);
    expect(admin?.passwordHash).toMatch(/^\$2[ab]\$\d{2}\$/);

    // Pastikan tidak plaintext
    expect(patient?.passwordHash).not.toContain('PasswordDemo123!');
    expect(admin?.passwordHash).not.toContain('AdminSecure123!');
  });

  it('US-4 Constraint · Partial unique index unique_active_doctor_slot terpasang di PostgreSQL', async () => {
    const result = await prisma.$queryRaw<Array<{ indexname: string }>>`
      SELECT indexname FROM pg_indexes 
      WHERE tablename = 'Appointment' AND indexname = 'unique_active_doctor_slot';
    `;
    expect(result).toHaveLength(1);
    expect(result[0].indexname).toBe('unique_active_doctor_slot');
  });
});
