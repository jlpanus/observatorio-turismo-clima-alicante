type FilterPillsProps = {
  filters: string[];
};

export function FilterPills({ filters }: FilterPillsProps) {
  return (
    <div className="flex flex-wrap gap-2" aria-label="Filtros simulados">
      {filters.map((filter, index) => (
        <button
          className={`focus-ring rounded-full border px-4 py-2 text-sm font-semibold transition ${
            index === 0
              ? "border-alicante-blue bg-alicante-blue text-white"
              : "border-slate-300 bg-white text-slate-700 hover:border-alicante-blue hover:text-alicante-blue"
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
