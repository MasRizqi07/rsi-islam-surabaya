import Link from 'next/link';
import { HOSPITAL_FACTS } from '@/data/facts';
import { HISTORY_TIMELINE } from '@/data/history';
import {
  Building2,
  Award,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from 'lucide-react';

export const metadata = {
  title: 'Tentang Kami · Sejarah & Nilai Filosofis · RS Islam Surabaya A. Yani',
  description: 'Sejarah pengabdian 51 tahun RS Islam Surabaya A. Yani sejak 1975 di bawah naungan YARSIS, rekam jejak akreditasi Paripurna, dan peresmian Gedung Tower 13 Lantai.',
  robots: { index: false, follow: false },
};

export default function TentangPage() {
  return (
    <div className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative rounded-3xl bg-gradient-to-br from-tower-900 via-tower-950 to-tower-900 text-ivory p-8 sm:p-14 overflow-hidden border border-gold-500/30 bg-khatam-pattern shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-tower-800/80 border border-gold-500/30 text-gold-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-gold-500" aria-hidden="true" />
            <span>Sejarah & Nilai Pengabdian YARSIS</span>
          </div>

          <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-ivory leading-tight tracking-tight">
            51 Tahun Merawat Insan, <br />
            <span className="text-gold-300 italic font-semibold">Menebar Nilai Islam.</span>
          </h1>

          <p className="text-ivory/80 text-sm sm:text-base leading-relaxed">
            Didirikan pada 25 Maret {HOSPITAL_FACTS.foundedYear} oleh para tokoh ulama dan cendekiawan Yayasan Rumah Sakit Islam Surabaya (YARSIS), RS Islam Surabaya A. Yani tumbuh dari fasilitas 20 tempat tidur menjadi pusat rujukan modern dengan Gedung Tower 13 Lantai yang mengintegrasikan kecanggihan medis dengan kehangatan islami.
          </p>

          <div className="p-4 rounded-2xl bg-tower-800/60 border border-gold-500/30 text-xs sm:text-sm text-gold-300 italic">
            &ldquo;{HOSPITAL_FACTS.motto}&rdquo;
          </div>
        </div>
      </section>

      {/* 2. STATISTIK FAKTA UTAMA */}
      <section aria-labelledby="facts-strip-heading" className="space-y-4">
        <h2 id="facts-strip-heading" className="sr-only">Statistik Utama Rumah Sakit</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-tower-100 shadow-sm space-y-1">
            <span className="font-display font-bold text-3xl text-tower-900">
              {HOSPITAL_FACTS.foundedYear}
            </span>
            <span className="text-xs font-bold text-tower-700 uppercase tracking-wider block">
              Tahun Berdiri
            </span>
            <p className="text-xs text-ink-soft">
              51 tahun mengabdi bagi kesehatan masyarakat Jawa Timur.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-tower-100 shadow-sm space-y-1">
            <span className="font-display font-bold text-3xl text-tower-900">
              {HOSPITAL_FACTS.hospitalClass}
            </span>
            <span className="text-xs font-bold text-tower-700 uppercase tracking-wider block">
              Kelas Operasional
            </span>
            <p className="text-xs text-ink-soft">
              Klasifikasi rumah sakit umum rujukan dengan fasilitas terpadu.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-tower-100 shadow-sm space-y-1">
            <span className="font-display font-bold text-3xl text-tower-900">
              {HOSPITAL_FACTS.bedCapacity}
            </span>
            <span className="text-xs font-bold text-tower-700 uppercase tracking-wider block">
              Tempat Tidur
            </span>
            <p className="text-xs text-ink-soft">
              Kapasitas rawat inap intensif, reguler, dan kamar bersalin.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-tower-100 shadow-sm space-y-1">
            <span className="font-display font-bold text-3xl text-tower-900">
              {HOSPITAL_FACTS.medicalStaffLabel}
            </span>
            <span className="text-xs font-bold text-tower-700 uppercase tracking-wider block">
              Dokter & Tenaga Medis
            </span>
            <p className="text-xs text-ink-soft">
              Dokter spesialis, subspesialis, dan perawat bersertifikasi.
            </p>
          </div>
        </div>
      </section>

      {/* 3. NILAI FILOSOFIS YARSIS & PENDEKATAN KEDOKTERAN ISLAM */}
      <section className="bg-tower-50/70 rounded-3xl p-8 sm:p-12 border border-tower-100 space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-700">
            Nilai Luhur Yayasan
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-tower-950">
            Filosofi Pelayanan & Nilai YARSIS
          </h2>
          <p className="text-sm text-ink-soft leading-relaxed">
            Mengadopsi kearifan budaya dan nilai tauhid yang diwujudkan dalam etika kedokteran islami kontemporer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-tower-100 shadow-sm space-y-3">
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

          <div className="bg-white rounded-2xl p-6 border border-tower-100 shadow-sm space-y-3">
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

          <div className="bg-white rounded-2xl p-6 border border-tower-100 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-tower-100 flex items-center justify-center text-tower-800">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-tower-950">
              Bimbingan Rohani Pasien
            </h3>
            <p className="text-xs text-ink-soft leading-relaxed">
              Pendampingan ibadah praktis (tayamum dan sholat saat sakit), doa kesembuhan, hingga pendampingan sakaratul maut sesuai tuntunan syariat Islam.
            </p>
          </div>
        </div>
      </section>

      {/* 4. REKAM JEJAK AKREDITASI HISTORIS (K3) */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-tower-100 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-tower-100 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-700">
              Standar Mutu & Keselamatan
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-tower-950">
              Rekam Jejak Akreditasi Paripurna
            </h2>
          </div>

          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-gold-100 text-tower-950 border border-gold-500/40 w-fit">
            Fakta Historis Terverifikasi
          </span>
        </div>

        <p className="text-sm text-ink-soft leading-relaxed max-w-3xl">
          RS Islam Surabaya A. Yani secara konsisten mempertahankan pengakuan mutu tertinggi dari lembaga akreditasi independen nasional, sebagai bukti kepatuhan terhadap keselamatan pasien dan keunggulan tata kelola klinis.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-5 rounded-2xl bg-ivory border border-tower-100 space-y-2">
            <span className="font-display font-bold text-2xl text-tower-900 block">2016</span>
            <span className="font-bold text-xs text-tower-950 block">Akreditasi Paripurna (Bintang Lima)</span>
            <span className="text-xs text-ink-soft block">Komisi Akreditasi Rumah Sakit (KARS)</span>
          </div>

          <div className="p-5 rounded-2xl bg-ivory border border-tower-100 space-y-2">
            <span className="font-display font-bold text-2xl text-tower-900 block">2019</span>
            <span className="font-bold text-xs text-tower-950 block">Akreditasi Paripurna KARS</span>
            <span className="text-xs text-ink-soft block">Mempertahankan standar mutu keselamatan pasien</span>
          </div>

          <div className="p-5 rounded-2xl bg-ivory border border-tower-100 space-y-2">
            <span className="font-display font-bold text-2xl text-tower-900 block">2022</span>
            <span className="font-bold text-xs text-tower-950 block">Akreditasi Paripurna LAM-KPRS</span>
            <span className="text-xs text-ink-soft block">Lembaga Akreditasi Mutu & Keselamatan Pasien RS</span>
          </div>
        </div>
      </section>

      {/* 5. GARIS WAKTU SEJARAH (1975–2026) */}
      <section className="space-y-8">
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-700">
            Perjalanan Panjang Pengabdian
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-tower-950">
            Kronologi Sejarah RS Islam Surabaya A. Yani (1975–2026)
          </h2>
          <p className="text-sm text-ink-soft max-w-2xl">
            Dari cikal bakal fasilitas kesehatan sederhana hingga menjadi ikon rumah sakit modern bertaraf nasional.
          </p>
        </div>

        {/* TIMELINE VERTICAL STACK */}
        <div className="relative border-l-2 border-gold-500/40 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-8">
          {HISTORY_TIMELINE.map((item) => (
            <div key={item.year} className="relative group">
              {/* TITIK BULAT TIMELINE */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-gold-500 border-4 border-ivory shadow-sm group-hover:scale-125 transition-transform" />

              <div className="bg-white rounded-2xl p-6 border border-tower-100 shadow-sm space-y-2 hover:border-tower-700/40 transition-all">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-display font-bold text-xl sm:text-2xl text-tower-900">
                      {item.year}
                    </span>
                    <h3 className="font-display font-bold text-base sm:text-lg text-tower-950">
                      {item.title}
                    </h3>
                  </div>

                  {item.tag && (
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-tower-50 text-tower-800 border border-tower-100">
                      {item.tag}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION KE FITUR LAIN */}
      <section className="bg-tower-900 text-ivory rounded-3xl p-8 sm:p-12 border border-gold-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-ivory">
            Jelajahi Fasilitas Gedung Tower
          </h2>
          <p className="text-ivory/70 text-sm max-w-xl">
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
