import { describe, it, expect } from 'vitest';
import { DOCTORS } from '../doctors';
import { SPECIALTIES } from '../specialties';
import { SERVICES } from '../services';
import { TOWER_FLOORS, GRAHA_FLOORS } from '../buildings';
import { HOSPITAL_FACTS } from '../facts';
import { filterDoctors, getServicesForFloor, getDoctorBySlug, getFloorInfo } from '@/lib/data-utils';

describe('Data Layer & Integrity Tests', () => {
  it('harus memuat tepat 20 poliklinik terverifikasi', () => {
    expect(SPECIALTIES).toHaveLength(20);
    const uniqueIds = new Set(SPECIALTIES.map((s) => s.id));
    expect(uniqueIds.size).toBe(20);
  });

  it('harus memuat 8 layanan unggulan terverifikasi', () => {
    expect(SERVICES).toHaveLength(8);
    const uniqueSlugs = new Set(SERVICES.map((s) => s.slug));
    expect(uniqueSlugs.size).toBe(8);
  });

  it('harus memuat 6 level gedung Graha (Ground + 5)', () => {
    expect(GRAHA_FLOORS).toHaveLength(6);
  });

  it('harus memuat minimal 24 dokter fiktif dengan isFictional: true', () => {
    expect(DOCTORS.length).toBeGreaterThanOrEqual(24);
    DOCTORS.forEach((doc) => {
      expect(doc.isFictional).toBe(true);
      expect(doc.schedule.length).toBeGreaterThan(0);
      expect(doc.penjamin.length).toBeGreaterThan(0);
    });
  });

  it('dokter fiktif harus mencakup minimal 14 spesialisasi berbeda', () => {
    const specialtySet = new Set(DOCTORS.map((d) => d.specialtyId));
    expect(specialtySet.size).toBeGreaterThanOrEqual(14);
  });

  it('mematuhi Register Konflik K1 (dua nomor darurat)', () => {
    expect(HOSPITAL_FACTS.emergency.callCenterNumber).toBe('1500718');
    expect(HOSPITAL_FACTS.emergency.ambulanceNumber).toBe('08 112 33 999');
    expect(HOSPITAL_FACTS.emergency.callCenterLabel).toBe('Emergency Call');
    expect(HOSPITAL_FACTS.emergency.ambulanceLabel).toBe('Ambulans');
  });

  it('mematuhi Register Konflik K3 (akreditasi historis tanpa klaim aktif/kadaluwarsa)', () => {
    expect(HOSPITAL_FACTS.accreditationHistory).toBe('Akreditasi Paripurna 2016 · 2019 · 2022');
    expect(HOSPITAL_FACTS.accreditationHistory).not.toContain('sampai');
    expect(HOSPITAL_FACTS.accreditationHistory).not.toContain('saat ini');
  });

  it('mematuhi Register Konflik K4 (pembatasan denah lantai Tower)', () => {
    expect(TOWER_FLOORS).toHaveLength(13);
    const unknownFloors = [1, 5, 6, 8, 9, 10, 11, 12, 13];
    unknownFloors.forEach((fNum) => {
      const floor = TOWER_FLOORS.find((f) => f.floor === fNum);
      expect(floor?.known).toBe(false);
      expect(floor?.serviceSlugs).toEqual([]);
      expect(floor?.description).toContain('belum tersedia');
    });

    const knownFloors = [2, 3, 4, 7];
    knownFloors.forEach((fNum) => {
      const floor = TOWER_FLOORS.find((f) => f.floor === fNum);
      expect(floor?.known).toBe(true);
      expect(floor?.serviceSlugs.length).toBeGreaterThan(0);
    });
  });

  it('mematuhi Register Konflik K7 (hanya @rsisurabaya, bukan @rsiayani)', () => {
    expect(HOSPITAL_FACTS.social.instagram.handle).toBe('@rsisurabaya');
    expect(HOSPITAL_FACTS.social.instagram.url).not.toContain('rsiayani');
  });
});

describe('Doctor Filtering Logic (src/lib/data-utils.ts)', () => {
  it('dapat memfilter dokter berdasarkan spesialisasi', () => {
    const internalDocs = filterDoctors({ specialtyId: 'penyakit-dalam' });
    expect(internalDocs.length).toBeGreaterThan(0);
    internalDocs.forEach((d) => expect(d.specialtyId).toBe('penyakit-dalam'));
  });

  it('dapat memfilter dokter berdasarkan hari praktik', () => {
    const mondayDocs = filterDoctors({ hari: 'senin' });
    expect(mondayDocs.length).toBeGreaterThan(0);
    mondayDocs.forEach((d) => {
      const hasMonday = d.schedule.some((s) => s.hari === 'senin');
      expect(hasMonday).toBe(true);
    });
  });

  it('dapat memfilter dokter berdasarkan penjamin BPJS', () => {
    const bpjsDocs = filterDoctors({ penjamin: 'bpjs' });
    expect(bpjsDocs.length).toBeGreaterThan(0);
    bpjsDocs.forEach((d) => {
      expect(d.penjamin).toContain('bpjs');
    });
  });

  it('dapat mencari dokter berdasarkan teks nama', () => {
    const searchResults = filterDoctors({ searchQuery: 'fauzi' });
    expect(searchResults.length).toBeGreaterThan(0);
    expect(searchResults[0].name.toLowerCase()).toContain('fauzi');
  });

  it('dapat mengambil dokter berdasarkan slug unik', () => {
    const doc = getDoctorBySlug('dr-fauzi-rachman-sppd');
    expect(doc).toBeDefined();
    expect(doc?.name).toBe('dr. Fauzi Rachman');
  });

  it('mengembalikan array kosong jika kriteria tidak cocok', () => {
    const emptyResults = filterDoctors({ searchQuery: 'nama_tidak_ada_xyz_999' });
    expect(emptyResults).toHaveLength(0);
  });
});

describe('Building Floor Services Lookup (src/lib/data-utils.ts)', () => {
  it('mengembalikan layanan pada Tower Lantai 2 (IGD & Bedah)', () => {
    const services = getServicesForFloor('tower', 2);
    expect(services.length).toBe(2);
    const slugs = services.map((s) => s.slug);
    expect(slugs).toContain('igd');
    expect(slugs).toContain('kamar-operasi');
  });

  it('mengembalikan layanan pada Tower Lantai 4 (Perawatan Intensif)', () => {
    const services = getServicesForFloor('tower', 4);
    expect(services.length).toBe(1);
    expect(services[0].slug).toBe('perawatan-intensif');
  });

  it('mengembalikan array kosong untuk Tower Lantai 13 (Informasi belum tersedia / K4)', () => {
    const services = getServicesForFloor('tower', 13);
    expect(services).toEqual([]);
    const floor = getFloorInfo('tower', 13);
    expect(floor?.known).toBe(false);
  });

  it('mengembalikan layanan pada Graha Lantai 1 (Hemodialisis)', () => {
    const services = getServicesForFloor('graha', 1);
    expect(services.length).toBe(1);
    expect(services[0].slug).toBe('hemodialisis');
  });
});
