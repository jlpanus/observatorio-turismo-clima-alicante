import type { LiveForecastDay } from "@/lib/liveData";
import { levelTone, toneClasses } from "@/lib/ui";

type ComfortForecastBarsProps = {
  days: LiveForecastDay[];
};

export function ComfortForecastBars({ days }: ComfortForecastBarsProps) {
  return (
    <div className="premium-card p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-alicante-ink">Confort climático por día</h2>
          <p className="mt-2 text-sm leading-6 text-alicante-muted">Cada barra marca el índice previsto sobre 100.</p>
        </div>
        <span className="purple-badge">Semana actual</span>
      </div>
      <div className="mt-6 flex h-72 items-end gap-3 overflow-x-auto pb-2">
        {days.map((day) => (
          <div className="flex min-w-24 flex-1 flex-col items-center gap-3" key={day.date}>
            <div className="flex h-48 w-full items-end rounded-2xl bg-alicante-mist p-2">
              <div
                className="flex w-full items-start justify-center rounded-2xl bg-alicante-violet pt-3 text-sm font-black text-white shadow-glow"
                style={{ height: `${day.comfortScore}%` }}
                title={`${day.date}: ${day.comfortScore}/100`}
              >
                {day.comfortScore}
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs font-black text-alicante-ink">{formatShortDate(day.date)}</p>
              <span className={`mt-2 inline-flex rounded-full border px-2 py-1 text-[11px] font-bold ${toneClasses(levelTone(day.status))}`}>
                {day.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatShortDate(date: string) {
  return new Intl.DateTimeFormat("es-ES", { weekday: "short", day: "2-digit" }).format(new Date(`${date}T12:00:00`));
}
