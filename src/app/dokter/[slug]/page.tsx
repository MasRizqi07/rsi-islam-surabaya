import { notFound } from 'next/navigation';
import Link from 'next/link';
import { DOCTORS } from '@/data/doctors';
import { SPECIALTIES } from '@/data/specialties';
import { getDoctorBySlug } from '@/lib/data-utils';
import {
  Clock,
  ArrowLeft,
  CalendarCheck,
  AlertCircle,
  CheckCircle2,
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
    title: `${doctor.title} · Profil & Jadwal Praktik · RS Islam Surabaya A. Yani`,
    description: `Jadwal praktik ${doctor.title}, spesialisasi ${doctor.specialtyId}, penerimaan BPJS Kesehatan dan rawat jalan di RS Islam Surabaya A. Yani.`,
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

  return (
    <div className="py-10 sm:py-14 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* TOMBOL KEMBALI */}
      <Link
        href="/dokter"
        className="inline-flex items-center gap-2 text-sm font-bold text-tower-800 hover:text-tower-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Direktori Dokter</span>
      </Link>

      {/* KARTU PROFIL UTAMA */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-tower-100 shadow-lg space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-tower-100 pb-8">
          
          <div className="flex items-center gap-5">
            {/* AVATAR INISIAL */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-tower-800 to-tower-950 text-gold-300 font-display font-bold text-3xl flex items-center justify-center border-2 border-gold-500/40 shadow-md shrink-0">
              {initials}
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-tower-700 uppercase tracking-widest block">
                {specialty?.name}
              </span>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-tower-950 tracking-tight">
                {doctor.title}
              </h1>
              {doctor.subSpecialty && (
                <span className="text-sm text-ink-soft block font-medium">
                  Subspesialisasi: {doctor.subSpecialty}
                </span>
              )}
            </div>
          </div>

          {/* LENCANA ILUSTRASI & CTA DAFTAR */}
          <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gold-100 text-tower-950 border border-gold-500/40">
              <AlertCircle className="w-3.5 h-3.5 text-tower-800" />
              <span>Tokoh Fiktif Simulasi</span>
            </span>

            <Link
              href={`/daftar?dokter=${doctor.slug}`}
              className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-xl bg-tower-800 hover:bg-tower-700 active:bg-tower-900 text-ivory font-bold text-sm shadow-md transition-all w-full sm:w-auto text-center"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Daftar ke Dokter Ini</span>
            </Link>
          </div>
        </div>

        {/* TENTANG & PENJAMIN */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* KOLOM KIRI: BIO */}
          <div className="md:col-span-8 space-y-4">
            <h2 className="font-display font-bold text-xl text-tower-900">
              Profil Klinis & Pengalaman
            </h2>
            <p className="text-sm text-ink leading-relaxed">
              {doctor.bio}
            </p>
            <p className="text-xs text-ink-soft leading-relaxed italic">
              * Pelayanan mengedepankan etika kedokteran islami dengan komunikasi terapeutik yang ramah dan menenangkan.
            </p>
          </div>

          {/* KOLOM KANAN: PENJAMIN & LAYANAN POLI */}
          <div className="md:col-span-4 bg-ivory rounded-2xl p-5 border border-tower-100 space-y-4">
            <h3 className="font-bold text-sm text-tower-950 uppercase tracking-wider">
              Mitra Penjamin Diterima:
            </h3>
            
            <ul className="space-y-2 text-xs">
              {doctor.penjamin.includes('bpjs') ? (
                <li className="flex items-center gap-2 font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Menerima Rujukan BPJS Kesehatan</span>
                </li>
              ) : (
                <li className="flex items-center gap-2 text-ink-soft opacity-60">
                  <AlertCircle className="w-4 h-4" />
                  <span>Tidak Menerima BPJS (Khusus Eksekutif)</span>
                </li>
              )}
              <li className="flex items-center gap-2 font-semibold text-ink">
                <CheckCircle2 className="w-4 h-4 text-tower-700" />
                <span>Pasien Umum (Mandiri)</span>
              </li>
              <li className="flex items-center gap-2 font-semibold text-ink">
                <CheckCircle2 className="w-4 h-4 text-tower-700" />
                <span>Asuransi Kesehatan Swasta</span>
              </li>
            </ul>

            <div className="pt-3 border-t border-tower-100 text-xs text-ink-soft">
              <strong>Kategori Poli:</strong> {doctor.poli.map((p) => p.toUpperCase()).join(' & ')}
            </div>
          </div>
        </div>

        {/* TABEL JADWAL PRAKTIK MINGGUAN */}
        <div className="space-y-4 pt-4 border-t border-tower-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-tower-700" />
              <h2 className="font-display font-bold text-xl text-tower-900">
                Jadwal Praktik Mingguan
              </h2>
            </div>
            <span className="text-xs text-ink-soft">
              Waktu Indonesia Barat (WIB)
            </span>
          </div>

          {/* DESKTOP TABLE */}
          <div className="hidden sm:block overflow-hidden rounded-xl border border-tower-100">
            <table className="w-full text-left text-sm">
              <thead className="bg-tower-900 text-ivory font-display text-xs uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-5 py-3">Hari</th>
                  <th scope="col" className="px-5 py-3">Jam Praktik</th>
                  <th scope="col" className="px-5 py-3">Layanan Poliklinik</th>
                  <th scope="col" className="px-5 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tower-100 bg-white">
                {doctor.schedule.map((sch, idx) => (
                  <tr key={idx} className="hover:bg-tower-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-tower-950 capitalize">
                      {sch.hari}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-ink">
                      {sch.mulai} - {sch.selesai} WIB
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                        sch.poli === 'eksekutif'
                          ? 'bg-tower-100 text-tower-900 border border-tower-600/30'
                          : 'bg-ivory text-ink border border-tower-100'
                      }`}>
                        Poli {sch.poli === 'eksekutif' ? 'Eksekutif' : 'Reguler'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/daftar?dokter=${doctor.slug}&hari=${sch.hari}`}
                        className="text-xs font-bold text-tower-800 hover:text-tower-600 hover:underline"
                      >
                        Pilih Hari Ini &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE LIST */}
          <div className="sm:hidden space-y-2">
            {doctor.schedule.map((sch, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-ivory border border-tower-100 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-sm text-tower-950 capitalize block">
                    {sch.hari}
                  </span>
                  <span className="text-xs text-ink-soft font-mono">
                    {sch.mulai} - {sch.selesai} WIB ({sch.poli})
                  </span>
                </div>

                <Link
                  href={`/daftar?dokter=${doctor.slug}&hari=${sch.hari}`}
                  className="px-3 py-1.5 rounded-lg bg-tower-800 text-ivory text-xs font-bold"
                >
                  Pilih
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
