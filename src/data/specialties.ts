import { Specialty } from './types';

export const CLINIC_GROUPS = {
  DASAR: 'dasar',
  SPESIALISTIK: 'spesialistik',
  PENUNJANG: 'penunjang',
} as const;

/**
 * 20 POLIKLINIK RAWAT JALAN TERVERIFIKASI
 * Berdasarkan Lampiran A PRD v2.0 (Sumber publik S1 rsisurabaya.com)
 */
export const SPECIALTIES: Specialty[] = [
  {
    id: 'penyakit-dalam',
    name: 'Penyakit Dalam',
    group: 'dasar',
    summary: 'Diagnosis dan penanganan komprehensif penyakit metabolik, infeksi, endokrin, dan organ dalam dewasa.',
    iconName: 'Activity',
  },
  {
    id: 'bedah-umum',
    name: 'Bedah Umum',
    group: 'dasar',
    summary: 'Tindakan operatif bedah mayor dan minor untuk penanganan kelainan abdomen, tiroid, hernia, dan trauma.',
    iconName: 'Scissors',
  },
  {
    id: 'anak',
    name: 'Kesehatan Anak',
    group: 'dasar',
    summary: 'Pelayanan kesehatan holistik bayi, balita, dan anak meliputi vaksinasi, tumbuh kembang, dan infeksi.',
    iconName: 'Baby',
  },
  {
    id: 'obgyn',
    name: 'Obstetri & Ginekologi',
    group: 'dasar',
    summary: 'Layanan kebidanan, pemeriksaan kehamilan, persalinan islami, dan penanganan gangguan kandungan.',
    iconName: 'HeartHandshake',
  },
  {
    id: 'urologi',
    name: 'Urologi & ESWL',
    group: 'spesialistik',
    summary: 'Penanganan kelainan saluran kemih, prostat, dan pemecahan batu ginjal tanpa operasi dengan teknologi ESWL.',
    iconName: 'Zap',
  },
  {
    id: 'paru',
    name: 'Paru & Pernapasan',
    group: 'spesialistik',
    summary: 'Diagnosis asma, tuberkulosis, PPOK, dan pemeriksaan fungsi respirasi paru dengan spirometri.',
    iconName: 'Wind',
  },
  {
    id: 'ortopedi',
    name: 'Ortopedi & Traumatologi',
    group: 'spesialistik',
    summary: 'Perawatan cedera tulang, rekonstruksi sendi, bedah tulang belakang, dan traumatologi dengan panduan C-Arm.',
    iconName: 'Bone',
  },
  {
    id: 'jantung',
    name: 'Jantung & Pembuluh Darah',
    group: 'spesialistik',
    summary: 'Pemeriksaan EKG, treadmill test, ekokardiografi jantung, dan tata laksana hipertensi serta penyakit jantung koroner.',
    iconName: 'HeartPulse',
  },
  {
    id: 'mata',
    name: 'Kesehatan Mata',
    group: 'spesialistik',
    summary: 'Pemeriksaan refraksi, glaukoma, retinopati, dan operasi katarak modern metode fakoemulsifikasi sayatan kecil.',
    iconName: 'Eye',
  },
  {
    id: 'kulit-kelamin',
    name: 'Kulit & Kelamin',
    group: 'spesialistik',
    summary: 'Konsultasi dermatologi alergi, infeksi kulit, penuaan dini, dan penyakit menular seksual.',
    iconName: 'Sparkles',
  },
  {
    id: 'tht',
    name: 'Telinga, Hidung, Tenggorok (THT-KL)',
    group: 'spesialistik',
    summary: 'Diagnostik endoskopi THT, penanganan sinusitis, gangguan pendengaran, dan skrining OAE bayi.',
    iconName: 'Ear',
  },
  {
    id: 'saraf',
    name: 'Saraf / Neurologi',
    group: 'spesialistik',
    summary: 'Pencegahan dan penanganan stroke, neuropati, epilepsi, nyeri kepala migrain, dan gangguan saraf.',
    iconName: 'Brain',
  },
  {
    id: 'jiwa',
    name: 'Kesehatan Jiwa / Psikiatri',
    group: 'spesialistik',
    summary: 'Konsultasi kesehatan mental, manajemen stres, gangguan kecemasan, depresi, dan psikoterapi islami.',
    iconName: 'Smile',
  },
  {
    id: 'anestesi',
    name: 'Anestesi & Manajemen Nyeri',
    group: 'penunjang',
    summary: 'Pembiusan aman pra-operasi, perawatan pasca-bedah, dan klinik manajemen nyeri kronis terpadu.',
    iconName: 'Shield',
  },
  {
    id: 'rehabilitasi-medik',
    name: 'Kedokteran Fisik & Rehabilitasi',
    group: 'penunjang',
    summary: 'Fisioterapi pasca-stroke, terapi wicara, terapi okupasi tumbuh kembang anak, dan pemulihan cedera fisik.',
    iconName: 'Footprints',
  },
  {
    id: 'bedah-saraf',
    name: 'Bedah Saraf',
    group: 'spesialistik',
    summary: 'Tindakan bedah mikro untuk tumor otak, trauma kepala, dan kelainan saraf tulang belakang.',
    iconName: 'Layers',
  },
  {
    id: 'bedah-anak',
    name: 'Bedah Anak',
    group: 'spesialistik',
    summary: 'Penanganan kelainan bawaan kongenital dan bedah darurat pada neonatus, bayi, dan anak-anak.',
    iconName: 'UserCheck',
  },
  {
    id: 'bedah-plastik',
    name: 'Bedah Plastik, Rekonstruksi & Estetika',
    group: 'spesialistik',
    summary: 'Rekonstruksi defek pasca-trauma, luka bakar, bibir sumbing, dan bedah estetika korektif.',
    iconName: 'Wand2',
  },
  {
    id: 'btkv',
    name: 'Bedah Toraks, Kardiak & Vaskular (BTKV)',
    group: 'spesialistik',
    summary: 'Operasi dinding dada, paru, pembuluh darah perifer, dan pemasangan akses cuci darah (AV Shunt).',
    iconName: 'GitBranch',
  },
  {
    id: 'estetika',
    name: 'Poliklinik Estetika Medik',
    group: 'spesialistik',
    summary: 'Perawatan kesehatan estetika kulit medis terpadu dengan standar keamanan klinis rumah sakit.',
    iconName: 'Gem',
  },
];
