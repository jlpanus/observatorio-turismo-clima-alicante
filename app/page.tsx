import Link from "next/link";
import { ComfortScore } from "@/components/ComfortScore";
import { LiveEventCard } from "@/components/LiveEventCard";
import { LiveWeatherPanel } from "@/components/LiveWeatherPanel";
import { MetricCard } from "@/components/MetricCard";
import { RecommendationCard } from "@/components/RecommendationCard";
import { SectionTitle } from "@/components/SectionTitle";
import { SourceNote } from "@/components/SourceNote";
import { climateToday } from "@/data/climateToday";
import { recommendations } from "@/data/recommendations";
import { getLiveEvents, getLiveWeather } from "@/lib/liveData";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featured = recommendations.filter((item) => item.featured).slice(0, 3);
  const [weather, events] = await Promise.all([getLiveWeather(), getLiveEvents()]);
  const featuredEvents = events.slice(0, 3);

  return (
    <div>
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-14">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-alicante-blue">
              Observatorio público
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Hoy en Alicante
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-700">
              Decide en segundos qué hacer según confort térmico, saturación estimada y alternativas culturales.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                className="focus-ring inline-flex items-center justify-center rounded-md bg-alicante-blue px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-alicante-deep"
                href="/que-hacer-hoy"
              >
                Ver qué hacer hoy
              </Link>
              <Link
                className="focus-ring inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-alicante-blue hover:text-alicante-blue"
                href="/inteligencia-turistica"
              >
                Inteligencia turística
              </Link>
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-alicante-mist p-5 shadow-soft">
            <ComfortScore
              score={weather.comfortScore}
              label={weather.status}
              description={`Fuente online: ${weather.recommendation}. ${climateToday.summary}`}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Temperatura percibida" value={`${weather.apparentTemperature.toFixed(1)} ºC`} detail={`Temperatura real ${weather.temperature.toFixed(1)} ºC`} tone="blue" />
          <MetricCard label="Nivel de confort" value={weather.status} detail="Índice calculado con clima online" tone="green" />
          <MetricCard label="Saturación estimada" value={climateToday.crowding} detail="Mayor presión en playa y Explanada" tone="amber" />
          <MetricCard label="Recomendación general" value={weather.recommendation} detail={`UV máx. ${weather.today.uvMax.toFixed(1)} · lluvia ${weather.today.precipitationProbability}%`} tone="blue" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <LiveWeatherPanel weather={weather} />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionTitle
          kicker="Decisión rápida"
          title="Agenda viva recomendada"
          description="Actividades obtenidas de fuentes online y cruzadas con el confort climático actual."
        />
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {featuredEvents.map((item) => (
            <LiveEventCard event={item} key={item.id} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionTitle
          kicker="Base local"
          title="Recomendaciones de respaldo"
          description="Se mantienen como fallback si alguna fuente online no responde."
        />
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {featured.map((item) => (
            <RecommendationCard key={item.id} recommendation={item} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SourceNote />
      </section>
    </div>
  );
}
