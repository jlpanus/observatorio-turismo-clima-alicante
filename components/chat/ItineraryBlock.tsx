type ItineraryBlockProps = {
  items: { time: string; title: string; detail: string }[];
};

export function ItineraryBlock({ items }: ItineraryBlockProps) {
  if (items.length === 0) return null;

  return (
    <section className="premium-card p-5">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-alicante-violet">Itinerario sugerido</p>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div className="grid gap-3 rounded-2xl bg-alicante-mist p-4 sm:grid-cols-[90px_1fr]" key={`${item.time}-${item.title}`}>
            <p className="font-black text-alicante-violet">{item.time}</p>
            <div>
              <h3 className="font-black text-alicante-ink">{item.title}</h3>
              <p className="mt-1 text-sm leading-6 text-alicante-muted">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
