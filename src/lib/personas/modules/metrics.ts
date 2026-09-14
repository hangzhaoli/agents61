import type { Fundamentals } from '@/lib/data/fundamentals';
import { getSourcePack } from '@/lib/personas/source-pack';
import type { MetricId } from '@/lib/personas/source-pack/types';

export function metricsForSlug(slug: string): MetricId[] {
  return getSourcePack(slug)?.metricsBound ?? [];
}

function money(n: number | null): string | null {
  if (n == null || Number.isNaN(n)) return null;
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 1e12) return `${sign}$${(abs / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(1)}B`;
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(1)}M`;
  return `${sign}$${abs.toFixed(0)}`;
}

function pct(n: number | null): string | null {
  if (n == null || Number.isNaN(n)) return null;
  return `${(n * 100).toFixed(1)}%`;
}

/**
 * Pick desk FACTS fields that map to the pack's bound metrics.
 * Missing metrics stay explicitly "not on file" — never invent.
 */
export function formatMetricsContext(
  slug: string,
  facts: Fundamentals | null | undefined
): string {
  const bound = metricsForSlug(slug);
  if (!bound.length) return '';

  const f = facts ?? null;
  const lines: string[] = [];

  for (const m of bound) {
    switch (m) {
      case 'P/E':
        lines.push(
          f?.pe != null
            ? `P/E: ${f.pe.toFixed(1)} (cached)`
            : f?.peNm
              ? 'P/E: n/m'
              : 'P/E: not on file'
        );
        break;
      case 'P/B':
        lines.push(f?.pb != null ? `P/B: ${f.pb.toFixed(2)} (cached)` : 'P/B: not on file');
        break;
      case 'PEG': {
        const yoy = f?.revenueYoY;
        if (f?.pe != null && yoy != null && yoy > 0.01) {
          const peg = f.pe / (yoy * 100);
          lines.push(
            `PEG heuristic: ~${peg.toFixed(1)} (P/E ${f.pe.toFixed(1)} ÷ rev YoY ${(yoy * 100).toFixed(1)}%) — not forward PEG`
          );
        } else {
          lines.push('PEG: not on file (need P/E + positive revenue YoY on this desk run)');
        }
        break;
      }
      case 'ROE':
        lines.push(f?.roe != null ? `ROE: ${pct(f.roe)}` : 'ROE: not on file');
        break;
      case 'ROIC':
        lines.push(
          f?.roe != null
            ? `ROIC: not on file — ROE ${pct(f.roe)} is a rough proxy only`
            : 'ROIC: not on file'
        );
        break;
      case 'owner_earnings':
        lines.push(
          f?.netIncome != null
            ? `owner_earnings: not computed — net income ${money(f.netIncome)} on file (maintenance capex not on file)`
            : 'owner_earnings: not on file'
        );
        break;
      case 'FCF_yield':
        lines.push('FCF_yield: not on file');
        break;
      case 'earnings_yield':
        lines.push(
          f?.pe != null && f.pe > 0
            ? `earnings_yield: crude proxy ~${(100 / f.pe).toFixed(1)}% (1÷P/E) — not EBIT/EV Magic Formula yield`
            : f?.peNm
              ? 'earnings_yield: n/m while P/E unavailable'
              : 'earnings_yield: not on file (need P/E or EBIT/EV)'
        );
        break;
      case 'leverage':
        lines.push(
          f?.debtToEquity != null
            ? `leverage: LT debt/equity ${f.debtToEquity.toFixed(2)}`
            : 'leverage: not on file'
        );
        break;
      case 'revenue_growth':
        lines.push(
          f?.revenueYoY != null ? `revenue_growth YoY: ${pct(f.revenueYoY)}` : 'revenue_growth: not on file'
        );
        break;
      case 'margin_durability':
        lines.push(
          f?.netIncome != null && f?.revenue != null && f.revenue !== 0
            ? `margin_durability proxy (NI/rev): ${((f.netIncome / f.revenue) * 100).toFixed(1)}% — single period only`
            : 'margin_durability: not on file'
        );
        break;
      case 'credit_spreads':
        lines.push('credit_spreads: not on file (no desk credit series in v1)');
        break;
      case 'valuation_vs_assumption':
        lines.push(
          [
            'valuation_vs_assumption: map what growth/margins/multiple the quote embeds.',
            f?.pe != null ? `Starting multiple P/E ${f.pe.toFixed(1)}.` : 'Starting multiple not on file.',
          ].join(' ')
        );
        break;
      default:
        lines.push(`${m}: not on file`);
    }
  }

  return `BOUND METRICS (${slug}):\n${lines.map((l) => `- ${l}`).join('\n')}`;
}
