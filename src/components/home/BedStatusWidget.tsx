'use client';

import { useState, useEffect } from 'react';
import { BED_STATUS_ITEMS } from '@/data/bed-status';
import { BedStatusItem } from '@/data/types';
import { HOSPITAL_FACTS } from '@/data/facts';
import { Bed, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export function BedStatusWidget({ isTeaser = false }: { isTeaser?: boolean }) {
  const [items, setItems] = useState<BedStatusItem[]>(
    isTeaser ? BED_STATUS_ITEMS.slice(0, 4) : BED_STATUS_ITEMS
  );

  useEffect(() => {
    fetch('/api/bed-status')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.beds && Array.isArray(data.beds)) {
          setItems(isTeaser ? data.beds.slice(0, 4) : data.beds);
        }
      })
      .catch(() => {
        // Fallback default fixture
      });
  }, [isTeaser]);

  return (
    <div className="bg-white rounded-2xl p-6 border border-tower-100 shadow-sm space-y-4">
      {/* HEADER WIDGET */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-tower-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-tower-100 flex items-center justify-center text-tower-800">
            <Bed className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-tower-900 leading-tight">
              Status Ketersediaan Kamar
            </h2>
            <span className="text-xs text-ink-soft">
              Pusat Perawatan Kritis Terpadu (Tower Lt. 4)
            </span>
          </div>
        </div>

        {/* LENCANA ILUSTRASI TEGAS */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gold-100 text-tower-950 border border-gold-500/40">
          <AlertCircle className="w-3.5 h-3.5 text-tower-800 shrink-0" aria-hidden="true" />
          <span>Data Simulasi / Ilustrasi</span>
        </span>
      </div>

      {/* LIST UNIT PERAWATAN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item) => {
          let badgeClass = 'bg-tower-50 text-tower-800 border-tower-600/20';
          let icon = <CheckCircle className="w-3.5 h-3.5 text-tower-700" />;
          let labelText = 'Tersedia';

          if (item.status === 'terbatas') {
            badgeClass = 'bg-gold-100 text-tower-950 border-gold-500/40';
            icon = <Clock className="w-3.5 h-3.5 text-tower-800" />;
            labelText = 'Terbatas';
          } else if (item.status === 'penuh') {
            badgeClass = 'bg-alert-50 text-alert-600 border-alert-600/30';
            icon = <AlertCircle className="w-3.5 h-3.5 text-alert-600" />;
            labelText = 'Penuh';
          }

          return (
            <div
              key={item.unit}
              className="p-3.5 rounded-xl bg-ivory border border-tower-100 flex items-start justify-between gap-2"
            >
              <div className="space-y-1">
                <span className="font-bold text-sm text-tower-950 block">
                  {item.unit}
                </span>
                {item.note && (
                  <span className="text-[11px] text-ink-soft line-clamp-1 block">
                    {item.note}
                  </span>
                )}
              </div>

              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold border shrink-0 ${badgeClass}`}
              >
                {icon}
                <span>{labelText}</span>
              </span>
            </div>
          );
        })}
      </div>

      <div className="pt-2 text-[11px] text-ink-soft text-right italic">
        * Pembaruan berkala internal rumah sakit. Untuk konfirmasi rujukan darurat, hubungi IGD {HOSPITAL_FACTS.emergency.callCenterNumber}.
      </div>
    </div>
  );
}
