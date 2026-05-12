import { DashboardCard } from "@/components/DashboardCard";
import { LineChart } from "@/components/LineChart";
import { LiveEventCard } from "@/components/LiveEventCard";
import { LiveWeatherPanel } from "@/components/LiveWeatherPanel";
import { SectionTitle } from "@/components/SectionTitle";
import { SimpleBarChart } from "@/components/SimpleBarChart";
import { SourceNote } from "@/components/SourceNote";
import { comfortRisk, dashboardMetrics, weeklyDemand } from "@/data/dashboardMetrics";
import { monthlySeriesSources } from "@/data/monthlySeries";
import { calculatedSignals, evidenceNotes, reportAssumptions } from "@/data/reportAssumptions";
import { getLiveEvents, getLiveWeather, getMonthlyTourismSeries } from "@/lib/liveData";
import { levelTone, toneClasses } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function InteligenciaTuristicaPage() {
  const [weather, events, monthlySeries] = await Promise.all([getLiveWeather(), getLiveEvents(), getMonthlyTourismSeries()]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <SectionTitle
          kicker="Inteligencia turística"
          title="Dashboard para sector, cultura y administración"
          description="Indicadores sintéticos para orientar programación, comunicación y distribución de flujos turísticos."
        />
        <button className="focus-ring w-fit rounded-md bg-alicante-blue px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-alicante-deep" type="button">
          Descargar informe
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardMetrics.map((metric) => (
          <DashboardCard key={metric.id} metric={metric} />
        ))}
      </div>

      <div className="mt-8">
        <LiveWeatherPanel weather={weather} />
      </div>

      <section className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <SourceNote />
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <h2 className="text-xl font-bold text-slate-950">Cálculos derivados del informe</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-md bg-alicante-mist p-4">
              <p className="text-2xl font-bold text-alicante-deep">{calculatedSignals.summerGrowthGap.toFixed(1)} p.p.</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">Brecha entre crecimiento turístico extranjero anual y crecimiento en verano.</p>
            </div>
            <div className="rounded-md bg-alicante-mist p-4">
              <p className="text-2xl font-bold text-alicante-deep">+{calculatedSignals.tropicalNightsIncrease}</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">Noches tropicales al año en horizonte 2031-2050 frente al periodo base.</p>
            </div>
            <div className="rounded-md bg-alicante-mist p-4">
              <p className="text-2xl font-bold text-alicante-deep">{reportAssumptions.tourismPibShare}%</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">Peso estimado del turismo en el PIB local usado como contexto económico.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h2 className="text-xl font-bold text-slate-950">Demanda estimada por día</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Lectura útil para dimensionar refuerzos, comunicación y alternativas en franjas de mayor presión.
          </p>
          <div className="mt-4">
            <SimpleBarChart data={weeklyDemand} />
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <h2 className="text-xl font-bold text-slate-950">Riesgo climático semanal</h2>
          <div className="mt-4 space-y-3">
            {comfortRisk.map((item) => (
              <div className="flex items-center justify-between gap-3" key={item.label}>
                <div>
                  <p className="font-semibold text-slate-950">{item.label}</p>
                  <p className="text-sm text-slate-600">{item.score}/100</p>
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs font-bold ${toneClasses(levelTone(item.level))}`}>
                  {item.level}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold text-slate-950">Evolución a 12 meses del confort climático</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">{monthlySeriesSources.comfort}</p>
          <div className="mt-4">
            <LineChart
              data={monthlySeries.points.map((point) => ({ label: point.month, value: point.comfort }))}
              unit=""
            />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-950">Evolución a 12 meses de visitantes a Alicante</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            {monthlySeriesSources.visitors} Total anual usado: {monthlySeries.annualVisitorsThousands.toLocaleString("es-ES")} miles.
          </p>
          <div className="mt-4">
            <LineChart
              color="#1F8A5B"
              data={monthlySeries.points.map((point) => ({ label: point.month, value: point.visitors }))}
              unit="k"
            />
          </div>
          <a className="focus-ring mt-3 inline-flex text-sm font-semibold text-alicante-blue hover:text-alicante-deep" href={monthlySeries.sourceUrl} rel="noreferrer" target="_blank">
            Fuente: {monthlySeries.source}
          </a>
        </div>
      </section>

      <section className="mt-8 rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <h2 className="text-xl font-bold text-slate-950">Insights accionables</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {evidenceNotes.map((note) => (
            <p className="rounded-md bg-alicante-mist p-4 text-sm leading-6 text-slate-700" key={note}>
              {note}
            </p>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <SectionTitle
          kicker="Oferta viva"
          title="Agenda cultural y profesional monitorizada"
          description="Eventos actuales obtenidos de fuentes online para detectar oportunidades de redirección de demanda cuando el confort exterior baja."
        />
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {events.slice(0, 6).map((event) => (
            <LiveEventCard event={event} key={event.id} />
          ))}
        </div>
      </section>
    </div>
  );
}
