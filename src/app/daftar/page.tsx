import { RegistrationWizardClient } from '@/components/daftar/RegistrationWizardClient';
import { CalendarCheck } from 'lucide-react';

export const metadata = {
  title: 'Pendaftaran Pasien Online (Demo) · RS Islam Surabaya A. Yani',
  description: 'Simulasi alur pendaftaran rawat jalan mandiri RS Islam Surabaya A. Yani dalam 4 langkah terpadu: Jalur Pasien, Poliklinik, Dokter & Jadwal, serta Penerbitan Tiket Antrean Demo.',
  robots: { index: false, follow: false },
};

export default function DaftarPage() {
  return (
    <div className="py-4 sm:py-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
      
      {/* HEADER HALAMAN KOMPAK */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-tower-100 text-tower-900">
          <CalendarCheck className="w-3.5 h-3.5 text-tower-700" />
          <span>Simulasi Pendaftaran Rawat Jalan</span>
        </div>

        <h1 className="font-display font-bold text-2xl sm:text-3xl text-tower-950 tracking-tight">
          Pendaftaran Mandiri Poliklinik
        </h1>

        <p className="text-ink-soft text-xs sm:text-sm max-w-2xl leading-relaxed">
          Simulasi alur pendaftaran rawat jalan online 4 langkah. Form ini diproses 100% secara lokal di peramban tanpa transmisi data ke server eksternal.
        </p>
      </div>

      {/* FORMULIR PENDAFTARAN WIZARD (STATIC PRE-RENDERED) */}
      <RegistrationWizardClient />

    </div>
  );
}
