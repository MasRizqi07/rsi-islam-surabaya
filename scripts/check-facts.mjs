import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

// 1. Pola string literal yang dilarang di-hardcode di luar src/data/facts.ts
export const HARDCODED_FACTS_RULES = [
  { name: 'Nomor Emergency Call 1500718', regex: /1500718/ },
  { name: 'Nomor Ambulans 0811233999', regex: /08\s*112\s*33\s*999|0811233999/ },
  { name: 'Telepon Sentral (031) 8284505', regex: /8284505/ },
  { name: 'Alamat Jl. Achmad Yani', regex: /Achmad\s*Yani\s*No\.?\s*2/i },
  { name: 'Tautan Google Maps Spesifik', regex: /maps\.app\.goo\.gl\/u2JxcgMixBtpgmUj9/ },
];

// 2. Pola klaim terlarang dan regresi (R8 Fase 5.1)
export const FORBIDDEN_CLAIMS_RULES = [
  { name: 'Klaim Soeharto (R1)', regex: /soeharto/i },
  { name: 'Klaim WhatsApp Darurat fiktif (R1)', regex: /WhatsApp\s*Darurat/i },
  {
    name: 'Klaim Bintang Lima tanpa sourceNote (R8)',
    test: (content) => /Bintang\s*Lima/i.test(content) && !content.includes('sourceNote'),
  },
  {
    name: 'Superlatif R7 tanpa sourceNote (R7/R8)',
    test: (content) => {
      // Periksa keberadaan superlatif terlarang
      const regex = /\b(terbaik|tertinggi|terdepan|terlengkap|nomor satu|unggul|keunggulan)\b/i;
      return regex.test(content) && !content.includes('sourceNote');
    },
  },
  { name: 'Klaim CSP ketat (R3)', regex: /CSP\s*ketat/i },
  {
    name: 'Skema/field nomor identitas 16 digit terlarang (C4)',
    regex: /nomorIdentitas|\b(?:nik|ktp|identitas)\b.*(?:\b16\b|\\d\{16\})|\\d\{16\}/i,
  },
  {
    name: 'Pola fallback secret process.env.*SECRET* || terlarang (S-2)',
    regex: /process\.env\.[A-Z0-9_]*SECRET[A-Z0-9_]*\s*\|\|/i,
  },
  {
    name: 'Hex secret 64 karakter yang pernah bocor di riwayat (S-2)',
    regex: new RegExp('f6c8d7e9' + 'a1b2c3d4' + 'e5f6a7b8' + 'c9d0e1f2' + 'a3b4c5d6' + 'e7f8a9b0' + 'c1d2e3f4' + 'a5b6c7d8', 'i'),
  },
];

/**
 * Pindai satu konten teks terhadap seluruh aturan fakta dan regresi.
 * Digunakan baik oleh CLI scanner maupun Vitest unit tests.
 */
export function scanContentForViolations(content, filePath = '', nextConfigHasHsts = true) {
  const violations = [];

  // Jika memeriksa komponen UI (src/app, src/components), uji kebocoran hardcode fakta RS
  const isUiComponent = filePath.startsWith('src/app') || filePath.startsWith('src/components');
  if (isUiComponent) {
    for (const rule of HARDCODED_FACTS_RULES) {
      if (rule.regex.test(content)) {
        violations.push({
          file: filePath,
          rule: rule.name,
        });
      }
    }
  }

  // Uji klaim terlarang R8
  for (const rule of FORBIDDEN_CLAIMS_RULES) {
    let matched = false;
    if (rule.test) {
      matched = rule.test(content);
    } else if (rule.regex) {
      matched = rule.regex.test(content);
    }
    if (matched) {
      violations.push({
        file: filePath,
        rule: rule.name,
      });
    }
  }

  // Uji aturan HSTS: kata 'HSTS' dilarang bila next.config.mjs tidak memuat Strict-Transport-Security
  if (!nextConfigHasHsts && /\bHSTS\b/i.test(content)) {
    violations.push({
      file: filePath,
      rule: 'Menyebut HSTS ketika next.config.mjs tidak memuat Strict-Transport-Security (R8)',
    });
  }

  return violations;
}

function scanFile(filePath, nextConfigHasHsts) {
  const content = readFileSync(filePath, 'utf8');
  return scanContentForViolations(content, filePath.replace(/\\/g, '/'), nextConfigHasHsts);
}

function scanDirectory(dir, nextConfigHasHsts) {
  let violations = [];
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const normalized = fullPath.replace(/\\/g, '/');

    // Abaikan folder yang dikecualikan
    if (
      entry === 'node_modules' ||
      entry === '.next' ||
      entry === '.git' ||
      entry === '__tests__' ||
      normalized.includes('docs/evidence/legacy-narrative') ||
      normalized.includes('docs/evidence/raw') ||
      normalized.includes('docs/design-reference')
    ) {
      continue;
    }

    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      violations = violations.concat(scanDirectory(fullPath, nextConfigHasHsts));
    } else if (
      entry.endsWith('.tsx') ||
      entry.endsWith('.ts') ||
      entry.endsWith('.md') ||
      entry.endsWith('.html') ||
      entry.endsWith('.json')
    ) {
      // Abaikan file fakta sumber dan file audit report yang mencatat aturan disclaimer
      if (
        normalized.endsWith('src/data/facts.ts') ||
        normalized.endsWith('scripts/check-facts.mjs') ||
        normalized.endsWith('facts-check-results.json')
      ) {
        continue;
      }
      violations = violations.concat(scanFile(fullPath, nextConfigHasHsts));
    }
  }

  return violations;
}

export function runFactsCheck() {
  console.log('=== HOSPITAL FACTS & ANTI-REGRESSION SCANNER (scripts/check-facts.mjs) ===\n');

  // Periksa apakah next.config.mjs memuat Strict-Transport-Security
  let nextConfigHasHsts = false;
  if (existsSync('next.config.mjs')) {
    const configContent = readFileSync('next.config.mjs', 'utf8');
    nextConfigHasHsts = configContent.includes('Strict-Transport-Security');
  }

  const scanTargets = ['./src', './docs'];
  let allViolations = [];

  for (const target of scanTargets) {
    if (existsSync(target)) {
      allViolations = allViolations.concat(scanDirectory(target, nextConfigHasHsts));
    }
  }

  // Scan README.md dan .env.example di root
  if (existsSync('README.md')) {
    allViolations = allViolations.concat(scanFile('README.md', nextConfigHasHsts));
  }
  if (existsSync('.env.example')) {
    allViolations = allViolations.concat(scanFile('.env.example', nextConfigHasHsts));
  }

  mkdirSync('docs/evidence', { recursive: true });
  const report = {
    timestamp: new Date().toISOString(),
    hstsConfigured: nextConfigHasHsts,
    totalViolations: allViolations.length,
    violations: allViolations,
    status: allViolations.length === 0 ? 'ALL_PASSED' : 'FAILED',
  };

  writeFileSync('docs/evidence/facts-check-results.json', JSON.stringify(report, null, 2), 'utf8');

  if (allViolations.length > 0) {
    console.error(`[FATAL] Ditemukan ${allViolations.length} pelanggaran fakta/klaim terlarang:`);
    allViolations.forEach((v) => {
      console.error(`  - ${v.file}: ${v.rule}`);
    });
    return { exitCode: 1, violations: allViolations };
  } else {
    console.log('[SUCCESS] 0 kebocoran fakta dan 0 klaim terlarang terdeteksi! Repositori patuh penuh.');
    return { exitCode: 0, violations: [] };
  }
}

// Eksekusi CLI bila dipanggil langsung
const isCli = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isCli) {
  const result = runFactsCheck();
  process.exit(result.exitCode);
}
