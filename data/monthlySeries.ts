export type MonthlyPoint = {
  month: string;
  comfort: number;
  visitors: number;
};

export const monthlyComfortReference = [
  { month: "Ene", comfort: 78 },
  { month: "Feb", comfort: 82 },
  { month: "Mar", comfort: 86 },
  { month: "Abr", comfort: 90 },
  { month: "May", comfort: 84 },
  { month: "Jun", comfort: 73 },
  { month: "Jul", comfort: 55 },
  { month: "Ago", comfort: 49 },
  { month: "Sep", comfort: 68 },
  { month: "Oct", comfort: 82 },
  { month: "Nov", comfort: 85 },
  { month: "Dic", comfort: 80 },
];

export const visitorSeasonalWeights = [0.055, 0.058, 0.074, 0.082, 0.09, 0.101, 0.118, 0.122, 0.103, 0.085, 0.061, 0.051];

export const fallbackAnnualForeignVisitorsThousands = 8493.5;

export const monthlySeriesSources = {
  comfort:
    "Serie de referencia climática mensual para lectura de confort, alineada con el informe de cambio climático y umbrales de calor estival.",
  visitors:
    "Total anual 2025 de turistas extranjeros en Alicante desde Alicante en Cifras / Turisme Comunitat Valenciana, mensualizado con perfil estacional.",
  visitorsUrl: "https://www.alicanteencifras.com/m11_turismo_extranjeros.htm",
};
