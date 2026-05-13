import { NextResponse } from "next/server";
import { recommendations } from "@/data/recommendations";
import { zones } from "@/data/zones";
import { getLiveWeather } from "@/lib/liveData";
import {
  buildChatActivities,
  detectTravelerProfile,
  emptyProfile,
  generateLocalRecommendation,
  type TravelerProfile,
} from "@/lib/recommendationEngine";
import { buildBarbaraSystemPrompt } from "@/lib/systemPrompt";

type IncomingMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatRequest = {
  messages?: IncomingMessage[];
  profile?: TravelerProfile;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatRequest;
    const messages = body.messages ?? [];
    const lastUserMessage = [...messages].reverse().find((message) => message.role === "user")?.content ?? "";
    const weather = await getLiveWeather();
    const activities = buildChatActivities(recommendations, zones);
    const local = generateLocalRecommendation({
      message: lastUserMessage,
      profile: detectTravelerProfile(messages.map((message) => message.content).join(" "), body.profile ?? emptyProfile()),
      weather,
      activities,
      zones,
    });

    const openAiMessage = await getOpenAiMessage({
      messages,
      localContext: local,
      weather,
      activities,
    });

    return NextResponse.json({
      message: openAiMessage ?? local.reply,
      profile: local.profile,
      recommendations: local.recommendations,
      itinerary: local.itinerary,
      weatherSummary: local.weatherSummary,
      source: openAiMessage ? "openai" : "local",
    });
  } catch {
    return NextResponse.json({ error: "No se pudo procesar la consulta de Bárbara." }, { status: 500 });
  }
}

async function getOpenAiMessage(input: {
  messages: IncomingMessage[];
  localContext: ReturnType<typeof generateLocalRecommendation>;
  weather: Awaited<ReturnType<typeof getLiveWeather>>;
  activities: ReturnType<typeof buildChatActivities>;
}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return undefined;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        temperature: 0.4,
        messages: [
          { role: "system", content: buildBarbaraSystemPrompt() },
          {
            role: "system",
            content: JSON.stringify({
              climate: {
                status: input.weather.status,
                comfortScore: input.weather.comfortScore,
                apparentTemperature: input.weather.apparentTemperature,
                uvMax: input.weather.today.uvMax,
                rainProbability: input.weather.today.precipitationProbability,
                recommendation: input.weather.recommendation,
              },
              detectedProfile: input.localContext.profile,
              recommendedActivities: input.localContext.recommendations,
              fallbackAnswer: input.localContext.reply,
              availableActivities: input.activities.slice(0, 10),
            }),
          },
          ...input.messages.slice(-8).map((message) => ({ role: message.role, content: message.content })),
        ],
      }),
    });

    if (!response.ok) return undefined;
    const data = (await response.json()) as { choices?: { message?: { content?: string } }[] };
    return data.choices?.[0]?.message?.content?.trim();
  } catch {
    return undefined;
  }
}
