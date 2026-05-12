import type { DashboardMetric } from "./types";
import { calculatedSignals, reportAssumptions } from "./reportAssumptions";

export const dashboardMetrics: DashboardMetric[] = [
  {
    id: "comfort",
    label: "Noches tropicales proyectadas",
    value: `${reportAssumptions.tropicalNights2031_2050}/año`,
    trend: `+${calculatedSignals.tropicalNightsIncrease} noches frente al periodo base del informe`,
    tone: "green",
  },
  {
    id: "demand",
    label: "Brecha verano vs año",
    value: `-${calculatedSignals.summerGrowthGap.toFixed(1)} p.p.`,
    trend: "Crecimiento extranjero 2024 menor en junio-agosto que en el total anual",
    tone: "amber",
  },
  {
    id: "seasonality",
    label: "Desestacionalización",
    value: "Alta oportunidad",
    trend: "Primavera y otoño ganan peso como ventanas de confort turístico",
    tone: "blue",
  },
  {
    id: "risk",
    label: "Riesgo económico 2050",
    value: `-${reportAssumptions.mediumScenarioTourismPibRisk2050}%`,
    trend: `${reportAssumptions.mediumScenarioRevenueLossMEur} M€ de ingresos y ${reportAssumptions.mediumScenarioJobsAtRisk} empleos en escenario medio`,
    tone: "red",
  },
];

export const weeklyDemand = [
  { label: "L", value: 58 },
  { label: "M", value: 63 },
  { label: "X", value: 72 },
  { label: "J", value: 78 },
  { label: "V", value: 86 },
  { label: "S", value: 92 },
  { label: "D", value: 80 },
];

export const comfortRisk = [
  { label: "Lun", level: "Óptimo", score: 84 },
  { label: "Mar", level: "Óptimo", score: 81 },
  { label: "Mié", level: "Precaución", score: 70 },
  { label: "Jue", level: "Precaución", score: 66 },
  { label: "Vie", level: "Evitar calor extremo", score: 48 },
  { label: "Sáb", level: "Precaución", score: 62 },
  { label: "Dom", level: "Óptimo", score: 79 },
];
