"use client";

import { useMemo, useState } from "react";
import { LiveEventCard } from "@/components/LiveEventCard";
import type { LiveEvent } from "@/lib/liveData";

const filters = ["Interior", "Exterior", "Cultura", "Mejor ahora"] as const;
type EventFilter = (typeof filters)[number];

type EventFilterGridProps = {
  events: LiveEvent[];
};

export function EventFilterGrid({ events }: EventFilterGridProps) {
  const [activeFilter, setActiveFilter] = useState<EventFilter>("Interior");
  const filteredEvents = useMemo(() => events.filter((event) => matchesFilter(event, activeFilter)), [activeFilter, events]);

  return (
    <div>
      <div className="flex flex-wrap gap-2" aria-label="Filtros de agenda cultural">
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

      {filteredEvents.length > 0 ? (
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <LiveEventCard event={event} key={event.id} />
          ))}
        </div>
      ) : (
        <div className="premium-card mt-6 p-6 text-sm leading-6 text-alicante-muted">
          No hay actividades futuras que coincidan con este filtro.
        </div>
      )}
    </div>
  );
}

function matchesFilter(event: LiveEvent, filter: EventFilter) {
  const searchable = `${event.title} ${event.category} ${event.summary} ${event.recommendationReason}`.toLowerCase();

  if (filter === "Interior") return event.indoorLikely;
  if (filter === "Exterior") return !event.indoorLikely;
  if (filter === "Cultura") return /cultura|museo|teatro|exposici|patrimonio|concierto|maca|marq|mubag/.test(searchable);
  return event.indoorLikely || /menor exposici|calor|sombra|cubierta|interior/.test(searchable);
}
