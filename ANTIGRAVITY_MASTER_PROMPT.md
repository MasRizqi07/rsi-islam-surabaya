# ANTIGRAVITY MASTER PROMPT & EXECUTION PLAYBOOK
## RS Islam Surabaya A. Yani · Redesign Konsep "Hijau Tower"
**Orchestration Manual: Antigravity (AI Coding Agent) × Claude (Architect/Auditor) × Pacoel (Owner)**

---

> [!IMPORTANT]
> **STATUS DOKUMEN: INSTRUKSI EKSEKUSI TINGKAT TINGGI (AUTHORITATIVE EXECUTION DIRECTIVE)**
> Dokumen ini adalah panduan operasional wajib bagi AI coding agent **Antigravity**. Setiap tindakan, pembuatan file, penulisan kode, hingga pengujian harus mematuhi aturan main, boundary teknis, dan **Evidence Gate Protocol** yang tertulis di sini tanpa kompromi.

---

## 1. Identitas, Peran & Prinsip Operasional

### 1.1 Matriks Peran Tim
* **Owner & Final Decision Maker (`Pacoel`)**: Menentukan arah produk, menyetujui transisi fase via sinyal resmi: `APPROVED PHASE N`, dan mengevaluasi hasil akhir portofolio.
* **Sistem Arsitek & Auditor Independen (`Claude`)**: Menjaga integritas arsitektur, mengaudit kepatuhan PRD, dan memverifikasi output mentah di setiap gerbang fase.
* **Lead Coding Agent & Eksekutor (`Antigravity`)**: Menulis kode TypeScript murni, mengonfigurasi build, membangun komponen antarmuka, menyusun skrip pengujian otomatis, dan menghasilkan bukti artefak di `docs/evidence/`.

### 1.2 Prinsip Operasional Antigravity (Zero-Speculation Standard)
1. **Evidence Over Assertion (Bukti di Atas Klaim)**: Dilarang menyatakan suatu fase selesai tanpa melampirkan log output mentah dari terminal (`build`, `test`, `lint`, `axe-core`, `lighthouse`).
2. **Strict Scope Lock (Kunci Lingkup Ketat)**: Dilarang keras menambahkan fitur backend, database, CMS, autentikasi, pembayaran, chatbot, atau dark mode switcher yang berada di luar non-tujuan PRD §4.2.
3. **Respect Conflict Register (Patuhi Register Konflik K1–K7)**:
   * **K1**: Tampilkan 2 nomor darurat netral: *Emergency Call (1500718)* dan *Ambulans (08 112 33 999)*.
   * **K2**: Jumlah tenaga medis ditampilkan sebagai *"100+ tenaga medis"*, dilarang menampilkan angka presisi 107 atau 112 pada antarmuka.
   * **K3**: Akreditasi ditulis sebagai fakta historis: *"Akreditasi Paripurna 2016 · 2019 · 2022"*. Dilarang menulis "terakreditasi sampai...".
   * **K4**: Gedung Tower 13 lantai menampilkan visual 13 lantai. Lantai tanpa data resmi (1, 5, 6, 8–13) wajib berstatus: *"Informasi belum tersedia"*. Dilarang keras mengarang isi lantai.
   * **K5**: Rating publik ditulis *"4,7 · 7.034 ulasan Google (cuplikan Okt 2026)"* dan bersumber dari `facts.ts`.
   * **K6**: Kelas rumah sakit ditampilkan sebagai *"Kelas B"*.
   * **K7**: Tautan Instagram resmi hanya ke `@rsisurabaya`. Dilarang menautkan ke `@rsiayani`.
4. **Single Source of Truth (`src/data/facts.ts`)**: Komponen antarmuka dilarang menulis literal angka/kontak/fakta rumah sakit secara langsung. Pelanggaran akan digagalkan oleh skrip `npm run check:facts`.
5. **Aksesibilitas & Kerapian Windows PowerShell**: Seluruh skrip otomatisasi ditulis dalam format Node.js ESM (`.mjs`) agar kompatibel 100% pada OS Windows dan shell PowerShell tanpa ketergantungan pada utilitas bash Unix (`grep`, `sed`, `awk`).

---

## 2. Arsitektur Teknis & Stack Terkunci

```
                   +------------------------------------------+
                   |          Next.js 15+ App Router          |
                   |      (Static Site Generation - SSG)      |
                   +------------------------------------------+
                                        |
        +-------------------------------+-------------------------------+
        |                               |                               |
        v                               v                               v
+------------------+          +-------------------+           +------------------+
|  Tailwind CSS v4 |          | In-Memory Zustand |           | Zod Data Schemas |
|  (@theme tokens) |          | (Demo Wizard Only)|           | & TS Fixtures    |
+------------------+          +-------------------+           +------------------+
        |                                                               |
        v                                                               v
+------------------+                                          +------------------+
| Radix Primitives |                                          | Vitest Unit Tests|
| + Motion Engine  |                                          | & Playwright E2E |
+------------------+                                          +------------------+
```

### 2.1 Konfigurasi Stack
* **Framework**: Next.js 15+ (App Router murni, TypeScript strict mode).
* **Styling**: Tailwind CSS v4 dengan konfigurasi CSS-first `@theme` di `src/app/globals.css`.
* **Primitif UI**: `@radix-ui/react-*` dan ikon `lucide-react`.
* **Animasi**: `motion` (Framer Motion) dengan pembatasan ketat `prefers-reduced-motion`.
* **State Management**: URL Query String (untuk filter dokter & denah Tower) + `zustand` (khusus memori form pendaftaran demo tanpa storage persistence).
* **Validasi Skema**: `zod` untuk validasi fixture data dan verifikasi form.
* **Testing & A11y**: `vitest` (data logic test), `@playwright/test` (E2E browser), `@axe-core/playwright` (audit aksesibilitas otomatis).

---

## 3. Sistem Desain "Hijau Tower" (Design System Specification)

### 3.1 Token Warna (`src/app/globals.css`)
Konfigurasikan token berikut menggunakan direktif Tailwind v4 `@theme`:

```css
@theme {
  --color-tower-950: #04231F; /* Footer & Background Deep Dark */
  --color-tower-900: #063B36; /* Hero Deep Slate, Navbar solid */
  --color-tower-800: #0A4F48; /* Primary Brand & Main Action Buttons */
  --color-tower-700: #0F6B61; /* Primary Hover & Active Icons */
  --color-tower-600: #178579; /* Secondary Accent & Light Text Links */
  --color-tower-100: #D6EFEB; /* Surface Hover, Chip Background */
  --color-tower-50:  #EEF8F6; /* Zebra Section Background */

  --color-gold-700:  #8A6A14; /* Text Gold on Light Background (Contrast >= 4.8:1) */
  --color-gold-500:  #C9A24A; /* Hairline Floor Divider & Graphic Accent ONLY */
  --color-gold-300:  #E3CB8A; /* Text Gold on Dark Background */
  --color-gold-100:  #F4EBD0; /* Card Highlight Background */

  --color-ivory:     #FBF8F1; /* Primary Canvas Background */
  --color-ink:       #10201E; /* Primary Heading & Body Text */
  --color-ink-soft:  #4B5F5C; /* Secondary Supporting Text */

  --color-alert-600: #C62F2F; /* Emergency Only: IGD, Call 1500718, Full Status */
  --color-alert-50:  #FDECEC; /* Emergency Soft Banner */
}
```

> [!CAUTION]
> **ATURAN KERAS PENGGUNAAN WARNA:**
> 1. `gold-500` **TIDAK BOLEH** digunakan sebagai warna teks di atas latar putih atau `ivory`. Gunakan `gold-700` untuk menjamin rasio kontras ≥ 4,5:1.
> 2. `alert-*` **HANYA BOLEH** diimpor pada komponen darurat: `EmergencyBar`, halaman `/igd`, dan indikator penuh pada `BedStatus`.

### 3.2 Tipografi & Skala Fluid
* **Display Font**: `Playfair Display` (Weight 600, 700; Italic 600) via `next/font/google`.
* **Body / Interface Font**: `Plus Jakarta Sans` (Weight 400, 500, 600, 700) via `next/font/google`.
* **Skala Fluid (`clamp`)**:
  * `display-xl`: `clamp(2.5rem, 5vw + 1rem, 4.5rem)`
  * `display-lg`: `clamp(2rem, 3.5vw + 0.5rem, 3.25rem)`
  * `h2`: `clamp(1.75rem, 2vw + 0.5rem, 2.5rem)`
  * `h3`: `clamp(1.375rem, 1vw + 0.5rem, 1.75rem)`
  * `body`: `clamp(1rem, 0.25vw + 0.95rem, 1.125rem)` (min 16px)

### 3.3 Visual & Aset Grafis (Zero External Photos)
* **Pola Khatam SVG**: Pola geometris islami bintang 8 sudut berulang (`<pattern id="khatam">`) dengan opasitas 4%–6%.
* **Siluet Tower 13 Lantai SVG**: Vektor vertikal proporsional dengan jendela transparan bercahaya, digunakan sebagai elemen hero dan pemilih interaktif di `/tower`.
* **Hairline Emas 1px**: Pembatas section dengan gradien emas lembut (`border-t border-gold-500/30`).
* **Avatar Dokter**: Inisial tipografis bergradasi `from-tower-800 to-tower-900` dengan border `tower-100` dan label "Ilustrasi".

---

## 4. Protokol Gerbang Fase (The 7-Phase Evidence Gates)

Antigravity wajib mengeksekusi proyek mengikuti urutan fase ini secara sekuensial. **Setelah menyelesaikan suatu fase, Antigravity wajib berhenti dan meminta persetujuan pemilik sebelum menjalankan fase berikutnya.**

```
                                  [ START ]
                                      |
                                      v
                             +-----------------+
                             |     FASE 0      |  Discovery & Tooling
                             +-----------------+
                                      | -> Output: docs/evidence/phase-0-discovery.json
                                      v
                              [ GATE 0: APPROVED? ] --- NO ---> (Perbaiki)
                                      | YES
                                      v
                             +-----------------+
                             |     FASE 1      |  Scaffold, Shell & Styleguide
                             +-----------------+
                                      | -> Output: docs/evidence/phase-1-shell.json
                                      v
                              [ GATE 1: APPROVED? ] --- NO ---> (Perbaiki)
                                      | YES
                                      v
                             +-----------------+
                             |     FASE 2      |  Data Layer & Validation
                             +-----------------+
                                      | -> Output: docs/evidence/phase-2-data.json
                                      v
                              [ GATE 2: APPROVED? ] --- NO ---> (Perbaiki)
                                      | YES
                                      v
                             +-----------------+
                             |     FASE 3      |  Core Routes (Home, IGD, Dokter)
                             +-----------------+
                                      | -> Output: docs/evidence/phase-3-routes.json
                                      v
                              [ GATE 3: APPROVED? ] --- NO ---> (Perbaiki)
                                      | YES
                                      v
                             +-----------------+
                             |     FASE 4      |  Tower Directory & Wizard
                             +-----------------+
                                      | -> Output: docs/evidence/phase-4-features.json
                                      v
                              [ GATE 4: APPROVED? ] --- NO ---> (Perbaiki)
                                      | YES
                                      v
                             +-----------------+
                             |     FASE 5      |  Secondary Routes & Polish
                             +-----------------+
                                      | -> Output: docs/evidence/phase-5-secondary.json
                                      v
                              [ GATE 5: APPROVED? ] --- NO ---> (Perbaiki)
                                      | YES
                                      v
                             +-----------------+
                             |     FASE 6      |  Lighthouse, E2E & Case Study
                             +-----------------+
                                      | -> Output: docs/evidence/phase-6-audit.json
                                      v
                              [ GATE 6: APPROVED? ] --- NO ---> (Perbaiki)
                                      | YES
                                      v
                                  [ SELESAI ]
```

---

### FASE 0 · Discovery, Verifikasi Lingkungan & Blueprint Eksekusi

#### Sasaran:
1. Memeriksa lingkungan eksekusi lokal (Node.js, npm, arsitektur OS).
2. Memverifikasi ketersediaan versi package terbaru di npm registry (`npm view <pkg> version`).
3. Menyiapkan struktur direktori awal dan blueprint eksekusi tertulis.

#### Tindakan Antigravity:
1. Jalankan pemeriksaan versi: `node -v`, `npm -v`.
2. Lakukan pengecekan versi package via npm view: `next`, `react`, `react-dom`, `tailwindcss`, `@tailwindcss/postcss`, `lucide-react`, `zustand`, `zod`, `vitest`, `@playwright/test`.
3. Buat direktori bukti awal: `docs/evidence/`.
4. Simpan output ke `docs/evidence/phase-0-discovery.json`.

#### Exit Evidence Gate 0:
* Berkas `docs/evidence/phase-0-discovery.json` terisi lengkap.
* Rencana kerja detail tertulis pada response.
* **Stop! Tunggu kata: "APPROVED PHASE 0" dari Pacoel.**

---

### FASE 1 · Inisialisasi Fondasi, Sistem Desain & Shell Global

#### Sasaran:
1. Scaffold Next.js App Router (TypeScript, Tailwind CSS v4, ESLint).
2. Konfigurasi `@theme` di `src/app/globals.css`, font Playfair Display & Plus Jakarta Sans di `src/app/layout.tsx`.
3. Komponen Shell Global: `Header`, `EmergencyBar` (desktop & mobile dock), `Footer`, `DisclaimerBanner`, dan `SkipLink`.
4. Rute internal `/styleguide` (katalog warna, tipografi, tombol, chip, ikon).
5. Skrip otomatisasi rasio kontras: `scripts/check-contrast.mjs`.

#### Kriteria Teknis Wajib:
* Shell global wajib menerapkan navigasi keyboard penuh dengan skip-link yang melompat langsung ke `<main id="main-content">`.
* Footer memuat disclaimer hukum independen, hak cipta dengan tahun dinamis, dan tautan sosial hanya ke `@rsisurabaya`.
* Bar darurat mobile (`fixed bottom-0`) tidak menghalangi tombol interaktif (ada padding bawah).

#### Exit Evidence Gate 1:
* Perintah sukses tanpa error:
  * `npm run build`
  * `npm run lint`
  * `npm run typecheck`
  * `node scripts/check-contrast.mjs` (Semua pasangan teks/latar lolos ≥ 4,5:1).
* Simpan bukti log eksekusi ke `docs/evidence/phase-1-shell.json`.
* **Stop! Tunggu kata: "APPROVED PHASE 1" dari Pacoel.**

---

### FASE 2 · Arsitektur Data Fixture, Skema Zod & Skrip Validasi

#### Sasaran:
1. Berkas fakta tunggal `src/data/facts.ts` (nomor darurat, tahun 1975, Kelas B, 238 TT, rating Google 4,7/7.034 ulasan per Okt 2026).
2. Fixture data bertipe:
   * `src/data/specialties.ts` (20 poliklinik terverifikasi dari Lampiran A).
   * `src/data/doctors.ts` (Minimal 24 dokter fiktif, ≥ 14 spesialisasi, jadwal konsisten, `isFictional: true`).
   * `src/data/services.ts` (8 layanan unggulan terverifikasi dari Lampiran A).
   * `src/data/buildings.ts` (Gedung Tower 13 lantai & Gedung Graha 6 lantai sesuai Lampiran B).
   * `src/data/bed-status.ts` (Simulasi status kamar ICU/ICCU/HCU/NICU/PICU tanpa angka palsu).
3. Skema validasi runtime `src/data/schema.ts` menggunakan Zod.
4. Skrip validasi integritas data: `scripts/validate-data.mjs`.
5. Skrip pencegahan kebocoran fakta: `scripts/check-facts.mjs`.
6. Unit testing Vitest untuk memverifikasi logika data.

#### Exit Evidence Gate 2:
* Perintah sukses tanpa kegagalan:
  * `npm run validate:data` (100% data valid, relasi antar-entitas utuh).
  * `npm run check:facts` (0 literal angka/nomor darurat bocor di luar `facts.ts`).
  * `npm test` (Unit test Vitest lulus 100%).
* Simpan bukti log eksekusi ke `docs/evidence/phase-2-data.json`.
* **Stop! Tunggu kata: "APPROVED PHASE 2" dari Pacoel.**

---

### FASE 3 · Halaman Inti Medis (Beranda, IGD, Dokter & Layanan)

#### Sasaran:
1. **Beranda (`src/app/page.tsx`)**: 9 section berurutan sesuai FR-02 (Hero dengan siluet animasi, Quick Actions, BedStatus ringkas, Layanan Unggulan, Strip Fakta, Teaser Tower, Cari Dokter Cepat, Social Proof Google, Kontak).
2. **Halaman IGD (`src/app/igd/page.tsx`)**: Above-the-fold memuat 2 tombol darurat (`1500718` & `0811233999`), tombol Google Maps, alamat, panduan triase, nol animasi berat.
3. **Direktori Dokter (`src/app/dokter/page.tsx`)**: Filter terpadu (nama, poli, hari, penjamin BPJS/Umum), sinkronisasi dua arah dengan URL searchParams, kartu dokter fiktif berlabel "Ilustrasi".
4. **Detail Dokter (`src/app/dokter/[slug]/page.tsx`)**: Jadwal praktik matriks/akordeon, tombol "Daftar ke Dokter Ini".
5. **Katalog Layanan (`src/app/layanan/page.tsx`)**: Indeks 8 layanan unggulan & 20 poliklinik rawat jalan.
6. Pengujian otomatis: Playwright E2E untuk alur filter dokter & audit aksesibilitas axe-core.

#### Exit Evidence Gate 3:
* `npm run build` sukses.
* Uji E2E Playwright rute dokter & IGD lulus 100%.
* Audit axe-core pada rute `/`, `/igd`, `/dokter`, `/layanan`: **0 pelanggaran serious / critical**.
* Simpan bukti log eksekusi ke `docs/evidence/phase-3-routes.json`.
* **Stop! Tunggu kata: "APPROVED PHASE 3" dari Pacoel.**

---

### FASE 4 · Fitur Penanda (Tower Directory) & Wizard Pendaftaran Demo

#### Sasaran:
1. **Tower Directory (`src/app/tower/page.tsx`)**:
   * Tampilan gedung ganda: Gedung Tower (13 lantai) dan Gedung Graha (6 level).
   * Interaksi visual denah vertikal + keyboard navigation (Arrow Up/Down).
   * Tampilan lantai tanpa data publik berstatus jelas: *"Informasi belum tersedia"*.
   * Integrasi komponen `BedStatus` di Tower Lt. 4 (Ruang Perawatan Intensif).
   * Deep linking URL: `/tower?gedung=tower&lantai=4`.
   * Aksesibilitas ARIA tablist/tabpanel dan `aria-live="polite"`.
2. **Wizard Pendaftaran Online Demo (`src/app/daftar/page.tsx`)**:
   * 4 langkah pendaftaran: Jalur Pasien → Poli → Dokter & Tanggal Praktik → Data Pasien Simulasi.
   * Cetak tiket antrean demo lokal dengan kode registrasi unik.
   * State form dikelola via Zustand (in-memory, no localStorage).
   * **Nol Request Jaringan (Zero Network Requests)** saat submit.
   * Banner privasi & pencegahan input data riil di setiap langkah.
3. Pengujian otomatis: Playwright E2E untuk memverifikasi isolasi jaringan form pendaftaran demo.

#### Exit Evidence Gate 4:
* `npm run build` sukses.
* Playwright E2E membuktikan:
  * Wizard selesai hingga halaman konfirmasi antrean.
  * Intersepsi request jaringan browser: **tepat 0 outgoing network requests** saat proses submit pendaftaran.
* Audit axe-core pada `/tower` dan `/daftar`: **0 pelanggaran serious / critical**.
* Simpan bukti log eksekusi ke `docs/evidence/phase-4-features.json`.
* **Stop! Tunggu kata: "APPROVED PHASE 4" dari Pacoel.**

---

### FASE 5 · Halaman Sekunder, Detail Layanan & Polishing

#### Sasaran:
1. **Tentang Kami (`src/app/tentang/page.tsx`)**: Garis waktu sejarah 1975–2026, rekam jejak akreditasi Paripurna, nilai filosofis YARSIS.
2. **Kontak & Lokasi (`src/app/kontak/page.tsx`)**: Alamat fisik, nomor telepon sentral & darurat, jam buka fasilitas 24 jam, ilustrasi peta SVG statis + tautan langsung Google Maps (tanpa API key).
3. **Detail Layanan Unggulan (`src/app/layanan/[slug]/page.tsx`)**: Halaman detail untuk 8 layanan unggulan beserta fasilitas teknologi dan dokter terkait.
4. **Halaman 404 Kustom (`src/app/not-found.tsx`)**: Desain bertema "Hijau Tower" dengan tombol kembali ke beranda atau IGD.
5. Konfigurasi keamanan `next.config.mjs` (Security Headers, CSP berbasis allowlist).

#### Exit Evidence Gate 5:
* `npm run build` sukses menghasilkan seluruh rute statis.
* Seluruh tautan internal berfungsi normal (nol broken internal links).
* Audit axe-core pada rute baru lulus dengan 0 pelanggaran serious/critical.
* Simpan bukti log eksekusi ke `docs/evidence/phase-5-secondary.json`.
* **Stop! Tunggu kata: "APPROVED PHASE 5" dari Pacoel.**

---

### FASE 6 · Audit Kualitas, Lighthouse Lab, Responsivitas & Case Study README

#### Sasaran:
1. **Audit Lighthouse Mobile Lokal**:
   * Jalankan web server produksi lokal (`next start`).
   * Audit pada 5 rute inti: `/`, `/igd`, `/dokter`, `/tower`, `/daftar`.
   * Target lab: **Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95**.
   * Target Core Web Vitals lab: **LCP ≤ 2,5s, CLS ≤ 0,1, TBT ≤ 200ms**.
2. **Audit Responsivitas Visual**:
   * Pengujian Playwright pada resolusi: 360px (mobile small), 390px (mobile standard), 768px (tablet), 1280px (desktop).
   * Verifikasi nol horizontal overflow (`scrollWidth === clientWidth`).
   * Pengambilan screenshot otomatis ke `docs/screenshots/`.
3. **Penyusunan Dokumentasi Portofolio `README.md`**:
   * Problem statement & latar belakang.
   * Tesis desain & arsitektur "Hijau Tower".
   * Tabel temuan audit publik & resolusi konflik K1–K7.
   * Rekapitulasi metrik performa & aksesibilitas lab.
   * Panduan instalasi dan pengujian lokal mandiri.

#### Exit Evidence Gate 6:
* Berkas ringkasan audit mentah: `docs/evidence/phase-6-audit.json`.
* Seluruh tangkapan layar tersimpan di `docs/screenshots/`.
* `README.md` berkelas dunia telah diperbarui secara menyeluruh.
* **Presentasikan laporan final kepada Pacoel.**

---

## 5. Implementasi Skrip Otomatisasi (Node.js ESM)

Untuk menjamin kompatibilitas mutlak di sistem operasi Windows (PowerShell), skrip utilitas wajib ditulis dalam format `.mjs` murni.

### 5.1 Skrip Validasi Rasio Kontras Warna (`scripts/check-contrast.mjs`)
Skrip ini menghitung relative luminance dan rasio kontras WCAG 2.2 untuk seluruh kombinasi warna teks dan latar belakang:

```javascript
// scripts/check-contrast.mjs
import { readFileSync } from 'node:fs';

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
  { name: 'Tower-800 on Ivory (Headings)', fg: '#0A4F48', bg: '#FBF8F1', min: 4.5 },
  { name: 'Tower-600 on Ivory (Links)', fg: '#178579', bg: '#FBF8F1', min: 4.5 },
  { name: 'Gold-700 on Ivory (Accent text)', fg: '#8A6A14', bg: '#FBF8F1', min: 4.5 },
  { name: 'Ivory on Tower-800 (Primary button text)', fg: '#FBF8F1', bg: '#0A4F48', min: 4.5 },
  { name: 'Gold-300 on Tower-900 (Dark hero accent)', fg: '#E3CB8A', bg: '#063B36', min: 4.5 },
  { name: 'Ivory on Alert-600 (Emergency button text)', fg: '#FBF8F1', bg: '#C62F2F', min: 4.5 },
];

let failed = 0;
console.log('--- WCAG 2.2 AA Contrast Verification ---');
for (const pair of colorPairs) {
  const ratio = getContrast(pair.fg, pair.bg);
  const pass = ratio >= pair.min;
  console.log(`${pass ? 'PASS' : 'FAIL'}: ${pair.name} - Ratio: ${ratio.toFixed(2)}:1 (Min: ${pair.min}:1)`);
  if (!pass) failed++;
}

if (failed > 0) {
  console.error(`\nKontras warna gagal pada ${failed} pasangan! Perbaiki token warna.`);
  process.exit(1);
} else {
  console.log('\nSemua kombinasi warna token memenuhi standar WCAG 2.2 AA.');
}
```

### 5.2 Skrip Validasi Integritas Data (`scripts/validate-data.mjs`)
Menggunakan Zod untuk memeriksa keselarasan referensi seluruh fixture data medis:

```javascript
// scripts/validate-data.mjs
import { readFileSync } from 'node:fs';

// Memeriksa keberadaan fixture data, keunikan slug, format jadwal dokter,
// kecocokan specialtyId, dan validitas nomor lantai bangunan.
console.log('--- Referential Integrity & Zod Validation ---');
// Skrip memuat data dari src/data/ dan menjalankan Zod parse
// Mengeluarkan status sukses atau melempar galat terinci.
```

### 5.3 Skrip Pencegahan Kebocoran Fakta (`scripts/check-facts.mjs`)
Memindai seluruh komponen UI untuk mencegah penulisan hardcode fakta RS:

```javascript
// scripts/check-facts.mjs
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const forbiddenPatterns = [
  /1500718/,
  /08\s*112\s*33\s*999/,
  /rsisurabaya\.com/,
  /Achmad Yani No\.?\s*2/i,
];

function scanDir(dir) {
  let violations = [];
  const files = readdirSync(dir);
  for (const file of files) {
    const fullPath = join(dir, file);
    if (file === 'node_modules' || file === '.next' || file === 'data') continue;
    if (statSync(fullPath).isDirectory()) {
      violations = violations.concat(scanDir(fullPath));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = readFileSync(fullPath, 'utf8');
      forbiddenPatterns.forEach(pattern => {
        if (pattern.test(content) && !fullPath.includes('src/data/facts.ts')) {
          violations.push({ file: fullPath, pattern: pattern.toString() });
        }
      });
    }
  }
  return violations;
}

const errors = scanDir('./src/app');
if (errors.length > 0) {
  console.error('FAIL: Ditemukan hardcode fakta rumah sakit pada komponen UI:');
  errors.forEach(e => console.error(`  - ${e.file} mencocokkan ${e.pattern}`));
  console.error('Impor nilai tersebut dari src/data/facts.ts!');
  process.exit(1);
} else {
  console.log('PASS: Bebas dari hardcode fakta di komponen antarmuka.');
}
```

---

## 6. Skenario Pengujian Playwright E2E

### Skenario 1: Verifikasi Filter Dokter & URL Query Synchronization
1. Buka rute `/dokter`.
2. Pilih filter spesialisasi: "Jantung & Pembuluh Darah".
3. Pilih hari praktik: "Senin".
4. Verifikasi bahwa URL di browser berubah menjadi `/dokter?spesialis=jantung&hari=senin`.
5. Salin URL, muat ulang halaman, dan pastikan daftar dokter yang ditampilkan tetap terfilter secara identik.
6. Verifikasi kartu dokter menampilkan lencana "Ilustrasi".

### Skenario 2: Alur Pendaftaran Demo & Nol Request Jaringan
1. Intersepsi seluruh outgoing network requests via Playwright: `page.on('request', req => ...)`.
2. Navigasi ke `/daftar`.
3. Selesaikan Langkah 1 s/d 4 dengan data simulasi.
4. Klik tombol "Konfirmasi Pendaftaran".
5. Verifikasi bahwa muncul kartu tanda antrean demo.
6. Verifikasi mutlak: **Jumlah outgoing request ke server eksternal/backend adalah tepat 0**.

### Skenario 3: Keterlihatan Akses Darurat (Mobile & Desktop)
1. Set viewport ke ukuran ponsel (360×640).
2. Akses halaman beranda `/`.
3. Verifikasi bahwa floating emergency bar terpasang di bagian bawah layar.
4. Pastikan elemen memiliki tombol dengan tautan `href="tel:1500718"` dan `href="tel:0811233999"`.
5. Buka halaman `/igd`, pastikan area above-the-fold menampilkan nomor darurat dan tombol Google Maps tanpa perlu scroll.

---

## 7. Format Pelaporan Selesai Fase

Setiap kali Antigravity menyelesaikan suatu fase, laporkan kepada Pacoel dengan format terstruktur berikut:

```markdown
### [LAPORAN PENYELESAIAN FASE N]

1. **Ringkasan Pekerjaan**:
   - (Penjelasan singkat apa yang dikerjakan)
2. **Kepatuhan Register Konflik & Non-Tujuan**:
   - Status K1–K7 terverifikasi
   - Scope lock terjaga (0 backend, 0 DB, 0 tracking)
3. **Hasil Eksekusi Perintah & Uji Otomatis**:
   - Build: SUKSES
   - Lint & Typecheck: 0 Error, 0 Warning
   - Uji Spesifik Fase (Kontras / Data / Axe / E2E): LULUS
4. **Artefak Bukti Tersimpan**:
   - `docs/evidence/phase-N-*.json`
5. **Permohonan Persetujuan**:
   - "Fase N selesai dengan bukti lengkap. Mohon periksa dan berikan instruksi: **APPROVED PHASE N** untuk melanjutkan ke Fase N+1."
```

---
*Playbook ini merupakan dokumen pengendali resmi. Jalankan dengan dedikasi penuh terhadap presisi kode, aksesibilitas, dan bukti nyata.*
