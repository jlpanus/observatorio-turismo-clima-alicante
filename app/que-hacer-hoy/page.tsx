import { AlertBanner } from "@/components/AlertBanner";
import { FilterPills } from "@/components/FilterPills";
import { LiveEventCard } from "@/components/LiveEventCard";
import { LiveWeatherPanel } from "@/components/LiveWeatherPanel";
import { RecommendationCard } from "@/components/RecommendationCard";
import { SectionTitle } from "@/components/SectionTitle";
import { alerts } from "@/data/alerts";
import { climateToday } from "@/data/climateToday";
import { recommendations } from "@/data/recommendations";
import { getLiveEvents, getLiveWeather } from "@/lib/liveData";

export const dynamic = "force-dynamic";

export default async function QueHacerHoyPage() {
  const [weather, events] = await Promise.all([getLiveWeather(), getLiveEvents()]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SectionTitle
        kicker="Qué hacer hoy"
        title="Actividades recomendadas por confort y horario"
        description="El sistema prioriza actividades viables ahora y desplaza exteriores a franjas con menor estrés térmico."
      />

      <div className="mt-6">
        <LiveWeatherPanel weather={weather} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <AlertBanner alert={alerts[0]} />
        <aside className="rounded-lg border border-alicante-blue/20 bg-white p-5 shadow-soft">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-alicante-blue">Mejor opción actual</p>
          <p className="mt-3 text-2xl font-bold text-slate-950">Actividad interior</p>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            {weather.recommendation}. Si el UV o la sensación térmica suben, evita actividades al aire libre entre las {climateToday.avoidOutdoorWindow}.
          </p>
        </aside>
      </div>

      <div className="mt-8">
        <FilterPills filters={["Interior", "Exterior", "Cultura", "Mejor ahora"]} />
      </div>

      <section className="mt-6">
        <SectionTitle
          kicker="Oferta cultural actualizada"
          title="Eventos online recomendados"
          description="Fuente principal: agenda oficial Alicante City & Beach; se complementa con agenda municipal y Convention Bureau cuando responden."
        />
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <LiveEventCard event={event} key={event.id} />
          ))}
        </div>
      </section>

      <SectionTitle
        kicker="Fallback"
        title="Actividades locales simuladas"
        description="Se conservan como respaldo para pruebas del MVP."
      />
      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((item) => (
          <RecommendationCard key={item.id} recommendation={item} />
        ))}
      </div>
    </div>
  );
}
