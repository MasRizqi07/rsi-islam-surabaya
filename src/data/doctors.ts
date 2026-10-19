import { Doctor } from './types';

/**
 * FIXTURE DOKTER SPESIALIS (SIMULASI / ILUSTRASI)
 * Berdasarkan Lampiran D PRD v2.0
 * 
 * ATURAN KERAS:
 * 1. Minimal 24 dokter fiktif (mencakup >= 14 spesialisasi).
 * 2. Seluruh objek dokter wajib memiliki isFictional: true.
 * 3. Nama generik dan realistis Indonesia, tidak meniru dokter nyata RSIS / tokoh publik.
 * 4. Jam praktik realistis (Reguler 08:00-14:00, Eksekutif 16:00-20:00).
 * 5. Poliklinik Eksekutif hanya melayani Umum & Asuransi (tidak menerima BPJS Kesehatan).
 */

export const DOCTORS: Doctor[] = [
  // 1. PENYAKIT DALAM
  {
    slug: 'dr-fauzi-rachman-sppd',
    name: 'dr. Fauzi Rachman',
    title: 'dr. Fauzi Rachman, Sp.PD',
    specialtyId: 'penyakit-dalam',
    subSpecialty: 'Gastroenterologi & Hepatologi',
    penjamin: ['bpjs', 'umum', 'asuransi'],
    poli: ['reguler', 'eksekutif'],
    schedule: [
      { hari: 'senin', mulai: '08:00', selesai: '12:00', poli: 'reguler' },
      { hari: 'rabu', mulai: '08:00', selesai: '12:00', poli: 'reguler' },
      { hari: 'jumat', mulai: '08:00', selesai: '11:30', poli: 'reguler' },
      { hari: 'selasa', mulai: '16:00', selesai: '19:00', poli: 'eksekutif' },
    ],
    bio: 'Fokus pada tata laksana gangguan lambung, saluran cerna, hati, serta penanganan penyakit metabolik kronis.',
    isFictional: true,
  },
  {
    slug: 'dr-anisa-kusuma-sppd',
    name: 'dr. Anisa Kusuma Wardhani',
    title: 'dr. Anisa Kusuma Wardhani, Sp.PD',
    specialtyId: 'penyakit-dalam',
    subSpecialty: 'Endokrinologi, Diabetes & Metabolik',
    penjamin: ['bpjs', 'umum', 'asuransi'],
    poli: ['reguler'],
    schedule: [
      { hari: 'selasa', mulai: '08:30', selesai: '12:30', poli: 'reguler' },
      { hari: 'kamis', mulai: '08:30', selesai: '12:30', poli: 'reguler' },
      { hari: 'sabtu', mulai: '08:30', selesai: '12:00', poli: 'reguler' },
    ],
    bio: 'Menangani pengelolaan terpadu diabetes melitus, gangguan tiroid, dan sindrom metabolik.',
    isFictional: true,
  },
  {
    slug: 'dr-bambang-suharto-sppd',
    name: 'dr. Bambang Suharto',
    title: 'dr. Bambang Suharto, Sp.PD, K-GH',
    specialtyId: 'penyakit-dalam',
    subSpecialty: 'Ginjal & Hipertensi',
    penjamin: ['umum', 'asuransi'],
    poli: ['eksekutif'],
    schedule: [
      { hari: 'senin', mulai: '17:00', selesai: '20:00', poli: 'eksekutif' },
      { hari: 'kamis', mulai: '17:00', selesai: '20:00', poli: 'eksekutif' },
    ],
    bio: 'Konsultan nefrologi dengan keahlian terapi gagal ginjal, hipertensi resisten, dan hemodialisis.',
    isFictional: true,
  },

  // 2. KESEHATAN ANAK
  {
    slug: 'dr-nurul-hidayati-spa',
    name: 'dr. Nurul Hidayati',
    title: 'dr. Nurul Hidayati, Sp.A',
    specialtyId: 'anak',
    subSpecialty: 'Tumbuh Kembang & Pediatrik Sosial',
    penjamin: ['bpjs', 'umum', 'asuransi'],
    poli: ['reguler', 'eksekutif'],
    schedule: [
      { hari: 'senin', mulai: '08:00', selesai: '12:00', poli: 'reguler' },
      { hari: 'selasa', mulai: '08:00', selesai: '12:00', poli: 'reguler' },
      { hari: 'kamis', mulai: '08:00', selesai: '12:00', poli: 'reguler' },
      { hari: 'rabu', mulai: '16:00', selesai: '19:00', poli: 'eksekutif' },
    ],
    bio: 'Mendampingi pemantauan nutrisi, vaksinasi anak, serta stimulasi tumbuh kembang anak secara menyeluruh.',
    isFictional: true,
  },
  {
    slug: 'dr-danang-prasetyo-spa',
    name: 'dr. Danang Prasetyo',
    title: 'dr. Danang Prasetyo, Sp.A',
    specialtyId: 'anak',
    subSpecialty: 'Neonatologi & Resusitasi Bayi',
    penjamin: ['bpjs', 'umum'],
    poli: ['reguler'],
    schedule: [
      { hari: 'rabu', mulai: '09:00', selesai: '13:00', poli: 'reguler' },
      { hari: 'jumat', mulai: '09:00', selesai: '11:30', poli: 'reguler' },
      { hari: 'sabtu', mulai: '09:00', selesai: '12:30', poli: 'reguler' },
    ],
    bio: 'Ahli penanganan bayi baru lahir berisiko tinggi dan tata laksana infeksi akut pada anak.',
    isFictional: true,
  },

  // 3. BEDAH UMUM
  {
    slug: 'dr-rizky-firmansyah-spb',
    name: 'dr. Rizky Firmansyah',
    title: 'dr. Rizky Firmansyah, Sp.B',
    specialtyId: 'bedah-umum',
    subSpecialty: 'Bedah Digestif & Laparoskopi',
    penjamin: ['bpjs', 'umum', 'asuransi'],
    poli: ['reguler', 'eksekutif'],
    schedule: [
      { hari: 'senin', mulai: '09:00', selesai: '13:00', poli: 'reguler' },
      { hari: 'kamis', mulai: '09:00', selesai: '13:00', poli: 'reguler' },
      { hari: 'jumat', mulai: '16:00', selesai: '19:00', poli: 'eksekutif' },
    ],
    bio: 'Berpengalaman dalam tindakan bedah minimal invasif laparoskopi untuk usus buntu dan batu empedu.',
    isFictional: true,
  },
  {
    slug: 'dr-hendra-wijaya-spb',
    name: 'dr. Hendra Wijaya',
    title: 'dr. Hendra Wijaya, Sp.B',
    specialtyId: 'bedah-umum',
    penjamin: ['bpjs', 'umum'],
    poli: ['reguler'],
    schedule: [
      { hari: 'selasa', mulai: '08:00', selesai: '12:00', poli: 'reguler' },
      { hari: 'rabu', mulai: '08:00', selesai: '12:00', poli: 'reguler' },
      { hari: 'sabtu', mulai: '08:00', selesai: '12:00', poli: 'reguler' },
    ],
    bio: 'Menangani bedah trauma, kelainan tiroid, hernia dinding perut, serta bedah minor rawat jalan.',
    isFictional: true,
  },

  // 4. OBSTETRI & GINEKOLOGI
  {
    slug: 'dr-siti-rahmawati-spog',
    name: 'dr. Siti Rahmawati',
    title: 'dr. Siti Rahmawati, Sp.OG',
    specialtyId: 'obgyn',
    subSpecialty: 'Fetomaternal & Kehamilan Risiko Tinggi',
    penjamin: ['bpjs', 'umum', 'asuransi'],
    poli: ['reguler', 'eksekutif'],
    schedule: [
      { hari: 'senin', mulai: '08:30', selesai: '12:30', poli: 'reguler' },
      { hari: 'rabu', mulai: '08:30', selesai: '12:30', poli: 'reguler' },
      { hari: 'jumat', mulai: '08:30', selesai: '11:30', poli: 'reguler' },
      { hari: 'kamis', mulai: '16:30', selesai: '19:30', poli: 'eksekutif' },
    ],
    bio: 'Melayani pemeriksaan USG 4D fetomaternal, deteksi dini kelainan janin, dan persalinan aman islami.',
    isFictional: true,
  },
  {
    slug: 'dr-tri-wahyudi-spog',
    name: 'dr. Tri Wahyudi',
    title: 'dr. Tri Wahyudi, Sp.OG',
    specialtyId: 'obgyn',
    subSpecialty: 'Onkologi Ginekologi & Rekonstruksi',
    penjamin: ['bpjs', 'umum'],
    poli: ['reguler'],
    schedule: [
      { hari: 'selasa', mulai: '09:00', selesai: '13:00', poli: 'reguler' },
      { hari: 'kamis', mulai: '09:00', selesai: '13:00', poli: 'reguler' },
      { hari: 'sabtu', mulai: '09:00', selesai: '12:30', poli: 'reguler' },
    ],
    bio: 'Fokus pada skrining kanker leher rahim (pap smear), penanganan kista ovarium, dan mioma rahim.',
    isFictional: true,
  },

  // 5. JANTUNG & PEMBULUH DARAH
  {
    slug: 'dr-aditya-wibowo-spjp',
    name: 'dr. Aditya Wibowo',
    title: 'dr. Aditya Wibowo, Sp.JP, FIHA',
    specialtyId: 'jantung',
    subSpecialty: 'Kardiologi Intervensi',
    penjamin: ['bpjs', 'umum', 'asuransi'],
    poli: ['reguler', 'eksekutif'],
    schedule: [
      { hari: 'senin', mulai: '08:00', selesai: '12:00', poli: 'reguler' },
      { hari: 'rabu', mulai: '08:00', selesai: '12:00', poli: 'reguler' },
      { hari: 'senin', mulai: '16:00', selesai: '19:00', poli: 'eksekutif' },
    ],
    bio: 'Penanganan komprehensif sindrom koroner akut, kateterisasi jantung, dan tata laksana gagal jantung.',
    isFictional: true,
  },
  {
    slug: 'dr-maya-safitri-spjp',
    name: 'dr. Maya Safitri',
    title: 'dr. Maya Safitri, Sp.JP, FIHA',
    specialtyId: 'jantung',
    subSpecialty: 'Ekokardiografi & Rehabilitasi Jantung',
    penjamin: ['bpjs', 'umum'],
    poli: ['reguler'],
    schedule: [
      { hari: 'selasa', mulai: '08:30', selesai: '12:30', poli: 'reguler' },
      { hari: 'kamis', mulai: '08:30', selesai: '12:30', poli: 'reguler' },
      { hari: 'jumat', mulai: '08:30', selesai: '11:30', poli: 'reguler' },
    ],
    bio: 'Keahlian diagnostik non-invasif ekokardiografi, treadmill stress test, dan pencegahan kardiovaskular.',
    isFictional: true,
  },

  // 6. ORTOPEDI & TRAUMATOLOGI
  {
    slug: 'dr-dimas-pratama-spot',
    name: 'dr. Dimas Pratama',
    title: 'dr. Dimas Pratama, Sp.OT',
    specialtyId: 'ortopedi',
    subSpecialty: 'Traumatologi & Rekonstruksi Sendi',
    penjamin: ['bpjs', 'umum', 'asuransi'],
    poli: ['reguler', 'eksekutif'],
    schedule: [
      { hari: 'senin', mulai: '08:00', selesai: '12:00', poli: 'reguler' },
      { hari: 'kamis', mulai: '08:00', selesai: '12:00', poli: 'reguler' },
      { hari: 'rabu', mulai: '16:00', selesai: '19:00', poli: 'eksekutif' },
    ],
    bio: 'Menangani rekonstruksi cedera ligamen lutut, fraktur tulang kompleks, dan penggantian sendi panggul/lutut.',
    isFictional: true,
  },
  {
    slug: 'dr-arif-budiman-spot',
    name: 'dr. Arif Budiman',
    title: 'dr. Arif Budiman, Sp.OT',
    specialtyId: 'ortopedi',
    subSpecialty: 'Tulang Belakang (Spine)',
    penjamin: ['bpjs', 'umum'],
    poli: ['reguler'],
    schedule: [
      { hari: 'selasa', mulai: '09:00', selesai: '13:00', poli: 'reguler' },
      { hari: 'jumat', mulai: '09:00', selesai: '11:30', poli: 'reguler' },
      { hari: 'sabtu', mulai: '09:00', selesai: '12:30', poli: 'reguler' },
    ],
    bio: 'Penanganan kelainan skoliosis, saraf terjepit (HNP), dan dekompresi tulang belakang minimal invasif.',
    isFictional: true,
  },

  // 7. PARU & PERNAPASAN
  {
    slug: 'dr-wahyu-hidayat-spp',
    name: 'dr. Wahyu Hidayat',
    title: 'dr. Wahyu Hidayat, Sp.P, FAPSR',
    specialtyId: 'paru',
    penjamin: ['bpjs', 'umum', 'asuransi'],
    poli: ['reguler', 'eksekutif'],
    schedule: [
      { hari: 'senin', mulai: '08:30', selesai: '12:30', poli: 'reguler' },
      { hari: 'selasa', mulai: '08:30', selesai: '12:30', poli: 'reguler' },
      { hari: 'kamis', mulai: '16:00', selesai: '19:00', poli: 'eksekutif' },
    ],
    bio: 'Tata laksana asma kronik, bronkoskopi diagnostik, tuberkulosis resistan obat, dan pemulihan infeksi paru.',
    isFictional: true,
  },

  // 8. KESEHATAN MATA
  {
    slug: 'dr-retno-wulandari-spm',
    name: 'dr. Retno Wulandari',
    title: 'dr. Retno Wulandari, Sp.M',
    specialtyId: 'mata',
    subSpecialty: 'Katarak & Bedah Refraktif',
    penjamin: ['bpjs', 'umum', 'asuransi'],
    poli: ['reguler', 'eksekutif'],
    schedule: [
      { hari: 'selasa', mulai: '08:00', selesai: '12:00', poli: 'reguler' },
      { hari: 'rabu', mulai: '08:00', selesai: '12:00', poli: 'reguler' },
      { hari: 'jumat', mulai: '08:00', selesai: '11:30', poli: 'reguler' },
      { hari: 'senin', mulai: '16:30', selesai: '19:30', poli: 'eksekutif' },
    ],
    bio: 'Spesialis operasi katarak fakoemulsifikasi tanpa rawat inap dan penanganan glaukoma serta retinopati.',
    isFictional: true,
  },

  // 9. SARAF / NEUROLOGI
  {
    slug: 'dr-lukman-hakim-sps',
    name: 'dr. Lukman Hakim',
    title: 'dr. Lukman Hakim, Sp.S',
    specialtyId: 'saraf',
    penjamin: ['bpjs', 'umum', 'asuransi'],
    poli: ['reguler', 'eksekutif'],
    schedule: [
      { hari: 'senin', mulai: '09:00', selesai: '13:00', poli: 'reguler' },
      { hari: 'kamis', mulai: '09:00', selesai: '13:00', poli: 'reguler' },
      { hari: 'selasa', mulai: '16:00', selesai: '19:00', poli: 'eksekutif' },
    ],
    bio: 'Tata laksana terpadu stroke iskemik dan perdarahan, nyeri neuropatik, epilepsi, serta penyakit vertigo.',
    isFictional: true,
  },

  // 10. TELINGA, HIDUNG, TENGGOROK (THT-KL)
  {
    slug: 'dr-farhan-maulana-sptht',
    name: 'dr. Farhan Maulana',
    title: 'dr. Farhan Maulana, Sp.THT-BKL',
    specialtyId: 'tht',
    penjamin: ['bpjs', 'umum', 'asuransi'],
    poli: ['reguler'],
    schedule: [
      { hari: 'selasa', mulai: '08:00', selesai: '12:00', poli: 'reguler' },
      { hari: 'kamis', mulai: '08:00', selesai: '12:00', poli: 'reguler' },
      { hari: 'sabtu', mulai: '08:00', selesai: '12:00', poli: 'reguler' },
    ],
    bio: 'Menangani bedah endoskopi sinus fungsional (FESS), amandel, dan deteksi dini ketulian pada bayi (OAE).',
    isFictional: true,
  },

  // 11. KULIT & KELAMIN
  {
    slug: 'dr-dian-anggraini-spkk',
    name: 'dr. Dian Anggraini',
    title: 'dr. Dian Anggraini, Sp.D.V.E',
    specialtyId: 'kulit-kelamin',
    penjamin: ['umum', 'asuransi'],
    poli: ['eksekutif'],
    schedule: [
      { hari: 'senin', mulai: '16:00', selesai: '19:30', poli: 'eksekutif' },
      { hari: 'rabu', mulai: '16:00', selesai: '19:30', poli: 'eksekutif' },
      { hari: 'jumat', mulai: '16:00', selesai: '19:30', poli: 'eksekutif' },
    ],
    bio: 'Keahlian penanganan dermatitis atopik, jerawat inflamasi, kelainan pigmen, dan terapi laser estetika.',
    isFictional: true,
  },

  // 12. UROLOGI & ESWL
  {
    slug: 'dr-bagus-setiawan-spu',
    name: 'dr. Bagus Setiawan',
    title: 'dr. Bagus Setiawan, Sp.U',
    specialtyId: 'urologi',
    penjamin: ['bpjs', 'umum', 'asuransi'],
    poli: ['reguler', 'eksekutif'],
    schedule: [
      { hari: 'senin', mulai: '08:30', selesai: '12:30', poli: 'reguler' },
      { hari: 'rabu', mulai: '08:30', selesai: '12:30', poli: 'reguler' },
      { hari: 'kamis', mulai: '16:00', selesai: '19:00', poli: 'eksekutif' },
    ],
    bio: 'Penanganan batu saluran kemih tanpa operasi (ESWL), endourologi laser, dan pembesaran prostat jinak.',
    isFictional: true,
  },

  // 13. KESEHATAN JIWA / PSIKIATRI
  {
    slug: 'dr-tanti-lestari-spkj',
    name: 'dr. Tanti Lestari',
    title: 'dr. Tanti Lestari, Sp.KJ',
    specialtyId: 'jiwa',
    penjamin: ['bpjs', 'umum'],
    poli: ['reguler'],
    schedule: [
      { hari: 'selasa', mulai: '09:00', selesai: '13:00', poli: 'reguler' },
      { hari: 'kamis', mulai: '09:00', selesai: '13:00', poli: 'reguler' },
    ],
    bio: 'Konseling psikoterapi kognitif, tata laksana gangguan panik, insomnia, dan pendampingan spiritual jiwa.',
    isFictional: true,
  },

  // 14. KEDOKTERAN FISIK & REHABILITASI
  {
    slug: 'dr-eka-putra-spkfr',
    name: 'dr. Eka Putra Perkasa',
    title: 'dr. Eka Putra Perkasa, Sp.KFR',
    specialtyId: 'rehabilitasi-medik',
    penjamin: ['bpjs', 'umum'],
    poli: ['reguler'],
    schedule: [
      { hari: 'senin', mulai: '08:00', selesai: '12:00', poli: 'reguler' },
      { hari: 'rabu', mulai: '08:00', selesai: '12:00', poli: 'reguler' },
      { hari: 'jumat', mulai: '08:00', selesai: '11:30', poli: 'reguler' },
    ],
    bio: 'Perencanaan program fisioterapi komprehensif pasca-stroke, cedera olahraga, dan rehabilitasi nyeri punggung.',
    isFictional: true,
  },

  // 15. BEDAH SARAF
  {
    slug: 'dr-haris-pranoto-spbs',
    name: 'dr. Haris Pranoto',
    title: 'dr. Haris Pranoto, Sp.BS',
    specialtyId: 'bedah-saraf',
    penjamin: ['bpjs', 'umum', 'asuransi'],
    poli: ['reguler', 'eksekutif'],
    schedule: [
      { hari: 'selasa', mulai: '10:00', selesai: '14:00', poli: 'reguler' },
      { hari: 'jumat', mulai: '16:00', selesai: '19:00', poli: 'eksekutif' },
    ],
    bio: 'Tindakan bedah mikro tumor otak, evakuasi hematoma trauma kepala, dan rekonstruksi tulang belakang.',
    isFictional: true,
  },

  // 16. BEDAH TORAKS, KARDIAK & VASKULAR (BTKV)
  {
    slug: 'dr-yusuf-bahtiar-spbtkv',
    name: 'dr. Yusuf Bahtiar',
    title: 'dr. Yusuf Bahtiar, Sp.BTKV',
    specialtyId: 'btkv',
    penjamin: ['bpjs', 'umum', 'asuransi'],
    poli: ['reguler', 'eksekutif'],
    schedule: [
      { hari: 'rabu', mulai: '09:00', selesai: '13:00', poli: 'reguler' },
      { hari: 'kamis', mulai: '16:00', selesai: '19:00', poli: 'eksekutif' },
    ],
    bio: 'Keahlian operasi toraks, trauma dada, bedah vaskular perifer, dan pembuatan akses hemodialisis (AV Shunt).',
    isFictional: true,
  },

  // 17. ANESTESI & MANAJEMEN NYERI
  {
    slug: 'dr-zainal-abidin-span',
    name: 'dr. Zainal Abidin',
    title: 'dr. Zainal Abidin, Sp.An-TI, FIP',
    specialtyId: 'anestesi',
    subSpecialty: 'Manajemen Nyeri Intervensi',
    penjamin: ['bpjs', 'umum', 'asuransi'],
    poli: ['reguler'],
    schedule: [
      { hari: 'senin', mulai: '08:00', selesai: '12:00', poli: 'reguler' },
      { hari: 'kamis', mulai: '08:00', selesai: '12:00', poli: 'reguler' },
    ],
    bio: 'Manajemen pembiusan operasi kritis, terapi nyeri kanker, dan intervensi blok saraf untuk nyeri kronis.',
    isFictional: true,
  },
];
