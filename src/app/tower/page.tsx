import Image from 'next/image';
import { TowerDirectoryClient } from '@/components/tower/TowerDirectoryClient';
import { HOSPITAL_FACTS } from '@/data/facts';
import { Building2 } from 'lucide-react';

export const metadata = {
  title: `Tower Directory · Denah & Panduan Lantai Gedung · ${HOSPITAL_FACTS.name}`,
  description: `Panduan denah vertikal interaktif ${HOSPITAL_FACTS.buildings.tower.name} 13 Lantai dan ${HOSPITAL_FACTS.buildings.graha.name} ${HOSPITAL_FACTS.name}. Ketahui lokasi poliklinik, IGD, laboratorium, dan kamar rawat inap.`,
  robots: { index: false, follow: false },
};

export default function TowerPage() {
  return (
    <div className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* HEADER UTAMA HALAMAN DENGAN FOTO ASLI GEDUNG */}
      <div className="bg-gradient-to-r from-tower-950 via-tower-900 to-tower-950 rounded-3xl p-6 sm:p-8 border border-gold-500/30 text-ivory shadow-xl relative overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-20">
          <Image
            src="/assets/rsi-ayani.jpg"
            alt=""
            fill
            className="object-cover mix-blend-luminosity brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-tower-950 via-tower-950/80 to-transparent" />
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-tower-900/90 text-gold-300 border border-gold-500/30">
              <Building2 className="w-3.5 h-3.5 text-gold-400" />
              <span>Direktori Fasilitas Gedung</span>
            </div>

            <h1 className="font-display font-bold text-3xl sm:text-4xl text-ivory tracking-tight">
              Tower Directory Interaktif
            </h1>

            <p className="text-tower-100 text-sm sm:text-base max-w-2xl leading-relaxed">
              Eksplorasi pembagian ruang dan instalasi medis di {HOSPITAL_FACTS.buildings.tower.name} 13 Lantai serta {HOSPITAL_FACTS.buildings.graha.name}. Seluruh data diselaraskan dengan publikasi resmi rumah sakit.
            </p>
          </div>

          <div className="md:col-span-4 hidden md:flex justify-end">
            <div className="relative w-48 h-28 rounded-xl overflow-hidden border border-gold-500/40 shadow-lg">
              <Image
                src="/assets/rsi-ayani.jpg"
                alt={`Gedung ${HOSPITAL_FACTS.name}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-tower-950/80 via-transparent to-transparent" />
              <span className="absolute bottom-1.5 left-2 text-[10px] font-bold text-gold-300">
                13 Lantai Graha RSI
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DIREKTORI TOWER & GRAHA (STATIC PRE-RENDERED) */}
      <TowerDirectoryClient />

    </div>
  );
}
