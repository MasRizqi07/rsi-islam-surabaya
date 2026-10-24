import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * SKRIP GENERATOR TABEL LIGHTHOUSE (C1 Koreksi Audit Independen)
 * 
 * Membaca 25 JSON mentah di docs/evidence/v3/p0b/lighthouse/
 * Menghitung nilai median absolut dari 5 run per rute tanpa manipulasi,
 * lalu mencetak tabel Markdown beserta status kelulusan per target teknis:
 * - Performance: >= 90
 * - Accessibility: >= 95
 * - Best Practices: >= 95
 * - LCP: <= 2500 ms (2.5 s)
 * - TBT: <= 200 ms
 * - CLS: <= 0.100
 */

const ROUTES = [
  { slug: 'home', path: '/', name: 'Beranda' },
  { slug: 'igd', path: '/igd', name: 'IGD Darurat' },
  { slug: 'dokter', path: '/dokter', name: 'Direktori Dokter' },
  { slug: 'tower', path: '/tower', name: 'Tower Directory' },
  { slug: 'daftar', path: '/daftar', name: 'Pendaftaran Online' },
];

function median(values) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

const baseDir = join(process.cwd(), 'docs', 'evidence', 'v3', 'p0b', 'lighthouse');

const rows = [];
const failedRoutes = [];

for (const route of ROUTES) {
  const perfArr = [];
  const a11yArr = [];
  const bpArr = [];
  const lcpArr = [];
  const tbtArr = [];
  const clsArr = [];

  for (let run = 1; run <= 5; run++) {
    const filename = `lighthouse-${route.slug}-run${run}.json`;
    const fullPath = join(baseDir, filename);

    if (!existsSync(fullPath)) {
      console.error(`Berkas ${fullPath} tidak ditemukan!`);
      process.exit(1);
    }

    const json = JSON.parse(readFileSync(fullPath, 'utf8'));
    perfArr.push(Math.round((json.categories.performance?.score || 0) * 100));
    a11yArr.push(Math.round((json.categories.accessibility?.score || 0) * 100));
    bpArr.push(Math.round((json.categories['best-practices']?.score || 0) * 100));
    lcpArr.push(Math.round(json.audits['largest-contentful-paint']?.numericValue || 0));
    tbtArr.push(Math.round(json.audits['total-blocking-time']?.numericValue || 0));
    clsArr.push(Number((json.audits['cumulative-layout-shift']?.numericValue || 0).toFixed(3)));
  }

  const medPerf = median(perfArr);
  const medA11y = median(a11yArr);
  const medBp = median(bpArr);
  const medLcp = median(lcpArr);
  const medTbt = median(tbtArr);
  const medCls = median(clsArr);

  const reasons = [];
  if (medPerf < 90) reasons.push(`Perf ${medPerf} < 90`);
  if (medA11y < 95) reasons.push(`A11y ${medA11y} < 95`);
  if (medBp < 95) reasons.push(`BP ${medBp} < 95`);
  if (medLcp > 2500) reasons.push(`LCP ${(medLcp / 1000).toFixed(2)}s > 2.5s`);
  if (medTbt > 200) reasons.push(`TBT ${medTbt}ms > 200ms`);
  if (medCls > 0.1) reasons.push(`CLS ${medCls} > 0.1`);

  const passed = reasons.length === 0;
  if (!passed) {
    failedRoutes.push({ route: route.path, reasons });
  }

  rows.push({
    name: route.name,
    path: route.path,
    perf: medPerf,
    a11y: medA11y,
    bp: medBp,
    lcp: medLcp,
    tbt: medTbt,
    cls: medCls,
    status: passed ? 'PASS' : `FAIL (${reasons.map((r) => r.split(' ')[0]).join(', ')})`,
  });
}

console.log('### TABEL HASIL AUDIT LIGHTHOUSE MOBILE LAB (MEDIAN 5 RUN)');
console.log('Sumber Data: 25 JSON Mentah di `docs/evidence/v3/p0b/lighthouse/`');
console.log('Profil: Default Mobile (Emulasi 4x CPU Slowdown, Jaringan Standar Seluler)\n');
console.log('| Rute Halaman | Path | Perf (≥90) | A11y (≥95) | Best Practices (≥95) | LCP (≤2.5s) | TBT (≤200ms) | CLS (≤0.1) | Status Evaluasi |');
console.log('|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|');

for (const r of rows) {
  const perfStr = r.perf >= 90 ? `**${r.perf}**` : `${r.perf} ❌`;
  const a11yStr = r.a11y >= 95 ? `**${r.a11y}**` : `${r.a11y} ❌`;
  const bpStr = r.bp >= 95 ? `**${r.bp}**` : `${r.bp} ❌`;
  const lcpSec = (r.lcp / 1000).toFixed(2);
  const lcpStr = r.lcp <= 2500 ? `**${lcpSec}s**` : `${lcpSec}s ❌`;
  const tbtStr = r.tbt <= 200 ? `**${r.tbt}ms**` : `${r.tbt}ms ❌`;
  const clsStr = r.cls <= 0.1 ? `**${r.cls.toFixed(3)}**` : `${r.cls.toFixed(3)} ❌`;
  const statusStr = r.status.startsWith('PASS') ? `**${r.status}**` : `**${r.status}**`;

  console.log(`| **${r.name}** | \`${r.path}\` | ${perfStr} | ${a11yStr} | ${bpStr} | ${lcpStr} | ${tbtStr} | ${clsStr} | ${statusStr} |`);
}

console.log('\n**Ringkasan Status Evaluasi Berdasarkan Median Absolut:**');
console.log(`- Total Rute Diuji: ${ROUTES.length}`);
console.log(`- Rute Lolos Target Penuh: ${ROUTES.length - failedRoutes.length}`);
console.log(`- Rute Gagal Target Teknis: ${failedRoutes.length}`);

console.log('\n**Rincian Kegagalan Target Per Rute (Tanpa Manipulasi):**');
for (const f of failedRoutes) {
  console.log(`- Rute \`${f.route}\`: ${f.reasons.join(', ')}`);
}
