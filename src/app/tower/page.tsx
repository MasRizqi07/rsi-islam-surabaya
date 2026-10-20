import { TowerDirectoryClient } from '@/components/tower/TowerDirectoryClient';
import { Building2 } from 'lucide-react';

export const metadata = {
  title: 'Tower Directory · Denah & Panduan Lantai Gedung · RS Islam Surabaya A. Yani',
  description: 'Panduan denah vertikal interaktif Gedung Tower 13 Lantai dan Gedung Graha RS Islam Surabaya A. Yani. Ketahui lokasi poliklinik, IGD, laboratorium, dan kamar rawat inap.',
  robots: { index: false, follow: false },
};

export default function TowerPage() {
  return (
    <div className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* HEADER UTAMA HALAMAN */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-tower-100 text-tower-900">
          <Building2 className="w-3.5 h-3.5 text-tower-700" />
          <span>Direktori Fasilitas Gedung</span>
        </div>

        <h1 className="font-display font-bold text-3xl sm:text-4xl text-tower-950 tracking-tight">
          Tower Directory Interaktif
        </h1>

        <p className="text-ink-soft text-sm sm:text-base max-w-2xl leading-relaxed">
          Eksplorasi pembagian ruang dan instalasi medis di Gedung Tower 13 Lantai serta Gedung Graha. Seluruh data diselaraskan dengan publikasi resmi rumah sakit.
        </p>
      </div>

      {/* DIREKTORI TOWER & GRAHA (STATIC PRE-RENDERED) */}
      <TowerDirectoryClient />

    </div>
  );
}
