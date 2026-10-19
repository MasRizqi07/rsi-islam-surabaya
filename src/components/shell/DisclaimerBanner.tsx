import { HOSPITAL_FACTS } from '@/data/facts';
import { AlertTriangle } from 'lucide-react';

export function DisclaimerBanner() {
  return (
    <aside
      aria-label="Penafian Proyek"
      className="bg-tower-950 text-gold-300 px-4 py-1.5 text-xs text-center border-b border-gold-500/20"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
        <AlertTriangle className="w-3.5 h-3.5 text-gold-500 shrink-0" aria-hidden="true" />
        <span>{HOSPITAL_FACTS.disclaimer.short}</span>
      </div>
    </aside>
  );
}
