'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Specialty } from '@/data/types';
import { HOSPITAL_FACTS } from '@/data/facts';
import { CLINIC_GROUPS } from '@/data/specialties';
import {
  Stethoscope,
  ArrowRight,
  Search,
  Building2,
  CheckCircle2,
} from 'lucide-react';

interface ClinicIndexClientProps {
  specialties: Specialty[];
}

type CategoryFilter = 'all' | 'dasar' | 'bedah' | 'ibu-anak';

export function ClinicIndexClient({ specialties }: ClinicIndexClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mapping categorisation
  const filteredSpecialties = useMemo(() => {
    return specialties.filter((spec) => {
      // 1. Filter Category
      if (selectedCategory === 'dasar') {
        if (spec.group !== CLINIC_GROUPS.DASAR) return false;
      } else if (selectedCategory === 'bedah') {
        if (spec.group !== CLINIC_GROUPS.SPESIALISTIK) return false;
      } else if (selectedCategory === 'ibu-anak') {
        if (spec.group !== CLINIC_GROUPS.PENUNJANG) return false;
      }

      // 2. Search Query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = spec.name.toLowerCase().includes(q);
        const matchesSummary = spec.summary.toLowerCase().includes(q);
        return matchesName || matchesSummary;
      }

      return true;
    });
  }, [specialties, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      
      {/* Category Tabs & Quick Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Category Tab Pills */}
        <div
          role="tablist"
          aria-label="Filter Kategori Poliklinik"
          className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selectedCategory === 'all'}
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-tower-800 text-ivory shadow-sm'
                : 'bg-tower-50 text-tower-900 hover:bg-tower-100'
            }`}
          >
            Semua Poliklinik ({specialties.length})
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={selectedCategory === 'dasar'}
            onClick={() => setSelectedCategory('dasar')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'dasar'
                ? 'bg-tower-800 text-ivory shadow-sm'
                : 'bg-tower-50 text-tower-900 hover:bg-tower-100'
            }`}
          >
            Medik Dasar & Organ Dalam
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={selectedCategory === 'bedah'}
            onClick={() => setSelectedCategory('bedah')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'bedah'
                ? 'bg-tower-800 text-ivory shadow-sm'
                : 'bg-tower-50 text-tower-900 hover:bg-tower-100'
            }`}
          >
            Bedah & Spesialistik
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={selectedCategory === 'ibu-anak'}
            onClick={() => setSelectedCategory('ibu-anak')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'ibu-anak'
                ? 'bg-tower-800 text-ivory shadow-sm'
                : 'bg-tower-50 text-tower-900 hover:bg-tower-100'
            }`}
          >
            Ibu, Anak & Penunjang
          </button>
        </div>

        {/* Quick Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari poli atau gejala klinis..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-tower-100 text-xs text-ink placeholder:text-ink-soft/70 focus:outline-none focus:ring-2 focus:ring-tower-700 shadow-xs"
          />
        </div>
      </div>

      {/* Result Count Status */}
      <div className="flex items-center justify-between text-xs text-ink-soft px-1">
        <span>
          Menampilkan <strong>{filteredSpecialties.length}</strong> dari {specialties.length} Poliklinik Rawat Jalan
        </span>
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-tower-700 hover:underline font-semibold"
          >
            Reset Pencarian
          </button>
        )}
      </div>

      {/* 4-Column Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredSpecialties.map((spec) => (
          <div
            key={spec.id}
            className="bg-white rounded-2xl p-5 border border-tower-100 shadow-xs hover:shadow-md hover:border-tower-700/50 transition-all flex flex-col justify-between group space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-tower-100 text-tower-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold-100 text-tower-950 border border-gold-400/40">
                  <CheckCircle2 className="w-3 h-3 text-gold-700" />
                  <span>BPJS & Umum</span>
                </span>
              </div>

              <div>
                <h3 className="font-display font-bold text-base text-tower-950 group-hover:text-tower-700 transition-colors">
                  {spec.name}
                </h3>
                <span className="text-[11px] font-semibold text-gold-700 uppercase tracking-wide block mt-0.5">
                  {HOSPITAL_FACTS.buildings.graha.name} & {HOSPITAL_FACTS.buildings.tower.name}
                </span>
              </div>

              <p className="text-xs text-ink-soft leading-relaxed line-clamp-3">
                {spec.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-tower-50 flex items-center justify-between text-xs font-bold">
              <Link
                href={`/dokter?spesialis=${spec.id}`}
                className="text-tower-800 hover:text-tower-600 inline-flex items-center gap-1"
              >
                <span>Lihat Dokter</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/tower"
                className="text-ink-soft hover:text-tower-800 inline-flex items-center gap-1 text-[11px]"
              >
                <Building2 className="w-3 h-3" />
                <span>Denah ↗</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredSpecialties.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-tower-200 space-y-3">
          <Stethoscope className="w-10 h-10 text-tower-600 mx-auto opacity-50" />
          <h3 className="font-bold text-base text-tower-950">
            Tidak Ada Poliklinik yang Sesuai
          </h3>
          <p className="text-xs text-ink-soft max-w-sm mx-auto">
            Tidak ditemukan poliklinik untuk kata kunci &quot;{searchQuery}&quot;. Coba gunakan kata kunci lain atau pilih tab Semua Poliklinik.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-tower-800 text-ivory text-xs font-bold hover:bg-tower-700"
          >
            Tampilkan Semua Poliklinik
          </button>
        </div>
      )}

    </div>
  );
}
