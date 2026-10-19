import { BedStatusItem } from './types';

/**
 * STATUS KETERSEDIAAN TEMPAT TIDUR (SIMULASI / ILUSTRASI)
 * Berdasarkan PRD §9 & K2
 * 
 * ATURAN KERAS:
 * Tanpa angka kuantitatif presisi palsu. Hanya menampilkan status ketersediaan
 * ('tersedia' | 'terbatas' | 'penuh') dan label eksplisit bahwa data bersifat ilustrasi.
 */
export const BED_STATUS_ITEMS: BedStatusItem[] = [
  {
    unit: 'ICU',
    status: 'terbatas',
    note: 'Monitoring intensif dewasa (Bed isolasi & non-isolasi)',
  },
  {
    unit: 'ICCU',
    status: 'tersedia',
    note: 'Perawatan kardiovaskular & jantung intensif',
  },
  {
    unit: 'HCU',
    status: 'tersedia',
    note: 'Perawatan intermediet pasca-operasi / transisi ICU',
  },
  {
    unit: 'NICU',
    status: 'terbatas',
    note: 'Neonatal resusitasi & inkubator bayi prematur',
  },
  {
    unit: 'PICU',
    status: 'tersedia',
    note: 'Perawatan kritis pediatrik anak',
  },
  {
    unit: 'Rawat Inap Reguler',
    status: 'tersedia',
    note: 'Kamar perawatan kelas 1, 2, 3 & VIP',
  },
];
