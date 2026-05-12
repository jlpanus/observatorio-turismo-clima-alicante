import { FilterPills } from "@/components/FilterPills";
import { SectionTitle } from "@/components/SectionTitle";
import { getLiveWeather } from "@/lib/liveData";
import { levelTone, toneClasses } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function PlanificaPage() {
  const weather = await getLiveWeather();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SectionTitle
        kicker="Planifica tu viaje"
        title="Calendario climático semanal"
        description="Simula una selección de fechas para decidir cuándo conviene reservar playa, cultura o rutas urbanas."
      />

      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <p className="text-sm font-semibold text-slate-700">Selector visual de fechas</p>
        <div className="mt-4">
          <FilterPills filters={["Esta semana", "Próxima semana", "Fin de semana"]} />
        </div>
      </div>

      <div className="mt-8 grid gap-4">
        {weather.daily.map((day) => (
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft" key={day.date}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600">{day.date}</p>
                <h2 className="mt-1 text-xl font-bold text-slate-950">Forecast Open-Meteo</h2>
              </div>
              <span className={`w-fit rounded-full border px-3 py-1 text-sm font-bold ${toneClasses(levelTone(day.status))}`}>
                {day.status}
              </span>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-[160px_1fr_1fr] md:items-center">
              <div>
                <p className="text-3xl font-bold text-alicante-blue">{day.comfortScore}</p>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">confort</p>
              </div>
              <p className="text-sm leading-6 text-slate-700">
                Máx. {day.max.toFixed(1)} ºC · mín. {day.min.toFixed(1)} ºC · UV {day.uvMax.toFixed(1)} · lluvia {day.precipitationProbability}%.
              </p>
              <p className="rounded-md bg-alicante-mist px-4 py-3 text-sm font-semibold text-alicante-deep">
                Mejores horas exteriores: {day.bestOutdoorHours}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
