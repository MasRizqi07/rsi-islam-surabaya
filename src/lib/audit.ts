import { prisma } from './db';
import { Prisma } from '@prisma/client';

export type AuditAction =
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'LOGOUT'
  | 'APPOINTMENT_CREATED'
  | 'APPOINTMENT_CANCELLED'
  | 'APPOINTMENT_STATUS_CHANGED'
  | 'BED_STATUS_CHANGED';

export interface RecordAuditParams {
  actorId?: string | null;
  action: AuditAction;
  resource: string;
  statusBefore?: string | null;
  statusAfter?: string | null;
  appointmentId?: string | null;
  details?: Record<string, unknown> | null;
  tx?: Prisma.TransactionClient;
}

/**
 * Mencatat baris audit log ke tabel AuditLog.
 * ATURAN PRIVASI & ETIKA PRD §5 (WAJIB):
 * - Menyimpan actorId, aksi, resource, status sebelum/sesudah, waktu.
 * - DILARANG KERAS menyimpan IP address, User-Agent, atau Email pasien.
 * - Mendukung eksekusi dalam Prisma Interactive Transaction (tx).
 */
export async function recordAuditLog(params: RecordAuditParams) {
  const {
    actorId = null,
    action,
    resource,
    statusBefore = null,
    statusAfter = null,
    appointmentId = null,
    details = null,
    tx,
  } = params;

  // Jika actorId 'anonymous', simpan sebagai null agar menjaga relasi FK yang valid
  const effectiveActorId = actorId === 'anonymous' ? null : actorId;

  // Sanitasi detail objek untuk memastikan nol data pribadi (IP/UA/Email)
  let sanitizedDetailsStr: string | null = null;
  if (details && typeof details === 'object') {
    const safeCopy: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(details)) {
      const lowerKey = key.toLowerCase();
      if (
        lowerKey.includes('ip') ||
        lowerKey.includes('agent') ||
        lowerKey.includes('email') ||
        lowerKey.includes('password') ||
        lowerKey.includes('phone') ||
        lowerKey.includes('telepon') ||
        lowerKey.includes('nik') ||
        lowerKey.includes('bpjs') ||
        lowerKey.includes('address') ||
        lowerKey.includes('alamat')
      ) {
        continue; // Drop PII / identifier jaringan
      }
      safeCopy[key] = value;
    }
    sanitizedDetailsStr = JSON.stringify(safeCopy);
  }

  const client = tx ?? prisma;

  return client.auditLog.create({
    data: {
      actorId: effectiveActorId,
      action,
      resource,
      statusBefore,
      statusAfter,
      appointmentId,
      details: sanitizedDetailsStr,
    },
  });
}
