import { create } from 'zustand';
import { Penjamin } from '@/data/types';
import { SPECIALTIES } from '@/data/specialties';
import { DOCTORS } from '@/data/doctors';

export interface QueueTicket {
  ticketCode: string;
  createdAt: string;
  penjamin: Penjamin;
  specialtyName: string;
  doctorName: string;
  doctorTitle: string;
  appointmentDate: string;
  timeSlot: string;
  patientName: string;
  patientPhone: string;
  patientNik: string;
}

export interface RegistrationState {
  // Alur langkah (1 s/d 5)
  step: 1 | 2 | 3 | 4 | 5;

  // Data formulir
  penjamin: Penjamin | null;
  specialtyId: string | null;
  doctorSlug: string | null;
  appointmentDate: string | null;
  timeSlot: string | null;

  // Data pasien simulasi
  patientName: string;
  patientPhone: string;
  patientNik: string;

  // Tiket antrean hasil submit lokal (in-memory)
  queueTicket: QueueTicket | null;

  // Actions
  setStep: (step: 1 | 2 | 3 | 4 | 5) => void;
  setPenjamin: (penjamin: Penjamin) => void;
  setSpecialtyId: (specialtyId: string) => void;
  setDoctor: (doctorSlug: string, specialtyId?: string) => void;
  setAppointment: (appointmentDate: string, timeSlot: string) => void;
  setPatientData: (data: Partial<{ patientName: string; patientPhone: string; patientNik: string }>) => void;
  fillDemoData: () => void;
  submitRegistration: () => boolean;
  reset: () => void;
}

const INITIAL_STATE = {
  step: 1 as const,
  penjamin: 'bpjs' as Penjamin,
  specialtyId: null,
  doctorSlug: null,
  appointmentDate: null,
  timeSlot: null,
  patientName: '',
  patientPhone: '',
  patientNik: '',
  queueTicket: null,
};

/**
 * ZUSTAND IN-MEMORY STORE UNTUK PENDAFTARAN ONLINE DEMO
 * ATURAN KERAS PRD & MASTER PROMPT:
 * - Tidak menggunakan middleware 'persist' (Nol localStorage / sessionStorage).
 * - Seluruh mutasi tersimpan murni di RAM tab browser untuk perlindungan privasi.
 */
export const useRegistrationStore = create<RegistrationState>((set, get) => ({
  ...INITIAL_STATE,

  setStep: (step) => set({ step }),

  setPenjamin: (penjamin) => set({ penjamin }),

  setSpecialtyId: (specialtyId) => {
    const currentDoctor = DOCTORS.find((d) => d.slug === get().doctorSlug);
    // Jika dokter yang dipilih sebelumnya bukan dari poli ini, reset pilihan dokter
    const shouldResetDoctor = currentDoctor && currentDoctor.specialtyId !== specialtyId;

    set({
      specialtyId,
      ...(shouldResetDoctor ? { doctorSlug: null, appointmentDate: null, timeSlot: null } : {}),
    });
  },

  setDoctor: (doctorSlug, specialtyId) => {
    const doctor = DOCTORS.find((d) => d.slug === doctorSlug);
    const specId = specialtyId || doctor?.specialtyId || get().specialtyId;

    set({
      doctorSlug,
      specialtyId: specId,
      // Reset jadwal jika dokter berganti
      appointmentDate: null,
      timeSlot: null,
    });
  },

  setAppointment: (appointmentDate, timeSlot) => set({ appointmentDate, timeSlot }),

  setPatientData: (data) => set((state) => ({ ...state, ...data })),

  // Helper 1-klik untuk penguji/evaluator portofolio
  fillDemoData: () => {
    set({
      patientName: 'Ahmad Fauzi (Demo Pasien)',
      patientPhone: '081234567890',
      patientNik: '3578012345670001',
    });
  },

  // Submit lokal tanpa request jaringan (Nol fetch / Nol XHR)
  submitRegistration: () => {
    const state = get();
    if (!state.penjamin || !state.specialtyId || !state.doctorSlug || !state.appointmentDate || !state.timeSlot) {
      return false;
    }
    if (!state.patientName.trim() || !state.patientPhone.trim() || state.patientNik.length < 16) {
      return false;
    }

    const specialty = SPECIALTIES.find((s) => s.id === state.specialtyId);
    const doctor = DOCTORS.find((d) => d.slug === state.doctorSlug);

    const prefix = state.specialtyId.substring(0, 3).toUpperCase();
    const randomDigits = Math.floor(100 + Math.random() * 900);
    const ticketCode = `RSIS-${prefix}-${randomDigits}`;

    const now = new Date();
    const formattedDate = now.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const ticket: QueueTicket = {
      ticketCode,
      createdAt: formattedDate,
      penjamin: state.penjamin,
      specialtyName: specialty?.name || 'Poliklinik Spesialis',
      doctorName: doctor?.name || 'Dokter Spesialis',
      doctorTitle: doctor?.title || doctor?.name || 'dr. Spesialis',
      appointmentDate: state.appointmentDate,
      timeSlot: state.timeSlot,
      patientName: state.patientName,
      patientPhone: state.patientPhone,
      patientNik: state.patientNik,
    };

    set({
      queueTicket: ticket,
      step: 5,
    });

    return true;
  },

  reset: () => set({ ...INITIAL_STATE }),
}));
