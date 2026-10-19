import Link from 'next/link';
import { SERVICES } from '@/data/services';
import { SPECIALTIES } from '@/data/specialties';
import {
  Building2,
  ArrowRight,
  Stethoscope,
} from 'lucide-react';

export const metadata = {
  title: 'Katalog Layanan & 20 Poliklinik · RS Islam Surabaya A. Yani',
  description: 'Informasi lengkap 8 layanan unggulan, penunjang diagnostik 24 jam, dan indeks 20 poliklinik spesialis rawat jalan di RS Islam Surabaya A. Yani.',
  robots: { index: false, follow: false },
};

export default function LayananPage() {
  return (
    <div className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* HEADER KATALOG */}
      <div className="space-y-3 border-b border-tower-100 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-tower-100 text-tower-900">
          <Building2 className="w-3.5 h-3.5 text-tower-700" />
          <span>Fasilitas & Penunjang Medis</span>
        </div>

        <h1 className="font-display font-bold text-3xl sm:text-4xl text-tower-900 tracking-tight">
          Katalog Layanan Medis Terpadu
        </h1>

        <p className="text-ink-soft text-sm sm:text-base max-w-2xl leading-relaxed">
          Menyediakan 8 layanan unggulan terverifikasi dan 20 poliklinik spesialis yang terintegrasi di Gedung Tower 13 Lantai dan Gedung Graha.
        </p>
      </div>

      {/* 1. SECTION 8 LAYANAN UNGGULAN */}
      <section aria-labelledby="featured-services-heading" className="space-y-8">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-gold-700 block font-bold mb-1">
            Fasilitas Prioritas
          </span>
          <h2 id="featured-services-heading" className="font-display font-bold text-2xl sm:text-3xl text-tower-900">
            8 Layanan Unggulan Rumah Sakit
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES.map((svc) => (
            <div
              key={svc.slug}
              id={svc.slug}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-tower-100 shadow-sm hover:shadow-md hover:border-tower-700/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-tower-100 text-tower-900">
                    {svc.buildingId === 'tower' ? `Tower Lantai ${svc.floor}` : `Graha Lantai ${svc.floor === 0 ? 'Dasar' : svc.floor}`}
                  </span>
                  {svc.open24h && (
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-alert-50 text-alert-600 border border-alert-600/20">
                      Buka 24 Jam
                    </span>
                  )}
                </div>

                <h3 className="font-display font-bold text-2xl text-tower-950">
                  {svc.name}
                </h3>

                <p className="text-sm text-ink-soft leading-relaxed">
                  {svc.description}
                </p>

                <div className="p-3 rounded-xl bg-ivory text-xs text-ink-soft border border-tower-50">
                  <span className="font-semibold text-tower-900">Sumber Publik:</span> {svc.sourceNote}
                </div>
              </div>

              <div className="pt-4 border-t border-tower-50 flex items-center justify-between gap-3">
                <Link
                  href={`/tower?gedung=${svc.buildingId}&lantai=${svc.floor}`}
                  className="text-xs font-bold text-tower-800 hover:text-tower-600 inline-flex items-center gap-1.5"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Lihat di Tower Directory</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href="/dokter"
                  className="px-3.5 py-1.5 rounded-lg bg-tower-50 hover:bg-tower-100 text-tower-900 text-xs font-bold transition-colors"
                >
                  Cari Dokter Terkait
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. SECTION INDEKS 20 POLIKLINIK SPESIALIS */}
      <section aria-labelledby="polyclinics-index-heading" className="space-y-8 pt-8 border-t border-tower-100">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-gold-700 block font-bold mb-1">
            Rawat Jalan Mandiri & BPJS
          </span>
          <h2 id="polyclinics-index-heading" className="font-display font-bold text-2xl sm:text-3xl text-tower-900">
            Indeks 20 Poliklinik Rawat Jalan
          </h2>
          <p className="text-ink-soft text-sm mt-1 max-w-xl">
            Klik pada poliklinik untuk langsung menyaring jadwal dokter spesialis yang berpraktek di klinik terkait.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SPECIALTIES.map((spec) => (
            <Link
              key={spec.id}
              href={`/dokter?spesialis=${spec.id}`}
              className="bg-white rounded-2xl p-5 border border-tower-100 shadow-sm hover:shadow-md hover:border-tower-700 hover:bg-tower-50/40 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-tower-100 flex items-center justify-center text-tower-800 group-hover:scale-110 transition-transform">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] uppercase font-bold text-tower-950 px-2 py-0.5 rounded bg-gold-100 border border-gold-500/30">
                    {spec.group}
                  </span>
                </div>

                <h3 className="font-display font-bold text-base text-tower-950 group-hover:text-tower-700 transition-colors">
                  {spec.name}
                </h3>

                <p className="text-xs text-ink-soft leading-relaxed line-clamp-2">
                  {spec.summary}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-tower-50 flex items-center justify-between text-xs font-bold text-tower-800">
                <span>Cari Dokter</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
