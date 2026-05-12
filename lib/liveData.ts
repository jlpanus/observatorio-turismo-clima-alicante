import { alerts as fallbackAlerts } from "@/data/alerts";
import { fallbackAnnualForeignVisitorsThousands, monthlyComfortReference, visitorSeasonalWeights } from "@/data/monthlySeries";
import { recommendations as fallbackRecommendations } from "@/data/recommendations";

const ALICANTE = {
  latitude: 38.3452,
  longitude: -0.481,
};

export type LiveWeather = {
  source: string;
  sourceUrl: string;
  updatedAt: string;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  weatherCode: number;
  comfortScore: number;
  status: string;
  recommendation: string;
  today: {
    max: number;
    min: number;
    uvMax: number;
    precipitationProbability: number;
  };
  daily: LiveForecastDay[];
};

export type LiveForecastDay = {
  date: string;
  max: number;
  min: number;
  uvMax: number;
  precipitationProbability: number;
  comfortScore: number;
  status: string;
  bestOutdoorHours: string;
};

export type LiveEvent = {
  id: string;
  title: string;
  source: string;
  sourceUrl: string;
  link: string;
  dateLabel: string;
  location: string;
  category: string;
  summary: string;
  indoorLikely: boolean;
  recommendationReason: string;
};

export type MonthlyTourismSeries = {
  annualVisitorsThousands: number;
  points: { month: string; comfort: number; visitors: number }[];
  source: string;
  sourceUrl: string;
};

type OpenMeteoResponse = {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    uv_index_max: number[];
    precipitation_probability_max: number[];
  };
};

type WordpressEvent = {
  id: number;
  link: string;
  modified?: string;
  title?: { rendered?: string };
  excerpt?: { rendered?: string };
  content?: { rendered?: string };
  class_list?: string[];
};

export async function getLiveWeather(): Promise<LiveWeather> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(ALICANTE.latitude));
  url.searchParams.set("longitude", String(ALICANTE.longitude));
  url.searchParams.set(
    "current",
    "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m",
  );
  url.searchParams.set("daily", "weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_probability_max");
  url.searchParams.set("timezone", "Europe/Madrid");
  url.searchParams.set("forecast_days", "7");

  try {
    const response = await fetch(url, { next: { revalidate: 900 } });
    if (!response.ok) throw new Error(`Open-Meteo ${response.status}`);
    const data = (await response.json()) as OpenMeteoResponse;
    const daily = data.daily.time.map((date, index) => {
      const score = calculateComfortScore({
        apparent: (data.daily.temperature_2m_max[index] + data.daily.temperature_2m_min[index]) / 2,
        uv: data.daily.uv_index_max[index],
        precipitationProbability: data.daily.precipitation_probability_max[index],
      });

      return {
        date,
        max: data.daily.temperature_2m_max[index],
        min: data.daily.temperature_2m_min[index],
        uvMax: data.daily.uv_index_max[index],
        precipitationProbability: data.daily.precipitation_probability_max[index],
        comfortScore: score,
        status: comfortStatus(score),
        bestOutdoorHours: bestOutdoorHours(data.daily.uv_index_max[index], data.daily.temperature_2m_max[index]),
      };
    });

    const comfortScore = calculateComfortScore({
      apparent: data.current.apparent_temperature,
      uv: data.daily.uv_index_max[0],
      precipitationProbability: data.daily.precipitation_probability_max[0],
      wind: data.current.wind_speed_10m,
      humidity: data.current.relative_humidity_2m,
    });

    return {
      source: "Open-Meteo Forecast API",
      sourceUrl: "https://open-meteo.com/",
      updatedAt: data.current.time,
      temperature: data.current.temperature_2m,
      apparentTemperature: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      precipitation: data.current.precipitation,
      weatherCode: data.current.weather_code,
      comfortScore,
      status: comfortStatus(comfortScore),
      recommendation: recommendationFromWeather(comfortScore, data.current.apparent_temperature, data.daily.uv_index_max[0]),
      today: {
        max: data.daily.temperature_2m_max[0],
        min: data.daily.temperature_2m_min[0],
        uvMax: data.daily.uv_index_max[0],
        precipitationProbability: data.daily.precipitation_probability_max[0],
      },
      daily,
    };
  } catch {
    return fallbackWeather();
  }
}

export async function getLiveEvents(): Promise<LiveEvent[]> {
  const [tourism, cityAgenda, congress] = await Promise.all([
    fetchAlicanteTourismEvents(),
    fetchMunicipalTourismAgenda(),
    fetchConventionEvents(),
  ]);

  const merged = [...tourism, ...cityAgenda, ...congress];
  if (merged.length > 0) return dedupeEvents(merged).slice(0, 10);

  return fallbackRecommendations.slice(0, 6).map((item) => ({
    id: `fallback-${item.id}`,
    title: item.name,
    source: "Datos mock locales",
    sourceUrl: "/que-hacer-hoy",
    link: "/que-hacer-hoy",
    dateLabel: item.bestTime,
    location: "Alicante",
    category: item.type,
    summary: item.reason,
    indoorLikely: item.setting === "Interior",
    recommendationReason: "Fallback local mientras no responde la agenda online.",
  }));
}

export function buildWeatherAlerts(weather: LiveWeather) {
  const liveAlerts = [];

  if (weather.today.uvMax >= 7) {
    liveAlerts.push({
      id: "live-uv",
      title: "Índice UV alto previsto hoy",
      severity: "Precaución" as const,
      message: `Open-Meteo estima UV máximo ${weather.today.uvMax.toFixed(1)} en Alicante.`,
      prevention: "Reduce exposición solar en horas centrales, usa sombra, agua y protección solar.",
      alternative: "Prioriza museos, espacios culturales interiores y gastronomía cubierta.",
    });
  }

  if (weather.apparentTemperature >= 30 || weather.today.max >= 32) {
    liveAlerts.push({
      id: "live-heat",
      title: "Confort térmico limitado por calor",
      severity: "Precaución" as const,
      message: `Sensación actual ${weather.apparentTemperature.toFixed(1)} ºC y máxima prevista ${weather.today.max.toFixed(1)} ºC.`,
      prevention: "Evita esfuerzos exteriores prolongados entre 13:00 y 17:00.",
      alternative: "MARQ, MACA, MUBAG, Museo de Aguas y Mercado Central.",
    });
  }

  if (weather.today.precipitationProbability >= 50) {
    liveAlerts.push({
      id: "live-rain",
      title: "Probabilidad de precipitación relevante",
      severity: "Informativa" as const,
      message: `Probabilidad máxima de lluvia: ${weather.today.precipitationProbability}%.`,
      prevention: "Revisa desplazamientos y reserva margen para traslados.",
      alternative: "Agenda cultural interior y visitas a museos.",
    });
  }

  return [...liveAlerts, ...fallbackAlerts].slice(0, 5);
}

export async function getMonthlyTourismSeries(): Promise<MonthlyTourismSeries> {
  const sourceUrl = "https://www.alicanteencifras.com/m11_turismo_extranjeros.htm";
  let annualVisitorsThousands = fallbackAnnualForeignVisitorsThousands;
  let source = "Alicante en Cifras / Turisme Comunitat Valenciana, con fallback local";

  try {
    const response = await fetch(sourceUrl, { next: { revalidate: 86400 } });
    if (!response.ok) throw new Error(`Alicante en Cifras ${response.status}`);
    const html = await response.text();
    const match = html.match(/Total<\/td><td class="interior_ALC_num_CAP">[\d.,]+<\/td><td class="interior_ALC_num_CAP">([\d.,]+)/);
    if (match?.[1]) {
      annualVisitorsThousands = parseSpanishNumber(match[1]);
      source = "Alicante en Cifras / Turisme Comunitat Valenciana";
    }
  } catch {
    source = "Fallback local basado en Alicante en Cifras 2025";
  }

  const points = monthlyComfortReference.map((point, index) => ({
    month: point.month,
    comfort: point.comfort,
    visitors: Math.round(annualVisitorsThousands * visitorSeasonalWeights[index]),
  }));

  return {
    annualVisitorsThousands,
    points,
    source,
    sourceUrl,
  };
}

async function fetchAlicanteTourismEvents(): Promise<LiveEvent[]> {
  try {
    const response = await fetch("https://alicanteturismo.com/wp-json/wp/v2/mec-events?per_page=10&orderby=modified&order=desc", {
      next: { revalidate: 1800 },
    });
    if (!response.ok) throw new Error(`Alicante Turismo ${response.status}`);
    const items = (await response.json()) as WordpressEvent[];

    return items.map((item) => wordpressToEvent(item, "Alicante City & Beach", "https://alicanteturismo.com/agenda/"));
  } catch {
    return [];
  }
}

async function fetchMunicipalTourismAgenda(): Promise<LiveEvent[]> {
  try {
    const response = await fetch("https://www.alicante.es/es/agenda/turismo", { next: { revalidate: 3600 } });
    if (!response.ok) throw new Error(`Ayuntamiento ${response.status}`);
    const html = await response.text();
    return parseMunicipalAgenda(html).slice(0, 4);
  } catch {
    return [];
  }
}

async function fetchConventionEvents(): Promise<LiveEvent[]> {
  try {
    const response = await fetch("https://www.alicantecongresos.com/agenda", { next: { revalidate: 86400 } });
    if (!response.ok) throw new Error(`Convention Bureau ${response.status}`);
    const text = htmlToText(await response.text());
    const matches = [...text.matchAll(/([A-ZÁÉÍÓÚÑ0-9][^\n]{12,120})\s+(\d{2}-\d{2}-\d{2})\s+Lugar:\s+([^\n]{3,80})/g)];

    return matches.slice(0, 3).map((match, index) => ({
      id: `congress-${index}-${match[2]}`,
      title: cleanText(match[1]),
      source: "Alicante Convention Bureau",
      sourceUrl: "https://www.alicantecongresos.com/agenda",
      link: "https://www.alicantecongresos.com/agenda",
      dateLabel: match[2],
      location: cleanText(match[3]),
      category: "MICE",
      summary: "Evento profesional publicado por Alicante Convention Bureau.",
      indoorLikely: true,
      recommendationReason: "Oferta MICE útil para desestacionalización y demanda profesional.",
    }));
  } catch {
    return [];
  }
}

function wordpressToEvent(item: WordpressEvent, source: string, sourceUrl: string): LiveEvent {
  const raw = `${item.content?.rendered ?? ""} ${item.excerpt?.rendered ?? ""}`;
  const text = htmlToText(raw);
  const title = cleanText(item.title?.rendered ?? "Evento cultural");
  const dateLabel = extractFirst(text, /(?:Fecha|Fechas):\s*([^.\n]+)/i) ?? formatDateLabel(item.modified);
  const location = extractFirst(text, /(?:Lugar|Ubicación):\s*([^.\n]+)/i) ?? inferLocation(text, title);
  const category = inferCategory(`${title} ${text} ${(item.class_list ?? []).join(" ")}`);
  const summary = cleanText(text).slice(0, 220) || "Actividad publicada en la agenda oficial.";

  return {
    id: `${source}-${item.id}`,
    title,
    source,
    sourceUrl,
    link: item.link,
    dateLabel,
    location,
    category,
    summary,
    indoorLikely: inferIndoor(`${title} ${location} ${category}`),
    recommendationReason: inferIndoor(`${title} ${location} ${category}`)
      ? "Buena alternativa con menor exposición térmica."
      : "Revisar horario y evitar horas centrales si sube el UV o la temperatura.",
  };
}

function parseMunicipalAgenda(html: string): LiveEvent[] {
  const text = htmlToText(html);
  const blocks = text.split(/\n(?=###\s+)/).slice(1);

  return blocks.map((block, index) => {
    const lines = block.split("\n").map(cleanText).filter(Boolean);
    const title = lines[0]?.replace(/^###\s*/, "") ?? "Actividad municipal";
    const dateLine = lines.find((line) => /^De\s+\d|^\d{1,2}\s/.test(line)) ?? "Fecha según agenda municipal";
    const category = inferCategory(block);

    return {
      id: `municipal-${index}-${title}`,
      title,
      source: "Agenda Turismo Ayuntamiento de Alicante",
      sourceUrl: "https://www.alicante.es/es/agenda/turismo",
      link: "https://www.alicante.es/es/agenda/turismo",
      dateLabel: dateLine,
      location: inferLocation(block, title),
      category,
      summary: cleanText(lines.slice(1, 4).join(" ")).slice(0, 220),
      indoorLikely: inferIndoor(`${title} ${block}`),
      recommendationReason: inferIndoor(`${title} ${block}`)
        ? "Actividad cubierta o cultural, prioritaria si hay calor."
        : "Actividad exterior: conviene ajustar la franja horaria al confort real.",
    };
  });
}

function calculateComfortScore(input: {
  apparent: number;
  uv?: number;
  precipitationProbability?: number;
  wind?: number;
  humidity?: number;
}) {
  let score = 100;
  if (input.apparent > 26) score -= (input.apparent - 26) * 4.2;
  if (input.apparent < 16) score -= (16 - input.apparent) * 3.2;
  if ((input.uv ?? 0) > 6) score -= ((input.uv ?? 0) - 6) * 5;
  score -= ((input.precipitationProbability ?? 0) / 100) * 18;
  if ((input.wind ?? 0) > 28) score -= 8;
  if ((input.humidity ?? 0) > 75) score -= 6;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function comfortStatus(score: number) {
  if (score >= 82) return "Óptimo";
  if (score >= 68) return "Bueno con ajustes horarios";
  if (score >= 50) return "Precaución";
  return "Evitar exposición prolongada";
}

function recommendationFromWeather(score: number, apparent: number, uv: number) {
  if (score < 55 || apparent >= 30 || uv >= 8) return "Prioriza interior cultural y sombra";
  if (uv >= 7) return "Exterior temprano + interior al mediodía";
  return "Buen momento para exterior suave y cultura";
}

function bestOutdoorHours(uv: number, max: number) {
  if (uv >= 7 || max >= 30) return "08:00-11:00 y 19:00-21:00";
  if (uv >= 5 || max >= 27) return "09:00-12:00 y 18:30-21:00";
  return "10:00-13:00 y 16:30-20:00";
}

function fallbackWeather(): LiveWeather {
  const comfortScore = 74;
  const daily = Array.from({ length: 7 }, (_, index) => ({
    date: new Date(Date.now() + index * 86400000).toISOString().slice(0, 10),
    max: 27,
    min: 18,
    uvMax: 7,
    precipitationProbability: 10,
    comfortScore,
    status: comfortStatus(comfortScore),
    bestOutdoorHours: "09:00-12:00 y 18:30-21:00",
  }));

  return {
    source: "Fallback local por indisponibilidad de Open-Meteo",
    sourceUrl: "https://open-meteo.com/",
    updatedAt: new Date().toISOString(),
    temperature: 26,
    apparentTemperature: 24,
    humidity: 45,
    windSpeed: 12,
    precipitation: 0,
    weatherCode: 1,
    comfortScore,
    status: comfortStatus(comfortScore),
    recommendation: "Cultura + exterior suave",
    today: {
      max: 27,
      min: 18,
      uvMax: 7,
      precipitationProbability: 10,
    },
    daily,
  };
}

function htmlToText(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<\/(p|li|h[1-6]|div|tr)>/gi, "\n")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8211;|&ndash;/g, "-")
    .replace(/&#8220;|&#8221;|&quot;/g, "\"")
    .replace(/&#8230;/g, "...")
    .replace(/\s+\n/g, "\n")
    .replace(/\n\s+/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

function cleanText(value: string) {
  return value.replace(/\s+/g, " ").replace(/^\W+/, "").trim();
}

function parseSpanishNumber(value: string) {
  return Number(value.replace(/\./g, "").replace(",", "."));
}

function extractFirst(text: string, pattern: RegExp) {
  const match = text.match(pattern);
  return match?.[1] ? cleanText(match[1]) : undefined;
}

function formatDateLabel(value?: string) {
  if (!value) return "Fecha según fuente";
  return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

function inferCategory(text: string) {
  const lower = text.toLowerCase();
  if (/museo|maca|marq|mubag|exposici|cultura|teatro|concierto|cigarreras/.test(lower)) return "Cultura";
  if (/gastronom|mercado|showcooking|degustaci/.test(lower)) return "Gastronomía";
  if (/mice|congreso|convención|convention bureau|auditorio adda|palacio de congresos/.test(lower)) return "MICE";
  if (/playa|sender|ruta|tabarca|cabo|tossal/.test(lower)) return "Exterior";
  return "Ocio";
}

function inferLocation(text: string, title: string) {
  const known = ["MARQ", "MACA", "MUBAG", "Museo de Aguas", "Las Cigarreras", "Mercado Central", "Castillo de Santa Bárbara", "Playa de San Juan", "Postiguet"];
  const found = known.find((place) => `${text} ${title}`.toLowerCase().includes(place.toLowerCase()));
  return found ?? "Alicante";
}

function inferIndoor(text: string) {
  return /museo|marq|maca|mubag|cigarreras|mercado|congreso|auditorio|centro cultural|interior|sala/i.test(text);
}

function dedupeEvents(events: LiveEvent[]) {
  const seen = new Set<string>();
  return events.filter((event) => {
    const key = event.title.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
