import Link from "next/link";

export function FloatingChatButton() {
  return (
    <Link
      aria-label="Habla con Bárbara"
      className="focus-ring fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/95 px-4 py-3 text-sm font-black text-alicante-ink shadow-glow backdrop-blur transition hover:-translate-y-0.5 hover:border-alicante-violet/40"
      href="/chat"
    >
      <span className="grid h-8 w-8 place-items-center rounded-full bg-alicante-violet text-white">B</span>
      <span className="hidden sm:inline">Habla con Bárbara</span>
    </Link>
  );
}
