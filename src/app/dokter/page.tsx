import { DoctorListClient } from './DoctorListClient';
import { Stethoscope, AlertCircle } from 'lucide-react';

export const metadata = {
  title: 'Direktori & Jadwal Praktik Dokter · RS Islam Surabaya A. Yani',
  description: 'Pencarian dokter spesialis, jadwal praktik mingguan, dan layanan rujukan BPJS Kesehatan atau Eksekutif di RS Islam Surabaya A. Yani.',
  robots: { index: false, follow: false },
};

export default function DokterPage() {
  return (
    <div className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* HEADER DIREKTORI */}
      <div className="space-y-3">
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

      {/* DIREKTORI DOKTER & FILTER (STATIC PRE-RENDERED) */}
      <DoctorListClient />

    </div>
  );
}
