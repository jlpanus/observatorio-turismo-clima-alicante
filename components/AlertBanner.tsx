import type { Alert } from "@/data/types";

type AlertBannerProps = {
  alert: Alert;
};

const severityClasses = {
  Informativa: "border-alicante-blue/25 bg-alicante-sky text-alicante-deep",
  Precaución: "border-amber-300 bg-amber-50 text-amber-900",
  Alta: "border-red-300 bg-red-50 text-red-900",
};

export function AlertBanner({ alert }: AlertBannerProps) {
  return (
    <article className={`rounded-lg border p-5 ${severityClasses[alert.severity]}`}>
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em]">{alert.severity}</p>
          <h3 className="mt-2 text-xl font-bold">{alert.title}</h3>
          <p className="mt-2 leading-7">{alert.message}</p>
        </div>
        <span className="rounded-full bg-white/70 px-3 py-1 text-sm font-semibold">Simulada</span>
      </div>
      <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
        <p>
          <strong>Prevención:</strong> {alert.prevention}
        </p>
        <p>
          <strong>Alternativa:</strong> {alert.alternative}
        </p>
      </div>
    </article>
  );
}
