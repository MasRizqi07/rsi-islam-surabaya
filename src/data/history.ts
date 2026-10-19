/**
 * KRONOLOGI SEJARAH RUMAH SAKIT ISLAM SURABAYA A. YANI (1975–2026)
 * Sumber: Lampiran C PRD v2.0 & Publikasi Resmi Yayasan Rumah Sakit Islam Surabaya (YARSIS)
 */

export interface HistoryMilestone {
  year: string;
  title: string;
  description: string;
  tag?: string;
}

export const HISTORY_TIMELINE: HistoryMilestone[] = [
  {
    year: '1975',
    title: 'Awal Pengabdian & Peresmian',
    description: '25 Maret 1975, Rumah Sakit Islam Surabaya resmi beroperasi dengan kapasitas awal 20 tempat tidur, didirikan oleh para ulama dan tokoh Yayasan Rumah Sakit Islam Surabaya (YARSIS) untuk menyediakan layanan kesehatan bernafaskan Islam.',
    tag: 'Pendirian',
  },
  {
    year: '1985',
    title: 'Pendidikan Tenaga Keperawatan',
    description: 'Pendirian Akademi Perawatan RSI Surabaya guna mencetak perawat dan tenaga medis profesional yang berakhlakul karimah dalam melayani masyarakat.',
    tag: 'Edukasi',
  },
  {
    year: '1988',
    title: 'Ekspansi Kapasitas Rawat Inap',
    description: 'Pembangunan Gedung E dan Gedung F secara berkelanjutan, memperluas daya tampung rawat inap menjadi 28 tempat tidur dan memperkuat instalasi gawat darurat.',
    tag: 'Pengembangan',
  },
  {
    year: '1997',
    title: 'Pusat Penunjang Diagnostik Terpadu',
    description: 'Pembangunan gedung pelayanan penunjang diagnostik satu atap yang mengintegrasikan laboratorium klinis modern dan instalasi radiologi.',
    tag: 'Fasilitas',
  },
  {
    year: '1998',
    title: 'Akreditasi 5 Pelayanan Dasar',
    description: 'Meraih sertifikasi akreditasi 5 pelayanan dasar rumah sakit dari Departemen Kesehatan Republik Indonesia.',
    tag: 'Akreditasi',
  },
  {
    year: '2012',
    title: 'Kelulusan Standar KARS 2012',
    description: 'Meraih kelulusan Akreditasi Rumah Sakit versi KARS 2012, menegaskan kepatuhan pada standar keselamatan pasien.',
    tag: 'Mutu',
  },
  {
    year: '2014',
    title: 'Penetapan Kelas C & Gedung Operasi',
    description: 'Penetapan status resmi sebagai Rumah Sakit Kelas C dan peresmian instalasi bedah sentral dua lantai bertekanan positif.',
    tag: 'Operasional',
  },
  {
    year: '2015',
    title: 'Pelayanan Hemodialisis Modern',
    description: 'Pembukaan unit terapi hemodialisis (cuci darah) dengan peralatan modern untuk pasien gagal ginjal kronik.',
    tag: 'Layanan Baru',
  },
  {
    year: '2016',
    title: 'Akreditasi Tingkat Paripurna Pertama',
    description: 'Meraih predikat tertinggi Akreditasi Tingkat Paripurna (Bintang Lima) dari Komisi Akreditasi Rumah Sakit (KARS).',
    tag: 'Prestasi',
  },
  {
    year: '2018',
    title: 'Peresmian Gedung Graha 5 Lantai',
    description: 'Soft opening pada 25 Maret 2018 dan peresmian Grand Opening Gedung Graha pada 12 Juli 2018 oleh Wakil Presiden Republik Indonesia Drs. H. M. Jusuf Kalla.',
    tag: 'Infrastruktur',
  },
  {
    year: '2019',
    title: 'Mempertahankan Akreditasi Paripurna',
    description: 'Mempertahankan kelulusan Akreditasi Tingkat Paripurna KARS sebagai wujud komitmen berkelanjutan terhadap standar pelayanan prima.',
    tag: 'Mutu',
  },
  {
    year: '2020',
    title: 'Garda Terdepan Pandemi COVID-19',
    description: 'Penyediaan 80 tempat tidur ruang isolasi khusus bertekanan negatif dan pelayanan skrining terpadu demi perlindungan warga Surabaya.',
    tag: 'Pengabdian',
  },
  {
    year: '2022',
    title: 'Paripurna LAM-KPRS',
    description: 'Meraih Akreditasi Tingkat Paripurna dari Lembaga Akreditasi Mutu dan Keselamatan Pasien Rumah Sakit (LAM-KPRS).',
    tag: 'Akreditasi',
  },
  {
    year: '2023',
    title: 'Peresmian Tower 13 Lantai oleh Presiden RI',
    description: 'Gedung Tower 13 Lantai diresmikan langsung oleh Presiden Republik Indonesia Ir. H. Joko Widodo sebagai simbol modernisasi layanan medis dan persiapan rumah sakit pendidikan terkemuka.',
    tag: 'Era Baru',
  },
  {
    year: '2026',
    title: '51 Tahun Mengabdi & Transformasi Digital',
    description: 'Menyongsong 51 tahun perjalanan dengan operasional Rumah Sakit Kelas B, kapasitas 238 tempat tidur, 100+ tenaga medis terpercaya, dan transformasi digital berkelanjutan.',
    tag: 'Kini & Masa Depan',
  },
];
