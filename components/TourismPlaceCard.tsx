import type { TourismPlace } from "@/lib/liveData";

type TourismPlaceCardProps = {
  place: TourismPlace;
};

export function TourismPlaceCard({ place }: TourismPlaceCardProps) {
  return (
    <article className="premium-card flex h-full flex-col overflow-hidden transition hover:-translate-y-1">
      <a className="focus-ring block" href={place.link} rel="noreferrer" target="_blank">
        <div
          aria-label={`Imagen de ${place.title}`}
          className="h-48 bg-cover bg-center"
          role="img"
          style={{ backgroundImage: `url("${place.image}")` }}
        />
      </a>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-alicante-violet/15 bg-alicante-violet/10 px-3 py-1 text-xs font-bold text-alicante-violet">
            {place.category}
          </span>
          <span className="rounded-full border border-alicante-border bg-slate-50 px-3 py-1 text-xs font-semibold text-alicante-muted">
            {place.indoorLikely ? "Interior" : "Exterior"}
          </span>
        </div>
        <h3 className="mt-4 text-lg font-black tracking-tight text-alicante-ink">{place.title}</h3>
        {place.rating ? (
          <p className="mt-2 text-sm font-bold text-alicante-violet">
            {place.rating.toFixed(1)} · {place.userRatingCount?.toLocaleString("es-ES") ?? 0} reseñas
          </p>
        ) : null}
        {place.address ? <p className="mt-2 text-sm leading-5 text-alicante-muted">{place.address}</p> : null}
        <p className="mt-3 flex-1 text-sm leading-6 text-alicante-muted">{place.summary}</p>
        <p className="mt-4 rounded-[18px] bg-alicante-violet/10 p-3 text-sm leading-6 text-alicante-deep">
          {place.recommendationReason}
        </p>
        <div className="mt-4 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
          <span className="text-slate-500">{place.source}</span>
          <a className="focus-ring font-bold text-alicante-violet hover:text-[#5C3EE5]" href={place.link} rel="noreferrer" target="_blank">
            Ver sitio
          </a>
        </div>
      </div>
    </article>
  );
}
