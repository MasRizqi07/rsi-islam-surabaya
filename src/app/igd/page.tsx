import Image from 'next/image';
import { HOSPITAL_FACTS } from '@/data/facts';
import {
  PhoneCall,
  Ambulance,
  MapPin,
  ShieldAlert,
  Building2,
  Clock,
  Activity,
  HeartPulse,
  Flame,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export const metadata = {
  title: `${HOSPITAL_FACTS.emergency.title} · ${HOSPITAL_FACTS.name}`,
  description: `Layanan kegawatdaruratan medis 24 jam dengan sertifikasi ATLS/ACLS, armada ambulans emergency, dan depo farmasi terpadu satu lantai di ${HOSPITAL_FACTS.buildings.tower.name} Lantai 2.`,
  robots: { index: false, follow: false },
};

export default function IgdPage() {
  const { emergency, contact } = HOSPITAL_FACTS;

  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      
      {/* 1. EMERGENCY COMMAND HERO (ABOVE-THE-FOLD PRECISE LAYOUT) */}
      <section
        id="hero-igd"
        className="relative w-full bg-tower-950 text-ivory overflow-hidden border-b-4 border-gold-500 shadow-xl"
        style={{ backgroundColor: '#04231F' }}
      >
        {/* Fasad Asli Gedung Latar Atmosferik */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
          <Image
            src="/assets/rsi-ayani.jpg"
            alt=""
            fill
            className="object-cover object-center mix-blend-luminosity brightness-75 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-tower-950 via-tower-950/90 to-tower-950/80" />
        </div>

        {/* Ambient radial lighting */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 80% 20%, rgba(198, 47, 47, 0.25) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(15, 107, 97, 0.3) 0%, transparent 60%)',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6 sm:pt-8 sm:pb-12 space-y-4 sm:space-y-6">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-alert-600/20 border border-alert-600/40 text-ivory text-[10px] sm:text-xs font-bold uppercase tracking-wider">
            <span className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5">
              <span className="relative inline-flex rounded-full h-full w-full bg-alert-600 shadow-[0_0_6px_rgba(198,47,47,0.9)]" />
            </span>
            <span className="text-ivory font-extrabold tracking-wide">
              INSTALASI GAWAT DARURAT (IGD) SIAGA 24 JAM · BUKA HARI LIBUR & TANGGAL MERAH
            </span>
          </div>

          {/* Headline & Location */}
          <div className="space-y-1.5 sm:space-y-2 max-w-3xl">
            <h1 className="font-display font-extrabold text-2xl sm:text-4xl lg:text-5xl text-ivory leading-tight tracking-tight">
              Penanganan Medis Cepat, Tepat & Terpadu Satu Lantai
            </h1>
            <p className="text-xs sm:text-sm text-gold-300 font-medium flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
              <span>
                Lokasi Fisik: <strong>{HOSPITAL_FACTS.buildings.tower.name} Lantai 2</strong> · {contact.address} (Akses Khusus Drop-Off Ambulans & Ramp Mandiri)
              </span>
            </p>
          </div>

          {/* 3 PRIMARY TOUCH TARGETS (MIN HEIGHT 56PX, WCAG HIGH CONTRAST) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {/* CTA 1: Emergency Call Center */}
            <a
              href={emergency.callCenterTel}
              className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-alert-600 text-white hover:bg-alert-600/90 active:scale-95 transition-all shadow-lg border border-alert-600 min-h-[56px] group"
              aria-label={`Hubungi ${emergency.callCenterLabel} di nomor ${emergency.callCenterNumber}`}
            >
              <div className="space-y-0.5">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-white">
                  {emergency.callCenterLabel} 24 Jam
                </span>
                <span className="font-display font-black text-xl sm:text-2xl text-white tracking-wide block">
                  {emergency.callCenterNumber}
                </span>
                <span className="text-[11px] text-white block hidden sm:block">
                  Sambungan Langsung Komando Medis
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                <PhoneCall className="w-5 h-5 animate-pulse" />
              </div>
            </a>

            {/* CTA 2: Ambulance Dispatch */}
            <a
              href={emergency.ambulanceTel}
              className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-ivory text-tower-950 hover:bg-gold-100 active:scale-95 transition-all shadow-lg border-2 border-gold-400 min-h-[56px] group"
              aria-label={`Panggil ${emergency.ambulanceLabel} di nomor ${emergency.ambulanceNumber}`}
            >
              <div className="space-y-0.5">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-tower-800">
                  {emergency.ambulanceLabel} Reaksi Cepat
                </span>
                <span className="font-display font-black text-lg sm:text-xl text-tower-950 tracking-wide block">
                  {emergency.ambulanceNumber}
                </span>
                <span className="text-[11px] text-ink-soft block hidden sm:block">
                  Armada Evakuasi Medevac Siaga
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-tower-100 flex items-center justify-center text-alert-600 shrink-0 group-hover:scale-110 transition-transform">
                <Ambulance className="w-5 h-5" />
              </div>
            </a>

            {/* CTA 3: Google Maps Navigation */}
            <a
              href={contact.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-tower-900 text-ivory hover:bg-tower-800 active:scale-95 transition-all shadow-md border border-gold-500/30 min-h-[56px] group"
            >
              <div className="space-y-0.5">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-gold-300">
                  Ramp Drop-Off Tower Lt. 2
                </span>
                <span className="font-bold text-sm sm:text-base text-ivory flex items-center gap-1">
                  <span>Buka di Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 text-gold-400" />
                </span>
                <span className="text-[11px] text-tower-100 block hidden sm:block">
                  Wonokromo, Surabaya (Akses Timur)
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-tower-800 flex items-center justify-center text-gold-400 shrink-0 group-hover:scale-110 transition-transform">
                <MapPin className="w-5 h-5" />
              </div>
            </a>
          </div>

          {/* Quick Key Highlights Strip */}
          <div className="pt-3 border-t border-tower-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-tower-100">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-gold-400 shrink-0" />
              <span>Dokter & Perawat Bersertifikasi ATLS & ACLS</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold-400 shrink-0" />
              <span>Skrining Triase Cepat & Respon Mulai 0 Menit</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gold-400 shrink-0" />
              <span>Lift Pasien Kritis Langsung Menuju Lab & CT-Scan Lt. 3</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. SECTION: 4-COLOR CLINICAL TRIAGE GUIDE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs uppercase tracking-widest font-mono text-gold-700 font-bold block">
            Standar Klinis Keselamatan Pasien
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-tower-950">
            Sistem Triase Prioritas Medis Gawat Darurat
          </h2>
          <p className="text-ink-soft text-sm sm:text-base leading-relaxed">
            Urutan penanganan pasien di IGD {HOSPITAL_FACTS.name} ditentukan secara ketat berdasarkan <strong>tingkat keparahan ancaman jiwa dan kestabilan tanda vital</strong>, bukan berdasarkan urutan kedatangan di loket pendaftaran.
          </p>
        </div>

        {/* 4-Color Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Prioritas 1: Merah */}
          <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-tower-100 border-t-4 border-t-alert-600">
            <div className="p-4 bg-alert-600 text-white space-y-1">
              <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-white">
                <span>Kategori Merah</span>
                <HeartPulse className="w-4 h-4" />
              </div>
              <div className="font-display font-bold text-lg text-white">
                PRIORITAS 1 · KRITIS
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-alert-50 text-alert-600 font-bold text-xs">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Respon: Seketika (0 Menit)</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-ink-soft uppercase tracking-wider block mb-1">
                    Kriteria Klinis:
                  </span>
                  <p className="text-xs text-ink leading-relaxed">
                    Henti jantung/napas, trauma kepala berat, perdarahan hebat tak terkontrol, syok anafilaktik, atau serangan jantung akut (STEMI).
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-tower-50">
                <span className="text-[11px] font-bold text-tower-900 block mb-0.5">Jalur Tindakan:</span>
                <p className="text-xs text-ink-soft">
                  Langsung dialihkan ke <strong>Ruang Resusitasi Terpadu</strong> dengan tim dokter multi-disiplin.
                </p>
              </div>
            </div>
          </div>

          {/* Prioritas 2: Kuning */}
          <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-tower-100 border-t-4 border-t-amber-800">
            <div className="p-4 bg-amber-900 text-white space-y-1">
              <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-white">
                <span>Kategori Kuning</span>
                <Flame className="w-4 h-4 text-amber-200" />
              </div>
              <div className="font-display font-bold text-lg text-white">
                PRIORITAS 2 · MENDESAK
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gold-100 text-tower-950 font-bold text-xs border border-gold-300">
                  <Clock className="w-3.5 h-3.5 text-tower-900" />
                  <span>Respon: &lt; 15 Menit</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-ink-soft uppercase tracking-wider block mb-1">
                    Kriteria Klinis:
                  </span>
                  <p className="text-xs text-ink leading-relaxed">
                    Patah tulang terbuka/tertutup stabil, demam tinggi disertai kejang reda, nyeri dada sedang tanpa syok, luka bakar grade 2 sedang, sesak napas sedang.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-tower-50">
                <span className="text-[11px] font-bold text-tower-900 block mb-0.5">Jalur Tindakan:</span>
                <p className="text-xs text-ink-soft">
                  Penanganan intensif di <strong>Ruang Tindakan Bedah / Non-Bedah IGD</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Prioritas 3: Hijau */}
          <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-tower-100 border-t-4 border-t-tower-700">
            <div className="p-4 bg-tower-800 text-ivory space-y-1">
              <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-white">
                <span>Kategori Hijau</span>
                <CheckCircle2 className="w-4 h-4 text-tower-100" />
              </div>
              <div className="font-display font-bold text-lg text-white">
                PRIORITAS 3 · TIDAK GAWAT
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-tower-50 text-tower-800 font-bold text-xs border border-tower-100">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Respon: &lt; 60 Menit</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-ink-soft uppercase tracking-wider block mb-1">
                    Kriteria Klinis:
                  </span>
                  <p className="text-xs text-ink leading-relaxed">
                    Luka lecet ringan tanpa perdarahan masif, demam batuk pilek tanpa sesak napas, nyeri perut ringan, diare tanpa tanda dehidrasi berat.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-tower-50">
                <span className="text-[11px] font-bold text-tower-900 block mb-0.5">Jalur Tindakan:</span>
                <p className="text-xs text-ink-soft">
                  Penanganan observasi rawat jalan di <strong>Poliklinik Darurat IGD</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Prioritas 0: Hitam */}
          <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-tower-100 border-t-4 border-t-stone-800">
            <div className="p-4 bg-stone-900 text-ivory space-y-1">
              <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-white">
                <span>Kategori Hitam</span>
                <ShieldAlert className="w-4 h-4 text-stone-400" />
              </div>
              <div className="font-display font-bold text-lg text-white">
                PRIORITAS 0 · DOA
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 font-bold text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verifikasi Medis Segera</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-ink-soft uppercase tracking-wider block mb-1">
                    Kriteria Klinis:
                  </span>
                  <p className="text-xs text-ink leading-relaxed">
                    Pasien tiba dalam keadaan tanda-tanda vital henti permanen (Death on Arrival) yang diverifikasi legal dan klinis oleh dokter jaga.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-tower-50">
                <span className="text-[11px] font-bold text-tower-900 block mb-0.5">Jalur Tindakan:</span>
                <p className="text-xs text-ink-soft">
                  Pendampingan rohani Islam santun & integrasi ke <strong>Pemulasaran Jenazah Syariah</strong>.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. SECTION: ONE-FLOOR INTEGRATED ECOSYSTEM (TOWER LT. 2) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-tower-50/70 rounded-3xl p-6 sm:p-10 border border-tower-100 space-y-8">
          
          <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs uppercase tracking-widest font-mono text-gold-700 font-bold block">
                Arsitektur Medis Satu Lantai
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-tower-950">
                Alur Penanganan Terpadu {HOSPITAL_FACTS.buildings.tower.name} Lantai 2
              </h2>
              <p className="text-ink-soft text-sm leading-relaxed">
                Karakteristik utama {HOSPITAL_FACTS.buildings.tower.name} RSIS A. Yani adalah pengintegrasian seluruh titik kritis pelayanan gawat darurat dalam satu lantai yang terhubung langsung. Pasien tidak perlu dipindahkan antar gedung di saat-saat paling genting.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-tower-100 shadow-sm space-y-2 max-w-sm shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-tower-100 text-tower-800 flex items-center justify-center font-bold">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-tower-950">CT-Scan & Laboratorium</h3>
                  <span className="text-xs text-ink-soft">Lift Kritis Langsung (Lantai 3)</span>
                </div>
              </div>
              <p className="text-xs text-ink-soft leading-normal">
                Waktu transfer menuju diagnostik radiologi terakreditasi berlangsung dalam &lt; 90 detik via koridor tertutup bertekanan steril.
              </p>
            </div>
          </div>

          {/* 4 Flow Sequence Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            
            <div className="bg-white p-5 rounded-2xl border border-tower-100 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-full bg-tower-800 text-ivory font-bold flex items-center justify-center text-sm">
                1
              </div>
              <h4 className="font-bold text-sm text-tower-950">Akses Ramp Drop-off & Triase</h4>
              <p className="text-xs text-ink-soft leading-relaxed">
                Tanjakan khusus ambulans dan mobil keluarga langsung menghantarkan ke depan pintu otomatis IGD Lantai 2. Skrining seketika oleh perawat triase.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-tower-100 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-full bg-tower-800 text-ivory font-bold flex items-center justify-center text-sm">
                2
              </div>
              <h4 className="font-bold text-sm text-tower-950">Ruang Tindakan & Resusitasi</h4>
              <p className="text-xs text-ink-soft leading-relaxed">
                Dilengkapi central bedside monitor, defibrilator canggih, ventilator darurat, dan oksigen sentral. Tim dokter ATLS/ACLS siaga penuh.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-tower-100 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-full bg-tower-800 text-ivory font-bold flex items-center justify-center text-sm">
                3
              </div>
              <h4 className="font-bold text-sm text-tower-950">Depo Farmasi & Admisi Satu Atap</h4>
              <p className="text-xs text-ink-soft leading-relaxed">
                Depo obat darurat 24 jam dan loket pendaftaran rawat inap cito berlokasi satu atap di IGD Lt. 2 tanpa perlu antre ke lobi umum.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-tower-100 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-full bg-tower-800 text-ivory font-bold flex items-center justify-center text-sm">
                4
              </div>
              <h4 className="font-bold text-sm text-tower-950">Lift Prioritas ICU & Operasi</h4>
              <p className="text-xs text-ink-soft leading-relaxed">
                Akses elevator steril khusus menghubungkan langsung ke Lantai 4 (ICU/ICCU/HCU) dan Lantai 5 (Kamar Bedah Sentral IBS).
              </p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
