'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Calendar,
  Bed,
  History,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  XCircle,
  LogIn,
  LogOut,
  Stethoscope,
  Building2,
  User,
  Clock,
  Save,
  Trash2,
  RefreshCw,
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
  patient?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
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

interface BedItem {
  unit: string;
  status: 'tersedia' | 'terbatas' | 'penuh';
  note?: string | null;
}

interface AuditLogItem {
  id: string;
  actorId?: string | null;
  action: string;
  resource: string;
  statusBefore?: string | null;
  statusAfter?: string | null;
  timestamp: string;
  actor?: {
    id: string;
    name: string;
    role: string;
  } | null;
}

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: 'PATIENT' | 'ADMIN';
}

export function AdminDashboardClient() {
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [activeTab, setActiveTab] = useState<'appointments' | 'beds' | 'audit'>('appointments');
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [beds, setBeds] = useState<BedItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [bannerNotice, setBannerNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filter status appointment
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'BOOKED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'>('ALL');

  // 1. Cek Sesi Pengguna
  const loadSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        return data.user;
      }
      setCurrentUser(null);
      return null;
    } catch {
      setCurrentUser(null);
      return null;
    }
  }, []);

  // 2. Muat Semua Janji Temu (Admin Endpoint)
  const loadAppointments = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/appointments');
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.appointments || []);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  // 3. Muat Status Bed (Admin Endpoint)
  const loadBeds = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/bed-status');
      if (res.ok) {
        const data = await res.json();
        setBeds(data.beds || []);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  // 4. Muat Jejak Audit Log (Admin Endpoint)
  const loadAuditLogs = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/audit-logs');
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data.logs || []);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([loadAppointments(), loadBeds(), loadAuditLogs()]);
    setLoading(false);
  }, [loadAppointments, loadBeds, loadAuditLogs]);

  useEffect(() => {
    loadSession().then((user) => {
      if (user && user.role === 'ADMIN') {
        refreshAll();
      } else {
        setLoading(false);
      }
    });
  }, [loadSession, refreshAll]);

  // Helper 1-Klik Login Admin Demo
  const handleQuickAdminLogin = async () => {
    setActionLoading('login');
    setBannerNotice(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin.demo@rsi-surabaya.test',
          password: 'AdminSecure123!',
        }),
      });

      if (res.ok) {
        const user = await loadSession();
        if (user && user.role === 'ADMIN') {
          await refreshAll();
          setBannerNotice({
            type: 'success',
            message: 'Berhasil masuk sebagai Administrator Medis (dr. Siti Rahma).',
          });
        }
      } else {
        setBannerNotice({
          type: 'error',
          message: 'Autentikasi admin gagal.',
        });
      }
    } catch {
      setBannerNotice({
        type: 'error',
        message: 'Gangguan koneksi saat login admin.',
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
      setBeds([]);
      setAuditLogs([]);
      setBannerNotice({
        type: 'success',
        message: 'Sesi administrator telah ditutup.',
      });
    } finally {
      setActionLoading(null);
    }
  };

  // 5. Ubah Status Janji Temu (PATCH /api/admin/appointments/[id])
  const handleUpdateStatus = async (id: string, newStatus: 'COMPLETED' | 'NO_SHOW') => {
    setActionLoading(id);
    setBannerNotice(null);
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (res.ok) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
        );
        setBannerNotice({
          type: 'success',
          message: `Status janji temu ${data.appointment?.appointmentNumber} berhasil diubah menjadi ${newStatus}. Baris audit log tercatat otomatis.`,
        });
        loadAuditLogs();
      } else {
        setBannerNotice({
          type: 'error',
          message: data.error || 'Gagal mengubah status janji temu.',
        });
      }
    } catch {
      setBannerNotice({
        type: 'error',
        message: 'Terjadi gangguan jaringan saat memperbarui status.',
      });
    } finally {
      setActionLoading(null);
    }
  };

  // 6. Ubah Status Bed (PUT /api/admin/bed-status)
  const handleSaveBedStatus = async (unit: string, newStatus: string, note?: string | null) => {
    setActionLoading(`bed-${unit}`);
    setBannerNotice(null);
    try {
      const res = await fetch('/api/admin/bed-status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unit, status: newStatus, note }),
      });

      const data = await res.json();
      if (res.ok) {
        setBeds((prev) =>
          prev.map((b) => (b.unit === unit ? { ...b, status: newStatus as BedItem['status'], note } : b))
        );
        setBannerNotice({
          type: 'success',
          message: `Ketersediaan unit ${unit} berhasil diperbarui menjadi ${newStatus}. Perubahan langsung tercermin di /tower & audit log.`,
        });
        loadAuditLogs();
      } else {
        setBannerNotice({
          type: 'error',
          message: data.error || 'Gagal memperbarui status bed.',
        });
      }
    } catch {
      setBannerNotice({
        type: 'error',
        message: 'Terjadi gangguan jaringan saat menyimpan status bed.',
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Jika Belum Login atau Bukan Admin (RBAC Check)
  if ((!currentUser || currentUser.role !== 'ADMIN') && !loading) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4 space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-tower-100 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-gold-100 text-gold-900 flex items-center justify-center mx-auto shadow-sm">
            <ShieldCheck className="w-8 h-8 text-tower-800" />
          </div>

          <div className="space-y-2">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-tower-950">
              Panel Administrator Medis (RBAC)
            </h2>
            <p className="text-sm text-ink-soft max-w-md mx-auto leading-relaxed">
              Halaman ini terproteksi oleh otorisasi tingkat server (RBAC). Hanya akun dengan peran <code className="bg-tower-50 px-1.5 py-0.5 rounded font-mono font-bold text-tower-800">ADMIN</code> yang berhak mengelola janji temu, ketersediaan bed, dan audit trail.
            </p>
          </div>

          {currentUser?.role === 'PATIENT' && (
            <div className="p-4 rounded-xl bg-alert-50 border border-alert-600/30 text-left flex items-start gap-3 text-alert-700 text-xs sm:text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-alert-600" />
              <div>
                <strong className="block text-alert-800 font-bold">Akses Ditolak (403 Forbidden):</strong>
                Anda saat ini masuk sebagai <strong>{currentUser.name}</strong> dengan peran <strong>PATIENT</strong>. Anda tidak memiliki izin untuk melihat panel administrator.
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleQuickAdminLogin}
              disabled={actionLoading === 'login'}
              className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl bg-tower-800 hover:bg-tower-900 text-ivory font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{actionLoading === 'login' ? 'Menghubungkan...' : 'Masuk sebagai Admin Demo (1-Klik)'}</span>
            </button>

            <Link
              href="/login"
              className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl bg-ivory hover:bg-tower-100 text-tower-900 font-bold text-sm border border-tower-200 transition flex items-center justify-center gap-2"
            >
              <span>Halaman Login</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const filteredAppointments = appointments.filter((a) => {
    if (statusFilter === 'ALL') return true;
    return a.status === statusFilter;
  });

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

      {/* KARTU PROFIL ADMIN & AKSI CEPAT */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-tower-100 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gold-500 text-tower-950 flex items-center justify-center shrink-0 shadow-sm font-bold text-xl">
            <ShieldCheck className="w-8 h-8 text-tower-950" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-lg sm:text-xl text-tower-950">
                {currentUser?.name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gold-100 text-tower-950 border border-gold-400 uppercase">
                {currentUser?.role}
              </span>
            </div>
            <p className="text-xs text-ink-soft font-mono">
              {currentUser?.email} · Hak Akses Administrator Penuh
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={refreshAll}
            disabled={loading}
            className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-2.5 rounded-xl bg-tower-50 hover:bg-tower-100 text-tower-900 font-bold text-xs border border-tower-200 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Sinkronkan Data</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            disabled={actionLoading === 'logout'}
            className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-2.5 rounded-xl bg-ivory hover:bg-tower-100 text-tower-900 font-bold text-xs border border-tower-200 transition"
          >
            <LogOut className="w-4 h-4 text-tower-700" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* TAB NAVIGASI MODUL ADMIN */}
      <div className="flex items-center gap-2 border-b border-tower-100 pb-3 overflow-x-auto text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('appointments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeTab === 'appointments'
              ? 'bg-tower-800 text-ivory shadow-xs'
              : 'bg-white hover:bg-tower-50 text-tower-900 border border-tower-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Kelola Janji Temu ({appointments.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('beds')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeTab === 'beds'
              ? 'bg-tower-800 text-ivory shadow-xs'
              : 'bg-white hover:bg-tower-50 text-tower-900 border border-tower-100'
          }`}
        >
          <Bed className="w-4 h-4" />
          <span>Ketersediaan Bed Rawat Inap (P1)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeTab === 'audit'
              ? 'bg-tower-800 text-ivory shadow-xs'
              : 'bg-white hover:bg-tower-50 text-tower-900 border border-tower-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Jejak Audit Sistem ({auditLogs.length})</span>
        </button>
      </div>

      {/* KONTEN TAB 1: KELOLA JANJI TEMU (US-6) */}
      {activeTab === 'appointments' && (
        <div className="space-y-4">
          {/* FILTER SUB-BAR */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs font-semibold pb-1">
            <span className="text-ink-soft text-xs mr-1">Filter Status:</span>
            {[
              { key: 'ALL', label: 'Semua' },
              { key: 'BOOKED', label: 'Booked (Aktif)' },
              { key: 'COMPLETED', label: 'Selesai' },
              { key: 'NO_SHOW', label: 'Tidak Hadir' },
              { key: 'CANCELLED', label: 'Dibatalkan' },
            ].map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setStatusFilter(f.key as typeof statusFilter)}
                className={`px-3 py-1.5 rounded-lg border transition ${
                  statusFilter === f.key
                    ? 'bg-tower-100 border-tower-300 text-tower-900 font-bold'
                    : 'bg-white border-tower-100 text-ink-soft hover:text-tower-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-tower-100 text-ink-soft">
              Tidak ada janji temu ditemukan untuk filter ini.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAppointments.map((apt) => {
                const isBooked = apt.status === 'BOOKED';

                return (
                  <div
                    key={apt.id}
                    className="bg-white rounded-2xl p-5 border border-tower-100 shadow-xs space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-tower-50 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-tower-900 bg-tower-50 px-2 py-0.5 rounded border border-tower-100">
                          {apt.appointmentNumber}
                        </span>
                        <span className="text-xs font-semibold text-tower-950">
                          Pasien: {apt.patient?.name || 'Pasien Demo'}
                        </span>
                        <span className="text-[11px] text-ink-soft font-mono">
                          ({apt.patient?.email})
                        </span>
                      </div>

                      <div>
                        {apt.status === 'BOOKED' && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-tower-100 text-tower-900 border border-tower-300">
                            BOOKED
                          </span>
                        )}
                        {apt.status === 'COMPLETED' && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-900 border border-sky-300">
                            COMPLETED
                          </span>
                        )}
                        {apt.status === 'NO_SHOW' && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-alert-50 text-alert-700 border border-alert-200">
                            NO_SHOW
                          </span>
                        )}
                        {apt.status === 'CANCELLED' && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-stone-100 text-stone-600 border border-stone-300 line-through">
                            CANCELLED
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-ink-soft block">Dokter & Poli:</span>
                        <strong className="text-tower-950 block">{apt.doctor?.title}</strong>
                        <span className="text-[11px] text-ink-soft">
                          {apt.polyclinic?.name} (Gedung {apt.polyclinic?.buildingId?.toUpperCase()} Lt. {apt.polyclinic?.floor})
                        </span>
                      </div>

                      <div>
                        <span className="text-ink-soft block">Jadwal Praktik:</span>
                        <strong className="text-tower-950 block">{apt.appointmentDate}</strong>
                        <span className="text-[11px] font-mono text-tower-800">
                          Pukul {apt.timeSlot} WIB
                        </span>
                      </div>

                      <div>
                        <span className="text-ink-soft block">Jalur & Tipe Poli:</span>
                        <strong className="text-tower-950 capitalize block">
                          {apt.penjamin} · Poli {apt.poli}
                        </strong>
                        <span className="text-[11px] text-ink-soft">
                          Dibuat: {new Date(apt.createdAt).toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    {/* AKSI KHUSUS ADMINISTRATOR (US-6) */}
                    {isBooked && (
                      <div className="pt-2.5 border-t border-tower-50 flex items-center justify-between">
                        <span className="text-[11px] text-ink-soft">
                          Tindakan Administrator: Ubah status setelah pasien tiba atau tidak hadir.
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(apt.id, 'COMPLETED')}
                            disabled={actionLoading === apt.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-tower-800 hover:bg-tower-900 text-ivory font-bold text-xs shadow-xs transition cursor-pointer disabled:opacity-50"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Tandai Selesai (COMPLETED)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(apt.id, 'NO_SHOW')}
                            disabled={actionLoading === apt.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-alert-50 hover:bg-alert-100 text-alert-800 font-bold text-xs border border-alert-200 transition cursor-pointer disabled:opacity-50"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Tandai Tidak Hadir (NO_SHOW)</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* KONTEN TAB 2: KETERSEDIAAN BED (US-8 & S9) */}
      {activeTab === 'beds' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-tower-50 border border-tower-100 text-xs sm:text-sm text-tower-900 space-y-1">
            <strong className="font-bold block">Manajemen Ketersediaan Kamar Perawatan Kritis:</strong>
            Perubahan status kamar di bawah ini dieksekusi secara atomik ke basis data PostgreSQL bersama audit log <code className="bg-white px-1 py-0.5 rounded border font-mono">BED_STATUS_CHANGED</code> dan langsung tercermin di halaman Beranda dan <Link href="/tower" className="underline font-bold">/tower</Link>.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {beds.map((bed) => (
              <BedEditorCard
                key={bed.unit}
                bed={bed}
                onSave={handleSaveBedStatus}
                loading={actionLoading === `bed-${bed.unit}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* KONTEN TAB 3: AUDIT LOG (US-7) */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-ivory border border-tower-100 text-xs sm:text-sm text-ink-soft flex items-start gap-3">
            <Info className="w-5 h-5 text-tower-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-tower-900 font-bold">
                Jejak Audit Transaksional (PRD §5 & US-7):
              </strong>
              Setiap aksi autentikasi, pembuatan janji, perubahan status, dan pembaruan bed terekam tanpa kompromi. Sesuai aturan etika, nol alamat IP, User-Agent, atau email disimpan dalam tabel ini.
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-tower-100 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-tower-50 text-tower-900 border-b border-tower-100 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-3">Waktu</th>
                    <th className="p-3">Aksi (Action)</th>
                    <th className="p-3">Sumber Daya</th>
                    <th className="p-3">Transisi Status</th>
                    <th className="p-3">Aktor (Peran)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-tower-50">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-tower-50/50 transition">
                      <td className="p-3 whitespace-nowrap font-mono text-[11px] text-ink-soft">
                        {new Date(log.timestamp).toLocaleString('id-ID')}
                      </td>
                      <td className="p-3 font-mono font-bold text-tower-950">
                        {log.action}
                      </td>
                      <td className="p-3 font-mono text-ink-soft">
                        {log.resource}
                      </td>
                      <td className="p-3 text-[11px]">
                        {log.statusBefore || log.statusAfter ? (
                          <span className="font-mono">
                            <span className="text-stone-500">{log.statusBefore || 'null'}</span>
                            <span className="mx-1 text-tower-600">→</span>
                            <strong className="text-tower-900">{log.statusAfter || 'null'}</strong>
                          </span>
                        ) : (
                          <span className="text-stone-400">-</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="font-semibold text-tower-900">
                          {log.actor?.name || 'System / Unauth'}
                        </span>
                        {log.actor?.role && (
                          <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-tower-100 text-tower-800">
                            {log.actor.role}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BedEditorCard({
  bed,
  onSave,
  loading,
}: {
  bed: BedItem;
  onSave: (unit: string, status: string, note?: string | null) => void;
  loading: boolean;
}) {
  const [status, setStatus] = useState<BedItem['status']>(bed.status);
  const [note, setNote] = useState<string>(bed.note || '');

  return (
    <div className="bg-white rounded-2xl p-5 border border-tower-100 shadow-xs space-y-3">
      <div className="flex items-center justify-between border-b border-tower-50 pb-2">
        <div className="flex items-center gap-2">
          <Bed className="w-4 h-4 text-tower-700" />
          <h3 className="font-bold text-sm text-tower-950">{bed.unit}</h3>
        </div>
        <span
          className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase border ${
            bed.status === 'tersedia'
              ? 'bg-tower-50 text-tower-800 border-tower-200'
              : bed.status === 'terbatas'
              ? 'bg-gold-100 text-tower-950 border-gold-400'
              : 'bg-alert-50 text-alert-700 border-alert-200'
          }`}
        >
          {bed.status}
        </span>
      </div>

      <div className="space-y-3 text-xs">
        <div>
          <label className="block text-ink-soft font-semibold mb-1">
            Status Ketersediaan:
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as BedItem['status'])}
            className="w-full min-h-[38px] px-3 rounded-xl bg-ivory text-tower-950 border border-tower-200 font-semibold focus:outline-none"
          >
            <option value="tersedia">Tersedia (Hijau)</option>
            <option value="terbatas">Terbatas (Kuning)</option>
            <option value="penuh">Penuh (Merah)</option>
          </select>
        </div>

        <div>
          <label className="block text-ink-soft font-semibold mb-1">
            Catatan Fasilitas / Ventilator:
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Contoh: 2 Bed Tersedia (Ventilator Siap)"
            className="w-full min-h-[38px] px-3 rounded-xl bg-ivory text-tower-950 border border-tower-200 focus:outline-none text-xs"
          />
        </div>

        <button
          type="button"
          onClick={() => onSave(bed.unit, status, note)}
          disabled={loading}
          className="w-full min-h-[40px] px-4 py-2 rounded-xl bg-tower-800 hover:bg-tower-900 text-ivory font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <RotateCcw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          <span>Simpan Pembaruan</span>
        </button>
      </div>
    </div>
  );
}
