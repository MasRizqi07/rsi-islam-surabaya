import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Phase 3 Core Routes & Workflows', () => {

  // SKENARIO 1: FILTER DOKTER & SINKRONISASI SEARCHPARAMS
  test('Filter dokter menyinkronkan query string ke URL dan memulihkan state', async ({ page }) => {
    await page.goto('/dokter');

    // Pastikan halaman memuat judul utama
    await expect(page.locator('h1')).toContainText('Temukan Dokter & Jadwal Praktik');

    // Pilih poliklinik penyakit dalam
    const specialtySelect = page.locator('#filter-specialty');
    await specialtySelect.selectOption('penyakit-dalam');

    // Pilih hari senin
    const daySelect = page.locator('#filter-day');
    await daySelect.selectOption('senin');

    // Verifikasi URL SearchParams berubah
    await expect(page).toHaveURL(/.*spesialis=penyakit-dalam.*/);
    await expect(page).toHaveURL(/.*hari=senin.*/);

    // Verifikasi kartu dokter menampilkan dokter terkait
    const doctorCards = page.locator('text=dr. Fauzi Rachman');
    await expect(doctorCards.first()).toBeVisible();

    // Verifikasi lencana "Ilustrasi" hadir pada kartu dokter
    const ilustrasiBadges = page.locator('text=Ilustrasi');
    await expect(ilustrasiBadges.first()).toBeVisible();

    // Buka URL langsung di tab baru (memulihkan state)
    await page.goto('/dokter?spesialis=penyakit-dalam&hari=senin');
    await expect(page.locator('#filter-specialty')).toHaveValue('penyakit-dalam');
    await expect(page.locator('#filter-day')).toHaveValue('senin');
  });

  // SKENARIO 2: KETERLIHATAN TOMBOL DARURAT DI IGD (MOBILE 360x640)
  test('Halaman IGD menampilkan tombol tel darurat dan Google Maps above-the-fold', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    await page.goto('/igd');

    // Tombol Emergency Call 1500718 di main content
    const emergencyCallBtn = page.locator('#main-content a[href="tel:1500718"]').first();
    await expect(emergencyCallBtn).toBeVisible();

    // Tombol Ambulans 08 112 33 999 di main content
    const ambulanceBtn = page.locator('#main-content a[href="tel:0811233999"]').first();
    await expect(ambulanceBtn).toBeVisible();

    // Tombol Buka di Google Maps
    const mapsBtn = page.locator('#main-content a:has-text("Buka di Google Maps")');
    await expect(mapsBtn).toBeVisible();

    // Verifikasi posisi tombol berada di area above-the-fold (< 640px)
    const box = await emergencyCallBtn.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.y + box.height).toBeLessThan(640);
    }
  });

  // SKENARIO 3: FLOATING DOCK DARURAT PADA BERANDA MOBILE
  test('Beranda mobile memiliki floating bottom emergency dock', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    await page.goto('/');

    const mobileDock = page.locator('[aria-label="Akses Cepat Darurat Mobile"]');
    await expect(mobileDock).toBeVisible();

    // Terdapat dua nomor darurat di dock
    await expect(mobileDock.locator('a[href="tel:1500718"]')).toBeVisible();
    await expect(mobileDock.locator('a[href="tel:0811233999"]')).toBeVisible();
  });

  // SKENARIO 4: AUDIT AKSESIBILITAS AXE-CORE PADA 4 RUTE
  const routesToAudit = ['/', '/igd', '/dokter', '/layanan'];
  for (const route of routesToAudit) {
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
