import { prisma } from './db';
import { Doctor, Specialty, Service, FloorInfo, Hari, Penjamin, PoliCategory } from '@/data/types';
import { DOCTORS as FALLBACK_DOCTORS } from '@/data/doctors';
import { SPECIALTIES as FALLBACK_SPECIALTIES } from '@/data/specialties';
import { SERVICES as FALLBACK_SERVICES } from '@/data/services';
import { TOWER_FLOORS } from '@/data/buildings';

/**
 * Mengambil direktori dokter lengkap beserta jadwal mingguan dari PostgreSQL via Prisma.
 * Memenuhi spesifikasi S2 & US-1 PRD v3.0 (runtime DB read).
 */
export async function getDoctorsFromDb(): Promise<Doctor[]> {
  try {
    const records = await prisma.doctor.findMany({
      include: {
        schedules: {
          orderBy: { mulai: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });

    if (!records || records.length === 0) {
      return FALLBACK_DOCTORS;
    }

    return records.map((r) => ({
      slug: r.slug,
      name: r.name,
      title: r.title,
      specialtyId: r.specialtyId,
      subSpecialty: r.subSpecialty ?? undefined,
      penjamin: r.penjamin as Penjamin[],
      poli: r.poli as PoliCategory[],
      bio: r.bio,
      isFictional: true as const,
      schedule: r.schedules.map((s) => ({
        hari: s.hari as Hari,
        mulai: s.mulai,
        selesai: s.selesai,
        poli: s.poli as PoliCategory,
      })),
    }));
  } catch (error) {
    console.warn('[DB] Gagal membaca dokter dari database, menggunakan fallback fixture:', error);
    return FALLBACK_DOCTORS;
  }
}

/**
 * Mengambil daftar spesialisasi klinis dari DB.
 */
export async function getSpecialtiesFromDb(): Promise<Specialty[]> {
  try {
    const records = await prisma.specialty.findMany({
      orderBy: { name: 'asc' },
    });

    if (!records || records.length === 0) {
      return FALLBACK_SPECIALTIES;
    }

    return records.map((s) => ({
      id: s.id,
      name: s.name,
      group: s.group as 'dasar' | 'spesialistik' | 'penunjang',
      summary: s.summary,
      iconName: s.iconName,
    }));
  } catch (error) {
    console.warn('[DB] Gagal membaca spesialisasi dari database:', error);
    return FALLBACK_SPECIALTIES;
  }
}

/**
 * Mengambil 8 layanan medis terpadu dari DB.
 */
export async function getServicesFromDb(): Promise<Service[]> {
  try {
    const records = await prisma.service.findMany({
      orderBy: { name: 'asc' },
    });

    if (!records || records.length === 0) {
      return FALLBACK_SERVICES;
    }

    return records.map((s) => ({
      slug: s.slug,
      name: s.name,
      summary: s.summary,
      description: s.description,
      buildingId: s.buildingId as 'tower' | 'graha',
      floor: s.floor,
      open24h: s.open24h,
      highlight: s.highlight,
      sourceNote: s.sourceNote,
    }));
  } catch (error) {
    console.warn('[DB] Gagal membaca layanan dari database:', error);
    return FALLBACK_SERVICES;
  }
}

/**
 * Mengambil informasi lantai gedung dari DB.
 */
export async function getTowerFloorsFromDb(): Promise<FloorInfo[]> {
  try {
    const records = await prisma.towerFloor.findMany({
      where: { buildingId: 'tower' },
      orderBy: { floor: 'desc' },
    });

    if (!records || records.length === 0) {
      return TOWER_FLOORS;
    }

    return records.map((r) => ({
      buildingId: 'tower',
      floor: r.floor,
      label: r.label,
      serviceSlugs: r.serviceSlugs,
      known: r.known,
      description: r.description ?? undefined,
    }));
  } catch (error) {
    console.warn('[DB] Gagal membaca lantai tower dari database:', error);
    return TOWER_FLOORS;
  }
}
