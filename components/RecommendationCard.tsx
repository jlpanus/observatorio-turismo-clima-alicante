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
    <article className="premium-card flex h-full flex-col p-5 transition duration-200 hover:-translate-y-1 hover:border-alicante-violet/30">
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full border border-alicante-violet/15 bg-alicante-violet/10 px-3 py-1 text-xs font-bold capitalize text-alicante-violet">
          {recommendation.type}
        </span>
        <span className="rounded-full border border-alicante-border bg-white px-3 py-1 text-xs font-bold text-alicante-muted">
          {recommendation.setting}
        </span>
      </div>
      <h3 className="mt-4 text-lg font-black text-alicante-ink">{recommendation.name}</h3>
      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="font-bold text-alicante-muted">Mejor franja</dt>
          <dd className="text-alicante-ink">{recommendation.bestTime}</dd>
        </div>
        <div>
          <dt className="font-bold text-alicante-muted">Recomendación</dt>
          <dd>
            <span className={`mt-1 inline-flex rounded-full border px-3 py-1 text-xs font-bold ${toneClasses(levelTone[recommendation.level])}`}>
              {recommendation.level}
            </span>
          </dd>
        </div>
      </dl>
      <p className="mt-4 flex-1 text-sm leading-6 text-alicante-muted">{recommendation.reason}</p>
    </article>
  );
}
