import { HOSPITAL_FACTS } from '@/data/facts';
import { PhoneCall, Ambulance, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export function EmergencyBar() {
  const { emergency } = HOSPITAL_FACTS;

  return (
    <>
      {/* DESKTOP TOP BAR (md ke atas) */}
      <section
        aria-label="Kontak Darurat Rumah Sakit"
        className="hidden md:block bg-alert-600 text-ivory px-4 py-2 text-sm font-medium"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="font-semibold tracking-wide">LAYANAN GAWAT DARURAT 24 JAM:</span>
            <span className="text-ivory text-xs font-medium">Siap siaga melayani Anda kapan saja</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href={emergency.callCenterTel}
              className="inline-flex items-center gap-2 px-3 py-1 bg-ivory text-alert-600 rounded-md font-bold hover:bg-gold-100 transition-colors focus:ring-2 focus:ring-ivory"
              aria-label={`Hubungi ${emergency.callCenterLabel} di nomor ${emergency.callCenterNumber}`}
            >
              <PhoneCall className="w-4 h-4" aria-hidden="true" />
              <span>{emergency.callCenterLabel}: {emergency.callCenterNumber}</span>
            </a>

            <a
              href={emergency.ambulanceTel}
              className="inline-flex items-center gap-2 px-3 py-1 bg-ivory text-alert-600 rounded-md font-bold hover:bg-gold-100 transition-colors focus:ring-2 focus:ring-ivory"
              aria-label={`Panggil ${emergency.ambulanceLabel} di nomor ${emergency.ambulanceNumber}`}
            >
              <Ambulance className="w-4 h-4" aria-hidden="true" />
              <span>{emergency.ambulanceLabel}: {emergency.ambulanceNumber}</span>
            </a>

            <Link
              href="/igd"
              className="text-xs uppercase tracking-wider text-ivory hover:underline font-semibold"
            >
              Info IGD & Triase &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* MOBILE FIXED BOTTOM DOCK (< md) */}
      <div
        aria-label="Akses Cepat Darurat Mobile"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-alert-600 text-ivory border-t-2 border-gold-500 shadow-2xl p-2"
      >
        <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
          <a
            href={emergency.callCenterTel}
            className="flex items-center justify-center gap-2 min-h-[44px] px-3 py-2 bg-ivory text-alert-600 rounded-lg font-bold text-xs shadow-sm active:scale-95 transition-transform"
          >
            <PhoneCall className="w-4 h-4 shrink-0" aria-hidden="true" />
            <div className="text-left leading-tight">
              <span className="block text-[10px] uppercase font-medium">{emergency.callCenterLabel}</span>
              <span className="text-sm font-extrabold">{emergency.callCenterNumber}</span>
            </div>
          </a>

          <a
            href={emergency.ambulanceTel}
            className="flex items-center justify-center gap-2 min-h-[44px] px-3 py-2 bg-ivory text-alert-600 rounded-lg font-bold text-xs shadow-sm active:scale-95 transition-transform"
          >
            <Ambulance className="w-4 h-4 shrink-0" aria-hidden="true" />
            <div className="text-left leading-tight">
              <span className="block text-[10px] uppercase font-medium">{emergency.ambulanceLabel}</span>
              <span className="text-xs font-extrabold">{emergency.ambulanceNumber}</span>
            </div>
          </a>
        </div>
      </div>
    </>
  );
}
