type ComfortScoreProps = {
  score: number;
  label: string;
  description: string;
};

export function ComfortScore({ score, label, description }: ComfortScoreProps) {
  const circumference = 2 * Math.PI * 54;
  const dash = (score / 100) * circumference;

  return (
    <div className="grid gap-6 sm:grid-cols-[168px_1fr] sm:items-center">
      <div className="relative h-40 w-40">
        <svg aria-hidden="true" className="h-40 w-40 -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" fill="none" r="54" stroke="#E5E7EB" strokeWidth="12" />
          <circle
            cx="64"
            cy="64"
            fill="none"
            r="54"
            stroke="#6C4CF6"
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeLinecap="round"
            strokeWidth="12"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-alicante-ink">{score}</span>
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-alicante-muted">sobre 100</span>
        </div>
      </div>
      <div>
        <p className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-800">
          {label}
        </p>
        <p className="mt-4 text-lg leading-8 text-alicante-slate">{description}</p>
        <p className="mt-3 text-sm text-alicante-muted">
          Lectura rápida: cuanto mayor es el índice, más cómodas son las actividades exteriores e interiores.
        </p>
      </div>
    </div>
  );
}
