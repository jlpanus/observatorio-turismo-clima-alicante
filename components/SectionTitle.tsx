type SectionTitleProps = {
  kicker?: string;
  title: string;
  description?: string;
};

export function SectionTitle({ kicker, title, description }: SectionTitleProps) {
  return (
    <div className="max-w-3xl">
      {kicker ? <p className="purple-badge">{kicker}</p> : null}
      <h2 className="mt-4 text-3xl font-black tracking-tight text-alicante-ink sm:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-base leading-7 text-alicante-muted sm:text-lg">{description}</p> : null}
    </div>
  );
}
