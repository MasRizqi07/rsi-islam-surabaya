import Link from 'next/link';
import { HOSPITAL_FACTS } from '@/data/facts';
import { ShieldCheck, MapPin, Phone, ExternalLink } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { contact, emergency, social, disclaimer } = HOSPITAL_FACTS;

  return (
    <footer className="bg-tower-950 text-ivory/90 border-t border-gold-500/20 pt-14 pb-20 md:pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* KOLOM 1: IDENTITAS & NILAI */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-tower-900 border border-gold-500/40 flex items-center justify-center text-gold-300 font-display font-bold text-lg">
                RSI
              </div>
              <span className="font-display font-bold text-xl text-ivory tracking-tight">
                {HOSPITAL_FACTS.name}
              </span>
            </div>

            <p className="text-sm text-ivory/70 leading-relaxed">
              {HOSPITAL_FACTS.motto}
            </p>

            <div className="pt-2 text-xs text-gold-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold-500 shrink-0" aria-hidden="true" />
              <span>{HOSPITAL_FACTS.accreditationHistory}</span>
            </div>
          </div>

          {/* KOLOM 2: NAVIGASI CEPAT */}
          <div>
            <h3 className="font-display font-bold text-gold-300 text-base mb-4 tracking-wide">
              Navigasi Layanan
            </h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href="/igd" className="py-1.5 inline-block hover:text-gold-300 transition-colors">
                  Instalasi Gawat Darurat (IGD 24 Jam)
                </Link>
              </li>
              <li>
                <Link href="/dokter" className="py-1.5 inline-block hover:text-gold-300 transition-colors">
                  Direktori & Jadwal Dokter
                </Link>
              </li>
              <li>
                <Link href="/tower" className="py-1.5 inline-block hover:text-gold-300 transition-colors">
                  Tower Directory (Denah Gedung)
                </Link>
              </li>
              <li>
                <Link href="/layanan" className="py-1.5 inline-block hover:text-gold-300 transition-colors">
                  Katalog Layanan & Penunjang
                </Link>
              </li>
              <li>
                <Link href="/daftar" className="py-1.5 inline-block hover:text-gold-300 transition-colors">
                  Pendaftaran Pasien Online (Demo)
                </Link>
              </li>
            </ul>
          </div>

          {/* KOLOM 3: KONTAK & LOKASI */}
          <div>
            <h3 className="font-display font-bold text-gold-300 text-base mb-4 tracking-wide">
              Kontak & Lokasi
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-500 mt-1 shrink-0" aria-hidden="true" />
                <span className="text-ivory/80 leading-snug">{contact.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-500 shrink-0" aria-hidden="true" />
                <span>Sentral: {contact.centralPhone}</span>
              </li>
              <li className="flex items-center gap-2.5 text-alert-50">
                <span className="font-bold text-xs uppercase px-2 py-0.5 rounded bg-alert-600/80">
                  {emergency.callCenterLabel}
                </span>
                <span className="font-bold">{emergency.callCenterNumber}</span>
              </li>
              <li className="flex items-center gap-2.5 text-alert-50">
                <span className="font-bold text-xs uppercase px-2 py-0.5 rounded bg-alert-600/80">
                  {emergency.ambulanceLabel}
                </span>
                <span className="font-bold">{emergency.ambulanceNumber}</span>
              </li>
            </ul>
          </div>

          {/* KOLOM 4: KANAL RESMI & PORTOFOLIO */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-gold-300 text-base mb-4 tracking-wide">
              Kanal Media Resmi
            </h3>
            <p className="text-xs text-ivory/70">
              Kanal resmi RS Islam Surabaya A. Yani yang aktif dan terverifikasi:
            </p>
            
            {/* K7: Hanya @rsisurabaya */}
            <a
              href={social.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-lg bg-tower-900 border border-gold-500/30 text-gold-300 hover:bg-tower-800 transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>Instagram: {social.instagram.handle}</span>
              <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-70" aria-hidden="true" />
            </a>

            <div className="pt-2">
              <Link
                href="/styleguide"
                className="text-xs text-gold-300/80 hover:text-gold-300 underline block py-2"
              >
                Katalog Desain & Token (/styleguide)
              </Link>
            </div>
          </div>
        </div>

        {/* GARIS EMAS PEMISAH */}
        <div className="mt-12 pt-8 border-t border-gold-500/20 text-center space-y-3">
          <p className="text-xs text-ivory/60 max-w-3xl mx-auto leading-relaxed">
            {disclaimer.full}
          </p>
          <p className="text-xs text-gold-300/80">
            &copy; {currentYear} {HOSPITAL_FACTS.name} · Konsep Redesign "Hijau Tower" · Seluruh hak cipta terlindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
