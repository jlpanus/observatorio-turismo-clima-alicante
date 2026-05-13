import type { TravelerProfile } from "@/lib/recommendationEngine";

type TouristProfileSummaryProps = {
  profile: TravelerProfile;
};

export function TouristProfileSummary({ profile }: TouristProfileSummaryProps) {
  const items = [
    profile.tripType ? `Viaje: ${profile.tripType}` : undefined,
    profile.interests.length > 0 ? `Intereses: ${profile.interests.join(", ")}` : undefined,
    profile.avoidHeat ? "Evitar calor" : undefined,
    profile.shortTime ? "Poco tiempo" : undefined,
    profile.lowBudget ? "Presupuesto bajo" : undefined,
    profile.calmPace ? "Ritmo tranquilo" : undefined,
    profile.reducedMobility ? "Movilidad reducida" : undefined,
  ].filter(Boolean);

  return (
    <aside className="premium-card p-5">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-alicante-violet">Perfil detectado</p>
      {items.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {items.map((item) => (
            <span className="rounded-full border border-alicante-border bg-alicante-mist px-3 py-1 text-xs font-bold text-alicante-ink" key={item}>
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm leading-6 text-alicante-muted">Aun no tengo suficiente contexto. Cuéntame fechas, acompañantes o intereses.</p>
      )}
    </aside>
  );
}
