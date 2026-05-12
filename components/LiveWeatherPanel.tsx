import type { LiveWeather } from "@/lib/liveData";

type LiveWeatherPanelProps = {
  weather: LiveWeather;
};

export function LiveWeatherPanel({ weather }: LiveWeatherPanelProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-alicante-blue">Clima real ahora</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">{weather.status}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">{weather.recommendation}</p>
        </div>
        <a className="focus-ring w-fit rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-alicante-deep hover:bg-alicante-sky" href={weather.sourceUrl} rel="noreferrer" target="_blank">
          {weather.source}
        </a>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
    <div className="rounded-md bg-alicante-mist p-4">
      <p className="text-sm font-semibold text-slate-600">{label}</p>
      <p className="mt-1 text-xl font-bold text-alicante-deep">{value}</p>
    </div>
  );
}
