import { HOSPITAL_FACTS } from '@/data/facts';
import { PhoneCall, Ambulance, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function EmergencyBar() {
  const { emergency, disclaimer } = HOSPITAL_FACTS;

  return (
    <>
      {/* UNIFIED DESKTOP TOP UTILITY BAR (md ke atas) */}
      <aside
        aria-label="Kontak Darurat Rumah Sakit"
        className="hidden md:block bg-tower-950 text-ivory border-b border-gold-500/20 py-1.5 px-4 text-xs"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* SISI KIRI: DISCLAIMER BADGE RINGKAS */}
          <div className="flex items-center gap-2 text-gold-300">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-tower-900 border border-gold-500/30 font-semibold text-[11px] tracking-wide">
              <AlertTriangle className="w-3 h-3 text-gold-400 shrink-0" aria-hidden="true" />
              <span>{disclaimer.short}</span>
            </span>
          </div>

          {/* SISI KANAN: DUA PILL DARURAT KONTRAS TINGGI + LINK IGD */}
          <div className="flex items-center gap-3">
            {/* Pill 1: Emergency Call Center */}
            <a
              href={emergency.callCenterTel}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-alert-600 text-ivory font-bold text-xs shadow-xs hover:bg-alert-700 transition-colors focus:ring-2 focus:ring-ivory"
              aria-label={`${emergency.callCenterLabel}: ${emergency.callCenterNumber}`}
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" aria-hidden="true" />
              <PhoneCall className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{emergency.callCenterLabel}: {emergency.callCenterNumber}</span>
            </a>

            {/* Pill 2: Ambulans Siaga */}
            <a
              href={emergency.ambulanceTel}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ivory text-tower-950 font-bold text-xs shadow-xs hover:bg-gold-100 transition-colors focus:ring-2 focus:ring-ivory"
              aria-label={`${emergency.ambulanceLabel}: ${emergency.ambulanceNumber}`}
            >
              <Ambulance className="w-3.5 h-3.5 text-tower-800 shrink-0" aria-hidden="true" />
              <span>{emergency.ambulanceLabel}: {emergency.ambulanceNumber}</span>
            </a>

            {/* Link Cepat IGD & Triase */}
            <Link
              href="/igd"
              prefetch={false}
              className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-gold-300 hover:text-gold-100 font-semibold transition-colors ml-1"
            >
              <span>Info IGD & Triase</span>
              <ArrowRight className="w-3 h-3" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </aside>

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
              <span className="block text-[9px] uppercase tracking-wider font-extrabold text-alert-600">Darurat</span>
              <span className="font-extrabold">{emergency.callCenterNumber}</span>
            </div>
          </a>

          <a
            href={emergency.ambulanceTel}
            className="flex items-center justify-center gap-2 min-h-[44px] px-3 py-2 bg-ivory text-alert-600 rounded-lg font-bold text-xs shadow-sm active:scale-95 transition-transform"
          >
            <Ambulance className="w-4 h-4 shrink-0" aria-hidden="true" />
            <div className="text-left leading-tight">
              <span className="block text-[9px] uppercase tracking-wider font-extrabold text-alert-600">Ambulans</span>
              <span className="font-extrabold">{emergency.ambulanceNumber}</span>
            </div>
          </a>
        </div>
      </div>
    </>
  );
}
