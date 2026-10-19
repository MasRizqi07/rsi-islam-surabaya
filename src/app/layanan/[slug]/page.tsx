import { notFound } from 'next/navigation';
import Link from 'next/link';
import { SERVICES } from '@/data/services';
import { DOCTORS } from '@/data/doctors';
import {
  Building2,
  Clock,
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  FileText,
} from 'lucide-react';

export function generateStaticParams() {
  return SERVICES.map((s) => ({
    slug: s.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return { title: 'Layanan Tidak Ditemukan' };

  return {
    title: `${service.name} · Layanan Medis · RS Islam Surabaya A. Yani`,
    description: `${service.summary} Lokasi di ${service.buildingId === 'tower' ? 'Gedung Tower' : 'Gedung Graha'} Lantai ${service.floor}.`,
    robots: { index: false, follow: false },
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  // Cari dokter yang relevan dengan layanan ini
  const relatedDoctors = DOCTORS.slice(0, 3);

  const floorLabel =
    service.buildingId === 'tower'
      ? `Gedung Tower Lantai ${service.floor}`
      : `Gedung Graha ${service.floor === 0 ? 'Lantai Dasar' : `Lantai ${service.floor}`}`;

  return (
    <div className="py-10 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* TOMBOL KEMBALI */}
      <Link
        href="/layanan"
        className="inline-flex items-center gap-2 text-sm font-bold text-tower-800 hover:text-tower-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Katalog Layanan</span>
      </Link>

      {/* KARTU UTAMA DETAIL LAYANAN */}
      <article className="bg-white rounded-3xl p-6 sm:p-10 border border-tower-100 shadow-lg space-y-8">
        
        {/* HEADER LAYANAN */}
        <div className="space-y-4 border-b border-tower-100 pb-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            
            {/* LOKASI GEDUNG & LANTAI */}
            <Link
              href={`/tower?gedung=${service.buildingId}&lantai=${service.floor}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-tower-100 text-tower-900 border border-tower-600/20 hover:bg-tower-200 transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-tower-700" />
              <span>{floorLabel}</span>
            </Link>

            {/* STATUS JAM OPERASIONAL */}
            {service.open24h ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-alert-50 text-alert-600 border border-alert-600/30">
                <Clock className="w-3.5 h-3.5 text-alert-600" />
                <span>Siaga Penuh 24 Jam</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-tower-50 text-tower-800 border border-tower-100">
                <Clock className="w-3.5 h-3.5 text-tower-700" />
                <span>Pelayanan Sesuai Jam Kerja Poliklinik</span>
              </span>
            )}
          </div>

          <h1 className="font-display font-bold text-2xl sm:text-4xl text-tower-950 tracking-tight">
            {service.name}
          </h1>

          <p className="text-base sm:text-lg text-ink font-medium leading-relaxed">
            {service.summary}
          </p>
        </div>

        {/* URAIAN KOMPREHENSIF LAYANAN */}
        <div className="space-y-4">
          <h2 className="font-display font-bold text-xl text-tower-900">
            Deskripsi & Standar Pelayanan
          </h2>
          <p className="text-sm sm:text-base text-ink leading-relaxed">
            {service.description}
          </p>
        </div>

        {/* INTEGRASI TOWER DIRECTORY */}
        <div className="p-6 rounded-2xl bg-ivory border border-tower-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-700 block">
              Panduan Lokasi Gedung
            </span>
            <h3 className="font-display font-bold text-lg text-tower-950">
              Menuju {floorLabel}
            </h3>
            <p className="text-xs text-ink-soft">
              Buka denah interaktif untuk mengetahui rute lift dan fasilitas penunjang di lantai ini.
            </p>
          </div>

          <Link
            href={`/tower?gedung=${service.buildingId}&lantai=${service.floor}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-tower-800 hover:bg-tower-700 text-ivory font-bold text-xs shadow-md transition-all shrink-0"
          >
            <Building2 className="w-4 h-4" />
            <span>Buka di Tower Directory</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* DOKTER & TIM MEDIS TERKAIT */}
        <div className="space-y-4 pt-4 border-t border-tower-100">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-xl text-tower-900">
              Dokter Spesialis Terkait
            </h2>
            <Link
              href="/dokter"
              className="text-xs font-bold text-tower-800 hover:text-tower-600 inline-flex items-center gap-1"
            >
              <span>Lihat Semua Dokter</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedDoctors.map((doc) => (
              <div
                key={doc.slug}
                className="p-4 rounded-2xl bg-white border border-tower-100 shadow-sm space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gold-100 text-tower-950 border border-gold-500/30">
                    Ilustrasi
                  </span>
                  <h3 className="font-display font-bold text-sm text-tower-950 leading-tight">
                    {doc.title}
                  </h3>
                  {doc.subSpecialty && (
                    <span className="text-xs text-ink-soft block">
                      {doc.subSpecialty}
                    </span>
                  )}
                </div>

                <Link
                  href={`/dokter/${doc.slug}`}
                  className="text-xs font-bold text-tower-800 hover:text-tower-600 inline-flex items-center gap-1 pt-1"
                >
                  <span>Lihat Jadwal Praktik</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* SUMBER DATA RESMI */}
        <div className="pt-4 border-t border-tower-100 flex items-center justify-between text-xs text-ink-soft">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-tower-700" />
            <span>
              <strong>Sumber Publik:</strong> {service.sourceNote}
            </span>
          </div>

          <Link
            href="/daftar"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-tower-800 text-ivory font-bold hover:bg-tower-700 transition-colors shadow-sm"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Daftar Pemeriksaan</span>
          </Link>
        </div>

      </article>

    </div>
  );
}
