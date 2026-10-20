import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const screenshotsDir = join(process.cwd(), 'docs', 'screenshots');
try {
  mkdirSync(screenshotsDir, { recursive: true });
} catch {
  // directory exists
}

const VIEWPORTS = [
  { name: 'mobile-small', width: 360, height: 640 },
  { name: 'mobile-standard', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 800 },
];

const ROUTES = [
  { path: '/', slug: 'home' },
  { path: '/igd', slug: 'igd' },
  { path: '/dokter', slug: 'dokter' },
  { path: '/tower', slug: 'tower' },
  { path: '/daftar', slug: 'daftar' },
  { path: '/tentang', slug: 'tentang' },
  { path: '/kontak', slug: 'kontak' },
  { path: '/layanan', slug: 'layanan' },
];

test.describe('Phase 6: Multi-Viewport Responsiveness & Visual Audit', () => {
  for (const vp of VIEWPORTS) {
    test.describe(`Viewport ${vp.name} (${vp.width}x${vp.height})`, () => {
      for (const route of ROUTES) {
        test(`Rute ${route.path} tidak memiliki horizontal overflow dan screenshot berhasil disimpan`, async ({ page }) => {
          await page.setViewportSize({ width: vp.width, height: vp.height });
          await page.goto(route.path, { waitUntil: 'domcontentloaded' });
          await page.waitForTimeout(300); // Tunggu rendering font dan animasi transisi selesai

          // Verifikasi tidak ada horizontal overflow (scrollWidth === clientWidth)
          const overflowInfo = await page.evaluate(() => {
            const docEl = document.documentElement;
            const body = document.body;
            const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
            const clientWidth = docEl.clientWidth;
            return {
              scrollWidth,
              clientWidth,
              hasOverflow: scrollWidth > clientWidth,
              difference: scrollWidth - clientWidth,
            };
          });

          if (overflowInfo.hasOverflow) {
            console.error(`Horizontal overflow terdeteksi pada ${route.path} @ ${vp.name}: diff ${overflowInfo.difference}px`);
          }

          expect(overflowInfo.hasOverflow).toBe(false);

          // Simpan screenshot visual untuk bukti dokumentasi
          const screenshotPath = join(screenshotsDir, `${route.slug}-${vp.name}.png`);
          await page.screenshot({ path: screenshotPath, fullPage: false });
        });
      }
    });
  }
});
