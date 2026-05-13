type ChartItem = {
  label: string;
  value: number;
};

type SimpleBarChartProps = {
  data: ChartItem[];
};

export function SimpleBarChart({ data }: SimpleBarChartProps) {
  return (
    <div className="flex h-56 items-end gap-3 rounded-[24px] border border-alicante-border bg-white p-5 shadow-soft">
      {data.map((item) => (
        <div className="flex flex-1 flex-col items-center gap-2" key={item.label}>
          <div className="flex h-40 w-full items-end rounded-2xl bg-alicante-mist">
            <div
              className="w-full rounded-2xl bg-alicante-violet"
              style={{ height: `${item.value}%` }}
              title={`${item.label}: ${item.value}%`}
            />
          </div>
          <span className="text-xs font-bold text-alicante-muted">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
