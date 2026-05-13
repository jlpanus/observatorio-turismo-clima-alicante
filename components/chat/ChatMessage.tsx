"use client";

export type UiChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ChatMessageProps = {
  message: UiChatMessage;
};

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <article
        className={`max-w-[88%] rounded-[24px] px-5 py-4 text-sm leading-6 shadow-soft sm:max-w-[76%] ${
          isUser
            ? "bg-alicante-violet text-white"
            : "border border-alicante-border bg-white text-alicante-ink"
        }`}
      >
        <p className={`mb-2 text-xs font-black uppercase tracking-[0.14em] ${isUser ? "text-white/70" : "text-alicante-violet"}`}>
          {isUser ? "Tú" : "Bárbara"}
        </p>
        <p className="whitespace-pre-line">{message.content}</p>
      </article>
    </div>
  );
}
