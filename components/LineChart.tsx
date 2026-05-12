type LinePoint = {
  label: string;
  value: number;
};

type LineChartProps = {
  data: LinePoint[];
  unit: string;
  color?: string;
};

export function LineChart({ data, unit, color = "#0B5CAD" }: LineChartProps) {
  const width = 720;
  const height = 260;
  const padding = 34;
  const values = data.map((point) => point.value);
  const min = Math.min(...values) * 0.92;
  const max = Math.max(...values) * 1.08;
  const span = max - min || 1;
  const points = data.map((point, index) => {
    const x = padding + (index * (width - padding * 2)) / Math.max(data.length - 1, 1);
    const y = height - padding - ((point.value - min) / span) * (height - padding * 2);
    return { ...point, x, y };
  });
  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-4">
      <svg aria-label="Gráfico de líneas" className="min-w-[620px]" role="img" viewBox={`0 0 ${width} ${height}`}>
        <line stroke="#CBD5E1" strokeWidth="1" x1={padding} x2={width - padding} y1={height - padding} y2={height - padding} />
        <line stroke="#CBD5E1" strokeWidth="1" x1={padding} x2={padding} y1={padding} y2={height - padding} />
        <path d={path} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
        {points.map((point) => (
          <g key={point.label}>
            <circle cx={point.x} cy={point.y} fill="white" r="5" stroke={color} strokeWidth="3" />
            <text fill="#475569" fontSize="12" textAnchor="middle" x={point.x} y={height - 10}>
              {point.label}
            </text>
            <text fill="#0F172A" fontSize="12" fontWeight="700" textAnchor="middle" x={point.x} y={point.y - 12}>
              {Math.round(point.value).toLocaleString("es-ES")}
              {unit}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
