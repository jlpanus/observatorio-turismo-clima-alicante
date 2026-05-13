import type { ComfortTone } from "@/data/types";
import { toneClasses } from "@/lib/ui";

type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
  tone: ComfortTone;
};

export function MetricCard({ label, value, detail, tone }: MetricCardProps) {
  return (
    <article className={`rounded-[22px] border p-5 shadow-soft transition hover:-translate-y-1 ${toneClasses(tone)}`}>
      <p className="text-sm font-medium opacity-90">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
      <p className="mt-3 text-sm leading-6 opacity-90">{detail}</p>
    </article>
  );
}
