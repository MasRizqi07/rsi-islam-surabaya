import Link from 'next/link';
import {
  Home,
  PhoneCall,
  Stethoscope,
  Building2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

export const metadata = {
  title: 'Halaman Tidak Ditemukan (404) · RS Islam Surabaya A. Yani',
  description: 'Halaman yang Anda tuju tidak ditemukan. Silakan gunakan navigasi cepat untuk kembali ke beranda, direktori dokter, atau akses darurat IGD.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-white rounded-3xl p-8 sm:p-14 border border-tower-100 shadow-xl text-center space-y-8 relative overflow-hidden bg-khatam-pattern">
        
        {/* Glow Lembut Aksen Emas */}
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* IKON 404 & BADGE */}
        <div className="space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-tower-100 text-tower-800 flex items-center justify-center mx-auto shadow-sm">
            <AlertCircle className="w-8 h-8 text-tower-700" />
          </div>

          <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-700 block">
            Status 404 &bull; Tidak Ditemukan
          </span>

          <h1 className="font-display font-bold text-3xl sm:text-4xl text-tower-950 tracking-tight">
            Afwan, Halaman Tidak Ditemukan
          </h1>

          <p className="text-sm sm:text-base text-ink-soft max-w-lg mx-auto leading-relaxed">
            Halaman yang Anda tuju mungkin salah tautan, telah dialihkan, atau sedang dalam penyempurnaan antarmuka studi kasus portofolio ini.
          </p>
        </div>

        {/* NAVIGASI CEPAT PEMULIHAN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left">
          <Link
            href="/"
            className="p-4 rounded-2xl bg-tower-800 hover:bg-tower-700 text-ivory font-bold text-sm shadow-md transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <Home className="w-4 h-4 text-gold-300" />
              <span>Kembali ke Beranda</span>
            </div>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/igd"
            className="p-4 rounded-2xl bg-alert-50 hover:bg-alert-50/80 text-alert-600 font-bold text-sm border border-alert-600/30 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <PhoneCall className="w-4 h-4" />
              <span>Layanan Darurat IGD 24 Jam</span>
            </div>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/dokter"
            className="p-4 rounded-2xl bg-ivory hover:bg-tower-50 text-tower-900 font-bold text-sm border border-tower-100 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <Stethoscope className="w-4 h-4 text-tower-700" />
              <span>Cari Dokter Spesialis</span>
            </div>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/tower"
            className="p-4 rounded-2xl bg-ivory hover:bg-tower-50 text-tower-900 font-bold text-sm border border-tower-100 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <Building2 className="w-4 h-4 text-tower-700" />
              <span>Buka Tower Directory</span>
            </div>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="pt-4 border-t border-tower-100 text-xs text-ink-soft">
          Konsep &ldquo;Hijau Tower&rdquo; &bull; RS Islam Surabaya A. Yani
        </div>

      </div>
    </div>
  );
}
