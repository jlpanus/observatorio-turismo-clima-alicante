# Observatorio Digital de Turismo y Clima de Alicante

MVP público construido con Next.js, React, TypeScript y Tailwind CSS para ayudar a turistas, empresas y entidades públicas de Alicante a tomar decisiones basadas en datos climáticos y turísticos simulados.

## Cómo instalar

```bash
npm install
```

## Cómo ejecutar

```bash
npm run dev
```

La web estará disponible normalmente en `http://localhost:3000`.

## Comandos de calidad

```bash
npm run lint
npm run build
```

## Integración con GitHub

El proyecto incluye un workflow de GitHub Actions en `.github/workflows/ci.yml` que ejecuta lint y build en cada push o pull request contra `main`.

Flujo recomendado:

```text
GitHub main -> GitHub Actions -> Vercel deploy automático
```

Cuando el repositorio esté conectado a Vercel, cada cambio aprobado en `main` publicará una nueva versión.

## Estructura del proyecto

- `app/`: rutas con App Router.
- `components/`: componentes reutilizables de UI y visualización.
- `data/`: datos mock tipados para clima, recomendaciones, alertas, zonas y dashboard.
- `lib/`: helpers compartidos de presentación.

## Próximos pasos para conectar APIs reales

- Mantener el informe `Impacto del cambio climático en el turismo de Alicante` como fuente metodológica de supuestos.
- Sustituir `data/climateToday.ts` por una integración con AEMET u otra API meteorológica.
- Conectar agenda cultural municipal para eventos y horarios reales.
- Incorporar datos de afluencia anonimizados por zona.
- Añadir capas geográficas reales al mapa con MapLibre o similar.
- Crear un pipeline de scoring configurable para confort, saturación y recomendación.
- Añadir exportación real de informes en PDF/CSV para inteligencia turística.

## Fuente metodológica usada en el MVP

El MVP utiliza como base documental el informe `Impacto del cambio climático en el turismo de Alicante`, elaborado por la Cátedra Aguas de Alicante de Cambio Climático y la Cátedra Turismo Ciudad de Alicante, Universidad de Alicante, octubre de 2025.

Los datos actuales siguen siendo simulados, pero los supuestos de cálculo y lectura proceden de ese informe: pérdida de confort en verano, aumento de noches tropicales, desestacionalización hacia primavera/otoño, necesidad de refugios climáticos y diversificación hacia turismo cultural, gastronómico, MICE y bienestar.

## Fuentes online dinámicas

- Clima actual y previsión: Open-Meteo Forecast API para coordenadas de Alicante ciudad.
- Agenda cultural y turística: WordPress REST API de Alicante City & Beach, web oficial del Patronato Municipal de Turismo y Playas.
- Complementos de oferta: Agenda Turismo del Ayuntamiento de Alicante y Alicante Convention Bureau cuando sus páginas responden.

Las rutas `/`, `/que-hacer-hoy`, `/planifica`, `/alertas` e `/inteligencia-turistica` se renderizan dinámicamente para actualizar clima, confort y oferta cultural sin base de datos.
