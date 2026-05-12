import type { Alert } from "./types";

export const alerts: Alert[] = [
  {
    id: "heat-midday",
    title: "Precaución por calor en horas centrales",
    severity: "Precaución",
    message: "Evita actividades al aire libre entre las 13:00 y las 17:00.",
    prevention: "Hidratación frecuente, sombra y pausas en espacios climatizados.",
    alternative: "MARQ, Museo de Aguas, comercio local y gastronomía interior.",
  },
  {
    id: "beach-pressure",
    title: "Saturación estimada media-alta en playas urbanas",
    severity: "Informativa",
    message: "Postiguet puede concentrar mayor afluencia durante la mañana tardía.",
    prevention: "Planifica llegada temprana o desplaza la visita a última hora.",
    alternative: "Playa de San Juan al final de la tarde o paseo urbano sombreado.",
  },
  {
    id: "spring-autumn",
    title: "Ventana óptima para turismo cultural fuera de verano",
    severity: "Informativa",
    message: "El informe apunta a mayor dinamismo de la demanda en primavera y otoño como oportunidad de desestacionalización.",
    prevention: "Promocionar agenda cultural con antelación en semanas templadas.",
    alternative: "Paquetes de escapada urbana y patrimonio para fines de semana.",
  },
];
