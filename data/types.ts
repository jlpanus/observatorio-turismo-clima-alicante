export type ActivityType = "cultura" | "playa" | "paseo" | "interior" | "gastronomía";
export type RecommendationLevel = "Alta" | "Media" | "Baja";
export type ComfortTone = "green" | "amber" | "red" | "blue";

export type Recommendation = {
  id: string;
  name: string;
  type: ActivityType;
  setting: "Interior" | "Exterior";
  bestTime: string;
  level: RecommendationLevel;
  reason: string;
  featured?: boolean;
  bestNow?: boolean;
};

export type Alert = {
  id: string;
  title: string;
  severity: "Informativa" | "Precaución" | "Alta";
  message: string;
  prevention: string;
  alternative: string;
};

export type Zone = {
  id: string;
  name: string;
  category: "cultura" | "interior" | "exterior" | "playa";
  comfort: number;
  crowding: "Baja" | "Media" | "Alta";
  recommendation: string;
  avoidHeat: boolean;
};

export type DashboardMetric = {
  id: string;
  label: string;
  value: string;
  trend: string;
  tone: ComfortTone;
};
