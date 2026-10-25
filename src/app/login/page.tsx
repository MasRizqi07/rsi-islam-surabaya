import Image from 'next/image';
import { HOSPITAL_FACTS } from '@/data/facts';
import { LoginFormClient } from './LoginFormClient';

export const metadata = {
  title: `Login Demo · ${HOSPITAL_FACTS.name}`,
  description: `Masuk ke akun demo fiktif (Pasien atau Administrator) untuk menguji autentikasi dan otorisasi per peran.`,
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="py-12 sm:py-16 max-w-xl mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-tower-100 shadow-xl space-y-6">
        
        {/* HEADER DENGAN LOGO RESMI */}
        <div className="text-center space-y-2">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-gold-500/40 shadow-md mx-auto mb-3 bg-white">
            <Image
              src="/assets/Logo-RSI-Baru-320x320.jpeg"
              alt={HOSPITAL_FACTS.name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
              priority
            />
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
