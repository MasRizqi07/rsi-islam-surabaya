'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SPECIALTIES } from '@/data/specialties';
import { Search, Stethoscope, Calendar } from 'lucide-react';

const DAYS = [
  { value: 'all', label: 'Semua Hari Praktik' },
  { value: 'senin', label: 'Senin' },
  { value: 'selasa', label: 'Selasa' },
  { value: 'rabu', label: 'Rabu' },
  { value: 'kamis', label: 'Kamis' },
  { value: 'jumat', label: 'Jumat' },
  { value: 'sabtu', label: 'Sabtu' },
];

export function QuickDoctorSearch() {
  const router = useRouter();
  const [specialtyId, setSpecialtyId] = useState('all');
  const [hari, setHari] = useState('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (specialtyId !== 'all') params.set('spesialis', specialtyId);
    if (hari !== 'all') params.set('hari', hari);
    router.push(`/dokter?${params.toString()}`);
  };

  return (
    <div className="bg-tower-900 rounded-2xl p-6 sm:p-8 text-ivory border border-gold-500/30 shadow-xl">
      <div className="max-w-2xl">
        <span className="text-xs uppercase tracking-widest font-mono text-gold-300 block mb-1">
          Pencarian Cepat Jadwal Dokter
        </span>
        <h3 className="font-display font-bold text-2xl text-ivory">
          Cari Dokter Spesialis & Jadwal Praktik
        </h3>
        <p className="text-ivory/70 text-sm mt-1 mb-6">
          Pilih poliklinik spesialis dan hari kunjungan yang Anda rencanakan untuk melihat jadwal praktik dokter terkait.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
        {/* PILIH SPESIALIS */}
        <div className="sm:col-span-5 relative">
          <label htmlFor="quick-specialty" className="sr-only">
            Pilih Poliklinik Spesialis
          </label>
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-tower-700">
            <Stethoscope className="w-5 h-5" aria-hidden="true" />
          </div>
          <select
            id="quick-specialty"
            value={specialtyId}
            onChange={(e) => setSpecialtyId(e.target.value)}
            className="w-full min-h-[48px] pl-11 pr-8 py-2.5 rounded-xl bg-ivory text-tower-950 font-medium text-sm border-2 border-transparent focus:border-gold-500 focus:outline-none focus:ring-0 shadow-sm"
          >
            <option value="all">Semua Poliklinik (20 Poli)</option>
            {SPECIALTIES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* PILIH HARI */}
        <div className="sm:col-span-4 relative">
          <label htmlFor="quick-day" className="sr-only">
            Pilih Hari Praktik
          </label>
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-tower-700">
            <Calendar className="w-5 h-5" aria-hidden="true" />
          </div>
          <select
            id="quick-day"
            value={hari}
            onChange={(e) => setHari(e.target.value)}
            className="w-full min-h-[48px] pl-11 pr-8 py-2.5 rounded-xl bg-ivory text-tower-950 font-medium text-sm border-2 border-transparent focus:border-gold-500 focus:outline-none focus:ring-0 shadow-sm"
          >
            {DAYS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        {/* TOMBOL SUBMIT */}
        <div className="sm:col-span-3">
          <button
            type="submit"
            className="w-full min-h-[48px] px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 active:bg-gold-600 text-tower-950 font-bold text-sm shadow-md press-feedback transition-[background-color,transform] duration-150 flex items-center justify-center gap-2 focus:ring-2 focus:ring-ivory focus:outline-none"
          >
            <Search className="w-4 h-4" aria-hidden="true" />
            <span>Cari Dokter</span>
          </button>
        </div>
      </form>

      {/* QUICK SPECIALTY SHORTCUT PILLS */}
      <div className="mt-4 pt-4 border-t border-gold-500/20 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-ivory/60 text-[11px] font-bold uppercase tracking-wider">
          Pilihan Cepat:
        </span>
        {[
          { id: 'sp-penyakit-dalam', label: 'Penyakit Dalam' },
          { id: 'sp-anak', label: 'Spesialis Anak' },
          { id: 'sp-jantung', label: 'Jantung & Vaskular' },
          { id: 'sp-obgyn', label: 'Kebidanan & Kandungan' },
          { id: 'sp-mata', label: 'Klinik Mata' },
        ].map((pill) => (
          <button
            key={pill.id}
            type="button"
            onClick={() => {
              setSpecialtyId(pill.id);
              router.push(`/dokter?spesialis=${pill.id}`);
            }}
            className="px-2.5 py-1 rounded-lg bg-tower-800/80 hover:bg-gold-500 hover:text-tower-950 text-ivory/90 text-xs border border-gold-500/20 press-feedback transition-[color,background-color,border-color] duration-150"
          >
            {pill.label}
          </button>
        ))}
      </div>
    </div>
  );
}
