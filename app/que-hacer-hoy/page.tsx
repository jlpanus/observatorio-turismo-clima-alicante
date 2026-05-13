import { AlertBanner } from "@/components/AlertBanner";
import { EventFilterGrid } from "@/components/EventFilterGrid";
import { LiveWeatherPanel } from "@/components/LiveWeatherPanel";
import { SectionTitle } from "@/components/SectionTitle";
import { alerts } from "@/data/alerts";
import { climateToday } from "@/data/climateToday";
import { getLiveEvents, getLiveWeather } from "@/lib/liveData";

export const dynamic = "force-dynamic";

export default async function QueHacerHoyPage() {
  const [weather, events] = await Promise.all([getLiveWeather(), getLiveEvents()]);

  return (
    <main className="section-shell py-10">
      <div className="rounded-[32px] bg-[linear-gradient(135deg,#EEF2FF_0%,#FFFFFF_55%,#E0F2FE_100%)] p-6 sm:p-8">
        <SectionTitle
          kicker="Qué hacer hoy"
          title="Actividades recomendadas por confort y horario"
          description="El sistema prioriza actividades viables ahora y desplaza exteriores a franjas con menor estrés térmico."
        />
      </div>

      <div className="mt-6">
        <LiveWeatherPanel weather={weather} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <AlertBanner alert={alerts[0]} showAlternative={false} />
        <aside className="premium-card p-6">
          <p className="purple-badge">Mejor opción actual</p>
          <p className="mt-4 text-3xl font-black tracking-tight text-alicante-ink">Actividad interior</p>
          <p className="mt-3 text-sm leading-6 text-alicante-muted">
            {weather.recommendation}. Si el UV o la sensación térmica suben, evita actividades al aire libre entre las{" "}
            {climateToday.avoidOutdoorWindow}.
          </p>
        </aside>
      </div>

      <section className="mt-10 scroll-mt-32" id="eventos-recomendados">
        <SectionTitle
          kicker="Oferta cultural actualizada"
          title="Eventos recomendados"
          description="Fuente principal: agenda oficial Alicante City & Beach; se complementa con agenda municipal y Convention Bureau."
        />
        <div className="mt-6">
          <EventFilterGrid events={events} />
        </div>
      </section>
    </main>
  );
}
