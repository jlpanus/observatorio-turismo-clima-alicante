import type { LiveEvent } from "@/lib/liveData";

type LiveEventCardProps = {
  event: LiveEvent;
};

export function LiveEventCard({ event }: LiveEventCardProps) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full border border-alicante-blue/20 bg-alicante-sky px-3 py-1 text-xs font-bold text-alicante-deep">
          {event.category}
        </span>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
          {event.indoorLikely ? "Interior probable" : "Exterior / mixto"}
        </span>
      </div>
      <h3 className="mt-4 text-lg font-bold text-slate-950">{event.title}</h3>
      <dl className="mt-4 space-y-2 text-sm">
        <div>
          <dt className="font-semibold text-slate-600">Fecha</dt>
          <dd className="text-slate-900">{event.dateLabel}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-600">Lugar</dt>
          <dd className="text-slate-900">{event.location}</dd>
        </div>
      </dl>
      <p className="mt-4 flex-1 text-sm leading-6 text-slate-700">{event.summary}</p>
      <p className="mt-4 rounded-md bg-alicante-mist p-3 text-sm leading-6 text-alicante-deep">{event.recommendationReason}</p>
      <div className="mt-4 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
        <span className="text-slate-500">{event.source}</span>
        <a className="focus-ring font-semibold text-alicante-blue hover:text-alicante-deep" href={event.link} rel="noreferrer" target="_blank">
          Ver fuente
        </a>
      </div>
    </article>
  );
}
