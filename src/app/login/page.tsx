import { HOSPITAL_FACTS } from '@/data/facts';
import { LoginFormClient } from './LoginFormClient';
import { Lock } from 'lucide-react';

export const metadata = {
  title: `Login Demo · ${HOSPITAL_FACTS.name}`,
  description: `Masuk ke akun demo fiktif (Pasien atau Administrator) untuk menguji autentikasi dan otorisasi per peran.`,
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="py-12 sm:py-16 max-w-xl mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-tower-100 shadow-xl space-y-6">
        
        {/* HEADER */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-tower-100 text-tower-800 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Lock className="w-6 h-6 text-tower-700" />
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-tower-950 tracking-tight">
            Masuk Sesi Demo
          </h1>
          <p className="text-ink-soft text-xs sm:text-sm">
            Eksplorasi sistem autentikasi per peran (RBAC) dengan akun fiktif yang telah di-seed.
          </p>
        </div>

        {/* FORM & PRESET */}
        <LoginFormClient />

      </div>
    </div>
  );
}
