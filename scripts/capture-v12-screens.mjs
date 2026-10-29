/* global fetch, setTimeout */
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from '@playwright/test';

const chromePath = chromium.executablePath();

const VIEWPORTS = [
  { name: '360', width: 360, height: 640 },
  { name: '768', width: 768, height: 1024 },
  { name: '1280', width: 1280, height: 800 },
  { name: '1440', width: 1440, height: 900 },
];

const ROUTES = [
  { path: '/', slug: 'home' },
  { path: '/igd', slug: 'igd' },
  { path: '/dokter', slug: 'dokter' },
  { path: '/tower', slug: 'tower' },
  { path: '/daftar', slug: 'daftar' },
  { path: '/layanan', slug: 'layanan' },
  { path: '/login', slug: 'login' },
  { path: '/janji-temu', slug: 'janji-temu' },
  { path: '/tentang', slug: 'tentang' },
  { path: '/kontak', slug: 'kontak' },
];

const targetDirArg = process.argv[2] || 'docs/screens/v12-before';
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
  console.log(`=== Memulai Pengambilan Screenshot Multi-Viewport Fase 12 ===`);
  console.log(`Output Directory: ${outDir}`);

  let server = null;
  let serverStartedByUs = false;

  try {
    const checkRes = await fetch('http://localhost:3000/');
    if (checkRes.status === 200) {
      console.log('[OK] Server sudah berjalan di http://localhost:3000/\n');
    }
  } catch {
    console.log('Memulai server Next.js pada port 3000...');
    server = spawn('npm', ['run', 'start'], {
      shell: true,
      stdio: 'pipe',
    });
    serverStartedByUs = true;
    await waitForServer('http://localhost:3000/');
    console.log('[OK] Server siap di http://localhost:3000/\n');
  }

  const browser = await chromium.launch({
    executablePath: chromePath,
    headless: true,
  });

  try {
    for (const vp of VIEWPORTS) {
      console.log(`\n--- Viewport ${vp.name} (${vp.width}x${vp.height}) ---`);
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
      });
      const page = await context.newPage();

      for (const route of ROUTES) {
        const url = `http://localhost:3000${route.path}`;
        await page.goto(url, { waitUntil: 'networkidle' });
        await page.waitForTimeout(400); // buffer untuk render font

        const screenPath = join(outDir, `${route.slug}-${vp.name}.png`);
        await page.screenshot({ path: screenPath, fullPage: true });
        console.log(`  [Saved] ${route.path} -> ${route.slug}-${vp.name}.png`);
      }

      await context.close();
    }
    console.log(`\n[SUCCESS] Seluruh screenshot berhasil disimpan di ${outDir}`);
  } finally {
    await browser.close();
    if (serverStartedByUs && server) {
      server.kill();
    }
  }
}

run().catch((err) => {
  console.error('[CAPTURE-SCREENS ERROR]:', err);
  process.exit(1);
});
