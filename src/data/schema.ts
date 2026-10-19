import { z } from 'zod';

export const PenjaminSchema = z.enum(['bpjs', 'umum', 'asuransi']);
export const PoliCategorySchema = z.enum(['reguler', 'eksekutif']);
export const HariSchema = z.enum(['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu']);
export const BuildingIdSchema = z.enum(['tower', 'graha']);
export const BedStatusLevelSchema = z.enum(['tersedia', 'terbatas', 'penuh']);

export const DoctorScheduleSchema = z.object({
  hari: HariSchema,
  mulai: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Format waktu mulai wajib HH:mm'),
  selesai: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Format waktu selesai wajib HH:mm'),
  poli: PoliCategorySchema,
});

export const DoctorSchema = z.object({
  slug: z.string().min(3),
  name: z.string().min(3),
  title: z.string().min(3),
  specialtyId: z.string().min(2),
  subSpecialty: z.string().optional(),
  penjamin: z.array(PenjaminSchema).min(1),
  poli: z.array(PoliCategorySchema).min(1),
  schedule: z.array(DoctorScheduleSchema).min(1),
  bio: z.string().min(10),
  isFictional: z.literal(true), // Wajib true literal (PRD §9)
});

export const SpecialtySchema = z.object({
  id: z.string().min(2),
  name: z.string().min(2),
  group: z.enum(['dasar', 'spesialistik', 'penunjang']),
  summary: z.string().min(10),
  iconName: z.string().min(2),
});

export const ServiceSchema = z.object({
  slug: z.string().min(2),
  name: z.string().min(3),
  summary: z.string().min(10),
  description: z.string().min(20),
  buildingId: BuildingIdSchema,
  floor: z.number().int().min(0).max(13),
  open24h: z.boolean(),
  highlight: z.boolean(),
  sourceNote: z.string().min(5),
});

export const FloorInfoSchema = z.object({
  buildingId: BuildingIdSchema,
  floor: z.number().int().min(0).max(13),
  label: z.string().min(2),
  serviceSlugs: z.array(z.string()),
  known: z.boolean(),
  description: z.string().optional(),
});

export const BedStatusItemSchema = z.object({
  unit: z.enum(['ICU', 'ICCU', 'HCU', 'NICU', 'PICU', 'Rawat Inap Reguler']),
  status: BedStatusLevelSchema,
  note: z.string().optional(),
});

// Skema untuk input form pendaftaran demo (/daftar)
export const DemoRegistrationSchema = z.object({
  penjamin: PenjaminSchema,
  specialtyId: z.string().min(1, 'Poliklinik tujuan wajib dipilih'),
  doctorSlug: z.string().min(1, 'Dokter spesialis wajib dipilih'),
  tanggalPeriksa: z.string().min(1, 'Tanggal periksa wajib dipilih'),
  namaPasien: z.string().min(3, 'Nama pasien minimal 3 karakter'),
  nomorHp: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{6,10}$/, 'Format nomor HP Indonesia tidak valid (contoh: 081234567890)'),
  nomorIdentitasContoh: z.string().regex(/^\d{16}$/, 'Nomor identitas simulasi wajib 16 digit'),
});

export type DemoRegistrationInput = z.infer<typeof DemoRegistrationSchema>;
