import Image from 'next/image';
import { HOSPITAL_FACTS } from '@/data/facts';
import { AdminDashboardClient } from './AdminDashboardClient';
import { ShieldAlert } from 'lucide-react';

export const metadata = {
  title: `Panel Administrator Medis (Demo) · ${HOSPITAL_FACTS.name}`,
  description: `Manajemen operasional rumah sakit: pembaruan status janji temu, ketersediaan bed kritis, dan jejak audit sistem.`,
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* HEADER HALAMAN ADMINISTRATOR DENGAN LOGO RESMI */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-tower-100">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-gold-100 text-tower-950 border border-gold-400">
            <ShieldAlert className="w-3.5 h-3.5 text-tower-900" />
            <span>Area Terbatas · Administrator Medis (RBAC)</span>
          </div>

          <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-tower-950 tracking-tight">
            Konsol Manajemen & Operasional
          </h1>

          <p className="text-ink-soft text-xs sm:text-sm max-w-2xl leading-relaxed">
            Pusat kendali status pelayanan poliklinik, status keterisian kamar rawat intensif (Tower Lt. 4), dan monitoring audit trail transaksi PostgreSQL secara waktu nyata.
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
      <AdminDashboardClient />

    </div>
  );
}
