import { HOSPITAL_FACTS } from '@/data/facts';
import { AlertTriangle } from 'lucide-react';

export function DisclaimerBanner() {
  return (
    <aside
      aria-label="Penafian Proyek"
      className="md:hidden bg-tower-950 text-gold-300 px-3 py-1 text-[11px] text-center border-b border-gold-500/20"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-1.5">
        <AlertTriangle className="w-3 h-3 text-gold-400 shrink-0" aria-hidden="true" />
        <span className="truncate">{HOSPITAL_FACTS.disclaimer.short}</span>
      </div>
    </aside>
  );
}
