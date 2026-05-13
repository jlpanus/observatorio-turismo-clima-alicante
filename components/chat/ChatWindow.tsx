"use client";

import { useState } from "react";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessage, type UiChatMessage } from "@/components/chat/ChatMessage";
import { ChatRecommendationCard } from "@/components/chat/ChatRecommendationCard";
import { ItineraryBlock } from "@/components/chat/ItineraryBlock";
import { QuickPromptChips } from "@/components/chat/QuickPromptChips";
import { TouristProfileSummary } from "@/components/chat/TouristProfileSummary";
import { WeatherContextCard } from "@/components/chat/WeatherContextCard";
import type { LiveWeather } from "@/lib/liveData";
import type { ChatActivity, TravelerProfile } from "@/lib/recommendationEngine";

type ChatWindowProps = {
  weather: LiveWeather;
};

type ChatApiResponse = {
  message: string;
  profile: TravelerProfile;
  recommendations: ChatActivity[];
  itinerary: { time: string; title: string; detail: string }[];
  weatherSummary: string;
  source: "openai" | "local";
};

const initialMessage: UiChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hola, soy Bárbara. Te ayudo a elegir planes en Alicante según clima, tiempo disponible, acompañantes, intereses y ritmo. Cuéntame cómo viajas o pulsa una sugerencia.",
};

export function ChatWindow({ weather }: ChatWindowProps) {
  const [messages, setMessages] = useState<UiChatMessage[]>([initialMessage]);
  const [profile, setProfile] = useState<TravelerProfile>({
    interests: [],
    avoidHeat: false,
    lowBudget: false,
    calmPace: false,
    shortTime: false,
    reducedMobility: false,
  });
  const [recommendations, setRecommendations] = useState<ChatActivity[]>([]);
  const [itinerary, setItinerary] = useState<ChatApiResponse["itinerary"]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<ChatApiResponse["source"]>("local");

  async function submitMessage(content: string) {
    const userMessage: UiChatMessage = { id: crypto.randomUUID(), role: "user", content };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content: messageContent }) => ({ role, content: messageContent })),
          profile,
          weather,
        }),
      });

      if (!response.ok) throw new Error("No he podido generar la recomendacion.");
      const data = (await response.json()) as ChatApiResponse;
      const assistantMessage: UiChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.message,
      };

      setMessages((current) => [...current, assistantMessage]);
      setProfile(data.profile);
      setRecommendations(data.recommendations);
      setItinerary(data.itinerary);
      setSource(data.source);
    } catch {
      setError("Bárbara no ha podido responder ahora mismo. Prueba otra consulta o usa un chip rápido.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="premium-card overflow-hidden">
        <div className="border-b border-alicante-border bg-white/80 px-5 py-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-alicante-violet">Chat turistico</p>
          <h2 className="mt-1 text-2xl font-black text-alicante-ink">Bárbara</h2>
          <p className="mt-1 text-sm text-alicante-muted">
            Respuesta {source === "openai" ? "con IA" : "local"} basada en clima, confort y datos del observatorio.
          </p>
        </div>

        <div className="max-h-[620px] min-h-[460px] space-y-4 overflow-y-auto bg-alicante-mist/60 p-4 sm:p-6" aria-live="polite">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading ? (
            <div className="flex justify-start">
              <div className="rounded-full border border-alicante-border bg-white px-4 py-3 text-sm font-bold text-alicante-muted shadow-soft">
                Bárbara está pensando...
              </div>
            </div>
          ) : null}
          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>
          ) : null}
        </div>

        <div className="border-t border-alicante-border bg-white p-4 sm:p-5">
          <QuickPromptChips disabled={isLoading} onSelect={submitMessage} />
          <ChatInput disabled={isLoading} onSubmit={submitMessage} />
        </div>
      </section>

      <aside className="space-y-5">
        <WeatherContextCard weather={weather} />
        <TouristProfileSummary profile={profile} />
        {recommendations.length > 0 ? (
          <section className="space-y-3">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-alicante-violet">Recomendaciones</p>
            {recommendations.map((activity) => (
              <ChatRecommendationCard activity={activity} key={activity.id} />
            ))}
          </section>
        ) : null}
        <ItineraryBlock items={itinerary} />
      </aside>
    </div>
  );
}
