'use client';

import { useState, useMemo } from 'react';
import { HistoryMilestone } from '@/data/history';

interface TimelineDecadeClientProps {
  timeline: HistoryMilestone[];
}

type DecadeCategory = 'all' | '1970-1999' | '2000-2019' | '2020-2026';

export function TimelineDecadeClient({ timeline }: TimelineDecadeClientProps) {
  const [activeDecade, setActiveDecade] = useState<DecadeCategory>('all');

  const filteredTimeline = useMemo(() => {
    if (activeDecade === 'all') return timeline;
    return timeline.filter((item) => {
      const year = parseInt(item.year, 10);
      if (activeDecade === '1970-1999') return year >= 1970 && year <= 1999;
      if (activeDecade === '2000-2019') return year >= 2000 && year <= 2019;
      if (activeDecade === '2020-2026') return year >= 2020 && year <= 2026;
      return true;
    });
  }, [timeline, activeDecade]);

  return (
    <div className="space-y-6">
      
      {/* Decade Filter Tabs */}
      <div
        role="tablist"
        aria-label="Filter Garis Waktu Sejarah"
        className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeDecade === 'all'}
          onClick={() => setActiveDecade('all')}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors duration-150 ${
            activeDecade === 'all'
              ? 'bg-tower-800 text-ivory shadow-sm'
              : 'bg-tower-50 text-tower-900 hover:bg-tower-100'
          }`}
        >
          Semua Tonggak ({timeline.length})
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeDecade === '1970-1999'}
          onClick={() => setActiveDecade('1970-1999')}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors duration-150 ${
            activeDecade === '1970-1999'
              ? 'bg-tower-800 text-ivory shadow-sm'
              : 'bg-tower-50 text-tower-900 hover:bg-tower-100'
          }`}
        >
          1975–1999 (Awal Pengabdian)
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeDecade === '2000-2019'}
          onClick={() => setActiveDecade('2000-2019')}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors duration-150 ${
            activeDecade === '2000-2019'
              ? 'bg-tower-800 text-ivory shadow-sm'
              : 'bg-tower-50 text-tower-900 hover:bg-tower-100'
          }`}
        >
          2000–2019 (Ekspansi Mutu)
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeDecade === '2020-2026'}
          onClick={() => setActiveDecade('2020-2026')}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors duration-150 ${
            activeDecade === '2020-2026'
              ? 'bg-tower-800 text-ivory shadow-sm'
              : 'bg-tower-50 text-tower-900 hover:bg-tower-100'
          }`}
        >
          2020–2026 (Era Menara Medis)
        </button>
      </div>

      {/* Timeline Vertical Stack */}
      <div className="relative border-l-2 border-gold-500/40 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-6">
        {filteredTimeline.map((item) => (
          <div key={item.year} className="relative group">
            {/* Titik Emas Garis Waktu */}
            <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-gold-500 border-4 border-ivory shadow-sm group-hover:scale-125 transition-transform duration-150" />

            <div className="bg-white rounded-2xl p-6 border border-tower-100 shadow-xs space-y-2 hover:border-tower-700/40 hover:shadow-md transition-[border-color,box-shadow] duration-150">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-display font-black text-xl sm:text-2xl text-tower-900">
                    {item.year}
                  </span>
                  <h3 className="font-display font-bold text-base sm:text-lg text-tower-950">
                    {item.title}
                  </h3>
                </div>

                {item.tag && (
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-tower-50 text-tower-800 border border-tower-200">
                    {item.tag}
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
