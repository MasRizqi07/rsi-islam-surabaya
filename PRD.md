# PRD — RS Islam Surabaya A. Yani · Konsep "Hijau Tower"
**Portfolio Case Study · Redesign Website**

| Item | Deskripsi |
|---|---|
| **Versi** | 2.0 (restart total, menggantikan v1) |
| **Tanggal** | 19 Oktober 2026 |
| **Jenis Proyek** | Studi kasus desain & engineering independen |
| **Afiliasi** | **Tidak berafiliasi** dengan RS Islam Surabaya / YARSIS. Bukan website resmi. |
| **Konsep Terpilih** | Konsep A — "Hijau Tower": Presisi Medis × Heritage Islam |
| **Eksekutor** | Antigravity (AI coding agent) |
| **Arsitek / Auditor** | Claude |
| **Owner / Reviewer** | Pacoel |
| **Dokumen Pasangan** | `ANTIGRAVITY_MASTER_PROMPT.md` (instruksi eksekusi + evidence gate) |

---

## 0. Changelog dari v1 (Koreksi atas Kesalahan Sendiri)

Versi 1 dibuat sebelum konteks "portfolio case study" diperjelas, dan sejumlah klaim serta arsitekturnya tidak tahan diaudit. Tabel berikut merinci koreksi definitif di v2:

| # | Masalah di v1 | Status di v2 | Rationale & Dampak |
|---|---|---|---|
| 1 | Stack Payload CMS + Prisma + PostgreSQL + integrasi WhatsApp untuk proyek portofolio. | **Dibuang.** Frontend-only, data fixture bertipe TypeScript + validasi Zod. | Over-engineering (YAGNI): nol pengguna nyata, nol data dinamis di server. Mengeliminasi overhead runtime dan risiko kegagalan deploy. |
| 2 | KPI baseline "PageSpeed 40–55, LCP 4–6 dtk" untuk website lama. | **Dibuang.** Hanya target yang bisa dibuktikan dengan output Lighthouse mentah pada proyek ini. | Angka lama tidak pernah diukur secara valid dan metodologis. Portofolio kredibel hanya menyajikan data terverifikasi. |
| 3 | Klaim "gambar hampir semua broken (lazy-load SVG placeholder)". | **Dicabut.** Tidak ada bukti. | Placeholder base64 tersebut adalah artefak fetcher tanpa JavaScript. Screenshot membuktikan gambar tampil normal di browser nyata. |
| 4 | Klaim "Google Maps tidak muncul tanpa JS" dihubungkan ke website RSIS. | **Dicabut.** | Yang memerlukan JavaScript adalah halaman `maps.app.goo.gl` milik Google, bukan situs web RSIS. |
| 5 | Hanya mencantumkan satu nomor darurat (`1500718`). | **Diperbaiki.** Sumber publik menampilkan **dua** nomor berbeda (lihat §2.2 K1). | Mencegah informasi keliru; menampilkan Emergency Call (`1500718`) dan Ambulans (`08 112 33 999`) dengan label netral. |
| 6 | Target SEO "ranking halaman 1 Google". | **Dibuang.** Wajib `<meta name="robots" content="noindex, nofollow">` & header HTTP `X-Robots-Tag` (`robots.txt` Allow: / agar crawler membaca direktif noindex). | Situs konsep yang meniru identitas RS berisiko dianggap peniruan/phishing oleh mesin pencari bila diindeks publik. |
| 7 | Angka tenaga medis tertulis 107, padahal rinciannya berjumlah 112. | **Diperbaiki.** UI menampilkan "100+ tenaga medis" (lihat §2.2 K2). | Menghindari tampilan angka presisi yang kontradiktif antar sumber resmi RSIS. |
| 8 | Teks korup (karakter asing) di tabel gap analysis. | **Dibersihkan total.** | Integritas dokumen dan artefak profesional. |

---

## 1. Ringkasan

### 1.1 Apa Ini
Redesign website RS Islam Surabaya A. Yani sebagai **studi kasus portofolio engineering & desain tingkat lanjut**: satu aplikasi Next.js statis yang mendemonstrasikan:
1. **Riset & Sintesis Kritis**: Menemukan, membedah, dan mengaudit inkonsistensi informasi dari sumber-sumber publik tanpa spekulasi liar.
2. **Sistem Desain Berkarakter**: Memiliki sudut pandang tajam ("Hijau Tower"), bukan sekadar template rumah sakit generik.
3. **Disiplin Engineering Terverifikasi**: Setiap klaim performa, aksesibilitas, dan kualitas dibuktikan dengan artefak mentah (build, test, axe-core, Lighthouse).

### 1.2 Tesis Desain
RS Islam Surabaya A. Yani memiliki aset naratif arsitektural yang jarang dimanfaatkan website rumah sakit di Indonesia: **sebuah Tower 13 lantai** yang menjadi ikon transformasi modern, dipadukan dengan identitas Islam-NU berusia 51 tahun (berdiri 25 Maret 1975 di bawah naungan YARSIS).

Website lama memperlakukan gedung semata-mata sebagai foto statis pada hero banner. Konsep **"Hijau Tower"** memperlakukan gedung sebagai **antarmuka navigasi utama**: ritme vertikal, garis lantai emas hairline, dan satu fitur penanda utama (**Tower Directory**) yang menjawab pertanyaan paling krusial pengunjung: *"Layanan atau poli ini ada di lantai berapa dan gedung mana?"*

### 1.3 Rubrik Penilaian Reviewer Portofolio
1. **Hirarki Informasi Darurat**: Kebutuhan darurat (IGD, ambulans, triage) berada di atas segalanya, dapat diakses dalam < 3 detik dari viewport mana pun.
2. **Konsistensi Desain**: Penerapan token warna (`tower-*`, `gold-*`), tipografi hybrid (Playfair Display + Plus Jakarta Sans), dan ritme visual tanpa gambar stok.
3. **Interaksi Berkesan**: Tower Directory yang interaktif, intuitif, dan aksesibel secara keyboard maupun layar sentuh.
4. **Bukti Kualitas Nyata**: Seluruh gerbang fase didukung output mentah yang dapat diaudit langsung di direktori `docs/evidence/`.

---

## 2. Sumber Kebenaran & Register Konflik Data

### 2.1 Sumber Acuan
| Kode | Sumber Acuan | Keterangan & Tanggal Pengambilan |
|---|---|---|
| **S1** | `rsisurabaya.com` | Halaman Pelayanan & Penunjang, Tentang Kami, Sejarah, Beranda. Diambil 19 Oktober 2026 via fetch. (Footer situs bertuliskan "CopyRight, 2025"). |
| **S2** | Screenshot beranda RSIS (dari Pacoel) | Header: Buka 24 Jam, Ambulan Emergency `08 112 33 999`, alamat fisik. |
| **S3** | Cuplikan Google Search (dari Pacoel) | Rating Google, jumlah ulasan, "My eRSIy", kanal media sosial resmi. |
| **S4** | URL Google Maps RSIS A. Yani (dari Pacoel) | Koordinat: `−7.3061594, 112.7347193`. |

### 2.2 Register Konflik Data (Wajib Dihormati Agent)

| ID | Konflik Faktual | Temuan Sumber | Keputusan Implementasi Proyek |
|---|---|---|---|
| **K1** | **Nomor Darurat Ganda** | `1500718` muncul di papan gedung (S2) dan teks halaman layanan (S1). `08 112 33 999` muncul di header beranda (S2) dan cuplikan Google (S3). Halaman layanan S1 melabeli `1500718` sebagai "Ambulan Emergency", sedangkan beranda melabeli `08 112 33 999` dengan label yang sama. | Tampilkan **dua** nomor dengan label netral yang jelas: **"Emergency Call" = `1500718`** dan **"Ambulans" = `08 112 33 999`**. Hipotesis pemisahan ini diberi catatan di README: *Wajib diverifikasi ke pihak rumah sakit sebelum digunakan di lingkungan operasional nyata.* |
| **K2** | **Jumlah Tenaga Medis** | Total tertulis 107 tenaga medis, namun rincian dokter spesialis & umum adalah: 22 + 54 + 26 + 3 + 7 = **112**. | UI **tidak menampilkan angka presisi**. Gunakan copy **"100+ tenaga medis"**. Selisih 107 vs 112 didokumentasikan di README sebagai temuan audit. |
| **K3** | **Masa Berlaku Akreditasi** | Sertifikat LAM-KPRS 2022 tercatat berlaku hingga **9 November 2026** (tinggal 21 hari sejak tanggal PRD). | UI wajib menulis **"Akreditasi Paripurna 2016 · 2019 · 2022"** (fakta historis). **Dilarang** menulis "terakreditasi sampai ..." atau "saat ini terakreditasi". |
| **K4** | **Data Lantai Tower 13 Lantai** | Gedung Tower memiliki 13 lantai (S1), tetapi data publik hanya memuat informasi peruntukan lantai 2, 3, 4, dan 7. | Tower Directory menampilkan visualisasi 13 lantai lengkap. Lantai tanpa data resmi (1, 5, 6, 8–13) diberi label status tegas: **"Informasi belum tersedia"**. **Dilarang keras mengarang isi lantai.** |
| **K5** | **Rating Google** | Google rating 4,7 dari 7.034 ulasan (S3). Waktu pencatatan spesifik tidak tersedia pada cuplikan. | Tampilkan angka dengan atribusi sumber eksplisit: *"Google, cuplikan Okt 2026"*. Nilai disimpan beserta field `asOf` di `src/data/facts.ts`. |
| **K6** | **Kelas Rumah Sakit** | Dokumen sejarah mencatat penetapan Kelas C (2014), namun halaman yang sama menyebut operasional Kelas B saat ini. | Tampilkan **"Kelas B"** (klaim operasional terbaru S1). |
| **K7** | **Akun Instagram Resmi** | Akun lama `@rsiayani` dilaporkan diretas (S1). Akun aktif terverifikasi adalah `@rsisurabaya` (14,1 rb pengikut, S3). | Tautan sosial hanya diarahkan ke `https://instagram.com/rsisurabaya`. **Jangan pernah menautkan ke `@rsiayani`.** |

### 2.3 Data yang Tidak Ditemukan (Dilarang Mengarang)
Item-item berikut tidak tersedia di sumber publik resmi:
- Visi & misi lengkap terbaru.
- Nama dokter nyata beserta jadwal praktik harian yang presisi.
- Rincian tarif layanan / tindakan medis.
- Jumlah tempat tidur spesifik per kelas perawatan.
- Peruntukan lantai Tower selain Lt. 2, 3, 4, dan 7.
- Detail isi menu aplikasi internal "My eRSIy".

**Perlakuan Teknis:** Semua item di atas diisi oleh **fixture fiktif berlabel ilustrasi** (`isFictional: true`, lencana "Ilustrasi") atau dikosongkan dengan keterangan yang transparan. Tidak boleh disajikan seolah-olah data faktual RS.

---

## 3. Analisis Website Eksisting

### 3.1 Temuan Terverifikasi (Berdasarkan Screenshot S2 & Fetch S1)
1. **Navigasi Rumit**: Menu navigasi memiliki 8 item berhuruf kapital, salah satunya menggunakan singkatan internal rumah sakit *"DI KOR EP"* tanpa keterangan bagi pengunjung awam.
2. **Visual Clutter pada Hero**: Tiga widget melayang (floating WhatsApp, popup "Tim Customer Care", dan kolom chat) menumpuk di atas bagian bawah foto gedung dan kartu fitur hijau, menutupi konten penting.
3. **Keterbacaan Rendah pada Header**: Teks headline hero dirender langsung di atas foto udara kompleks rumah sakit tanpa scrim/overlay kontras yang memadai; keterbacaan hanya bergantung pada gradasi putih di sebelah kiri.
4. **Alamat Jaringan Privat**: Menu navigasi "Info Bed" menautkan ke URL IP privat (`http://192.168.3.194/sirs/bor1/`) yang tidak dapat diakses dari jaringan internet umum.
5. **Fragmentasi Subdomain**: Jadwal dokter berada di subdomain terpisah (`online.rsisurabaya.com`), begitu pula sistem KORDIK, menciptakan pengalaman pengguna yang terputus.
6. **Footer Kadaluwarsa**: Teks hak cipta footer tertulis "CopyRight, 2025" meskipun diakses pada akhir tahun 2026.
7. **Inkonsistensi Kontak Darurat**: Terdapat konflik nomor darurat antara halaman beranda dan halaman layanan (K1).

### 3.2 Temuan Inferensi (Hipotesis yang Masuk Akal)
- Tautan ke IP privat mengindikasikan integrasi SIRS internal yang belum dipisahkan antara konsumsi intranet dan web publik.
- Widget chat floating ganda kemungkinan besar menyebabkan layout shifting dan menghalangi tombol aksi pada layar ponsel (< 400px).
- Tidak adanya fitur pencarian dokter terintegrasi di portal utama menyulitkan pasien BPJS mencari dokter spesialis sesuai jadwal rujukan.

### 3.3 Arah Perubahan Desain "Hijau Tower"
| Kebutuhan Pengunjung | Masalah Web Eksisting | Solusi Desain "Hijau Tower" |
|---|---|---|
| **Akses Darurat < 3 Detik** | Nomor kecil di header atas dan tertulis pada foto plang. | Bar darurat permanen di atas navbar (desktop) / floating dock bawah (mobile), tombol `tel:` minimal 44px. |
| **Lokasi Layanan & Poli** | Tidak tersedia panduan tata letak bangunan. | **Tower Directory interaktif**: denah vertikal 13 lantai Tower + 6 lantai Graha. |
| **Pencarian Dokter Terpadu** | Terlempar ke subdomain `online.` tanpa filter cepat. | Direktori dokter terintegrasi dengan filter instan (spesialisasi, hari, penjamin BPJS/Umum) tersinkronisasi ke URL. |
| **Pendaftaran Pasien** | Alur pendaftaran terpisah dan membingungkan. | Wizard demo 4-langkah yang ringkas, transparan, dan edukatif tanpa beban backend. |
| **Kepercayaan & Kredibilitas** | Klaim bercampur tanpa bukti sejarah yang terstruktur. | Strip fakta terverifikasi, timeline sejarah 1975–2026, dan rekam jejak akreditasi resmi. |

---

## 4. Tujuan & Non-Tujuan

### 4.1 Tujuan Proyek (Wajib Dibuktikan dengan Artefak Mentah)
| ID | Tujuan | Tolok Ukur Keberhasilan & Bukti Mentah |
|---|---|---|
| **G1** | Aplikasi statis mandiri (Frontend-Only) | `npm run build` sukses 100%, seluruh rute dapat dilayani via `next start` tanpa error 404/500. |
| **G2** | Performa Mobile Kelas Satu | Skor Lighthouse Mobile pada 5 rute inti: **Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95**. Metrik Core Web Vitals lab: **LCP ≤ 2,5s, CLS ≤ 0,1, TBT ≤ 200ms**. |
| **G3** | Aksesibilitas Teruji | Audit axe-core otomatis: **0 pelanggaran serious / critical** pada seluruh rute inti. Navigasi keyboard penuh dengan skip-link dan visible focus ring. |
| **G4** | Kontras Warna Terverifikasi | Skrip verifikasi kontras otomatis (`scripts/check-contrast.mjs`): semua pasangan teks/latar belakang memenuhi rasio kontras WCAG 2.2 AA (≥ 4,5:1 untuk teks normal). |
| **G5** | Konsistensi Faktual Ketat | Skrip validasi fakta (`scripts/check-facts.mjs`): tidak ada hardcode angka/fakta RS di luar `src/data/facts.ts`. |
| **G6** | Validasi Integritas Data | Skrip validasi data (`scripts/validate-data.mjs`): 100% data fixture lolos skema Zod dan referential integrity (relasi specialty, dokter, gedung, lantai). |
| **G7** | Alur Kritis Teruji Otomatis | 3 skenario E2E Playwright lulus: (1) filter dokter via URL, (2) wizard pendaftaran pasien hingga cetak tiket antrean demo, (3) keterlihatan kontak darurat di mobile & desktop. |
| **G8** | Dokumentasi Portofolio Berkelas | `README.md` komprehensif memuat problem statement, keputusan desain, trade-off arsitektur, audit data publik, dan bukti screenshot responsive. |

### 4.2 Non-Tujuan (Scope Lock Ketat)
Proyek ini secara tegas **TIDAK** mencakup:
- Backend server / database (PostgreSQL, MySQL, Supabase, Firebase).
- CMS (Payload, Strapi, Sanity, WordPress).
- Otentikasi pengguna / akun pasien / login dokter.
- Gateway pembayaran (Midtrans, Xendit).
- API eksternal pihak ketiga (Google Maps Platform, WhatsApp Business API).
- Optimasi SEO / SERP ranking (proyek wajib `noindex`).
- Multi-bahasa / i18n internasional.
- Dark mode switcher.
- Tracker analitik / cookies banner.
- Monorepo / Docker containerization.
- CI/CD pipeline produksi.

---

## 5. Persona & Journey Pengguna

### 5.1 Persona Utama
* **P1 · Bu Sari (45 tahun) — Pasien Rujukan BPJS**: Mengakses via smartphone Android koneksi 4G. Perlu mengetahui apakah dokter spesialis penyakit dalam yang menerima rujukan BPJS tersedia di hari Rabu, lalu ingin mendaftar. *Titik kegagalan:* dialihkan ke sistem eksternal yang lambat atau tidak jelas apakah poli menerima BPJS.
* **P2 · Mas Reza (32 tahun) — Keluarga Pasien Darurat**: Mengakses situs dalam kondisi panik dari kendaraan. Membutuhkan nomor telepon ambulans dan arahan ke IGD segera. *Titik kegagalan:* nomor darurat tersembunyi di bawah scroll atau membutuhkan interaksi lebih dari 1 ketukan.
* **P3 · Pak Hadi (50 tahun) — Pengantar Pasien Rawat Jalan**: Mengantar orang tua lanjut usia ke poli ortopedi. Bingung menentukan gedung mana yang harus dituju dan di lantai berapa poli tersebut berada. *Titik kegagalan:* tidak ada direktori lokasi gedung yang jelas. *(Persona ini mendasari urgensi fitur Tower Directory).*

### 5.2 Alur Perjalanan Kritis (Critical Journeys)
* **J1 (Pencarian & Registrasi)**: Beranda → Filter Dokter (Poli/Hari/BPJS) → Detail Profil Dokter → Klik "Daftar ke Dokter Ini" → Wizard Pendaftaran Demo (4 langkah) → Tiket Antrean Demo.
* **J2 (Panggilan Darurat)**: Halaman mana pun → Bar Darurat Atas / Dock Bawah → Ketuk `tel:` 1500718 / 0811233999 → Terhubung langsung ke dialer telepon.
* **J3 (Navigasi Gedung)**: Beranda → Bagian Tower Directory → Pilih Gedung (Tower/Graha) → Pilih Lantai (misal Lt. 2 IGD atau Lt. 4 ICU) → Tinjau daftar layanan & fasilitas di lantai tersebut.

---

## 6. Konsep Desain "Hijau Tower"

### 6.1 Prinsip Desain
1. **Kejelasan Melampaui Dekorasi**: Kebutuhan darurat dan keselamatan pasien mendahului segala bentuk estetika visual.
2. **Gedung Sebagai Antarmuka**: Menggunakan proporsi arsitektur vertikal Tower 13 lantai, aksen hairline emas pada garis lantai, dan tipografi penomoran lantai sebagai elemen visual khas.
3. **Ornamen Sebagai Aksen Lembut**: Menggunakan motif geometris Islam kontemporer (pola bintang 8 khatam) dengan opasitas rendah (4–8%), tidak pernah mengganggu keterbacaan teks utama.
4. **Respek Kultural Tanpa Klise**: Mengambil inspirasi dari filosofi lambang YARSIS (*"sedulur papat lima pancer"* — harmoni empat penjuru dengan pusat tauhid), diekspresikan melalui geometri modern tanpa menggunakan visual klise kubah masjid kartun.
5. **Nol Gambar Stok**: Seluruh ilustrasi dibangun menggunakan SVG presisi dan styling CSS modern; tidak menggunakan foto atau logo berhak cipta milik pihak lain.

### 6.2 Token Warna (Prefix `tower-*`)
Sistem warna dikonfigurasikan pada Tailwind CSS v4 `@theme`:

| Token | Hex | Rasio Kontras Minimum | Peruntukan Utama |
|---|---|---|---|
| `tower-950` | `#04231F` | > 10:1 vs ivory | Footer, background kontras tinggi, teks di atas latar emas. |
| `tower-900` | `#063B36` | > 8:1 vs ivory | Header hero gelap, navbar desktop saat scroll. |
| `tower-800` | `#0A4F48` | > 7:1 vs ivory | **Warna Primer**: Tombol CTA utama, judul section, border aksen. |
| `tower-700` | `#0F6B61` | > 4,5:1 vs ivory | State hover elemen primer, ikonografi aktif. |
| `tower-600` | `#178579` | > 4,5:1 vs putih | Aksen sekunder, teks interaktif di atas latar terang. |
| `tower-100` | `#D6EFEB` | - | Latar chip tag, border kartu, hover permukaan netral. |
| `tower-50`  | `#EEF8F6` | - | Latar section alternatif zebra, kartu fitur soft. |
| `gold-700`  | `#8A6A14` | ≥ 4,8:1 vs ivory | **Teks aksen emas di atas latar terang**. |
| `gold-500`  | `#C9A24A` | - | Garis lantai hairline, ornamen border, ikon di atas gelap (Bukan untuk teks di latar ivory). |
| `gold-300`  | `#E3CB8A` | ≥ 4,5:1 vs tower-900 | Teks aksen emas di atas latar gelap. |
| `gold-100`  | `#F4EBD0` | - | Latar highlight kartu prestasi & akreditasi. |
| `ivory`     | `#FBF8F1` | - | Latar belakang kanvas utama halaman. |
| `ink`       | `#10201E` | > 12:1 vs ivory | Teks heading dan body utama. |
| `ink-soft`  | `#4B5F5C` | > 5:1 vs ivory | Teks deskripsi sekunder dan metadata. |
| `alert-600` | `#C62F2F` | ≥ 4,5:1 vs putih | **Khusus Darurat**: Bar darurat, tombol IGD, status kamar penuh. |
| `alert-50`  | `#FDECEC` | - | Latar belakang notifikasi peringatan IGD. |

**Aturan Ketat Penggunaan Warna:**
1. Token `alert-*` **hanya boleh** digunakan pada komponen darurat (`EmergencyBar`, `app/igd/*`, dan `BedStatus`).
2. `gold-500` dilarang digunakan sebagai warna teks di atas latar belakang `ivory` atau putih (gunakan `gold-700`).
3. Seluruh pasangan kombinasi teks dan latar belakang wajib lolos uji skrip kontras rasio WCAG 2.2 AA.

### 6.3 Tipografi
* **Display Font**: `Playfair Display` (Weight 600, 700; Italic 600 untuk penekanan aksen sejarah/motto). Digunakan untuk judul section utama, angka statistik penting, dan nomor lantai Tower.
* **Body / UI Font**: `Plus Jakarta Sans` (Weight 400, 500, 600, 700). Digunakan untuk seluruh body copy, form, tabel jadwal, tombol navigasi, dan komponen antarmuka.
* **Skala Fluid (`clamp`)**:
  * `display-xl`: `clamp(2.5rem, 5vw + 1rem, 4.5rem)` (40px → 72px)
  * `display-lg`: `clamp(2rem, 3.5vw + 0.5rem, 3.25rem)` (32px → 52px)
  * `h2`: `clamp(1.75rem, 2vw + 0.5rem, 2.5rem)` (28px → 40px)
  * `h3`: `clamp(1.375rem, 1vw + 0.5rem, 1.75rem)` (22px → 28px)
  * `body`: `clamp(1rem, 0.25vw + 0.95rem, 1.125rem)` (16px → 18px, min 16px)
  * `caption`: `0.875rem` (14px)
* Implementasi menggunakan `next/font/google` dengan opsi `display: 'swap'` untuk mencegah Layout Shift.

### 6.4 Komposisi & Motif Khas
* **Garis Lantai Hairline**: Garis horizontal 1px berwarna emas halus (`gold-500/30`) sebagai penanda ritme vertikal pemisah section.
* **Pola Geometris Khatam**: Pola SVG `<pattern>` 8 sudut (dua bujur sangkar bersilangan 45° dengan titik pusat tauhid), disematkan dengan opasitas 4–6% pada hero banner dan footer.
* **Siluet Tower 13 Lantai**: Representasi visual minimalis gedung Tower berupa susunan balok lantai proporsional dengan jendela transparan bercahaya, digunakan di hero dan Tower Directory.
* **Radius & Bayangan**: Border radius konsisten 8–12px (modern clean), bayangan sangat lembut (`0 4px 20px -2px rgba(4, 35, 31, 0.05)`).
* **Sistem Grid**: 12-kolom responsif, container maksimum 1200px, padding horizontal 16px (mobile) hingga 24px (desktop).

### 6.5 Panduan Gerak (Motion)
* Motion digunakan secara fungsional untuk mempertegas tata letak, bukan sebagai efek kosmetik berlebihan.
* Hero: Efek siluet Tower bertingkat muncul dengan stagger halus (40ms per lantai, durasi total ≤ 1,0s).
* Angka statistik: Efek counter naik saat pertama kali masuk ke dalam viewport.
* Tower Directory: Transisi geser horizontal halus (200–250ms) saat berganti pemilihan lantai.
* **Dukungan Aksesibilitas Mutlak**: Seluruh animasi wajib dibungkus media query `prefers-reduced-motion: reduce`. Saat aktif, seluruh elemen langsung berada pada kondisi akhir tanpa transisi.

### 6.6 Nada Suara (Copywriting)
* Bahasa Indonesia baku, formal, ramah, dan menenangkan (khas institusi medis bernapaskan Islam).
* Hindari klaim superlatif tanpa landasan data seperti "rumah sakit terbaik di Jawa Timur" atau "fasilitas terhebat nomor satu".
* Gunakan sapaan resmi: *"Assalamu’alaikum Warahmatullahi Wabarakatuh"* ditempatkan secara terhormat di beranda, tanpa diulang berlebihan di setiap sub-halaman.
* Motto resmi yang diadopsi: *"Kesembuhan datang dari Allah, keselamatan dan kepuasan pasien tanggung jawab kami."*
* Tagline: *"Modern dan Terpercaya"*.

---

## 7. Arsitektur Informasi & Peta Situs

```
/
├── /igd                    -> Halaman Darurat & Triase (Prioritas Utama, Fast Load)
├── /dokter                 -> Direktori Pencarian & Filter Dokter
│   └── /dokter/[slug]      -> Detail Profil & Jadwal Mingguan Dokter
├── /layanan                -> Katalog Layanan & Poliklinik Spesialis
│   └── /layanan/[slug]     -> Detail Layanan Unggulan (8 Layanan)
├── /tower                  -> Tower Directory Interaktif (Fitur Penanda)
├── /daftar                 -> Wizard Pendaftaran Pasien Rawat Jalan (Demo)
├── /tentang                -> Sejarah RSIS, Rekam Jejak Akreditasi, Nilai YARSIS
├── /kontak                 -> Informasi Kontak, Akses Transportasi & Lokasi Fisik
├── /styleguide             -> Katalog Desain Internal (Dev-Only, Noindex)
└── /404                    -> Halaman 404 Responsif Bertema "Hijau Tower"
```

### Struktur Navigasi Global
1. **Emergency Top Bar (Desktop) / Dock (Mobile)**: Selalu berada pada posisi teratas atau fixed di layar ponsel, memuat nomor telepon 1500718 dan 08 112 33 999.
2. **Main Navigation**: Dokter · Layanan · Tower Directory · Tentang · Kontak.
3. **Primary Action CTA**: Tombol "Daftar Online" (`tower-800`).
4. **Disclaimer Banner**: Teks permanen berukuran halus di bagian atas header: *"Studi Kasus Portofolio Independen · Bukan Website Resmi RS Islam Surabaya"*.

---

## 8. Spesifikasi Fitur (FR-01 s/d FR-12)

### FR-01 · Shell Global & Navigasi (P0)
* **Given** pengguna membuka halaman mana pun pada aplikasi.
* **When** halaman dirender.
* **Then** sistem menampilkan: (1) banner disclaimer konsep independen, (2) bar darurat dengan tautan `tel:`, (3) header navigasi utama, (4) footer lengkap dengan disclaimer hukum, tautan resmi `@rsisurabaya`, dan tahun dinamis (`new Date().getFullYear()`).
* **Given** perangkat mobile (lebar layar < 768px).
* **When** pengguna menggulir halaman ke bawah.
* **Then** bar darurat bawah menempel tetap (*fixed bottom dock*) tanpa menutupi elemen navigasi atau tombol aksi (diberi kompensasi `pb-16`).
* **Given** pengguna menavigasi dengan keyboard.
* **When** menekan tombol `Tab` pertama kali.
* **Then** tautan skip-link *"Lewati ke konten utama"* muncul di kiri atas layar dengan fokus yang jelas.

### FR-02 · Beranda / Halaman Utama (P0)
* **Urutan Section Beranda (Terkunci Sesuai Hirarki Kebutuhan Pasien):**
  1. **Hero**: Headline yang berwibawa, sapaan hangat, visualisasi siluet Tower 13 lantai, dan 2 tombol aksi utama ("Daftar Poliklinik" & "Cari Dokter Spesialis").
  2. **Akses Cepat (Quick Actions)**: 5 kartu pintas dengan ikon jelas (IGD 24 Jam, Cari Dokter, Pendaftaran Online, Jadwal Praktik, Tower Directory).
  3. **Status Ketersediaan Kamar Rawat Inap (`BedStatus`)**: Ringkasan ketersediaan kamar intensif & rawat inap (ICU, HCU, NICU, dll.) dengan label tegas **"Data Simulasi / Ilustrasi"**.
  4. **Layanan Unggulan**: Cuplikan 6 kartu layanan unggulan rumah sakit dengan tautan detail.
  5. **Strip Fakta Historis**: Statistik terverifikasi: Tahun 1975, Rumah Sakit Kelas B, Kapasitas 238 Tempat Tidur, Akreditasi Paripurna 2016 · 2019 · 2022, Fasilitas 24 Jam.
  6. **Teaser Tower Directory**: Visualisasi interaktif mini yang mengajak pengunjung menjelajahi lantai Tower 13 Lantai.
  7. **Cari Dokter Cepat**: Form mini (pilihan spesialisasi & hari) yang langsung mengarahkan ke `/dokter?spesialis=...&hari=...`.
  8. **Bukti Sosial & Kepuasan Pasien**: Ringkasan rating publik: *"4,7 dari 7.034 ulasan Google (Cuplikan Okt 2026)"*.
  9. **Kontak & Lokasi Ringkas**: Alamat Jl. Achmad Yani No. 2-4 Surabaya, panduan arah, dan jam buka 24 jam.
* **Kriteria Teknis**: Elemen Largest Contentful Paint (LCP) pada beranda **wajib berupa teks headline**, bukan gambar raster, guna memastikan LCP ≤ 2,5 detik pada koneksi mobile.

### FR-03 · Halaman IGD & Layanan Darurat `/igd` (P0)
* **Given** pengguna membuka rute `/igd`.
* **When** halaman selesai dimuat.
* **Then** pada area *above-the-fold* (tanpa perlu scroll pada layar 360×640) langsung terlihat:
  * Tombol panggilan darurat `tel:1500718` (Emergency Call RSIS).
  * Tombol panggilan ambulans `tel:0811233999` (Ambulans Siaga 24 Jam).
  * Tombol navigasi *"Buka Arah di Google Maps"*.
  * Alamat fisik IGD (Gedung Tower Lantai 2).
* Halaman memuat informasi penunjang: alur triase pasien gawat darurat, sertifikasi tim medis (ATLS/ACLS), fasilitas ambulans transport & emergency, serta kemudahan pendaftaran rawat inap dan depo farmasi IGD satu lantai.
* **Aturan Keras**: Halaman ini dilarang menggunakan animasi transisi masuk (motion: none) dan dilarang memuat skrip pihak ketiga guna menjamin load time secepat kilat.

### FR-04 · Direktori & Filter Dokter `/dokter` (P0)
* Sistem filter multi-dimensi:
  * Pencarian teks bebas (nama dokter atau sub-spesialisasi).
  * Filter Spesialisasi Kedokteran (Penyakit Dalam, Anak, Bedah, Jantung, dsb.).
  * Filter Hari Praktik (Senin s/d Sabtu).
  * Filter Penjamin (Semua, BPJS Kesehatan, Umum/Asuransi).
  * Filter Jenis Poliklinik (Reguler, Eksekutif).
* **Sinkronisasi URL**: Setiap perubahan filter langsung memperbarui query string di URL browser (misal `/dokter?spesialis=jantung&hari=senin&penjamin=bpjs`). Jika URL tersebut disalin dan dibuka di tab baru, filter wajib memulihkan state sebelumnya secara presisi.
* **Empty State**: Jika hasil pencarian nihil, tampilkan pesan informatif ramah, tombol *"Reset Semua Filter"*, dan saran dokter terkait.
* **Tampilan Kartu Dokter**: Inisial bergradasi tema `tower-*`, nama lengkap beserta gelar klinis, spesialisasi, hari dan jam praktik, tag penjamin (BPJS / Eksekutif), serta lencana eksplisit **"Ilustrasi"**.

### FR-05 · Profil Dokter `/dokter/[slug]` (P0)
* Menampilkan rincian profil dokter fiktif berlabel ilustrasi: deskripsi pengalaman klinis, bidang keahlian, tabel jadwal praktik mingguan (tabel matriks di desktop, akordeon per hari di mobile), dan jenis penjamin yang diterima.
* Dilengkapi tombol CTA utama: *"Daftar ke Dokter Ini"* yang secara otomatis membawa parameter dokter (`/daftar?dokter=[slug]`) ke dalam alur pendaftaran.

### FR-06 · Katalog Layanan & Poliklinik `/layanan` & `/layanan/[slug]` (P0/P1)
* Katalog komprehensif 8 Layanan Unggulan (IGD 24 Jam, Hemodialisis 30 Mesin, Ruang Perawatan Intensif ICU/ICCU/HCU/NICU/PICU, Kamar Operasi Modern, Kamar Bersalin Thaif & An-Nisa, Penunjang Laboratorium & Radiologi 24 Jam, Rehabilitasi Medik, Bina Rohani Pasien).
* Indeks 20 Poliklinik Spesialis dengan informasi lokasi gedung dan lantai yang terhubung langsung ke Tower Directory.
* Halaman detail layanan (`/layanan/[slug]` - P1): Menguraikan fasilitas medis, peralatan diagnostik canggih (CT-Scan 128 Slice, C-Arm, Fakoemulsifikasi), daftar dokter terkait, dan jam pelayanan operasional.

### FR-07 · Tower Directory Interaktif `/tower` (P0 — Signature Feature)
* **Visualisasi Bangunan Ganda**: Tab pemilih antara **Gedung Tower (13 Lantai)** dan **Gedung Graha (Ground + 5 Lantai)**.
* **Interaksi Pemilihan Lantai**: Pengguna dapat memilih lantai melalui klik, tap, atau tombol panah keyboard (`ArrowUp`/`ArrowDown`).
* **Panel Informasi Lantai**: Menampilkan daftar fasilitas dan layanan medis di lantai tersebut, lengkap dengan tautan rute ke halaman detail layanan.
* **Pencegahan Halusinasi (K4)**: Lantai pada Tower yang tidak memiliki data resmi dari S1 (Lantai 1, 5, 6, 8, 9, 10, 11, 12, 13) **secara tegas menampilkan status "Informasi belum tersedia"**. Dilarang keras mengarang isi ruangan.
* **Indikator Kamar Intensif**: Pada Tower Lantai 4, sertakan komponen status keterisian tempat tidur intensif (`BedStatus`).
* **Deep Linking**: Rute mendukung navigasi langsung via URL: `/tower?gedung=tower&lantai=4`.
* **Aksesibilitas (A11y)**: Kontrol lantai menerapkan pola ARIA `role="tablist"` vertikal dengan `aria-controls` dan `aria-selected`. Panel konten menggunakan `aria-live="polite"`.
* **Tampilan Mobile**: Siluet gedung beradaptasi menjadi selector horizontal ringkas di atas panel informasi lantai.

### FR-08 · Wizard Pendaftaran Online Demo `/daftar` (P0)
* Alur pendaftaran mandiri rawat jalan dalam 4 langkah intuitif:
  1. **Langkah 1 (Jalur Pelayanan)**: Pilih jenis penjamin (BPJS Kesehatan / Pasien Umum / Asuransi Swasta).
  2. **Langkah 2 (Poliklinik & Spesialis)**: Pilih poliklinik tujuan berdasarkan keluhan atau rujukan.
  3. **Langkah 3 (Pilih Dokter & Jadwal)**: Memilih dokter spesialis; sistem hanya mengaktifkan tanggal kalender yang sesuai dengan jadwal praktik dokter terpilih.
  4. **Langkah 4 (Data Pasien & Konfirmasi)**: Input data simulasi pasien (Nama, No. WhatsApp format Indonesia, No. KTP simulasi 16 digit).
* **Ringkasan & Kode Antrean**: Setelah tombol selesai diklik, tampilkan kartu tanda bukti pendaftaran demo dengan kode antrean lokal (misal: `POLI-INT-042`), tanggal periksa, dan panduan check-in di loket rumah sakit.
* **Privasi & Keamanan Ketat**:
  * Di seluruh langkah terpasang banner permanen: *"Sistem Demo Portofolio: Jangan memasukkan data pribadi atau rekam medis asli Anda."*
  * **Nol Request Jaringan (Zero Network Requests)**: Form sepenuhnya diproses di memori browser. Dibuktikan melalui pengujian E2E Playwright yang memastikan tidak ada network request keluar saat submit.
  * State formulir dikelola melalui Zustand (in-memory store, tanpa persist ke localStorage untuk perlindungan privasi).

### FR-09 · Halaman Tentang Rumah Sakit `/tentang` (P1)
* Garis waktu sejarah interaktif dari tahun 1975 hingga peresmian Tower 13 Lantai tahun 2023 oleh Presiden RI (Lampiran C).
* Rekam jejak akreditasi resmi rumah sakit: Paripurna KARS & LAM-KPRS (2016, 2019, 2022).
* Nilai dan filosofi yayasan YARSIS yang diadaptasi secara santun dan modern.

### FR-10 · Halaman Kontak & Lokasi `/kontak` (P1)
* Informasi kontak resmi: Nomor telepon sentral (031) 8284505, Emergency Call 1500718, Ambulans 08 112 33 999.
* Alamat lengkap: Jl. Achmad Yani No. 2-4, Wonokromo, Surabaya 60243.
* Jam operasional fasilitas darurat dan penunjang (IGD, Laboratorium, Radiologi, Farmasi — Buka 24 Jam).
* Ilustrasi peta SVG minimalis dengan tombol tautan eksternal langsung menuju Google Maps resmi (`https://maps.app.goo.gl/u2JxcgMixBtpgmUj9`). **Tanpa embed iframe Google Maps dan tanpa Google Maps API key.**

### FR-11 · Halaman Artikel Kesehatan `/artikel` (P2 — Opsional)
* Fitur sekunder yang hanya dikerjakan jika Fase 1–5 selesai lebih awal. Memuat 4 artikel edukasi kesehatan preventif bertema islami-medis dengan penafian tegas: *"Konten edukasi simulasi, bukan rujukan medis resmi"*.

### FR-12 · Mode Konsep, Privasi & Keamanan (P0)
* **Anti-Indeksasi Penuh**: Tag `<meta name="robots" content="noindex, nofollow">` pada root layout, header HTTP `X-Robots-Tag: noindex, nofollow`, file `robots.txt` dengan aturan `Allow: /` (memastikan bot membaca meta noindex), tanpa sitemap XML, dan tanpa JSON-LD berjenis Hospital/Physician.
* **Nol Pelacak Pihak Ketiga**: Tidak menggunakan skrip Google Analytics, Facebook Pixel, cookies pelacak, atau font CDN eksternal (seluruh font di-self host via `next/font`).
* **Pemberitahuan Transparan**: Banner disclaimer portofolio dan footer disclaimer hadir di setiap halaman.

---

## 9. Model Data (TypeScript & Validasi Zod)

Seluruh data disimpan sebagai file TypeScript statis pada direktori `src/data/` dan divalidasi saat proses build melalui skema Zod.

```typescript
// src/data/types.ts

export type Penjamin = 'bpjs' | 'umum' | 'asuransi';
export type PoliCategory = 'reguler' | 'eksekutif';
export type Hari = 'senin' | 'selasa' | 'rabu' | 'kamis' | 'jumat' | 'sabtu' | 'minggu';
export type BuildingId = 'tower' | 'graha';
export type BedStatusLevel = 'tersedia' | 'terbatas' | 'penuh';

export interface DoctorSchedule {
  hari: Hari;
  mulai: string;   // Format 24 jam "HH:mm" misal "08:00"
  selesai: string; // Format 24 jam "HH:mm" misal "12:00"
  poli: PoliCategory;
}

export interface Doctor {
  slug: string;
  name: string;
  title: string;           // Gelar medis misal "dr. Ahmad Fauzi, Sp.PD"
  specialtyId: string;     // Foreign key ke Specialty.id
  subSpecialty?: string;
  penjamin: Penjamin[];
  poli: PoliCategory[];
  schedule: DoctorSchedule[];
  bio: string;
  isFictional: true;       // Wajib true untuk seluruh data fixture
}

export interface Specialty {
  id: string;              // misal "penyakit-dalam", "jantung"
  name: string;
  group: 'dasar' | 'spesialistik' | 'penunjang';
  summary: string;
  iconName: string;
}

export interface Service {
  slug: string;
  name: string;
  summary: string;
  description: string;
  buildingId: BuildingId;
  floor: number;
  open24h: boolean;
  highlight: boolean;      // Masuk 8 layanan unggulan
  sourceNote: string;      // Asal verifikasi sumber (misal "S1 Pelayanan")
}

export interface FloorInfo {
  buildingId: BuildingId;
  floor: number;
  label: string;
  serviceSlugs: string[];
  known: boolean;          // false jika informasi lantai tidak tersedia di publik
  description?: string;
}

export interface BedStatusItem {
  unit: 'ICU' | 'ICCU' | 'HCU' | 'NICU' | 'PICU' | 'Rawat Inap Reguler';
  status: BedStatusLevel;
  note?: string;           // Simulasi keterangan
}
```

### Aturan Ketat Pengelolaan Data
1. **Pusat Fakta Tunggal (`src/data/facts.ts`)**: Berisi seluruh konstanta rumah sakit (tahun berdiri, nomor telepon darurat, alamat, statistik tempat tidur, rekam jejak akreditasi). Komponen dilarang menulis angka/fakta secara hardcode.
2. **Skrip `npm run validate:data`**: Memastikan integritas referensial:
   - Seluruh `specialtyId` dokter harus terdaftar di `specialties.ts`.
   - Seluruh `serviceSlugs` di denah lantai harus terdaftar di `services.ts`.
   - Format waktu jadwal dokter wajib regex `^([01]\d|2[0-3]):([0-5]\d)$`.
   - Seluruh entitas dokter wajib memiliki properti `isFictional: true`.
3. **Skrip `npm run check:facts`**: Memindai seluruh codebase komponen untuk memastikan tidak ada string literal nomor darurat atau angka klaim yang lolos di luar impor dari `facts.ts`.

---

## 10. Persyaratan Non-Fungsional

| Kategori | Standar Spesifikasi | Prosedur Verifikasi |
|---|---|---|
| **Performa** | Skor Lighthouse Mobile: Performance ≥ 90. LCP ≤ 2,5s, CLS ≤ 0,1, TBT ≤ 200ms. Ukuran JavaScript first-load halaman beranda ≤ 200 KB gzipped. | Pengujian audit Lighthouse lokal (`next start` mode produksi). |
| **Aksesibilitas** | Kepatuhan WCAG 2.2 Level AA. Tag HTML semantik (`<header>`, `<main>`, `<nav>`, `<aside>`, `<footer>`), atribut `lang="id"`, indikator fokus terlihat jelas, target sentuh interaktif minimum 44×44px. | Audit otomatis axe-core di Playwright + uji manual navigasi keyboard. |
| **Keamanan** | Zero Backend surface. Header keamanan dasar di `next.config.mjs` (Content Security Policy, X-Frame-Options: DENY, X-Content-Type-Options: nosniff). Dilarang menggunakan `dangerouslySetInnerHTML`. | Audit kode statis & build validation. |
| **Privasi Pengguna** | Tidak menyimpan data masukan pasien pada persistent storage browser. Nol network request pada wizard pendaftaran demo. | Playwright network request assertion test. |
| **Kompatibilitas** | Tampilan sempurna pada browser modern (Chrome, Edge, Firefox, Safari 2 versi terakhir, Samsung Internet). | Render engine test. |
| **Responsivitas** | Tampilan teruji pada breakpoint lebar: 360px, 390px, 768px, 1024px, 1280px, 1440px. Bebas dari pergeseran horizontal (overflow-x). | Playwright responsive viewport visual checks. |
| **Kualitas Kode** | TypeScript strict mode, 0 error, 0 warning pada ESLint, tidak ada penggunaan tipe `any`, tidak ada placeholder / komentar `TODO`. | `npm run lint` & `npm run typecheck`. |

---

## 11. Keputusan Arsitektur & Teknologi

| Keputusan | Pilihan Teknologi | Rationale & Alasan Pemilihan | Solusi yang Ditolak & Alasannya |
|---|---|---|---|
| **Struktur Repositori** | Aplikasi Mandiri Next.js (App Router) | Proyek portofolio ringkas, seluruh modul berada dalam satu kesatuan kode. | **Turborepo / Monorepo**: Ditolak karena menambah overhead konfigurasi tanpa manfaat nyata pada proyek single-deploy. |
| **Model Rendering** | Static Site Generation (SSG) | Kecepatan saji instan, nol biaya operasional server, kebal terhadap downtime database. | **Server-Side Rendering (SSR) / Database**: Ditolak karena over-engineering (YAGNI). |
| **Styling & Token** | Tailwind CSS v4 (`@theme`) + Primitif Radix UI | Performa build secepat kilat, token styling terpusat di CSS-first, aksesibilitas komponen terjamin melalui Radix/shadcn. | **Tailwind v3 / CSS-in-JS**: v4 lebih modern dan efisien; CSS-in-JS menambah runtime footprint. |
| **Manajemen State** | URL Query String + Zustand | Parameter pencarian dokter wajib dapat di-bookmark dan dibagikan via URL. Zustand hanya digunakan untuk wizard pendaftaran. | **Redux / Context Berlapis**: Terlalu berat dan memicu re-render yang tidak efisien. |
| **Animasi UI** | CSS Modern + Motion (Framer Motion) | Transisi mikro yang halus, dukungan bawaan untuk `prefers-reduced-motion`. | **Lottie / GSAP**: Menambah bundle size library yang berat. |
| **Validasi Skema** | Zod | Single source of truth untuk validasi fixture data saat build time dan validasi input form demo. | **Yup / Validasi Manual**: Zod terintegrasi lebih mulus dengan TypeScript strict. |
| **Test Automation** | Vitest + Playwright + axe-core | Kombinasi tercepat untuk unit testing logika data dan pengujian end-to-end browser nyata serta aksesibilitas. | **Jest / Cypress**: Vitest lebih cepat dalam lingkungan ESM/Vite; Playwright lebih stabil dan ringan. |
| **Otomasi Skrip** | Node.js ESM (`scripts/*.mjs`) | Kompatibel penuh lintas sistem operasi (khususnya Windows PowerShell lingkungan kerja pengguna). | **Bash Scripting (`.sh`)**: Berisiko gagal pada environment Windows tanpa subsistem Linux. |

---

## 12. Fase Kerja & Kriteria Keluar (Evidence Gate Protocol)

Setiap fase wajib diakhiri dengan pembuatan dokumen bukti mentah pada direktori `docs/evidence/` dan **berhenti menunggu kata persetujuan resmi: "APPROVED PHASE N"** dari Pacoel sebelum dapat melangkah ke fase berikutnya.

```
Fase 0: Discovery & Verifikasi Lingkungan
   └── Gate 0: Konfirmasi versi tool & rencana tertulis -> Tunggu "APPROVED PHASE 0"
Fase 1: Inisialisasi Fondasi & Shell Global
   └── Gate 1: Build, Lint, Typecheck, Kontras Warna -> Tunggu "APPROVED PHASE 1"
Fase 2: Arsitektur Data Fixture & Validasi Otomatis
   └── Gate 2: Skrip validate:data, check:facts, Vitest -> Tunggu "APPROVED PHASE 2"
Fase 3: Rute Inti Medis (Beranda, IGD, Dokter, Layanan)
   └── Gate 3: Build, axe-core a11y, Playwright E2E Filter -> Tunggu "APPROVED PHASE 3"
Fase 4: Fitur Penanda (Tower Directory) & Wizard Pendaftaran
   └── Gate 4: Playwright E2E Wizard (Zero Network), axe-core -> Tunggu "APPROVED PHASE 4"
Fase 5: Halaman Sekunder (Tentang, Kontak, Detail Layanan)
   └── Gate 5: Build lengkap, axe-core seluruh rute -> Tunggu "APPROVED PHASE 5"
Fase 6: Pengerasan, Audit Lighthouse & Dokumentasi Portofolio
   └── Gate 6: Lighthouse Mobile, Audit Responsif, Case Study README -> Final Review
```

---

## 13. Matriks Risiko & Rencana Mitigasi

| Risiko Potensial | Tingkat Dampak | Strategi Mitigasi Proaktif |
|---|---|---|
| **Scope Creep (Fitur Melebar)** | Kritis | Kunci ketat scope pada §4.2. Wajib audit git diff pada setiap fase untuk memastikan tidak ada kode backend, CMS, atau login yang disisipkan. |
| **Klaim Kualitas Tanpa Bukti** | Tinggi | Penerapan Evidence Gate: klaim performa atau aksesibilitas ditolak jika tidak disertai lampiran file output mentah di `docs/evidence/`. |
| **Risiko Reputasi & Etika Kesehatan** | Kritis | Banner disclaimer permanen di header, footer disclaimer hukum, meta tag `noindex`, dan penegasan bahwa seluruh dokter adalah tokoh fiktif simulasi. |
| **Data Pasien Asli Bocor ke Form Demo** | Kritis | Peringatan privasi visual di form pendaftaran, state form berbasis in-memory (tanpa localStorage), dan penegasan nol request jaringan. |
| **Kontras Warna Emas Gagal pada Latar Terang** | Sedang | Pemisahan tegas: `gold-700` untuk teks di atas ivory; `gold-500` dilarang untuk teks; verifikasi otomatis melalui skrip `check-contrast.mjs`. |
| **Inkonsistensi Angka Rumah Sakit** | Sedang | Seluruh data statistik wajib diimpor dari satu sumber `src/data/facts.ts`. Pelanggaran dideteksi otomatis oleh skrip `check:facts`. |

---

## Lampiran A · Katalog Konten Faktual (Sumber S1, Diambil 19 Okt 2026)

### 8 Layanan Unggulan Terverifikasi:
1. **Instalasi Gawat Darurat 24 Jam (Tower Lt. 2)**: Emergency bedah & non-bedah, trauma center dengan sertifikasi ATLS/ACLS, sistem triase modern, ambulans gawat darurat, depo farmasi IGD, dan pendaftaran rawat inap satu atap.
2. **Unit Hemodialisis (Graha Lt. 1)**: Fasilitas cuci darah dengan 30 unit mesin modern, dialiser sekali pakai (*single use* demi pencegahan infeksi silang), melayani pasien BPJS Kesehatan maupun umum.
3. **Ruang Perawatan Intensif Terpadu (Tower Lt. 4)**: ICU (Intensive Care Unit), ICCU (Intensive Coronary Care Unit), HCU (High Care Unit), NICU (Neonatal Intensive Care Unit), dan PICU (Pediatric Intensive Care Unit).
4. **Instalasi Bedah Sentral**: 4 kamar operasi canggih bertekanan positif dan negatif, dilengkapi C-Arm untuk bedah ortopedi presisi, serta fakoemulsifikasi untuk operasi katarak sayatan minimal.
5. **Kamar Bersalin Islami**: Ruang Bersalin Thaif (Gedung Graha Lt. 2) dan Ruang An-Nisa (Gedung Tower Lt. 7); fasilitas rawat gabung, ruang tindakan kebidanan, kamar bersalin umum, dan ruang perawatan VIP.
6. **Layanan Penunjang Medis 24 Jam**:
   - **Laboratorium (Tower Lt. 3)**: Patologi Klinik, Patologi Anatomi, Mikrobiologi, Bank Darah Rumah Sakit, dan Biomolekuler/PCR.
   - **Radiologi (Tower Lt. 3)**: Multislice CT-Scan 128 Slice, USG 4D, Ekokardiografi, Mamografi digital, Rontgen Panoramic, dan Dental X-Ray.
   - **Farmasi 24 Jam**: Apotek Rawat Jalan, Apotek BPJS, dan Depo Farmasi IGD.
7. **Instalasi Rehabilitasi Medik**: Fisioterapi komprehensif, klinik tumbuh kembang anak (terapi wicara dan okupasi), klinik laktasi, dan skrining pendengaran bayi baru lahir (*Otoacoustic Emissions / OAE*).
8. **Bina Rohani & Pemulasaran Jenazah**: Pelayanan bimbingan ibadah pasien (tata cara wudhu tayamum dan sholat saat sakit), pendampingan sakaratul maut, serta instalasi pemulasaran jenazah sesuai syariat Islam.

### 20 Poliklinik Rawat Jalan:
1. Penyakit Dalam
2. Bedah Umum
3. Kesehatan Anak
4. Obstetri & Ginekologi (Kebidanan & Kandungan)
5. Urologi & ESWL
6. Paru & Pernapasan
7. Ortopedi & Traumatologi
8. Jantung & Pembuluh Darah
9. Kesehatan Mata
10. Kulit & Kelamin
11. Telinga, Hidung, Tenggorok (THT-KL)
12. Saraf / Neurologi
13. Kesehatan Jiwa / Psikiatri
14. Anestesi & Manajemen Nyeri
15. Kedokteran Fisik & Rehabilitasi
16. Bedah Saraf
17. Bedah Anak
18. Bedah Plastik, Rekonstruksi & Estetika
19. Bedah Toraks, Kardiak & Vaskular (BTKV)
20. Poliklinik Estetika Medik

### Mitra Penjamin:
BPJS Kesehatan, BPJS Ketenagakerjaan, Asuransi Kesehatan Swasta, Perusahaan/Instansi Mitra, dan Pasien Mandiri (Umum).

### Informasi Kontak & Koordinat Resmi:
- Telepon Sentral: (031) 8284505
- Emergency Call: 1500718
- Ambulans Gawat Darurat: 08 112 33 999
- Alamat: Jl. Achmad Yani No. 2-4, Kel. Wonokromo, Kec. Wonokromo, Kota Surabaya, Jawa Timur 60243
- Titik Koordinat Peta: `−7.3061594, 112.7347193`

---

## Lampiran B · Direktori Bangunan (Dasar Data Tower Directory)

| Gedung | Lantai | Alokasi Unit Layanan & Fasilitas (Sumber Publik S1) | Status Data |
|---|---|---|---|
| **Gedung Graha** | Ground (Dasar) | Poliklinik Ortopedi, Bedah Umum, THT, Gigi Spesialis; Apotek Rawat Jalan; Kasir; Resepsionis Utama; BPJS Centre; Loket Pendaftaran Poliklinik | Terverifikasi |
| **Gedung Graha** | Lantai 1 | Unit Hemodialisis (30 Mesin), Klinik Vaksinasi & Imunisasi | Terverifikasi |
| **Gedung Graha** | Lantai 2 | Ruang Perawatan Bersalin (Ruang Thaif), Seksi Bina Rohani Islam | Terverifikasi |
| **Gedung Graha** | Lantai 3 | Ruang Rawat Inap Anak (Ruang Madinah), Poli Estetika, Poli Urologi & Ruang ESWL | Terverifikasi |
| **Gedung Graha** | Lantai 4 | Ruang Rawat Inap Dewasa (Ruang Makkah), Poliklinik Kesehatan Jiwa | Terverifikasi |
| **Gedung Graha** | Lantai 5 | Kantor Manajemen Rumah Sakit, Layanan Pengurusan Akte Kelahiran | Terverifikasi |
| **Gedung Tower** | Lantai 2 | Instalasi Gawat Darurat (IGD 24 Jam), Pendaftaran Rawat Inap, Layanan Pelanggan (Customer Care), Depo Farmasi IGD | Terverifikasi |
| **Gedung Tower** | Lantai 3 | Laboratorium Terpadu 24 Jam, Instalasi Radiologi 24 Jam, Unit Medical Check Up (MCU) | Terverifikasi |
| **Gedung Tower** | Lantai 4 | Unit Perawatan Intensif (ICU, ICCU, HCU, NICU, PICU) | Terverifikasi |
| **Gedung Tower** | Lantai 7 | Ruang Perawatan Bersalin An-Nisa | Terverifikasi |
| **Gedung Tower** | **Lantai 1, 5, 6, 8, 9, 10, 11, 12, 13** | **Informasi belum tersedia pada publikasi resmi.** *(Wajib ditampilkan dengan status eksplisit "Informasi belum tersedia", dilarang dikarang).* | Dibatasi Sesuai Fakta (K4) |

---

## Lampiran C · Kronologi Sejarah Rumah Sakit (1975–2026)

* **25 Maret 1975**: Rumah Sakit Islam Surabaya resmi beroperasi dengan kapasitas awal 20 tempat tidur, didirikan oleh tokoh-tokoh Yayasan Rumah Sakit Islam Surabaya (YARSIS).
* **1985**: Pendirian Akademi Perawatan RSI Surabaya untuk mencetak tenaga keperawatan profesional yang berakhlak mulia.
* **1988**: Ekspansi pembangunan Gedung E dan Gedung F, menambah kapasitas rawat inap menjadi 28 tempat tidur.
* **1997**: Pembangunan gedung pelayanan penunjang diagnostik terpadu laboratorium dan radiologi.
* **1998**: Meraih sertifikasi akreditasi 5 pelayanan dasar rumah sakit dari Departemen Kesehatan RI.
* **2012**: Meraih kelulusan Akreditasi Rumah Sakit versi KARS 2012.
* **2014**: Penetapan resmi sebagai Rumah Sakit Kelas C dan peresmian gedung kamar operasi 2 lantai.
* **2015**: Pembukaan unit layanan hemodialisis dengan fasilitas dialisis modern.
* **2016**: Meraih predikat Akreditasi Tingkat Paripurna (Bintang Lima).
* **25 Maret 2018**: Soft opening Gedung Graha 5 lantai; Grand Opening diresmikan pada 12 Juli 2018 oleh Wakil Presiden RI Drs. H. M. Jusuf Kalla.
* **2019**: Mempertahankan predikat Akreditasi Paripurna.
* **2020**: Penanganan pandemi COVID-19 dengan penyediaan 80 tempat tidur ruang isolasi khusus bertekanan negatif.
* **2022**: Meraih kembali Akreditasi Tingkat Paripurna dari Lembaga Akreditasi Mutu dan Keselamatan Pasien Rumah Sakit (LAM-KPRS).
* **2023**: Peresmian Gedung Tower 13 Lantai oleh Presiden RI Ir. H. Joko Widodo sebagai simbol modernisasi layanan kesehatan dan persiapan Rumah Sakit Pendidikan.
* **2026**: Menyongsong 51 tahun pengabdian dengan transformasi digital mandiri dan peningkatan kelas operasional menjadi Rumah Sakit Kelas B.

---

## Lampiran D · Aturan Penyusunan Fixture Dokter

1. **Jumlah Minimal**: Wajib menyediakan minimal **24 profil dokter fiktif**, mencakup minimal 14 spesialisasi dari Lampiran A.
2. **Karakter Fiktif**: Nama tokoh wajib generik dan **diberi lencana visual "Ilustrasi"**; dilarang menggunakan nama tokoh medis RSIS yang nyata atau nama figur publik Indonesia.
3. **Jadwal Realistis**: Setiap dokter memiliki 2–4 sesi praktik dalam seminggu dengan pembagian waktu yang masuk akal (Shift Reguler: 08:00–14:00; Shift Eksekutif: 16:00–20:00).
4. **Konsistensi Penjamin**: Poliklinik Eksekutif hanya melayani pasien Umum dan Asuransi Swasta (tidak menerima BPJS Kesehatan), sedangkan Poliklinik Reguler melayani BPJS Kesehatan dan Umum.
5. **Visual Tanpa Foto Nyata**: Avatar menggunakan inisial tipografis berlatar gradasi token warna `tower-*` yang elegan, dilengkapi border tipis aksen emas.

---
*Dokumen ini merupakan spesifikasi teknis definitif untuk pengembangan studi kasus portofolio "Hijau Tower" dan dilindungi oleh Evidence Gate Protocol.*
