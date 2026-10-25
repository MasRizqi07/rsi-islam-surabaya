'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { HOSPITAL_FACTS } from '@/data/facts';
import { Menu, X, Building2, Calendar, Phone, Stethoscope, Info, LogIn } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dokter', href: '/dokter', icon: Stethoscope },
  { label: 'Layanan', href: '/layanan', icon: Building2 },
  { label: 'Tower Directory', href: '/tower', icon: Building2 },
  { label: 'Janji Temu', href: '/janji-temu', icon: Calendar },
  { label: 'Tentang', href: '/tentang', icon: Info },
  { label: 'Kontak', href: '/kontak', icon: Phone },
  { label: 'Login Demo', href: '/login', icon: LogIn },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 bg-ivory/95 backdrop-blur-md border-b border-tower-100/80 transition-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* LOGO & BRANDING */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none"
            aria-label={`${HOSPITAL_FACTS.name} - Beranda`}
          >
            {/* Logo Resmi RS Islam Surabaya A. Yani */}
            <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-gold-500/40 shadow-sm bg-white shrink-0 group-hover:scale-105 transition-transform">
              <Image
                src="/assets/Logo-RSI-Baru-320x320.jpeg"
                alt={`Logo ${HOSPITAL_FACTS.name}`}
                width={44}
                height={44}
                className="w-full h-full object-cover"
                priority
              />
            </div>

            <div className="flex flex-col">
              <span className="font-display font-bold text-lg text-tower-900 leading-tight tracking-tight group-hover:text-tower-700 transition-colors">
                {HOSPITAL_FACTS.name}
              </span>
              <span className="text-xs text-ink-soft tracking-wider font-medium">
                {HOSPITAL_FACTS.tagline} · Sejak {HOSPITAL_FACTS.foundedYear}
              </span>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav aria-label="Navigasi Utama" className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-2 rounded-md text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-tower-100 text-tower-900'
                      : 'text-ink hover:text-tower-800 hover:bg-tower-50'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* ACTION BUTTON & MOBILE TOGGLE */}
          <div className="flex items-center gap-3">
            <Link
              href="/daftar"
              className="hidden sm:inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-lg bg-tower-800 hover:bg-tower-700 text-ivory font-semibold text-sm shadow-md hover:shadow-lg transition-all focus:ring-2 focus:ring-tower-700 focus:ring-offset-2"
            >
              <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
              <span>Daftar Online</span>
            </Link>

            {/* HAMBURGER TOGGLE */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden inline-flex items-center justify-center p-2.5 rounded-lg text-ink hover:text-tower-800 hover:bg-tower-100 focus:outline-none min-h-[44px] min-w-[44px]"
              aria-controls="mobile-menu"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu utama'}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden border-t border-tower-100 bg-ivory px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-150"
        >
          <nav aria-label="Navigasi Mobile">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-base font-semibold min-h-[44px] ${
                    isActive
                      ? 'bg-tower-100 text-tower-900'
                      : 'text-ink hover:bg-tower-50 hover:text-tower-800'
                  }`}
                >
                  <Icon className="w-5 h-5 text-tower-700" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            <div className="pt-4 border-t border-tower-100">
              <Link
                href="/daftar"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center w-full min-h-[44px] px-4 py-3 rounded-lg bg-tower-800 text-ivory font-bold text-center shadow-md active:bg-tower-900"
              >
                <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
                <span>Daftar Online (Demo)</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
