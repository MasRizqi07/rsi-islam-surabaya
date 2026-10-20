'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRegistrationStore } from '@/stores/registration-store';
import { SPECIALTIES } from '@/data/specialties';
import { DOCTORS } from '@/data/doctors';
import { Penjamin } from '@/data/types';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Printer,
  RotateCcw,
  Search,
} from 'lucide-react';

export function RegistrationWizardClient() {

  const {
    step,
    penjamin,
    specialtyId,
    doctorSlug,
    appointmentDate,
    timeSlot,
    patientName,
    patientPhone,
    patientNik,
    queueTicket,
    setStep,
    setPenjamin,
    setSpecialtyId,
    setDoctor,
    setAppointment,
    setPatientData,
    fillDemoData,
    submitRegistration,
    reset,
  } = useRegistrationStore();

  const [searchPoli, setSearchPoli] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Prefill dari URL query parameter (?dokter=... atau ?spesialis=...)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const searchParams = new URLSearchParams(window.location.search);
    const paramDoctor = searchParams.get('dokter');
    const paramSpecialty = searchParams.get('spesialis');

    if (paramDoctor) {
      const doc = DOCTORS.find((d) => d.slug === paramDoctor);
      if (doc) {
        setDoctor(doc.slug, doc.specialtyId);
        setStep(3);
        return;
      }
    }

    if (paramSpecialty) {
      const spec = SPECIALTIES.find((s) => s.id === paramSpecialty);
      if (spec) {
        setSpecialtyId(spec.id);
        setStep(3);
      }
    }
  }, [setDoctor, setSpecialtyId, setStep]);

  // Daftar poliklinik terfilter pencarian
  const filteredSpecialties = useMemo(() => {
    if (!searchPoli.trim()) return SPECIALTIES;
    const q = searchPoli.toLowerCase();
    return SPECIALTIES.filter(
      (s) => s.name.toLowerCase().includes(q) || s.summary.toLowerCase().includes(q)
    );
  }, [searchPoli]);

  // Daftar dokter yang sesuai dengan poliklinik terpilih
  const availableDoctors = useMemo(() => {
    if (!specialtyId) return [];
    return DOCTORS.filter((d) => {
      const matchSpec = d.specialtyId === specialtyId;
      if (!penjamin || penjamin === 'umum' || penjamin === 'asuransi') return matchSpec;
      // Jika BPJS, periksa apakah dokter menerima BPJS
      return matchSpec && d.penjamin.includes('bpjs');
    });
  }, [specialtyId, penjamin]);

  // Dokter yang sedang dipilih
  const selectedDoctor = useMemo(() => {
    return DOCTORS.find((d) => d.slug === doctorSlug);
  }, [doctorSlug]);

  // Generator tanggal kunjungan berdasarkan jadwal praktik dokter
  const availableDates = useMemo(() => {
    if (!selectedDoctor) return [];
    const daysMap: Record<string, number> = {
      senin: 1,
      selasa: 2,
      rabu: 3,
      kamis: 4,
      jumat: 5,
      sabtu: 6,
    };

    const practiceDayNumbers = selectedDoctor.schedule
      .map((sch) => daysMap[sch.hari.toLowerCase()])
      .filter((n): n is number => n !== undefined);

    const result: { dateStr: string; label: string; timeSlot: string }[] = [];
    const today = new Date();

    // Loop 14 hari ke depan mencari hari praktik
    for (let i = 1; i <= 14; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + i);
      const dayOfWeek = nextDay.getDay(); // 0 = Sunday, 1 = Monday, ...

      if (practiceDayNumbers.includes(dayOfWeek)) {
        // Cari slot waktu
        const dayName = Object.keys(daysMap).find((k) => daysMap[k] === dayOfWeek);
        const sch = selectedDoctor.schedule.find((s) => s.hari.toLowerCase() === dayName);

        const dateStr = nextDay.toISOString().split('T')[0];
        const formattedLabel = nextDay.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });

        result.push({
          dateStr,
          label: formattedLabel,
          timeSlot: sch ? `${sch.mulai} - ${sch.selesai} WIB` : '08:00 - 11:00 WIB',
        });

        if (result.length >= 4) break;
      }
    }

    return result;
  }, [selectedDoctor]);

  // Validasi form data pasien
  const handleValidateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!patientName.trim()) {
      errors.patientName = 'Nama pasien wajib diisi';
    }
    if (!patientPhone.trim()) {
      errors.patientPhone = 'Nomor telepon/WhatsApp wajib diisi';
    } else if (!/^08[0-9]{8,12}$/.test(patientPhone.replace(/\D/g, ''))) {
      errors.patientPhone = 'Format nomor WhatsApp simulasi harus diawali 08 (10–14 digit)';
    }
    if (!patientNik.trim()) {
      errors.patientNik = 'Nomor KTP simulasi wajib diisi';
    } else if (patientNik.replace(/\D/g, '').length !== 16) {
      errors.patientNik = 'Nomor KTP simulasi harus tepat 16 digit angka';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    submitRegistration();
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* 1. PROGRESS BAR / STEP INDICATOR (KOMPAK) */}
      <div aria-label="Langkah Pendaftaran" className="bg-white rounded-xl p-2.5 sm:p-3.5 border border-tower-100 shadow-xs">
        <ol className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {[
            { num: 1, title: 'Jalur Pelayanan' },
            { num: 2, title: 'Pilih Poliklinik' },
            { num: 3, title: 'Dokter & Jadwal' },
            { num: 4, title: 'Data Pasien' },
          ].map((s) => {
            const isActive = step === s.num;
            const isCompleted = step > s.num;

            return (
              <li
                key={s.num}
                className={`flex items-center gap-2 p-2 rounded-lg border transition-all duration-200 ${
                  isActive
                    ? 'bg-tower-800 text-ivory border-tower-800 font-bold shadow-xs'
                    : isCompleted
                    ? 'bg-tower-50 text-tower-900 border-tower-100 font-semibold'
                    : 'bg-ivory text-ink-soft border-tower-100/60'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${
                    isActive
                      ? 'bg-gold-500 text-tower-950'
                      : isCompleted
                      ? 'bg-tower-700 text-ivory'
                      : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.num}
                </span>
                <span className="truncate text-xs">{s.title}</span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* 2. COMPACT PRIVACY BANNER (FR-08) */}
      <div className="px-3.5 py-2.5 rounded-xl bg-gold-100 text-tower-950 font-medium border border-gold-500/40 text-xs flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <AlertTriangle className="w-4 h-4 text-tower-800 shrink-0" />
          <span className="text-xs leading-normal">
            <strong className="font-bold text-tower-900">Simulasi Demo:</strong> Dilarang memasukkan NIK atau data medis riil. Seluruh form diproses 100% lokal di browser.
          </span>
        </div>
        <span className="hidden sm:inline text-[11px] font-semibold text-tower-800 shrink-0 bg-gold-200/70 px-2 py-0.5 rounded-md">
          100% Client-Side
        </span>
      </div>

      {/* 3. KONTEN WIZARD SESUAI LANGKAH */}

      {/* ==================== LANGKAH 1: JALUR PELAYANAN ==================== */}
      {step === 1 && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-tower-100 shadow-sm space-y-5 transition-all duration-200">
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-gold-700">
              Langkah 1 dari 4
            </span>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-tower-950">
              Pilih Jalur Pasien & Mitra Penjamin
            </h2>
            <p className="text-xs sm:text-sm text-ink-soft">
              Tentukan jenis penjaminan pembiayaan yang akan digunakan untuk konsultasi rawat jalan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
            {[
              {
                id: 'bpjs' as Penjamin,
                title: 'BPJS Kesehatan',
                subtitle: 'Peserta JKN / KIS Aktif',
                desc: 'Memerlukan surat rujukan berjenjang dari FKTP (Puskesmas / Klinik Pratama).',
                badge: 'Tersedia di 20 Poli',
              },
              {
                id: 'umum' as Penjamin,
                title: 'Pasien Umum (Mandiri)',
                subtitle: 'Biaya Pribadi',
                desc: 'Pendaftaran mandiri langsung tanpa memerlukan surat rujukan FKTP.',
                badge: 'Poli Reguler & Eksekutif',
              },
              {
                id: 'asuransi' as Penjamin,
                title: 'Asuransi Swasta',
                subtitle: 'Klaim / Cashless',
                desc: 'Mendukung mitra asuransi kesehatan swasta nasional (AdMedika, Prudential, dll).',
                badge: 'Poli Reguler & Eksekutif',
              },
            ].map((opt) => {
              const isSelected = penjamin === opt.id;

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPenjamin(opt.id)}
                  className={`p-4 sm:p-5 rounded-xl text-left border-2 transition-all flex flex-col justify-between space-y-3 min-h-[140px] cursor-pointer ${
                    isSelected
                      ? 'border-tower-800 bg-tower-50/90 shadow-md ring-2 ring-tower-800/20'
                      : 'border-tower-100 bg-ivory hover:border-tower-300 hover:bg-white'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-tower-100 text-tower-900">
                        {opt.badge}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-tower-800" />
                      )}
                    </div>
                    <h3 className="font-display font-bold text-base sm:text-lg text-tower-950">
                      {opt.title}
                    </h3>
                    <p className="text-xs text-ink-soft leading-relaxed">
                      {opt.desc}
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-tower-700">
                    {opt.subtitle}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-tower-100 flex justify-end">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 min-h-[44px] px-6 py-2.5 rounded-xl bg-tower-800 hover:bg-tower-700 active:bg-tower-900 text-ivory font-bold text-sm shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <span>Lanjut ke Pilih Poliklinik</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ==================== LANGKAH 2: POLIKLINIK ==================== */}
      {step === 2 && (
        <div className="bg-white rounded-2xl p-5 sm:p-8 border border-tower-100 shadow-sm space-y-6 transition-all duration-200">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-700">
                Langkah 2 dari 4
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-tower-950">
                Pilih Poliklinik Spesialis
              </h2>
              <p className="text-sm text-ink-soft">
                Pilih salah satu dari 20 poliklinik rawat jalan terverifikasi.
              </p>
            </div>

            {/* PENCARIAN POLIKLINIK */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-ink-soft absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchPoli}
                onChange={(e) => setSearchPoli(e.target.value)}
                placeholder="Cari nama poliklinik..."
                className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-xl bg-ivory text-tower-950 text-xs font-semibold border border-tower-100 focus:border-tower-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[480px] overflow-y-auto pr-1">
            {filteredSpecialties.map((spec) => {
              const isSelected = specialtyId === spec.id;
              const doctorCount = DOCTORS.filter((d) => d.specialtyId === spec.id).length;

              return (
                <button
                  key={spec.id}
                  type="button"
                  onClick={() => {
                    setSpecialtyId(spec.id);
                  }}
                  className={`p-5 rounded-2xl text-left border transition-all flex flex-col justify-between space-y-3 min-h-[130px] ${
                    isSelected
                      ? 'border-tower-800 bg-tower-50/80 shadow-md ring-2 ring-tower-800/20'
                      : 'border-tower-100 bg-ivory hover:border-tower-300 hover:bg-white'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-gold-700 px-2 py-0.5 rounded bg-gold-100 border border-gold-500/30">
                        {spec.group}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-tower-800" />
                      )}
                    </div>
                    <h3 className="font-display font-bold text-base text-tower-950">
                      {spec.name}
                    </h3>
                    <p className="text-xs text-ink-soft line-clamp-2">
                      {spec.summary}
                    </p>
                  </div>

                  <span className="text-[11px] font-bold text-tower-700">
                    {doctorCount} Dokter Spesialis Tersedia
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-6 border-t border-tower-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 min-h-[48px] px-6 py-3 rounded-xl bg-ivory hover:bg-tower-100 text-tower-900 font-bold text-sm border border-tower-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>

            <button
              type="button"
              disabled={!specialtyId}
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 min-h-[48px] px-8 py-3 rounded-xl bg-tower-800 hover:bg-tower-700 disabled:opacity-40 disabled:cursor-not-allowed text-ivory font-bold text-sm shadow-md transition-all"
            >
              <span>Lanjut ke Dokter & Jadwal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ==================== LANGKAH 3: DOKTER & JADWAL ==================== */}
      {step === 3 && (
        <div className="bg-white rounded-2xl p-5 sm:p-8 border border-tower-100 shadow-sm space-y-6 transition-all duration-200">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-700">
              Langkah 3 dari 4
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-tower-950">
              Pilih Dokter Spesialis & Tanggal Praktik
            </h2>
            <p className="text-sm text-ink-soft">
              Pilih dokter spesialis serta tanggal kunjungan yang sesuai dengan jadwal praktik dokter.
            </p>
          </div>

          {/* PILIH DOKTER */}
          <div className="space-y-4">
            <span className="text-xs font-bold text-tower-900 uppercase tracking-wider block">
              1. Dokter Spesialis Tersedia:
            </span>

            {availableDoctors.length === 0 ? (
              <div className="p-8 text-center bg-ivory rounded-2xl border border-tower-100 space-y-2">
                <AlertTriangle className="w-6 h-6 text-gold-700 mx-auto" />
                <p className="text-sm font-semibold text-tower-950">
                  Tidak ada dokter spesialis untuk kombinasi ini.
                </p>
                <p className="text-xs text-ink-soft">
                  Coba kembali dan pilih poliklinik lain atau ubah jenis penjamin.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableDoctors.map((doc) => {
                  const isSelected = doctorSlug === doc.slug;
                  const initials = doc.name
                    .replace(/^dr\.\s*/i, '')
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase();

                  return (
                    <button
                      key={doc.slug}
                      type="button"
                      onClick={() => setDoctor(doc.slug)}
                      className={`p-5 rounded-2xl text-left border transition-all flex items-start gap-4 ${
                        isSelected
                          ? 'border-tower-800 bg-tower-50/80 shadow-md ring-2 ring-tower-800/20'
                          : 'border-tower-100 bg-ivory hover:border-tower-300 hover:bg-white'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-tower-800 to-tower-950 text-gold-300 font-display font-bold text-lg flex items-center justify-center shrink-0 border border-gold-500/30">
                        {initials}
                      </div>

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-display font-bold text-sm text-tower-950 truncate">
                            {doc.title}
                          </h3>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gold-100 text-tower-950 border border-gold-500/40 shrink-0">
                            Ilustrasi
                          </span>
                        </div>
                        {doc.subSpecialty && (
                          <p className="text-xs text-ink-soft truncate">
                            {doc.subSpecialty}
                          </p>
                        )}
                        <p className="text-[11px] text-tower-700 font-semibold pt-1">
                          Praktik: {doc.schedule.map((s) => s.hari).join(', ')}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* PILIH TANGGAL PRAKTIK & SLOT */}
          {selectedDoctor && (
            <div className="space-y-4 pt-4 border-t border-tower-100">
              <span className="text-xs font-bold text-tower-900 uppercase tracking-wider block">
                2. Tanggal & Slot Waktu Pemeriksaan Tersedia:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {availableDates.map((item) => {
                  const isSelected = appointmentDate === item.dateStr;

                  return (
                    <button
                      key={item.dateStr}
                      type="button"
                      onClick={() => setAppointment(item.dateStr, item.timeSlot)}
                      className={`p-4 rounded-xl text-left border transition-all space-y-1.5 ${
                        isSelected
                          ? 'border-tower-800 bg-tower-800 text-ivory shadow-md ring-2 ring-gold-500/40'
                          : 'border-tower-100 bg-ivory text-tower-950 hover:bg-white hover:border-tower-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Calendar className={`w-4 h-4 ${isSelected ? 'text-gold-300' : 'text-tower-700'}`} />
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-gold-300" />}
                      </div>
                      <span className="font-bold text-xs sm:text-sm block">
                        {item.label}
                      </span>
                      <div className={`flex items-center gap-1.5 text-xs ${isSelected ? 'text-ivory/80' : 'text-ink-soft'}`}>
                        <Clock className="w-3.5 h-3.5" />
                        <span>{item.timeSlot}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-tower-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 min-h-[48px] px-6 py-3 rounded-xl bg-ivory hover:bg-tower-100 text-tower-900 font-bold text-sm border border-tower-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>

            <button
              type="button"
              disabled={!doctorSlug || !appointmentDate || !timeSlot}
              onClick={() => setStep(4)}
              className="inline-flex items-center gap-2 min-h-[48px] px-8 py-3 rounded-xl bg-tower-800 hover:bg-tower-700 disabled:opacity-40 disabled:cursor-not-allowed text-ivory font-bold text-sm shadow-md transition-all"
            >
              <span>Lanjut ke Data Pasien</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ==================== LANGKAH 4: DATA PASIEN & KONFIRMASI ==================== */}
      {step === 4 && (
        <form onSubmit={handleValidateAndSubmit} className="bg-white rounded-2xl p-5 sm:p-8 border border-tower-100 shadow-sm space-y-6 transition-all duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-700">
                Langkah 4 dari 4
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-tower-950">
                Data Pasien Simulasi & Konfirmasi
              </h2>
              <p className="text-sm text-ink-soft">
                Lengkapi identitas simulasi untuk menerbitkan tiket antrean demo lokal.
              </p>
            </div>

            {/* HELPER 1-KLIK DEMO DATA */}
            <button
              type="button"
              onClick={fillDemoData}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold-100 hover:bg-gold-300 text-tower-950 font-bold text-xs border border-gold-500/40 shadow-sm transition-all shrink-0"
            >
              <Sparkles className="w-4 h-4 text-tower-800" />
              <span>Isi Data Simulasi Otomatis (1-Klik)</span>
            </button>
          </div>

          {/* RINGKASAN JADWAL TERPILIH */}
          <div className="bg-ivory rounded-2xl p-5 border border-tower-100 space-y-3">
            <span className="text-xs font-bold text-tower-900 uppercase tracking-wider block">
              Ringkasan Pendaftaran:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-ink-soft block">Jalur Penjamin:</span>
                <span className="font-bold text-tower-950 capitalize">{penjamin}</span>
              </div>
              <div>
                <span className="text-ink-soft block">Dokter & Poli:</span>
                <span className="font-bold text-tower-950">{selectedDoctor?.title}</span>
              </div>
              <div>
                <span className="text-ink-soft block">Tanggal & Waktu:</span>
                <span className="font-bold text-tower-950">{appointmentDate} ({timeSlot})</span>
              </div>
            </div>
          </div>

          {/* FORM INPUTS */}
          <div className="space-y-5">
            <div>
              <label htmlFor="patient-name" className="block text-xs font-bold text-tower-900 uppercase tracking-wider mb-1.5">
                Nama Lengkap Pasien (Simulasi) *
              </label>
              <input
                id="patient-name"
                type="text"
                value={patientName}
                onChange={(e) => setPatientData({ patientName: e.target.value })}
                placeholder="Contoh: Ahmad Fauzi (Gunakan nama fiktif)"
                className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-ivory text-tower-950 text-sm font-semibold border border-tower-100 focus:border-tower-700 focus:outline-none"
              />
              {formErrors.patientName && (
                <span className="text-xs font-semibold text-alert-600 mt-1 block">
                  {formErrors.patientName}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="patient-phone" className="block text-xs font-bold text-tower-900 uppercase tracking-wider mb-1.5">
                  Nomor WhatsApp Simulasi *
                </label>
                <input
                  id="patient-phone"
                  type="tel"
                  value={patientPhone}
                  onChange={(e) => setPatientData({ patientPhone: e.target.value })}
                  placeholder="081234567890"
                  className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-ivory text-tower-950 text-sm font-semibold border border-tower-100 focus:border-tower-700 focus:outline-none font-mono"
                />
                {formErrors.patientPhone && (
                  <span className="text-xs font-semibold text-alert-600 mt-1 block">
                    {formErrors.patientPhone}
                  </span>
                )}
              </div>

              <div>
                <label htmlFor="patient-nik" className="block text-xs font-bold text-tower-900 uppercase tracking-wider mb-1.5">
                  No. KTP Simulasi (16 Digit Angka Bebas) *
                </label>
                <input
                  id="patient-nik"
                  type="text"
                  maxLength={16}
                  value={patientNik}
                  onChange={(e) => setPatientData({ patientNik: e.target.value.replace(/\D/g, '') })}
                  placeholder="3578012345670001 (16 digit angka)"
                  className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-ivory text-tower-950 text-sm font-semibold border border-tower-100 focus:border-tower-700 focus:outline-none font-mono"
                />
                {formErrors.patientNik && (
                  <span className="text-xs font-semibold text-alert-600 mt-1 block">
                    {formErrors.patientNik}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-tower-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 min-h-[48px] px-6 py-3 rounded-xl bg-ivory hover:bg-tower-100 text-tower-900 font-bold text-sm border border-tower-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>

            <button
              id="btn-submit-registration"
              type="submit"
              className="inline-flex items-center gap-2 min-h-[48px] px-8 py-3 rounded-xl bg-tower-800 hover:bg-tower-700 text-ivory font-bold text-sm shadow-md transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Konfirmasi & Terbitkan Tiket Antrean Demo</span>
            </button>
          </div>
        </form>
      )}

      {/* ==================== LANGKAH 5: TIKET ANTREAN HASIL SUBMIT ==================== */}
      {step === 5 && queueTicket && (
        <div className="space-y-8">
          
          {/* KARTU TIKET ANTREAN BERGAYA KHATAM WATERMARK */}
          <div
            id="printable-ticket"
            className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border-2 border-gold-500/40 shadow-xl relative overflow-hidden bg-khatam-pattern space-y-6"
          >
            {/* HEADER TIKET */}
            <div className="border-b-2 border-dashed border-tower-100 pb-6 text-center space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-gold-700 font-bold block">
                Studi Kasus Portofolio · Tiket Antrean Demo
              </span>
              <h3 className="font-display font-bold text-2xl text-tower-950">
                RS Islam Surabaya A. Yani
              </h3>
              <p className="text-xs text-ink-soft">
                Loket Pendaftaran Rawat Jalan · Lantai Dasar Gedung Graha
              </p>
            </div>

            {/* NOMOR KODE ANTREAN UTAMA */}
            <div className="text-center py-4 bg-tower-50 rounded-2xl border border-tower-100 space-y-1">
              <span className="text-xs uppercase tracking-wider font-bold text-tower-700">
                Kode Registrasi Antrean:
              </span>
              <span className="font-mono font-bold text-3xl sm:text-4xl text-tower-950 tracking-wider block">
                {queueTicket.ticketCode}
              </span>
              <span className="text-[11px] text-ink-soft">
                Diterbitkan pada: {queueTicket.createdAt} WIB
              </span>
            </div>

            {/* DETAIL DATA TIKET */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div className="space-y-1">
                <span className="text-ink-soft block">Nama Pasien:</span>
                <span className="font-bold text-sm text-tower-950 block">{queueTicket.patientName}</span>
              </div>

              <div className="space-y-1">
                <span className="text-ink-soft block">NIK Simulasi:</span>
                <span className="font-mono font-semibold text-tower-950 block">
                  {queueTicket.patientNik.substring(0, 6)}******{queueTicket.patientNik.substring(12)}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-ink-soft block">Poliklinik Tujuan:</span>
                <span className="font-bold text-tower-950 block">{queueTicket.specialtyName}</span>
              </div>

              <div className="space-y-1">
                <span className="text-ink-soft block">Dokter Spesialis:</span>
                <span className="font-bold text-tower-950 block">{queueTicket.doctorTitle}</span>
              </div>

              <div className="space-y-1">
                <span className="text-ink-soft block">Tanggal Kunjungan:</span>
                <span className="font-bold text-tower-950 block">{queueTicket.appointmentDate}</span>
              </div>

              <div className="space-y-1">
                <span className="text-ink-soft block">Estimasi Jam Praktik:</span>
                <span className="font-bold text-tower-950 block">{queueTicket.timeSlot}</span>
              </div>
            </div>

            {/* 1D VECTOR BARCODE SIMULATOR (STITCH DESIGN SPEC) */}
            <div className="pt-2 flex flex-col items-center justify-center p-3 rounded-2xl bg-tower-50 border border-tower-100">
              <div className="flex items-center gap-0.5 h-10 py-1 px-3 bg-white rounded border border-tower-200">
                <div className="w-1 h-8 bg-tower-950" />
                <div className="w-0.5 h-8 bg-tower-950" />
                <div className="w-1.5 h-8 bg-tower-950" />
                <div className="w-0.5 h-8 bg-tower-950" />
                <div className="w-2 h-8 bg-tower-950" />
                <div className="w-0.5 h-8 bg-tower-950" />
                <div className="w-1 h-8 bg-tower-950" />
                <div className="w-2 h-8 bg-tower-950" />
                <div className="w-0.5 h-8 bg-tower-950" />
                <div className="w-1.5 h-8 bg-tower-950" />
                <div className="w-0.5 h-8 bg-tower-950" />
                <div className="w-1 h-8 bg-tower-950" />
                <div className="w-2 h-8 bg-tower-950" />
                <div className="w-1 h-8 bg-tower-950" />
                <div className="w-0.5 h-8 bg-tower-950" />
                <div className="w-1.5 h-8 bg-tower-950" />
                <div className="w-2 h-8 bg-tower-950" />
              </div>
              <span className="font-mono text-[10px] text-ink-soft tracking-widest mt-1 uppercase font-semibold">
                SCAN BARCODE PADA KIOSK ANJUNGAN MANDIRI
              </span>
            </div>

            {/* PANDUAN KEDATANGAN */}
            <div className="p-4 rounded-xl bg-ivory border border-tower-100 text-xs space-y-1.5 text-ink">
              <strong className="block text-tower-900 font-bold">
                Panduan Check-In di Rumah Sakit:
              </strong>
              <ul className="list-disc list-inside space-y-1 text-ink-soft leading-relaxed">
                <li>Harap hadir 30 menit sebelum jam praktik dimulai.</li>
                <li>Tunjukkan kode registrasi ini atau scan barcode pada anjungan mandiri.</li>
                <li>Bagi pasien BPJS, siapkan kartu BPJS asli dan surat rujukan FKTP.</li>
              </ul>
            </div>

            {/* FOOTER WATERMARK TIKET */}
            <div className="pt-4 border-t border-dashed border-tower-100 flex items-center justify-between text-[11px] text-ink-soft">
              <span>* Data simulasi lokal tanpa request jaringan.</span>
              <span className="font-bold text-tower-800">Konsep Hijau Tower</span>
            </div>
          </div>

          {/* AKSI CETAK & DAFTAR BARU */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              id="print-ticket-btn"
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 min-h-[48px] px-6 py-2.5 rounded-xl bg-tower-800 hover:bg-tower-700 text-ivory font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Tiket Antrean (Print)</span>
            </button>

            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 min-h-[48px] px-6 py-2.5 rounded-xl bg-ivory hover:bg-tower-50 text-tower-900 font-bold text-sm border border-tower-100 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Buat Pendaftaran Baru</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
