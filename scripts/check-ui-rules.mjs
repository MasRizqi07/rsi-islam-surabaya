#!/usr/bin/env node
/**
 * scripts/check-ui-rules.mjs
 * 
 * Validator otomatis untuk Aturan UI & Motion Fase 12:
 * 1. Tolak `transition: all` di CSS dan `transition-all` di class komponen.
 * 2. Tolak animasi pada layout props (width, height, top, left, right, bottom, margin, padding).
 * 3. Tolak durasi animasi > 500ms.
 * 4. Tolak hardcoded hex (#...) di file src/components/ dan src/app/** /page.tsx (kecuali styleguide token reference).
 * 5. Tolak class animasi di rute /igd.
 * 6. Tolak elemen <img> / <Image> tanpa atribut alt.
 * 7. Tolak <button> tanpa teks atau aria-label.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

/**
 * Validasi sebuah file string content berdasarkan filePath.
 * @param {string} content - Konten teks file
 * @param {string} filePath - Path relatif atau absolut
 * @returns {Array<{ rule: string, file: string, line: number, message: string }>}
 */
export function validateContent(content, filePath) {
  const violations = [];
  const normalizedPath = filePath.replace(/\\/g, '/');
  const lines = content.split('\n');

  // Rule 1: Tolak transition: all di CSS & transition-all di komponen
  lines.forEach((line, index) => {
    // Abaikan komentar
    const cleanLine = line.trim();
    if (cleanLine.startsWith('//') || cleanLine.startsWith('*') || cleanLine.startsWith('/*')) return;

    if (/\btransition:\s*all\b/i.test(line)) {
      violations.push({
        rule: 'no-transition-all',
        file: normalizedPath,
        line: index + 1,
        message: 'Dilarang menggunakan "transition: all" di CSS. Tentukan properti eksplisit.',
      });
    }

    if (/\btransition-all\b/.test(line)) {
      violations.push({
        rule: 'no-transition-all',
        file: normalizedPath,
        line: index + 1,
        message: 'Dilarang menggunakan class "transition-all". Gunakan transition-colors, transition-transform, dsb.',
      });
    }
  });

  // Rule 2: Tolak animasi pada layout props
  const layoutPropRegex = /\btransition-\[(?:[^\]]*\b)?(width|height|top|left|right|bottom|margin|padding)\b/i;
  const cssLayoutTransitionRegex = /\btransition(?:-property)?\s*:\s*[^;]*(width|height|top|left|right|bottom|margin|padding)\b/i;
  lines.forEach((line, index) => {
    if (layoutPropRegex.test(line) || cssLayoutTransitionRegex.test(line)) {
      violations.push({
        rule: 'no-layout-prop-animation',
        file: normalizedPath,
        line: index + 1,
        message: 'Dilarang menganimasikan layout property (width, height, top, left, margin, padding). Gunakan transform/opacity.',
      });
    }
  });

  // Rule 3: Tolak durasi animasi > 500ms
  // Tailwind: duration-600, duration-700, duration-1000, duration-[600ms], duration-[0.6s], etc.
  const tailwindLongDurationRegex = /\bduration-(?:[6-9]\d{2}|\d{4,}|\[(?:[6-9]\d{2}|\d{4,})ms\]|\[(?:[1-9]\d*(?:\.\d+)?|0\.[6-9]\d*)s\])\b/;
  const cssLongDurationRegex = /\b(?:animation|transition)(?:-duration)?\s*:\s*[^;]*(?:[6-9]\d{2}|\d{4,})ms|\b(?:animation|transition)(?:-duration)?\s*:\s*[^;]*(?:[1-9]\d*(?:\.\d+)?|0\.[6-9]\d*)s/i;
  lines.forEach((line, index) => {
    if (line.includes('infinite')) return; // Abaikan looping ambient spinner/shimmer
    if (tailwindLongDurationRegex.test(line) || cssLongDurationRegex.test(line)) {
      violations.push({
        rule: 'max-duration-500ms',
        file: normalizedPath,
        line: index + 1,
        message: 'Durasi animasi melebihi batas maksimal 500ms (§0.5).',
      });
    }
  });

  // Rule 4: Tolak hardcoded hex (#...) di src/components/ dan src/app/**/page.tsx
  // Kecuali styleguide/page.tsx yang mendokumentasikan token palette resmi
  const isComponent = normalizedPath.includes('src/components/');
  const isPage = normalizedPath.includes('src/app/') && normalizedPath.endsWith('page.tsx');
  const isStyleguide = normalizedPath.includes('styleguide');

  if ((isComponent || isPage) && !isStyleguide) {
    lines.forEach((line, index) => {
      // Abaikan import, komentar, href="#...", URL fragment
      const cleanLine = line.trim();
      if (cleanLine.startsWith('//') || cleanLine.startsWith('/*') || cleanLine.startsWith('*')) return;
      if (/href=["']#[a-zA-Z0-9_-]*/.test(line)) return;

      // Match hex colors: #fff, #123456, #12345678
      const hexMatches = line.match(/#[0-9a-fA-F]{3,8}\b/g);
      if (hexMatches) {
        // Filter out matches that are part of id anchor links or markdown
        for (const hex of hexMatches) {
          // Verify it looks like a hex color and not an anchor reference
          if (/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(hex)) {
            violations.push({
              rule: 'no-raw-hex',
              file: normalizedPath,
              line: index + 1,
              message: `Ditemukan warna hex hardcoded (${hex}). Gunakan token warna Tailwind atau CSS vars.`,
            });
            break;
          }
        }
      }
    });
  }

  // Rule 5: Tolak class animasi di rute /igd
  if (normalizedPath.includes('src/app/igd')) {
    const igdAnimationRegex = /\b(?:animate-[a-z0-9_-]+|transition-[a-z0-9_[\]-]+|transition\b|duration-[a-z0-9_[\]-]+|active:scale-[0-9]+|hover:scale-[0-9]+|group-hover:scale-[0-9]+)\b/;
    lines.forEach((line, index) => {
      if (igdAnimationRegex.test(line)) {
        violations.push({
          rule: 'no-igd-animations',
          file: normalizedPath,
          line: index + 1,
          message: 'Dilarang menyertakan animasi/transisi pada rute darurat /igd (§0.5).',
        });
      }
    });
  }

  // Rule 6: Tolak elemen <img> atau <Image> tanpa alt
  if (normalizedPath.endsWith('.tsx') || normalizedPath.endsWith('.jsx')) {
    // Regex multiline untuk tag img / Image
    const imgTagRegex = /<(?:img|Image)\b([\s\S]*?)(?:\/?>)/g;
    let match;
    while ((match = imgTagRegex.exec(content)) !== null) {
      const tagContent = match[1];
      if (!/\balt\s*=/i.test(tagContent)) {
        // Hitung baris
        const textBefore = content.substring(0, match.index);
        const lineNumber = textBefore.split('\n').length;
        violations.push({
          rule: 'require-img-alt',
          file: normalizedPath,
          line: lineNumber,
          message: 'Elemen <img> atau <Image> wajib menyertakan atribut "alt" untuk aksesibilitas WCAG.',
        });
      }
    }
  }

  // Rule 7: Tolak <button> tanpa teks atau aria-label
  if (normalizedPath.endsWith('.tsx') || normalizedPath.endsWith('.jsx')) {
    const buttonTagRegex = /<button\b([\s\S]*?)>([\s\S]*?)<\/button>/g;
    let btnMatch;
    while ((btnMatch = buttonTagRegex.exec(content)) !== null) {
      const attrs = btnMatch[1];
      const inner = btnMatch[2].trim();

      const hasAriaLabel = /\baria-label(?:ledby)?\s*=/i.test(attrs);
      // Cek apakah tombol memiliki teks yang berarti di dalamnya
      // Hilangkan tag bersarang (misal <Icon ... />, <span ...></span>)
      const textWithoutTags = inner.replace(/<[^>]+>/g, '').trim();
      const hasVisibleText = textWithoutTags.length > 0;
      // Cek juga jika ada child dengan title atau text prop
      const hasTitleAttr = /\btitle\s*=/i.test(attrs);

      if (!hasAriaLabel && !hasVisibleText && !hasTitleAttr) {
        const textBefore = content.substring(0, btnMatch.index);
        const lineNumber = textBefore.split('\n').length;
        violations.push({
          rule: 'require-button-label',
          file: normalizedPath,
          line: lineNumber,
          message: '<button> wajib memiliki teks terbaca atau atribut "aria-label" untuk aksesibilitas.',
        });
      }
    }
  }

  return violations;
}

/**
 * Scan seluruh file terkait di src/
 */
export function scanCodebase(baseDir = ROOT_DIR) {
  const srcDir = path.join(baseDir, 'src');
  const allViolations = [];

  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        // Abaikan tests dari pengecekan hex langsung jika diinginkan, namun periksa seluruh src
        if (entry.name === '__tests__') continue;
        walk(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (['.tsx', '.ts', '.css', '.jsx'].includes(ext)) {
          const content = fs.readFileSync(fullPath, 'utf8');
          const relPath = path.relative(baseDir, fullPath);
          const fileViolations = validateContent(content, relPath);
          allViolations.push(...fileViolations);
        }
      }
    }
  }

  walk(srcDir);
  return allViolations;
}

// Eksekusi CLI jika dijalankan langsung
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  console.log('=== Memeriksa Kepatuhan Aturan UI & Motion Fase 12 ===');
  const violations = scanCodebase(ROOT_DIR);

  if (violations.length === 0) {
    console.log('[OK] Seluruh aturan UI terpenuhi:');
    console.log('  - Bebas transition: all & transition-all');
    console.log('  - Bebas animasi layout properties (width, height, dsb)');
    console.log('  - Seluruh durasi animasi <= 500ms');
    console.log('  - Bebas hardcoded hex di komponen & halaman');
    console.log('  - Bebas class animasi di rute darurat /igd');
    console.log('  - Seluruh <img> dan <Image> memiliki atribut alt');
    console.log('  - Seluruh <button> memiliki nama aksesibel (teks atau aria-label)');
    process.exit(0);
  } else {
    console.error(`[GAGAL] Ditemukan ${violations.length} pelanggaran aturan UI:\n`);
    violations.forEach((v) => {
      console.error(`  - [${v.rule}] ${v.file}:${v.line} -> ${v.message}`);
    });
    console.error('');
    process.exit(1);
  }
}
