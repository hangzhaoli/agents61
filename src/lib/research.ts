/**
 * Isolated-then-assembled research simulation.
 * Each brief is written as if the master never saw the others.
 * Never emits "you should buy."
 */

import type { CryptoSnapshot } from '@/lib/data/crypto';
import type { Fundamentals } from '@/lib/data/fundamentals';
import type { PrivateFacts } from '@/lib/data/private-facts';
import { CYCLE_SNAPSHOT } from '@/lib/opportunities';
import { draftIndependentBrief, type BriefKind } from '@/lib/brief-writer';
import { mastersForPlan, type PlanId } from '@/lib/tiers';
import type { DeskIntent } from '@/lib/desk-plan';
import type { DeskMode } from '@/lib/desk-mode';
import { GROUP_ORDER, type Master } from '@/lib/masters';
import { writeLlmBrief, type WriteBriefOpts } from '@/lib/llm/write-brief';
import type { BriefEngine } from '@/lib/llm/deepseek';
import type { UnderwriteFrame } from '@/lib/llm/report-standard';

export type BriefStance = 'constructive' | 'cautious' | 'skeptical' | 'inconclusive';

export type IndependentBrief = {
  slug: string;
  nameEn: string;
  role: string;
  group: Master['group'];
  stance: BriefStance;
  looksAt: string;
  thesis: string;
  why: string;
  finding: string;
  risks: string;
  wouldChangeMind: string;
  sourceLine: string;
  isolated: boolean;
  engine?: BriefEngine;
  referencedFrom?: string[];
  referenceNote?: string;
};

export type MetricRow = { label: string; value: string; hint?: string };

export type Assembly = {
  plan: PlanId;
  seatCount: number;
  ticker: string;
  question: string;
  domain: BriefKind;
  counts: Record<BriefStance, number>;
  agreements: string[];
  splits: string[];
  residual: string;
  clerkNote: string;
  valuation: MetricRow[];
  cycleScenarios: { id: string; label: string; probability: number }[];
  /** V4-Pro clerk pass when DeepSeek is live */
  executiveSummary?: string;
  dataHighlights?: string[];
  openQuestions?: string[];
  underwriteFrame?: UnderwriteFrame;
  decisionHelp?: string;
  clerkEngine?: BriefEngine;
};

const STANCE_ORDER: BriefStance[] = ['constructive', 'cautious', 'skeptical', 'inconclusive'];

function money(n: number | null): string {
  if (n == null || Number.isNaN(n)) return '—';
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 1e12) return `${sign}$${(abs / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(1)}B`;
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(1)}M`;
  return `${sign}$${abs.toFixed(0)}`;
}

function pctSigned(n: number | null): string {
  if (n == null || Number.isNaN(n)) return '—';
  const v = n * 100;
  const sign = v > 0 ? '+' : '';
  return `${sign}${v.toFixed(1)}%`;
}

export function equityValuation(facts: Fundamentals): MetricRow[] {
  return [
    {
      label: 'P/E',
      value: facts.pe != null ? facts.pe.toFixed(1) : facts.peNm ? 'n/m' : '—',
      hint: facts.ratiosNote ?? undefined,
    },
    { label: 'P/B', value: facts.pb == null ? '—' : facts.pb.toFixed(2), hint: facts.ratiosNote ?? undefined },
    { label: 'P/S', value: facts.ps == null ? '—' : facts.ps.toFixed(2) },
    { label: 'ROE', value: facts.roe == null ? '—' : `${(facts.roe * 100).toFixed(1)}%` },
    { label: 'LT debt / equity', value: facts.debtToEquity == null ? '—' : facts.debtToEquity.toFixed(2) },
    { label: facts.periodKind === 'interim' ? 'Revenue (YTD)' : 'Revenue (FY)', value: money(facts.revenue) },
    { label: facts.periodKind === 'interim' ? 'Revenue YoY (interim)' : 'Revenue YoY', value: pctSigned(facts.revenueYoY) },
    { label: 'Net income', value: money(facts.netIncome) },
    { label: 'Diluted EPS', value: facts.epsDiluted == null ? '—' : `$${facts.epsDiluted.toFixed(2)}` },
  ];
}

export function privateValuation(snap: PrivateFacts | null): MetricRow[] {
  if (!snap || snap.error) {
    return [{ label: 'Private snapshot', value: '—', hint: snap?.error ?? 'Not on the private board.' }];
  }
  function money(n: number | null): string {
    if (n == null) return '—';
    if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
    if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
    if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
    return `$${n.toFixed(0)}`;
  }
  return [
    {
      label: 'Secondary mark',
      value: snap.lastValuationLabel ?? money(snap.lastValuationUsd),
      hint: 'Not a live quote · not executable',
    },
    { label: 'Last round', value: snap.lastRound ?? '—' },
    { label: 'Revenue run-rate', value: money(snap.revenueRunRateUsd), hint: 'Public estimate' },
    { label: 'Monthly burn', value: money(snap.burnMonthlyUsd) },
    { label: 'Runway (mo)', value: snap.runwayMonths == null ? '—' : String(snap.runwayMonths) },
    {
      label: 'Listed comparables',
      value: snap.comparableTickers.length ? snap.comparableTickers.join(', ') : '—',
    },
  ];
}

export function cryptoValuation(snap: CryptoSnapshot | null): MetricRow[] {
  if (!snap) {
    return [{ label: 'Snapshot', value: '—', hint: 'No crypto feed on this run.' }];
  }
  return [
    {
      label: 'Price (cached)',
      value: snap.priceUsd == null ? '—' : `$${snap.priceUsd.toLocaleString('en-US', { maximumFractionDigits: 2 })}`,
      hint: 'Public API snapshot, not a live quote',
    },
    { label: 'Market cap', value: money(snap.marketCap) },
    { label: '24h volume', value: money(snap.volume24h) },
    { label: '24h change', value: pctSigned(snap.change24h) },
    { label: '7d change', value: pctSigned(snap.change7d) },
    {
      label: 'Circulating supply',
      value: snap.circulatingSupply == null ? '—' : snap.circulatingSupply.toLocaleString('en-US', { maximumFractionDigits: 0 }),
    },
  ];
}

export function buildIndependentBrief(
  master: Master,
  ticker: string,
  facts: Fundamentals,
  question: string,
  kind: BriefKind = 'ticker',
  crypto: CryptoSnapshot | null = null
): IndependentBrief {
  const draft = draftIndependentBrief(master, ticker, facts, question, kind, crypto);
  return { ...draft, isolated: true, engine: 'template' };
}

/** Live desk: DeepSeek V4 per seat, methodology-card fallback. Stock pages keep the sync writer. */
export async function writeIndependentBrief(opts: WriteBriefOpts): Promise<IndependentBrief> {
  return writeLlmBrief(opts);
}

function clipNote(s: string, n: number): string {
  const t = s.replace(/\s+/g, ' ').trim();
  return t.length <= n ? t : `${t.slice(0, n - 1)}…`;
}

export function groupRank(group: Master['group']): number {
  const i = GROUP_ORDER.indexOf(group);
  return i < 0 ? 99 : i;
}

/** Earlier pipeline groups only — never peers in the same group, never 61². */
export function attachHandoff(
  brief: IndependentBrief,
  upstream: IndependentBrief[]
): IndependentBrief {
  if (!upstream.length) {
    return { ...brief, isolated: false };
  }
  const names = [...new Set(upstream.map((b) => b.nameEn))];
  const note = upstream
    .slice(-8)
    .map((b) => `${b.nameEn} (${b.stance}): ${clipNote(b.finding || b.thesis, 80)}`)
    .join(' · ');
  const llm = brief.engine && brief.engine !== 'template';
  const who = names.slice(0, 5).join(', ') + (names.length > 5 ? '…' : '');
  return {
    ...brief,
    isolated: false,
    referencedFrom: names,
    referenceNote: note,
    thesis: llm
      ? brief.thesis
      : `${brief.thesis} Handoff: this seat read ${who} from earlier steps, then applied its own test. Not a group chat.`,
  };
}

export function assembleBriefs(
  briefs: IndependentBrief[],
  plan: PlanId,
  ticker: string,
  question: string,
  intent: DeskIntent = 'general',
  extras?: {
    facts?: Fundamentals;
    crypto?: CryptoSnapshot | null;
    privateFacts?: PrivateFacts | null;
    domain?: BriefKind;
    mode?: DeskMode;
  }
): Assembly {
  const counts: Record<BriefStance, number> = {
    constructive: 0,
    cautious: 0,
    skeptical: 0,
    inconclusive: 0,
  };
  for (const b of briefs) counts[b.stance] += 1;

  const groups = new Set(briefs.map((b) => b.group));
  const agreements: string[] = [];
  const splits: string[] = [];
  const domain: BriefKind =
    extras?.domain ??
    (intent === 'opportunity'
      ? 'opportunity'
      : intent === 'crypto'
        ? 'crypto'
        : intent === 'emerging'
          ? 'emerging'
          : 'ticker');

  if (domain === 'crypto') {
    agreements.push(
      'Crypto/on-chain seats wrote in isolation. Cash-flow multiples (P/E, P/B) are not forced onto tokens that have no earnings.'
    );
    splits.push(
      'Value seats usually stay cautious on non-cash-flow assets; trend/growth seats classify usage. The clerk does not average that into a rating.'
    );
  } else if (domain === 'private') {
    agreements.push(
      'Private-desk seats wrote in isolation. Secondary marks and public disclosures only — no SEC EDGAR, no invented cap table.'
    );
    splits.push(
      'Quality seats ask whether the business is real; trend seats map capex cycles; debate seats invert the secondary mark. The clerk does not merge that into a price target.'
    );
  } else if (domain === 'emerging') {
    agreements.push(
      'Emerging-market work uses the US-listed window. Policy, FX, and listing structure sit beside filings.'
    );
    splits.push(
      'A country growth story is not the same test as a franchise. Templeton-style pessimism and quality screens are not merged.'
    );
  } else if (intent === 'opportunity') {
    const trendN = briefs.filter((b) => b.group === 'trend').length;
    const cycleN = briefs.filter((b) => b.group === 'cycle').length;
    const valueN = briefs.filter((b) => b.group === 'value').length;
    const growthN = briefs.filter((b) => b.group === 'growth').length;
    agreements.push(
      `Opportunity scan ran pipeline 1–3 only: ${trendN} trend, ${cycleN} cycle, ${valueN} value, ${growthN} growth — isolated, then stacked.`
    );
    agreements.push(
      `Cycle board is ${CYCLE_SNAPSHOT.phase} at ${CYCLE_SNAPSHOT.temperature}. That is a regime note, not a timing ticket.`
    );
    splits.push(
      'Value/quality seats nominate businesses you might own; growth seats classify stories you can observe. Those lists are not merged into one ranking.'
    );
    splits.push(
      'A name on the dual-track pool is homework. Debate, timing, and exit did not run — they need a ticker you actually want to underwrite.'
    );
  } else if (question.trim()) {
    agreements.unshift(
      extras?.mode === 'handoff'
        ? `The clerk stacked a pipeline handoff on: “${question.trim().slice(0, 140)}”. Later seats could read earlier groups; peers in the same group stayed silent.`
        : `The clerk stacked isolated notes on: “${question.trim().slice(0, 140)}”. Masters did not see each other’s drafts.`
    );
  }
  if (counts.inconclusive > 0) {
    agreements.push('Missing or thin filings force several seats to stay inconclusive rather than invent numbers.');
  }
  if (groups.has('value') && groups.has('growth')) {
    splits.push(
      'Value/quality seats ask whether it is a business worth owning; growth seats ask whether the story is still underappreciated. Those are different tests.'
    );
  }
  if (groups.has('debate')) {
    splits.push('Debate seats write kill-shots before any clerk summary. They are not asked to “meet in the middle.”');
  }
  if (counts.constructive > 0 && counts.skeptical > 0) {
    splits.push('Constructive and skeptical briefs both survived isolation — the clerk does not erase the split.');
  }
  if (groups.has('value') && domain !== 'crypto') {
    agreements.push('Quality seats treat “would I own the whole company?” as the filter, not next-quarter beat.');
  }
  if (briefs.length <= 3) {
    agreements.push(
      'This preview triangle is quality, growth classification, and inversion. It is a sample, not the full committee.'
    );
  }

  const residual =
    intent === 'opportunity' || (domain !== 'ticker' && (ticker === 'BOARD' || ticker === 'CRYPTO' || ticker === 'EM'))
      ? 'Pick one name from the board and convene the full unlocked desk. Red team, timing, and exit stay dark until then.'
      : briefs.length < 16
        ? 'Cycle, timing, exit, and quant seats are dark on this plan. A three-seat sample cannot locate the cycle or size a position.'
        : briefs.length < 29
          ? 'Analyst covers the working 16. Associate adds 13 red-team, cycle, and timing seats (29 total). Exit stays on Committee.'
          : briefs.length < 48
            ? 'Associate is 29 seats. Principal adds more specialists to 48. Exit and remaining quant stay on Committee.'
            : briefs.length < 61
              ? 'Principal is 48 seats. Exit desk and remaining platform-quant seats stay on Committee or Partners.'
              : 'Full roster is present. Residual risk is disagreement among isolated briefs — not a missing seat.';

  const valuation =
    domain === 'crypto'
      ? cryptoValuation(extras?.crypto ?? null)
      : domain === 'private'
        ? privateValuation(extras?.privateFacts ?? null)
        : equityValuation(extras?.facts ?? emptyFacts(ticker));

  return {
    plan,
    seatCount: briefs.length,
    ticker: ticker.toUpperCase(),
    question: question.trim(),
    domain,
    counts,
    agreements: agreements.slice(0, 4),
    splits: splits.slice(0, 4),
    residual,
    clerkNote:
      extras?.mode === 'handoff'
        ? 'Assembly is a clerk pass after a pipeline handoff. Later groups could read earlier notes; peers in the same group did not. Research simulation — not advice, not a buy button.'
        : 'Assembly is a second isolated pass over the briefs. Masters did not read each other. Research simulation — not advice, not a buy button.',
    valuation,
    cycleScenarios: CYCLE_SNAPSHOT.scenarios.map((s) => ({ ...s })),
  };
}

function emptyFacts(ticker: string): Fundamentals {
  return {
    ticker,
    cik: null,
    entityName: null,
    periodEnd: null,
    form: null,
    fiscalYear: null,
    fiscalPeriod: null,
    periodKind: null,
    revenue: null,
    revenueYoY: null,
    netIncome: null,
    epsDiluted: null,
    sharesDiluted: null,
    equity: null,
    assets: null,
    liabilities: null,
    longTermDebt: null,
    roe: null,
    debtToEquity: null,
    price: null,
    marketCap: null,
    pe: null,
    peNm: false,
    pb: null,
    ps: null,
    source: 'sec-edgar',
    fmpInternalReady: false,
    ratiosNote: null,
    error: null,
  };
}

export function runIsolatedResearch(
  plan: PlanId,
  ticker: string,
  facts: Fundamentals,
  question = '',
  kind: BriefKind = 'ticker',
  crypto: CryptoSnapshot | null = null
) {
  const seats = mastersForPlan(plan);
  const q =
    question.trim() ||
    (kind === 'crypto'
      ? `Research ${ticker.toUpperCase()} as a crypto/on-chain subject.`
      : kind === 'emerging'
        ? `Research ${ticker.toUpperCase()} as a US-listed emerging-market name.`
        : `Research ${ticker.toUpperCase()} as a US-listed name.`);
  const briefs = seats.map((m) => buildIndependentBrief(m, ticker, facts, q, kind, crypto));
  const domain: BriefKind = kind;
  const intent: DeskIntent =
    kind === 'opportunity' ? 'opportunity' : kind === 'crypto' ? 'crypto' : kind === 'emerging' ? 'emerging' : 'general';
  const assembly = assembleBriefs(briefs, plan, ticker, q, intent, { facts, crypto, domain });
  return { seats, briefs, assembly };
}

export function stanceLabel(s: BriefStance): string {
  return s;
}

export { STANCE_ORDER };
export type { BriefKind };
