type FilterPillsProps = {
  filters: string[];
};

export function FilterPills({ filters }: FilterPillsProps) {
  return (
    <div className="flex flex-wrap gap-2" aria-label="Filtros disponibles">
      {filters.map((filter, index) => (
        <button
          className={`focus-ring rounded-full border px-4 py-2 text-sm font-semibold transition ${
            index === 0
              ? "border-alicante-violet bg-alicante-violet text-white shadow-glow"
              : "border-alicante-border bg-white text-alicante-muted shadow-soft hover:border-alicante-violet/40 hover:text-alicante-violet"
          }`}
          key={filter}
          type="button"
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
