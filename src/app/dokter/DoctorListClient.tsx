'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { DOCTORS } from '@/data/doctors';
import { SPECIALTIES } from '@/data/specialties';
import { filterDoctors } from '@/lib/data-utils';
import { Hari, Penjamin, PoliCategory } from '@/data/types';
import {
  Search,
  Stethoscope,
  Calendar,
  RotateCcw,
  ArrowRight,
  Filter,
} from 'lucide-react';

const DAYS_OPTIONS = [
  { value: 'all', label: 'Semua Hari' },
  { value: 'senin', label: 'Senin' },
  { value: 'selasa', label: 'Selasa' },
  { value: 'rabu', label: 'Rabu' },
  { value: 'kamis', label: 'Kamis' },
  { value: 'jumat', label: 'Jumat' },
  { value: 'sabtu', label: 'Sabtu' },
];

export function DoctorListClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Ambil state awal dari URL SearchParams
  const initialQ = searchParams.get('q') || '';
  const initialSpecialty = searchParams.get('spesialis') || 'all';
  const initialHari = searchParams.get('hari') || 'all';
  const initialPenjamin = searchParams.get('penjamin') || 'all';
  const initialPoli = searchParams.get('poli') || 'all';

  const [searchQuery, setSearchQuery] = useState(initialQ);
  const [selectedSpecialty, setSelectedSpecialty] = useState(initialSpecialty);
  const [selectedHari, setSelectedHari] = useState(initialHari);
  const [selectedPenjamin, setSelectedPenjamin] = useState(initialPenjamin);
  const [selectedPoli, setSelectedPoli] = useState(initialPoli);

  // Sinkronisasi saat URL berubah eksternal
  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
    setSelectedSpecialty(searchParams.get('spesialis') || 'all');
    setSelectedHari(searchParams.get('hari') || 'all');
    setSelectedPenjamin(searchParams.get('penjamin') || 'all');
    setSelectedPoli(searchParams.get('poli') || 'all');
  }, [searchParams]);

  // Fungsi pembaruan URL yang konsisten tanpa race condition
  const updateUrl = (newParams: {
    q?: string;
    spesialis?: string;
    hari?: string;
    penjamin?: string;
    poli?: string;
  }) => {
    const qVal = newParams.q !== undefined ? newParams.q : searchQuery;
    const sVal = newParams.spesialis !== undefined ? newParams.spesialis : selectedSpecialty;
    const hVal = newParams.hari !== undefined ? newParams.hari : selectedHari;
    const pVal = newParams.penjamin !== undefined ? newParams.penjamin : selectedPenjamin;
    const poVal = newParams.poli !== undefined ? newParams.poli : selectedPoli;

    const current = new URLSearchParams();
    if (qVal.trim()) current.set('q', qVal.trim());
    if (sVal && sVal !== 'all') current.set('spesialis', sVal);
    if (hVal && hVal !== 'all') current.set('hari', hVal);
    if (pVal && pVal !== 'all') current.set('penjamin', pVal);
    if (poVal && poVal !== 'all') current.set('poli', poVal);

    startTransition(() => {
      const qs = current.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedSpecialty('all');
    setSelectedHari('all');
    setSelectedPenjamin('all');
    setSelectedPoli('all');
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  };

  // Filter dokter
  const filteredDoctors = filterDoctors({
    searchQuery,
    specialtyId: selectedSpecialty,
    hari: selectedHari as Hari,
    penjamin: selectedPenjamin as Penjamin,
    poli: selectedPoli as PoliCategory,
  });

  return (
    <div className="space-y-8">
      
      {/* PANEL FILTER MULTI-DIMENSI */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-tower-100 shadow-md space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-tower-100 pb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-tower-700" aria-hidden="true" />
            <h2 className="font-display font-bold text-lg text-tower-900">
              Filter Pencarian Dokter
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-ink-soft">
              Menampilkan <strong>{filteredDoctors.length}</strong> dari {DOCTORS.length} dokter fiktif
            </span>
            {(searchQuery || selectedSpecialty !== 'all' || selectedHari !== 'all' || selectedPenjamin !== 'all' || selectedPoli !== 'all') && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-tower-50 hover:bg-tower-100 text-xs font-bold text-tower-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filter</span>
              </button>
            )}
          </div>
        </div>

        {/* INPUT PENCARIAN NAMA */}
        <div className="relative">
          <label htmlFor="search-doctor" className="sr-only">
            Cari Nama Dokter atau Bidang Keahlian
          </label>
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-soft">
            <Search className="w-5 h-5" aria-hidden="true" />
          </div>
          <input
            id="search-doctor"
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              updateUrl({ q: e.target.value });
            }}
            placeholder="Cari nama dokter atau subspesialisasi (misal: Fauzi, Kardiologi, Ginjal)..."
            className="w-full min-h-[48px] pl-11 pr-4 py-2.5 rounded-xl bg-ivory text-tower-950 text-sm border border-tower-100 focus:border-tower-700 focus:outline-none focus:ring-1 focus:ring-tower-700 shadow-sm"
          />
        </div>

        {/* BARIS SELECTOR DROPDOWN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. SPESIALISASI */}
          <div>
            <label htmlFor="filter-specialty" className="block text-xs font-bold text-tower-900 uppercase tracking-wider mb-1.5">
              Poliklinik
            </label>
            <select
              id="filter-specialty"
              value={selectedSpecialty}
              onChange={(e) => {
                setSelectedSpecialty(e.target.value);
                updateUrl({ spesialis: e.target.value });
              }}
              className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-ivory text-tower-950 text-xs font-semibold border border-tower-100 focus:border-tower-700 focus:outline-none"
            >
              <option value="all">Semua Poliklinik ({SPECIALTIES.length})</option>
              {SPECIALTIES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* 2. HARI PRAKTIK */}
          <div>
            <label htmlFor="filter-day" className="block text-xs font-bold text-tower-900 uppercase tracking-wider mb-1.5">
              Hari Praktik
            </label>
            <select
              id="filter-day"
              value={selectedHari}
              onChange={(e) => {
                setSelectedHari(e.target.value);
                updateUrl({ hari: e.target.value });
              }}
              className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-ivory text-tower-950 text-xs font-semibold border border-tower-100 focus:border-tower-700 focus:outline-none"
            >
              {DAYS_OPTIONS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          {/* 3. PENJAMIN */}
          <div>
            <label htmlFor="filter-penjamin" className="block text-xs font-bold text-tower-900 uppercase tracking-wider mb-1.5">
              Mitra Penjamin
            </label>
            <select
              id="filter-penjamin"
              value={selectedPenjamin}
              onChange={(e) => {
                setSelectedPenjamin(e.target.value);
                updateUrl({ penjamin: e.target.value });
              }}
              className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-ivory text-tower-950 text-xs font-semibold border border-tower-100 focus:border-tower-700 focus:outline-none"
            >
              <option value="all">Semua Penjamin</option>
              <option value="bpjs">BPJS Kesehatan</option>
              <option value="umum">Umum (Mandiri)</option>
              <option value="asuransi">Asuransi Swasta</option>
            </select>
          </div>

          {/* 4. JENIS POLIKLINIK */}
          <div>
            <label htmlFor="filter-poli" className="block text-xs font-bold text-tower-900 uppercase tracking-wider mb-1.5">
              Jenis Layanan Poli
            </label>
            <select
              id="filter-poli"
              value={selectedPoli}
              onChange={(e) => {
                setSelectedPoli(e.target.value);
                updateUrl({ poli: e.target.value });
              }}
              className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-ivory text-tower-950 text-xs font-semibold border border-tower-100 focus:border-tower-700 focus:outline-none"
            >
              <option value="all">Semua Layanan</option>
              <option value="reguler">Poli Reguler</option>
              <option value="eksekutif">Poli Eksekutif</option>
            </select>
          </div>
        </div>
      </div>

      {/* HASIL DIREKTORI DOKTER */}
      <div className="space-y-6">
        {filteredDoctors.length === 0 ? (
          /* EMPTY STATE */
          <div className="bg-white rounded-2xl p-12 text-center border border-tower-100 space-y-4">
            <div className="w-14 h-14 rounded-full bg-tower-50 mx-auto flex items-center justify-center text-tower-700">
              <Stethoscope className="w-7 h-7" aria-hidden="true" />
            </div>
            <h3 className="font-display font-bold text-xl text-tower-900">
              Tidak Ada Dokter yang Sesuai Kriteria
            </h3>
            <p className="text-ink-soft text-sm max-w-md mx-auto">
              Tidak ditemukan dokter spesialis dengan kombinasi filter yang Anda pilih. Coba sesuaikan kata kunci pencarian atau reset filter.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-tower-800 text-ivory font-bold text-sm hover:bg-tower-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Semua Filter</span>
            </button>
          </div>
        ) : (
          /* GRID KARTU DOKTER */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => {
              const specialty = SPECIALTIES.find((s) => s.id === doc.specialtyId);
              const initials = doc.name
                .replace(/^dr\.\s*/i, '')
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase();

              return (
                <div
                  key={doc.slug}
                  className="bg-white rounded-2xl p-6 border border-tower-100 shadow-sm hover:shadow-md hover:border-tower-700/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* AVATAR INISIAL & LENCANA ILUSTRASI */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-tower-800 to-tower-950 text-gold-300 font-display font-bold text-lg flex items-center justify-center border border-gold-500/30 shadow-sm shrink-0">
                          {initials}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-tower-700 uppercase tracking-wider block">
                            {specialty?.name}
                          </span>
                          <h3 className="font-display font-bold text-base text-tower-950 leading-tight">
                            {doc.title}
                          </h3>
                        </div>
                      </div>

                      {/* LENCANA ILUSTRASI WAJIB (FR-04) */}
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gold-100 text-tower-950 border border-gold-500/40 shrink-0">
                        Ilustrasi
                      </span>
                    </div>

                    {/* SUBSPESIALISASI */}
                    {doc.subSpecialty && (
                      <div className="text-xs text-ink-soft bg-ivory px-3 py-1.5 rounded-lg border border-tower-50">
                        <strong>Fokus:</strong> {doc.subSpecialty}
                      </div>
                    )}

                    {/* TAG PENJAMIN & POLI */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {doc.penjamin.includes('bpjs') && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          BPJS Kesehatan
                        </span>
                      )}
                      {doc.poli.includes('eksekutif') && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-tower-100 text-tower-900 border border-tower-600/20">
                          Poli Eksekutif
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-stone-100 text-stone-700">
                        Umum / Asuransi
                      </span>
                    </div>

                    {/* JADWAL PRAKTIK RINGKAS */}
                    <div className="pt-2 border-t border-tower-50 space-y-1.5">
                      <span className="text-[11px] font-bold text-ink-soft uppercase tracking-wider block">
                        Jadwal Praktik:
                      </span>
                      <div className="space-y-1">
                        {doc.schedule.slice(0, 3).map((sch, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-xs text-ink"
                          >
                            <span className="font-semibold capitalize flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-tower-700" />
                              {sch.hari}
                            </span>
                            <span className="text-ink-soft font-mono">
                              {sch.mulai} - {sch.selesai} ({sch.poli})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CTA KARTU */}
                  <div className="pt-5 mt-4 border-t border-tower-50 flex items-center justify-between gap-2">
                    <Link
                      href={`/dokter/${doc.slug}`}
                      className="text-xs font-bold text-tower-800 hover:text-tower-600 inline-flex items-center gap-1"
                    >
                      <span>Lihat Profil Lengkap</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      href={`/daftar?dokter=${doc.slug}`}
                      className="px-3.5 py-1.5 rounded-lg bg-tower-800 hover:bg-tower-700 text-ivory text-xs font-bold shadow-sm transition-colors"
                    >
                      Daftar
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
