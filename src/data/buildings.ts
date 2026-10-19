import { FloorInfo } from './types';

/**
 * DIREKTORI BANGUNAN (TOWER & GRAHA)
 * Berdasarkan Lampiran B PRD v2.0 (Register Konflik K4 dihormati penuh)
 * 
 * ATURAN KERAS K4:
 * Gedung Tower lantai 1, 5, 6, 8–13 berstatus known: false ("Informasi belum tersedia").
 * Dilarang keras mengarang isi ruangan lantai tanpa data publik.
 */

export const TOWER_FLOORS: FloorInfo[] = [
  {
    buildingId: 'tower',
    floor: 13,
    label: 'Lantai 13',
    serviceSlugs: [],
    known: false,
    description: 'Informasi belum tersedia pada publikasi resmi.',
  },
  {
    buildingId: 'tower',
    floor: 12,
    label: 'Lantai 12',
    serviceSlugs: [],
    known: false,
    description: 'Informasi belum tersedia pada publikasi resmi.',
  },
  {
    buildingId: 'tower',
    floor: 11,
    label: 'Lantai 11',
    serviceSlugs: [],
    known: false,
    description: 'Informasi belum tersedia pada publikasi resmi.',
  },
  {
    buildingId: 'tower',
    floor: 10,
    label: 'Lantai 10',
    serviceSlugs: [],
    known: false,
    description: 'Informasi belum tersedia pada publikasi resmi.',
  },
  {
    buildingId: 'tower',
    floor: 9,
    label: 'Lantai 9',
    serviceSlugs: [],
    known: false,
    description: 'Informasi belum tersedia pada publikasi resmi.',
  },
  {
    buildingId: 'tower',
    floor: 8,
    label: 'Lantai 8',
    serviceSlugs: [],
    known: false,
    description: 'Informasi belum tersedia pada publikasi resmi.',
  },
  {
    buildingId: 'tower',
    floor: 7,
    label: 'Lantai 7',
    serviceSlugs: ['bersalin'],
    known: true,
    description: 'Ruang Perawatan Bersalin An-Nisa (kamar rawat gabung, tindakan kebidanan, dan ruang perawatan VIP).',
  },
  {
    buildingId: 'tower',
    floor: 6,
    label: 'Lantai 6',
    serviceSlugs: [],
    known: false,
    description: 'Informasi belum tersedia pada publikasi resmi.',
  },
  {
    buildingId: 'tower',
    floor: 5,
    label: 'Lantai 5',
    serviceSlugs: [],
    known: false,
    description: 'Informasi belum tersedia pada publikasi resmi.',
  },
  {
    buildingId: 'tower',
    floor: 4,
    label: 'Lantai 4',
    serviceSlugs: ['perawatan-intensif'],
    known: true,
    description: 'Pusat Perawatan Kritis Terpadu: ICU, ICCU (Jantung), HCU, NICU (Bayi Risiko Tinggi), dan PICU (Pediatrik). Dilengkapi monitoring hemodinamik 24 jam.',
  },
  {
    buildingId: 'tower',
    floor: 3,
    label: 'Lantai 3',
    serviceSlugs: ['penunjang-24jam'],
    known: true,
    description: 'Layanan Diagnostik Terpadu 24 Jam: Laboratorium Patologi & Mikrobiologi, Radiologi CT-Scan 128 Slice, USG 4D, Ekokardiografi, dan Medical Check Up (MCU).',
  },
  {
    buildingId: 'tower',
    floor: 2,
    label: 'Lantai 2',
    serviceSlugs: ['igd', 'kamar-operasi'],
    known: true,
    description: 'Instalasi Gawat Darurat (IGD 24 Jam), Depo Farmasi Darurat, Pendaftaran Rawat Inap Satu Pintu, Customer Care, dan Kamar Operasi Cito.',
  },
  {
    buildingId: 'tower',
    floor: 1,
    label: 'Lantai 1',
    serviceSlugs: [],
    known: false,
    description: 'Informasi belum tersedia pada publikasi resmi.',
  },
];

export const GRAHA_FLOORS: FloorInfo[] = [
  {
    buildingId: 'graha',
    floor: 5,
    label: 'Lantai 5',
    serviceSlugs: [],
    known: true,
    description: 'Kantor Manajemen & Direksi RS Islam Surabaya, Bagian Administrasi Terpadu, dan Layanan Pengurusan Akte Kelahiran Pasien.',
  },
  {
    buildingId: 'graha',
    floor: 4,
    label: 'Lantai 4',
    serviceSlugs: [],
    known: true,
    description: 'Ruang Rawat Inap Dewasa (Ruang Makkah) dan Klinik Konsultasi Kesehatan Jiwa / Psikiatri.',
  },
  {
    buildingId: 'graha',
    floor: 3,
    label: 'Lantai 3',
    serviceSlugs: [],
    known: true,
    description: 'Ruang Rawat Inap Anak (Ruang Madinah), Poliklinik Estetika Medik, dan Poliklinik Urologi & Ruang Tindakan ESWL.',
  },
  {
    buildingId: 'graha',
    floor: 2,
    label: 'Lantai 2',
    serviceSlugs: ['bersalin', 'bina-rohani'],
    known: true,
    description: 'Ruang Perawatan Bersalin (Ruang Thaif) dan Kantor Seksi Pelayanan Bina Rohani Islam Pasien.',
  },
  {
    buildingId: 'graha',
    floor: 1,
    label: 'Lantai 1',
    serviceSlugs: ['hemodialisis'],
    known: true,
    description: 'Unit Terapi Hemodialisis (Kapasitas 30 Mesin Dialisis, Dialiser Single Use) dan Klinik Vaksinasi & Imunisasi Terpadu.',
  },
  {
    buildingId: 'graha',
    floor: 0,
    label: 'Ground (Lantai Dasar)',
    serviceSlugs: ['rehabilitasi-medik'],
    known: true,
    description: 'Lobi Utama, Loket Pendaftaran Poliklinik, Resepsionis & Pusat Informasi, BPJS Centre, Kasir Pembayaran, Apotek Rawat Jalan, Poliklinik Ortopedi, Bedah, THT, Gigi Spesialis, dan Instalasi Rehabilitasi Medik.',
  },
];

export const ALL_FLOORS: FloorInfo[] = [...TOWER_FLOORS, ...GRAHA_FLOORS];
