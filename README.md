# Observatorio Digital de Turismo y Clima de Alicante

MVP publico construido con Next.js, React, TypeScript y Tailwind CSS para ayudar a turistas, empresas y entidades publicas de Alicante a tomar decisiones basadas en clima, confort, agenda cultural y datos turisticos.

## Como instalar

```bash
npm install
```

## Como ejecutar

```bash
npm run dev
```

La web estara disponible normalmente en `http://localhost:3000`.

## Comandos de calidad

```bash
npm run lint
npm run build
```

## Chatbot Bárbara

La ruta `/chat` incorpora a Bárbara, una guia conversacional para visitantes de Alicante.

Funciones principales:

- Detecta perfil por palabras clave: pareja, ninos, senior, cultural, gastronomia, playa, crucerista, poco tiempo, evitar calor, movilidad reducida, presupuesto bajo y plan tranquilo.
- Combina perfil viajero, clima actual, confort, zonas, saturacion estimada, duracion y actividades disponibles.
- Muestra resumen de perfil, contexto climatico, recomendaciones e itinerario por franjas.
- Usa `OPENAI_API_KEY` si existe en el entorno del servidor.
- Si no hay `OPENAI_API_KEY`, responde con fallback local desde `lib/recommendationEngine.ts`.

Variables opcionales:

```bash
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-4o-mini
```

Archivos principales:

- `app/chat/page.tsx`: pantalla del chatbot.
- `app/api/chat/route.ts`: API server-side, sin exponer la clave al cliente.
- `components/chat/`: componentes conversacionales reutilizables.
- `lib/recommendationEngine.ts`: motor local de perfilado y recomendacion.
- `lib/systemPrompt.ts`: prompt base de Bárbara.

Proximos pasos del chatbot:

- Multidioma.
- WhatsApp o canal hotelero.
- Geolocalizacion voluntaria.
- Analitica de preguntas frecuentes.
- Mejor memoria de sesion.
- Integracion con modelos y datos de demanda mas finos.

## Integracion con GitHub

El proyecto incluye un workflow de GitHub Actions en `.github/workflows/ci.yml` que ejecuta lint y build en cada push o pull request contra `main`.

Flujo recomendado:

```text
GitHub main -> GitHub Actions -> Vercel deploy automatico
```

Cuando el repositorio este conectado a Vercel, cada cambio aprobado en `main` publicara una nueva version.

## Estructura del proyecto

- `app/`: rutas con App Router.
- `components/`: componentes reutilizables de UI y visualizacion.
- `components/chat/`: interfaz del chatbot Bárbara.
- `data/`: datos tipados para clima, recomendaciones, alertas, zonas y dashboard.
- `lib/`: integraciones online, motor de recomendaciones y helpers compartidos.
- `sources/`: documentacion fuente usada como respaldo metodologico.

## Fuentes online dinamicas

- Clima actual y prevision: Open-Meteo Forecast API para coordenadas de Alicante ciudad.
- Agenda cultural y turistica: WordPress REST API de Alicante City & Beach.
- Sitios que visitar y mapa: OpenStreetMap via Overpass API.
- Indicadores turisticos: Alicante en Cifras / Turisme Comunitat Valenciana cuando la fuente responde.

Las rutas principales se renderizan dinamicamente para actualizar clima, confort, oferta cultural y sitios de interes sin base de datos.

## Fuente metodologica

El MVP utiliza como base documental el informe `Impacto del cambio climatico en el turismo de Alicante`, elaborado por la Catedra Aguas de Alicante de Cambio Climatico y la Catedra Turismo Ciudad de Alicante, Universidad de Alicante, octubre de 2025.

Los supuestos de lectura se inspiran en ese informe: perdida de confort en verano, aumento de noches tropicales, desestacionalizacion hacia primavera/otono, refugios climaticos y diversificacion hacia turismo cultural, gastronomico, MICE y bienestar.
