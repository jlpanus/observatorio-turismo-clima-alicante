import { reportSource } from "@/data/reportAssumptions";

export function SourceNote() {
  return (
    <aside className="premium-card p-5">
      <p className="purple-badge">Fuente base del MVP</p>
      <h2 className="mt-4 text-lg font-black text-alicante-ink">{reportSource.title}</h2>
      <p className="mt-2 text-sm leading-6 text-alicante-muted">
        {reportSource.authors}. {reportSource.date}. Los indicadores combinan datos online y una traducción operativa de sus hallazgos.
      </p>
      <a className="secondary-pill mt-4 px-4 py-2" href={reportSource.url} rel="noreferrer" target="_blank">
        Ver informe fuente
      </a>
    </aside>
  );
}
