import Image from 'next/image';
import { HOSPITAL_FACTS } from '@/data/facts';
import { PatientAppointmentsClient } from './PatientAppointmentsClient';
import { CalendarCheck2 } from 'lucide-react';

export const metadata = {
  title: `Riwayat Janji Temu Pasien (Demo) · ${HOSPITAL_FACTS.name}`,
  description: `Kelola riwayat reservasi janji temu poliklinik, status antrean, dan pembatalan mandiri untuk pasien demo.`,
  robots: { index: false, follow: false },
};

export default function JanjiTemuPage() {
  return (
    <div className="py-6 sm:py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* HEADER HALAMAN DENGAN LOGO RESMI */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-tower-100">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-tower-100 text-tower-900 border border-tower-200">
            <CalendarCheck2 className="w-3.5 h-3.5 text-tower-700" />
            <span>Portal Pasien Demo</span>
          </div>

          <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-tower-950 tracking-tight">
            Riwayat & Jadwal Janji Temu
          </h1>

          <p className="text-ink-soft text-xs sm:text-sm max-w-2xl leading-relaxed">
            Kelola jadwal konsultasi dokter spesialis, pantau status pendaftaran aktif, dan lakukan pembatalan janji temu mandiri yang terhubung langsung ke basis data PostgreSQL.
          </p>
        </div>

        <div className="p-2.5 bg-white rounded-2xl border border-tower-200 shadow-xs shrink-0 hidden sm:inline-block">
          <Image
            src="/assets/logo-web-rsi.png"
            alt={HOSPITAL_FACTS.name}
            width={160}
            height={55}
            className="h-8 w-auto object-contain"
          />
        </div>
      </div>

      {/* CLIENT DASHBOARD */}
      <PatientAppointmentsClient />

    </div>
  );
}
