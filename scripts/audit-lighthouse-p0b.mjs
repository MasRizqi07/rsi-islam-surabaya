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

const lighthouseDir = join(process.cwd(), 'docs', 'evidence', 'v3', 'p0b', 'lighthouse');
mkdirSync(lighthouseDir, { recursive: true });

function median(values) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

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
  console.log('=== Memulai Audit Lighthouse Mobile Lab P0b (5 Run / Rute, Default Mobile Throttling) ===\n');
  console.log('Chromium executable:', chromePath);
  console.log('Throttling profile: Default Mobile (emulated 4x CPU slowdown, standard mobile network)\n');

  console.log('Memulai server produksi Next.js pada port 3000...');
  const server = spawn('npm', ['run', 'start'], {
    shell: true,
    stdio: 'pipe',
  });

  server.stderr.on('data', () => {});

  try {
    await waitForServer('http://localhost:3000/');
    console.log('[OK] Server siap di http://localhost:3000/\n');

    const summaryResults = [];

    for (const route of ROUTES) {
      console.log(`--------------------------------------------------------------------------------`);
      console.log(`Mengaudit rute ${route.name} (${route.path}) [5 Runs, Default Mobile Throttling]`);
      console.log(`--------------------------------------------------------------------------------`);

      const targetUrl = `http://localhost:3000${route.path}`;
      const runs = [];

      for (let runIdx = 1; runIdx <= 5; runIdx++) {
        const reportFile = join(lighthouseDir, `lighthouse-${route.slug}-run${runIdx}.json`);
        const cmd = `npx lighthouse "${targetUrl}" --output=json --output-path="${reportFile}" --form-factor=mobile --screenEmulation.mobile --only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless --no-sandbox --disable-gpu" --quiet`;

        console.log(`[Run ${runIdx}/5] Executing Lighthouse...`);
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
        const seoScore = Math.round((categories.seo?.score || 0) * 100);

        const lcp = audits['largest-contentful-paint']?.numericValue || 0;
        const cls = audits['cumulative-layout-shift']?.numericValue || 0;
        const tbt = audits['total-blocking-time']?.numericValue || 0;
        const fcp = audits['first-contentful-paint']?.numericValue || 0;

        // Ekstrak elemen LCP dan detail diagnostik
        const lcpElementSnippet = audits['largest-contentful-paint-element']?.details?.items?.[0]?.node?.snippet || 'N/A';
        const lcpSelector = audits['largest-contentful-paint-element']?.details?.items?.[0]?.node?.selector || 'N/A';

        runs.push({
          run: runIdx,
          scores: {
            performance: perfScore,
            accessibility: a11yScore,
            bestPractices: bpScore,
            seo: seoScore,
          },
          cwv: {
            lcpMs: Math.round(lcp),
            lcpSec: (lcp / 1000).toFixed(2),
            cls: parseFloat(cls.toFixed(3)),
            tbtMs: Math.round(tbt),
            fcpMs: Math.round(fcp),
          },
          lcpDiagnostic: {
            elementSnippet: lcpElementSnippet,
            selector: lcpSelector,
          },
        });

        console.log(`  -> Run ${runIdx}: Perf=${perfScore} | A11y=${a11yScore} | BP=${bpScore} | SEO=${seoScore} | LCP=${(lcp / 1000).toFixed(2)}s | TBT=${Math.round(tbt)}ms | CLS=${cls.toFixed(3)} | FCP=${Math.round(fcp)}ms`);
      }

      // Hitung median dari 5 run
      const medianPerf = Math.round(median(runs.map((r) => r.scores.performance)));
      const medianA11y = Math.round(median(runs.map((r) => r.scores.accessibility)));
      const medianBp = Math.round(median(runs.map((r) => r.scores.bestPractices)));
      const medianSeo = Math.round(median(runs.map((r) => r.scores.seo)));
      const medianLcpMs = Math.round(median(runs.map((r) => r.cwv.lcpMs)));
      const medianTbtMs = Math.round(median(runs.map((r) => r.cwv.tbtMs)));
      const medianCls = parseFloat(median(runs.map((r) => r.cwv.cls)).toFixed(3));
      const medianFcpMs = Math.round(median(runs.map((r) => r.cwv.fcpMs)));

      console.log(`\n  [MEDIAN ${route.name}]:`);
      console.log(`  Perf: ${medianPerf} | A11y: ${medianA11y} | BP: ${medianBp} | SEO: ${medianSeo}`);
      console.log(`  LCP: ${(medianLcpMs / 1000).toFixed(2)}s | TBT: ${medianTbtMs}ms | CLS: ${medianCls} | FCP: ${medianFcpMs}ms\n`);

      summaryResults.push({
        name: route.name,
        path: route.path,
        slug: route.slug,
        median: {
          scores: {
            performance: medianPerf,
            accessibility: medianA11y,
            bestPractices: medianBp,
            seo: medianSeo,
          },
          cwv: {
            lcpMs: medianLcpMs,
            lcpSec: (medianLcpMs / 1000).toFixed(2),
            cls: medianCls,
            tbtMs: medianTbtMs,
            fcpMs: medianFcpMs,
          },
          lcpElement: runs[2]?.lcpDiagnostic || runs[0]?.lcpDiagnostic,
          passTargets: {
            performance: medianPerf >= 90,
            accessibility: medianA11y >= 95,
            bestPractices: medianBp >= 95,
            seo: medianSeo >= 95,
            lcp: medianLcpMs <= 2500,
            cls: medianCls <= 0.1,
            tbt: medianTbtMs <= 200,
          },
        },
        runs,
      });
    }

    const summaryPath = join(process.cwd(), 'docs', 'evidence', 'v3', 'p0b', 'lighthouse-summary.json');
    writeFileSync(summaryPath, JSON.stringify(summaryResults, null, 2), 'utf8');
    console.log(`[SUCCESS] Seluruh 5 run audit selesai! Ringkasan disimpan di ${summaryPath}`);

    console.log('\n=== REKAP HASIL AUDIT LIGHTHOUSE MOBILE LAB (MEDIAN 5 RUNS) ===');
    console.table(
      summaryResults.map((r) => ({
        Rute: r.name,
        Path: r.path,
        'Perf (≥90)': r.median.scores.performance,
        'A11y (≥95)': r.median.scores.accessibility,
        'BP (≥95)': r.median.scores.bestPractices,
        'SEO (≥95)': r.median.scores.seo,
        'LCP (≤2.5s)': `${r.median.cwv.lcpSec}s (${r.median.cwv.lcpMs}ms)`,
        'TBT (≤200ms)': `${r.median.cwv.tbtMs}ms`,
        'CLS (≤0.1)': r.median.cwv.cls,
        'FCP (ms)': `${r.median.cwv.fcpMs}ms`,
        'LCP Status': r.median.cwv.lcpMs <= 2500 ? 'PASS' : 'FAIL',
      }))
    );
  } finally {
    console.log('\nMenghentikan server produksi Next.js...');
    server.kill();
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
