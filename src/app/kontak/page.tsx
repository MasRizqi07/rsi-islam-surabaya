import { HOSPITAL_FACTS } from '@/data/facts';
import {
  MapPin,
  PhoneCall,
  Phone,
  ExternalLink,
  Navigation,
  ShieldAlert,
} from 'lucide-react';

export const metadata = {
  title: 'Kontak & Lokasi · Informasi Akses dan Layanan 24 Jam · RS Islam Surabaya A. Yani',
  description: `Alamat lengkap, nomor darurat resmi, ambulans siaga 24 jam, telepon sentral, jam operasional fasilitas 24 jam, dan panduan arah Google Maps ${HOSPITAL_FACTS.name}.`,
  robots: { index: false, follow: false },
};

export default function KontakPage() {
  const { contact, emergency } = HOSPITAL_FACTS;

  return (
    <div className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* 1. HEADER KONTAK */}
      <div className="space-y-3 border-b border-tower-100 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-tower-100 text-tower-900">
          <MapPin className="w-3.5 h-3.5 text-tower-700" />
          <span>Informasi Kontak & Akses Lokasi</span>
        </div>

        <h1 className="font-display font-bold text-3xl sm:text-4xl text-tower-950 tracking-tight">
          Hubungi Kami & Panduan Arah
        </h1>

        <p className="text-ink-soft text-sm sm:text-base max-w-2xl leading-relaxed">
          Kami siap melayani kebutuhan informasi medis Anda. Fasilitas gawat darurat, laboratorium klinis, radiologi, dan farmasi beroperasi penuh 24 jam sehari.
        </p>
      </div>

      {/* 2. KARTU NOMOR DARURAT & SENTRAL (K1 REGISTER DIHORMATI) */}
      <section aria-labelledby="emergency-contacts-heading" className="space-y-4">
        <h2 id="emergency-contacts-heading" className="sr-only">Kontak Darurat dan Sentral Rumah Sakit</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* EMERGENCY CALL */}
          <div className="bg-alert-50/80 rounded-3xl p-6 sm:p-8 border-2 border-alert-600/30 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-alert-600 uppercase tracking-widest">
                  {emergency.callCenterLabel} 24 Jam
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-alert-600 animate-pulse" />
              </div>
              <h3 className="font-display font-bold text-xl text-tower-950">
                Layanan Gawat Darurat
              </h3>
              <p className="text-xs text-ink-soft leading-relaxed">
                Panggilan cepat respon kegawatdaruratan medis langsung terhubung ke pos triase IGD RSIS.
              </p>
            </div>

            <a
              href={emergency.callCenterTel}
              className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-xl bg-alert-600 hover:bg-alert-700 text-ivory font-bold text-sm shadow-md transition-all text-center"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{emergency.callCenterNumber} (Panggil Sekarang)</span>
            </a>
          </div>

          {/* AMBULANS SIAGA */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-tower-100 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-tower-700 uppercase tracking-widest">
                  {emergency.ambulanceLabel} Gawat Darurat
                </span>
                <ShieldAlert className="w-4 h-4 text-tower-700" />
              </div>
              <h3 className="font-display font-bold text-xl text-tower-950">
                Ambulans Transport & Emergency
              </h3>
              <p className="text-xs text-ink-soft leading-relaxed">
                Armada ambulans siaga 24 jam dengan kelengkapan resusitasi dan tim paramedis tersertifikasi.
              </p>
            </div>

            <a
              href={emergency.ambulanceTel}
              className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-xl bg-tower-800 hover:bg-tower-700 text-ivory font-bold text-sm shadow-md transition-all text-center"
            >
              <Phone className="w-4 h-4" />
              <span>{emergency.ambulanceNumber}</span>
            </a>
          </div>

          {/* SENTRAL OPERATOR */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-tower-100 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-tower-700 uppercase tracking-widest">
                  Telepon Sentral
                </span>
                <Phone className="w-4 h-4 text-tower-700" />
              </div>
              <h3 className="font-display font-bold text-xl text-tower-950">
                Informasi & Operator Umum
              </h3>
              <p className="text-xs text-ink-soft leading-relaxed">
                Informasi jadwal poliklinik, konfirmasi rawat inap, dan layanan administrasi terpadu.
              </p>
            </div>

            <a
              href={contact.centralPhoneTel}
              className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-xl bg-ivory hover:bg-tower-100 text-tower-900 font-bold text-sm border border-tower-200 transition-all text-center"
            >
              <Phone className="w-4 h-4" />
              <span>{contact.centralPhone}</span>
            </a>
          </div>

        </div>
      </section>

      {/* 3. LOKASI FISIK & ILUSTRASI PETA SVG MINIMALIS */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-tower-100 shadow-lg space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-tower-100 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-700">
              Akses Transportasi & Gedung
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-tower-950">
              Lokasi Kompleks Rumah Sakit
            </h2>
            <p className="text-xs sm:text-sm text-ink-soft">
              {contact.address}
            </p>
          </div>

          {/* TOMBOL GOOGLE MAPS RESMI (TANPA IFRAME/API KEY SESUAI FR-10) */}
          <a
            href={contact.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 min-h-[48px] px-6 py-3 rounded-xl bg-tower-800 hover:bg-tower-700 active:bg-tower-900 text-ivory font-bold text-sm shadow-md transition-all shrink-0"
          >
            <Navigation className="w-4 h-4" />
            <span>Buka Arah di Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
        </div>

        {/* ILUSTRASI PETA SVG MINIMALIS ARSITEKTURAL */}
        <div className="rounded-2xl border border-tower-200/80 bg-ivory p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between text-xs text-ink-soft">
            <span className="font-bold text-tower-900">Ilustrasi Akses Gerbang Kompleks RSIS</span>
            <span className="font-mono text-[11px]">Koordinat: {contact.coordinates.lat}, {contact.coordinates.lng}</span>
          </div>

          <svg
            viewBox="0 0 800 360"
            className="w-full h-auto rounded-xl bg-white border border-tower-100 shadow-inner"
            role="img"
            aria-label="Peta diagram skematis akses Jl. Achmad Yani ke Gedung Tower dan Gedung Graha RS Islam Surabaya"
          >
            {/* Background Grid */}
            <defs>
              <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#EEF8F6" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="800" height="360" fill="url(#map-grid)" />

            {/* JL. ACHMAD YANI (KORIDOR UTAMA) */}
            <rect x="0" y="270" width="800" height="70" fill="#E2E8F0" />
            <line x1="0" y1="305" x2="800" y2="305" stroke="#FFFFFF" strokeWidth="3" strokeDasharray="12 10" />
            <text x="30" y="312" fill="#475569" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
              JL. ACHMAD YANI SURABAYA (ARAH SELATAN - UTARA)
            </text>

            {/* FRONTAGE ROAD AKSES MASUK */}
            <rect x="0" y="230" width="800" height="30" fill="#CBD5E1" />
            <text x="30" y="250" fill="#334155" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
              FRONTAGE ROAD BARAT &bull; JALUR MASUK RESMI RSIS
            </text>

            {/* BLOK GEDUNG TOWER 13 LANTAI */}
            <rect x="80" y="40" width="280" height="150" rx="12" fill="#0A4F48" stroke="#C9A24A" strokeWidth="2" />
            <text x="100" y="75" fill="#E3CB8A" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
              GEDUNG UTAMA
            </text>
            <text x="100" y="105" fill="#FBF8F1" fontSize="18" fontWeight="bold" fontFamily="sans-serif">
              Gedung Tower (13 Lantai)
            </text>
            <text x="100" y="130" fill="#D6EFEB" fontSize="12" fontFamily="sans-serif">
              &bull; Lt. 2: IGD 24 Jam & Kamar Operasi
            </text>
            <text x="100" y="150" fill="#D6EFEB" fontSize="12" fontFamily="sans-serif">
              &bull; Lt. 3: Laboratorium & Radiologi 24 Jam
            </text>
            <text x="100" y="170" fill="#D6EFEB" fontSize="12" fontFamily="sans-serif">
              &bull; Lt. 4: Perawatan Intensif (ICU/ICCU/HCU)
            </text>

            {/* BLOK GEDUNG GRAHA 6 LEVEL */}
            <rect x="420" y="60" width="300" height="130" rx="12" fill="#063B36" stroke="#D6EFEB" strokeWidth="1.5" />
            <text x="440" y="90" fill="#E3CB8A" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
              GEDUNG RAWAT JALAN & DIREKSI
            </text>
            <text x="440" y="115" fill="#FBF8F1" fontSize="16" fontWeight="bold" fontFamily="sans-serif">
              Gedung Graha (Ground + 5 Lantai)
            </text>
            <text x="440" y="140" fill="#D6EFEB" fontSize="12" fontFamily="sans-serif">
              &bull; Ground: Lobi Utama & 20 Poli Rawat Jalan
            </text>
            <text x="440" y="160" fill="#D6EFEB" fontSize="12" fontFamily="sans-serif">
              &bull; Lt. 1: Unit Hemodialisis 30 Mesin
            </text>

            {/* GERBANG MASUK IGD & DROP OFF */}
            <circle cx="160" cy="215" r="14" fill="#C62F2F" />
            <text x="185" y="220" fill="#C62F2F" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
              Pintu Masuk Darurat IGD 24 Jam
            </text>

            <circle cx="520" cy="215" r="14" fill="#0A4F48" />
            <text x="545" y="220" fill="#0A4F48" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
              Lobi Utama & Pendaftaran Poli
            </text>
          </svg>

          <p className="text-xs text-ink-soft leading-relaxed">
            * Kompleks RS Islam Surabaya A. Yani berlokasi sangat strategis di jalur protokol Jalan Achmad Yani, bersebelahan dengan akses Frontage Road Wonokromo dan mudah dijangkau oleh transportasi publik maupun ambulans darurat.
          </p>
        </div>
      </section>

      {/* 4. FASILITAS OPERASIONAL 24 JAM */}
      <section className="space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-700">
            Kesiapsiagaan Penuh
          </span>
          <h2 className="font-display font-bold text-2xl text-tower-950">
            Instalasi Penunjang Medis Buka 24 Jam
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-tower-100 shadow-sm space-y-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-alert-50 text-alert-600 border border-alert-600/30">
              Emergency 24 Jam
            </span>
            <h3 className="font-display font-bold text-base text-tower-950">
              Instalasi Gawat Darurat (IGD)
            </h3>
            <p className="text-xs text-ink-soft leading-relaxed">
              Tower Lantai 2 &bull; Pelayanan trauma, resusitasi, dan bedah darurat non-stop.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-tower-100 shadow-sm space-y-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-tower-100 text-tower-900 border border-tower-600/20">
              Diagnostik 24 Jam
            </span>
            <h3 className="font-display font-bold text-base text-tower-950">
              Laboratorium Terpadu
            </h3>
            <p className="text-xs text-ink-soft leading-relaxed">
              Tower Lantai 3 &bull; Patologi klinik, mikrobiologi, dan bank darah 24 jam.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-tower-100 shadow-sm space-y-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-tower-100 text-tower-900 border border-tower-600/20">
              Pencitraan 24 Jam
            </span>
            <h3 className="font-display font-bold text-base text-tower-950">
              Instalasi Radiologi
            </h3>
            <p className="text-xs text-ink-soft leading-relaxed">
              Tower Lantai 3 &bull; CT-Scan 128 Slice, Rontgen Cito, dan USG Darurat.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-tower-100 shadow-sm space-y-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-tower-100 text-tower-900 border border-tower-600/20">
              Farmasi 24 Jam
            </span>
            <h3 className="font-display font-bold text-base text-tower-950">
              Depo Farmasi IGD & Rawat Inap
            </h3>
            <p className="text-xs text-ink-soft leading-relaxed">
              Penyediaan obat darurat dan terapi farmasi rawat inap berkesinambungan.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
