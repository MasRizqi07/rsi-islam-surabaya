import Image from 'next/image';
import { HOSPITAL_FACTS } from '@/data/facts';
import {
  MapPin,
  PhoneCall,
  Phone,
  ExternalLink,
  Navigation,
  ShieldAlert,
  Clock,
  Ambulance,
  Camera,
  Compass,
} from 'lucide-react';

export const metadata = {
  title: `Kontak & Akses Menuju Rumah Sakit · ${HOSPITAL_FACTS.name}`,
  description: `Alamat lengkap, nomor darurat resmi, armada ambulans, sentral telepon, matriks fasilitas 24 jam, dan peta arsitektural kompleks ${HOSPITAL_FACTS.name}.`,
  robots: { index: false, follow: false },
};

export default function KontakPage() {
  const { contact, emergency, social } = HOSPITAL_FACTS;

  return (
    <div className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* 1. HEADER KONTAK */}
      <div className="space-y-4 border-b border-tower-100 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-tower-100 text-tower-900 border border-tower-600/20">
          <MapPin className="w-3.5 h-3.5 text-tower-700" />
          <span>Informasi Akses & Sentral Komunikasi 24 Jam</span>
        </div>

        <h1 className="font-display font-bold text-3xl sm:text-5xl text-tower-950 tracking-tight">
          Kontak & Akses Menuju Rumah Sakit
        </h1>

        <p className="text-ink-soft text-sm sm:text-base max-w-3xl leading-relaxed">
          Pusat komando komunikasi medis, rujukan gawat darurat, dan panduan sirkulasi gerbang kompleks {HOSPITAL_FACTS.buildings.tower.name} & Graha {HOSPITAL_FACTS.name}.
        </p>
      </div>

      {/* 2. TWO-COLUMN LAYOUT (5 COLS / 7 COLS FROM STITCH) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: DUAL EMERGENCY + SENTRAL + 24H STATUS (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* DUAL EMERGENCY CONTACT CARDS (K1 COMPLIANCE) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest font-bold text-alert-600 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-alert-600 animate-pulse" />
                Jalur Cepat Gawat Darurat
              </span>
              <span className="text-xs font-semibold text-ink-soft">Prioritas Triase 24 Jam</span>
            </div>

            {/* Emergency Call Center */}
            <div className="bg-alert-600 text-white rounded-3xl p-6 shadow-lg relative overflow-hidden group">
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-6 h-6 text-white" />
                  <span className="font-bold text-xs uppercase tracking-wider text-white">
                    {emergency.callCenterLabel}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-white text-alert-600 uppercase tracking-widest">
                  Respon Cepat
                </span>
              </div>

              <div className="mt-4 relative z-10 space-y-3">
                <p className="text-xs text-white leading-relaxed font-medium">
                  Triase klinis segera untuk henti napas/jantung, trauma kecelakaan berat, stroke cito, dan kegawatan kritis.
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-white block">Hunting Bebas Pulsa</span>
                    <span className="font-display font-black text-2xl text-white tracking-wide">
                      {emergency.callCenterNumber}
                    </span>
                  </div>

                  <a
                    href={emergency.callCenterTel}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-ivory text-alert-600 font-bold text-xs shadow-md hover:bg-gold-100 press-feedback transition-[color,background-color,box-shadow,transform] duration-150 shrink-0"
                  >
                    <PhoneCall className="w-4 h-4 animate-pulse" />
                    <span>Panggil Sekarang</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Ambulance Dispatch */}
            <div className="bg-tower-900 text-ivory rounded-3xl p-6 shadow-md border border-tower-800 relative overflow-hidden group">
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <Ambulance className="w-6 h-6 text-gold-300" />
                  <span className="font-bold text-xs uppercase tracking-wider text-gold-300">
                    {emergency.ambulanceLabel} Medevac
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-tower-800 text-gold-300 border border-gold-500/30">
                  Siaga 24 Jam
                </span>
              </div>

              <div className="mt-4 relative z-10 space-y-3">
                <p className="text-xs text-tower-100 leading-relaxed">
                  Penjemputan pasien kritis di seluruh wilayah Surabaya dan rujukan luar kota dengan kelengkapan life-support.
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-tower-200 block">Hotline Ambulans</span>
                    <span className="font-display font-bold text-xl text-gold-300 tracking-wide">
                      {emergency.ambulanceNumber}
                    </span>
                  </div>

                  <a
                    href={emergency.ambulanceTel}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gold-500 text-tower-950 font-bold text-xs shadow-md hover:bg-gold-300 press-feedback transition-[color,background-color,box-shadow,transform] duration-150 shrink-0"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Hubungi Armada</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* GENERAL COMMUNICATION HUB */}
          <div className="bg-white rounded-3xl p-6 border border-tower-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-tower-100">
              <Phone className="w-5 h-5 text-tower-800" />
              <div>
                <h3 className="font-display font-bold text-base text-tower-950">
                  Sentral Komunikasi & Informasi
                </h3>
                <span className="text-[11px] text-ink-soft">Layanan administrasi, rawat jalan, dan admisi</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              {/* Telepon Sentral */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-tower-50/70">
                <Phone className="w-4 h-4 text-tower-700 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider block">Sentral Telepon / Hunting</span>
                  <a
                    href={contact.centralPhoneTel}
                    className="font-bold text-sm text-tower-950 hover:underline block truncate mt-0.5"
                  >
                    {contact.centralPhone}
                  </a>
                  <span className="text-[11px] text-ink-soft block mt-0.5">Operator siaga menghubungkan ke 20 poliklinik & instalasi</span>
                </div>
              </div>

              {/* Instagram Resmi K7 */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-tower-50/70">
                <Camera className="w-4 h-4 text-tower-700 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider block">Instagram Resmi RSIS (K7)</span>
                  <div className="flex items-center justify-between mt-0.5">
                    <a
                      href={social.instagram.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-sm text-tower-900 hover:underline flex items-center gap-1"
                    >
                      <span>{social.instagram.handle}</span>
                      <ExternalLink className="w-3 h-3 text-gold-700" />
                    </a>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-tower-100 text-tower-900">
                      Saluran Resmi
                    </span>
                  </div>
                  <span className="text-[11px] text-ink-soft block mt-0.5">{social.instagram.followers}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 24-HOUR OPERATIONAL STATUS MATRIX */}
          <div className="bg-white rounded-3xl p-6 border border-tower-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-tower-100">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-tower-800" />
                <h3 className="font-display font-bold text-base text-tower-950">
                  Matriks Layanan 24 Jam Nonstop
                </h3>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                Live 24 Jam
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-ivory">
                <span className="font-bold text-tower-950">Instalasi Gawat Darurat (IGD)</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-alert-50 text-alert-600 border border-alert-600/30">
                  Tower Lt. 2 · Buka 24 Jam
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-ivory">
                <span className="font-bold text-tower-950">Depo Farmasi IGD & Rawat Inap</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-tower-100 text-tower-900 border border-tower-600/20">
                  Buka 24 Jam
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-ivory">
                <span className="font-bold text-tower-950">Laboratorium Patologi 24 Jam</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-tower-100 text-tower-900 border border-tower-600/20">
                  Tower Lt. 3 · Buka 24 Jam
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-ivory">
                <span className="font-bold text-tower-950">Radiologi & {HOSPITAL_FACTS.equipment.ctScan}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-tower-100 text-tower-900 border border-tower-600/20">
                  Tower Lt. 3 · Buka 24 Jam
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-ivory">
                <span className="font-bold text-tower-950">Armada Ambulans Medevac</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gold-100 text-tower-950 border border-gold-400/40">
                  Siaga 24 Jam
                </span>
              </div>
            </div>
          </div>

          {/* PHYSICAL ADDRESS & REAL BUILDING PHOTO CARD */}
          <div className="bg-white rounded-3xl p-6 border border-tower-100 shadow-sm space-y-4 text-xs">
            <div className="flex items-center gap-2 text-tower-900 font-bold">
              <Compass className="w-4 h-4 text-gold-700" />
              <span>Alamat Fisik & Fasad Gedung</span>
            </div>

            {/* FOTO FASAD ASLI UNTUK PANDUAN KEDATANGAN */}
            <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-tower-200 shadow-inner group">
              <Image
                src="/assets/rsi-ayani.jpg"
                alt={`Fasad Gedung ${HOSPITAL_FACTS.name}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 1024px) 100vw, 400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-tower-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-[11px] font-bold">
                <span>Fasad {HOSPITAL_FACTS.buildings.graha.name} & {HOSPITAL_FACTS.buildings.tower.name}</span>
                <span className="px-2 py-0.5 rounded bg-tower-900/90 text-gold-300 border border-gold-500/40 text-[10px]">Foto Asli</span>
              </div>
            </div>

            <p className="font-semibold text-tower-950 text-sm">
              {contact.address}
            </p>
            <p className="text-ink-soft leading-relaxed">
              Patokan: 500 meter di sebelah selatan Stasiun Wonokromo, di sisi Frontage Road Timur Jl. Achmad Yani.
            </p>
          </div>

        </div>

        {/* RIGHT COLUMN: ARCHITECTURAL VECTOR SVG MAP (7 COLS FROM STITCH) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-tower-100 shadow-xl space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-tower-100 pb-5">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-700 block mb-1">
                  Peta Akses Arsitektural Vektor
                </span>
                <h2 className="font-display font-bold text-xl sm:text-2xl text-tower-950">
                  Sirkulasi & Zonasi Kompleks Graha RSI
                </h2>
              </div>

              <div className="flex items-center gap-2 text-xs text-ink-soft shrink-0">
                <span className="inline-flex items-center gap-1 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-tower-800" /> Tower
                </span>
                <span className="inline-flex items-center gap-1 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-tower-700" /> Graha
                </span>
                <span className="inline-flex items-center gap-1 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-alert-600" /> IGD
                </span>
              </div>
            </div>

            {/* HIGH-FIDELITY ARCHITECTURAL VECTOR SVG MAP */}
            <div className="relative w-full rounded-2xl overflow-hidden bg-tower-50 p-2 border border-tower-200/80 shadow-inner">
              <svg
                viewBox="0 0 880 600"
                className="w-full h-auto aspect-[16/11] select-none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label={`Peta diagram skematis akses Jl. Achmad Yani & sirkulasi kompleks ${HOSPITAL_FACTS.name}`}
              >
                <defs>
                  <pattern id="archGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--color-tower-900)" strokeOpacity="0.08" strokeWidth="0.3" />
                  </pattern>
                  <linearGradient id="towerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--color-tower-950)" />
                    <stop offset="100%" stopColor="var(--color-tower-800)" />
                  </linearGradient>
                  <linearGradient id="grahaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--color-tower-900)" />
                    <stop offset="100%" stopColor="var(--color-tower-700)" />
                  </linearGradient>
                  <linearGradient id="skybridgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--color-gold-700)" />
                    <stop offset="100%" stopColor="var(--color-gold-500)" />
                  </linearGradient>
                </defs>

                {/* Base Grid */}
                <rect width="880" height="600" fill="var(--color-tower-50)" />
                <rect width="880" height="600" fill="url(#archGrid)" />

                {/* WEST: RAILROAD (JALUR REL KERETA WONOKROMO) */}
                <g id="railroad" opacity="0.85">
                  <rect x="25" y="0" width="36" height="600" fill="var(--color-tower-100)" />
                  <line x1="37" y1="0" x2="37" y2="600" stroke="var(--color-ink-soft)" strokeWidth="2" />
                  <line x1="49" y1="0" x2="49" y2="600" stroke="var(--color-ink-soft)" strokeWidth="2" />
                  <path
                    d="M29 20h28 M29 60h28 M29 100h28 M29 140h28 M29 180h28 M29 220h28 M29 260h28 M29 300h28 M29 340h28 M29 380h28 M29 420h28 M29 460h28 M29 500h28 M29 540h28 M29 580h28"
                    stroke="var(--color-ink-soft)"
                    strokeWidth="1.8"
                  />
                  <rect x="15" y="16" width="56" height="74" rx="4" fill="white" stroke="var(--color-ink-soft)" strokeWidth="1" />
                  <text x="43" y="44" textAnchor="middle" fill="var(--color-tower-950)" fontSize="10" fontWeight="700" fontFamily="sans-serif">
                    STASIUN
                  </text>
                  <text x="43" y="58" textAnchor="middle" fill="var(--color-gold-700)" fontSize="9" fontWeight="600" fontFamily="sans-serif">
                    WONOKROMO
                  </text>
                  <text x="43" y="74" textAnchor="middle" fill="var(--color-ink-soft)" fontSize="8" fontFamily="sans-serif">
                    ± 500m Utara
                  </text>
                </g>

                {/* MAIN THOROUGHFARE: JL. ACHMAD YANI */}
                <g id="main-road">
                  <rect x="95" y="0" width="110" height="600" fill="var(--color-tower-100)" />
                  <line x1="150" y1="0" x2="150" y2="600" stroke="white" strokeWidth="2.5" strokeDasharray="14 10" />
                  <text
                    x="145"
                    y="520"
                    transform="rotate(-90 145 520)"
                    fill="var(--color-ink-soft)"
                    fontSize="13"
                    fontWeight="700"
                    letterSpacing="3"
                    fontFamily="sans-serif"
                  >
                    JL. ACHMAD YANI (KORIDOR UTAMA)
                  </text>
                </g>

                {/* MEDIAN GREEN BELT */}
                <rect x="205" y="0" width="16" height="600" fill="var(--color-tower-700)" opacity="0.4" />

                {/* FRONTAGE ROAD TIMUR */}
                <g id="frontage-road">
                  <rect x="221" y="0" width="75" height="600" fill="var(--color-tower-50)" />
                  <line x1="258" y1="0" x2="258" y2="600" stroke="white" strokeWidth="2" strokeDasharray="10 8" />
                  <text
                    x="252"
                    y="500"
                    transform="rotate(-90 252 500)"
                    fill="var(--color-tower-800)"
                    fontSize="10"
                    fontWeight="700"
                    letterSpacing="2"
                    fontFamily="sans-serif"
                  >
                    FRONTAGE ROAD TIMUR
                  </text>
                </g>

                {/* GATES ON FRONTAGE */}
                <g id="gate-entry">
                  <circle cx="296" cy="190" r="14" fill="var(--color-tower-800)" />
                  <path d="M291 190h10m-3 -3l3 3-3 3" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <rect x="316" y="176" width="94" height="26" rx="4" fill="white" stroke="var(--color-tower-800)" strokeWidth="1.2" />
                  <text x="363" y="193" textAnchor="middle" fill="var(--color-tower-800)" fontSize="9.5" fontWeight="700" fontFamily="sans-serif">
                    GERBANG MASUK
                  </text>
                </g>

                <g id="gate-emergency">
                  <circle cx="296" cy="380" r="14" fill="var(--color-alert-600)" />
                  <path d="M291 380h10m-3 -3l3 3-3 3" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <rect x="316" y="366" width="104" height="26" rx="4" fill="white" stroke="var(--color-alert-600)" strokeWidth="1.2" />
                  <text x="368" y="383" textAnchor="middle" fill="var(--color-alert-600)" fontSize="9" fontWeight="700" fontFamily="sans-serif">
                    RAMP KHUSUS IGD
                  </text>
                </g>

                <g id="gate-exit">
                  <circle cx="296" cy="520" r="14" fill="var(--color-ink-soft)" />
                  <path d="M301 520h-10m3 -3l-3 3 3 3" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <rect x="316" y="506" width="94" height="26" rx="4" fill="white" stroke="var(--color-ink-soft)" strokeWidth="1.2" />
                  <text x="363" y="523" textAnchor="middle" fill="var(--color-ink-soft)" fontSize="9.5" fontWeight="700" fontFamily="sans-serif">
                    GERBANG KELUAR
                  </text>
                </g>

                {/* HOSPITAL PERIMETER */}
                <rect x="420" y="30" width="440" height="540" rx="16" fill="white" stroke="var(--color-tower-700)" strokeWidth="1.5" strokeDasharray="6 4" />

                {/* DRIVEWAY */}
                <path d="M305 190 Q440 190 440 240 L440 460 Q440 520 305 520" fill="none" stroke="var(--color-tower-100)" strokeWidth="24" strokeLinecap="round" />
                <path d="M305 380 L500 380" stroke="var(--color-alert-50)" strokeWidth="16" strokeLinecap="round" />
                <path d="M305 380 L500 380" stroke="var(--color-alert-600)" strokeWidth="2" strokeDasharray="4 4" />

                {/* GEDUNG GRAHA */}
                <g id="building-graha">
                  <rect x="490" y="65" width="200" height="170" rx="10" fill="url(#grahaGrad)" />
                  <rect x="505" y="80" width="170" height="22" rx="3" fill="white" fillOpacity="0.15" />
                  <rect x="505" y="110" width="170" height="22" rx="3" fill="white" fillOpacity="0.15" />
                  <rect x="505" y="140" width="170" height="22" rx="3" fill="white" fillOpacity="0.15" />
                  <text x="590" y="188" textAnchor="middle" fill="white" fontSize="15" fontWeight="700" fontFamily="serif">
                    GEDUNG GRAHA
                  </text>
                  <text x="590" y="206" textAnchor="middle" fill="var(--color-tower-100)" fontSize="10" fontWeight="600" fontFamily="sans-serif">
                    Lobi Utama · 20 Poliklinik
                  </text>
                  <text x="590" y="222" textAnchor="middle" fill="var(--color-tower-50)" fontSize="8.5" fontFamily="sans-serif">
                    Pendaftaran BPJS & Umum · Kasir
                  </text>
                </g>

                {/* GEDUNG TOWER */}
                <g id="building-tower">
                  <rect x="490" y="325" width="200" height="220" rx="10" fill="url(#towerGrad)" />
                  <path d="M505 345h170 M505 365h170 M505 385h170 M505 405h170 M505 425h170 M505 445h170 M505 465h170" stroke="var(--color-tower-100)" strokeOpacity="0.3" strokeWidth="1" />
                  <rect x="540" y="338" width="100" height="18" rx="9" fill="var(--color-gold-700)" />
                  <text x="590" y="350" textAnchor="middle" fill="var(--color-gold-100)" fontSize="9" fontWeight="700" fontFamily="sans-serif">
                    TOWER 13 LANTAI
                  </text>
                  <text x="590" y="490" textAnchor="middle" fill="white" fontSize="16" fontWeight="700" fontFamily="serif">
                    GEDUNG TOWER
                  </text>
                  <text x="590" y="510" textAnchor="middle" fill="var(--color-tower-100)" fontSize="10.5" fontWeight="600" fontFamily="sans-serif">
                    IGD 24 Jam · Farmasi · Rawat Inap
                  </text>
                  <text x="590" y="528" textAnchor="middle" fill="white" fontSize="9" fontFamily="sans-serif">
                    ICU · Laboratorium · Radiologi 24H
                  </text>

                  {/* Dedicated Drop-off zone at Tower base */}
                  <rect x="445" y="360" width="35" height="40" rx="4" fill="var(--color-alert-600)" />
                  <text x="462" y="384" textAnchor="middle" fill="white" fontSize="9" fontWeight="700" fontFamily="sans-serif">
                    IGD
                  </text>
                </g>

                {/* SKYBRIDGE */}
                <g id="skybridge">
                  <rect x="560" y="235" width="60" height="90" rx="6" fill="url(#skybridgeGrad)" stroke="var(--color-gold-700)" strokeWidth="1.5" />
                  <line x1="570" y1="245" x2="570" y2="315" stroke="white" strokeWidth="1.5" />
                  <line x1="590" y1="245" x2="590" y2="315" stroke="white" strokeWidth="1.5" />
                </g>
              </svg>
            </div>

            {/* ACTION BUTTON TO GOOGLE MAPS */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="space-y-0.5 text-xs text-ink-soft">
                <span className="font-bold text-tower-950 block">Koordinat GPS Presisi:</span>
                <span>Latitude {contact.coordinates.lat}, Longitude {contact.coordinates.lng}</span>
              </div>

              <a
                href={contact.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-tower-800 hover:bg-tower-700 text-ivory font-bold text-xs shadow-md transition-[color,background-color,box-shadow] duration-150 shrink-0"
              >
                <Navigation className="w-4 h-4" />
                <span>Buka Arah di Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
