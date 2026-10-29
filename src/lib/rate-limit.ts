import { createHash } from 'node:crypto';

/**
 * RATE LIMITER (PRD v3.0 S10 - Prioritas P2)
 *
 * Implementasi: Sliding-window in-memory rate limiter dengan hashing key.
 *
 * DOKUMENTASI BATASAN SERVERLESS (Mandat PRD §4.2 S10):
 * 1. Tanpa Redis (eksplisit Out of Scope per PRD §4.3 "Redis out of scope"), rate limiter
 *    berjalan di dalam memori proses Node.js / edge runtime.
 * 2. Pada lingkungan serverless terdistribusi multi-region/multi-instance (misal Vercel / AWS Lambda),
 *    setiap instance baru memiliki memori terisolasi (per-instance sliding window).
 * 3. Untuk lingkungan container tunggal (Docker / VM) atau warm serverless instance,
 *    rate limiter ini memberikan proteksi efektif terhadap brute force login,
 *    spamming formulir pendaftaran, dan denial of service mikro.
 * 4. Untuk privasi maksimal (PRD §5), key pengenal (seperti IP atau surel) di-hash
 *    menggunakan SHA-256 sehingga tidak ada raw PII tersimpan di memori.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const store = new Map<string, RateLimitRecord>();

// Bersihkan data lama setiap 5 menit agar tidak terjadi memory leak
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store.entries()) {
      record.timestamps = record.timestamps.filter((t) => now - t < 15 * 60 * 1000);
      if (record.timestamps.length === 0) {
        store.delete(key);
      }
    }
  }, 5 * 60 * 1000).unref?.();
}

export interface RateLimitOptions {
  windowMs: number;  // Durasi jendela waktu dalam milidetik
  max: number;       // Jumlah maksimum request yang diizinkan dalam jendela waktu
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

/**
 * Memeriksa dan memperbarui kuota rate limit untuk identifier tertentu.
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions
): RateLimitResult {
  const { windowMs, max } = options;
  const now = Date.now();

  // Anonimisasi identifier dengan SHA-256 (Anti-PII PRD §5)
  const hashedKey = createHash('sha256').update(identifier).digest('hex').slice(0, 16);

  let record = store.get(hashedKey);
  if (!record) {
    record = { timestamps: [] };
    store.set(hashedKey, record);
  }

  // Saring hanya timestamp dalam jendela aktif
  record.timestamps = record.timestamps.filter((time) => now - time < windowMs);

  if (record.timestamps.length >= max) {
    const oldest = record.timestamps[0];
    const resetSeconds = Math.ceil((oldest + windowMs - now) / 1000);

    return {
      allowed: false,
      limit: max,
      remaining: 0,
      resetSeconds: resetSeconds > 0 ? resetSeconds : 1,
    };
  }

  record.timestamps.push(now);

  return {
    allowed: true,
    limit: max,
    remaining: max - record.timestamps.length,
    resetSeconds: Math.ceil(windowMs / 1000),
  };
}

/**
 * Helper untuk mereset rate limit (berguna untuk pengujian unit & integrasi)
 */
export function resetRateLimitStore(): void {
  store.clear();
}
