import { RegistrationWizardClient } from '@/components/daftar/RegistrationWizardClient';
import { CalendarCheck } from 'lucide-react';

export const metadata = {
  title: 'Pendaftaran Pasien Online (Demo) · RS Islam Surabaya A. Yani',
  description: 'Simulasi alur pendaftaran rawat jalan mandiri RS Islam Surabaya A. Yani dalam 4 langkah terpadu: Jalur Pasien, Poliklinik, Dokter & Jadwal, serta Penerbitan Tiket Antrean Demo.',
  robots: { index: false, follow: false },
};

export default function DaftarPage() {
  return (
    <div className="py-10 sm:py-14 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* HEADER HALAMAN */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-tower-100 text-tower-900">
          <CalendarCheck className="w-3.5 h-3.5 text-tower-700" />
          <span>Simulasi Pendaftaran Rawat Jalan</span>
        </div>

        <h1 className="font-display font-bold text-3xl sm:text-4xl text-tower-950 tracking-tight">
          Pendaftaran Mandiri Poliklinik
        </h1>

        <p className="text-ink-soft text-sm sm:text-base max-w-2xl leading-relaxed">
          Uji coba antarmuka pendaftaran online poliklinik spesialis dengan 4 langkah mudah. Form ini sepenuhnya diproses secara lokal tanpa transmisi data ke server eksternal.
        </p>
      </div>

      {/* FORMULIR PENDAFTARAN WIZARD (STATIC PRE-RENDERED) */}
      <RegistrationWizardClient />

    </div>
  );
}
