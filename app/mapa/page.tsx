import { FilterPills } from "@/components/FilterPills";
import { SectionTitle } from "@/components/SectionTitle";
import { ZoneCard } from "@/components/ZoneCard";
import { zones } from "@/data/zones";

export default function MapaPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SectionTitle
        kicker="Mapa inteligente"
        title="Zonas de Alicante según confort y saturación"
        description="Mapa simulado para traducir condiciones climáticas y presión turística en decisiones por zona."
      />

      <div className="mt-6">
        <FilterPills filters={["Cultura", "Interior", "Exterior", "Evitar calor"]} />
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
          <iframe
            className="h-[460px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.openstreetmap.org/export/embed.html?bbox=-0.546%2C38.320%2C-0.350%2C38.435&layer=mapnik&marker=38.3452%2C-0.4810"
            title="Mapa real de Alicante en OpenStreetMap"
          />
          <div className="flex flex-col gap-2 border-t border-slate-200 p-4 text-sm text-slate-700 sm:flex-row sm:items-center sm:justify-between">
            <p>Mapa real de Alicante basado en OpenStreetMap. Las zonas se interpretan en las tarjetas de decisión.</p>
            <a
              className="focus-ring font-semibold text-alicante-blue hover:text-alicante-deep"
              href="https://www.openstreetmap.org/#map=13/38.3452/-0.4810"
              rel="noreferrer"
              target="_blank"
            >
              Abrir mapa completo
            </a>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {zones.map((zone) => (
            <ZoneCard key={zone.id} zone={zone} />
          ))}
        </div>
      </section>
    </div>
  );
}
