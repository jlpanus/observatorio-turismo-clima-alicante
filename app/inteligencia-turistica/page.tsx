import type { ReactNode } from "react";
import { DashboardCard } from "@/components/DashboardCard";
import { LineChart } from "@/components/LineChart";
import { LiveWeatherPanel } from "@/components/LiveWeatherPanel";
import { SectionTitle } from "@/components/SectionTitle";
import { SimpleBarChart } from "@/components/SimpleBarChart";
import { SourceNote } from "@/components/SourceNote";
import { comfortRisk, dashboardMetrics, weeklyDemand } from "@/data/dashboardMetrics";
import { monthlySeriesSources } from "@/data/monthlySeries";
import { calculatedSignals, evidenceNotes, reportAssumptions } from "@/data/reportAssumptions";
import { getLiveWeather, getMonthlyTourismSeries } from "@/lib/liveData";
import { levelTone, toneClasses } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function InteligenciaTuristicaPage() {
  const [weather, monthlySeries] = await Promise.all([getLiveWeather(), getMonthlyTourismSeries()]);

  return (
    <main className="section-shell py-10">
      <div className="flex flex-col gap-6 rounded-[28px] border border-sky-100 bg-[linear-gradient(135deg,#EAF6FF_0%,#FFFFFF_58%,#E8F7F1_100%)] p-6 shadow-soft sm:p-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionTitle
          kicker="Inteligencia turística"
          title="Dashboard para sector, cultura y administración"
          description="Indicadores sintéticos para orientar programación, comunicación y distribución de flujos turísticos."
        />
        <button className="primary-pill w-fit" type="button">
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
        <div className="premium-card p-5">
          <h2 className="text-xl font-black text-alicante-ink">Cálculos derivados del informe</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <InsightStat
              label="Brecha entre crecimiento turístico extranjero anual y crecimiento en verano."
              value={`${calculatedSignals.summerGrowthGap.toFixed(1)} p.p.`}
            />
            <InsightStat
              label="Noches tropicales al año en horizonte 2031-2050 frente al periodo base."
              value={`+${calculatedSignals.tropicalNightsIncrease}`}
            />
            <InsightStat
              label="Peso estimado del turismo en el PIB local usado como contexto económico."
              value={`${reportAssumptions.tourismPibShare}%`}
            />
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h2 className="text-xl font-black text-alicante-ink">Demanda estimada por día</h2>
          <p className="mt-2 text-sm leading-6 text-alicante-muted">
            Lectura útil para dimensionar refuerzos, comunicación y alternativas en franjas de mayor presión.
          </p>
          <div className="mt-4">
            <SimpleBarChart data={weeklyDemand} />
          </div>
        </div>
        <div className="premium-card p-5">
          <h2 className="text-xl font-black text-alicante-ink">Riesgo climático semanal</h2>
          <div className="mt-4 space-y-3">
            {comfortRisk.map((item) => (
              <div className="flex items-center justify-between gap-3 rounded-2xl bg-alicante-mist p-3" key={item.label}>
                <div>
                  <p className="font-bold text-alicante-ink">{item.label}</p>
                  <p className="text-sm text-alicante-muted">{item.score}/100</p>
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
        <ChartBlock description={monthlySeriesSources.comfort} title="Evolución a 12 meses del confort climático">
          <LineChart data={monthlySeries.points.map((point) => ({ label: point.month, value: point.comfort }))} unit="" />
        </ChartBlock>
        <ChartBlock
          description={`${monthlySeriesSources.visitors} Total anual usado: ${monthlySeries.annualVisitorsThousands.toLocaleString("es-ES")} miles.`}
          title="Evolución a 12 meses de visitantes a Alicante"
        >
          <LineChart color="#1F8A5B" data={monthlySeries.points.map((point) => ({ label: point.month, value: point.visitors }))} unit="k" />
          <a
            className="focus-ring mt-3 inline-flex rounded-full px-3 py-2 text-sm font-bold text-alicante-violet hover:bg-alicante-violet/10"
            href={monthlySeries.sourceUrl}
            rel="noreferrer"
            target="_blank"
          >
            Fuente: {monthlySeries.source}
          </a>
        </ChartBlock>
      </section>

      <section className="premium-card mt-8 p-6">
        <h2 className="text-xl font-black text-alicante-ink">Insights accionables</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {evidenceNotes.map((note) => (
            <p className="rounded-2xl bg-alicante-mist p-4 text-sm leading-6 text-alicante-muted" key={note}>
              {note}
            </p>
          ))}
        </div>
      </section>
    </main>
  );
}

function InsightStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-sky-50 p-4">
      <p className="text-2xl font-black text-sky-700">{value}</p>
      <p className="mt-2 text-sm leading-6 text-alicante-muted">{label}</p>
    </div>
  );
}

function ChartBlock({ children, description, title }: { children: ReactNode; description: string; title: string }) {
  return (
    <div>
      <h2 className="text-xl font-black text-alicante-ink">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-alicante-muted">{description}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}
