'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TOWER_FLOORS } from '@/data/buildings';
import { HOSPITAL_FACTS } from '@/data/facts';
import { Building2, ArrowRight, ShieldCheck, Info } from 'lucide-react';

export function TowerTeaser() {
  const [selectedFloor, setSelectedFloor] = useState(4); // Default to ICU/ICCU (Lt. 4)

  const activeFloor = TOWER_FLOORS.find((f) => f.floor === selectedFloor) || TOWER_FLOORS[0];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-tower-100 shadow-lg space-y-8">
      {/* HEADER TEASER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-tower-100 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-tower-100 text-tower-900 mb-2">
            <Building2 className="w-3.5 h-3.5 text-tower-700" />
            <span>Fitur Penanda Interaktif</span>
          </div>
          <h3 className="font-display font-bold text-3xl text-tower-900 leading-tight">
            Eksplorasi {HOSPITAL_FACTS.buildings.tower.name} 13 Lantai
          </h3>
          <p className="text-ink-soft text-sm mt-1 max-w-xl">
            Menjawab pertanyaan paling umum pengunjung: fasilitas dan poliklinik ada di lantai berapa?
          </p>
        </div>

        <Link
          href={`/tower?gedung=tower&lantai=${selectedFloor}`}
          className="inline-flex items-center gap-2 text-sm font-bold text-tower-800 hover:text-tower-600 group shrink-0"
        >
          <span>Buka Tower Directory Lengkap</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* INTERACTIVE SPLIT: SELECTOR ON LEFT, DETAIL ON RIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* SELECTOR LANTAI (VERTICAL STACK) */}
        <div className="lg:col-span-5 space-y-1.5 max-h-[420px] overflow-y-auto pr-2">
          {TOWER_FLOORS.map((f) => {
            const isSelected = selectedFloor === f.floor;
            const hasData = f.known;

            return (
              <button
                key={f.floor}
                type="button"
                onClick={() => setSelectedFloor(f.floor)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-left text-sm font-semibold transition-all border min-h-[44px] ${
                  isSelected
                    ? 'bg-tower-800 text-ivory border-tower-800 shadow-md scale-[1.02]'
                    : hasData
                    ? 'bg-tower-50 text-tower-950 border-tower-100 hover:bg-tower-100'
                    : 'bg-ivory text-ink-soft border-tower-100/60 hover:bg-tower-50'
                }`}
                aria-pressed={isSelected}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 font-display font-bold text-base ${isSelected ? 'text-gold-300' : 'text-tower-800'}`}>
                    {f.floor < 10 ? `0${f.floor}` : f.floor}
                  </span>
                  <span className="truncate max-w-[170px] sm:max-w-[200px]">
                    {f.label}
                  </span>
                </div>

                <span className="text-xs">
                  {hasData ? (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isSelected ? 'bg-gold-500 text-tower-950' : 'bg-tower-200 text-tower-900'}`}>
                      Ada Layanan
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-tower-100/80 text-tower-900">
                      Tertutup
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* DETAIL PANEL ON RIGHT */}
        <div className="lg:col-span-7 bg-ivory rounded-2xl p-6 sm:p-8 border border-tower-100 flex flex-col justify-between min-h-[420px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-tower-100 pb-4">
              <div>
                <span className="text-xs font-mono text-gold-700 uppercase tracking-widest block font-bold">
                  {HOSPITAL_FACTS.buildings.tower.name} RSIS
                </span>
                <h4 className="font-display font-bold text-2xl text-tower-900">
                  {activeFloor.label}
                </h4>
              </div>

              {activeFloor.known ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-tower-100 text-tower-900 border border-tower-600/20">
                  <ShieldCheck className="w-3.5 h-3.5 text-tower-700" />
                  <span>Fasilitas Terverifikasi</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gold-100 text-tower-950 border border-gold-500/40">
                  <Info className="w-3.5 h-3.5 text-tower-800" />
                  <span>Informasi Dibatasi (K4)</span>
                </span>
              )}
            </div>

            <p className="text-sm text-ink leading-relaxed">
              {activeFloor.description}
            </p>

            {activeFloor.known && activeFloor.serviceSlugs.length > 0 && (
              <div className="pt-2 space-y-2">
                <span className="text-xs font-bold text-tower-900 uppercase tracking-wider block">
                  Layanan & Instalasi Utama di Lantai Ini:
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeFloor.serviceSlugs.map((slug) => (
                    <Link
                      key={slug}
                      href={`/layanan#${slug}`}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white border border-tower-100 text-xs font-bold text-tower-800 hover:bg-tower-800 hover:text-ivory transition-colors shadow-sm"
                    >
                      <span>Lihat Detail Layanan &rarr;</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-tower-100 mt-6 flex items-center justify-between">
            <span className="text-xs text-ink-soft">
              * Berdasarkan data publik resmi S1 (dilihat Oktober 2026).
            </span>

            <Link
              href={`/tower?gedung=tower&lantai=${selectedFloor}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-tower-800 text-ivory text-xs font-bold hover:bg-tower-700 transition-colors"
            >
              <span>Jelajahi Lantai {selectedFloor}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
