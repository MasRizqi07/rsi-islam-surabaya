import { DOCTORS } from '@/data/doctors';
import { SPECIALTIES } from '@/data/specialties';
import { SERVICES } from '@/data/services';
import { TOWER_FLOORS, GRAHA_FLOORS } from '@/data/buildings';
import { Doctor, Hari, Penjamin, PoliCategory, Service, FloorInfo } from '@/data/types';

export interface DoctorFilterParams {
  searchQuery?: string;
  specialtyId?: string;
  hari?: Hari;
  penjamin?: Penjamin;
  poli?: PoliCategory;
}

/**
 * Filter direktori dokter berdasarkan multi-dimensi kriteria pencarian
 */
export function filterDoctors(params: DoctorFilterParams): Doctor[] {
  return DOCTORS.filter((doctor) => {
    // 1. Pencarian teks nama atau subspesialisasi
    if (params.searchQuery && params.searchQuery.trim() !== '') {
      const q = params.searchQuery.toLowerCase().trim();
      const matchName = doctor.name.toLowerCase().includes(q);
      const matchTitle = doctor.title.toLowerCase().includes(q);
      const matchSub = doctor.subSpecialty?.toLowerCase().includes(q) ?? false;
      if (!matchName && !matchTitle && !matchSub) return false;
    }

    // 2. Filter spesialisasi
    if (params.specialtyId && params.specialtyId !== 'all') {
      if (doctor.specialtyId !== params.specialtyId) return false;
    }

    // 3. Filter hari praktik
    if (params.hari && params.hari !== ('all' as Hari)) {
      const hasDay = doctor.schedule.some((s) => s.hari === params.hari);
      if (!hasDay) return false;
    }

    // 4. Filter penjamin
    if (params.penjamin && params.penjamin !== ('all' as Penjamin)) {
      if (!doctor.penjamin.includes(params.penjamin)) return false;
    }

    // 5. Filter kategori poliklinik (reguler / eksekutif)
    if (params.poli && params.poli !== ('all' as PoliCategory)) {
      if (!doctor.poli.includes(params.poli)) return false;
    }

    return true;
  });
}

/**
 * Mendapatkan dokter berdasarkan slug unik
 */
export function getDoctorBySlug(slug: string): Doctor | undefined {
  return DOCTORS.find((d) => d.slug === slug);
}

/**
 * Mendapatkan spesialisasi berdasarkan ID
 */
export function getSpecialtyById(id: string) {
  return SPECIALTIES.find((s) => s.id === id);
}

/**
 * Mendapatkan layanan berdasarkan slug
 */
export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

/**
 * Mendapatkan daftar layanan pada lantai tertentu
 */
export function getServicesForFloor(buildingId: 'tower' | 'graha', floorNumber: number): Service[] {
  const floors = buildingId === 'tower' ? TOWER_FLOORS : GRAHA_FLOORS;
  const targetFloor = floors.find((f) => f.floor === floorNumber);
  if (!targetFloor || !targetFloor.known) return [];

  return targetFloor.serviceSlugs
    .map((slug) => SERVICES.find((s) => s.slug === slug))
    .filter((s): s is Service => s !== undefined);
}

/**
 * Mendapatkan informasi denah lantai
 */
export function getFloorInfo(buildingId: 'tower' | 'graha', floorNumber: number): FloorInfo | undefined {
  const floors = buildingId === 'tower' ? TOWER_FLOORS : GRAHA_FLOORS;
  return floors.find((f) => f.floor === floorNumber);
}
