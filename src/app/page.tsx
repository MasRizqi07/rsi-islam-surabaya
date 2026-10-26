import Link from 'next/link';
import Image from 'next/image';
import { HOSPITAL_FACTS, SERVICE_YEARS } from '@/data/facts';
import { SERVICES } from '@/data/services';
import { BedStatusWidget } from '@/components/home/BedStatusWidget';
import { QuickDoctorSearch } from '@/components/home/QuickDoctorSearch';
import { TowerTeaser } from '@/components/home/TowerTeaser';
import { HeroBlueprintCard } from '@/components/home/HeroBlueprintCard';
import {
  PhoneCall,
  Calendar,
  Stethoscope,
  Building2,
  Clock,
  ShieldCheck,
  Star,
  MapPin,
  ArrowRight,
} from 'lucide-react';

export default function HomePage() {
  const featuredServices = SERVICES.slice(0, 6);
  const { contact, ratings } = HOSPITAL_FACTS;

  return (
    <div className="space-y-16 sm:space-y-24">
      
      {/* 1. SECTION HERO DENGAN FOTO ASLI GEDUNG & RITME TOWER (LCP ELEMENT = TEKS HEADLINE) */}
      <section
        id="hero-section"
        style={{ backgroundColor: 'var(--color-tower-900)' }}
        className="relative bg-tower-900 text-ivory py-16 lg:py-24 overflow-hidden shadow-inner"
      >
        {/* FOTO ASLI GEDUNG RS ISLAM SURABAYA SEBAGAI LATAR HERO ATMOSFERIK */}
        <div aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <Image
            src="/assets/rsi-ayani.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-30 mix-blend-luminosity scale-105 filter brightness-75 contrast-125"
          />
          {/* Overlay Gradien Hijau Tower & Vignette untuk Menjaga Kontras Teks */}
          <div className="absolute inset-0 bg-gradient-to-r from-tower-950 via-tower-950/90 to-tower-900/85" />
          <div className="absolute inset-0 bg-gradient-to-t from-tower-950 via-transparent to-tower-950/80" />
          <div className="absolute inset-0 bg-khatam-pattern opacity-20" />
        </div>
        
        {/* Glow Lembut Emas Menggunakan Radial Gradient */}
        <div aria-hidden="true" className="absolute top-0 right-1/4 w-96 h-96 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(201, 162, 74, 0.15) 0%, transparent 70%)' }} />
        <div aria-hidden="true" className="absolute bottom-0 left-10 w-96 h-96 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(15, 107, 97, 0.25) 0%, transparent 70%)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* KOLOM TEKS HERO (RSC MURNI, LCP LANGSUNG TERSEDIA SAAT INITIAL HTML LOAD) */}
            <div className="lg:col-span-7 space-y-6">
              {/* BADGE PROFIL RUMAH SAKIT RESMI (TANPA PENGULANGAN LOGO) */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-tower-900/90 border border-gold-500/40 text-ivory shadow-lg backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-gold-400" aria-hidden="true" />
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-gold-300">{HOSPITAL_FACTS.name}</span>
                  <span className="text-tower-300">·</span>
                  <span className="text-tower-100 hidden sm:inline">{HOSPITAL_FACTS.tagline}</span>
                </div>
              </div>

              {/* LCP Target: Teks Heading Utama */}
              <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-ivory leading-[1.15] tracking-tight">
                Presisi Medis Modern, <br />
                <span className="text-gold-300 italic font-semibold">Berakar Nilai Islam.</span>
              </h1>

              <p className="text-ivory text-base sm:text-lg leading-relaxed max-w-xl">
                Rumah Sakit Islam Surabaya A. Yani beroperasi sejak {HOSPITAL_FACTS.foundedYear} dengan kapasitas {HOSPITAL_FACTS.bedCapacity} tempat tidur dan {HOSPITAL_FACTS.medicalStaffLabel}, memadukan layanan medis dan arsitektur vertikal Tower 13 Lantai.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/janji-temu"
                  prefetch={false}
                  className="min-h-[48px] px-7 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 active:bg-gold-600 text-tower-950 font-bold text-sm shadow-lg hover:shadow-xl press-feedback transition-[color,background-color,box-shadow,transform] duration-150 flex items-center gap-2 focus:ring-2 focus:ring-ivory focus:outline-none"
                >
                  <Calendar className="w-4 h-4" aria-hidden="true" />
                  <span>Buat Janji Temu</span>
                </Link>

                <Link
                  href="/daftar"
                  prefetch={false}
                  className="min-h-[48px] px-7 py-3 rounded-xl bg-tower-800/90 hover:bg-tower-700 text-ivory font-bold text-sm border border-gold-500/30 press-feedback transition-[color,background-color,border-color,transform] duration-150 flex items-center gap-2 focus:ring-2 focus:ring-ivory focus:outline-none"
                >
                  <Calendar className="w-4 h-4" aria-hidden="true" />
                  <span>Simulasi Pendaftaran</span>
                </Link>
              </div>

              {/* FAKTA SINGKAT HERO */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-gold-500/20 text-xs sm:text-sm">
                <div>
                  <span className="block font-display font-bold text-2xl text-gold-300">{HOSPITAL_FACTS.foundedYear}</span>
                  <span className="text-tower-100 text-xs">{SERVICE_YEARS} Tahun Mengabdi</span>
                </div>
                <div>
                  <span className="block font-display font-bold text-2xl text-gold-300">{HOSPITAL_FACTS.hospitalClass}</span>
                  <span className="text-tower-100 text-xs">Operasional Kelas B</span>
                </div>
                <div>
                  <span className="block font-display font-bold text-2xl text-gold-300">{HOSPITAL_FACTS.bedCapacity}</span>
                  <span className="text-tower-100 text-xs">Tempat Tidur Pasien</span>
                </div>
              </div>
            </div>

            {/* KOLOM BLUEPRINT ARSITEKTUR TOWER INTERAKTIF */}
            <div className="lg:col-span-5 flex justify-center">
              <HeroBlueprintCard />
            </div>

          </div>
        </div>
      </section>

      {/* 2. SECTION AKSES CEPAT (5 IKON) */}
      <section aria-label="Akses Cepat Layanan" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 relative z-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 bg-white p-4 sm:p-5 rounded-2xl shadow-xl border border-tower-100">
          {[
            { label: 'IGD 24 Jam', href: '/igd', icon: PhoneCall, alert: true, desc: 'Gawat Darurat & Ambulans' },
            { label: 'Cari Dokter', href: '/dokter', icon: Stethoscope, desc: 'Jadwal 24 Dokter Fiktif' },
            { label: 'Pendaftaran', href: '/daftar', icon: Calendar, desc: 'Tiket Antrean Online' },
            { label: 'Jadwal Poliklinik', href: '/layanan', icon: Clock, desc: '20 Poliklinik Spesialis' },
            { label: 'Tower Directory', href: '/tower', icon: Building2, desc: 'Denah 13 Lantai Gedung' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center justify-center p-4 rounded-xl text-center card-lift press-feedback transition-[color,background-color,box-shadow,transform] duration-150 ${
                  item.alert
                    ? 'bg-alert-50 hover:bg-alert-600 hover:text-ivory text-alert-600 font-bold shadow-sm'
                    : 'bg-tower-50/70 hover:bg-tower-800 hover:text-ivory text-tower-950 font-semibold hover:shadow-md'
                }`}
              >
                <Icon className="w-7 h-7 mb-2" aria-hidden="true" />
                <span className="text-sm font-bold block">{item.label}</span>
                <span className={`text-[11px] hidden sm:block mt-0.5 ${item.alert ? 'text-alert-600 font-semibold' : 'text-ink-soft'}`}>
                  {item.desc}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. SECTION STATUS KETERSEDIAAN KAMAR (BED STATUS WIDGET) */}
      <section aria-label="Ketersediaan Kamar Rawat Inap" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BedStatusWidget />
      </section>

      {/* 4. SECTION LAYANAN MEDIS TERPADU (6 KARTU) */}
      <section aria-label="Layanan Medis Terpadu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-tower-100 pb-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-mono text-gold-700 block mb-1 font-bold">
              Pelayanan Komprehensif
            </span>
            <h2 className="font-display font-bold text-3xl text-tower-900">
              Layanan Medis Terpadu
            </h2>
            <p className="text-ink-soft text-sm mt-1">
              Fasilitas diagnostik dan terapeutik modern berstandar akreditasi paripurna.
            </p>
          </div>

          <Link
            href="/layanan"
            className="inline-flex items-center gap-2 text-sm font-bold text-tower-800 hover:text-tower-600 group shrink-0"
          >
            <span>Lihat Semua Layanan & 20 Poli</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredServices.map((svc) => (
            <div
              key={svc.slug}
              className="bg-white rounded-2xl p-6 border border-tower-100 shadow-sm hover:shadow-md hover:border-tower-700/40 transition-[border-color,box-shadow] duration-150 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-tower-100 text-tower-900 uppercase">
                    {svc.buildingId === 'tower' ? `Tower Lt. ${svc.floor}` : `Graha Lt. ${svc.floor === 0 ? 'Dasar' : svc.floor}`}
                  </span>
                  {svc.open24h && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-alert-50 text-alert-600">
                      24 Jam
                    </span>
                  )}
                </div>

                <h3 className="font-display font-bold text-xl text-tower-900 leading-snug">
                  {svc.name}
                </h3>

                <p className="text-sm text-ink-soft leading-relaxed line-clamp-3">
                  {svc.summary}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-tower-50 flex items-center justify-between">
                <Link
                  href={`/layanan#${svc.slug}`}
                  className="text-xs font-bold text-tower-800 hover:text-tower-600 inline-flex items-center gap-1"
                >
                  <span>Selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href={`/tower?gedung=${svc.buildingId}&lantai=${svc.floor}`}
                  className="text-[11px] text-gold-700 hover:underline font-semibold"
                >
                  Lokasi Gedung &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4B. SECTION PROFIL KOMPLEKS GEDUNG ASLI & DOKUMENTASI FASILITAS */}
      <section aria-label="Profil Gedung Rumah Sakit Asli" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-tower-950 via-tower-900 to-tower-950 rounded-3xl p-6 sm:p-10 border-2 border-gold-500/40 text-ivory shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* FOTO UTAMA ASLI RUMAH SAKIT */}
            <div className="lg:col-span-7">
              <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden border border-gold-500/40 shadow-xl group">
                <Image
                  src="/assets/rsi-ayani.jpg"
                  alt={`Fasad Gedung Asli ${HOSPITAL_FACTS.name}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-tower-950/90 via-transparent to-black/20 pointer-events-none" />
                
                {/* Badge Foto Asli */}
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-tower-950/85 border border-gold-400 text-xs font-bold text-gold-300 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
                  <span>Foto Asli Dokumentasi Gedung</span>
                </div>

                {/* Caption Fasad */}
                <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-tower-950/90 border border-gold-500/30 backdrop-blur-md">
                  <div className="flex items-center justify-between text-xs font-bold text-ivory mb-1">
                    <span>{HOSPITAL_FACTS.name}</span>
                    <span className="text-gold-300 font-mono">Wonokromo, Surabaya</span>
                  </div>
                  <p className="text-xs text-ivory/80 leading-relaxed">
                    Fasad hijau depan: {HOSPITAL_FACTS.buildings.graha.name} & IGD 24 Jam. Fasad belakang: {HOSPITAL_FACTS.buildings.tower.name} 13 Lantai terpadu.
                  </p>
                </div>
              </div>
            </div>

            {/* DETAIL PROFIL & IDENTITAS KOMPLEKS */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-tower-900 border border-gold-500/30 text-xs font-semibold text-gold-300 shadow-md">
                <Building2 className="w-4 h-4 text-gold-400" aria-hidden="true" />
                <span>Dokumentasi Kompleks Fasilitas Medis</span>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-400">
                  Fasilitas Terpadu Jawa Timur
                </span>
                <h3 className="font-display font-bold text-2xl sm:text-3xl text-ivory leading-snug">
                  Integrasi Layanan Modern di Jl. Achmad Yani
                </h3>
                <p className="text-sm text-ivory/80 leading-relaxed">
                  Menghubungkan layanan rawat jalan, instalasi gawat darurat, dan perawatan intensif dalam satu kompleks pelayanan terintegrasi.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                <div className="p-3 rounded-xl bg-tower-900/80 border border-gold-500/30">
                  <span className="block font-bold text-gold-300 text-base mb-0.5">13 Lantai</span>
                  <span className="text-ivory/70">{HOSPITAL_FACTS.buildings.tower.name}</span>
                </div>
                <div className="p-3 rounded-xl bg-tower-900/80 border border-gold-500/30">
                  <span className="block font-bold text-gold-300 text-base mb-0.5">6 Level</span>
                  <span className="text-ivory/70">{HOSPITAL_FACTS.buildings.graha.name}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/tentang"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 active:bg-gold-600 text-tower-950 font-bold text-sm shadow-md transition-[color,background-color,box-shadow] duration-150 group"
                >
                  <span>Eksplorasi Profil & Sejarah</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-150" />
                </Link>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 5. SECTION STRIP FAKTA HISTORIS */}
      <section aria-label="Fakta Historis Rumah Sakit" className="bg-tower-900 text-ivory py-14 border-y border-gold-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
            <div className="space-y-1">
              <span className="font-display font-bold text-3xl sm:text-4xl text-gold-300 block">
                {HOSPITAL_FACTS.foundedYear}
              </span>
              <span className="text-xs text-ivory/80 uppercase tracking-wider block">
                Tahun Berdiri
              </span>
            </div>

            <div className="space-y-1">
              <span className="font-display font-bold text-3xl sm:text-4xl text-gold-300 block">
                {HOSPITAL_FACTS.hospitalClass}
              </span>
              <span className="text-xs text-ivory/80 uppercase tracking-wider block">
                Kelas Rumah Sakit
              </span>
            </div>

            <div className="space-y-1">
              <span className="font-display font-bold text-3xl sm:text-4xl text-gold-300 block">
                {HOSPITAL_FACTS.bedCapacity}
              </span>
              <span className="text-xs text-ivory/80 uppercase tracking-wider block">
                Tempat Tidur
              </span>
            </div>

            <div className="space-y-1">
              <span className="font-display font-bold text-xl sm:text-2xl text-gold-300 block py-1">
                Paripurna
              </span>
              <span className="text-xs text-ivory/80 uppercase tracking-wider block">
                2016 · 2019 · 2022
              </span>
            </div>

            <div className="col-span-2 md:col-span-1 space-y-1">
              <span className="font-display font-bold text-3xl sm:text-4xl text-gold-300 block">
                24 Jam
              </span>
              <span className="text-xs text-ivory/80 uppercase tracking-wider block">
                IGD, Lab, Radiologi, Farmasi
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SECTION TEASER TOWER DIRECTORY */}
      <section aria-label="Eksplorasi Tower Directory" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TowerTeaser />
      </section>

      {/* 7. SECTION CARI DOKTER MINI */}
      <section aria-label="Form Pencarian Cepat Dokter" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <QuickDoctorSearch />
      </section>

      {/* 8. SECTION BUKTI SOSIAL (GOOGLE REVIEWS DENGAN AS OF) */}
      <section aria-label="Ulasan Publik Google" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-8 border border-tower-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1 text-gold-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <h3 className="font-display font-bold text-2xl text-tower-900">
              {ratings.score} dari {ratings.maxScore.toFixed(1)} Bintang
            </h3>
            <p className="text-xs text-ink-soft">
              Berdasarkan akumulasi <strong>{ratings.reviewCount.toLocaleString('id-ID')} ulasan</strong> di profil Google Bisnis.
            </p>
          </div>

          <div className="text-center sm:text-right shrink-0">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-tower-100 text-tower-900">
              Sumber: {ratings.sourceLabel}
            </span>
            <span className="block text-[11px] text-ink-soft mt-1">
              asOf: {ratings.asOf} (Snapshot Verifikasi Publik)
            </span>
          </div>
        </div>
      </section>

      {/* 9. SECTION KONTAK & LOKASI RINGKAS */}
      <section aria-label="Kontak & Lokasi Rumah Sakit" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-ivory rounded-3xl p-8 sm:p-12 border border-tower-100 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs uppercase tracking-widest font-mono text-gold-700 block font-bold">
                Akses Fisik & Fasilitas
              </span>
              <h2 className="font-display font-bold text-3xl text-tower-900">
                Lokasi Strategis di Pusat Surabaya Selatan
              </h2>
              <p className="text-ink text-sm sm:text-base leading-relaxed max-w-2xl">
                Terletak di jalan protokol utama Surabaya ({contact.address}), mudah diakses melalui jalur transportasi umum maupun tol kota. Layanan Instalasi Gawat Darurat dan Farmasi siap melayani 24 jam nonstop.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href={contact.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-tower-800 hover:bg-tower-700 text-ivory font-bold text-sm shadow-md transition-[color,background-color,box-shadow] duration-150 inline-flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Buka Petunjuk Arah Google Maps</span>
                </a>

                <Link
                  href="/kontak"
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-white hover:bg-tower-50 text-tower-900 border border-tower-100 font-bold text-sm shadow-sm transition-[color,background-color,border-color,box-shadow] duration-150 inline-flex items-center gap-2"
                >
                  <span>Info Transportasi & Parkir</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-tower-100 space-y-3">
              <span className="text-xs font-bold text-tower-900 uppercase tracking-wider block border-b border-tower-50 pb-2">
                Layanan 24 Jam Nonstop:
              </span>
              <ul className="text-xs space-y-2 text-ink-soft">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-tower-700" />
                  <span>Instalasi Gawat Darurat (IGD)</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-tower-700" />
                  <span>Laboratorium Terpadu & Bank Darah</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-tower-700" />
                  <span>Radiologi & {HOSPITAL_FACTS.equipment.ctScan}</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-tower-700" />
                  <span>Farmasi / Depo Obat Darurat</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
