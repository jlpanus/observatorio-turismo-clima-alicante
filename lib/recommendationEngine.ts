import type { LiveWeather } from "@/lib/liveData";
import type { Recommendation, Zone } from "@/data/types";

export type TravelerProfile = {
  tripType?: "pareja" | "familia" | "senior" | "crucerista" | "solo" | "grupo";
  interests: string[];
  avoidHeat: boolean;
  lowBudget: boolean;
  calmPace: boolean;
  shortTime: boolean;
  reducedMobility: boolean;
  duration?: string;
};

export type ChatActivity = {
  id: string;
  name: string;
  category: string;
  zone: string;
  duration: string;
  effort: "bajo" | "medio" | "alto";
  accessibility: "alta" | "media" | "baja";
  recommendedFor: string[];
  avoidIf: string[];
  bestTime: string;
  comfort: number;
  price: "gratis" | "bajo" | "medio";
  tags: string[];
  reason: string;
};

export type LocalRecommendationResult = {
  profile: TravelerProfile;
  reply: string;
  recommendations: ChatActivity[];
  itinerary: { time: string; title: string; detail: string }[];
  weatherSummary: string;
};

const keywordMap = {
  pareja: ["pareja", "romantico", "romantica", "aniversario"],
  kids: ["ninos", "niños", "familia", "peques", "hijos", "infantil"],
  senior: ["senior", "sénior", "mayor", "jubilado", "tercera edad"],
  culture: ["cultura", "cultural", "museo", "patrimonio", "historia", "castillo", "arte"],
  food: ["gastronomia", "gastronómico", "gastronomico", "tapas", "comer", "restaurante", "mercado"],
  beach: ["playa", "mar", "bano", "baño", "postiguet", "san juan"],
  cruise: ["crucero", "crucerista", "puerto"],
  short: ["1 dia", "un dia", "mañana", "manana", "poco tiempo", "solo tengo", "unas horas"],
  heat: ["calor", "menos calor", "evitar calor", "sombra", "fresco", "uv"],
  mobility: ["movilidad reducida", "accesible", "silla", "andar poco", "sin cuestas"],
  budget: ["barato", "gratis", "presupuesto bajo", "economico", "económico"],
  calm: ["tranquilo", "tranquila", "relajado", "sin prisas", "baja intensidad"],
};

export function detectTravelerProfile(text: string, base: TravelerProfile = emptyProfile()): TravelerProfile {
  const normalized = normalize(text);
  const profile: TravelerProfile = {
    ...base,
    interests: [...new Set(base.interests)],
  };

  if (hasAny(normalized, keywordMap.pareja)) profile.tripType = "pareja";
  if (hasAny(normalized, keywordMap.kids)) profile.tripType = "familia";
  if (hasAny(normalized, keywordMap.senior)) profile.tripType = "senior";
  if (hasAny(normalized, keywordMap.cruise)) profile.tripType = "crucerista";

  addInterest(profile, normalized, keywordMap.culture, "cultura");
  addInterest(profile, normalized, keywordMap.food, "gastronomia");
  addInterest(profile, normalized, keywordMap.beach, "playa");

  profile.avoidHeat = profile.avoidHeat || hasAny(normalized, keywordMap.heat);
  profile.lowBudget = profile.lowBudget || hasAny(normalized, keywordMap.budget);
  profile.calmPace = profile.calmPace || hasAny(normalized, keywordMap.calm);
  profile.shortTime = profile.shortTime || hasAny(normalized, keywordMap.short);
  profile.reducedMobility = profile.reducedMobility || hasAny(normalized, keywordMap.mobility);

  if (normalized.includes("una manana") || normalized.includes("solo tengo una manana")) profile.duration = "media jornada";
  if (normalized.includes("1 dia") || normalized.includes("un dia")) profile.duration = "1 dia";

  return profile;
}

export function buildChatActivities(recommendations: Recommendation[], zones: Zone[]): ChatActivity[] {
  const zoneByName = new Map(zones.map((zone) => [normalize(zone.name), zone]));

  const baseActivities = recommendations.map((item) => {
    const zone = zoneByName.get(normalize(item.name)) ?? inferZone(item.name, zones);
    const indoor = item.setting === "Interior";

    return {
      id: item.id,
      name: item.name,
      category: item.type,
      zone: zone?.name ?? inferZoneName(item.name),
      duration: inferDuration(item.type),
      effort: inferEffort(item.name, item.setting),
      accessibility: indoor ? "alta" : "media",
      recommendedFor: inferRecommendedFor(item.type, indoor),
      avoidIf: indoor ? [] : ["calor fuerte", "UV alto", "horas centrales"],
      bestTime: item.bestTime,
      comfort: zone?.comfort ?? (indoor ? 88 : 70),
      price: item.type === "playa" || item.type === "paseo" ? "gratis" : "bajo",
      tags: [item.type, item.setting.toLowerCase(), item.bestNow ? "mejor ahora" : "", item.level.toLowerCase()].filter(Boolean),
      reason: item.reason,
    } satisfies ChatActivity;
  });

  const extraActivities: ChatActivity[] = [
    {
      id: "mercado-central",
      name: "Mercado Central y tapas cercanas",
      category: "gastronomia",
      zone: "Centro",
      duration: "60-90 min",
      effort: "bajo",
      accessibility: "alta",
      recommendedFor: ["pareja", "familia", "crucerista", "senior"],
      avoidIf: ["saturacion alta en hora punta"],
      bestTime: "13:30-15:30 o 20:00-22:00",
      comfort: 86,
      price: "medio",
      tags: ["gastronomia", "interior", "bajo esfuerzo"],
      reason: "Permite comer bajo cubierta y ajustar el plan si sube el calor.",
    },
    {
      id: "casco-patrimonial",
      name: "Casco Antiguo patrimonial",
      category: "cultura",
      zone: "Casco Antiguo",
      duration: "90-120 min",
      effort: "medio",
      accessibility: "media",
      recommendedFor: ["pareja", "cultural", "crucerista"],
      avoidIf: ["calor fuerte", "movilidad reducida"],
      bestTime: "09:00-11:30 o 18:30-20:30",
      comfort: 68,
      price: "gratis",
      tags: ["cultura", "exterior", "patrimonio"],
      reason: "Funciona bien con paradas cortas y sombra si se evita el mediodia.",
    },
  ];

  return [...baseActivities, ...extraActivities];
}

export function generateLocalRecommendation(input: {
  message: string;
  profile?: TravelerProfile;
  weather: LiveWeather;
  activities: ChatActivity[];
  zones: Zone[];
}): LocalRecommendationResult {
  const profile = detectTravelerProfile(input.message, input.profile ?? emptyProfile());
  const now = new Date();
  const hotWindow = now.getHours() >= 13 && now.getHours() < 17;
  const heatRisk = profile.avoidHeat || hotWindow || input.weather.today.uvMax >= 7 || input.weather.apparentTemperature >= 28;
  const scored = input.activities
    .map((activity) => ({ activity, score: scoreActivity(activity, profile, input.weather, heatRisk) }))
    .sort((a, b) => b.score - a.score)
    .map((item) => item.activity);

  const recommendations = scored.slice(0, 3);
  const primary = recommendations[0] ?? input.activities[0];
  const alternative = recommendations[1] ?? primary;
  const weatherSummary = `${input.weather.status}: sensacion ${input.weather.apparentTemperature.toFixed(1)} ºC, UV max. ${input.weather.today.uvMax.toFixed(1)} y lluvia ${input.weather.today.precipitationProbability}%.`;
  const itinerary = buildItinerary(recommendations, heatRisk, profile);

  return {
    profile,
    recommendations,
    itinerary,
    weatherSummary,
    reply: buildReply(primary, alternative, profile, weatherSummary, heatRisk),
  };
}

export function emptyProfile(): TravelerProfile {
  return {
    interests: [],
    avoidHeat: false,
    lowBudget: false,
    calmPace: false,
    shortTime: false,
    reducedMobility: false,
  };
}

function scoreActivity(activity: ChatActivity, profile: TravelerProfile, weather: LiveWeather, heatRisk: boolean) {
  let score = activity.comfort;
  const tags = activity.tags.join(" ");
  const text = normalize(`${activity.name} ${activity.category} ${tags}`);

  if (heatRisk && activity.avoidIf.some((item) => item.includes("calor"))) score -= 24;
  if (heatRisk && tags.includes("interior")) score += 18;
  if (profile.tripType && activity.recommendedFor.includes(profile.tripType)) score += 12;
  if (profile.tripType === "familia" && activity.effort === "bajo") score += 8;
  if (profile.tripType === "senior" && activity.accessibility === "alta") score += 12;
  if (profile.reducedMobility && activity.accessibility !== "alta") score -= 18;
  if (profile.calmPace && activity.effort === "bajo") score += 8;
  if (profile.lowBudget && activity.price === "gratis") score += 8;
  if (profile.shortTime && activity.duration.includes("60")) score += 8;
  if (weather.today.precipitationProbability > 45 && !tags.includes("interior")) score -= 18;
  for (const interest of profile.interests) {
    if (text.includes(normalize(interest))) score += 14;
  }
  if (profile.tripType === "pareja" && /paseo|gastronomia|castillo|casco/.test(text)) score += 10;
  if (profile.tripType === "crucerista" && /centro|casco|explanada|mercado|museo/.test(text)) score += 10;

  return score;
}

function buildReply(primary: ChatActivity, alternative: ChatActivity, profile: TravelerProfile, weatherSummary: string, heatRisk: boolean) {
  const audience = profile.tripType ? ` para un viaje en ${profile.tripType}` : "";
  const heatNote = heatRisk
    ? "Como hay riesgo de calor o UV alto, conviene evitar exterior entre las 13:00 y las 17:00."
    : "El confort permite combinar exterior suave con cultura.";

  return [
    `Recomendacion principal${audience}: ${primary.name}.`,
    `Motivo: ${primary.reason} Contexto climatico: ${weatherSummary}`,
    `Mejor horario: ${primary.bestTime}. ${heatNote}`,
    `Alternativa: ${alternative.name}, especialmente si quieres ajustar ritmo, presupuesto o exposicion al calor.`,
    "Consejo practico: lleva agua, revisa horarios oficiales y deja margen para pausas si vas con ninos, personas senior o movilidad reducida.",
  ].join("\n\n");
}

function buildItinerary(activities: ChatActivity[], heatRisk: boolean, profile: TravelerProfile) {
  const [first, second, third] = activities;
  const compact = profile.shortTime || profile.duration === "media jornada";

  if (compact) {
    return [
      { time: "09:30", title: first?.name ?? "Inicio cultural", detail: "Empieza por la opcion mas eficiente y confortable." },
      { time: "11:30", title: second?.name ?? "Pausa cercana", detail: "Mantiene desplazamientos cortos y evita cambios de zona innecesarios." },
      { time: "13:00", title: "Comida o pausa interior", detail: "Cierra la manana bajo cubierta antes del tramo de mas calor." },
    ];
  }

  return [
    { time: "09:00", title: first?.name ?? "Plan principal", detail: "Aprovecha el tramo mas suave del dia." },
    {
      time: heatRisk ? "13:00" : "12:30",
      title: heatRisk ? "Pausa interior / gastronomia" : second?.name ?? "Segunda parada",
      detail: heatRisk ? "Evita exposicion exterior en horas centrales." : "Buen momento para una visita corta o comida.",
    },
    { time: "18:30", title: third?.name ?? second?.name ?? "Paseo final", detail: "Retoma exterior cuando baja la radiacion." },
  ];
}

function addInterest(profile: TravelerProfile, normalized: string, keywords: string[], interest: string) {
  if (hasAny(normalized, keywords) && !profile.interests.includes(interest)) {
    profile.interests.push(interest);
  }
}

function hasAny(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(normalize(keyword)));
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function inferZone(name: string, zones: Zone[]) {
  const normalized = normalize(name);
  return zones.find((zone) => normalized.includes(normalize(zone.name)) || normalize(zone.name).includes(normalized));
}

function inferZoneName(name: string) {
  const normalized = normalize(name);
  if (normalized.includes("postiguet")) return "Postiguet";
  if (normalized.includes("san juan")) return "Playa de San Juan";
  if (normalized.includes("castillo")) return "Monte Benacantil";
  if (normalized.includes("marq")) return "MARQ";
  if (normalized.includes("agua") || normalized.includes("garrigos")) return "Casco Antiguo";
  return "Centro";
}

function inferDuration(type: string) {
  if (type === "playa") return "90-150 min";
  if (type === "gastronomia") return "60-90 min";
  return "75-120 min";
}

function inferEffort(name: string, setting: string): ChatActivity["effort"] {
  const normalized = normalize(name);
  if (normalized.includes("castillo") || normalized.includes("casco")) return "medio";
  if (setting === "Interior") return "bajo";
  return "medio";
}

function inferRecommendedFor(type: string, indoor: boolean) {
  const base = indoor ? ["familia", "senior", "crucerista"] : ["pareja", "crucerista"];
  if (type === "gastronomia") return [...base, "pareja"];
  if (type === "playa") return ["familia", "pareja"];
  return base;
}
