/* global fetch, setTimeout */
import { spawn, execSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from '@playwright/test';

const chromePath = chromium.executablePath();
process.env.CHROME_PATH = chromePath;

const ROUTES = [
  { path: '/', slug: 'home', name: 'Beranda' },
  { path: '/igd', slug: 'igd', name: 'IGD Darurat' },
  { path: '/dokter', slug: 'dokter', name: 'Direktori Dokter' },
  { path: '/tower', slug: 'tower', name: 'Tower Directory' },
  { path: '/daftar', slug: 'daftar', name: 'Wizard Pendaftaran' },
];

const evidenceDir = join(process.cwd(), 'docs', 'evidence');
mkdirSync(evidenceDir, { recursive: true });

async function waitForServer(url, timeoutMs = 20000) {
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
  console.log('=== Memulai Audit Lighthouse Mobile Lab (Next.js Production) ===\n');
  console.log('Menggunakan Chromium:', chromePath);

  // 1. Jalankan next start pada port 3000
  console.log('Memulai server produksi Next.js pada port 3000...');
  const server = spawn('npm', ['run', 'start'], {
    shell: true,
    stdio: 'pipe',
  });

  server.stderr.on('data', (_d) => {
    // console.log('[Server stderr]:', _d.toString());
  });

  try {
    await waitForServer('http://localhost:3000/');
    console.log('[OK] Server siap di http://localhost:3000/\n');

    const auditResults = [];

    for (const route of ROUTES) {
      console.log(`Mengaudit rute ${route.name} (${route.path}) [Mobile Profile]...`);
      const targetUrl = `http://localhost:3000${route.path}`;
      const reportFile = join(evidenceDir, `lighthouse-${route.slug}.json`);

      const cmd = `npx lighthouse "${targetUrl}" --output=json --output-path="${reportFile}" --form-factor=mobile --screenEmulation.mobile --throttling.cpuSlowdownMultiplier=2 --only-categories=performance,accessibility,best-practices --chrome-flags="--headless --no-sandbox --disable-gpu" --quiet`;

      execSync(cmd, {
        env: {
          ...process.env,
          CHROME_PATH: chromePath,
        },
        stdio: 'inherit',
      });

      const report = JSON.parse(readFileSync(reportFile, 'utf8'));
      const categories = report.categories;
      const audits = report.audits;

      const perfScore = Math.round((categories.performance?.score || 0) * 100);
      const a11yScore = Math.round((categories.accessibility?.score || 0) * 100);
      const bpScore = Math.round((categories['best-practices']?.score || 0) * 100);

      const lcp = audits['largest-contentful-paint']?.numericValue || 0;
      const cls = audits['cumulative-layout-shift']?.numericValue || 0;
      const tbt = audits['total-blocking-time']?.numericValue || 0;
      const fcp = audits['first-contentful-paint']?.numericValue || 0;

      auditResults.push({
        name: route.name,
        path: route.path,
        slug: route.slug,
        scores: {
          performance: perfScore,
          accessibility: a11yScore,
          bestPractices: bpScore,
        },
        cwv: {
          lcpMs: Math.round(lcp),
          lcpSec: (lcp / 1000).toFixed(2),
          cls: parseFloat(cls.toFixed(3)),
          tbtMs: Math.round(tbt),
          fcpMs: Math.round(fcp),
        },
        passTargets: {
          performance: perfScore >= 90,
          accessibility: a11yScore >= 95,
          bestPractices: bpScore >= 95,
          lcp: lcp <= 2500,
          cls: cls <= 0.1,
          tbt: tbt <= 200,
        },
      });

      console.log(`  -> Performance: ${perfScore} | A11y: ${a11yScore} | Best Practices: ${bpScore}`);
      console.log(`  -> LCP: ${(lcp / 1000).toFixed(2)}s | CLS: ${cls.toFixed(3)} | TBT: ${Math.round(tbt)}ms\n`);
    }

    // Tulis ringkasan hasil audit ke lighthouse-summary.json
    const summaryPath = join(evidenceDir, 'lighthouse-summary.json');
    writeFileSync(summaryPath, JSON.stringify(auditResults, null, 2), 'utf8');
    console.log(`[SUCCESS] Seluruh audit selesai! Ringkasan disimpan di ${summaryPath}`);

    // Tampilkan tabel rekap
    console.log('\n=== REKAP HASIL AUDIT LIGHTHOUSE MOBILE LAB ===');
    console.table(
      auditResults.map((r) => ({
        Rute: r.name,
        Path: r.path,
        'Perf (≥90)': r.scores.performance,
        'A11y (≥95)': r.scores.accessibility,
        'BP (≥95)': r.scores.bestPractices,
        'LCP (≤2.5s)': `${r.cwv.lcpSec}s`,
        'CLS (≤0.1)': r.cwv.cls,
        'TBT (≤200ms)': `${r.cwv.tbtMs}ms`,
      }))
    );
  } finally {
    console.log('\nMenghentikan server produksi Next.js...');
    server.kill();
    // Pada Windows, kill spawn kadang butuh taskkill
    try {
      execSync('taskkill /F /IM node.exe /FI "WINDOWTITLE eq npm*"', { stdio: 'ignore' });
    } catch {
      // ignore
    }
  }
}

run().catch((err) => {
  console.error('Error saat menjalankan audit Lighthouse:', err);
  process.exit(1);
});
