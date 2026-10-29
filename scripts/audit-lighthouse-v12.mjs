/* global fetch, setTimeout */
import { spawn, execSync } from 'node:child_process';
import { readFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from '@playwright/test';

const chromePath = chromium.executablePath();
process.env.CHROME_PATH = chromePath;

const ROUTES = [
  { path: '/', slug: 'home', name: 'Beranda' },
  { path: '/igd', slug: 'igd', name: 'IGD Darurat' },
  { path: '/dokter', slug: 'dokter', name: 'Direktori Dokter' },
  { path: '/tower', slug: 'tower', name: 'Tower Directory' },
  { path: '/daftar', slug: 'daftar', name: 'Pendaftaran Online' },
  { path: '/layanan', slug: 'layanan', name: 'Daftar Layanan' },
  { path: '/login', slug: 'login', name: 'Autentikasi / Login' },
  { path: '/janji-temu', slug: 'janji-temu', name: 'Booking Janji Temu' },
];

const targetDirArg = process.argv[2] || 'docs/evidence/v12/baseline';
const outDir = targetDirArg.startsWith('/') || targetDirArg.includes(':') 
  ? targetDirArg 
  : join(process.cwd(), targetDirArg);

mkdirSync(outDir, { recursive: true });

async function waitForServer(url, timeoutMs = 25000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.status === 200) return true;
    } catch {
      // wait
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server tidak merespons di ${url} setelah ${timeoutMs}ms`);
}

async function run() {
  console.log(`=== Memulai Audit Lighthouse Mobile Lab v12 (5 Run / Rute) ===`);
  console.log(`Output Directory: ${outDir}`);
  console.log(`Chromium executable: ${chromePath}`);
  console.log(`Throttling profile: Default Mobile (emulated 4x CPU slowdown, standard mobile network)\n`);

  let server = null;
  let serverStartedByUs = false;

  // Cek apakah server sudah berjalan di port 3000
  try {
    const checkRes = await fetch('http://localhost:3000/');
    if (checkRes.status === 200) {
      console.log('[OK] Server sudah berjalan di http://localhost:3000/\n');
    }
  } catch {
    console.log('Memulai server produksi Next.js pada port 3000...');
    server = spawn('npm', ['run', 'start'], {
      shell: true,
      stdio: 'pipe',
    });
    serverStartedByUs = true;
    server.stderr.on('data', () => {});
    await waitForServer('http://localhost:3000/');
    console.log('[OK] Server siap di http://localhost:3000/\n');
  }

  try {
    for (const route of ROUTES) {
      console.log(`--------------------------------------------------------------------------------`);
      console.log(`Mengaudit rute ${route.name} (${route.path}) [5 Runs, Default Mobile Throttling]`);
      console.log(`--------------------------------------------------------------------------------`);

      const targetUrl = `http://localhost:3000${route.path}`;

      for (let runIdx = 1; runIdx <= 5; runIdx++) {
        const reportFile = join(outDir, `lighthouse-${route.slug}-run${runIdx}.json`);
        const cmd = `npx lighthouse "${targetUrl}" --output=json --output-path="${reportFile}" --form-factor=mobile --screenEmulation.mobile --only-categories=performance,accessibility,best-practices --chrome-flags="--headless --no-sandbox --disable-gpu" --quiet`;

        console.log(`[Run ${runIdx}/5] Command: ${cmd}`);
        execSync(cmd, {
          env: {
            ...process.env,
            CHROME_PATH: chromePath,
          },
          stdio: 'inherit',
        });

        const report = JSON.parse(readFileSync(reportFile, 'utf8'));
        const perf = Math.round((report.categories.performance?.score || 0) * 100);
        const a11y = Math.round((report.categories.accessibility?.score || 0) * 100);
        const bp = Math.round((report.categories['best-practices']?.score || 0) * 100);
        const lcp = Math.round(report.audits['largest-contentful-paint']?.numericValue || 0);
        const tbt = Math.round(report.audits['total-blocking-time']?.numericValue || 0);
        const cls = parseFloat((report.audits['cumulative-layout-shift']?.numericValue || 0).toFixed(3));

        console.log(`  -> Run ${runIdx}: Perf=${perf} | A11y=${a11y} | BP=${bp} | LCP=${(lcp / 1000).toFixed(2)}s | TBT=${tbt}ms | CLS=${cls}`);
      }
    }

    console.log(`\n[SUCCESS] Seluruh 40 audit selesai! Berkas JSON tersimpan di: ${outDir}\n`);

    // Jalankan generator tabel
    execSync(`node scripts/lighthouse-table.mjs "${outDir}"`, { stdio: 'inherit' });

  } finally {
    if (serverStartedByUs && server) {
      console.log('\nMenghentikan server produksi Next.js...');
      server.kill();
      if (process.platform === 'win32') {
        try {
          execSync('taskkill /F /IM node.exe /T 2>nul || exit 0', { shell: 'cmd.exe', stdio: 'ignore' });
        } catch {
          // ignore
        }
      }
    }
  }
}

run().catch((err) => {
  console.error('[AUDIT-LIGHTHOUSE ERROR]:', err);
  process.exit(1);
});
