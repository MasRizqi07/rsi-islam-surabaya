import { describe, it, expect } from 'vitest';
import { validateContent, scanCodebase } from '../../../scripts/check-ui-rules.mjs';

describe('UI Rules Checker (Fase 12)', () => {
  describe('Rule 1: no-transition-all', () => {
    it('menolak transition: all pada file CSS', () => {
      const css = '.card { transition: all 200ms ease; }';
      const violations = validateContent(css, 'src/app/globals.css');
      expect(violations.some((v) => v.rule === 'no-transition-all')).toBe(true);
    });

    it('menolak class transition-all pada file komponen TSX', () => {
      const tsx = '<button className="p-2 transition-all hover:bg-gold-500">Klik</button>';
      const violations = validateContent(tsx, 'src/components/MyButton.tsx');
      expect(violations.some((v) => v.rule === 'no-transition-all')).toBe(true);
    });

    it('menerima transisi properti spesifik', () => {
      const tsx = '<button className="p-2 transition-colors duration-150 hover:bg-gold-500">Klik</button>';
      const violations = validateContent(tsx, 'src/components/MyButton.tsx');
      expect(violations.filter((v) => v.rule === 'no-transition-all').length).toBe(0);
    });
  });

  describe('Rule 2: no-layout-prop-animation', () => {
    it('menolak animasi pada width atau height', () => {
      const tsx = '<div className="transition-[width] duration-200">Konten</div>';
      const violations = validateContent(tsx, 'src/components/Drawer.tsx');
      expect(violations.some((v) => v.rule === 'no-layout-prop-animation')).toBe(true);
    });

    it('menolak animasi pada margin atau padding di CSS', () => {
      const css = '.box { transition: margin 300ms ease; }';
      const violations = validateContent(css, 'src/app/globals.css');
      expect(violations.some((v) => v.rule === 'no-layout-prop-animation')).toBe(true);
    });

    it('menerima animasi pada transform dan opacity', () => {
      const tsx = '<div className="transition-transform duration-150">Konten</div>';
      const violations = validateContent(tsx, 'src/components/Card.tsx');
      expect(violations.filter((v) => v.rule === 'no-layout-prop-animation').length).toBe(0);
    });
  });

  describe('Rule 3: max-duration-500ms', () => {
    it('menolak durasi lebih dari 500ms di Tailwind (misal duration-700)', () => {
      const tsx = '<div className="transition-transform duration-700">Lambat</div>';
      const violations = validateContent(tsx, 'src/components/Hero.tsx');
      expect(violations.some((v) => v.rule === 'max-duration-500ms')).toBe(true);
    });

    it('menolak durasi CSS lebih dari 500ms (misal 1s atau 800ms)', () => {
      const css = '.slow { animation-duration: 800ms; }';
      const violations = validateContent(css, 'src/app/globals.css');
      expect(violations.some((v) => v.rule === 'max-duration-500ms')).toBe(true);
    });

    it('menerima durasi mikro <= 500ms (misal duration-150, duration-200, duration-300)', () => {
      const tsx = '<div className="transition-transform duration-300">Cepat</div>';
      const violations = validateContent(tsx, 'src/components/Hero.tsx');
      expect(violations.filter((v) => v.rule === 'max-duration-500ms').length).toBe(0);
    });
  });

  describe('Rule 4: no-raw-hex', () => {
    it('menolak warna hex hardcoded di file komponen src/components/', () => {
      const tsx = '<div style={{ color: "#063B36" }}>Teks Hijau</div>';
      const violations = validateContent(tsx, 'src/components/Badge.tsx');
      expect(violations.some((v) => v.rule === 'no-raw-hex')).toBe(true);
    });

    it('menolak warna hex hardcoded di page.tsx', () => {
      const tsx = '<div className="bg-[#04231F]">Hero</div>';
      const violations = validateContent(tsx, 'src/app/page.tsx');
      expect(violations.some((v) => v.rule === 'no-raw-hex')).toBe(true);
    });

    it('mengizinkan file styleguide mendokumentasikan nilai hex palette resmi', () => {
      const tsx = '{ token: "tower-950", hex: "#04231F" }';
      const violations = validateContent(tsx, 'src/app/styleguide/page.tsx');
      expect(violations.filter((v) => v.rule === 'no-raw-hex').length).toBe(0);
    });

    it('mengizinkan token CSS vars atau kelas Tailwind', () => {
      const tsx = '<div className="bg-tower-950 text-ivory">Hero</div>';
      const violations = validateContent(tsx, 'src/components/Badge.tsx');
      expect(violations.filter((v) => v.rule === 'no-raw-hex').length).toBe(0);
    });
  });

  describe('Rule 5: no-igd-animations', () => {
    it('menolak animasi di rute /igd', () => {
      const tsx = '<button className="animate-pulse">Emergency</button>';
      const violations = validateContent(tsx, 'src/app/igd/page.tsx');
      expect(violations.some((v) => v.rule === 'no-igd-animations')).toBe(true);
    });

    it('menolak transisi dan hover scaling di rute /igd', () => {
      const tsx = '<div className="group-hover:scale-110 transition-transform">Icon</div>';
      const violations = validateContent(tsx, 'src/app/igd/page.tsx');
      expect(violations.some((v) => v.rule === 'no-igd-animations')).toBe(true);
    });

    it('menerima elemen IGD statis kontras tinggi', () => {
      const tsx = '<a href="tel:119" className="bg-alert-600 text-white font-bold min-h-[56px]">Hubungi IGD</a>';
      const violations = validateContent(tsx, 'src/app/igd/page.tsx');
      expect(violations.filter((v) => v.rule === 'no-igd-animations').length).toBe(0);
    });
  });

  describe('Rule 6: require-img-alt', () => {
    it('menolak elemen <Image> tanpa atribut alt', () => {
      const tsx = '<Image src="/assets/rsi.jpg" fill className="object-cover" />';
      const violations = validateContent(tsx, 'src/components/Hero.tsx');
      expect(violations.some((v) => v.rule === 'require-img-alt')).toBe(true);
    });

    it('menolak elemen <img> tanpa atribut alt', () => {
      const tsx = '<img src="/logo.svg" width="100" height="100" />';
      const violations = validateContent(tsx, 'src/components/Logo.tsx');
      expect(violations.some((v) => v.rule === 'require-img-alt')).toBe(true);
    });

    it('menerima elemen yang menyertakan atribut alt', () => {
      const tsx = '<Image src="/assets/rsi.jpg" alt="Fasad Gedung" fill />';
      const violations = validateContent(tsx, 'src/components/Hero.tsx');
      expect(violations.filter((v) => v.rule === 'require-img-alt').length).toBe(0);
    });
  });

  describe('Rule 7: require-button-label', () => {
    it('menolak tombol ikon tanpa teks dan tanpa aria-label', () => {
      const tsx = '<button type="button" onClick={toggle}><Menu className="w-5 h-5" /></button>';
      const violations = validateContent(tsx, 'src/components/Header.tsx');
      expect(violations.some((v) => v.rule === 'require-button-label')).toBe(true);
    });

    it('menerima tombol dengan atribut aria-label', () => {
      const tsx = '<button type="button" aria-label="Buka menu navigasi" onClick={toggle}><Menu className="w-5 h-5" /></button>';
      const violations = validateContent(tsx, 'src/components/Header.tsx');
      expect(violations.filter((v) => v.rule === 'require-button-label').length).toBe(0);
    });

    it('menerima tombol dengan teks terbaca di dalamnya', () => {
      const tsx = '<button type="button"><span>Kirim Pendaftaran</span></button>';
      const violations = validateContent(tsx, 'src/components/Form.tsx');
      expect(violations.filter((v) => v.rule === 'require-button-label').length).toBe(0);
    });
  });

  describe('Codebase Scan Integration', () => {
    it('memverifikasi bahwa seluruh codebase saat ini lulus pengecekan aturan UI (0 pelanggaran)', () => {
      const violations = scanCodebase();
      if (violations.length > 0) {
        console.error('Violations found in active codebase:', violations);
      }
      expect(violations).toEqual([]);
    });
  });
});
