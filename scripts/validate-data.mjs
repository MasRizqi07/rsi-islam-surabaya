import { writeFileSync, mkdirSync } from 'node:fs';
import { SPECIALTIES } from '../src/data/specialties';
import { DOCTORS } from '../src/data/doctors';
import { SERVICES } from '../src/data/services';
import { ALL_FLOORS, TOWER_FLOORS, GRAHA_FLOORS } from '../src/data/buildings';
import { BED_STATUS_ITEMS } from '../src/data/bed-status';
import {
  SpecialtySchema,
  DoctorSchema,
  ServiceSchema,
  FloorInfoSchema,
  BedStatusItemSchema
} from '../src/data/schema';

console.log('=== DATA INTEGRITY & ZOD SCHEMA VALIDATION ===\n');

let errorCount = 0;
const errors = [];

function check(assertion, message) {
  if (!assertion) {
    console.error(`[FAIL] ${message}`);
    errors.push(message);
    errorCount++;
  } else {
    console.log(`[PASS] ${message}`);
  }
}

// 1. VALIDASI SKEMA SPESIALISASI
console.log('--- 1. Validasi 20 Poliklinik Spesialis ---');
check(SPECIALTIES.length === 20, `Jumlah poliklinik tepat 20 (Ditemukan: ${SPECIALTIES.length})`);

const specialtyIds = new Set();
for (const s of SPECIALTIES) {
  const result = SpecialtySchema.safeParse(s);
  if (!result.success) {
    check(false, `Spesialisasi ${s.id} gagal validasi Zod: ${JSON.stringify(result.error.issues)}`);
  }
  if (specialtyIds.has(s.id)) {
    check(false, `ID Spesialisasi duplikat: ${s.id}`);
  }
  specialtyIds.add(s.id);
}
check(specialtyIds.size === SPECIALTIES.length, `Seluruh ${specialtyIds.size} ID poliklinik unik.`);

// 2. VALIDASI SKEMA DOKTER FIKTIF
console.log('\n--- 2. Validasi Fixture Dokter Fiktif (Lampiran D) ---');
check(DOCTORS.length >= 24, `Minimal 24 dokter fiktif (Ditemukan: ${DOCTORS.length})`);

const doctorSlugs = new Set();
const doctorSpecialties = new Set();

for (const d of DOCTORS) {
  const result = DoctorSchema.safeParse(d);
  if (!result.success) {
    check(false, `Dokter ${d.slug} gagal validasi Zod: ${JSON.stringify(result.error.issues)}`);
  }

  // Wajib isFictional === true
  if (d.isFictional !== true) {
    check(false, `Dokter ${d.slug} wajib memiliki isFictional: true`);
  }

  // Cek duplikasi slug
  if (doctorSlugs.has(d.slug)) {
    check(false, `Slug dokter duplikat: ${d.slug}`);
  }
  doctorSlugs.add(d.slug);

  // Cek relasi ke specialty
  if (!specialtyIds.has(d.specialtyId)) {
    check(false, `Dokter ${d.slug} memiliki specialtyId tidak terdaftar: ${d.specialtyId}`);
  }
  doctorSpecialties.add(d.specialtyId);

  // Cek jadwal konsisten
  if (!d.schedule || d.schedule.length === 0) {
    check(false, `Dokter ${d.slug} tidak memiliki jadwal praktik`);
  }

  // Aturan Eksekutif tidak melayani BPJS
  const hasEksekutif = d.poli.includes('eksekutif');
  if (hasEksekutif) {
    d.schedule.forEach(s => {
      if (s.poli === 'eksekutif' && d.penjamin.includes('bpjs') && d.penjamin.length === 1) {
        check(false, `Dokter eksekutif ${d.slug} hanya memiliki penjamin BPJS (Eksekutif dilarang BPJS)`);
      }
    });
  }
}

check(doctorSpecialties.size >= 14, `Mencakup >= 14 spesialisasi berbeda (Ditemukan: ${doctorSpecialties.size})`);

// 3. VALIDASI SKEMA LAYANAN & PENUNJANG
console.log('\n--- 3. Validasi 8 Layanan Unggulan Terverifikasi ---');
check(SERVICES.length >= 8, `Minimal 8 layanan unggulan (Ditemukan: ${SERVICES.length})`);

const serviceSlugs = new Set();
for (const s of SERVICES) {
  const result = ServiceSchema.safeParse(s);
  if (!result.success) {
    check(false, `Layanan ${s.slug} gagal validasi Zod: ${JSON.stringify(result.error.issues)}`);
  }
  if (serviceSlugs.has(s.slug)) {
    check(false, `Slug layanan duplikat: ${s.slug}`);
  }
  serviceSlugs.add(s.slug);
}

// 4. VALIDASI GEDUNG & REGISTER KONFLIK K4
console.log('\n--- 4. Validasi Denah Gedung & Aturan Lantai K4 ---');
check(TOWER_FLOORS.length === 13, `Gedung Tower tepat 13 lantai (Ditemukan: ${TOWER_FLOORS.length})`);
check(GRAHA_FLOORS.length === 6, `Gedung Graha tepat 6 level (Ground + 5) (Ditemukan: ${GRAHA_FLOORS.length})`);

for (const floor of ALL_FLOORS) {
  const result = FloorInfoSchema.safeParse(floor);
  if (!result.success) {
    check(false, `Lantai ${floor.buildingId}-${floor.floor} gagal validasi Zod: ${JSON.stringify(result.error.issues)}`);
  }

  // K4: Lantai tanpa data resmi wajib known: false
  if (floor.buildingId === 'tower') {
    const isDataAvailable = [2, 3, 4, 7].includes(floor.floor);
    if (!isDataAvailable && floor.known !== false) {
      check(false, `K4 Pelanggaran: Tower Lt. ${floor.floor} tidak memiliki data resmi, wajib known: false!`);
    }
  }

  // Cek relasi serviceSlugs
  for (const sSlug of floor.serviceSlugs) {
    if (!serviceSlugs.has(sSlug)) {
      check(false, `Lantai ${floor.buildingId}-${floor.floor} menautkan layanan tidak dikenal: ${sSlug}`);
    }
  }
}

// 5. VALIDASI KETERSEDIAAN KAMAR (BED STATUS)
console.log('\n--- 5. Validasi Status Kamar (BedStatus) ---');
check(BED_STATUS_ITEMS.length >= 5, `Komponen BedStatus memuat minimal 5 unit`);
for (const b of BED_STATUS_ITEMS) {
  const result = BedStatusItemSchema.safeParse(b);
  if (!result.success) {
    check(false, `Unit ${b.unit} gagal validasi Zod: ${JSON.stringify(result.error.issues)}`);
  }
}

// RINGKASAN
mkdirSync('docs/evidence', { recursive: true });
const report = {
  timestamp: new Date().toISOString(),
  totalErrors: errorCount,
  errors,
  stats: {
    specialties: SPECIALTIES.length,
    doctors: DOCTORS.length,
    specialtiesCoveredByDoctors: doctorSpecialties.size,
    services: SERVICES.length,
    towerFloors: TOWER_FLOORS.length,
    grahaFloors: GRAHA_FLOORS.length,
    bedStatusUnits: BED_STATUS_ITEMS.length,
  },
  status: errorCount === 0 ? 'ALL_PASSED' : 'FAILED',
};

writeFileSync('docs/evidence/data-validation-results.json', JSON.stringify(report, null, 2), 'utf8');

if (errorCount > 0) {
  console.error(`\n[FATAL] Terdapat ${errorCount} kesalahan validasi data!`);
  process.exit(1);
} else {
  console.log(`\n[SUCCESS] 100% data fixture lolos skema Zod dan referential integrity!`);
}
