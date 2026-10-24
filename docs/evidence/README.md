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
3. **Catatan Hash Commit Akhir (`14-git-log.txt`)**:
   Berkas `14-git-log.txt` tidak dapat memuat hash commit akhir tempat berkas tersebut dicatat, karena setiap operasi `git commit --amend` untuk menyertakan berkas bukti secara inheren menghasilkan SHA commit baru.
4. **Bukti Raw Pra-Audit (`raw/before/`)**:
   Berkas output mentah sebelum proses audit independen disimpan di [`raw/before/`](./raw/before/) (`00-before-*.txt`) untuk keperluan audit keterlacakan historis.
5. **Catatan Kinerja LCP & Trade-off Optimasi**:
   Tindakan optimasi seperti penghapusan utility visual (`blur-3xl`) atau penambahan `prefetch={false}` berstatus **efek tidak terukur** tanpa adanya data median komparatif *sebelum* dan *sesudah* dari skrip audit yang sama. Penonaktifan prefetch (`prefetch={false}`) memiliki trade-off teknis berupa navigasi antar-halaman yang menjadi lebih lambat karena aset halaman tujuan baru diunduh saat pengguna berinteraksi/mengeklik tautan.
