import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Phase 5 Secondary Routes, Service Details & A11y', () => {

  // SKENARIO 1: HALAMAN TENTANG KAMI
  test('Halaman Tentang Kami: memuat fakta historis 1975, akreditasi K3, dan garis waktu sejarah', async ({ page }) => {
    await page.goto('/tentang');

    // Headline utama
    await expect(page.locator('text=51 Tahun Merawat Insan')).toBeVisible();

    // Fakta historis
    await expect(page.locator('text=1975').first()).toBeVisible();
    await expect(page.locator('text=Kelas B').first()).toBeVisible();
    await expect(page.locator('text=238').first()).toBeVisible();

    // Rekam jejak akreditasi K3
    await expect(page.locator('text=Rekam Jejak Akreditasi Paripurna')).toBeVisible();
    await expect(page.locator('text=LAM-KPRS').first()).toBeVisible();

    // Garis waktu sejarah Lampiran C
    await expect(page.locator('text=Kronologi Sejarah RS Islam Surabaya A. Yani')).toBeVisible();
    await expect(page.locator('text=Awal Pengabdian & Peresmian')).toBeVisible();
    await expect(page.locator('text=Peresmian Tower 13 Lantai oleh Presiden RI')).toBeVisible();
    await expect(page.locator('text=51 Tahun Mengabdi & Transformasi Digital')).toBeVisible();
  });

  // SKENARIO 2: HALAMAN KONTAK & LOKASI
  test('Halaman Kontak: memuat kontak darurat ganda, peta arsitektural SVG, dan tombol Google Maps resmi', async ({ page }) => {
    await page.goto('/kontak');

    // Dual emergency contacts in main content
    await expect(page.locator('#main-content a[href="tel:1500718"]').first()).toBeVisible();
    await expect(page.locator('#main-content a[href="tel:0811233999"]').first()).toBeVisible();

    // Telepon sentral & alamat fisik
    await expect(page.locator('text=(031) 8284505').first()).toBeVisible();
    await expect(page.locator('text=Jl. Achmad Yani No. 2-4, Wonokromo, Surabaya 60243').first()).toBeVisible();

    // Peta SVG arsitektural
    const svgMap = page.locator('svg[aria-label*="Peta diagram skematis akses Jl. Achmad Yani"]');
    await expect(svgMap).toBeVisible();

    // Tombol Google Maps resmi (eksternal tanpa iframe)
    const gmapsBtn = page.locator('a:has-text("Buka Arah di Google Maps")');
    await expect(gmapsBtn).toBeVisible();
    await expect(gmapsBtn).toHaveAttribute('href', 'https://maps.app.goo.gl/u2JxcgMixBtpgmUj9');
  });

  // SKENARIO 3: DETAIL LAYANAN UNGGULAN (SSG)
  test('Halaman Detail Layanan: rute dinamis /layanan/hemodialisis menampilkan integrasi gedung dan dokter terkait', async ({ page }) => {
    await page.goto('/layanan/hemodialisis');

    // Judul layanan
    await expect(page.locator('h1:has-text("Unit Hemodialisis Modern (30 Mesin)")')).toBeVisible();

    // Tautan lokasi gedung & lantai menuju Tower Directory
    const floorLink = page.locator('a:has-text("Gedung Graha Lantai 1")');
    await expect(floorLink).toBeVisible();
    await expect(floorLink).toHaveAttribute('href', '/tower?gedung=graha&lantai=1');

    // Dokter spesialis terkait
    await expect(page.locator('h2:has-text("Dokter Spesialis Terkait")')).toBeVisible();

    // Sumber data publik resmi
    await expect(page.locator('text=Sumber Publik:')).toBeVisible();
  });

  // SKENARIO 4: AUDIT AKSESIBILITAS AXE-CORE PADA RUTE FASE 5
  const phase5Routes = ['/tentang', '/kontak', '/layanan/hemodialisis', '/layanan/igd'];
  for (const route of phase5Routes) {
    test(`Axe-core A11y Audit pada rute ${route} bebas dari pelanggaran serious/critical`, async ({ page }) => {
      await page.goto(route);
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      const seriousOrCritical = accessibilityScanResults.violations.filter(
        (v) => v.impact === 'serious' || v.impact === 'critical'
      );

      if (seriousOrCritical.length > 0) {
        console.error(`Pelanggaran aksesibilitas pada ${route}:`, JSON.stringify(seriousOrCritical, null, 2));
      }

      expect(seriousOrCritical).toEqual([]);
    });
  }

});
