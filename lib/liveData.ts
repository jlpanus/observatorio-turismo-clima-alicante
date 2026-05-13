import { alerts as fallbackAlerts } from "@/data/alerts";
import { fallbackAnnualForeignVisitorsThousands, monthlyComfortReference, visitorSeasonalWeights } from "@/data/monthlySeries";

const ALICANTE = {
  latitude: 38.3452,
  longitude: -0.481,
};

const ALICANTE_PLACES_BBOX = {
  south: 38.32,
  west: -0.546,
  north: 38.435,
  east: -0.35,
};

const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.openstreetmap.ru/api/interpreter",
];

const OVERPASS_USER_AGENT = "ObservatorioDigitalTurismoClimaAlicante/1.0 (local MVP)";

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

export type TourismPlace = {
  id: string;
  title: string;
  source: string;
  sourceUrl: string;
  link: string;
  category: string;
  summary: string;
  image: string;
  indoorLikely: boolean;
  recommendationReason: string;
  rating?: number;
  userRatingCount?: number;
  address?: string;
  latitude?: number;
  longitude?: number;
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

type OverpassResponse = {
  elements?: OverpassElement[];
};

type OverpassElement = {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat?: number; lon?: number };
  tags?: Record<string, string>;
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
  const tourism = await fetchAlicanteTourismEvents();
  const upcoming = dedupeEvents(tourism).filter((event) => isUpcomingDateLabel(event.dateLabel));
  return upcoming.slice(0, 12);
}

export async function getTourismPlaces(): Promise<TourismPlace[]> {
  const query = buildOverpassPlacesQuery();

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const response = await fetch(`${endpoint}?data=${encodeURIComponent(query)}`, {
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "User-Agent": OVERPASS_USER_AGENT,
        },
        signal: AbortSignal.timeout(12000),
      });

      if (!response.ok) continue;
      const data = (await response.json()) as OverpassResponse;
      const places = dedupeOverpassPlaces(
        (data.elements ?? []).map(overpassElementToTourismPlace).filter((place): place is TourismPlace => Boolean(place)),
      ).slice(0, 18);

      if (places.length > 0) return places;
    } catch {
      continue;
    }
  }

  return [];
}

function buildOverpassPlacesQuery() {
  const bbox = `${ALICANTE_PLACES_BBOX.south},${ALICANTE_PLACES_BBOX.west},${ALICANTE_PLACES_BBOX.north},${ALICANTE_PLACES_BBOX.east}`;

  return `
    [out:json][timeout:12];
    (
      node(${bbox})["tourism"~"attraction|museum|viewpoint|gallery|artwork"]["name"];
      way(${bbox})["tourism"~"attraction|museum|viewpoint|gallery|artwork"]["name"];
      relation(${bbox})["tourism"~"attraction|museum|viewpoint|gallery|artwork"]["name"];
      node(${bbox})["historic"~"castle|monument|memorial|archaeological_site"]["name"];
      way(${bbox})["historic"~"castle|monument|memorial|archaeological_site"]["name"];
      relation(${bbox})["historic"~"castle|monument|memorial|archaeological_site"]["name"];
      node(${bbox})["leisure"~"park|garden|nature_reserve"]["name"];
      way(${bbox})["leisure"~"park|garden|nature_reserve"]["name"];
      relation(${bbox})["leisure"~"park|garden|nature_reserve"]["name"];
      node(${bbox})["natural"="beach"]["name"];
      way(${bbox})["natural"="beach"]["name"];
      relation(${bbox})["natural"="beach"]["name"];
      node(${bbox})["amenity"~"theatre|arts_centre"]["name"];
      way(${bbox})["amenity"~"theatre|arts_centre"]["name"];
      relation(${bbox})["amenity"~"theatre|arts_centre"]["name"];
    );
    out center tags 80;
  `;
}

function overpassElementToTourismPlace(element: OverpassElement): TourismPlace | undefined {
  const tags = element.tags ?? {};
  const title = tags["name:es"] ?? tags.name;
  if (!title) return undefined;

  const latitude = element.lat ?? element.center?.lat;
  const longitude = element.lon ?? element.center?.lon;
  const category = overpassCategory(tags);
  const indoorLikely = overpassIndoorLikely(tags, title);
  const osmPath = element.type === "node" ? "node" : element.type;

  return {
    id: `osm-${element.type}-${element.id}`,
    title,
    source: "OpenStreetMap / Overpass API",
    sourceUrl: "https://www.openstreetmap.org/",
    link: `https://www.openstreetmap.org/${osmPath}/${element.id}`,
    category,
    summary: overpassSummary(tags, category),
    image: overpassImage(tags, category),
    indoorLikely,
    recommendationReason: indoorLikely
      ? "Buena opción interior o cultural para horas de calor."
      : "Revisar franja horaria y priorizar primeras o últimas horas del día.",
    address: [tags["addr:street"], tags["addr:housenumber"], tags["addr:city"]].filter(Boolean).join(", ") || undefined,
    latitude,
    longitude,
  };
}

function overpassCategory(tags: Record<string, string>) {
  const text = `${tags.tourism ?? ""} ${tags.historic ?? ""} ${tags.leisure ?? ""} ${tags.natural ?? ""} ${tags.amenity ?? ""}`.toLowerCase();
  if (/museum|gallery|artwork|arts_centre|theatre|castle|monument|memorial|archaeological/.test(text)) return "Cultura";
  if (/beach|viewpoint|park|garden|nature_reserve/.test(text)) return "Exterior";
  return "Ocio";
}

function overpassIndoorLikely(tags: Record<string, string>, title: string) {
  const text = `${title} ${tags.tourism ?? ""} ${tags.amenity ?? ""}`.toLowerCase();
  return /museum|gallery|theatre|arts_centre|maca|marq|mubag|museo/.test(text);
}

function overpassSummary(tags: Record<string, string>, category: string) {
  if (tags.description) return tags.description;
  if (tags.wikipedia) return `Punto de interés con referencia en Wikipedia: ${tags.wikipedia}.`;
  if (tags.wikidata) return `Punto de interés enlazado a Wikidata (${tags.wikidata}).`;
  return category === "Exterior"
    ? "Espacio exterior de interés turístico o paisajístico registrado en OpenStreetMap."
    : "Punto cultural o patrimonial registrado en OpenStreetMap.";
}

function overpassImage(tags: Record<string, string>, category: string) {
  if (tags.image?.startsWith("http")) return tags.image;
  if (category === "Exterior") return "https://upload.wikimedia.org/wikipedia/commons/8/87/Explanada_de_Espa%C3%B1a%2C_Alicante.jpg";
  return "https://upload.wikimedia.org/wikipedia/commons/6/69/Castillo_de_Santa_B%C3%A1rbara%2C_Alicante%2C_Espa%C3%B1a%2C_2014-07-04%2C_DD_47.JPG";
}

function dedupeOverpassPlaces(places: TourismPlace[]) {
  const seen = new Set<string>();
  return places.filter((place) => {
    const key = normalizeDedupeKey(place.title);
    if (!place.latitude || !place.longitude || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function normalizeDedupeKey(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
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
    const response = await fetch("https://alicanteturismo.com/wp-json/wp/v2/mec-events?per_page=30&orderby=modified&order=desc", {
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Alicante Turismo ${response.status}`);
    const items = (await response.json()) as WordpressEvent[];

    return items.map((item) => wordpressToEvent(item, "Alicante City & Beach", "https://alicanteturismo.com/agenda/"));
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



function isUpcomingDateLabel(label: string) {
  const eventEndDate = parseEventEndDate(label);
  if (!eventEndDate) return true;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventEndDate >= today;
}

function parseEventEndDate(label: string) {
  const normalized = label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/,/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const rangeMatch = normalized.match(/(?:del\s+)?\d{1,2}\s+al\s+(\d{1,2})\s+de\s+([a-z.]+)\s+de\s+(\d{4})/i);
  if (rangeMatch) return buildDate(rangeMatch[3], rangeMatch[2], rangeMatch[1]);

  const pairMatch = normalized.match(/(?:\d{1,2}\s+y\s+)?(\d{1,2})\s+de\s+([a-z.]+)\s+de\s+(\d{4})/i);
  if (pairMatch) return buildDate(pairMatch[3], pairMatch[2], pairMatch[1]);

  const shortMatch = normalized.match(/(\d{1,2})\s+([a-z.]+)\s+(\d{4})/i);
  if (shortMatch) return buildDate(shortMatch[3], shortMatch[2], shortMatch[1]);

  return undefined;
}

function buildDate(year: string, monthLabel: string, day: string) {
  const month = monthToIndex(monthLabel);
  if (month === undefined) return undefined;
  return new Date(Number(year), month, Number(day));
}

function monthToIndex(label: string) {
  const key = label.replace(".", "");
  const months: Record<string, number> = {
    ene: 0,
    enero: 0,
    feb: 1,
    febrero: 1,
    mar: 2,
    marzo: 2,
    abr: 3,
    abril: 3,
    may: 4,
    mayo: 4,
    jun: 5,
    junio: 5,
    jul: 6,
    julio: 6,
    ago: 7,
    agosto: 7,
    sep: 8,
    sept: 8,
    septiembre: 8,
    setiembre: 8,
    oct: 9,
    octubre: 9,
    nov: 10,
    noviembre: 10,
    dic: 11,
    diciembre: 11,
  };
  return months[key];
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
