import { SectionTitle } from "@/components/SectionTitle";
import { SourceNote } from "@/components/SourceNote";

const blocks = [
  {
    title: "Qué es",
    text: "Un MVP de observatorio digital que transforma señales climáticas, turísticas y culturales en recomendaciones comprensibles para Alicante ciudad.",
  },
  {
    title: "Misión",
    text: "Ayudar a visitantes y profesionales a decidir mejor, reducir riesgos asociados al calor y aprovechar oportunidades de turismo cultural durante todo el año.",
  },
  {
    title: "Para quién sirve",
    text: "Turistas, alojamientos, guías, comercios, museos, entidades culturales y administración pública local.",
  },
  {
    title: "Metodología sencilla",
    text: "El índice combina confort térmico simulado, franja horaria, exposición exterior, saturación estimada y disponibilidad de alternativas interiores, usando como marco los riesgos y líneas de adaptación del informe fuente.",
  },
];

export default function SobreElProyectoPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SectionTitle
        kicker="Sobre el proyecto"
        title="Una herramienta pública para decidir con datos"
        description="No sustituye la experiencia turística: la hace más segura, clara y adaptable a condiciones reales."
      />

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {blocks.map((block) => (
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft" key={block.title}>
            <h2 className="text-xl font-bold text-slate-950">{block.title}</h2>
            <p className="mt-3 leading-7 text-slate-700">{block.text}</p>
          </article>
        ))}
      </div>

      <div className="mt-8 rounded-lg border border-alicante-blue/20 bg-alicante-sky p-5 text-alicante-deep">
        <p className="font-bold">Este MVP combina datos online, datos oficiales publicados y estimaciones metodológicas.</p>
        <p className="mt-2 text-sm leading-6">
          Clima y agenda cultural se consultan online. Las métricas de confort, saturación y visitantes mensualizados se calculan como indicadores de decisión y se muestran con su fuente o criterio.
        </p>
      </div>

      <div className="mt-8">
        <SourceNote />
      </div>
    </div>
  );
}
