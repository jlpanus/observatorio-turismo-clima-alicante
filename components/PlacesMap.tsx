import type { TourismPlace } from "@/lib/liveData";

type PlacesMapProps = {
  places: TourismPlace[];
};

const bounds = {
  west: -0.546,
  east: -0.35,
  south: 38.32,
  north: 38.435,
};

export function PlacesMap({ places }: PlacesMapProps) {
  const positionedPlaces = places.filter((place) => typeof place.latitude === "number" && typeof place.longitude === "number");

  return (
    <div className="overflow-hidden rounded-[28px] border border-alicante-border bg-white shadow-soft">
      <div className="relative">
        <iframe
          className="h-[500px] w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.openstreetmap.org/export/embed.html?bbox=-0.546%2C38.320%2C-0.350%2C38.435&layer=mapnik&marker=38.3452%2C-0.4810"
          title="Mapa real de Alicante en OpenStreetMap"
        />
        <div className="pointer-events-none absolute inset-0">
          {positionedPlaces.slice(0, 12).map((place, index) => (
            <a
              aria-label={place.title}
              className="pointer-events-auto absolute grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-alicante-violet text-xs font-black text-white shadow-glow transition hover:scale-110"
              href={place.link}
              key={place.id}
              rel="noreferrer"
              style={pinStyle(place)}
              target="_blank"
              title={`${place.title}${place.rating ? ` · ${place.rating.toFixed(1)}` : ""}`}
            >
              {index + 1}
            </a>
          ))}
        </div>
      </div>
      <div className="border-t border-alicante-border p-4">
        <p className="text-sm leading-6 text-alicante-muted">
          Puntos obtenidos en tiempo real desde OpenStreetMap mediante Overpass API para museos, monumentos, playas, jardines, miradores y equipamientos culturales.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {places.slice(0, 8).map((place, index) => (
            <a
              className="focus-ring flex gap-3 rounded-2xl border border-alicante-border bg-alicante-mist p-3 transition hover:border-alicante-violet/40 hover:bg-white"
              href={place.link}
              key={place.id}
              rel="noreferrer"
              target="_blank"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-alicante-violet text-xs font-black text-white">
                {index + 1}
              </span>
              <span>
                <span className="block font-bold text-alicante-ink">{place.title}</span>
                <span className="text-sm text-alicante-muted">
                  {place.rating ? `${place.rating.toFixed(1)} · ` : ""}
                  {place.category}
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function pinStyle(place: TourismPlace) {
  const longitude = place.longitude ?? -0.481;
  const latitude = place.latitude ?? 38.3452;
  const left = ((longitude - bounds.west) / (bounds.east - bounds.west)) * 100;
  const top = (1 - (latitude - bounds.south) / (bounds.north - bounds.south)) * 100;

  return {
    left: `${Math.min(96, Math.max(4, left))}%`,
    top: `${Math.min(94, Math.max(6, top))}%`,
  };
}
