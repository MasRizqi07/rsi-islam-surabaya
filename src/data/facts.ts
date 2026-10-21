/**
 * PUSAT FAKTA TUNGGAL (SINGLE SOURCE OF TRUTH)
 * RS Islam Surabaya A. Yani · Konsep "Hijau Tower"
 * 
 * ATURAN KERAS:
 * 1. Seluruh komponen UI dilarang menulis angka/fakta RS secara hardcode.
 * 2. Wajib patuhi Register Konflik K1–K7 dari PRD v2.0.
 * 3. Pelanggaran akan digagalkan oleh skrip `npm run check:facts`.
 */

export const HOSPITAL_FACTS = {
  name: 'RS Islam Surabaya A. Yani',
  shortName: 'RSI A. Yani',
  foundation: 'Yayasan Rumah Sakit Islam Surabaya (YARSIS)',
  foundedYear: 1975,
  foundationDate: '25 Maret 1975',
  hospitalClass: 'Kelas B', // K6: Klaim operasional terbaru S1
  bedCapacity: 238,
  
  // K2: Tenaga medis ditampilkan sebagai copy "100+ tenaga medis"
  medicalStaffLabel: '100+ tenaga medis',
  medicalStaffAuditNote: 'Audit internal: teks 107 vs rincian 112 (22+54+26+3+7)',

  // K3: Fakta historis akreditasi, tanpa klaim kedaluwarsa
  accreditationHistory: 'Akreditasi Paripurna 2016 · 2019 · 2022',
  accreditationBody: 'LAM-KPRS & KARS',

  // K1: Dua nomor darurat dengan label netral
  emergency: {
    title: 'Instalasi Gawat Darurat (IGD 24 Jam)',
    callCenterLabel: 'Emergency Call',
    callCenterNumber: '1500718',
    callCenterTel: 'tel:1500718',
    ambulanceLabel: 'Ambulans',
    ambulanceNumber: '08 112 33 999',
    ambulanceTel: 'tel:0811233999',
    note: 'Hipotesis dua nomor terpisah: verifikasi ke RS sebelum operasional nyata',
  },

  // Kontak & Alamat
  contact: {
    centralPhone: '(031) 8284505',
    centralPhoneTel: 'tel:0318284505',
    address: 'Jl. Achmad Yani No. 2-4, Wonokromo, Surabaya 60243',
    coordinates: {
      lat: -7.3061594,
      lng: 112.7347193,
    },
    googleMapsUrl: 'https://maps.app.goo.gl/u2JxcgMixBtpgmUj9',
  },

  // K7: Instagram resmi hanya @rsisurabaya, tidak pernah @rsiayani
  social: {
    instagram: {
      handle: '@rsisurabaya',
      url: 'https://instagram.com/rsisurabaya',
      followers: '14,1 rb pengikut',
    },
  },

  // K5: Rating Google dengan atribusi eksplisit
  ratings: {
    score: 4.7,
    maxScore: 5.0,
    reviewCount: 7034,
    sourceLabel: 'Google, cuplikan Okt 2026',
    asOf: '2026-10',
  },

  // Bangunan & Arsitektur
  buildings: {
    tower: {
      name: 'Gedung Tower',
      floors: 13,
      inaugurationYear: 2023,
      inauguratedBy: 'Presiden RI Ir. H. Joko Widodo',
    },
    graha: {
      name: 'Gedung Graha',
      floors: 6, // Ground + 5
      softOpening: '25 Maret 2018',
      grandOpening: '12 Juli 2018',
      inauguratedBy: 'Wakil Presiden RI Drs. H. M. Jusuf Kalla',
    },
  },

  // Peralatan & Penunjang Diagnostik Utama
  equipment: {
    ctScan: 'CT-Scan 128 Slice',
    hemodialysis: '30 Mesin Hemodialisis',
  },

  // Tagline & Nilai
  tagline: 'Modern dan Terpercaya',
  motto: 'Kesembuhan datang dari Allah, keselamatan dan kepuasan pasien tanggung jawab kami.',
  salutation: 'Assalamu’alaikum Warahmatullahi Wabarakatuh',

  // Penafian Portofolio
  disclaimer: {
    short: 'Konsep Desain Independen · Bukan Website Resmi RS Islam Surabaya',
    full: 'Studi kasus portofolio desain dan engineering independen oleh Antigravity & Pacoel. Tidak berafiliasi dengan RS Islam Surabaya / YARSIS.',
  },
} as const;

export type HospitalFacts = typeof HOSPITAL_FACTS;
