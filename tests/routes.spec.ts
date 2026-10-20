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

  // SKENARIO 5: VERIFIKASI KONTRAS HERO BERANDA & WARNA LATAR TOWER-900
  test('Hero section Beranda menggunakan latar solid rgb(6, 59, 54) dengan rasio kontras >= 7:1', async ({ page }) => {
    await page.goto('/');

    const heroSection = page.locator('#hero-section');
    await expect(heroSection).toBeVisible();

    const heroStyle = await heroSection.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Latar belakang hero harus merupakan warna gelap solid tower-900
    expect(heroStyle).toBe('rgb(6, 59, 54)');

    // Hitung kontras teks h1 dan paragraf terhadap latar hero
    const contrastData = await page.evaluate(() => {
      function parseRgb(colorStr: string): [number, number, number] {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d');
        if (!ctx) return [0, 0, 0];
        ctx.fillStyle = colorStr;
        ctx.fillRect(0, 0, 1, 1);
        const data = ctx.getImageData(0, 0, 1, 1).data;
        return [data[0], data[1], data[2]];
      }

      function getLuminance(r: number, g: number, b: number): number {
        const [rs, gs, bs] = [r / 255, g / 255, b / 255].map((c) =>
          c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
        );
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
      }

      function calcContrast(c1: string, c2: string): number {
        const rgb1 = parseRgb(c1);
        const rgb2 = parseRgb(c2);
        const l1 = getLuminance(...rgb1);
        const l2 = getLuminance(...rgb2);
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        return (lighter + 0.05) / (darker + 0.05);
      }

      const hero = document.getElementById('hero-section');
      if (!hero) return null;

      const heroBg = window.getComputedStyle(hero).backgroundColor;
      const h1 = hero.querySelector('h1');
      const p = hero.querySelector('p');

      const h1Color = h1 ? window.getComputedStyle(h1).color : '';
      const pColor = p ? window.getComputedStyle(p).color : '';

      return {
        heroBg,
        h1Color,
        pColor,
        h1Contrast: calcContrast(h1Color, heroBg),
        pContrast: calcContrast(pColor, heroBg),
      };
    });

    expect(contrastData).not.toBeNull();
    if (contrastData) {
      expect(contrastData.h1Contrast).toBeGreaterThanOrEqual(7.0);
      expect(contrastData.pContrast).toBeGreaterThanOrEqual(7.0);
    }
  });

  // SKENARIO 6: 0 CONSOLE ERROR & 0 PAGE ERROR PADA RUTE UTAMA
  test('Rute utama bebas dari console error, hydration warning, dan pageerror', async ({ page }) => {
    const errorLogs: string[] = [];

    page.on('pageerror', (err) => {
      errorLogs.push(`[PageError] ${err.message}`);
    });

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errorLogs.push(`[ConsoleError] ${msg.text()}`);
      }
    });

    await page.goto('/');
    await page.goto('/daftar');
    await page.goto('/tower');
    await page.goto('/dokter');

    // Filter out external network failures if any (e.g. font CDNs / favicons)
    const criticalErrors = errorLogs.filter(
      (msg) => !msg.includes('favicon') && !msg.includes('chrome-extension')
    );

    expect(criticalErrors).toEqual([]);
  });

  // SKENARIO 7: PEMADATAN TATA LETAK ABOVE-THE-FOLD DI /daftar (1280x800)
  test('Langkah 1 pendaftaran tampil utuh above-the-fold di resolusi desktop 1280x800', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/daftar');

    const cardBpjs = page.locator('button:has-text("BPJS Kesehatan")').first();
    const cardUmum = page.locator('button:has-text("Pasien Umum (Mandiri)")').first();
    const cardAsuransi = page.locator('button:has-text("Asuransi Swasta")').first();

    await expect(cardBpjs).toBeVisible();
    await expect(cardUmum).toBeVisible();
    await expect(cardAsuransi).toBeVisible();

    const boxBpjs = await cardBpjs.boundingBox();
    const boxUmum = await cardUmum.boundingBox();
    const boxAsuransi = await cardAsuransi.boundingBox();

    expect(boxBpjs).not.toBeNull();
    expect(boxUmum).not.toBeNull();
    expect(boxAsuransi).not.toBeNull();

    if (boxBpjs && boxUmum && boxAsuransi) {
      // Seluruh 3 kartu opsi penjamin harus selesai dirender sebelum batas lipatan 800px
      expect(boxBpjs.y + boxBpjs.height).toBeLessThan(800);
      expect(boxUmum.y + boxUmum.height).toBeLessThan(800);
      expect(boxAsuransi.y + boxAsuransi.height).toBeLessThan(800);
    }
  });

});
