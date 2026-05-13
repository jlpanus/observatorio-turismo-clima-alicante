import type { LiveWeather } from "@/lib/liveData";

type LiveWeatherPanelProps = {
  weather: LiveWeather;
};

export function LiveWeatherPanel({ weather }: LiveWeatherPanelProps) {
  return (
    <section className="premium-card p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="purple-badge">Clima real ahora</p>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-alicante-ink">{weather.status}</h2>
          <p className="mt-2 text-sm leading-6 text-alicante-muted">{weather.recommendation}</p>
        </div>
        <a className="secondary-pill w-fit px-4 py-2" href={weather.sourceUrl} rel="noreferrer" target="_blank">
          {weather.source}
        </a>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Temperatura" value={`${weather.temperature.toFixed(1)} ºC`} />
        <Metric label="Sensación" value={`${weather.apparentTemperature.toFixed(1)} ºC`} />
        <Metric label="UV máx. hoy" value={weather.today.uvMax.toFixed(1)} />
        <Metric label="Lluvia" value={`${weather.today.precipitationProbability}%`} />
      </div>
      <p className="mt-4 text-xs text-slate-500">Actualizado: {weather.updatedAt} · Alicante ciudad.</p>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-alicante-border bg-white p-4">
      <p className="text-sm font-semibold text-alicante-muted">{label}</p>
      <p className="mt-1 text-xl font-black text-alicante-ink">{value}</p>
    </div>
  );
}
