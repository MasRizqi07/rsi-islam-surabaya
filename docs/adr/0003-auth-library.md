# ADR 0003: Pemilihan Library Autentikasi (Better Auth)

- **Keputusan**: Menggunakan Better Auth (`better-auth` ^1.7.12) untuk sistem autentikasi dan sesi kredensial demo.
- **Verifikasi Versi & Maintenance**: `npm view better-auth` versi 1.7.12 aktif dipelihara dan secara eksplisit mendukung peer dependency `next: ^14 || ^15 || ^16`, `react: ^19`, dan `prisma: ^7`.
- **Evaluasi Alternatif**: Auth.js (`next-auth@5.0.0-beta.32`) masih dalam fase beta berkepanjangan dengan friksi pada server actions & credentials handler.
- **Fitur Kunci**: Menyediakan Prisma adapter bawaan, proteksi cookie sesi (`HttpOnly`, `SameSite=Lax`, `Secure`), dan pengecekan RBAC terproteksi di sisi server.
- **Kepatuhan PRD §4.1**: Mematuhi aturan larangan membuat auth sendiri dengan memakai library matang dan teruji kompatibilitasnya.
