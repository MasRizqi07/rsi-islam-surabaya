import Link from 'next/link';
import { HOSPITAL_FACTS } from '@/data/facts';
import { ShieldCheck, PhoneCall, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: `Styleguide & Sistem Desain · ${HOSPITAL_FACTS.name}`,
  robots: { index: false, follow: false },
};

export default function StyleguidePage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      
      {/* HEADER SECTION */}
      <div className="border-b border-gold-500/30 pb-6">
        <span className="text-xs uppercase tracking-widest font-bold text-gold-700">
          Internal Dev-Only Catalog
        </span>
        <h1 className="font-display font-bold text-4xl text-tower-900 mt-1">
          Sistem Desain "Hijau Tower"
        </h1>
        <p className="text-ink-soft mt-2 max-w-2xl">
          Dokumentasi token warna, tipografi fluid, elevasi, dan komponen antarmuka yang terkalibrasi untuk standar aksesibilitas WCAG 2.2 AA.
        </p>
      </div>

      {/* 1. PALET WARNA TOWER */}
      <section className="space-y-6">
        <h2 className="font-display font-bold text-2xl text-tower-900">
          1. Palet Warna Hijau Tower (`tower-*`)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {[
            { token: 'tower-950', hex: '#04231F', desc: 'Footer & Dark Bg', text: 'text-ivory' },
            { token: 'tower-900', hex: '#063B36', desc: 'Hero Deep Slate', text: 'text-ivory' },
            { token: 'tower-800', hex: '#0A4F48', desc: 'Primary Brand / CTA', text: 'text-ivory' },
            { token: 'tower-700', hex: '#0F6B61', desc: 'Hover & Icons', text: 'text-ivory' },
            { token: 'tower-600', hex: '#13786D', desc: 'Links / Secondary', text: 'text-ivory' },
            { token: 'tower-100', hex: '#D6EFEB', desc: 'Surface / Tag', text: 'text-tower-950' },
            { token: 'tower-50',  hex: '#EEF8F6', desc: 'Zebra Section', text: 'text-tower-950' },
          ].map((c) => (
            <div key={c.token} className="rounded-xl overflow-hidden shadow-sm border border-tower-100">
              <div
                className="h-20 flex items-end p-2.5 font-mono text-xs font-bold"
                style={{ backgroundColor: c.hex }}
              >
                <span className={c.text}>{c.hex}</span>
              </div>
              <div className="p-3 bg-white">
                <span className="block font-bold text-xs text-tower-950">{c.token}</span>
                <span className="block text-[11px] text-ink-soft">{c.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. PALET WARNA AKSEN EMAS & KANVAS */}
      <section className="space-y-6">
        <h2 className="font-display font-bold text-2xl text-tower-900">
          2. Aksen Emas, Netral & Darurat
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {[
            { token: 'gold-700', hex: '#8A6A14', desc: 'Teks Emas di Ivory', text: 'text-ivory' },
            { token: 'gold-500', hex: '#C9A24A', desc: 'Hairline & Aksen Grafis', text: 'text-tower-950' },
            { token: 'gold-300', hex: '#E3CB8A', desc: 'Teks Emas di Gelap', text: 'text-tower-950' },
            { token: 'gold-100', hex: '#F4EBD0', desc: 'Highlight Background', text: 'text-tower-950' },
            { token: 'ivory',    hex: '#FBF8F1', desc: 'Kanvas Utama', text: 'text-ink' },
            { token: 'alert-600', hex: '#C62F2F', desc: 'Khusus Darurat/IGD', text: 'text-ivory' },
            { token: 'alert-50',  hex: '#FDECEC', desc: 'Latar Notifikasi IGD', text: 'text-alert-600' },
          ].map((c) => (
            <div key={c.token} className="rounded-xl overflow-hidden shadow-sm border border-tower-100">
              <div
                className="h-20 flex items-end p-2.5 font-mono text-xs font-bold"
                style={{ backgroundColor: c.hex }}
              >
                <span className={c.text}>{c.hex}</span>
              </div>
              <div className="p-3 bg-white">
                <span className="block font-bold text-xs text-tower-950">{c.token}</span>
                <span className="block text-[11px] text-ink-soft">{c.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TIPOGRAFI & SKALA HEADING */}
      <section className="space-y-6">
        <h2 className="font-display font-bold text-2xl text-tower-900">
          3. Tipografi (Playfair Display + Plus Jakarta Sans)
        </h2>
        
        <div className="space-y-4 bg-white p-6 rounded-2xl border border-tower-100">
          <div>
            <span className="text-xs font-mono text-ink-soft">Display XL · font-display</span>
            <div className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-tower-900">
              {HOSPITAL_FACTS.buildings.tower.name} 13 Lantai
            </div>
          </div>

          <div className="pt-2">
            <span className="text-xs font-mono text-ink-soft">Heading 2 · font-display</span>
            <div className="font-display font-bold text-2xl sm:text-3xl text-tower-800">
              Pelayanan Medis Modern Terintegrasi
            </div>
          </div>

          <div className="pt-2">
            <span className="text-xs font-mono text-ink-soft">Body Text · font-sans (Plus Jakarta Sans)</span>
            <p className="text-base text-ink leading-relaxed max-w-3xl">
              Rumah Sakit Islam Surabaya A. Yani melayani masyarakat sejak tahun {HOSPITAL_FACTS.foundedYear}. Menghadirkan fasilitas perawatan gawat darurat, poliklinik spesialis, serta unit perawatan intensif yang komprehensif.
            </p>
          </div>

          <div className="pt-2">
            <span className="text-xs font-mono text-ink-soft">Italic Accent · font-display</span>
            <div className="font-display italic text-lg text-gold-700">
              "{HOSPITAL_FACTS.motto}"
            </div>
          </div>
        </div>
      </section>

      {/* 4. KOMPONEN TOMBOL & AKSI */}
      <section className="space-y-6">
        <h2 className="font-display font-bold text-2xl text-tower-900">
          4. Komponen Aksi & Tombol Interaktif
        </h2>

        <div className="flex flex-wrap gap-4 items-center p-6 bg-white rounded-2xl border border-tower-100">
          <button className="min-h-[44px] px-6 py-2.5 rounded-lg bg-tower-800 hover:bg-tower-700 text-ivory font-bold text-sm shadow-md transition-[color,background-color,box-shadow] duration-150">
            Tombol Primer (Tower 800)
          </button>

          <button className="min-h-[44px] px-6 py-2.5 rounded-lg bg-tower-100 hover:bg-tower-50 text-tower-900 font-bold text-sm border border-tower-800/20 transition-[color,background-color,border-color] duration-150">
            Tombol Sekunder (Tower 100)
          </button>

          <button className="min-h-[44px] px-6 py-2.5 rounded-lg bg-alert-600 hover:bg-alert-700 text-ivory font-bold text-sm shadow-md transition-[color,background-color,box-shadow] duration-150 flex items-center gap-2">
            <PhoneCall className="w-4 h-4" />
            Tombol Darurat (Alert 600)
          </button>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-tower-100 text-tower-900 border border-tower-700/20">
            <CheckCircle2 className="w-3.5 h-3.5 text-tower-700" />
            BPJS Kesehatan
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gold-100 text-gold-700 border border-gold-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-gold-700" />
            {HOSPITAL_FACTS.hospitalClass}
          </span>
        </div>
      </section>

      {/* KEMBALI KE BERANDA */}
      <div className="pt-8 border-t border-tower-100 flex justify-between items-center">
        <Link
          href="/"
          className="text-tower-800 font-bold text-sm hover:underline"
        >
          &larr; Kembali ke Beranda
        </Link>
        <span className="text-xs text-ink-soft font-mono">
          WCAG 2.2 AA Verified · Next.js 15+ App Router
        </span>
      </div>
    </div>
  );
}
