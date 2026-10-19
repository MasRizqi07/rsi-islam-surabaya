import { writeFileSync, mkdirSync } from 'node:fs';

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrast(hex1, hex2) {
  const lum1 = getLuminance(...hexToRgb(hex1));
  const lum2 = getLuminance(...hexToRgb(hex2));
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

const colorPairs = [
  { name: 'Ink on Ivory (Body text)', fg: '#10201E', bg: '#FBF8F1', min: 4.5 },
  { name: 'Ink-Soft on Ivory (Secondary text)', fg: '#4B5F5C', bg: '#FBF8F1', min: 4.5 },
  { name: 'Tower-800 on Ivory (Headings / Primary)', fg: '#0A4F48', bg: '#FBF8F1', min: 4.5 },
  { name: 'Tower-700 on Ivory (Active icons)', fg: '#0F6B61', bg: '#FBF8F1', min: 4.5 },
  { name: 'Tower-600 on Ivory (Links)', fg: '#13786D', bg: '#FBF8F1', min: 4.5 },
  { name: 'Gold-700 on Ivory (Accent text)', fg: '#8A6A14', bg: '#FBF8F1', min: 4.5 },
  { name: 'Ivory on Tower-800 (Primary button text)', fg: '#FBF8F1', bg: '#0A4F48', min: 4.5 },
  { name: 'Ivory on Tower-900 (Header text)', fg: '#FBF8F1', bg: '#063B36', min: 4.5 },
  { name: 'Ivory on Tower-950 (Footer text)', fg: '#FBF8F1', bg: '#04231F', min: 4.5 },
  { name: 'Gold-300 on Tower-900 (Dark hero accent)', fg: '#E3CB8A', bg: '#063B36', min: 4.5 },
  { name: 'Gold-300 on Tower-950 (Footer gold accent)', fg: '#E3CB8A', bg: '#04231F', min: 4.5 },
  { name: 'Ivory on Alert-600 (Emergency button text)', fg: '#FBF8F1', bg: '#C62F2F', min: 4.5 },
  { name: 'Alert-600 on Alert-50 (Alert box message)', fg: '#C62F2F', bg: '#FDECEC', min: 4.5 },
  { name: 'Tower-950 on Gold-100 (Highlight badge text)', fg: '#04231F', bg: '#F4EBD0', min: 4.5 },
];

console.log('=== WCAG 2.2 AA Contrast Ratio Verification ===\n');

let failed = 0;
const results = [];

for (const pair of colorPairs) {
  const ratio = getContrast(pair.fg, pair.bg);
  const passed = ratio >= pair.min;
  results.push({
    name: pair.name,
    foreground: pair.fg,
    background: pair.bg,
    ratio: Number(ratio.toFixed(2)),
    minRequired: pair.min,
    passed
  });
  console.log(`${passed ? '[PASS]' : '[FAIL]'} ${pair.name}: ${ratio.toFixed(2)}:1 (Min: ${pair.min}:1)`);
  if (!passed) failed++;
}

mkdirSync('docs/evidence', { recursive: true });
writeFileSync(
  'docs/evidence/contrast-results.json',
  JSON.stringify({ timestamp: new Date().toISOString(), totalChecked: colorPairs.length, failed, results }, null, 2),
  'utf8'
);

if (failed > 0) {
  console.error(`\n[FATAL] Gagal pada ${failed} pasangan warna!`);
  process.exit(1);
} else {
  console.log(`\n[SUCCESS] Seluruh ${colorPairs.length} pasangan warna token lolos standar WCAG 2.2 AA (>= 4.5:1).`);
}
