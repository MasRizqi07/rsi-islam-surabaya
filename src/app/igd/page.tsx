import { HOSPITAL_FACTS } from '@/data/facts';
import { PhoneCall, Ambulance, MapPin, ShieldAlert, HeartPulse, Building2, CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'Instalasi Gawat Darurat (IGD 24 Jam) · RS Islam Surabaya A. Yani',
  description: 'Layanan kegawatdaruratan medis 24 jam dengan sertifikasi ATLS/ACLS, fasilitas ambulans emergency, dan depo farmasi terpadu di Gedung Tower Lantai 2.',
  robots: { index: false, follow: false },
};

export default function IgdPage() {
  const { emergency, contact } = HOSPITAL_FACTS;

  return (
    <div className="space-y-12 pb-16">
      
      {/* 1. ABOVE-THE-FOLD HERO KHUSUS DARURAT (TERLIHAT JELAS PADA 360x640 TANPA SCROLL) */}
      <section className="bg-alert-600 text-ivory py-8 sm:py-12 border-b-4 border-gold-500 shadow-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-5">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-ivory text-alert-600 text-xs font-extrabold uppercase tracking-wider shadow-sm">
            <ShieldAlert className="w-4 h-4 text-alert-600" aria-hidden="true" />
            <span>INSTALASI GAWAT DARURAT · BUKA 24 JAM NONSTOP</span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight">
            Gawat Darurat & Ambulans Siaga
          </h1>

          <p className="text-sm sm:text-base text-ivory/95 max-w-xl mx-auto font-medium">
            Segera hubungi tim medis gawat darurat kami atau langsung menuju instalasi IGD di Gedung Tower Lantai 2.
          </p>

          {/* DUA TOMBOL TEL UTAMA DENGAN LABEL NETRAL (K1) - MIN TARGET 44PX */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto pt-2">
            <a
              href={emergency.callCenterTel}
              className="flex items-center justify-center gap-3 min-h-[56px] px-6 py-3 rounded-2xl bg-ivory text-alert-600 font-extrabold text-base shadow-xl hover:bg-gold-100 active:scale-95 transition-all focus:ring-4 focus:ring-ivory focus:outline-none"
              aria-label={`Hubungi ${emergency.callCenterLabel} di nomor ${emergency.callCenterNumber}`}
            >
              <PhoneCall className="w-6 h-6 shrink-0" aria-hidden="true" />
              <div className="text-left leading-tight">
                <span className="block text-[11px] uppercase tracking-wider font-extrabold text-alert-600">
                  {emergency.callCenterLabel}
                </span>
                <span className="text-xl font-extrabold tracking-wide">
                  {emergency.callCenterNumber}
                </span>
              </div>
            </a>

            <a
              href={emergency.ambulanceTel}
              className="flex items-center justify-center gap-3 min-h-[56px] px-6 py-3 rounded-2xl bg-ivory text-alert-600 font-extrabold text-base shadow-xl hover:bg-gold-100 active:scale-95 transition-all focus:ring-4 focus:ring-ivory focus:outline-none"
              aria-label={`Panggil ${emergency.ambulanceLabel} di nomor ${emergency.ambulanceNumber}`}
            >
              <Ambulance className="w-6 h-6 shrink-0" aria-hidden="true" />
              <div className="text-left leading-tight">
                <span className="block text-[11px] uppercase tracking-wider font-extrabold text-alert-600">
                  {emergency.ambulanceLabel} Siaga
                </span>
                <span className="text-lg font-extrabold tracking-wide">
                  {emergency.ambulanceNumber}
                </span>
              </div>
            </a>
          </div>

          {/* LOKASI FISIK & TOMBOL PETUNJUK ARAH MAPS */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5 bg-tower-950/40 px-3.5 py-1.5 rounded-lg border border-gold-500/30">
              <Building2 className="w-4 h-4 text-gold-300" />
              <span>Lokasi IGD: <strong>Gedung Tower Lantai 2</strong></span>
            </div>

            <a
              href={contact.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gold-500 text-tower-950 hover:bg-gold-300 font-bold transition-colors min-h-[36px]"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Buka di Google Maps &rarr;</span>
            </a>
          </div>

          <div className="text-[11px] text-ivory font-medium pt-1">
            Alamat: {contact.address} (Akses Drop-off Darurat di Sisi Timur)
          </div>

        </div>
      </section>

      {/* 2. ALUR SISTEM TRIASE GAWAT DARURAT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-widest font-mono text-gold-700 block font-bold">
            Prioritas Keselamatan Pasien
          </span>
          <h2 className="font-display font-bold text-3xl text-tower-900">
            Sistem Triase IGD RSIS
          </h2>
          <p className="text-ink-soft text-sm leading-relaxed">
            Pasien diperiksa dan ditangani berdasarkan tingkat kegawatan klinis, bukan berdasarkan urutan kedatangan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border-l-4 border-alert-600 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-alert-600">
                Kategori Merah
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-alert-50 text-alert-600">
                Prioritas 1
              </span>
            </div>
            <h3 className="font-bold text-lg text-tower-950">Gawat Darurat</h3>
            <p className="text-xs text-ink-soft leading-relaxed">
              Kondisi mengancam nyawa atau hilangnya fungsi organ vital (henti jantung, henti napas, syok, trauma berat). Penanganan segera <strong>0 menit</strong>.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border-l-4 border-amber-500 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Kategori Kuning
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-300">
                Prioritas 2
              </span>
            </div>
            <h3 className="font-bold text-lg text-tower-950">Darurat Tidak Gawat</h3>
            <p className="text-xs text-ink-soft leading-relaxed">
              Kondisi berpotensi memburuk jika tidak segera ditangani (patah tulang terbuka, demam tinggi anak disertai kejang, nyeri dada sedang). Respon &lt; <strong>15 menit</strong>.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border-l-4 border-emerald-600 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Kategori Hijau
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                Prioritas 3
              </span>
            </div>
            <h3 className="font-bold text-lg text-tower-950">Tidak Gawat Tidak Darurat</h3>
            <p className="text-xs text-ink-soft leading-relaxed">
              Kondisi ringan yang stabil dan dapat ditangani setelah pasien kritis tertangani (luka lecet ringan, batuk pilek biasa tanpa sesak).
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border-l-4 border-stone-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-800">
                Kategori Hitam
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-800">
                Prioritas 0
              </span>
            </div>
            <h3 className="font-bold text-lg text-tower-950">Meninggal Dunia</h3>
            <p className="text-xs text-ink-soft leading-relaxed">
              Pasien tiba dalam keadaan meninggal (*Death on Arrival / DOA*). Diberikan pendampingan dan dialihkan ke instalasi pemulasaran jenazah.
            </p>
          </div>
        </div>
      </section>

      {/* 3. KEUNGGULAN FASILITAS IGD SATU PINTU (TOWER LT. 2) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-tower-50/80 rounded-3xl p-8 sm:p-10 border border-tower-100 space-y-6">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest font-mono text-gold-700 font-bold block">
              Integrasi Pelayanan Satu Lantai
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-tower-900">
              Fasilitas Penunjang IGD di Tower Lantai 2
            </h2>
            <p className="text-ink-soft text-sm max-w-2xl">
              Meminimalkan perpindahan pasien kritis dengan menempatkan fasilitas vital dalam satu zona yang terkoordinasi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-tower-100 shadow-sm space-y-2">
              <div className="w-9 h-9 rounded-lg bg-tower-100 flex items-center justify-center text-tower-800">
                <HeartPulse className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-tower-900">Sertifikasi Medis ATLS & ACLS</h4>
              <p className="text-xs text-ink-soft leading-relaxed">
                Seluruh dokter jaga dan perawat IGD tersertifikasi *Advanced Trauma Life Support* (ATLS) dan *Advanced Cardiac Life Support* (ACLS).
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-tower-100 shadow-sm space-y-2">
              <div className="w-9 h-9 rounded-lg bg-tower-100 flex items-center justify-center text-tower-800">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-tower-900">Pendaftaran & Depo Farmasi IGD</h4>
              <p className="text-xs text-ink-soft leading-relaxed">
                Loket pendaftaran rawat inap cito dan depo farmasi obat darurat berada tepat di lantai yang sama demi kecepatan penanganan.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-tower-100 shadow-sm space-y-2">
              <div className="w-9 h-9 rounded-lg bg-tower-100 flex items-center justify-center text-tower-800">
                <Ambulance className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-tower-900">Armada Ambulans Emergency</h4>
              <p className="text-xs text-ink-soft leading-relaxed">
                2 unit ambulans siaga dilengkapi monitor EKG, tabung oksigen, defibrilator portabel, dan ventilator transport siap jemput pasien.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
