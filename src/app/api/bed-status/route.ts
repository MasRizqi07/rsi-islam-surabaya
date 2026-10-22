import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { BED_STATUS_ITEMS } from '@/data/bed-status';

/**
 * Endpoint Publik: Status Ketersediaan Bed Rumah Sakit (US-8 & S9)
 * Membaca data status bed terbaru dari database PostgreSQL secara runtime.
 */
export async function GET() {
  try {
    const dbBeds = await prisma.bedStatus.findMany({
      orderBy: { unit: 'asc' },
    });

    if (dbBeds && dbBeds.length > 0) {
      return NextResponse.json({ beds: dbBeds });
    }

    return NextResponse.json({ beds: BED_STATUS_ITEMS });
  } catch (error) {
    console.error('[API /api/bed-status] Error:', error);
    return NextResponse.json({ beds: BED_STATUS_ITEMS });
  }
}
