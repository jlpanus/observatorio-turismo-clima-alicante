import { ComfortForecastBars } from "@/components/ComfortForecastBars";
import { FilterPills } from "@/components/FilterPills";
import { SectionTitle } from "@/components/SectionTitle";
import { getLiveWeather } from "@/lib/liveData";

export const dynamic = "force-dynamic";

export default async function PlanificaPage() {
  const weather = await getLiveWeather();

  return (
    <main className="section-shell py-10">
      <div className="rounded-[32px] bg-[linear-gradient(135deg,#EAF6FF_0%,#FFFFFF_55%,#E8F7F1_100%)] p-6 sm:p-8">
        <SectionTitle
          kicker="Planifica tu viaje"
          title="Calendario climático semanal"
          description="Simula una selección de fechas para decidir cuándo conviene reservar playa, cultura o rutas urbanas."
        />
      </div>

      <div className="premium-card mt-6 p-5">
        <p className="text-sm font-bold text-alicante-muted">Selector visual de fechas</p>
        <div className="mt-4">
          <FilterPills filters={["Esta semana", "Próxima semana", "Fin de semana"]} />
        </div>
      </div>

      <div className="mt-8">
        <ComfortForecastBars days={weather.daily} />
      </div>
    </main>
  );
}
