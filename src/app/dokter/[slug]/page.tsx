import { notFound } from 'next/navigation';
import Link from 'next/link';
import { DOCTORS } from '@/data/doctors';
import { SPECIALTIES } from '@/data/specialties';
import { HOSPITAL_FACTS } from '@/data/facts';
import { getDoctorBySlug } from '@/lib/data-utils';
import {
  Clock,
  ArrowLeft,
  Calendar,
  CalendarCheck,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Stethoscope,
  ShieldCheck,
  Phone,
  Info,
  ArrowRight,
} from 'lucide-react';

export function generateStaticParams() {
  return DOCTORS.map((d) => ({
    slug: d.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doctor = getDoctorBySlug(slug);
  if (!doctor) return { title: 'Dokter Tidak Ditemukan' };

  return {
    title: `${doctor.title} · Profil & Jadwal Praktik · ${HOSPITAL_FACTS.name}`,
    description: `Jadwal praktik ${doctor.title}, spesialisasi ${doctor.specialtyId}, penerimaan BPJS Kesehatan dan rawat jalan di ${HOSPITAL_FACTS.name}.`,
    robots: { index: false, follow: false },
  };
}

export default async function DoctorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doctor = getDoctorBySlug(slug);

  if (!doctor) {
    notFound();
  }

  const specialty = SPECIALTIES.find((s) => s.id === doctor.specialtyId);
  const initials = doctor.name
    .replace(/^dr\.\s*/i, '')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const firstSchedule = doctor.schedule[0];

  return (
    <div className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* TOMBOL KEMBALI */}
      <Link
        href="/dokter"
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-tower-800 hover:text-tower-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Direktori Dokter</span>
      </Link>

      {/* HEADER BANNER PROFIL DOKTER */}
      <section className="bg-tower-950 text-ivory rounded-3xl p-6 sm:p-10 border border-tower-900 shadow-xl relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 90% 10%, rgba(201, 162, 74, 0.4) 0%, transparent 60%)',
          }}
        />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            
            {/* AVATAR INISIAL */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-tower-800 via-tower-900 to-tower-950 text-gold-300 font-display font-bold text-3xl sm:text-4xl flex items-center justify-center border-2 border-gold-400/40 shadow-lg shrink-0">
              {initials}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gold-100 text-tower-950 border border-gold-500/40">
                  <AlertCircle className="w-3 h-3 text-tower-800" />
                  <span>Tokoh Fiktif Simulasi · Berlabel Ilustrasi</span>
                </span>
                <span className="text-xs font-bold text-gold-300 uppercase tracking-widest">
                  {specialty?.name}
                </span>
              </div>

              <h1 className="font-display font-bold text-2xl sm:text-4xl text-ivory tracking-tight">
                {doctor.title}
              </h1>

              {doctor.subSpecialty ? (
                <p className="text-xs sm:text-sm text-tower-100 font-medium">
                  Subspesialisasi: {doctor.subSpecialty}
                </p>
              ) : (
                <p className="text-xs sm:text-sm text-tower-100 font-medium">
                  Spesialisasi Klinis: {specialty?.name}
                </p>
              )}

              {/* BADGES ROW */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-tower-900 text-tower-100 border border-tower-800">
                  <MapPin className="w-3.5 h-3.5 text-gold-400" />
                  <span>{HOSPITAL_FACTS.buildings.graha.name} & Tower RSIS</span>
                </span>
                {doctor.penjamin.includes('bpjs') && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-200 border border-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Menerima BPJS Kesehatan</span>
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-tower-900 text-tower-100 border border-tower-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" />
                  <span>Pasien Umum & Asuransi</span>
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TWO-COLUMN CONTENT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Profil Klinis & Matriks Jadwal (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Card 1: Profil Klinis & Keahlian Medis */}
          <article className="bg-white rounded-3xl p-6 sm:p-8 border border-tower-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-tower-100">
              <div className="flex items-center gap-2.5">
                <Stethoscope className="w-6 h-6 text-tower-800" />
                <h2 className="font-display font-bold text-xl sm:text-2xl text-tower-950">
                  Profil Klinis & Keahlian Medis
                </h2>
              </div>
              <span className="text-xs uppercase tracking-widest text-gold-700 font-bold hidden sm:inline">
                Spesialisasi Terverifikasi
              </span>
            </div>

            <p className="text-sm sm:text-base text-ink leading-relaxed">
              {doctor.bio}
            </p>

            <div className="space-y-3 pt-2">
              <h3 className="font-display font-bold text-base text-tower-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold-700" />
                <span>Standar Asuhan Klinis & Tindakan</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-tower-50/70 p-4 rounded-2xl border border-tower-100 space-y-1">
                  <span className="text-[10px] font-bold text-gold-700 uppercase tracking-wider block">
                    01 / KONSULTASI
                  </span>
                  <h4 className="font-bold text-xs text-tower-950">Anamnesis Komprehensif</h4>
                  <p className="text-[11px] text-ink-soft">Evaluasi menyeluruh tanda vital dan keluhan klinis berkala.</p>
                </div>

                <div className="bg-tower-50/70 p-4 rounded-2xl border border-tower-100 space-y-1">
                  <span className="text-[10px] font-bold text-gold-700 uppercase tracking-wider block">
                    02 / DIAGNOSTIK
                  </span>
                  <h4 className="font-bold text-xs text-tower-950">Penunjang Terpadu</h4>
                  <p className="text-[11px] text-ink-soft">Integrasi instan dengan CT-Scan, Lab, dan EKG satu atap.</p>
                </div>

                <div className="bg-tower-50/70 p-4 rounded-2xl border border-tower-100 space-y-1">
                  <span className="text-[10px] font-bold text-gold-700 uppercase tracking-wider block">
                    03 / TATA LAKSANA
                  </span>
                  <h4 className="font-bold text-xs text-tower-950">Asuhan Syariah</h4>
                  <p className="text-[11px] text-ink-soft">Terapi farmakologis rasional dengan komunikasi empatik.</p>
                </div>
              </div>
            </div>
          </article>

          {/* Card 2: Matriks Jadwal Praktik Mingguan Lengkap */}
          <article className="bg-white rounded-3xl p-6 sm:p-8 border border-tower-100 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-tower-100">
              <div className="flex items-center gap-2.5">
                <Clock className="w-6 h-6 text-tower-800" />
                <h2 className="font-display font-bold text-xl sm:text-2xl text-tower-950">
                  Matriks Jadwal Praktik Mingguan
                </h2>
              </div>
              <span className="text-xs text-ink-soft font-mono">
                Waktu Indonesia Barat (WIB)
              </span>
            </div>

            {/* Responsive Table */}
            <div className="overflow-x-auto rounded-2xl border border-tower-100">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-tower-900 text-ivory font-display text-xs uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="py-3.5 px-4 font-bold">Hari</th>
                    <th scope="col" className="py-3.5 px-4 font-bold">Jam Praktik</th>
                    <th scope="col" className="py-3.5 px-4 font-bold">Kategori Poli</th>
                    <th scope="col" className="py-3.5 px-4 font-bold">Penjamin</th>
                    <th scope="col" className="py-3.5 px-4 text-right font-bold">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-tower-100 bg-white">
                  {doctor.schedule.map((sch, idx) => (
                    <tr key={idx} className="hover:bg-tower-50/50 transition-colors">
                      <td className="py-4 px-4 font-bold text-tower-950 capitalize">
                        {sch.hari}
                      </td>
                      <td className="py-4 px-4 font-mono font-medium text-ink">
                        {sch.mulai} – {sch.selesai} WIB
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            sch.poli === 'eksekutif'
                              ? 'bg-gold-100 text-tower-950 border border-gold-400/40'
                              : 'bg-tower-50 text-tower-900 border border-tower-200'
                          }`}
                        >
                          Poli {sch.poli === 'eksekutif' ? 'Eksekutif' : 'Reguler'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-ink-soft text-xs">
                        {sch.poli === 'eksekutif'
                          ? 'Umum & Asuransi Swasta'
                          : doctor.penjamin.includes('bpjs')
                          ? 'BPJS Kesehatan & Umum'
                          : 'Umum & Mandiri'}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Link
                          href={`/daftar?dokter=${doctor.slug}&hari=${sch.hari}`}
                          className="inline-flex items-center gap-1 font-bold text-xs text-tower-800 hover:text-tower-600 hover:underline"
                        >
                          <span>Pilih Sesi</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Important Notes Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-ivory border border-tower-100 flex items-start gap-3">
              <Info className="w-5 h-5 text-tower-800 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs text-ink-soft leading-relaxed">
                <p className="font-bold text-tower-950">Catatan Penting Calon Pasien:</p>
                <p>1. Pasien BPJS Kesehatan wajib membawa surat rujukan faskes primer aktif dan tiba 30 menit sebelum jadwal untuk pencocokan sidik jari.</p>
                <p>2. Jadwal praktik dokter dapat mengalami penyesuaian darurat apabila dokter sedang menangani operasi cito atau tindakan gawat darurat.</p>
              </div>
            </div>
          </article>

        </div>

        {/* RIGHT COLUMN: Sticky Booking Action Card (4 Cols) */}
        <aside className="lg:col-span-4 w-full">
          <div className="sticky top-24 bg-white rounded-3xl p-6 shadow-xl border border-tower-100 space-y-6">
            
            {/* Top Hairline Emas */}
            <div className="h-1 -mx-6 -mt-6 bg-gradient-to-r from-gold-500 via-gold-300 to-gold-500 rounded-t-3xl" />

            <div className="space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gold-100 text-tower-950 border border-gold-300">
                Pendaftaran Rawat Jalan (Demo)
              </span>
              <h3 className="font-display font-bold text-xl text-tower-950">
                Buat Janji Temu Dokter
              </h3>
            </div>

            {/* Summary Box */}
            <div className="p-4 rounded-2xl bg-tower-50/70 border border-tower-100 space-y-2.5 text-xs">
              <div className="flex justify-between items-start gap-2">
                <span className="text-ink-soft">Dokter Terpilih:</span>
                <span className="font-bold text-tower-950 text-right">{doctor.title}</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-ink-soft">Poliklinik:</span>
                <span className="font-semibold text-tower-900 text-right">{specialty?.name}</span>
              </div>
              {firstSchedule && (
                <div className="pt-2 border-t border-tower-200/60 flex justify-between items-center gap-2">
                  <span className="text-ink-soft">Sesi Terdekat:</span>
                  <span className="font-bold text-gold-700 capitalize text-right">
                    {firstSchedule.hari} ({firstSchedule.mulai} WIB)
                  </span>
                </div>
              )}
            </div>

            {/* CTA Button */}
            <div className="space-y-2">
              <Link
                href={`/janji-temu?doctor=${doctor.slug}`}
                className="w-full py-3.5 px-4 rounded-xl bg-gold-500 hover:bg-gold-400 active:bg-gold-600 text-tower-950 font-bold text-sm text-center shadow-md press-feedback transition-[color,background-color,box-shadow,transform] duration-150 flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Buat Janji Temu Dokter</span>
              </Link>

              <Link
                href={`/daftar?dokter=${doctor.slug}`}
                className="w-full py-2.5 px-4 rounded-xl bg-tower-50 hover:bg-tower-100 text-tower-900 font-bold text-xs text-center border border-tower-200 press-feedback transition-[background-color,transform] duration-150 flex items-center justify-center gap-2"
              >
                <CalendarCheck className="w-3.5 h-3.5 text-tower-700" />
                <span>Simulasi Pendaftaran Mandiri</span>
              </Link>
            </div>

            {/* Secondary Link to Tower Directory */}
            <div className="text-center pt-1">
              <Link
                href="/tower"
                className="inline-flex items-center gap-1 text-xs text-tower-800 hover:text-tower-600 font-semibold"
              >
                <span>Lihat Lokasi Poli di Denah Gedung</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Hospital Assistance Box */}
            <div className="pt-4 border-t border-tower-100 space-y-2">
              <div className="flex items-center gap-2 text-xs text-ink-soft">
                <Phone className="w-3.5 h-3.5 text-tower-700 shrink-0" />
                <span>
                  Sentral Informasi: <strong>{HOSPITAL_FACTS.contact.centralPhone}</strong>
                </span>
              </div>
              <p className="text-[11px] text-ink-soft leading-tight">
                Konsultasi jadwal dan bantuan pendaftaran dapat dipandu oleh petugas admisi rumah sakit.
              </p>
            </div>

          </div>
        </aside>

      </div>

    </div>
  );
}
