import Image from 'next/image';
import { DoctorListClient } from './DoctorListClient';
import { HOSPITAL_FACTS } from '@/data/facts';
import { Stethoscope, AlertCircle } from 'lucide-react';
import { getDoctorsFromDb, getSpecialtiesFromDb } from '@/lib/db-queries';

export const metadata = {
  title: `Direktori & Jadwal Praktik Dokter · ${HOSPITAL_FACTS.name}`,
  description: `Pencarian dokter spesialis, jadwal praktik mingguan, dan layanan rujukan BPJS Kesehatan atau Eksekutif di ${HOSPITAL_FACTS.name}.`,
  robots: { index: false, follow: false },
};

export default async function DokterPage() {
  const doctors = await getDoctorsFromDb();
  const specialties = await getSpecialtiesFromDb();

  return (
    <div className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* HEADER DIREKTORI DENGAN LOGO RESMI */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-tower-100 text-tower-900">
            <Stethoscope className="w-3.5 h-3.5 text-tower-700" />
            <span>Direktori Dokter Spesialis</span>
          </div>

          <h1 className="font-display font-bold text-3xl sm:text-4xl text-tower-900 tracking-tight">
            Temukan Dokter & Jadwal Praktik
          </h1>

          <p className="text-ink-soft text-sm sm:text-base max-w-2xl leading-relaxed">
            Cari dokter spesialis berdasarkan poliklinik, hari kunjungan, serta jenis penjamin (BPJS Kesehatan, Umum, atau Asuransi Swasta).
          </p>

          {/* NOTIFIKASI DOKTER SIMULASI (LAMPIRAN D) */}
          <div className="p-3.5 rounded-xl bg-gold-100 text-tower-950 font-medium border border-gold-500/40 text-xs flex items-start gap-2.5 max-w-3xl">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-tower-800" />
            <span>
              <strong className="font-bold">Catatan Studi Kasus:</strong> Profil dokter di bawah ini adalah tokoh fiktif simulasi untuk keperluan perancangan antarmuka portofolio. Tidak meniru data dokter asli RS Islam Surabaya.
            </span>
          </div>
        </div>

        <div className="p-3 bg-white rounded-2xl border border-tower-200 shadow-sm shrink-0 hidden md:inline-block">
          <Image
            src="/assets/logo-web-rsi.png"
            alt={HOSPITAL_FACTS.name}
            width={180}
            height={60}
            className="h-10 w-auto object-contain"
          />
        </div>
      </div>

      {/* DIREKTORI DOKTER & FILTER (DATABASE RUNTIME QUERY) */}
      <DoctorListClient initialDoctors={doctors} initialSpecialties={specialties} />

    </div>
  );
}
