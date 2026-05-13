import type { Zone } from "@/data/types";
import { scoreTone, toneClasses } from "@/lib/ui";

type ZoneCardProps = {
  zone: Zone;
};

export function ZoneCard({ zone }: ZoneCardProps) {
  const tone = scoreTone(zone.comfort);

  return (
    <article className="premium-card p-5 transition duration-200 hover:-translate-y-1 hover:border-alicante-violet/30">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-alicante-violet">{zone.category}</p>
          <h3 className="mt-2 text-lg font-black text-alicante-ink">{zone.name}</h3>
        </div>
        <span className={`rounded-full border px-3 py-1 text-sm font-bold ${toneClasses(tone)}`}>{zone.comfort}</span>
      </div>
      <div className="mt-4 h-2 rounded-full bg-slate-100">
        <div className="h-2 rounded-full bg-alicante-violet" style={{ width: `${zone.comfort}%` }} />
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="font-bold text-alicante-muted">Confort</dt>
          <dd className="text-alicante-ink">{zone.comfort}/100</dd>
        </div>
        <div>
          <dt className="font-bold text-alicante-muted">Saturación</dt>
          <dd className="text-alicante-ink">{zone.crowding}</dd>
        </div>
      </dl>
      <p className="mt-4 text-sm leading-6 text-alicante-muted">{zone.recommendation}</p>
    </article>
  );
}
