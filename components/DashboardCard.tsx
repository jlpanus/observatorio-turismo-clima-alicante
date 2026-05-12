import type { DashboardMetric } from "@/data/types";
import { toneClasses } from "@/lib/ui";

type DashboardCardProps = {
  metric: DashboardMetric;
};

export function DashboardCard({ metric }: DashboardCardProps) {
  return (
    <article className={`rounded-lg border p-5 ${toneClasses(metric.tone)}`}>
      <p className="text-sm font-medium opacity-90">{metric.label}</p>
      <p className="mt-3 text-2xl font-bold tracking-tight">{metric.value}</p>
      <p className="mt-3 text-sm leading-6 opacity-90">{metric.trend}</p>
    </article>
  );
}
