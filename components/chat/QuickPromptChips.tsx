"use client";

const prompts = [
  "Vengo en pareja",
  "Viajo con niños",
  "Quiero evitar calor",
  "Tengo solo 1 día",
  "Quiero planes culturales",
  "Busco gastronomía",
  "Soy crucerista",
  "Prefiero planes tranquilos",
];

type QuickPromptChipsProps = {
  disabled?: boolean;
  onSelect: (prompt: string) => void;
};

export function QuickPromptChips({ disabled, onSelect }: QuickPromptChipsProps) {
  return (
    <div className="flex flex-wrap gap-2" aria-label="Sugerencias rápidas para Bárbara">
      {prompts.map((prompt) => (
        <button
          className="focus-ring rounded-full border border-alicante-border bg-white px-3 py-2 text-xs font-bold text-alicante-muted shadow-soft transition hover:border-alicante-violet/40 hover:text-alicante-violet disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled}
          key={prompt}
          onClick={() => onSelect(prompt)}
          type="button"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
