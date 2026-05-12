import { AlertBanner } from "@/components/AlertBanner";
import { SectionTitle } from "@/components/SectionTitle";
import { buildWeatherAlerts, getLiveWeather } from "@/lib/liveData";

export const dynamic = "force-dynamic";

export default async function AlertasPage() {
  const weather = await getLiveWeather();
  const alerts = buildWeatherAlerts(weather);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SectionTitle
        kicker="Alertas"
        title="Avisos climáticos y alternativas recomendadas"
        description="Avisos derivados del forecast online y complementados con recomendaciones preventivas del MVP."
      />
      <div className="mt-6 grid gap-5">
        {alerts.map((alert) => (
          <AlertBanner alert={alert} key={alert.id} />
        ))}
      </div>
    </div>
  );
}
