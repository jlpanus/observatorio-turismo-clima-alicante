type ChartItem = {
  label: string;
  value: number;
};

type SimpleBarChartProps = {
  data: ChartItem[];
};

export function SimpleBarChart({ data }: SimpleBarChartProps) {
  return (
    <div className="flex h-56 items-end gap-3 rounded-lg border border-slate-200 bg-white p-5">
      {data.map((item) => (
        <div className="flex flex-1 flex-col items-center gap-2" key={item.label}>
          <div className="flex h-40 w-full items-end rounded-md bg-slate-100">
            <div
              className="w-full rounded-md bg-alicante-blue"
              style={{ height: `${item.value}%` }}
              title={`${item.label}: ${item.value}%`}
            />
          </div>
          <span className="text-xs font-semibold text-slate-600">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
