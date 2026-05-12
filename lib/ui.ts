import type { ComfortTone } from "@/data/types";

export function scoreTone(score: number): ComfortTone {
  if (score >= 78) return "green";
  if (score >= 60) return "amber";
  return "red";
}

export function toneClasses(tone: ComfortTone) {
  const tones: Record<ComfortTone, string> = {
    blue: "border-alicante-blue/20 bg-alicante-sky text-alicante-deep",
    green: "border-emerald-200 bg-emerald-50 text-emerald-800",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    red: "border-red-200 bg-red-50 text-red-800",
  };

  return tones[tone];
}

export function levelTone(level: string): ComfortTone {
  if (level.includes("Óptimo") || level === "Alta") return "green";
  if (level.includes("Evitar") || level === "Baja" || level === "Alta severidad") return "red";
  return "amber";
}
