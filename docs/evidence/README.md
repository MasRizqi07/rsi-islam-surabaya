# Evidence Register

Dokumen ini mendefinisikan struktur dan validitas bukti verifikasi teknis proyek RS Islam Surabaya A. Yani ("Hijau Tower").

## Sumber Bukti Sah

Satu-satunya bukti sah verifikasi teknis adalah **output terminal mentah** yang disimpan dalam format file teks (`.txt`) di folder:
- [`raw/`](./raw/)

Setiap file di dalam `raw/` memuat:
1. Baris pertama: Perintah terminal yang dieksekusi.
2. Isi: Output asli terminal tanpa penyuntingan.
3. Baris terakhir: `EXIT CODE: <angka>`.

## Catatan Riwayat & Rekonsiliasi

1. **Legacy Narrative (`legacy-narrative/`)**:
   Folder [`legacy-narrative/`](./legacy-narrative/) memuat ringkasan naratif JSON buatan agent dari fase sebelumnya. Berkas-berkas tersebut disimpan demi transparansi riwayat repositori, namun **bukan** bukti mentah dan tidak boleh dikutip sebagai bukti pengujian teknis.
2. **Koreksi Pesan Commit `8a16a8b`**:
   Commit `8a16a8b` secara substantif hanya menambahkan berkas konfigurasi `vitest.config.mts`. Pesan commit awal ("feat: initialize Next.js hospital web application...") tidak mencerminkan cakupan isi perubahan yang sebenarnya.
