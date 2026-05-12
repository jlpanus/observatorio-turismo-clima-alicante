type SectionTitleProps = {
  kicker?: string;
  title: string;
  description?: string;
};

export function SectionTitle({ kicker, title, description }: SectionTitleProps) {
  return (
    <div className="max-w-3xl">
      {kicker ? (
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-alicante-blue">{kicker}</p>
      ) : null}
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{title}</h2>
      {description ? <p className="mt-3 text-base leading-7 text-slate-700">{description}</p> : null}
    </div>
  );
}
