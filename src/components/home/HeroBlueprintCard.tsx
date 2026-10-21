'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Building2, ShieldAlert, HeartPulse, Stethoscope, Baby, Info } from 'lucide-react';
import { HOSPITAL_FACTS } from '@/data/facts';

const VERIFIED_FLOORS = [
  {
    floor: 7,
    floorNum: '07',
    name: 'Ruang Bersalin An-Nisa',
    category: 'Ibu & Anak',
    icon: Baby,
    facilities: ['Kamar Bersalin Islami', 'Rawat Gabung Ibu-Anak', 'Kamar VIP'],
    highlightColor: 'border-gold-500/60 bg-tower-900/80 hover:bg-tower-800/90',
  },
  {
    floor: 4,
    floorNum: '04',
    name: 'Perawatan Intensif Terpadu',
    category: 'Critical Care',
    icon: HeartPulse,
    facilities: ['ICU', 'ICCU', 'HCU', 'NICU', 'PICU'],
    highlightColor: 'border-gold-500/60 bg-tower-900/80 hover:bg-tower-800/90',
    bedStatus: 'Tersedia Ruang Kritis',
  },
  {
    floor: 3,
    floorNum: '03',
    name: 'Penunjang Diagnostik 24 Jam',
    category: 'Diagnostik',
    icon: Stethoscope,
    facilities: ['Laboratorium Terpadu', `Radiologi ${HOSPITAL_FACTS.equipment.ctScan}`, 'Medical Check Up'],
    highlightColor: 'border-gold-500/60 bg-tower-900/80 hover:bg-tower-800/90',
  },
  {
    floor: 2,
    floorNum: '02',
    name: 'Instalasi Gawat Darurat (IGD)',
    category: 'Gawat Darurat',
    icon: ShieldAlert,
    facilities: ['Triase Darurat 24 Jam', 'Depo Farmasi Terpadu', 'Akses Cepat Ambulans'],
    highlightColor: 'border-gold-500/60 bg-tower-900/80 hover:bg-tower-800/90',
  },
];

export function HeroBlueprintCard() {
  const [activeFloor, setActiveFloor] = useState<number>(4);

  return (
    <div
      aria-label={`Visualisasi Arsitektur ${HOSPITAL_FACTS.buildings.tower.name} 13 Lantai`}
      className="w-full max-w-lg bg-tower-950/95 border-2 border-gold-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md relative overflow-hidden"
    >
      {/* HEADER BLUEPRINT */}
      <div className="flex items-center justify-between pb-3.5 border-b border-gold-500/30">
        <div>
          <span className="text-[10px] font-mono text-gold-300 uppercase tracking-widest block font-bold">
            Blueprint Arsitektur · Diresmikan 2023
          </span>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-ivory flex items-center gap-2">
            <Building2 className="w-5 h-5 text-gold-400 shrink-0" aria-hidden="true" />
            <span>{HOSPITAL_FACTS.buildings.tower.name} 13 Lantai</span>
          </h2>
        </div>
        <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full bg-tower-900 border border-gold-500/40 text-[11px] font-mono font-bold text-gold-300">
          13 Lantai Fisik
        </span>
      </div>

      {/* 4 LANTAI UTAMA TERVERIFIKASI */}
      <div className="pt-3.5 pb-2 space-y-2">
        <span className="text-[11px] uppercase tracking-wider text-ivory/70 font-semibold block">
          4 Lantai Layanan Medis Terverifikasi:
        </span>

        <div className="space-y-2">
          {VERIFIED_FLOORS.map((item) => {
            const Icon = item.icon;
            const isSelected = activeFloor === item.floor;

            return (
              <div
                key={item.floor}
                onMouseEnter={() => setActiveFloor(item.floor)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-gold-400 bg-tower-800 text-ivory shadow-md ring-1 ring-gold-400/30'
                    : 'border-gold-500/20 bg-tower-900/60 text-ivory/90 hover:border-gold-500/40 hover:bg-tower-900'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-tower-950 border border-gold-500/40 font-mono font-extrabold text-xs text-gold-300 flex items-center justify-center shrink-0">
                      {item.floorNum}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm text-ivory truncate flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-gold-400 shrink-0" aria-hidden="true" />
                        <span className="truncate">{item.name}</span>
                      </h3>
                      <p className="text-[11px] text-ivory/75 truncate mt-0.5">
                        {item.facilities.join(' · ')}
                      </p>
                    </div>
                  </div>

                  {item.bedStatus && (
                    <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-tower-700/80 text-gold-200 shrink-0 border border-gold-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" aria-hidden="true" />
                      <span>{item.bedStatus}</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FASAD LANTAI RAMPING UNTUK LANTAI LAINNYA (ATURAN K4) */}
      <div className="py-2.5 border-t border-b border-gold-500/20 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-ivory/75">
          <span className="font-mono text-[10px] uppercase tracking-wider text-gold-300 font-bold">
            Struktur Fasad Gedung:
          </span>
          <span className="text-[10px] text-ivory/60">
            Lantai 1, 5–6, 8–13
          </span>
        </div>

        {/* 13 Baris Representasi Fisik Fasad Tower */}
        <div className="flex items-center gap-1 w-full h-2.5 px-0.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((floor) => {
            const isVerified = [2, 3, 4, 7].includes(floor);
            return (
              <div
                key={floor}
                title={`Lantai ${floor}${isVerified ? ' (Terverifikasi)' : ' (Alokasi belum dipublikasikan resmi)'}`}
                className={`h-full flex-1 rounded-xs transition-colors ${
                  isVerified
                    ? 'bg-gold-400 shadow-xs'
                    : 'bg-tower-800/80 hover:bg-tower-700/80'
                }`}
              />
            );
          })}
        </div>

        <p className="text-[10px] text-ivory/60 flex items-center gap-1">
          <Info className="w-3 h-3 text-gold-400 shrink-0" aria-hidden="true" />
          <span>Sesuai data resmi RSIS: lantai lainnya belum dipublikasikan peruntukannya secara terbuka.</span>
        </p>
      </div>

      {/* FOOTER ACTION */}
      <div className="pt-3 flex items-center justify-between">
        <span className="text-xs text-gold-300/80 font-medium hidden sm:inline">
          Denah interaktif 13 lantai
        </span>
        <Link
          href="/tower"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 active:bg-gold-600 text-tower-950 font-bold text-xs shadow-md transition-all group ml-auto"
        >
          <span>Buka Tower Directory Lengkap</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
