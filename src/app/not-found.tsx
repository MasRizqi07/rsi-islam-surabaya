import Link from 'next/link';
import { HOSPITAL_FACTS } from '@/data/facts';
import {
  Home,
  PhoneCall,
  Stethoscope,
  Building2,
  MapPin,
  CalendarCheck,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const metadata = {
  title: `Halaman Tidak Ditemukan (404) · ${HOSPITAL_FACTS.name}`,
  description: 'Halaman yang Anda tuju tidak ditemukan. Silakan gunakan navigasi cepat untuk kembali ke beranda, direktori dokter, atau akses darurat IGD.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  const { emergency } = HOSPITAL_FACTS;

  return (
    <div className="py-12 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* 1. CENTRAL ARCHITECTURAL 404 HERO */}
      <section className="bg-white rounded-3xl p-8 sm:p-14 border border-tower-100 shadow-xl text-center space-y-8 relative overflow-hidden">
        
        {/* Glow Lembut Aksen Emas */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 20%, rgba(201, 162, 74, 0.4) 0%, transparent 60%)',
          }}
        />

        {/* 13-Floor Stylized Architectural Silhouette Icon */}
        <div className="relative inline-flex flex-col items-center">
          <div className="w-16 h-24 rounded-2xl bg-tower-900 border border-gold-500/30 p-2 flex flex-col justify-between items-center shadow-lg">
            <div className="w-8 h-1 rounded bg-gold-400" />
            <div className="space-y-1 w-full px-1">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="h-0.5 w-full bg-tower-100/40 rounded-full" />
              ))}
            </div>
            <div className="w-10 h-1.5 rounded bg-tower-800" />
          </div>

          <span className="mt-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-tower-50 text-tower-800 border border-tower-200">
            {HOSPITAL_FACTS.buildings.tower.name} 13 Lantai
          </span>
        </div>

        {/* Error Code 404 */}
        <div className="space-y-2">
          <div className="relative inline-block">
            <h1 className="font-display font-black text-6xl sm:text-8xl text-tower-950 tracking-tight leading-none select-none">
              404
            </h1>
            <div className="h-1 w-24 bg-gold-500 mx-auto rounded-full mt-2" />
          </div>

          <h2 className="font-display font-bold text-2xl sm:text-3xl text-tower-900 pt-2">
            Halaman yang Anda Tuju Tidak Ditemukan
          </h2>

          <p className="text-sm sm:text-base text-ink-soft max-w-xl mx-auto leading-relaxed">
            Mohon maaf atas ketidaknyamanan ini. Tautan yang Anda ikuti mungkin telah diperbarui, berpindah lokasi ruangan di {HOSPITAL_FACTS.buildings.tower.name}, atau alamat URL mengalami salah ketik. Layanan darurat dan informasi medis kami tetap siaga melayani Anda dengan sepenuh hati.
          </p>
        </div>

        {/* 3 QUICK RECOVERY ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-xl mx-auto">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-tower-800 hover:bg-tower-700 text-ivory font-bold text-xs shadow-md transition-all"
          >
            <Home className="w-4 h-4 text-gold-300" />
            <span>Kembali ke Beranda Utama</span>
          </Link>

          <a
            href={emergency.callCenterTel}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-alert-600 hover:bg-alert-700 text-ivory font-bold text-xs shadow-md transition-all"
          >
            <PhoneCall className="w-4 h-4 animate-pulse" />
            <span>Layanan IGD 24 Jam ({emergency.callCenterNumber})</span>
          </a>

          <Link
            href="/dokter"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-tower-50 hover:bg-tower-100 text-tower-900 font-bold text-xs border border-tower-200 transition-all"
          >
            <Stethoscope className="w-4 h-4 text-tower-700" />
            <span>Cari Dokter & Poli</span>
          </Link>
        </div>

      </section>

      {/* 2. FREQUENTLY ACCESSED SHORTCUTS (4 CARDS FROM STITCH) */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-700 block mb-1">
            Pintasan Navigasi Langsung
          </span>
          <h3 className="font-display font-bold text-2xl text-tower-950">
            Destinasi Populer Pengunjung & Pasien
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <Link
            href="/tower"
            className="bg-white rounded-2xl p-5 border border-tower-100 shadow-xs hover:shadow-md hover:border-tower-700/50 transition-all flex flex-col justify-between group space-y-3"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-tower-100 text-tower-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-base text-tower-950 group-hover:text-tower-700 transition-colors">
                Tower Directory
              </h4>
              <p className="text-xs text-ink-soft leading-relaxed">
                Panduan denah 13 lantai lengkap untuk menemukan lokasi poliklinik, rawat inap, lab, dan ICU.
              </p>
            </div>
            <div className="pt-2 text-xs font-bold text-tower-800 inline-flex items-center gap-1">
              <span>Buka Denah Gedung</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          <Link
            href="/daftar"
            className="bg-white rounded-2xl p-5 border border-tower-100 shadow-xs hover:shadow-md hover:border-tower-700/50 transition-all flex flex-col justify-between group space-y-3"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-tower-100 text-tower-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-base text-tower-950 group-hover:text-tower-700 transition-colors">
                Daftar Online
              </h4>
              <p className="text-xs text-ink-soft leading-relaxed">
                Pendaftaran rawat jalan mandiri 4 langkah dengan tiket antrean instan tanpa antre fisik di loket.
              </p>
            </div>
            <div className="pt-2 text-xs font-bold text-tower-800 inline-flex items-center gap-1">
              <span>Mulai Pendaftaran</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          <Link
            href="/igd"
            className="bg-white rounded-2xl p-5 border border-tower-100 shadow-xs hover:shadow-md hover:border-tower-700/50 transition-all flex flex-col justify-between group space-y-3"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-alert-50 text-alert-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-base text-tower-950 group-hover:text-tower-700 transition-colors">
                IGD 24 Jam
              </h4>
              <p className="text-xs text-ink-soft leading-relaxed">
                Instalasi gawat darurat trauma center di {HOSPITAL_FACTS.buildings.tower.name} Lantai 2 dengan protokol triase terpadu.
              </p>
            </div>
            <div className="pt-2 text-xs font-bold text-alert-600 inline-flex items-center gap-1">
              <span>Protokol Triase</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          <Link
            href="/kontak"
            className="bg-white rounded-2xl p-5 border border-tower-100 shadow-xs hover:shadow-md hover:border-tower-700/50 transition-all flex flex-col justify-between group space-y-3"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-tower-100 text-tower-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-base text-tower-950 group-hover:text-tower-700 transition-colors">
                Kontak & Lokasi
              </h4>
              <p className="text-xs text-ink-soft leading-relaxed">
                Peta akses arsitektural Jl. Achmad Yani, drop-off ambulans, dan petunjuk arah Google Maps.
              </p>
            </div>
            <div className="pt-2 text-xs font-bold text-tower-800 inline-flex items-center gap-1">
              <span>Akses Gerbang</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

        </div>
      </section>

    </div>
  );
}
