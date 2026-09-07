import type { Assembly, BriefStance, MetricRow } from '@/lib/research';

const STANCE_COLOR: Record<BriefStance, string> = {
  constructive: '#059669',
  cautious: '#d97706',
  skeptical: '#dc2626',
  inconclusive: '#64748b',
};

function polar(cx: number, cy: number, r: number, a: number) {
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

export function StancePie({ counts }: { counts: Record<BriefStance, number> }) {
  const total = Math.max(1, Object.values(counts).reduce((a, b) => a + b, 0));
  const slices = (Object.keys(counts) as BriefStance[])
    .map((k) => ({ key: k, n: counts[k], frac: counts[k] / total }))
    .filter((s) => s.n > 0);
  let angle = -Math.PI / 2;
  const cx = 80;
  const cy = 80;
  const r = 68;

  return (
    <svg viewBox="0 0 160 160" className="w-40 h-40" role="img" aria-label="Stance mix">
      {slices.length === 1 ? (
        <circle cx={cx} cy={cy} r={r} fill={STANCE_COLOR[slices[0].key]} />
      ) : (
        slices.map((s) => {
          const start = angle;
          const sweep = s.frac * Math.PI * 2;
          angle += sweep;
          const p1 = polar(cx, cy, r, start);
          const p2 = polar(cx, cy, r, start + sweep);
          const large = sweep > Math.PI ? 1 : 0;
          return (
            <path
              key={s.key}
              d={`M ${cx} ${cy} L ${p1.x} ${p1.y} A ${r} ${r} 0 ${large} 1 ${p2.x} ${p2.y} Z`}
              fill={STANCE_COLOR[s.key]}
            />
          );
        })
      )}
      <circle cx={cx} cy={cy} r={34} fill="white" />
      <text x={cx} y={cy + 4} textAnchor="middle" className="fill-slate-900" fontSize="13" fontWeight="700">
        {total}
      </text>
    </svg>
  );
}

export function CycleLine({
  scenarios,
}: {
  scenarios: { id: string; label: string; probability: number }[];
}) {
  const w = 320;
  const h = 140;
  const pad = { l: 28, r: 8, t: 12, b: 28 };
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const pts = scenarios.map((s, i) => {
    const x = pad.l + (scenarios.length <= 1 ? innerW / 2 : (i / (scenarios.length - 1)) * innerW);
    const y = pad.t + innerH - (s.probability / 100) * innerH;
    return { x, y, ...s };
  });
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-36" role="img" aria-label="Cycle scenario probabilities">
      {[0, 25, 50, 75, 100].map((g) => {
        const y = pad.t + innerH - (g / 100) * innerH;
        return (
          <g key={g}>
            <line x1={pad.l} x2={w - pad.r} y1={y} y2={y} stroke="#e2e8f0" strokeWidth="1" />
            <text x={pad.l - 4} y={y + 3} textAnchor="end" fontSize="8" fill="#94a3b8">
              {g}
            </text>
          </g>
        );
      })}
      <path d={d} fill="none" stroke="#0052d9" strokeWidth="2.5" />
      {pts.map((p) => (
        <g key={p.id}>
          <circle cx={p.x} cy={p.y} r="4" fill="#0052d9" />
          <text x={p.x} y={h - 8} textAnchor="middle" fontSize="8" fill="#64748b">
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function MetricsTable({ rows }: { rows: MetricRow[] }) {
  if (!rows.length) return null;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-400">
            <th className="py-2 pr-3 font-semibold">Metric</th>
            <th className="py-2 pr-3 font-semibold">Value</th>
            <th className="py-2 font-semibold">Note</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-b border-slate-100 last:border-0">
              <td className="py-2.5 pr-3 font-medium text-slate-700">{r.label}</td>
              <td className="py-2.5 pr-3 font-bold text-slate-900 tabular-nums">{r.value}</td>
              <td className="py-2.5 text-xs text-slate-400">{r.hint ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StanceLegend({ counts }: { counts: Record<BriefStance, number> }) {
  return (
    <ul className="space-y-1.5 text-sm">
      {(Object.keys(counts) as BriefStance[]).map((k) => (
        <li key={k} className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: STANCE_COLOR[k] }} />
          <span className="capitalize text-slate-600">{k}</span>
          <span className="ml-auto font-bold text-slate-900">{counts[k]}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ReportAnalytics({ assembly }: { assembly: Assembly }) {
  const valuation = assembly.valuation ?? [];
  const scenarios = assembly.cycleScenarios ?? [];
  return (
    <section className="card p-6 md:p-8 mb-8">
      <h2 className="text-lg font-bold text-slate-900 mb-1">Committee tables and charts</h2>
      <p className="text-sm text-slate-500 mb-6">
        Counted from isolated briefs. Ratios are filings or cached model input — not a live quote,
        not a rating, not a buy button.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-3">Stance mix</h3>
          <div className="flex items-center gap-6">
            <StancePie counts={assembly.counts} />
            <StanceLegend counts={assembly.counts} />
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-3">Cycle scenario fan (%)</h3>
          {scenarios.length ? (
            <CycleLine scenarios={scenarios} />
          ) : (
            <p className="text-sm text-slate-500">No cycle board on this run.</p>
          )}
        </div>
      </div>
      <h3 className="text-sm font-bold text-slate-900 mb-3">
        {assembly.domain === 'crypto' ? 'Crypto snapshot' : 'Valuation and filings (P/E, P/B, …)'}
      </h3>
      <MetricsTable rows={valuation} />
    </section>
  );
}
