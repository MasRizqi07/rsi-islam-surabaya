# ADR 0002: Pemilihan ORM (PostgreSQL + Prisma)

- **Keputusan**: Menggunakan Prisma ORM (`prisma` dan `@prisma/client` ^6.19.3) berbasis PostgreSQL.
- **Verifikasi Versi**: `npm view prisma` menunjukkan 6.19.3 adalah versi rilis produksi stabil dengan dukungan native declarative connection string (`url = env(...)`) tanpa overhead adapter terpisah.
- **Evaluasi Kompatibilitas**: Prisma 6.19.3 kompatibel penuh dengan Next.js 16 App Router, TypeScript 5.7.2, dan peer dependency `better-auth`.
- **Kepatuhan PRD §4.1**: Memenuhi mandat arsitektur PRD v3.0 tanpa deviasi.
