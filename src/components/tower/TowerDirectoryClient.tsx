'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { TOWER_FLOORS, GRAHA_FLOORS } from '@/data/buildings';
import { SERVICES } from '@/data/services';
import { BedStatusWidget } from '@/components/home/BedStatusWidget';
import { BuildingId, FloorInfo } from '@/data/types';
import {
  Building2,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Stethoscope,
  Info,
  Layers,
} from 'lucide-react';

export function TowerDirectoryClient() {

  const [activeBuilding, setActiveBuilding] = useState<BuildingId>('tower');
  const currentFloors = activeBuilding === 'tower' ? TOWER_FLOORS : GRAHA_FLOORS;
  const [selectedFloor, setSelectedFloor] = useState<number>(4);

  // Sinkronisasi saat URL searchParams dibaca di browser (client-only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const b = params.get('gedung') as BuildingId;
    const fStr = params.get('lantai');
    if (b === 'tower' || b === 'graha') {
      setActiveBuilding(b);
      const floors = b === 'tower' ? TOWER_FLOORS : GRAHA_FLOORS;
      if (fStr !== null) {
        const parsed = parseInt(fStr, 10);
        if (floors.some((fl) => fl.floor === parsed)) {
          setSelectedFloor(parsed);
        }
      }
    }
  }, []);

  // Update URL searchParams via window.history.replaceState agar tanpa overhead
  const updateParams = useCallback(
    (b: BuildingId, f: number) => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        params.set('gedung', b);
        params.set('lantai', f.toString());
        window.history.replaceState(null, '', `/tower?${params.toString()}`);
      }
    },
    []
  );

  const handleSelectBuilding = (b: BuildingId) => {
    setActiveBuilding(b);
    const defaultFloor = b === 'tower' ? 4 : 0;
    setSelectedFloor(defaultFloor);
    updateParams(b, defaultFloor);
  };

  const handleSelectFloor = (floorNum: number) => {
    setSelectedFloor(floorNum);
    updateParams(activeBuilding, floorNum);
  };

  // Navigasi Keyboard (ArrowUp / ArrowDown)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const currentIndex = currentFloors.findIndex((f) => f.floor === selectedFloor);
    if (currentIndex === -1) return;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      // In our array, index 0 is top floor (13 or 5), index N is bottom (1 or 0)
      if (currentIndex > 0) {
        const nextFloor = currentFloors[currentIndex - 1].floor;
        handleSelectFloor(nextFloor);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (currentIndex < currentFloors.length - 1) {
        const nextFloor = currentFloors[currentIndex + 1].floor;
        handleSelectFloor(nextFloor);
      }
    }
  };

  const activeFloorData =
    currentFloors.find((f) => f.floor === selectedFloor) || currentFloors[0];

  const matchedServices = SERVICES.filter((s) =>
    activeFloorData.serviceSlugs.includes(s.slug)
  );

  return (
    <div className="space-y-10" onKeyDown={handleKeyDown}>
      
      {/* 1. PEMILIH GEDUNG (TAB GANDA) */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-tower-100 pb-6">
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-widest text-gold-700 font-bold block">
            Pusat Informasi Fasilitas Fisik
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-tower-950">
            Denah & Panduan Lantai Rumah Sakit
          </h2>
        </div>

        {/* TAB SWITCHER */}
        <div
          role="tablist"
          aria-label="Pilih Gedung Rumah Sakit"
          className="inline-flex p-1.5 rounded-2xl bg-tower-50 border border-tower-100 shadow-inner"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeBuilding === 'tower'}
            aria-controls="building-panel"
            id="tab-tower"
            onClick={() => handleSelectBuilding('tower')}
            className={`min-h-[44px] px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeBuilding === 'tower'
                ? 'bg-tower-800 text-ivory shadow-md'
                : 'text-tower-900 hover:text-tower-700 hover:bg-tower-100/60'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Gedung Tower (13 Lantai)</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeBuilding === 'graha'}
            aria-controls="building-panel"
            id="tab-graha"
            onClick={() => handleSelectBuilding('graha')}
            className={`min-h-[44px] px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeBuilding === 'graha'
                ? 'bg-tower-800 text-ivory shadow-md'
                : 'text-tower-900 hover:text-tower-700 hover:bg-tower-100/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Gedung Graha (6 Level)</span>
          </button>
        </div>
      </div>

      {/* 2. PETUNJUK AKSESIBILITAS KEYBOARD */}
      <div className="flex items-center justify-between text-xs text-ink-soft bg-ivory px-4 py-2.5 rounded-xl border border-tower-100">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-tower-700 shrink-0" />
          <span>
            <strong>Navigasi Cepat:</strong> Klik lantai atau gunakan tombol panah{' '}
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-tower-100 font-mono text-[11px] shadow-sm">
              &uarr; Up
            </kbd>{' '}
            dan{' '}
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-tower-100 font-mono text-[11px] shadow-sm">
              &darr; Down
            </kbd>{' '}
            pada keyboard untuk berpindah antar-lantai.
          </span>
        </div>
        <span className="hidden md:inline font-mono text-[11px] text-tower-700 font-bold">
          {activeBuilding === 'tower' ? 'Tower 13 Lantai' : 'Graha Ground + 5'}
        </span>
      </div>

      {/* 3. TAMPILAN INTERAKTIF SPLIT (SELECTOR LANTAI & DETAIL PANEL) */}
      <div
        id="building-panel"
        role="tabpanel"
        aria-labelledby={`tab-${activeBuilding}`}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        {/* KOLOM KIRI: STACK PEMILIH LANTAI (VERTISIKAL DARI ATAS KE BAWAH) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-tower-100 shadow-md space-y-3">
          <div className="flex items-center justify-between px-2 pb-2 border-b border-tower-100">
            <span className="text-xs font-bold text-tower-900 uppercase tracking-wider">
              Daftar Lantai {activeBuilding === 'tower' ? 'Tower' : 'Graha'}
            </span>
            <span className="text-[11px] font-mono text-ink-soft">
              Pilih Lantai
            </span>
          </div>

          <div
            role="tablist"
            aria-label={`Daftar lantai ${activeBuilding}`}
            aria-orientation="vertical"
            className="space-y-1.5 max-h-[560px] overflow-y-auto pr-1 focus:outline-none"
            tabIndex={0}
          >
            {currentFloors.map((f: FloorInfo) => {
              const isSelected = selectedFloor === f.floor;
              const hasData = f.known;

              return (
                <button
                  key={`${f.buildingId}-${f.floor}`}
                  role="tab"
                  id={`floor-tab-${f.floor}`}
                  aria-selected={isSelected}
                  aria-controls="floor-detail-panel"
                  type="button"
                  onClick={() => handleSelectFloor(f.floor)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all border min-h-[48px] ${
                    isSelected
                      ? 'bg-tower-800 text-ivory border-tower-800 shadow-md ring-2 ring-gold-500/50 scale-[1.01]'
                      : hasData
                      ? 'bg-tower-50 text-tower-950 border-tower-100 hover:bg-tower-100 hover:border-tower-200'
                      : 'bg-ivory text-ink-soft border-tower-100/60 hover:bg-tower-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-8 font-display font-bold text-base shrink-0 ${
                        isSelected ? 'text-gold-300' : 'text-tower-800'
                      }`}
                    >
                      {f.floor === 0
                        ? '00'
                        : f.floor < 10
                        ? `0${f.floor}`
                        : f.floor}
                    </span>
                    <span className="truncate font-semibold text-xs sm:text-sm">
                      {f.label}
                    </span>
                  </div>

                  <div className="shrink-0 ml-2">
                    {hasData ? (
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isSelected
                            ? 'bg-gold-500 text-tower-950'
                            : 'bg-tower-100 text-tower-900 border border-tower-600/20'
                        }`}
                      >
                        {f.serviceSlugs.length > 0 ? `${f.serviceSlugs.length} Layanan` : 'Fasilitas'}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gold-100 text-tower-950 border border-gold-500/30">
                        K4 (Tertutup)
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* KOLOM KANAN: PANEL DETAIL LANTAI */}
        <div
          id="floor-detail-panel"
          role="region"
          aria-live="polite"
          className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-tower-100 shadow-lg space-y-6 min-h-[560px] flex flex-col justify-between"
        >
          <div className="space-y-6">
            
            {/* HEADER DETAIL LANTAI */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-tower-100 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-700">
                    {activeBuilding === 'tower' ? 'Gedung Tower RSIS' : 'Gedung Graha RSIS'}
                  </span>
                  <span className="text-tower-900 font-bold">&bull;</span>
                  <span className="text-xs font-bold text-tower-800">
                    {activeFloorData.label}
                  </span>
                </div>
                <h3 className="font-display font-bold text-2xl sm:text-3xl text-tower-950">
                  {activeFloorData.known
                    ? activeFloorData.label
                    : `${activeFloorData.label} · Informasi Belum Tersedia`}
                </h3>
              </div>

              {/* LENCANA STATUS VERIFIKASI / K4 */}
              <div className="shrink-0">
                {activeFloorData.known ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-tower-100 text-tower-900 border border-tower-600/20 shadow-sm">
                    <ShieldCheck className="w-4 h-4 text-tower-700" />
                    <span>Fasilitas Terverifikasi</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-gold-100 text-tower-950 border border-gold-500/40 shadow-sm">
                    <AlertCircle className="w-4 h-4 text-tower-800" />
                    <span>Transparansi K4</span>
                  </span>
                )}
              </div>
            </div>

            {/* DESKRIPSI LANTAI */}
            <div className="space-y-3">
              <p className="text-sm sm:text-base text-ink leading-relaxed">
                {activeFloorData.description}
              </p>

              {/* PERINGATAN K4 TRANSPARANSI JIKA DATA TIDAK TERSEDIA */}
              {!activeFloorData.known && (
                <div className="p-4 rounded-2xl bg-gold-100 text-tower-950 font-medium border border-gold-500/40 text-xs sm:text-sm space-y-2">
                  <div className="flex items-center gap-2 font-bold text-tower-950">
                    <Info className="w-4 h-4 text-tower-800 shrink-0" />
                    <span>Register Konflik K4 (Pencegahan Halusinasi):</span>
                  </div>
                  <p className="text-xs leading-relaxed">
                    Berdasarkan sumber publikasi resmi rumah sakit yang dapat diverifikasi per Oktober 2026, peruntukan lantai ini tidak dirinci secara publik. Demi menjaga integritas data portofolio, isi ruangan tidak dikarang atau dispekulasikan.
                  </p>
                </div>
              )}
            </div>

            {/* INTEGRASI BED STATUS JIKA TOWER LANTAI 4 (ICU/ICCU/HCU/NICU/PICU) */}
            {activeBuilding === 'tower' && activeFloorData.floor === 4 && (
              <div className="pt-2 space-y-3">
                <span className="text-xs font-bold text-tower-900 uppercase tracking-wider block">
                  Status Ketersediaan Kamar Perawatan Kritis Terpadu:
                </span>
                <BedStatusWidget />
              </div>
            )}

            {/* LAYANAN UNGGULAN TERKAIT DI LANTAI INI */}
            {matchedServices.length > 0 && (
              <div className="pt-2 space-y-3">
                <span className="text-xs font-bold text-tower-900 uppercase tracking-wider block">
                  Instalasi & Layanan Unggulan di Lantai Ini:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {matchedServices.map((svc) => (
                    <div
                      key={svc.slug}
                      className="p-4 rounded-2xl bg-ivory border border-tower-100 space-y-2 flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-display font-bold text-sm text-tower-950">
                            {svc.name}
                          </h4>
                          {svc.open24h && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-alert-50 text-alert-600 border border-alert-600/20">
                              24 Jam
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-ink-soft leading-relaxed line-clamp-2">
                          {svc.description}
                        </p>
                      </div>

                      <Link
                        href={`/layanan#${svc.slug}`}
                        className="text-xs font-bold text-tower-800 hover:text-tower-600 inline-flex items-center gap-1.5 pt-2"
                      >
                        <span>Lihat Rincian Layanan</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* JIKA GRAHA LANTAI 0 (GROUND): TAUTAN POLIKLINIK RAWAT JALAN */}
            {activeBuilding === 'graha' && activeFloorData.floor === 0 && (
              <div className="p-4 rounded-2xl bg-tower-50 border border-tower-100 space-y-2">
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-tower-700" />
                  <span className="text-xs font-bold text-tower-900 uppercase tracking-wider">
                    Pusat Poliklinik Rawat Jalan:
                  </span>
                </div>
                <p className="text-xs text-ink leading-relaxed">
                  Loket pendaftaran rawat jalan, loket BPJS Centre, serta poliklinik spesialis bedah, ortopedi, THT, gigi, dan rehabilitasi medik dipusatkan di Lantai Dasar Gedung Graha.
                </p>
                <div className="pt-1">
                  <Link
                    href="/dokter"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-tower-800 text-ivory text-xs font-bold hover:bg-tower-700 transition-colors shadow-sm"
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>Cari Dokter di Poliklinik Ini</span>
                  </Link>
                </div>
              </div>
            )}

          </div>

          {/* FOOTER DETAIL PANEL */}
          <div className="pt-6 border-t border-tower-100 mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-ink-soft">
            <span>
              * Dihimpun dari publikasi resmi RS Islam Surabaya A. Yani (diakses Oktober 2026).
            </span>

            <div className="flex items-center gap-2">
              <Link
                href="/daftar"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-tower-800 hover:bg-tower-700 text-ivory font-bold transition-all shadow-sm"
              >
                <span>Daftar Pemeriksaan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
