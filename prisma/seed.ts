import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { DOCTORS } from '../src/data/doctors';
import { SPECIALTIES } from '../src/data/specialties';
import { SERVICES } from '../src/data/services';
import { TOWER_FLOORS, GRAHA_FLOORS } from '../src/data/buildings';
import { BED_STATUS_ITEMS } from '../src/data/bed-status';

const prisma = new PrismaClient();

async function main() {
  console.log('=== MEMULAI SEEDING DATABASE RSI ISLAM SURABAYA (PRD v3.0) ===');

  // 1. Partial Unique Index untuk perlindungan concurrency janji temu (US-4)
  // Menjamin di level DB bahwa tidak ada 2 janji aktif (status != 'CANCELLED')
  // pada dokter dan slot waktu yang sama.
  await prisma.$executeRawUnsafe(`
    CREATE UNIQUE INDEX IF NOT EXISTS unique_active_doctor_slot
    ON "Appointment" ("doctorId", "appointmentDate", "timeSlot")
    WHERE "status" != 'CANCELLED';
  `);
  console.log(' [DB] Constraint DB partial unique index verified: unique_active_doctor_slot');

  // 2. Seed 20 Poliklinik Rawat Jalan
  // 20 poliklinik terverifikasi dari Lampiran A PRD v2.0
  const polyclinicData = SPECIALTIES.map((spec) => {
    let buildingId = 'graha';
    let floor = 0;

    if (spec.id === 'urologi' || spec.id === 'estetika') {
      buildingId = 'graha';
      floor = 3;
    } else if (spec.id === 'obgyn') {
      buildingId = 'graha';
      floor = 2;
    } else if (spec.id === 'penyakit-dalam' || spec.id === 'jantung' || spec.id === 'paru') {
      buildingId = 'tower';
      floor = 3;
    } else if (spec.id === 'anestesi' || spec.id === 'bedah-saraf' || spec.id === 'btkv') {
      buildingId = 'tower';
      floor = 2;
    }

    return {
      id: spec.id,
      name: spec.name.startsWith('Poliklinik') ? spec.name : `Poliklinik ${spec.name}`,
      buildingId,
      floor,
    };
  });

  for (const poli of polyclinicData) {
    await prisma.polyclinic.upsert({
      where: { id: poli.id },
      update: {
        name: poli.name,
        buildingId: poli.buildingId,
        floor: poli.floor,
      },
      create: {
        id: poli.id,
        name: poli.name,
        buildingId: poli.buildingId,
        floor: poli.floor,
      },
    });
  }
  console.log(` [DB] 20 Poliklinik seeded (upsert idempotent)`);

  // 3. Seed 17 Spesialisasi yang memiliki dokter
  // Mengambil 17 spesialisasi yang dinaungi oleh 24 dokter fiktif
  const doctorSpecialtyIds = new Set(DOCTORS.map((d) => d.specialtyId));
  const activeSpecialties = SPECIALTIES.filter((s) => doctorSpecialtyIds.has(s.id));

  for (const spec of activeSpecialties) {
    await prisma.specialty.upsert({
      where: { id: spec.id },
      update: {
        name: spec.name,
        group: spec.group,
        summary: spec.summary,
        iconName: spec.iconName,
      },
      create: {
        id: spec.id,
        name: spec.name,
        group: spec.group,
        summary: spec.summary,
        iconName: spec.iconName,
      },
    });

    // Hubungkan polyclinic ke specialty
    await prisma.polyclinic.update({
      where: { id: spec.id },
      data: { specialtyId: spec.id },
    });
  }
  console.log(` [DB] ${activeSpecialties.length} Spesialisasi dokter seeded (target: 17)`);

  // 4. Seed 24 Dokter Fiktif + Jadwal Mingguan
  for (const doc of DOCTORS) {
    const doctorRecord = await prisma.doctor.upsert({
      where: { slug: doc.slug },
      update: {
        name: doc.name,
        title: doc.title,
        specialtyId: doc.specialtyId,
        subSpecialty: doc.subSpecialty ?? null,
        penjamin: doc.penjamin,
        poli: doc.poli,
        bio: doc.bio,
        isFictional: true,
        polyclinicId: doc.specialtyId,
      },
      create: {
        slug: doc.slug,
        name: doc.name,
        title: doc.title,
        specialtyId: doc.specialtyId,
        subSpecialty: doc.subSpecialty ?? null,
        penjamin: doc.penjamin,
        poli: doc.poli,
        bio: doc.bio,
        isFictional: true,
        polyclinicId: doc.specialtyId,
      },
    });

    // Hapus jadwal lama dokter ini lalu recreate (idempoten per dokter)
    await prisma.doctorSchedule.deleteMany({
      where: { doctorId: doctorRecord.id },
    });

    for (const sch of doc.schedule) {
      await prisma.doctorSchedule.create({
        data: {
          doctorId: doctorRecord.id,
          hari: sch.hari,
          mulai: sch.mulai,
          selesai: sch.selesai,
          poli: sch.poli,
          quota: 15,
        },
      });
    }
  }
  console.log(` [DB] 24 Dokter fiktif + jadwal mingguan seeded (semua isFictional=true)`);

  // 5. Seed 8 Layanan Terpadu
  for (const s of SERVICES) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {
        name: s.name,
        summary: s.summary,
        description: s.description,
        buildingId: s.buildingId,
        floor: s.floor,
        open24h: s.open24h,
        highlight: s.highlight,
        sourceNote: s.sourceNote,
      },
      create: {
        id: s.slug,
        slug: s.slug,
        name: s.name,
        summary: s.summary,
        description: s.description,
        buildingId: s.buildingId,
        floor: s.floor,
        open24h: s.open24h,
        highlight: s.highlight,
        sourceNote: s.sourceNote,
      },
    });
  }
  console.log(` [DB] 8 Layanan terpadu seeded`);

  // 6. Seed Tower 13 Lantai + Graha Lantai (Register Konflik K4 dihormati penuh)
  const allFloors = [...TOWER_FLOORS, ...GRAHA_FLOORS];
  for (const f of allFloors) {
    await prisma.towerFloor.upsert({
      where: {
        buildingId_floor: {
          buildingId: f.buildingId,
          floor: f.floor,
        },
      },
      update: {
        label: f.label,
        serviceSlugs: f.serviceSlugs,
        known: f.known,
        description: f.description ?? null,
      },
      create: {
        buildingId: f.buildingId,
        floor: f.floor,
        label: f.label,
        serviceSlugs: f.serviceSlugs,
        known: f.known,
        description: f.description ?? null,
      },
    });
  }
  console.log(` [DB] Tower 13 lantai & Graha floors seeded (data hanya di Lt. 2, 3, 4, 7 untuk Tower)`);

  // 7. Seed Bed Status
  for (const bed of BED_STATUS_ITEMS) {
    await prisma.bedStatus.upsert({
      where: { unit: bed.unit },
      update: {
        status: bed.status,
        note: bed.note ?? null,
      },
      create: {
        unit: bed.unit,
        status: bed.status,
        note: bed.note ?? null,
      },
    });
  }
  console.log(` [DB] Bed status seeded (${BED_STATUS_ITEMS.length} unit)`);

  // 8. Seed Akun Demo (Pasien & Admin) dengan password bcrypt hash (PRD US-2)
  const patientHash = await bcrypt.hash('PasswordDemo123!', 10);
  const adminHash = await bcrypt.hash('AdminSecure123!', 10);

  const demoPatient = await prisma.user.upsert({
    where: { email: 'pasien.demo@rsi-surabaya.test' },
    update: {
      name: 'Pasien Demo (Fiktif)',
      passwordHash: patientHash,
      role: 'PATIENT',
    },
    create: {
      email: 'pasien.demo@rsi-surabaya.test',
      name: 'Pasien Demo (Fiktif)',
      passwordHash: patientHash,
      role: 'PATIENT',
    },
  });

  const demoAdmin = await prisma.user.upsert({
    where: { email: 'admin.demo@rsi-surabaya.test' },
    update: {
      name: 'Admin Demo (Fiktif)',
      passwordHash: adminHash,
      role: 'ADMIN',
    },
    create: {
      email: 'admin.demo@rsi-surabaya.test',
      name: 'Admin Demo (Fiktif)',
      passwordHash: adminHash,
      role: 'ADMIN',
    },
  });

  // Account entries untuk Better Auth compatibility
  await prisma.account.upsert({
    where: { id: `acc-${demoPatient.id}` },
    update: { password: patientHash },
    create: {
      id: `acc-${demoPatient.id}`,
      accountId: demoPatient.id,
      providerId: 'credential',
      userId: demoPatient.id,
      password: patientHash,
    },
  });

  await prisma.account.upsert({
    where: { id: `acc-${demoAdmin.id}` },
    update: { password: adminHash },
    create: {
      id: `acc-${demoAdmin.id}`,
      accountId: demoAdmin.id,
      providerId: 'credential',
      userId: demoAdmin.id,
      password: adminHash,
    },
  });

  console.log(' [DB] Akun demo seeded:');
  console.log('      - Pasien: pasien.demo@rsi-surabaya.test (Role: PATIENT, password hash bcrypt)');
  console.log('      - Admin: admin.demo@rsi-surabaya.test (Role: ADMIN, password hash bcrypt)');

  // 9. Verifikasi Invarian US-1
  const docCount = await prisma.doctor.count();
  const specCount = await prisma.specialty.count();
  const poliCount = await prisma.polyclinic.count();
  const serviceCount = await prisma.service.count();
  const towerFloorCount = await prisma.towerFloor.count({ where: { buildingId: 'tower' } });
  const towerKnownCount = await prisma.towerFloor.count({ where: { buildingId: 'tower', known: true } });
  const allFictional = (await prisma.doctor.count({ where: { isFictional: true } })) === docCount;

  console.log('\n=== VERIFIKASI AKSEPTANSI US-1 ===');
  console.log(`- Total Dokter        : ${docCount} (Harus 24, semua isFictional=true: ${allFictional})`);
  console.log(`- Total Spesialisasi  : ${specCount} (Harus 17)`);
  console.log(`- Total Poliklinik    : ${poliCount} (Harus 20)`);
  console.log(`- Total Layanan       : ${serviceCount} (Harus 8)`);
  console.log(`- Tower 13 Lantai     : ${towerFloorCount} total lantai (Harus 13, dengan data di 4 lantai: ${towerKnownCount === 4})`);

  if (
    docCount === 24 &&
    allFictional &&
    specCount === 17 &&
    poliCount === 20 &&
    serviceCount === 8 &&
    towerFloorCount === 13 &&
    towerKnownCount === 4
  ) {
    console.log('[SUCCESS] US-1 ACCEPTANCE CRITERIA 100% TERPENUHI!');
  } else {
    throw new Error('[FAILED] Data seeded tidak memenuhi kuota US-1!');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
