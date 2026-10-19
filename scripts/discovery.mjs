import { execSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { platform, arch, cpus, totalmem } from 'node:os';

console.log('=== FASE 0: DISCOVERY & ENVIRONMENT VERIFICATION ===');

const pkgs = [
  'next',
  'react',
  'react-dom',
  'tailwindcss',
  '@tailwindcss/postcss',
  'postcss',
  'lucide-react',
  'zustand',
  'zod',
  'vitest',
  '@playwright/test',
  '@axe-core/playwright',
  'motion',
  'clsx',
  'tailwind-merge',
  'typescript',
  '@types/node',
  '@types/react',
  '@types/react-dom',
  'eslint',
  'eslint-config-next'
];

const packageVersions = {};
for (const pkg of pkgs) {
  try {
    const ver = execSync(`npm view ${pkg} version`, { encoding: 'utf8' }).trim();
    packageVersions[pkg] = ver;
    console.log(`[VERIFIED] ${pkg}: ${ver}`);
  } catch (err) {
    packageVersions[pkg] = `ERROR: ${err.message}`;
    console.error(`[FAILED] ${pkg}: ${err.message}`);
  }
}

const discoveryData = {
  timestamp: new Date().toISOString(),
  phase: 'Phase 0 - Discovery & Environment Verification',
  status: 'COMPLETED',
  environment: {
    nodeVersion: process.version,
    npmVersion: execSync('npm -v', { encoding: 'utf8' }).trim(),
    platform: platform(),
    arch: arch(),
    cpus: cpus().length,
    totalMemoryGB: (totalmem() / (1024 ** 3)).toFixed(2)
  },
  verifiedPackageVersions: packageVersions,
  decisions: {
    framework: 'Next.js 15+ (App Router)',
    rendering: 'Static Site Generation (SSG)',
    styling: 'Tailwind CSS v4 CSS-first (@theme)',
    iconography: 'lucide-react',
    state: 'URL Query String + Zustand (Demo Wizard only, in-memory)',
    validation: 'Zod (fixtures & form)',
    testing: 'Vitest (data logic) + Playwright (E2E) + @axe-core/playwright (a11y)',
    automation: 'Node.js ESM (.mjs) cross-platform for Windows pwsh'
  }
};

mkdirSync('docs/evidence', { recursive: true });
writeFileSync('docs/evidence/phase-0-discovery.json', JSON.stringify(discoveryData, null, 2), 'utf8');

console.log('\n[SUCCESS] Discovery data saved to docs/evidence/phase-0-discovery.json');
