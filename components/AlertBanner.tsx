import type { Alert } from "@/data/types";

type AlertBannerProps = {
  alert: Alert;
  showAlternative?: boolean;
};

const severityClasses = {
  Informativa: "border-alicante-violet/20 bg-alicante-violet/10 text-alicante-deep",
  Precaución: "border-amber-300 bg-amber-50 text-amber-900",
  Alta: "border-red-300 bg-red-50 text-red-900",
};

export function AlertBanner({ alert, showAlternative = true }: AlertBannerProps) {
  return (
    <article className={`rounded-[24px] border p-5 shadow-soft ${severityClasses[alert.severity]}`}>
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em]">{alert.severity}</p>
          <h3 className="mt-2 text-xl font-black">{alert.title}</h3>
          <p className="mt-2 leading-7">{alert.message}</p>
        </div>
        <span className="rounded-full bg-white/80 px-3 py-1 text-sm font-bold">Señal operativa</span>
      </div>
      <div className={`mt-4 grid gap-3 text-sm ${showAlternative ? "md:grid-cols-2" : ""}`}>
        <p>
          <strong>Prevención:</strong> {alert.prevention}
        </p>
        {showAlternative ? (
          <p>
            <strong>Alternativa:</strong> {alert.alternative}
          </p>
        ) : null}
      </div>
    </article>
  );
}
