import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { BED_STATUS_ITEMS } from '../src/data/bed-status';

const prisma = new PrismaClient();

async function main() {
  console.log('=== MEMULAI RESET DATABASE DEMO (PRD v3.0 US-8, S11) ===');

  // 1. Hapus semua riwayat janji temu dan audit log terkait janji
  const deletedAudit = await prisma.auditLog.deleteMany({
    where: {
      OR: [
        { resource: { startsWith: 'appointment/' } },
        { appointmentId: { not: null } },
      ],
    },
  });
  console.log(` [RESET] Berhasil menghapus ${deletedAudit.count} audit log janji temu.`);

  const deletedAppointments = await prisma.appointment.deleteMany();
  console.log(` [RESET] Berhasil menghapus ${deletedAppointments.count} janji temu demo.`);

  // 2. Reset Status Ketersediaan Bed (BedStatus) ke kondisi standar
  for (const bed of BED_STATUS_ITEMS) {
    await prisma.bedStatus.upsert({
      where: { unit: bed.unit },
      update: {
        status: bed.status,
        note: bed.note,
      },
      create: {
        unit: bed.unit,
        status: bed.status,
        note: bed.note,
      },
    });
  }
  console.log(` [RESET] Berhasil mereset ${BED_STATUS_ITEMS.length} unit kamar rawat inap/intensif.`);

  // 3. Pastikan Akun Demo Terverifikasi dengan Password Standar
  const patientPassword = 'PasswordDemo123!';
  const adminPassword = 'AdminSecure123!';

  const patientHash = await bcrypt.hash(patientPassword, 10);
  const adminHash = await bcrypt.hash(adminPassword, 10);

  const patientUser = await prisma.user.upsert({
    where: { email: 'pasien.demo@rsi-surabaya.test' },
    update: {
      name: 'Ahmad Fauzi (Pasien Demo)',
      passwordHash: patientHash,
      role: 'PATIENT',
    },
    create: {
      email: 'pasien.demo@rsi-surabaya.test',
      name: 'Ahmad Fauzi (Pasien Demo)',
      passwordHash: patientHash,
      role: 'PATIENT',
    },
  });

  await prisma.account.upsert({
    where: { id: `acc-${patientUser.id}` },
    update: { password: patientHash },
    create: {
      id: `acc-${patientUser.id}`,
      accountId: patientUser.id,
      providerId: 'credential',
      userId: patientUser.id,
      password: patientHash,
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin.demo@rsi-surabaya.test' },
    update: {
      name: 'dr. Siti Rahma (Administrator Medis)',
      passwordHash: adminHash,
      role: 'ADMIN',
    },
    create: {
      email: 'admin.demo@rsi-surabaya.test',
      name: 'dr. Siti Rahma (Administrator Medis)',
      passwordHash: adminHash,
      role: 'ADMIN',
    },
  });

  await prisma.account.upsert({
    where: { id: `acc-${adminUser.id}` },
    update: { password: adminHash },
    create: {
      id: `acc-${adminUser.id}`,
      accountId: adminUser.id,
      providerId: 'credential',
      userId: adminUser.id,
      password: adminHash,
    },
  });

  console.log(' [RESET] Akun demo pasien dan admin berhasil disinkronkan.');

  // 4. Catat Audit Log DEMO_DATA_RESET
  await prisma.auditLog.create({
    data: {
      actorId: adminUser.id,
      action: 'DEMO_DATA_RESET',
      resource: 'system/demo-db',
      statusBefore: 'DIRTY',
      statusAfter: 'CLEAN',
    },
  });
  console.log(' [RESET] Audit log DEMO_DATA_RESET berhasil dicatat.');

  console.log('=== RESET DATABASE SELESAI (SUKSES 100%) ===');
}

main()
  .catch((e) => {
    console.error('Error saat reset database demo:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
