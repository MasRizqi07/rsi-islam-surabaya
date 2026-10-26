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
            className="w-full min-h-[48px] px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-300 active:bg-gold-700 text-tower-950 font-bold text-sm shadow-md transition-colors duration-150 flex items-center justify-center gap-2 focus:ring-2 focus:ring-ivory focus:outline-none"
          >
            <Search className="w-4 h-4" aria-hidden="true" />
            <span>Cari Dokter</span>
          </button>
        </div>
      </form>
    </div>
  );
}
