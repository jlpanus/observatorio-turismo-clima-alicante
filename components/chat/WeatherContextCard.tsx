import type { LiveWeather } from "@/lib/liveData";

type WeatherContextCardProps = {
  weather: LiveWeather;
};

export function WeatherContextCard({ weather }: WeatherContextCardProps) {
  return (
    <aside className="premium-card p-5">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-alicante-violet">Contexto climático</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Metric label="Confort" value={`${weather.comfortScore}/100`} />
        <Metric label="Sensación" value={`${weather.apparentTemperature.toFixed(1)} ºC`} />
        <Metric label="UV máx." value={weather.today.uvMax.toFixed(1)} />
        <Metric label="Lluvia" value={`${weather.today.precipitationProbability}%`} />
      </div>
      <p className="mt-4 text-sm leading-6 text-alicante-muted">{weather.recommendation}</p>
    </aside>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-alicante-mist p-3">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-alicante-muted">{label}</p>
      <p className="mt-1 text-lg font-black text-alicante-ink">{value}</p>
    </div>
  );
}
