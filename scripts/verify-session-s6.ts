import { prisma } from '../src/lib/db';
import { auth } from '../src/lib/auth';

async function main() {
  console.log('=== VERIFIKASI S-6: AUDIT SESI & PELACAKAN IP/USER-AGENT ===');
  console.log('1. Melakukan login sebagai pasien.demo@rsi-surabaya.test...');
  
  // Melakukan login dengan header IP dan User-Agent eksplisit
  const reqHeaders = new Headers();
  reqHeaders.set('x-forwarded-for', '203.0.113.195');
  reqHeaders.set('user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Antigravity-Auditor/1.0');

  try {
    await auth.api.signInEmail({
      body: {
        email: 'pasien.demo@rsi-surabaya.test',
        password: 'PasswordDemo123!',
      },
      headers: reqHeaders,
      asResponse: true,
    });
    console.log('2. Login berhasil dilakukan.');
  } catch (err) {
    console.error('Login error:', err);
  }

  console.log('3. Menjalankan SQL: SELECT "id", "userId", "ipAddress", "userAgent", "createdAt" FROM "Session" ORDER BY "createdAt" DESC LIMIT 5;');
  const rawRows = (await prisma.$queryRawUnsafe(
    'SELECT "id", "userId", "ipAddress", "userAgent", "createdAt" FROM "Session" ORDER BY "createdAt" DESC LIMIT 5;'
  )) as Array<{
    id: string;
    userId: string;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: Date;
  }>;

  console.log('\nHASIL QUERY TABEL session:');
  console.table(rawRows);

  console.log('\nJSON OUTPUT:');
  console.log(JSON.stringify(rawRows, null, 2));

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
