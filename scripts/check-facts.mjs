import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

console.log('=== HOSPITAL FACTS LEAKAGE SCANNER (scripts/check-facts.mjs) ===\n');

// Pola string literal yang dilarang di-hardcode di luar src/data/facts.ts
const forbiddenPatterns = [
  { name: 'Nomor Emergency Call 1500718', regex: /1500718/ },
  { name: 'Nomor Ambulans 0811233999', regex: /08\s*112\s*33\s*999|0811233999/ },
  { name: 'Telepon Sentral (031) 8284505', regex: /8284505/ },
  { name: 'Alamat Jl. Achmad Yani', regex: /Achmad\s*Yani\s*No\.?\s*2/i },
  { name: 'Tautan Google Maps Spesifik', regex: /maps\.app\.goo\.gl\/u2JxcgMixBtpgmUj9/ },
];

function scanDirectory(dir) {
  let violations = [];
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      if (entry === 'node_modules' || entry === '.next' || entry === 'data' || entry === '__tests__') {
        continue;
      }
      violations = violations.concat(scanDirectory(fullPath));
    } else if (entry.endsWith('.tsx') || entry.endsWith('.ts')) {
      // Kecualikan file fakta itu sendiri
      if (fullPath.includes('src/data/facts.ts') || fullPath.includes('src\\data\\facts.ts')) {
        continue;
      }

      const content = readFileSync(fullPath, 'utf8');
      for (const rule of forbiddenPatterns) {
        if (rule.regex.test(content)) {
          violations.push({
            file: fullPath.replace(/\\/g, '/'),
            rule: rule.name,
          });
        }
      }
    }
  }

  return violations;
}

const targetDirs = ['./src/app', './src/components'];
let allViolations = [];

for (const dir of targetDirs) {
  try {
    allViolations = allViolations.concat(scanDirectory(dir));
  } catch (err) {
    console.error(`Gagal memindai direktori ${dir}:`, err.message);
  }
}

mkdirSync('docs/evidence', { recursive: true });
const report = {
  timestamp: new Date().toISOString(),
  targetDirectories: targetDirs,
  totalViolations: allViolations.length,
  violations: allViolations,
  status: allViolations.length === 0 ? 'ALL_PASSED' : 'FAILED',
};

writeFileSync('docs/evidence/facts-check-results.json', JSON.stringify(report, null, 2), 'utf8');

if (allViolations.length > 0) {
  console.error(`[FATAL] Ditemukan ${allViolations.length} kebocoran fakta/nomor di komponen UI:`);
  allViolations.forEach((v) => {
    console.error(`  - ${v.file}: ${v.rule}`);
  });
  console.error('\nSeluruh nilai fakta RS wajib diimpor dari src/data/facts.ts!');
  process.exit(1);
} else {
  console.log('[SUCCESS] 0 kebocoran fakta terdeteksi! Seluruh komponen mengimpor dari src/data/facts.ts.');
}
