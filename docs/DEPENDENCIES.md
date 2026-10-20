# Dependency Register

Dokumen ini mencatat inventaris dependency aktif proyek sesuai aturan Laziness Ladder (§0.1 Antigravity v3 Master Prompt).

## Aturan
Setiap dependency baru wajib dicatat satu baris:
`[Nama Paket] | [Anak Tangga Gagal] | [File Pengimpor] | [Justifikasi]`

---

## 1. Runtime Dependencies (`dependencies`)

| Paket | Versi | Rung Gagal | File Pengimpor | Justifikasi |
|---|---|---|---|---|
| `next` | `^16.4.2` | Rung 1-2 | `package.json`, Next.js app | Framework dasar App Router SSG dan optimasi aset |
| `react` | `^19.3.1` | Rung 1-3 | Seluruh komponen `src/` | Pustaka rendering komponen antarmuka web |
| `react-dom` | `^19.3.1` | Rung 1-3 | `src/app/layout.tsx` | Adapter DOM untuk React 19 |
| `lucide-react` | `^1.59.0` | Rung 2 | Berbagai komponen `src/components/`, `src/app/` | Pustaka ikon SVG teroptimasi |
| `zod` | `^4.6.7` | Rung 1-3 | `src/data/schema.ts` | Validasi skema runtime data medis dan form |
| `zustand` | `^5.0.15` | Rung 2 | `src/stores/registration-store.ts` | State store in-memory untuk wizard form demo |

---

## 2. Dependency Dihapus (P0.2 — Cacat D1)

| Paket | Versi Lama | Alasan Penghapusan | Bukti Verifikasi |
|---|---|---|---|
| `motion` | `^14.4.0` | 0 import di `src/` (animasi murni CSS Tailwind v4) | `docs/evidence/v3/p0/d1-grep-after.log` & `d1-npm-ls-after.log` |
| `clsx` | `^2.1.1` | 0 import di `src/` | `docs/evidence/v3/p0/d1-grep-after.log` & `d1-npm-ls-after.log` |
| `tailwind-merge` | `^3.7.0` | 0 import di `src/` | `docs/evidence/v3/p0/d1-grep-after.log` & `d1-npm-ls-after.log` |
