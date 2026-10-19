import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Phase 4 Signature Features (Tower Directory & Registration Wizard)', () => {

  // SKENARIO 1: TOWER DIRECTORY INTERAKTIF & DEEP LINKING
  test('Tower Directory: navigasi lantai, deep-linking URL, dan transparansi K4', async ({ page }) => {
    // 1. Buka deep-link langsung ke Tower Lantai 4
    await page.goto('/tower?gedung=tower&lantai=4');

    // Verifikasi Lantai 4 terpilih
    const activeTab = page.locator('#floor-tab-4');
    await expect(activeTab).toHaveAttribute('aria-selected', 'true');

    // Verifikasi komponen BedStatus hadir di Lantai 4
    await expect(page.getByRole('heading', { name: 'Status Ketersediaan Kamar' })).toBeVisible();
    await expect(page.locator('text=Pusat Perawatan Kritis Terpadu').first()).toBeVisible();

    // 2. Beralih ke Gedung Graha
    await page.click('#tab-graha');
    await expect(page).toHaveURL(/.*gedung=graha.*/);

    // Verifikasi default Graha Lantai 0 (Ground)
    await expect(page.locator('text=Ground (Lantai Dasar)').first()).toBeVisible();
    await expect(page.locator('text=Pusat Poliklinik Rawat Jalan').first()).toBeVisible();

    // 3. Verifikasi Transparansi K4 pada Lantai Tertutup (Tower Lantai 13)
    await page.click('#tab-tower');
    await page.click('#floor-tab-13');
    await expect(page).toHaveURL(/.*gedung=tower&lantai=13.*/);

    // Memastikan label dan box K4 muncul tegas
    await expect(page.locator('text=Informasi Belum Tersedia').first()).toBeVisible();
    await expect(page.locator('text=Register Konflik K4 (Pencegahan Halusinasi)').first()).toBeVisible();

    // 4. Keyboard Navigation (ArrowUp / ArrowDown)
    const floorList = page.locator('[role="tablist"][aria-orientation="vertical"]');
    await floorList.focus();
    await page.keyboard.press('ArrowDown'); // Turun ke Lantai 12
    await expect(page).toHaveURL(/.*lantai=12.*/);
  });

  // SKENARIO 2: WIZARD PENDAFTARAN DEMO & PEMBUKTIAN ZERO NETWORK REQUESTS
  test('Registration Wizard: menyelesaikan 4 langkah dan membuktikan TEPAT 0 request jaringan saat submit', async ({ page }) => {
    await page.goto('/daftar');

    // LANGKAH 1: Pilih BPJS Kesehatan
    await expect(page.locator('text=Langkah 1 dari 4')).toBeVisible();
    await page.click('button:has-text("BPJS Kesehatan")');
    await page.click('button:has-text("Lanjut ke Pilih Poliklinik")');

    // LANGKAH 2: Pilih Poliklinik Penyakit Dalam
    await expect(page.locator('text=Langkah 2 dari 4')).toBeVisible();
    await page.click('button:has-text("Penyakit Dalam")');
    await page.click('button:has-text("Lanjut ke Dokter & Jadwal")');

    // LANGKAH 3: Pilih Dokter & Tanggal Praktik
    await expect(page.locator('text=Langkah 3 dari 4')).toBeVisible();
    // Pilih dokter pertama yang tersedia
    const doctorCard = page.locator('button:has-text("dr. Fauzi Rachman, Sp.PD")').first();
    await doctorCard.click();

    // Pilih slot tanggal praktik pertama
    const dateSlotBtn = page.locator('button:has-text("WIB")').first();
    await dateSlotBtn.click();

    await page.click('button:has-text("Lanjut ke Data Pasien")');

    // LANGKAH 4: Data Pasien & Submit
    await expect(page.locator('text=Langkah 4 dari 4')).toBeVisible();

    // Gunakan helper 1-klik simulasi data
    await page.click('button:has-text("Isi Data Simulasi Otomatis")');

    // Verifikasi field terisi
    await expect(page.locator('#patient-name')).toHaveValue('Ahmad Fauzi (Demo Pasien)');
    await expect(page.locator('#patient-phone')).toHaveValue('081234567890');
    await expect(page.locator('#patient-nik')).toHaveValue('3578012345670001');

    // PEMBUKTIAN KERAS ZERO NETWORK REQUESTS:
    // Pasang listener intersepsi pada seluruh outgoing network requests
    const outgoingRequests: string[] = [];
    page.on('request', (req) => {
      // Catat semua request kecuali asset Next.js / favicon / data uri
      const url = req.url();
      if (!url.includes('/_next/') && !url.startsWith('data:') && !url.includes('favicon')) {
        outgoingRequests.push(`${req.method()} ${url}`);
      }
    });

    // Klik tombol submit konfirmasi tiket antrean
    const submitBtn = page.locator('#btn-submit-registration');
    await submitBtn.click();

    // LANGKAH 5: Verifikasi Tiket Antrean Terbit
    await expect(page.locator('#printable-ticket')).toBeVisible();
    await expect(page.locator('text=Kode Registrasi Antrean:')).toBeVisible();
    await expect(page.locator('text=RSIS-PEN-')).toBeVisible();
    await expect(page.locator('text=Ahmad Fauzi (Demo Pasien)')).toBeVisible();

    // ASSERTION WAJIB: Tepat 0 outgoing network requests saat proses submit!
    expect(outgoingRequests).toEqual([]);
  });

  // SKENARIO 3: AUDIT AKSESIBILITAS AXE-CORE PADA /tower DAN /daftar
  const phase4Routes = ['/tower', '/daftar'];
  for (const route of phase4Routes) {
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
