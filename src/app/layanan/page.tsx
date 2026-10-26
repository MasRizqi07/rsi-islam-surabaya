import Link from 'next/link';
import Image from 'next/image';
import { SERVICES } from '@/data/services';
import { SPECIALTIES } from '@/data/specialties';
import { HOSPITAL_FACTS } from '@/data/facts';
import { ClinicIndexClient } from '@/components/layanan/ClinicIndexClient';
import {
  Building2,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
} from 'lucide-react';

export const metadata = {
  title: `Katalog Layanan & 20 Poliklinik · ${HOSPITAL_FACTS.name}`,
  description: `Informasi lengkap 8 layanan medis terpadu, penunjang diagnostik 24 jam, dan indeks interaktif 20 poliklinik spesialis rawat jalan di ${HOSPITAL_FACTS.name}.`,
  robots: { index: false, follow: false },
};

export default function LayananPage() {
  return (
    <div className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* HEADER KATALOG DENGAN LOGO RESMI */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-tower-100 pb-8">
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-tower-100 text-tower-900 border border-tower-600/20">
            <Building2 className="w-3.5 h-3.5 text-tower-700" />
            <span>Fasilitas & Penunjang Medis Modern</span>
          </div>

          <h1 className="font-display font-bold text-3xl sm:text-5xl text-tower-950 tracking-tight">
            Katalog Layanan Medis Terpadu
          </h1>

          <p className="text-ink-soft text-sm sm:text-base leading-relaxed">
            Menyediakan 8 layanan medis terverifikasi dan 20 poliklinik rawat jalan yang terintegrasi di {HOSPITAL_FACTS.buildings.tower.name} 13 Lantai dan {HOSPITAL_FACTS.buildings.graha.name} {HOSPITAL_FACTS.name} dengan standar syariah paripurna.
          </p>
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

      {/* 1. SECTION 8 LAYANAN MEDIS TERPADU (BENTO & GRID HYBRID) */}
      <section aria-labelledby="featured-services-heading" className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-gold-700 block font-bold mb-1">
              Fasilitas Prioritas
            </span>
            <h2 id="featured-services-heading" className="font-display font-bold text-2xl sm:text-3xl text-tower-900">
              8 Layanan Medis Terpadu Rumah Sakit
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-ink-soft max-w-md">
            Dilengkapi teknologi diagnostik mutakhir dan terhubung langsung dalam sirkulasi gedung.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES.map((svc) => (
            <div
              key={svc.slug}
              id={svc.slug}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-tower-100 shadow-xs hover:shadow-lg hover:border-tower-700/40 transition-[border-color,box-shadow] duration-150 flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-tower-50 text-tower-900 border border-tower-200">
                    {svc.buildingId === 'tower' ? `Tower Lantai ${svc.floor}` : `Graha Lantai ${svc.floor === 0 ? 'Dasar' : svc.floor}`}
                  </span>
                  {svc.open24h ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-alert-50 text-alert-600 border border-alert-600/30">
                      <Clock className="w-3 h-3 text-alert-600" />
                      <span>Buka 24 Jam Nonstop</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-tower-50 text-tower-800">
                      <Sparkles className="w-3 h-3 text-gold-700" />
                      <span>Pelayanan Terjadwal</span>
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="font-display font-bold text-2xl text-tower-950 group-hover:text-tower-700 transition-colors">
                    {svc.name}
                  </h3>
                  <p className="text-sm text-ink-soft leading-relaxed">
                    {svc.description}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-ivory text-xs text-ink-soft border border-tower-100/70 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-tower-900">
                    <ShieldCheck className="w-3.5 h-3.5 text-gold-700" />
                    <span>Verifikasi Data Publik</span>
                  </div>
                  <p>{svc.sourceNote}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-tower-50 flex items-center justify-between gap-3">
                <Link
                  href={`/tower?gedung=${svc.buildingId}&lantai=${svc.floor}`}
                  className="text-xs font-bold text-tower-800 hover:text-tower-600 inline-flex items-center gap-1.5"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Lihat di Denah Tower</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150" />
                </Link>

                <Link
                  href={`/layanan/${svc.slug}`}
                  className="px-3.5 py-1.5 rounded-lg bg-tower-50 hover:bg-tower-800 hover:text-ivory text-tower-900 text-xs font-bold transition-[color,background-color] duration-150 shadow-2xs"
                >
                  Detail Fasilitas
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. SECTION INDEKS 20 POLIKLINIK SPESIALIS DENGAN FILTER KATEGORI & PENCARIAN */}
      <section aria-labelledby="polyclinics-index-heading" className="space-y-6 pt-10 border-t border-tower-100">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-gold-700 block font-bold mb-1">
            Rawat Jalan Mandiri & BPJS
          </span>
          <h2 id="polyclinics-index-heading" className="font-display font-bold text-2xl sm:text-3xl text-tower-900">
            Indeks 20 Poliklinik Rawat Jalan
          </h2>
          <p className="text-ink-soft text-sm mt-1 max-w-2xl">
            Saring berdasarkan kategori klinik atau gunakan kotak pencarian untuk menemukan poliklinik dan jadwal dokter terkait.
          </p>
        </div>

        {/* Client Interactive Component */}
        <ClinicIndexClient specialties={SPECIALTIES} />
      </section>

    </div>
  );
}
