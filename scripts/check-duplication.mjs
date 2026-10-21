import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

console.log('=== DATA DUPLICATION SCANNER (scripts/check-duplication.mjs) ===\n');

// 1. Ekstrak string literal >= 12 karakter dari data fixture src/data/*.ts
// Kecualikan types.ts dan schema.ts karena keduanya adalah definisi tipe & aturan validasi, bukan data fakta.
function extractDataLiterals(dataDir = 'src/data') {
  const literals = new Set();
  const entries = readdirSync(dataDir);

  const stringRegex = /(["'`])((?:\\.|(?!\1)[^\\])*)\1/g;

  // Nama icon umum Lucide agar tidak dianggap sebagai duplikasi data fakta
  const knownIconNames = new Set([
    'HeartHandshake',
    'Stethoscope',
    'CheckCircle2',
    'ShieldAlert',
    'ShieldCheck',
    'AlertTriangle',
  ]);

  for (const entry of entries) {
    if (
      entry === 'types.ts' ||
      entry === 'schema.ts' ||
      entry.includes('.test.') ||
      entry === '__tests__'
    ) {
      continue;
    }
    const fullPath = join(dataDir, entry);
    if (!statSync(fullPath).isFile() || !entry.endsWith('.ts')) continue;

    const content = readFileSync(fullPath, 'utf8');
    let match;
    while ((match = stringRegex.exec(content)) !== null) {
      const str = match[2];
      // Filter out import paths, directive strings, CSS variables, icon names, atau slug pendek
      if (
        str.length >= 12 &&
        !str.startsWith('./') &&
        !str.startsWith('@/') &&
        !str.startsWith('use ') &&
        !str.startsWith('node:') &&
        !str.includes('`') &&
        !knownIconNames.has(str)
      ) {
        literals.add(str);
      }
    }
  }

  return Array.from(literals);
}

// 2. Telusuri direktori target (src/app dan src/components)
function getTargetFiles(dir) {
  let files = [];
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      if (entry === 'node_modules' || entry === '.next' || entry === '__tests__') continue;
      files = files.concat(getTargetFiles(fullPath));
    } else if (entry.endsWith('.tsx') || entry.endsWith('.ts')) {
      files.push(fullPath);
    }
  }

  return files;
}

export function runDuplicationCheck(options = {}) {
  const dataDir = options.dataDir || 'src/data';
  const targetDirs = options.targetDirs || ['src/app', 'src/components'];

  const literals = extractDataLiterals(dataDir);
  console.log(`[INFO] Mengekstrak ${literals.length} string literal data (>= 12 karakter) dari ${dataDir}/*.ts`);

  const violations = [];

  for (const dir of targetDirs) {
    try {
      const files = getTargetFiles(dir);
      for (const file of files) {
        const content = readFileSync(file, 'utf8');
        const lines = content.split('\n');
        let inMultiLineImport = false;

        for (let i = 0; i < lines.length; i++) {
          const rawLine = lines[i];
          const trimmed = rawLine.trim();

          // Deteksi awal/akhir blok import multiline
          if (trimmed.startsWith('import ') && !trimmed.includes('from ')) {
            inMultiLineImport = true;
            continue;
          }
          if (inMultiLineImport) {
            if (trimmed.includes('from ')) {
              inMultiLineImport = false;
            }
            continue;
          }

          // Lewati import/export tunggal, komentar JS, dan komentar JSX
          if (
            trimmed.startsWith('import ') ||
            trimmed.startsWith('export ') ||
            trimmed.includes(' from \'') ||
            trimmed.includes(' from "') ||
            trimmed.startsWith('//') ||
            trimmed.startsWith('/*') ||
            trimmed.startsWith('*') ||
            (trimmed.startsWith('{/*') && trimmed.endsWith('*/}'))
          ) {
            continue;
          }

          for (const lit of literals) {
            if (rawLine.includes(lit)) {
              violations.push({
                literal: lit,
                file: file.replace(/\\/g, '/'),
                line: i + 1,
                snippet: trimmed,
              });
            }
          }
        }
      }
    } catch (err) {
      console.error(`[ERROR] Gagal memindai direktori ${dir}:`, err.message);
    }
  }

  return violations;
}

// Eksekusi utama jika dijalankan via node / CLI
if (process.argv[1] && process.argv[1].endsWith('check-duplication.mjs')) {
  // Dukungan flag fixture untuk pengujian
  const fixtureArgIdx = process.argv.indexOf('--fixture');
  let targetDirs = ['src/app', 'src/components'];
  if (fixtureArgIdx !== -1 && process.argv[fixtureArgIdx + 1]) {
    targetDirs = [process.argv[fixtureArgIdx + 1]];
  }

  const violations = runDuplicationCheck({ targetDirs });

  mkdirSync('docs/evidence', { recursive: true });
  writeFileSync(
    'docs/evidence/duplication-results.json',
    JSON.stringify({ timestamp: new Date().toISOString(), violationsCount: violations.length, violations }, null, 2)
  );

  if (violations.length > 0) {
    console.error(`\n[FAIL] Ditemukan ${violations.length} duplikasi string literal verbatim dari src/data/*.ts:\n`);
    for (const v of violations) {
      console.error(`- [${v.file}:${v.line}] "${v.literal}"`);
      console.error(`  Snippet: ${v.snippet}\n`);
    }
    console.error('Pindahkan string di atas ke src/data/ dan impor secara dinamis!');
    process.exit(1);
  } else {
    console.log('[SUCCESS] 0 duplikasi string literal terdeteksi. Seluruh data diimpor dari src/data/*.\n');
    process.exit(0);
  }
}
