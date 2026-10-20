import Link from 'next/link';
import { HOSPITAL_FACTS } from '@/data/facts';
import { HISTORY_TIMELINE } from '@/data/history';
import { TimelineDecadeClient } from '@/components/tentang/TimelineDecadeClient';
import {
  Building2,
  Award,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Star,
} from 'lucide-react';

export const metadata = {
  title: 'Tentang Kami · Sejarah 51 Tahun & Nilai Filosofis · RS Islam Surabaya A. Yani',
  description: 'Sejarah pengabdian 51 tahun RS Islam Surabaya A. Yani sejak 1975 di bawah naungan YARSIS, rekam jejak akreditasi Paripurna, dan peresmian Gedung Tower 13 Lantai.',
  robots: { index: false, follow: false },
};

export default function TentangPage() {
  return (
    <div className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative rounded-3xl bg-tower-950 text-ivory p-8 sm:p-14 overflow-hidden border border-gold-500/30 shadow-2xl">
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 80% 20%, rgba(201, 162, 74, 0.4) 0%, transparent 60%), radial-gradient(circle at 10% 80%, rgba(15, 107, 97, 0.4) 0%, transparent 60%)',
          }}
        />
        
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-tower-900 border border-gold-500/30 text-gold-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" aria-hidden="true" />
            <span>Sejarah & Nilai Pengabdian YARSIS Sejak 1975</span>
          </div>

          <h1 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-ivory leading-tight tracking-tight">
            51 Tahun Merawat Insan, <br />
            <span className="text-gold-300 italic font-semibold">Menebar Nilai Islam.</span>
          </h1>

          <p className="text-tower-100 text-sm sm:text-base leading-relaxed">
            Didirikan pada 25 Maret {HOSPITAL_FACTS.foundedYear} oleh para tokoh ulama dan cendekiawan Yayasan Rumah Sakit Islam Surabaya (YARSIS), RS Islam Surabaya A. Yani tumbuh dari fasilitas 20 tempat tidur pertama menjadi rumah sakit rujukan modern dengan Gedung Tower 13 Lantai yang mengintegrasikan kecanggihan medis dengan kehangatan islami.
          </p>

          <div className="p-4 rounded-2xl bg-tower-900/80 border border-gold-500/30 text-xs sm:text-sm text-gold-300 italic">
            &ldquo;{HOSPITAL_FACTS.motto}&rdquo;
          </div>
        </div>
      </section>

      {/* 2. STATISTIK FAKTA UTAMA (STRICT HOSPITAL_FACTS COMPLIANCE) */}
      <section aria-labelledby="facts-strip-heading" className="space-y-4">
        <h2 id="facts-strip-heading" className="sr-only">Statistik Utama Rumah Sakit</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          
          <div className="bg-white rounded-2xl p-5 border border-tower-100 shadow-xs space-y-1">
            <span className="font-display font-bold text-3xl text-tower-900">
              {HOSPITAL_FACTS.foundedYear}
            </span>
            <span className="text-xs font-bold text-tower-700 uppercase tracking-wider block">
              Tahun Berdiri
            </span>
            <p className="text-[11px] text-ink-soft">
              51 tahun mengabdi bagi kesehatan masyarakat Jawa Timur.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-tower-100 shadow-xs space-y-1">
            <span className="font-display font-bold text-3xl text-tower-900">
              13 Lantai
            </span>
            <span className="text-xs font-bold text-tower-700 uppercase tracking-wider block">
              Gedung Tower
            </span>
            <p className="text-[11px] text-ink-soft">
              Sentral ICU, kamar operasi modern, dan rawat inap.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-tower-100 shadow-xs space-y-1">
            <span className="font-display font-bold text-3xl text-tower-900">
              {HOSPITAL_FACTS.bedCapacity}
            </span>
            <span className="text-xs font-bold text-tower-700 uppercase tracking-wider block">
              Tempat Tidur
            </span>
            <p className="text-[11px] text-ink-soft">
              Kapasitas rawat inap intensif, reguler, dan bersalin.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-tower-100 shadow-xs space-y-1">
            <span className="font-display font-bold text-3xl text-tower-900">
              {HOSPITAL_FACTS.medicalStaffLabel}
            </span>
            <span className="text-xs font-bold text-tower-700 uppercase tracking-wider block">
              Tenaga Medis
            </span>
            <p className="text-[11px] text-ink-soft">
              Dokter subspesialis, spesialis, dan perawat terampil.
            </p>
          </div>

          <div className="col-span-2 md:col-span-1 bg-white rounded-2xl p-5 border border-tower-100 shadow-xs space-y-1">
            <span className="font-display font-bold text-3xl text-tower-900">
              {HOSPITAL_FACTS.hospitalClass}
            </span>
            <span className="text-xs font-bold text-tower-700 uppercase tracking-wider block">
              Kelas Operasional
            </span>
            <p className="text-[11px] text-ink-soft">
              Klasifikasi rumah sakit umum rujukan tipe B.
            </p>
          </div>

        </div>
      </section>

      {/* 3. REKAM JEJAK AKREDITASI PARIPURNA HISTORIS (K3: 2016 · 2019 · 2022) */}
      <section className="bg-tower-50/70 rounded-3xl p-6 sm:p-12 border border-tower-100 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-700">
              Komitmen Tata Kelola & Mutu Klinis (K3)
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-tower-950">
              Rekam Jejak Akreditasi Paripurna Historis
            </h2>
            <p className="text-ink-soft text-sm leading-relaxed">
              Sebagai komitmen terhadap keselamatan pasien dan tata kelola klinis, RS Islam Surabaya A. Yani secara konsisten mempertahankan pengakuan mutu tertinggi dari lembaga independen nasional.
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-tower-100 text-tower-900 border border-tower-600/20 shrink-0">
            <ShieldCheck className="w-4 h-4 text-tower-700" />
            <span>{HOSPITAL_FACTS.accreditationHistory}</span>
          </span>
        </div>

        {/* 3 Gold Medallion Cards from Stitch Design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Medallion 1: 2016 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-tower-100 shadow-sm relative overflow-hidden flex flex-col justify-between space-y-6 group hover:shadow-md transition-all">
            <div className="h-1.5 -mx-8 -mt-8 bg-gradient-to-r from-gold-500 via-gold-300 to-gold-500" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gold-100 flex items-center justify-center text-gold-700 group-hover:scale-105 transition-transform">
                  <Award className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-tower-50 text-tower-900">
                  Tahun 2016
                </span>
              </div>

              {/* 5 Bintang Emas */}
              <div className="flex items-center gap-1 text-gold-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold-500 text-gold-500" />
                ))}
              </div>

              <div className="space-y-1">
                <h3 className="font-display font-bold text-lg text-tower-950">
                  Akreditasi Paripurna KARS 2016
                </h3>
                <p className="text-xs text-ink-soft leading-relaxed">
                  Standar Akreditasi Rumah Sakit versi 2012 oleh Komisi Akreditasi Rumah Sakit (KARS). Tonggak standarisasi keselamatan pasien nasional secara menyeluruh.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-tower-50 flex items-center justify-between text-xs font-bold text-tower-800">
              <span className="uppercase tracking-wider text-[10px] text-ink-soft font-mono">Standar Mutu</span>
              <span>KARS Versi 2012</span>
            </div>
          </div>

          {/* Medallion 2: 2019 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-tower-100 shadow-sm relative overflow-hidden flex flex-col justify-between space-y-6 group hover:shadow-md transition-all">
            <div className="h-1.5 -mx-8 -mt-8 bg-gradient-to-r from-gold-500 via-gold-300 to-gold-500" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gold-100 flex items-center justify-center text-gold-700 group-hover:scale-105 transition-transform">
                  <Award className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-tower-50 text-tower-900">
                  Tahun 2019
                </span>
              </div>

              {/* 5 Bintang Emas */}
              <div className="flex items-center gap-1 text-gold-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold-500 text-gold-500" />
                ))}
              </div>

              <div className="space-y-1">
                <h3 className="font-display font-bold text-lg text-tower-950">
                  Akreditasi Paripurna KARS 2019
                </h3>
                <p className="text-xs text-ink-soft leading-relaxed">
                  Standar Nasional Akreditasi Rumah Sakit (SNARS) Edisi 1. Pengakuan atas kesinambungan mutu manajemen risiko klinis dan tata kelola asuhan medis berpusat pada pasien.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-tower-50 flex items-center justify-between text-xs font-bold text-tower-800">
              <span className="uppercase tracking-wider text-[10px] text-ink-soft font-mono">Standar Mutu</span>
              <span>SNARS Edisi 1</span>
            </div>
          </div>

          {/* Medallion 3: 2022 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-tower-100 shadow-sm relative overflow-hidden flex flex-col justify-between space-y-6 group hover:shadow-md transition-all">
            <div className="h-1.5 -mx-8 -mt-8 bg-gradient-to-r from-gold-500 via-gold-300 to-gold-500" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gold-100 flex items-center justify-center text-gold-700 group-hover:scale-105 transition-transform">
                  <Award className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-tower-50 text-tower-900">
                  Tahun 2022
                </span>
              </div>

              {/* 5 Bintang Emas */}
              <div className="flex items-center gap-1 text-gold-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold-500 text-gold-500" />
                ))}
              </div>

              <div className="space-y-1">
                <h3 className="font-display font-bold text-lg text-tower-950">
                  Akreditasi Paripurna LAM-KPRS 2022
                </h3>
                <p className="text-xs text-ink-soft leading-relaxed">
                  Lembaga Akreditasi Mutu dan Keselamatan Pasien Rumah Sakit (LAM-KPRS). Standarisasi pelayanan era transformasi kesehatan nasional dan keselamatan medis modern.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-tower-50 flex items-center justify-between text-xs font-bold text-tower-800">
              <span className="uppercase tracking-wider text-[10px] text-ink-soft font-mono">Standar Mutu</span>
              <span>LAM-KPRS 2022</span>
            </div>
          </div>

        </div>
      </section>

      {/* 4. NILAI FILOSOFIS YARSIS & FALSAFAH ISLAMI */}
      <section className="bg-white rounded-3xl p-6 sm:p-12 border border-tower-100 shadow-sm space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-700">
            Nilai Luhur Yayasan
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-tower-950">
            Falsafah Pelayanan & Kearifan Budaya
          </h2>
          <p className="text-sm text-ink-soft leading-relaxed">
            Mengadopsi kearifan budaya dan nilai tauhid yang diwujudkan dalam etika kedokteran islami kontemporer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-tower-50/70 rounded-2xl p-6 border border-tower-100 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-tower-100 flex items-center justify-center text-tower-800">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-tower-950">
              Sentuhan Kasih & Adab
            </h3>
            <p className="text-xs text-ink-soft leading-relaxed">
              Pelayanan kesehatan mengedepankan senyum, salam, sapa, dan kelembutan tutur kata dalam mendampingi pasien serta keluarga di masa pemulihan.
            </p>
          </div>

          <div className="bg-tower-50/70 rounded-2xl p-6 border border-tower-100 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-tower-100 flex items-center justify-center text-tower-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-tower-950">
              Presisi Klinis Modern
            </h3>
            <p className="text-xs text-ink-soft leading-relaxed">
              Pemanfaatan teknologi diagnostik mutakhir (CT-Scan 128 Slice, C-Arm, dan 30 mesin hemodialisis single use) demi akurasi tindakan medis.
            </p>
          </div>

          <div className="bg-tower-50/70 rounded-2xl p-6 border border-tower-100 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-tower-100 flex items-center justify-center text-tower-800">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-tower-950">
              Bimbingan Rohani Pasien
            </h3>
            <p className="text-xs text-ink-soft leading-relaxed">
              Pendampingan ibadah praktis (tayamum dan sholat saat sakit), doa kesembuhan, hingga pemulasaran jenazah syariah sesuai tuntunan Islam.
            </p>
          </div>
        </div>
      </section>

      {/* 5. GARIS WAKTU SEJARAH DENGAN FILTER DEKADE INTERAKTIF */}
      <section className="space-y-8">
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-700">
            Perjalanan Panjang Pengabdian
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-tower-950">
            Kronologi Sejarah RS Islam Surabaya A. Yani (1975–2026)
          </h2>
          <p className="text-sm text-ink-soft max-w-2xl">
            Dari cikal bakal fasilitas 20 tempat tidur sederhana hingga menjadi ikon menara medis 13 lantai bertaraf nasional.
          </p>
        </div>

        {/* Client Interactive Decade Timeline */}
        <TimelineDecadeClient timeline={HISTORY_TIMELINE} />
      </section>

      {/* 6. CALL TO ACTION KE FITUR LAIN */}
      <section className="bg-tower-900 text-ivory rounded-3xl p-8 sm:p-12 border border-gold-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-ivory">
            Jelajahi Fasilitas Gedung Tower
          </h2>
          <p className="text-ivory/80 text-sm max-w-xl">
            Ketahui lokasi poliklinik spesialis, instalasi darurat, dan fasilitas penunjang di Gedung Tower 13 Lantai.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/tower"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-300 text-tower-950 font-bold text-sm shadow-md transition-all"
          >
            <Building2 className="w-4 h-4" />
            <span>Tower Directory</span>
          </Link>

          <Link
            href="/dokter"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-tower-800 hover:bg-tower-700 text-ivory font-bold text-sm border border-gold-500/30 transition-colors"
          >
            <Stethoscope className="w-4 h-4" />
            <span>Cari Dokter</span>
          </Link>
        </div>
      </section>

    </div>
  );
}
