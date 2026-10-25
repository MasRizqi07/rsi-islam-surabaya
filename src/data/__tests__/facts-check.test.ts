import { describe, it, expect } from 'vitest';
import { scanContentForViolations, runFactsCheck } from '../../../scripts/check-facts.mjs';

describe('Hospital Facts & Anti-Regression Scanner (R8 Fase 5.1)', () => {
  describe('Kasus Lolos (Passing Cases)', () => {
    it('konten bebas klaim terlarang menghasilkan tepat 0 pelanggaran', () => {
      const cleanContent = `
        export const HOSPITAL_NAME = 'RS Islam Surabaya A. Yani';
        export const MOTTO = 'Pelayanan Medis Islami Modern';
      `;
      const violations = scanContentForViolations(cleanContent, 'src/data/sample.ts', true);
      expect(violations).toHaveLength(0);
    });

    it('penyebutan HSTS diizinkan jika konfigurasi next.config.mjs memuat HSTS', () => {
      const content = 'Header HTTP memuat HSTS dengan durasi 2 tahun.';
      const violations = scanContentForViolations(content, 'docs/sample.md', true);
      expect(violations).toHaveLength(0);
    });

    it('pemindaian repositori aktif mengembalikan status lolos (exitCode: 0)', () => {
      const result = runFactsCheck();
      expect(result.exitCode).toBe(0);
      expect(result.violations).toHaveLength(0);
    });
  });

  describe('Kasus Gagal (Failing Cases)', () => {
    it('mendeteksi dan menolak klaim unverified presiden ke-2 (R1)', () => {
      const content = 'Rumah sakit didirikan dan diresmikan oleh Presiden ' + 'Soe' + 'harto' + ' pada tahun 1975.';
      const violations = scanContentForViolations(content, 'src/app/sample.tsx', true);
      expect(violations.some((v: { rule: string }) => v.rule.includes('Soe' + 'harto'))).toBe(true);
    });

    it('mendeteksi dan menolak klaim WA Darurat fiktif (R1)', () => {
      const content = 'Layanan ' + 'Whats' + 'App ' + 'Darurat' + ' 24 jam dapat dihubungi segera.';
      const violations = scanContentForViolations(content, 'src/app/sample.tsx', true);
      expect(violations.some((v: { rule: string }) => v.rule.includes('Whats' + 'App'))).toBe(true);
    });

    it('mendeteksi dan menolak Bintang Lima jika tidak didampingi sourceNote (R8)', () => {
      const content = 'Akreditasi KARS Paripurna Bintang Lima tanpa catatan verifikasi.';
      const violations = scanContentForViolations(content, 'src/data/sample.ts', true);
      expect(violations.some((v: { rule: string }) => v.rule.includes('Bintang Lima'))).toBe(true);
    });

    it('mendeteksi dan menolak superlatif R7 tanpa sourceNote (R7/R8)', () => {
      const testCases = [
        'mutu pelayanan ' + 'ter' + 'tinggi',
        'rumah sakit terbaik di Jawa Timur',
        'garda terdepan kesehatan',
        'fasilitas terlengkap se-Surabaya',
        'layanan nomor satu di kelasnya',
        'keunggulan utama gedung',
      ];

      for (const phrase of testCases) {
        const violations = scanContentForViolations(`Pelayanan ini memiliki ${phrase}.`, 'src/sample.ts', true);
        expect(violations.some((v: { rule: string }) => v.rule.includes('Superlatif R7'))).toBe(true);
      }
    });

    it('mendeteksi dan menolak klaim CSP ketat (R3)', () => {
      const content = 'Aplikasi ini menggunakan CSP ketat untuk memblokir script eksternal.';
      const violations = scanContentForViolations(content, 'docs/sample.md', true);
      expect(violations.some((v: { rule: string }) => v.rule.includes('CSP ketat'))).toBe(true);
    });

    it('mendeteksi pelanggaran menyebut HSTS jika next.config.mjs tidak mengonfigurasikannya (R8)', () => {
      const content = 'Aplikasi menggunakan HSTS untuk proteksi TLS transport.';
      const violations = scanContentForViolations(content, 'docs/sample.md', false);
      expect(violations.some((v: { rule: string }) => v.rule.includes('HSTS'))).toBe(true);
    });

    it('mendeteksi kebocoran hardcode nomor darurat pada komponen UI', () => {
      const content = '<a href="tel:1500718">Call 1500718</a>';
      const violations = scanContentForViolations(content, 'src/components/sample.tsx', true);
      expect(violations.some((v: { rule: string }) => v.rule.includes('1500718'))).toBe(true);
    });

    it('mendeteksi dan menolak skema/field nomor identitas 16 digit terlarang (C4)', () => {
      const content = 'const schema = z.object({ nomorIdentitasContoh: z.string().regex(/^\\d{16}$/) });';
      const violations = scanContentForViolations(content, 'src/data/schema.ts', true);
      expect(violations.some((v: { rule: string }) => v.rule.includes('nomor identitas 16 digit'))).toBe(true);
    });

    it('mendeteksi dan menolak pola fallback secret process.env.*SECRET* || (S-2)', () => {
      const content = "const sec = process.env.MY_SECRET || 'fallback_dummy';";
      const violations = scanContentForViolations(content, 'src/lib/sample.ts', true);
      expect(violations.some((v: { rule: string }) => v.rule.includes('Pola fallback secret'))).toBe(true);
    });

    it('mendeteksi dan menolak nilai hex 64 karakter yang pernah bocor di riwayat (S-2)', () => {
      const leakedHex = 'f6c8d7e9' + 'a1b2c3d4' + 'e5f6a7b8' + 'c9d0e1f2' + 'a3b4c5d6' + 'e7f8a9b0' + 'c1d2e3f4' + 'a5b6c7d8';
      const content = `BETTER_AUTH_SECRET="${leakedHex}"`;
      const violations = scanContentForViolations(content, '.env.example', true);
      expect(violations.some((v: { rule: string }) => v.rule.includes('Hex secret 64 karakter'))).toBe(true);
    });
  });
});
