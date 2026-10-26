'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, ShieldAlert, User, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

export function LoginFormClient() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fillCredentials = (type: 'patient' | 'admin') => {
    setErrorMessage(null);
    if (type === 'patient') {
      setEmail('pasien.demo@rsi-surabaya.test');
      setPassword('PasswordDemo123!');
    } else {
      setEmail('admin.demo@rsi-surabaya.test');
      setPassword('AdminSecure123!');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Autentikasi gagal. Silakan coba lagi.');
        setIsLoading(false);
        return;
      }

      setSuccessMessage(`Berhasil login sebagai ${data.user.name} (${data.user.role}).`);
      
      // Arahkan ke halaman utama atau dashboard sesuai peran
      setTimeout(() => {
        if (data.user.role === 'ADMIN') {
          router.push('/tower');
        } else {
          router.push('/daftar');
        }
        router.refresh();
      }, 700);
    } catch (err) {
      console.error(err);
      setErrorMessage('Terjadi gangguan jaringan saat menghubungi server autentikasi.');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* BANNER PRIVASI PRD §5 (WAJIB) */}
      <div className="p-4 rounded-xl bg-alert-50 border border-alert-600/30 flex items-start gap-3 text-alert-700">
        <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-alert-600" aria-hidden="true" />
        <div className="text-xs sm:text-sm leading-relaxed">
          <strong className="font-bold block text-alert-800">
            Peringatan Privasi Demo (PRD v3.0):
          </strong>
          Situs portofolio ini adalah lingkungan demonstrasi dengan data 100% fiktif. Jangan pernah memasukkan email asli, kata sandi pribadi, NIK, atau data medis nyata.
        </div>
      </div>

      {/* KARTU PRESET KREDENSIAL DEMO TERANG-TERANGAN */}
      <div className="bg-tower-50/60 rounded-2xl p-5 border border-tower-100 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-tower-900 block">
          Pilih Akun Demo Siap Pakai:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => fillCredentials('patient')}
            className="flex items-center gap-3 p-3 rounded-xl bg-white border border-tower-200 hover:border-tower-600 text-left card-lift press-feedback transition-[border-color,box-shadow,transform] duration-150 shadow-xs group"
          >
            <div className="w-9 h-9 rounded-lg bg-tower-100 text-tower-800 flex items-center justify-center shrink-0 group-hover:bg-tower-800 group-hover:text-ivory transition-[color,background-color] duration-150">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-tower-950">Pasien Demo</div>
              <div className="text-[11px] text-ink-soft">pasien.demo@rsi-surabaya.test</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => fillCredentials('admin')}
            className="flex items-center gap-3 p-3 rounded-xl bg-white border border-tower-200 hover:border-tower-600 text-left card-lift press-feedback transition-[border-color,box-shadow,transform] duration-150 shadow-xs group"
          >
            <div className="w-9 h-9 rounded-lg bg-gold-100 text-gold-800 flex items-center justify-center shrink-0 group-hover:bg-tower-800 group-hover:text-ivory transition-[color,background-color] duration-150">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-tower-950">Admin Demo</div>
              <div className="text-[11px] text-ink-soft">admin.demo@rsi-surabaya.test</div>
            </div>
          </button>
        </div>
      </div>

      {/* FORM LOGIN */}
      <form onSubmit={handleLogin} className="space-y-4">
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-alert-50 border border-alert-600/40 text-alert-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-tower-100 border border-tower-600/40 text-tower-900 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-tower-700" />
            <span>{successMessage}</span>
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-xs font-bold text-tower-900 uppercase tracking-wider mb-1.5">
            Alamat Email Demo
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="contoh: pasien.demo@rsi-surabaya.test"
            className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl bg-ivory text-tower-950 text-sm border border-tower-200 focus:border-tower-700 focus:outline-none focus:ring-1 focus:ring-tower-700 shadow-xs"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-bold text-tower-900 uppercase tracking-wider mb-1.5">
            Kata Sandi
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl bg-ivory text-tower-950 text-sm border border-tower-200 focus:border-tower-700 focus:outline-none focus:ring-1 focus:ring-tower-700 shadow-xs"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-tower-800 hover:bg-tower-900 text-ivory font-bold text-sm tracking-wide press-feedback transition-[background-color,transform] duration-150 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <span>Memverifikasi kredensial...</span>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>Masuk ke Sesi Demo</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
