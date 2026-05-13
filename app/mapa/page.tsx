import { FilterPills } from "@/components/FilterPills";
import { PlacesMap } from "@/components/PlacesMap";
import { SectionTitle } from "@/components/SectionTitle";
import { ZoneCard } from "@/components/ZoneCard";
import { zones } from "@/data/zones";
import { getTourismPlaces } from "@/lib/liveData";

export const dynamic = "force-dynamic";

export default async function MapaPage() {
  const places = await getTourismPlaces();

  return (
    <main className="section-shell py-10">
      <div className="rounded-[32px] bg-[linear-gradient(135deg,#EEF2FF_0%,#FFFFFF_55%,#E0F2FE_100%)] p-6 sm:p-8">
        <SectionTitle
          kicker="Mapa inteligente"
          title="Zonas de Alicante según confort y saturación"
          description="Mapa real de Alicante con puntos de interés de OpenStreetMap/Overpass, categorías y coordenadas para orientar visitas."
        />
      </div>

      <div className="mt-6">
        <FilterPills filters={["Cultura", "Interior", "Exterior", "Evitar calor"]} />
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <PlacesMap places={places} />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
          {zones.map((zone) => (
            <ZoneCard key={zone.id} zone={zone} />
          ))}
        </div>
      </section>
    </main>
  );
}
