"use client";

import { useMemo, useState } from "react";
import { TourismPlaceCard } from "@/components/TourismPlaceCard";
import type { TourismPlace } from "@/lib/liveData";

const filters = ["Interior", "Exterior", "Cultura", "Mejor ahora"] as const;
type PlaceFilter = (typeof filters)[number];

type PlaceFilterGridProps = {
  places: TourismPlace[];
};

export function PlaceFilterGrid({ places }: PlaceFilterGridProps) {
  const [activeFilter, setActiveFilter] = useState<PlaceFilter>("Cultura");
  const filteredPlaces = useMemo(() => places.filter((place) => matchesFilter(place, activeFilter)), [activeFilter, places]);

  return (
    <div>
      <div className="flex flex-wrap gap-2" aria-label="Filtros de sitios que visitar">
        {filters.map((filter) => (
          <button
            aria-pressed={activeFilter === filter}
            className={`focus-ring rounded-full border px-4 py-2 text-sm font-semibold transition ${
              activeFilter === filter
                ? "border-alicante-violet bg-alicante-violet text-white shadow-glow"
                : "border-alicante-border bg-white text-alicante-muted shadow-soft hover:border-alicante-violet/40 hover:text-alicante-violet"
            }`}
            key={filter}
            onClick={() => setActiveFilter(filter)}
            type="button"
          >
            {filter}
          </button>
        ))}
      </div>

      {filteredPlaces.length > 0 ? (
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredPlaces.map((place) => (
            <TourismPlaceCard key={place.id} place={place} />
          ))}
        </div>
      ) : (
        <div className="premium-card mt-6 p-6 text-sm leading-6 text-alicante-muted">
          No hay sitios de OpenStreetMap que coincidan con este filtro en este momento.
        </div>
      )}
    </div>
  );
}

function matchesFilter(place: TourismPlace, filter: PlaceFilter) {
  const searchable = `${place.title} ${place.category} ${place.summary} ${place.source}`.toLowerCase();

  if (filter === "Interior") return place.indoorLikely;
  if (filter === "Exterior") return !place.indoorLikely;
  if (filter === "Cultura") return /cultura|museo|monumento|patrimonio|castillo|arte/.test(searchable);
  return place.indoorLikely || /museo|jardin|playa|ruta|monumento|sombra|interior/.test(searchable);
}
