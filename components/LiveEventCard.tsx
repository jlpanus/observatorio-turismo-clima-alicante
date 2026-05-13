import type { LiveEvent } from "@/lib/liveData";

type LiveEventCardProps = {
  event: LiveEvent;
};

export function LiveEventCard({ event }: LiveEventCardProps) {
  return (
    <article className="premium-card flex h-full flex-col p-5 transition hover:-translate-y-1">
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full border border-alicante-violet/15 bg-alicante-violet/10 px-3 py-1 text-xs font-bold text-alicante-violet">
          {event.category}
        </span>
        <span className="rounded-full border border-alicante-border bg-slate-50 px-3 py-1 text-xs font-semibold text-alicante-muted">
          {event.indoorLikely ? "Interior probable" : "Exterior / mixto"}
        </span>
      </div>
      <h3 className="mt-4 text-lg font-black tracking-tight text-alicante-ink">{event.title}</h3>
      <dl className="mt-4 space-y-2 text-sm">
        <div>
          <dt className="font-semibold text-alicante-muted">Fecha</dt>
          <dd className="text-alicante-ink">{event.dateLabel}</dd>
        </div>
        <div>
          <dt className="font-semibold text-alicante-muted">Lugar</dt>
          <dd className="text-alicante-ink">{event.location}</dd>
        </div>
      </dl>
      <p className="mt-4 flex-1 text-sm leading-6 text-alicante-muted">{event.summary}</p>
      <p className="mt-4 rounded-[18px] bg-alicante-violet/10 p-3 text-sm leading-6 text-alicante-deep">{event.recommendationReason}</p>
      <div className="mt-4 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
        <span className="text-slate-500">{event.source}</span>
        <a className="focus-ring font-bold text-alicante-violet hover:text-[#5C3EE5]" href={event.link} rel="noreferrer" target="_blank">
          Ver fuente
        </a>
      </div>
    </article>
  );
}
