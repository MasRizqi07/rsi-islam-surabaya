### TABEL HASIL AUDIT LIGHTHOUSE MOBILE LAB (MEDIAN 5 RUN)
Sumber Data: 25 JSON Mentah di `docs/evidence/v3/p0b/lighthouse/`
Profil: Default Mobile (Emulasi 4x CPU Slowdown, Jaringan Standar Seluler)

| Rute Halaman | Path | Perf (ÔëÑ90) | A11y (ÔëÑ95) | Best Practices (ÔëÑ95) | LCP (Ôëñ2.5s) | TBT (Ôëñ200ms) | CLS (Ôëñ0.1) | Status Evaluasi |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Beranda** | `/` | **93** | **100** | **100** | 3.14s ÔØî | **128ms** | **0.000** | **FAIL (LCP)** |
| **IGD Darurat** | `/igd` | **93** | **100** | **100** | 3.19s ÔØî | **59ms** | **0.000** | **FAIL (LCP)** |
| **Direktori Dokter** | `/dokter` | **94** | **100** | **100** | 3.06s ÔØî | **59ms** | **0.000** | **FAIL (LCP)** |
| **Tower Directory** | `/tower` | **93** | **99** | **100** | 3.16s ÔØî | **58ms** | **0.000** | **FAIL (LCP)** |
| **Pendaftaran Online** | `/daftar` | **95** | **100** | **100** | 3.00s ÔØî | **56ms** | **0.000** | **FAIL (LCP)** |
| **Daftar Layanan** | `/layanan` | **94** | **100** | **100** | 3.01s ÔØî | **65ms** | **0.000** | **FAIL (LCP)** |
| **Autentikasi / Login** | `/login` | **95** | **98** | **100** | 2.95s ÔØî | **59ms** | **0.000** | **FAIL (LCP)** |
| **Booking Janji Temu** | `/janji-temu` | 89 ÔØî | **100** | **96** | 3.35s ÔØî | **72ms** | 0.106 ÔØî | **FAIL (Perf, LCP, CLS)** |

**Ringkasan Status Evaluasi Berdasarkan Median Absolut:**
- Total Rute Diuji: 8
- Rute Lolos Target Penuh: 0
- Rute Gagal Target Teknis: 8

**Rincian Kegagalan Target Per Rute (Tanpa Manipulasi):**
- Rute `/`: LCP 3.14s > 2.5s
- Rute `/igd`: LCP 3.19s > 2.5s
- Rute `/dokter`: LCP 3.06s > 2.5s
- Rute `/tower`: LCP 3.16s > 2.5s
- Rute `/daftar`: LCP 3.00s > 2.5s
- Rute `/layanan`: LCP 3.01s > 2.5s
- Rute `/login`: LCP 2.95s > 2.5s
- Rute `/janji-temu`: Perf 89 < 90, LCP 3.35s > 2.5s, CLS 0.106 > 0.1
