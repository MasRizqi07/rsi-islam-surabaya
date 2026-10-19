# RS Islam Surabaya A. Yani · Konsep "Hijau Tower"
> **Portfolio Case Study · Website Redesign & Modern Frontend Architecture**  
> *Sebuah eksplorasi desain sistem dan rekayasa web independen: Presisi Medis Modern × Heritage Islam 51 Tahun.*

---

## ⚠️ Pernyataan Penafian (Disclaimer)
Aplikasi ini merupakan **studi kasus portofolio desain dan engineering perangkat lunak independen**. Proyek ini **TIDAK berafiliasi** secara resmi dengan Rumah Sakit Islam Surabaya (RSIS) maupun Yayasan Rumah Sakit Islam Surabaya (YARSIS). 

* **Anti-Indeksasi Penuh**: Dikonfigurasi dengan `<meta name="robots" content="noindex, nofollow">` dan `robots.txt` Disallow untuk mencegah kerancuan dengan portal resmi rumah sakit.
* **Privasi Mutlak**: Tidak menggunakan pelacak analitik pihak ketiga (Zero Cookies / Zero Tracking). Formulir pendaftaran demo diproses murni di memori peramban (**Zero Outgoing Network Requests**).
* **Karakter Fiktif**: Seluruh profil dokter dan jadwal praktik yang ditampilkan adalah tokoh fiktif simulasi (`isFictional: true`) bertanda lencana tegas *"Ilustrasi"*.

---

## 🏢 Tesis Desain: "Hijau Tower"
RS Islam Surabaya A. Yani memiliki keunikan naratif yang jarang dieksplorasi secara maksimal pada situs web fasilitas kesehatan di Indonesia: perpaduan warisan pengabdian sejak 25 Maret 1975 dengan kehadiran **Gedung Tower 13 Lantai** (diresmikan oleh Presiden RI Joko Widodo pada 2023) sebagai simbol transformasi pelayanan modern.

Konsep **"Hijau Tower"** mengangkat gedung bukan sekadar sebagai foto pajangan, melainkan **antarmuka navigasi utama**:
1. **Ritme Vertikal & Garis Lantai Hairline**: Elemen estetika yang mencerminkan ketegasan struktur gedung bertingkat.
2. **Tower Directory Interaktif (`/tower`)**: Fitur penanda yang memetakan peruntukan lantai Gedung Tower (13 lantai) dan Gedung Graha (6 level), dilengkapi navigasi keyboard dan penanganan transparansi fakta (K4).
3. **Hirarki Darurat < 3 Detik**: Akses panggilan darurat ganda (`1500718` & `08 112 33 999`) dan panduan arah Google Maps selalu dapat diakses seketika dari viewport manapun.

---

## 🛠️ Stack Teknologi & Standar Rekayasa

| Lapisan | Pilihan Teknologi | Rationale & Alasan Pemilihan |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | Static Site Generation (SSG) murni, kecepatan saji instan, zero server overhead. |
| **Bahasa** | TypeScript (Strict Mode) | Jaminan keamanan tipe end-to-end tanpa penggunaan tipe `any`. |
| **Styling** | Tailwind CSS v4 (`@theme`) | CSS-first design tokens, performa kompilasi tinggi, utilitas modern. |
| **Tipografi** | Playfair Display & Plus Jakarta Sans | Kombinasi display berwibawa khas institusi terpercaya dengan sans-serif antarmuka modern yang tajam. |
| **Ikonografi** | Lucide React | Ikon SVG berbobot konsisten dan aksesibel. |
| **State Management** | URL SearchParams + Zustand | Parameter filter tersinkronisasi dua arah ke URL; Zustand digunakan secara in-memory untuk wizard pendaftaran. |
| **Validasi Data** | Zod | Single source of truth skema data runtime dan integritas fixture. |
| **Testing Otomatis** | Vitest + Playwright + Axe-core | Unit testing data (19 tests), pengujian browser interaktif (22 tests), dan audit aksesibilitas WCAG 2.2 AA otomatis. |

---

## 📐 Fitur Utama yang Telah Diimplementasikan

### 1. Beranda ([src/app/page.tsx](src/app/page.tsx))
* 9 section tersusun rapi: Hero headline LCP, Quick Actions, BedStatus kualitatif ringkas, Layanan Unggulan, Strip Fakta Historis, Teaser Tower 13 Lantai, Cari Dokter Cepat, Social Proof Google Review (4,7 dari 7.034 ulasan), dan Kontak/Lokasi.

### 2. IGD & Layanan Darurat ([src/app/igd/page.tsx](src/app/igd/page.tsx))
* Area *above-the-fold* (< 640px pada mobile) memuat langsung tombol Emergency Call `1500718`, Ambulans `08 112 33 999`, dan tombol peta Google Maps.
* Panduan triase 4 kategori medis (Merah, Kuning, Hijau, Hitam) dengan rasio kontras WCAG 2.2 AA (≥ 4,5:1).
* *Zero heavy motion* untuk beban kognitif minimal dalam situasi gawat darurat.

### 3. Direktori & Filter Dokter ([src/app/dokter/page.tsx](src/app/dokter/page.tsx))
* Filter 4 dimensi: pencarian teks, 20 poliklinik rawat jalan, hari praktik (Senin–Sabtu), dan mitra penjamin (BPJS Kesehatan, Umum, Asuransi).
* Sinkronisasi dua arah dengan query parameter URL browser.
* 24 kartu dokter fiktif berlabel eksplisit *"Ilustrasi"*.

### 4. Detail Profil Dokter ([src/app/dokter/[slug]/page.tsx](src/app/dokter/[slug]/page.tsx))
* Prerendered SSG untuk 24 dokter spesialis via `generateStaticParams`.
* Matriks jadwal praktik mingguan dan tombol pendaftaran instan.

### 5. Katalog Layanan Medis ([src/app/layanan/page.tsx](src/app/layanan/page.tsx))
* Indeks komprehensif 8 Layanan Unggulan terverifikasi dan 20 poliklinik rawat jalan dengan tautan lokasi gedung dan lantai.

### 6. Tower Directory Interaktif ([src/app/tower/page.tsx](src/app/tower/page.tsx))
* Pilihan tab ganda: Gedung Tower (13 lantai) dan Gedung Graha (6 level).
* Navigasi keyboard (`ArrowUp` / `ArrowDown`), deep-linking URL (`/tower?gedung=tower&lantai=4`), dan ARIA tablist/tabpanel.
* **Transparansi Konflik K4**: Lantai tanpa publikasi resmi peruntukan ruangan (Lantai 1, 5, 6, 8–13) menampilkan status tegas *"Informasi Belum Tersedia"*.
* Integrasi status keterisian tempat tidur intensif (`BedStatus`) pada Tower Lantai 4.

### 7. Wizard Pendaftaran Pasien Online Demo ([src/app/daftar/page.tsx](src/app/daftar/page.tsx))
* Alur pendaftaran mandiri 4 langkah: Jalur Pasien → Poliklinik → Dokter & Jadwal → Data Pasien Simulasi.
* Penerbitan Tiket Antrean Demo lokal (misal: `RSIS-PEN-482`) dengan tampilan siap cetak (`window.print()`).
* **Zero Network Requests**: Terbukti secara otomatis tidak mengirim request HTTP saat submit.

---

## 🔒 Register Konflik Data (Integritas Fakta Publik)
Proyek ini mengadopsi Register Konflik Faktual K1–K7 dari hasil audit sumber data publik:
- **K1 (Nomor Darurat Ganda)**: Menampilkan kedua nomor resmi dengan label netral: *Emergency Call (1500718)* dan *Ambulans (08 112 33 999)*.
- **K2 (Jumlah Tenaga Medis)**: Menggunakan copy *"100+ tenaga medis"* untuk merekonsiliasi perbedaan data publik 107 vs 112 dokter.
- **K3 (Masa Berlaku Akreditasi)**: Menggunakan fakta historis *"Akreditasi Paripurna 2016 · 2019 · 2022"*.
- **K4 (Peruntukan Lantai Tower)**: Menolak halusinasi data; lantai tanpa data resmi dilabeli *"Informasi belum tersedia"*.
- **K5 (Rating Publik)**: Mengatribusikan data ulasan Google (4,7 / 7.034 ulasan) secara transparan per Oktober 2026.
- **K6 (Kelas Rumah Sakit)**: Menampilkan status operasional terbaru *"Kelas B"*.
- **K7 (Kanal Instagram)**: Hanya menautkan ke akun aktif terverifikasi `@rsisurabaya`.

Seluruh konstanta fakta tersimpan pada [src/data/facts.ts](src/data/facts.ts) dan diawasi oleh skrip `npm run check:facts` untuk mencegah kebocoran data literal di kode antarmuka.

---

## 🚀 Memulai & Menjalankan Proyek

### Prasyarat
- Node.js versi ≥ 20.0.0
- npm versi ≥ 10.0.0

### Instalasi & Menjalankan Development Server
```bash
# Clone repositori
git clone https://github.com/MasRizqi07/rsi-islam-surabaya.git
cd rsi-islam-surabaya

# Pasang dependensi
npm install

# Jalankan server pengembangan
npm run dev
```
Buka browser pada `http://localhost:3000`.

### Kompilasi Produksi (SSG)
```bash
npm run build
npm run start
```

---

## 🧪 Skrip Pengujian & Audit Kualitas

Setiap gerbang fase dibuktikan dengan eksekusi otomasi:

```bash
# 1. Pemeriksaan Linter & TypeScript
npm run lint
npm run typecheck

# 2. Audit Rasio Kontras Warna WCAG 2.2 AA (14 Token Pairs)
npm run check:contrast

# 3. Scanner Kebocoran Fakta Rumah Sakit (Zero Leakage Check)
npm run check:facts

# 4. Validasi Integritas Data Fixture & Skema Zod
npm run validate:data

# 5. Unit Testing Logika Data (Vitest)
npm test

# 6. Pengujian End-to-End Browser & Aksesibilitas Axe-core (Playwright)
npm run test:e2e
```

---

## 📊 Bukti Artefak Evidence Gate (`docs/evidence/`)

Hasil eksekusi mentah dari setiap tahapan disimpan dan dapat diaudit secara transparan:
- `docs/evidence/phase-0-discovery.json`: Audit kesiapan lingkungan kerja, versi tool, dan dependensi.
- `docs/evidence/phase-1-shell.json`: Hasil build fondasi, shell global, navigasi keyboard, dan footer.
- `docs/evidence/contrast-results.json`: Log verifikasi rasio kontras 14 pasangan token warna (4.77:1 – 15.87:1).
- `docs/evidence/phase-2-data.json`: Validasi skema Zod pada data fixture dokter, poliklinik, layanan, dan gedung.
- `docs/evidence/facts-check-results.json`: Bukti 0 kebocoran literal fakta rumah sakit di luar `facts.ts`.
- `docs/evidence/phase-3-routes.json`: Hasil kompilasi 31 rute inti medis dan audit aksesibilitas rute `/`, `/igd`, `/dokter`, `/layanan`.
- `docs/evidence/phase-4-features.json`: Pembuktian E2E Tower Directory, deep linking, dan pembuktian **Zero Network Requests** pada formulir pendaftaran.

---

## 📜 Lisensi & Hak Cipta
Hak cipta konsep desain dan kode arsitektur © 2026 Pacoel & Antigravity.  
Diterbitkan sebagai materi studi kasus rekayasa web dan portofolio teknologi.
