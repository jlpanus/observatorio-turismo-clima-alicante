import { AlertBanner } from "@/components/AlertBanner";
import { SectionTitle } from "@/components/SectionTitle";
import { buildWeatherAlerts, getLiveWeather } from "@/lib/liveData";

export const dynamic = "force-dynamic";

export default async function AlertasPage() {
  const weather = await getLiveWeather();
  const alerts = buildWeatherAlerts(weather);

  return (
    <main className="section-shell py-10">
      <div className="rounded-[32px] bg-[linear-gradient(135deg,#EEF2FF_0%,#FFFFFF_55%,#E0F2FE_100%)] p-6 sm:p-8">
        <SectionTitle
          kicker="Alertas"
          title="Avisos climáticos y alternativas recomendadas"
          description="Avisos derivados del forecast online y complementados con recomendaciones preventivas del MVP."
        />
      </div>
      <div className="mt-6 grid gap-5">
        {alerts.map((alert) => (
          <AlertBanner alert={alert} key={alert.id} />
        ))}
      </div>
    </main>
  );
}
