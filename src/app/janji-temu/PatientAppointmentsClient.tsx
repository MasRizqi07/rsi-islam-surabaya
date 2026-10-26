'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  User,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Building2,
  Stethoscope,
  PlusCircle,
  RotateCcw,
  Trash2,
  LogIn,
  LogOut,
  Info,
} from 'lucide-react';

interface AppointmentItem {
  id: string;
  appointmentNumber: string;
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  timeSlot: string;
  penjamin: string;
  poli: string;
  status: 'BOOKED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  createdAt: string;
  doctor?: {
    id: string;
    name: string;
    title: string;
    slug: string;
    specialtyId?: string;
  };
  polyclinic?: {
    id: string;
    name: string;
    buildingId: string;
    floor: number;
  };
}

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: 'PATIENT' | 'ADMIN';
}

export function PatientAppointmentsClient() {
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'BOOKED' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [cancelModalApt, setCancelModalApt] = useState<AppointmentItem | null>(null);
  const [bannerNotice, setBannerNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // 1. Muat Sesi Pengguna
  const loadSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        return data.user;
      } else {
        setCurrentUser(null);
        return null;
      }
    } catch {
      setCurrentUser(null);
      return null;
    }
  }, []);

  // 2. Muat Daftar Janji Temu
  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/patient/appointments');
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.appointments || []);
      }
    } catch (err) {
      console.error('Gagal mengambil janji temu:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession().then((user) => {
      if (user) {
        loadAppointments();
      } else {
        setLoading(false);
      }
    });
  }, [loadSession, loadAppointments]);

  // Helper 1-Klik Login Demo Pasien
  const handleQuickLogin = async () => {
    setActionLoading('login');
    setBannerNotice(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'pasien.demo@rsi-surabaya.test',
          password: 'PasswordDemo123!',
        }),
      });

      if (res.ok) {
        const user = await loadSession();
        if (user) {
          await loadAppointments();
          setBannerNotice({
            type: 'success',
            message: 'Berhasil masuk sebagai Pasien Demo (Ahmad Fauzi).',
          });
        }
      } else {
        setBannerNotice({
          type: 'error',
          message: 'Gagal melakukan login demo otomatis.',
        });
      }
    } catch {
      setBannerNotice({
        type: 'error',
        message: 'Terjadi gangguan jaringan saat login.',
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Helper Logout
  const handleLogout = async () => {
    setActionLoading('logout');
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setCurrentUser(null);
      setAppointments([]);
      setBannerNotice({
        type: 'success',
        message: 'Sesi telah ditutup (Logout berhasil).',
      });
    } catch {
      // ignore
    } finally {
      setActionLoading(null);
    }
  };

  // 3. Batalkan Janji Temu (DELETE /api/patient/appointments/[id])
  const handleConfirmCancel = async () => {
    if (!cancelModalApt) return;
    const targetId = cancelModalApt.id;
    setActionLoading(targetId);
    setBannerNotice(null);

    try {
      const res = await fetch(`/api/patient/appointments/${targetId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        // Perbarui status secara reaktif di state lokal
        setAppointments((prev) =>
          prev.map((apt) => (apt.id === targetId ? { ...apt, status: 'CANCELLED' } : apt))
        );
        setBannerNotice({
          type: 'success',
          message: `Janji temu ${cancelModalApt.appointmentNumber} berhasil dibatalkan. Slot waktu dokter telah dibuka kembali.`,
        });
        setCancelModalApt(null);
      } else {
        setBannerNotice({
          type: 'error',
          message: data.error || 'Gagal membatalkan janji temu.',
        });
        setCancelModalApt(null);
      }
    } catch {
      setBannerNotice({
        type: 'error',
        message: 'Terjadi gangguan saat membatalkan janji.',
      });
      setCancelModalApt(null);
    } finally {
      setActionLoading(null);
    }
  };

  // Filter daftar berdasarkan status
  const filteredAppointments = appointments.filter((apt) => {
    if (statusFilter === 'ALL') return true;
    return apt.status === statusFilter;
  });

  const countBooked = appointments.filter((a) => a.status === 'BOOKED').length;
  const countCompleted = appointments.filter((a) => a.status === 'COMPLETED').length;
  const countCancelled = appointments.filter((a) => a.status === 'CANCELLED').length;

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4 space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-tower-100 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl skeleton-shimmer mx-auto" />
          <div className="space-y-2">
            <div className="h-8 w-64 skeleton-shimmer mx-auto rounded-lg" />
            <div className="h-4 w-96 max-w-full skeleton-shimmer mx-auto rounded-md" />
          </div>
          <div className="h-20 w-full skeleton-shimmer rounded-xl" />
          <div className="h-12 w-64 skeleton-shimmer mx-auto rounded-xl" />
        </div>
      </div>
    );
  }

  // Jika Belum Login
  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4 space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-tower-100 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-tower-100 text-tower-800 flex items-center justify-center mx-auto shadow-sm">
            <User className="w-8 h-8 text-tower-800" />
          </div>

          <div className="space-y-2">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-tower-950">
              Riwayat Janji Temu Pasien
            </h2>
            <p className="text-sm text-ink-soft max-w-md mx-auto leading-relaxed">
              Silakan masuk ke sesi Pasien Demo untuk melihat jadwal konsultasi, status registrasi, atau melakukan pembatalan janji temu mandiri.
            </p>
          </div>

          {/* BANNER PRIVASI PRD §5 */}
          <div className="p-4 rounded-xl bg-alert-50 border border-alert-600/30 text-left flex items-start gap-3 text-alert-700 text-xs sm:text-sm">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-alert-600" />
            <div>
              <strong className="block text-alert-800 font-bold">Lingkungan Simulasi Portofolio:</strong>
              Akses akun demo fiktif ini telah disediakan untuk pengujian fungsionalitas fullstack (RBAC & State Persistence).
            </div>
          </div>

          {/* TOMBOL AKSI LOGIN */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleQuickLogin}
              disabled={actionLoading === 'login'}
              className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl bg-tower-800 hover:bg-tower-900 text-ivory font-bold text-sm shadow-md press-feedback transition-[background-color,transform] duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{actionLoading === 'login' ? 'Menghubungkan...' : 'Masuk sebagai Pasien Demo (1-Klik)'}</span>
            </button>

            <Link
              href="/login"
              className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl bg-ivory hover:bg-tower-100 text-tower-900 font-bold text-sm border border-tower-200 press-feedback transition-[background-color,border-color,transform] duration-150 flex items-center justify-center gap-2"
            >
              <span>Halaman Login Lengkap</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* NOTIFIKASI BANNER */}
      {bannerNotice && (
        <div
          role="alert"
          className={`p-4 rounded-2xl border text-sm flex items-center justify-between gap-3 shadow-xs animate-in fade-in duration-200 ${
            bannerNotice.type === 'success'
              ? 'bg-tower-50 border-tower-300 text-tower-900'
              : 'bg-alert-50 border-alert-300 text-alert-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {bannerNotice.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-tower-700 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-alert-600 shrink-0" />
            )}
            <span>{bannerNotice.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setBannerNotice(null)}
            className="text-xs font-bold uppercase tracking-wider text-tower-700 hover:text-tower-900"
          >
            Tutup
          </button>
        </div>
      )}

      {/* KARTU PROFIL PASIEN AKTIF & AKSI CEPAT */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-tower-100 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-tower-800 text-ivory flex items-center justify-center shrink-0 shadow-sm font-bold text-xl">
            {currentUser?.name?.charAt(0) || 'P'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-lg sm:text-xl text-tower-950">
                {currentUser?.name}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-tower-100 text-tower-800 border border-tower-200 uppercase">
                {currentUser?.role}
              </span>
            </div>
            <p className="text-xs text-ink-soft font-mono">
              {currentUser?.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/daftar"
            className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl bg-tower-800 hover:bg-tower-900 text-ivory font-bold text-xs sm:text-sm shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Buat Janji Baru</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            disabled={actionLoading === 'logout'}
            className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-2.5 rounded-xl bg-ivory hover:bg-tower-100 text-tower-900 font-bold text-xs border border-tower-200 transition"
            title="Keluar dari sesi"
          >
            <LogOut className="w-4 h-4 text-tower-700" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* RINGKASAN STATISTIK */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-tower-100 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-soft block">
            Total Janji
          </span>
          <span className="font-display font-bold text-2xl sm:text-3xl text-tower-950 block mt-1">
            {appointments.length}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-tower-100 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-tower-700 block">
            Aktif (Booked)
          </span>
          <span className="font-display font-bold text-2xl sm:text-3xl text-tower-800 block mt-1">
            {countBooked}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-tower-100 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 block">
            Selesai
          </span>
          <span className="font-display font-bold text-2xl sm:text-3xl text-sky-800 block mt-1">
            {countCompleted}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-tower-100 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
            Dibatalkan
          </span>
          <span className="font-display font-bold text-2xl sm:text-3xl text-stone-600 block mt-1">
            {countCancelled}
          </span>
        </div>
      </div>

      {/* FILTER TAB BAR */}
      <div className="flex items-center gap-2 border-b border-tower-100 pb-3 overflow-x-auto text-xs font-bold">
        {[
          { key: 'ALL', label: `Semua (${appointments.length})` },
          { key: 'BOOKED', label: `Aktif (${countBooked})` },
          { key: 'COMPLETED', label: `Selesai (${countCompleted})` },
          { key: 'CANCELLED', label: `Dibatalkan (${countCancelled})` },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setStatusFilter(tab.key as typeof statusFilter)}
            className={`px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
              statusFilter === tab.key
                ? 'bg-tower-800 text-ivory shadow-xs'
                : 'bg-white hover:bg-tower-50 text-tower-900 border border-tower-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* DAFTAR KARTU JANJI TEMU */}
      {loading ? (
        <div className="py-12 text-center text-ink-soft space-y-2">
          <RotateCcw className="w-6 h-6 animate-spin mx-auto text-tower-700" />
          <p className="text-sm">Memuat data janji temu dari database...</p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-tower-100 shadow-sm space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-tower-50 text-tower-700 flex items-center justify-center mx-auto">
            <Calendar className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-bold text-lg text-tower-950">
              Tidak Ada Janji Temu Ditemukan
            </h3>
            <p className="text-xs sm:text-sm text-ink-soft max-w-sm mx-auto">
              {statusFilter === 'ALL'
                ? 'Anda belum memiliki jadwal reservasi janji temu dokter.'
                : `Tidak ada data janji temu dengan filter status ${statusFilter}.`}
            </p>
          </div>
          <Link
            href="/daftar"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-tower-800 hover:bg-tower-900 text-ivory font-bold text-xs sm:text-sm shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Reservasi Janji Sekarang</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((apt) => {
            const isBooked = apt.status === 'BOOKED';
            const isCancelled = apt.status === 'CANCELLED';
            const isCompleted = apt.status === 'COMPLETED';

            return (
              <div
                key={apt.id}
                className={`bg-white rounded-2xl p-5 sm:p-6 border transition shadow-sm space-y-4 ${
                  isBooked
                    ? 'border-tower-200 hover:border-tower-400'
                    : isCancelled
                    ? 'border-stone-200 bg-stone-50/50 opacity-80'
                    : 'border-sky-200'
                }`}
              >
                {/* BARIS ATAS: KODE TIKET & STATUS BADGE */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-tower-50 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs sm:text-sm text-tower-900 bg-tower-50 px-2.5 py-1 rounded-lg border border-tower-100">
                      {apt.appointmentNumber}
                    </span>
                    <span className="text-[11px] text-ink-soft capitalize">
                      Jalur {apt.penjamin} · Poli {apt.poli}
                    </span>
                  </div>

                  <div>
                    {isBooked && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-tower-100 text-tower-900 border border-tower-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-tower-700" />
                        <span>Terkonfirmasi (Aktif)</span>
                      </span>
                    )}
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-900 border border-sky-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-700" />
                        <span>Kunjungan Selesai</span>
                      </span>
                    )}
                    {isCancelled && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-600 border border-stone-300">
                        <XCircle className="w-3.5 h-3.5 text-stone-500" />
                        <span className="line-through">Dibatalkan</span>
                      </span>
                    )}
                    {apt.status === 'NO_SHOW' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-alert-50 text-alert-800 border border-alert-200">
                        <AlertCircle className="w-3.5 h-3.5 text-alert-600" />
                        <span>Tidak Hadir</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* KONTEN UTAMA: DOKTER, POLI, & LOKASI */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
                  {/* DOKTER */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-tower-100 text-tower-800 flex items-center justify-center shrink-0">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-ink-soft block">
                        Dokter Pemeriksa:
                      </span>
                      <strong className="font-bold text-tower-950 block text-sm sm:text-base">
                        {apt.doctor?.title || apt.doctor?.name || 'Dokter Spesialis'}
                      </strong>
                    </div>
                  </div>

                  {/* POLI & LOKASI GEDUNG */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gold-100 text-gold-900 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-tower-800" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-ink-soft block">
                        Poliklinik & Ruang:
                      </span>
                      <strong className="font-bold text-tower-950 block">
                        {apt.polyclinic?.name || 'Poliklinik Rawat Jalan'}
                      </strong>
                      <span className="text-[11px] text-ink-soft block">
                        Gedung {apt.polyclinic?.buildingId?.toUpperCase()} Lantai {apt.polyclinic?.floor || 1}
                      </span>
                    </div>
                  </div>

                  {/* JADWAL WAKTU */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-tower-50 text-tower-800 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-tower-700" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-ink-soft block">
                        Waktu Konsultasi:
                      </span>
                      <strong className="font-bold text-tower-950 block">
                        {apt.appointmentDate}
                      </strong>
                      <span className="text-xs font-mono font-semibold text-tower-800 block">
                        Pukul {apt.timeSlot} WIB
                      </span>
                    </div>
                  </div>
                </div>

                {/* BARIS AKSI */}
                {isBooked && (
                  <div className="pt-3 border-t border-tower-50 flex items-center justify-between">
                    <span className="text-[11px] text-ink-soft flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-tower-600" />
                      <span>Pembatalan mandiri dibuka hingga sebelum waktu pelayanan dimulai.</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => setCancelModalApt(apt)}
                      disabled={actionLoading === apt.id}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-alert-50 hover:bg-alert-100 text-alert-700 hover:text-alert-900 font-bold text-xs border border-alert-200 transition cursor-pointer disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Batalkan Janji Temu</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL KONFIRMASI PEMBATALAN (US-5) */}
      {cancelModalApt && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-tower-950/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-tower-100 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-alert-50 text-alert-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-display font-bold text-xl text-tower-950">
                Batalkan Janji Temu?
              </h3>
              <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
                Anda akan membatalkan janji temu <strong className="font-mono text-tower-900">{cancelModalApt.appointmentNumber}</strong> untuk tanggal <strong>{cancelModalApt.appointmentDate}</strong> (pukul {cancelModalApt.timeSlot}).
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-ivory border border-tower-100 text-xs text-ink-soft space-y-1">
              <strong className="block text-tower-900">Perhatian:</strong>
              Slot waktu dokter ini akan langsung dibuka kembali di database untuk pasien lain. Tindakan pembatalan ini tercatat di audit log sistem.
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalApt(null)}
                disabled={actionLoading === cancelModalApt.id}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-ivory hover:bg-tower-100 text-tower-900 font-bold text-xs border border-tower-200 transition cursor-pointer"
              >
                Jangan Batalkan
              </button>

              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={actionLoading === cancelModalApt.id}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-alert-600 hover:bg-alert-700 text-white font-bold text-xs shadow-md transition cursor-pointer disabled:opacity-50"
              >
                {actionLoading === cancelModalApt.id ? 'Memproses...' : 'Ya, Batalkan Janji'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
