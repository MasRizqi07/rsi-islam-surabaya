import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Setup skrip migrasi database independen (S-5 / PRD v3.0).
 * Menjamin partial unique index 'unique_active_doctor_slot' tercipta
 * sebelum aplikasi berjalan atau sebelum pengujian, tanpa harus menjalankan seed data.
 */
export async function setupDatabase() {
  console.log('=== MENJALANKAN SETUP DATABASE & MIGRASI SQL (PRD v3.0 / S-5) ===');

  await prisma.$executeRawUnsafe(`
    CREATE UNIQUE INDEX IF NOT EXISTS unique_active_doctor_slot
    ON "Appointment" ("doctorId", "appointmentDate", "timeSlot")
    WHERE "status" != 'CANCELLED';
  `);

  console.log('[SUCCESS] Constraint DB unique_active_doctor_slot berhasil diverifikasi/dibuat.');
}

if (process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('scripts/setup-db.ts')) {
  setupDatabase()
    .catch((err) => {
      console.error('[FATAL] Gagal setup database:', err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
