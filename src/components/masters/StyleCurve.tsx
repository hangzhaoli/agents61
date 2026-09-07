interface Props {
  points: number[];
  color: string;
  name: string;
  end: number;
  maxDrawdownPct: number;
  shapeLabel: string;
}

const Y_MIN = 50;
const Y_CEILING = 240;

function yOf(
  v: number,
  yMax: number,
  pad: { t: number; r: number; b: number; l: number },
  h: number,
) {
  const innerH = h - pad.t - pad.b;
  return pad.t + (1 - (v - Y_MIN) / Math.max(1e-6, yMax - Y_MIN)) * innerH;
}

export default function StyleCurve({
  points,
  color,
  name,
  end,
  maxDrawdownPct,
  shapeLabel,
}: Props) {
  const w = 640;
  const h = 268;
  const pad = { t: 20, r: 18, b: 34, l: 42 };
  const yMax = Math.max(Y_CEILING, Math.max(...points) * 1.08);
  const innerW = w - pad.l - pad.r;
  const coords = points.map((v, i) => ({
    x: pad.l + (i / Math.max(1, points.length - 1)) * innerW,
    y: yOf(v, yMax, pad, h),
  }));
  const line = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');
  const last = coords[coords.length - 1];
  const first = coords[0];
  const baselineY = yOf(100, yMax, pad, h);
  const area = last && first
    ? `${line} L${last.x.toFixed(1)},${baselineY.toFixed(1)} L${first.x.toFixed(1)},${baselineY.toFixed(1)} Z`
    : '';
  const yTicks = [80, 100, 140, 180, 220].filter((t) => t <= yMax);
  const xTicks = [0, 12, 24, 36, 47];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            Illustrative style path
          </h2>
          <p className="text-sm font-medium text-slate-800 mt-1">{shapeLabel}</p>
          <p className="text-xs text-slate-500 mt-0.5">48 months · shared index (100 at M0) · {name}</p>
        </div>
        <div className="flex gap-4 text-xs">
          <div>
            <div className="text-slate-400 uppercase tracking-wider">End</div>
            <div className="font-semibold text-slate-800 tabular-nums">{end.toFixed(1)}</div>
          </div>
          <div>
            <div className="text-slate-400 uppercase tracking-wider">Illustrative DD</div>
            <div className="font-semibold text-slate-800 tabular-nums">{maxDrawdownPct.toFixed(1)}%</div>
          </div>
        </div>
      </div>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full h-auto"
        role="img"
        aria-label={`${shapeLabel} for ${name}, ending at ${end.toFixed(0)}`}
      >
        <rect x="0" y="0" width={w} height={h} fill="#f8fafc" rx="12" />
        {yTicks.map((tick) => {
          const y = yOf(tick, yMax, pad, h);
          return (
            <g key={tick}>
              <line
                x1={pad.l}
                x2={w - pad.r}
                y1={y}
                y2={y}
                stroke={tick === 100 ? '#94a3b8' : '#e2e8f0'}
                strokeWidth={tick === 100 ? 1.25 : 1}
                strokeDasharray={tick === 100 ? '4 4' : undefined}
              />
              <text x={pad.l - 6} y={y + 3} fontSize="10" fill="#64748b" textAnchor="end">
                {tick}
              </text>
            </g>
          );
        })}
        <path d={area} fill={color} opacity="0.12" />
        <path d={line} fill="none" stroke={color} strokeWidth="2.25" strokeLinejoin="round" strokeLinecap="round" />
        {first && <circle cx={first.x} cy={first.y} r="3.5" fill={color} />}
        {last && <circle cx={last.x} cy={last.y} r="3.5" fill={color} />}
        {xTicks.map((i) => {
          const c = coords[i];
          if (!c) return null;
          return (
            <text key={i} x={c.x} y={h - 10} fontSize="10" fill="#94a3b8" textAnchor="middle">
              {i === 0 ? 'M0' : `M${i}`}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
