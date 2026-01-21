import type { DailySpending } from '@/app/types/transaction';

interface SpendingChartProps {
  data: DailySpending[];
  monthlyTotal: number;
}

export function SpendingChart({ data, monthlyTotal }: SpendingChartProps) {
  const maxAmount = Math.max(...data.map((d) => d.amount), 1);
  const width = 920;
  const height = 280;
  const padding = { top: 20, right: 20, bottom: 40, left: 20 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * chartWidth + padding.left;
    const y = chartHeight - (d.amount / maxAmount) * chartHeight + padding.top;
    return { x, y, date: d.date, amount: d.amount };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');

  const areaD = `${pathD} L ${points[points.length - 1].x},${height - padding.bottom} L ${padding.left},${height - padding.bottom} Z`;

  const xAxisLabels = [1, 7, 14, 21, 28, 31]
    .filter((day) => day <= data.length)
    .map((day) => {
      const index = day - 1;
      const x = (index / (data.length - 1)) * chartWidth + padding.left;
      return { x, label: `Oct ${day}` };
    });

  return (
    <div className="relative">
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        <path d={areaD} fill="url(#chartGradient)" />

        <path
          d={pathD}
          fill="none"
          stroke="rgb(34, 197, 94)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r="4"
              fill="rgb(34, 197, 94)"
              className="opacity-0 hover:opacity-100 transition-opacity"
            />
          </g>
        ))}

        <line
          x1={padding.left}
          y1={height - padding.bottom}
          x2={width - padding.right}
          y2={height - padding.bottom}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />

        {xAxisLabels.map((label, i) => (
          <text
            key={i}
            x={label.x}
            y={height - padding.bottom + 20}
            textAnchor="middle"
            fontSize="12"
            fill="rgba(255,255,255,0.5)"
          >
            {label.label}
          </text>
        ))}
      </svg>

      <div className="absolute top-4 right-4 text-right">
        <div className="text-3xl font-bold text-white">¥{monthlyTotal.toLocaleString()}</div>
        <div className="text-sm text-green-400">月次合計</div>
      </div>
    </div>
  );
}
