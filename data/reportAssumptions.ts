export const reportSource = {
  title: "Impacto del cambio climático en el turismo de Alicante",
  authors:
    "Cátedra Aguas de Alicante de Cambio Climático y Cátedra Turismo Ciudad de Alicante, Universidad de Alicante",
  date: "Octubre 2025",
  url: "https://catedracambioclimaticoaguasalicante.ua.es/uploads/site/files/Informe_Impacto_cambio_climatico_en_el_turismo_de_Alicante.pdf",
};

export const reportAssumptions = {
  tourismPibShare: 15.47,
  tourismEmploymentShare: 13.47,
  foreignTourismGrowth2024: 25.8,
  summerForeignTourismGrowth2024: 18.2,
  baseTropicalNights: 67,
  tropicalNights2031_2050: 89,
  mediumScenarioTourismPibRisk2050: 12,
  mediumScenarioRevenueLossMEur: 152.29,
  mediumScenarioFiscalLossMEur: 22.84,
  mediumScenarioJobsAtRisk: 1523,
};

export const calculatedSignals = {
  summerGrowthGap:
    reportAssumptions.foreignTourismGrowth2024 -
    reportAssumptions.summerForeignTourismGrowth2024,
  tropicalNightsIncrease:
    reportAssumptions.tropicalNights2031_2050 -
    reportAssumptions.baseTropicalNights,
  tropicalNightsIncreaseRate: Math.round(
    ((reportAssumptions.tropicalNights2031_2050 -
      reportAssumptions.baseTropicalNights) /
      reportAssumptions.baseTropicalNights) *
      100,
  ),
};

export const evidenceNotes = [
  "El informe identifica pérdida de confort climático en verano por aumento de temperaturas, olas de calor y noches tropicales.",
  "La demanda turística muestra mayor dinamismo en primavera y otoño, reforzando la desestacionalización.",
  "La adaptación recomendada prioriza refugios climáticos, sombreado, monitorización del confort y diversificación cultural, gastronómica, MICE y bienestar.",
];
