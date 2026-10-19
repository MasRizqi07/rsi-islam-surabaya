export type Penjamin = 'bpjs' | 'umum' | 'asuransi';
export type PoliCategory = 'reguler' | 'eksekutif';
export type Hari = 'senin' | 'selasa' | 'rabu' | 'kamis' | 'jumat' | 'sabtu' | 'minggu';
export type BuildingId = 'tower' | 'graha';
export type BedStatusLevel = 'tersedia' | 'terbatas' | 'penuh';

export interface DoctorSchedule {
  hari: Hari;
  mulai: string;   // Format 24 jam "HH:mm" misal "08:00"
  selesai: string; // Format 24 jam "HH:mm" misal "12:00"
  poli: PoliCategory;
}

export interface Doctor {
  slug: string;
  name: string;
  title: string;           // Gelar klinis lengkap misal "dr. Ahmad Fauzi, Sp.PD"
  specialtyId: string;     // Relasi foreign key ke Specialty.id
  subSpecialty?: string;
  penjamin: Penjamin[];
  poli: PoliCategory[];
  schedule: DoctorSchedule[];
  bio: string;
  isFictional: true;       // Wajib true untuk seluruh data fixture (PRD §9)
}

export interface Specialty {
  id: string;              // Kunci slug unik misal "penyakit-dalam", "jantung"
  name: string;
  group: 'dasar' | 'spesialistik' | 'penunjang';
  summary: string;
  iconName: string;
}

export interface Service {
  slug: string;
  name: string;
  summary: string;
  description: string;
  buildingId: BuildingId;
  floor: number;
  open24h: boolean;
  highlight: boolean;      // Masuk 8 layanan unggulan terverifikasi
  sourceNote: string;      // Asal verifikasi sumber publik (misal "S1 Pelayanan & Penunjang")
}

export interface FloorInfo {
  buildingId: BuildingId;
  floor: number;
  label: string;
  serviceSlugs: string[];
  known: boolean;          // false jika informasi lantai tidak tersedia di publik (K4)
  description?: string;
}

export interface BedStatusItem {
  unit: 'ICU' | 'ICCU' | 'HCU' | 'NICU' | 'PICU' | 'Rawat Inap Reguler';
  status: BedStatusLevel;
  note?: string;           // Keterangan simulasi tanpa angka klaim presisi (PRD §9)
}
