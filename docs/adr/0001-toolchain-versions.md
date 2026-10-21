# ADR 0001: Versi Toolchain (ESLint & TypeScript)

- **Versi Terpasang**: `eslint` 9.16.0, `typescript` 5.7.2, `typescript-eslint` 8.18.0.
- **Versi Rilis Terbaru (npm view)**: `eslint` 10.13.0, `typescript` 7.0.2.
- **Bukti Peer Dependency**: `typescript-eslint` mensyaratkan `typescript: '>=4.8.4 <6.1.0'`.
- **Alasan Penetapan Versi**: TypeScript 7.0.2 melanggar batasan peer dependency `typescript-eslint` (<6.1.0). ESLint 9.16.0 kompatibel penuh dengan konfigurasi `eslint.config.mjs` dan Next.js 16 App Router.
- **Keputusan**: Pertahankan `eslint` 9.16.0 dan `typescript` 5.7.2 untuk menjaga stabilitas CI, linting, dan typechecking.
