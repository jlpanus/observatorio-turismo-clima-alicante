import { reportSource } from "@/data/reportAssumptions";

export function SourceNote() {
  return (
    <aside className="rounded-lg border border-alicante-blue/20 bg-white p-5 shadow-soft">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-alicante-blue">Fuente base del MVP</p>
      <h2 className="mt-2 text-lg font-bold text-slate-950">{reportSource.title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-700">
        {reportSource.authors}. {reportSource.date}. Los indicadores de esta web son una traducción operativa de sus hallazgos, no datos en tiempo real.
      </p>
      <a
        className="focus-ring mt-4 inline-flex rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-alicante-deep transition hover:border-alicante-blue hover:bg-alicante-sky"
        href={reportSource.url}
        rel="noreferrer"
        target="_blank"
      >
        Ver informe fuente
      </a>
    </aside>
  );
}
