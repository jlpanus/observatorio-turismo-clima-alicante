import Link from "next/link";
import { LiveEventCard } from "@/components/LiveEventCard";
import { MetricCard } from "@/components/MetricCard";
import { PlaceFilterGrid } from "@/components/PlaceFilterGrid";
import { ProductMockup } from "@/components/ProductMockup";
import { SectionTitle } from "@/components/SectionTitle";
import { climateToday } from "@/data/climateToday";
import { getLiveEvents, getLiveWeather, getTourismPlaces } from "@/lib/liveData";

export const dynamic = "force-dynamic";

const process = [
  "Captura señales de clima, agenda y contexto turístico.",
  "Calcula confort operativo y riesgo por franja.",
  "Recomienda zonas, horarios y alternativas accionables.",
];

const useCases = [
  {
    role: "Alojamientos urbanos",
    quote: "Anticipan recomendaciones de mañana y reducen dudas repetidas en recepción.",
  },
  {
    role: "Equipamientos culturales",
    quote: "Detectan ventanas de calor donde una alternativa interior gana relevancia.",
  },
  {
    role: "Gestión turística",
    quote: "Ordena mensajes públicos con criterios de confort, demanda y desestacionalización.",
  },
];

export default async function HomePage() {
  const [weather, events, places] = await Promise.all([getLiveWeather(), getLiveEvents(), getTourismPlaces()]);
  const featuredEvents = events.slice(0, 3);

  return (
    <main>
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#EEF2FF_0%,#F8FAFC_45%,#E0F2FE_100%)]">
        <div className="absolute inset-x-0 top-0 h-px bg-white/80" />
        <div className="section-shell py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <p className="purple-badge mx-auto">Observatorio público de decisión turística</p>
            <h1 className="mt-6 text-5xl font-black tracking-tight text-alicante-ink sm:text-6xl lg:text-7xl">
              Hoy en Alicante
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-alicante-slate sm:text-xl">
              Decide en segundos qué hacer según confort térmico, agenda cultural online y señales de saturación turística.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link className="primary-pill" href="/que-hacer-hoy">
                Ver qué hacer hoy
              </Link>
              <Link className="secondary-pill" href="/chat">
                Habla con Bárbara
              </Link>
              <Link className="secondary-pill" href="/inteligencia-turistica">
                Inteligencia turística
              </Link>
            </div>
          </div>

          <div className="mt-12">
            <ProductMockup events={events} weather={weather} />
          </div>
        </div>
      </section>

      <section className="section-shell py-10">
        <div className="grid gap-3 rounded-[28px] border border-alicante-border bg-white p-4 shadow-soft sm:grid-cols-2 lg:grid-cols-4">
          <TrustItem label="Fuente climática" value={weather.source} />
          <TrustItem label="Agenda monitorizada" value={`${events.length} eventos detectados`} />
          <TrustItem label="Confort actual" value={`${weather.comfortScore}/100`} />
          <TrustItem label="Enfoque" value="Turismo + clima + cultura" />
        </div>
      </section>

      <section className="section-shell py-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            detail="Sensación térmica actual usada para ajustar recomendaciones."
            label="Temperatura percibida"
            tone="blue"
            value={`${weather.apparentTemperature.toFixed(1)} ºC`}
          />
          <MetricCard detail={weather.status} label="Nivel de confort" tone="green" value={`${weather.comfortScore}/100`} />
          <MetricCard detail="Estimación operativa por zona y franja horaria." label="Saturación estimada" tone="amber" value={climateToday.crowding} />
          <MetricCard detail={weather.recommendation} label="Recomendación general" tone="blue" value={weather.status} />
        </div>
      </section>

      <section className="section-shell py-14">
        <SectionTitle
          kicker="Disfruta Alicante"
          title="Sitios que visitar con criterio de confort"
          description="Datos abiertos en tiempo real de OpenStreetMap vía Overpass API: puntos de interés, coordenadas y categorías para elegir interiores, exteriores, cultura o mejores opciones según el momento."
        />
        <div className="mt-8">
          <PlaceFilterGrid places={places} />
        </div>
      </section>

      <section className="bg-alicante-mist py-14">
        <div className="section-shell">
          <SectionTitle
            kicker="Oferta cultural actualizada"
            title="Alternativas vivas para días de calor"
            description="Eventos obtenidos de fuentes online para redirigir demanda hacia opciones culturales e interiores cuando conviene."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredEvents.map((event) => (
              <LiveEventCard event={event} key={event.id} />
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Link className="primary-pill" href="/que-hacer-hoy#eventos-recomendados">
              Ver más
            </Link>
          </div>
        </div>
      </section>

      <section className="section-shell py-14">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <SectionTitle
            kicker="Proceso"
            title="De datos dispersos a una decisión operativa"
            description="Transforma clima, agenda y afluencia en una guía sencilla para elegir mejor cada momento de la visita."
          />
          <div className="grid gap-4">
            {process.map((step, index) => (
              <article className="premium-card flex items-center gap-4 p-5" key={step}>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-alicante-violet text-sm font-black text-white">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="font-black text-alicante-ink">{step}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-14">
        <SectionTitle
          kicker="Casos de uso"
          title="Pensado para visitantes y equipos turísticos"
          description="No son testimonios comerciales: son escenarios de uso del producto."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {useCases.map((item) => (
            <article className="premium-card p-6" key={item.role}>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-alicante-violet">{item.role}</p>
              <p className="mt-4 text-lg font-semibold leading-8 text-alicante-ink">“{item.quote}”</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell py-14">
        <div className="overflow-hidden rounded-[28px] border border-sky-200 bg-[linear-gradient(135deg,#0877B9_0%,#0EA5E9_55%,#65BFEA_100%)] p-8 text-center text-white shadow-glow sm:p-12">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/80">Siguiente decisión</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">
            Consulta la recomendación actual y disfruta tu visita al máximo.
          </h2>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link className="secondary-pill" href="/que-hacer-hoy">
              Ver recomendación actual
            </Link>
            <Link className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" href="/chat">
              Habla con Bárbara
            </Link>
            <Link className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" href="/mapa">
              Explorar mapa
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function TrustItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] bg-alicante-mist px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-alicante-muted">{label}</p>
      <p className="mt-2 text-sm font-black text-alicante-ink">{value}</p>
    </div>
  );
}
