import { ChatWindow } from "@/components/chat/ChatWindow";
import { SectionTitle } from "@/components/SectionTitle";
import { getLiveWeather } from "@/lib/liveData";

export const dynamic = "force-dynamic";

export default async function ChatPage() {
  const weather = await getLiveWeather();

  return (
    <main className="section-shell py-10">
      <section className="rounded-[32px] bg-[linear-gradient(135deg,#EEF2FF_0%,#FFFFFF_52%,#E0F2FE_100%)] p-6 sm:p-8">
        <SectionTitle
          kicker="Bárbara"
          title="Tu guia inteligente para disfrutar Alicante"
          description="Cuéntale cómo viajas y Bárbara cruzará perfil, clima, confort, horarios y zonas para proponerte un plan útil y seguro."
        />
      </section>

      <section className="mt-8">
        <ChatWindow weather={weather} />
      </section>
    </main>
  );
}
