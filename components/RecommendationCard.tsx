import type { Recommendation } from "@/data/types";
import { toneClasses } from "@/lib/ui";

type RecommendationCardProps = {
  recommendation: Recommendation;
};

const levelTone = {
  Alta: "green",
  Media: "amber",
  Baja: "red",
} as const;

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
          {recommendation.type}
        </span>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
          {recommendation.setting}
        </span>
      </div>
      <h3 className="mt-4 text-lg font-bold text-slate-950">{recommendation.name}</h3>
      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="font-semibold text-slate-600">Mejor franja</dt>
          <dd className="text-slate-900">{recommendation.bestTime}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-600">Recomendación</dt>
          <dd>
            <span className={`mt-1 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${toneClasses(levelTone[recommendation.level])}`}>
              {recommendation.level}
            </span>
          </dd>
        </div>
      </dl>
      <p className="mt-4 flex-1 text-sm leading-6 text-slate-700">{recommendation.reason}</p>
    </article>
  );
}
