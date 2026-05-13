import type { LiveEvent, LiveWeather } from "@/lib/liveData";

type ProductMockupProps = {
  weather: LiveWeather;
  events: LiveEvent[];
};

export function ProductMockup({ weather, events }: ProductMockupProps) {
  const visibleEvents = events.slice(0, 3);
  const heatRisk = Math.max(12, 100 - weather.comfortScore);

  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <div className="absolute inset-x-8 -top-6 h-32 rounded-full bg-alicante-violet/20 blur-3xl" />
      <div className="premium-card relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-alicante-border bg-white/80 px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-300" />
            <span className="h-3 w-3 rounded-full bg-amber-300" />
            <span className="h-3 w-3 rounded-full bg-emerald-300" />
          </div>
          <p className="hidden text-sm font-bold text-alicante-muted sm:block">Alicante hoy</p>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Datos online</span>
        </div>

        <div className="grid gap-4 p-4 sm:p-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[22px] border border-alicante-border bg-gradient-to-br from-white to-alicante-mist p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-alicante-violet">Confort ahora</p>
            <div className="mt-4 grid gap-5 md:grid-cols-[150px_1fr] md:items-center">
              <div>
                <ComfortWheel score={weather.comfortScore} />
                <p className="mt-3 text-sm font-semibold text-alicante-muted">{weather.status}</p>
              </div>
              <div className="rounded-2xl border border-alicante-violet/15 bg-white/70 p-4">
                <h3 className="text-sm font-black text-alicante-ink">Índice de confort climático</h3>
                <p className="mt-2 text-sm leading-6 text-alicante-muted">
                  Es una puntuación calculada de 0 a 100 a partir del clima online de Alicante: temperatura, sensación térmica,
                  humedad, viento, lluvia y radiación UV. Cuanto más alto, más favorable es la visita.
                </p>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <Signal label="Riesgo por calor" value={heatRisk} />
              <Signal label="Probabilidad de lluvia" value={weather.today.precipitationProbability} />
              <Signal label="Oportunidad cultural" value={Math.min(100, visibleEvents.length * 28 + 16)} />
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <MiniMetric label="Sensación" value={`${weather.apparentTemperature.toFixed(1)} ºC`} />
              <MiniMetric label="UV máx." value={weather.today.uvMax.toFixed(1)} />
              <MiniMetric label="Eventos" value={String(events.length)} />
            </div>

            <div className="rounded-[22px] border border-alicante-border bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-black text-alicante-ink">Agenda recomendada</p>
                <span className="rounded-full bg-alicante-violet/10 px-3 py-1 text-xs font-bold text-alicante-violet">
                  Mejor ahora
                </span>
              </div>
              <div className="mt-4 grid gap-3">
                {visibleEvents.map((event) => (
                  <a
                    className="focus-ring block rounded-2xl border border-alicante-border bg-alicante-mist/60 p-3 transition hover:border-alicante-violet/40 hover:bg-white"
                    href={event.link}
                    key={event.id}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <p className="line-clamp-1 text-sm font-bold text-alicante-ink">{event.title}</p>
                    <p className="mt-1 line-clamp-1 text-xs text-alicante-muted">{event.location || event.source}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComfortWheel({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 42;
  const dash = (score / 100) * circumference;

  return (
    <div className="relative h-32 w-32">
      <svg aria-hidden="true" className="h-32 w-32 -rotate-90" viewBox="0 0 104 104">
        <circle cx="52" cy="52" fill="none" r="42" stroke="#E5E7EB" strokeWidth="10" />
        <circle
          cx="52"
          cy="52"
          fill="none"
          r="42"
          stroke="#6C4CF6"
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeLinecap="round"
          strokeWidth="10"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="text-4xl font-black tracking-tight text-alicante-ink">{score}</p>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-alicante-muted">sobre 100</p>
        </div>
      </div>
    </div>
  );
}

function Signal({ label, value }: { label: string; value: number }) {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div>
      <div className="flex items-center justify-between text-xs font-bold text-alicante-muted">
        <span>{label}</span>
        <span>{Math.round(safeValue)}%</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-white">
        <div className="h-2 rounded-full bg-alicante-violet" style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-alicante-border bg-white p-4 shadow-soft">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-alicante-muted">{label}</p>
      <p className="mt-3 text-2xl font-black text-alicante-ink">{value}</p>
    </div>
  );
}
