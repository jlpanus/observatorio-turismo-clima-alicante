import type { ChatActivity } from "@/lib/recommendationEngine";

type ChatRecommendationCardProps = {
  activity: ChatActivity;
};

export function ChatRecommendationCard({ activity }: ChatRecommendationCardProps) {
  return (
    <article className="rounded-[24px] border border-alicante-border bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-alicante-violet">{activity.category}</p>
          <h3 className="mt-2 text-base font-black text-alicante-ink">{activity.name}</h3>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{activity.comfort}/100</span>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <Info label="Zona" value={activity.zone} />
        <Info label="Horario" value={activity.bestTime} />
        <Info label="Duración" value={activity.duration} />
        <Info label="Precio" value={activity.price} />
      </dl>
      <p className="mt-4 rounded-2xl bg-alicante-mist p-3 text-sm leading-6 text-alicante-muted">{activity.reason}</p>
    </article>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-bold text-alicante-muted">{label}</dt>
      <dd className="text-alicante-ink">{value}</dd>
    </div>
  );
}
