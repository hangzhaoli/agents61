/**
 * Internal Prediction Markets virtual-money paper book.
 * Clerk-only entries. Mid fills, zero fees. Not advice / not real trading.
 */

import { deepseekChat, hasDeepseekKey } from '@/lib/llm/deepseek';
import { getEventNewsDigest } from '@/lib/llm/news-scan';
import { seedTemplateReport } from '@/lib/prediction/analyze';
import { getPredictionMarket, listPredictionMarkets } from '@/lib/prediction/polymarket';
import {
  gapOf,
  type Confidence,
  type PredictionMarket,
  type ResolutionRisk,
  type StrategyReport,
} from '@/lib/prediction/types';
import { supabaseAdmin, supabaseConfigured } from '@/lib/supabase/admin';

export type PaperSide = 'YES' | 'NO';

export type PaperPosition = {
  id: string;
  marketId: string;
  question: string;
  url: string;
  category: string;
  openedAt: string;
  side: PaperSide;
  entryMid: number;
  agents61: number;
  gap: number;
  confidence: string;
  resolutionRisk: string;
  engine: string;
  volumeUsd: number;
  endDate: string | null;
  daysToResolutionEst: number | null;
  stake: number;
  modelEvUsd: number;
  modelEvPct: number;
  roiIfCorrectPct: number;
  status: 'open' | 'settled';
  realizedPnL: number | null;
  won?: boolean | null;
  settledAt?: string;
  finalYesPct?: number;
  markMid?: number;
  executiveSummary?: string | null;
  whyGap?: string | null;
};

export type PaperRun = {
  at: string;
  action: 'open' | 'settle' | 'daily';
  analyzed?: number;
  opened?: number;
  settled?: number;
  stillOpen?: number;
  clerkOk?: number;
  clerkFail?: number;
  note?: string;
};

export type PaperBook = {
  version: number;
  createdAt: string;
  updatedAt: string;
  assumptions: {
    fill: string;
    fees: number;
    stakePerPositionUsd: number;
    bankrollUsd: number;
    minAbsGapPp: number;
    minVolumeUsd: number;
    engine: string;
    warning: string;
  };
  summary: {
    analyzed: number;
    opened: number;
    skipped: number;
    deployedUsd: number;
    bankrollUsd: number;
    modelImpliedEvUsd: number;
    modelImpliedEvOnDeployedPct: number;
    medianDaysToResolutionEst: number | null;
    deskCostMonthlyUsd: number;
    modelDaysToPaybackVsAnalyst: number | null;
    notePayback: string;
    realizedPnLUsd?: number;
    settledCount?: number;
    stillOpenCount?: number;
    realizedRoiOnDeployedPct?: number;
    openCount?: number;
  };
  positions: PaperPosition[];
  analyses: Array<{
    marketId: string;
    question: string;
    mid: number;
    gap: number;
    agents61: number;
    engine: string;
    traded: boolean;
    at: string;
    note?: string;
  }>;
  runs: PaperRun[];
};

export type PaperOpenOpts = {
  limit?: number;
  minGap?: number;
  stake?: number;
  bankroll?: number;
  minVol?: number;
  useClerk?: boolean;
};

const LEDGER_ID = 'default';

function clamp(n: number, lo = 1, hi = 99): number {
  return Math.max(lo, Math.min(hi, Math.round(n)));
}

/**
 * Paper clerk: Flash + thinking off (reliable JSON). Pro/thinking often returns
 * empty content or prose — silent template fallback blocked all trades.
 */
async function paperClerkAnalyze(market: PredictionMarket): Promise<StrategyReport> {
  const draft = seedTemplateReport(market);
  if (!hasDeepseekKey()) {
    return { ...draft, engine: 'template' };
  }

  let newsBullets: string[] = [];
  try {
    const digest = await getEventNewsDigest(market.question);
    newsBullets = digest?.bullets ?? [];
  } catch {
    /* optional */
  }

  const newsSection =
    newsBullets.length > 0
      ? `NEWS (unverified):\n- ${newsBullets.slice(0, 4).join('\n- ')}`
      : 'NEWS LAYER: unavailable — do not invent headlines.';

  const { content } = await deepseekChat({
    lane: 'card',
    thinking: false,
    temperature: 0.2,
    timeoutMs: 45_000,
    maxTokens: 900,
    messages: [
      {
        role: 'system',
        content: `You are Agents61 Prediction Clerk (research simulation, not a bookie).
Never say bet/buy/sell YES/NO or give position size.
Calibrate carefully — only diverge from market mid when resolution wording, base rates, or news justify it.
Return ONLY JSON (no markdown):
{"agents61Probability":1-99,"confidence":"High"|"Medium"|"Low","resolutionRisk":"Low"|"Medium"|"High","executiveSummary":"string","whyGap":"one sentence"}`,
      },
      {
        role: 'user',
        content: JSON.stringify({
          question: market.question,
          description: market.description.slice(0, 600),
          marketProbability: market.marketProbability,
          category: market.category,
          endDate: market.endDate,
          volumeUsd: market.volumeUsd,
          draft: {
            agents61Probability: draft.agents61Probability,
            probabilityGap: draft.probabilityGap,
            confidence: draft.confidence,
            resolutionRisk: draft.resolutionRisk,
          },
          newsSection,
        }),
      },
    ],
  });

  const start = content.indexOf('{');
  const end = content.lastIndexOf('}');
  if (start < 0 || end <= start) throw new Error(`Clerk JSON missing: ${content.slice(0, 100)}`);
  const parsed = JSON.parse(content.slice(start, end + 1)) as {
    agents61Probability?: number;
    confidence?: Confidence;
    resolutionRisk?: ResolutionRisk;
    executiveSummary?: string;
    whyGap?: string;
  };
  const p = clamp(Number(parsed.agents61Probability ?? draft.agents61Probability));
  const confidence: Confidence =
    parsed.confidence === 'High' || parsed.confidence === 'Medium' || parsed.confidence === 'Low'
      ? parsed.confidence
      : draft.confidence;
  const resolutionRisk: ResolutionRisk =
    parsed.resolutionRisk === 'High' ||
    parsed.resolutionRisk === 'Medium' ||
    parsed.resolutionRisk === 'Low'
      ? parsed.resolutionRisk
      : draft.resolutionRisk;

  return {
    ...draft,
    agents61Probability: p,
    probabilityGap: gapOf(p, market.marketProbability),
    confidence,
    resolutionRisk,
    risks: { ...draft.risks, resolution: resolutionRisk, overall: resolutionRisk },
    executiveSummary: String(parsed.executiveSummary || draft.executiveSummary),
    whyMarketMayBeWrong: parsed.whyGap
      ? [String(parsed.whyGap), ...draft.whyMarketMayBeWrong.slice(0, 2)]
      : draft.whyMarketMayBeWrong,
    whyDisagree: parsed.whyGap ? [String(parsed.whyGap)] : draft.whyDisagree,
    engine: 'deepseek',
    newsBullets: newsBullets.length ? newsBullets : draft.newsBullets,
    analyzedAt: new Date().toISOString(),
  };
}

const DEFAULT_ASSUMPTIONS = (opts: Required<PaperOpenOpts>) => ({
  fill: 'Polymarket YES mid (optimistic — no book/slippage)',
  fees: 0,
  stakePerPositionUsd: opts.stake,
  bankrollUsd: opts.bankroll,
  minAbsGapPp: opts.minGap,
  minVolumeUsd: opts.minVol,
  engine: opts.useClerk ? 'deepseek-flash-clerk-only' : 'template-forbidden-for-trades',
  warning:
    'Template gaps are hash-seeded — never trade them. Clerk-only paper entries (Flash). Realized P&L needs settlement. Not advice.',
});

function emptyBook(opts: Required<PaperOpenOpts>): PaperBook {
  const now = new Date().toISOString();
  return {
    version: 2,
    createdAt: now,
    updatedAt: now,
    assumptions: DEFAULT_ASSUMPTIONS(opts),
    summary: {
      analyzed: 0,
      opened: 0,
      skipped: 0,
      deployedUsd: 0,
      bankrollUsd: opts.bankroll,
      modelImpliedEvUsd: 0,
      modelImpliedEvOnDeployedPct: 0,
      medianDaysToResolutionEst: null,
      deskCostMonthlyUsd: 19,
      modelDaysToPaybackVsAnalyst: null,
      notePayback: 'Model EV / median days — not realized.',
      realizedPnLUsd: 0,
      settledCount: 0,
      stillOpenCount: 0,
      openCount: 0,
    },
    positions: [],
    analyses: [],
    runs: [],
  };
}

function normalizeOpts(raw: PaperOpenOpts = {}): Required<PaperOpenOpts> {
  return {
    limit: Math.min(8, Math.max(1, raw.limit ?? 4)),
    minGap: raw.minGap ?? 3,
    stake: raw.stake ?? 100,
    bankroll: raw.bankroll ?? 1000,
    minVol: raw.minVol ?? 50_000,
    useClerk: raw.useClerk !== false,
  };
}

function daysUntil(iso: string | null): number | null {
  if (!iso) return null;
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return null;
  return Math.max(0, Math.round((t - Date.now()) / 86_400_000));
}

function paperMath(side: PaperSide, entryPct: number, agents61Pct: number, stake: number) {
  const entry = entryPct / 100;
  const pYes = agents61Pct / 100;
  if (side === 'YES') {
    const shares = stake / entry;
    const winProfit = shares * (1 - entry);
    const ev = pYes * winProfit + (1 - pYes) * -stake;
    return { ev, evPct: (ev / stake) * 100, roiIfWinPct: (winProfit / stake) * 100 };
  }
  const noEntry = 1 - entry;
  const shares = stake / noEntry;
  const winProfit = shares * (1 - noEntry);
  const pNo = 1 - pYes;
  const ev = pNo * winProfit + (1 - pNo) * -stake;
  return { ev, evPct: (ev / stake) * 100, roiIfWinPct: (winProfit / stake) * 100 };
}

function settlePnL(pos: PaperPosition, finalYesPct: number) {
  if (finalYesPct > 5 && finalYesPct < 95) {
    return { status: 'open' as const, realizedPnL: null as number | null, won: null as boolean | null };
  }
  const won = pos.side === 'YES' ? finalYesPct >= 95 : finalYesPct <= 5;
  const entry = pos.entryMid / 100;
  if (pos.side === 'YES') {
    const shares = pos.stake / entry;
    const realized = won ? shares * (1 - entry) : -pos.stake;
    return { status: 'settled' as const, realizedPnL: Math.round(realized * 100) / 100, won };
  }
  const noEntry = 1 - entry;
  const shares = pos.stake / noEntry;
  const realized = won ? shares * entry : -pos.stake;
  return { status: 'settled' as const, realizedPnL: Math.round(realized * 100) / 100, won };
}

function recomputeSummary(book: PaperBook, bankroll: number) {
  const open = book.positions.filter((p) => p.status === 'open');
  const settled = book.positions.filter((p) => p.status === 'settled');
  const deployed = open.reduce((s, p) => s + p.stake, 0);
  const modelEv = open.reduce((s, p) => s + p.modelEvUsd, 0);
  const realized = settled.reduce((s, p) => s + (p.realizedPnL ?? 0), 0);
  const days = open
    .map((p) => p.daysToResolutionEst)
    .filter((d): d is number => d != null)
    .sort((a, b) => a - b);
  const medianDays = days.length ? days[Math.floor(days.length / 2)]! : null;
  const totalDeployedEver = book.positions.reduce((s, p) => s + p.stake, 0);

  book.summary = {
    ...book.summary,
    opened: open.length,
    deployedUsd: deployed,
    bankrollUsd: bankroll,
    modelImpliedEvUsd: Math.round(modelEv * 100) / 100,
    modelImpliedEvOnDeployedPct: deployed > 0 ? Math.round((modelEv / deployed) * 1000) / 10 : 0,
    medianDaysToResolutionEst: medianDays,
    modelDaysToPaybackVsAnalyst:
      modelEv > 0 ? Math.round((19 / (modelEv / Math.max(1, medianDays || 30))) * 10) / 10 : null,
    realizedPnLUsd: Math.round(realized * 100) / 100,
    settledCount: settled.length,
    stillOpenCount: open.length,
    openCount: open.length,
    realizedRoiOnDeployedPct:
      totalDeployedEver > 0 ? Math.round((realized / totalDeployedEver) * 1000) / 10 : 0,
  };
}

export async function loadPaperBook(opts?: PaperOpenOpts): Promise<PaperBook> {
  const n = normalizeOpts(opts);
  if (!supabaseConfigured()) return emptyBook(n);
  const admin = supabaseAdmin();
  if (!admin) return emptyBook(n);
  const { data, error } = await admin
    .from('desk_prediction_paper_ledger')
    .select('payload')
    .eq('id', LEDGER_ID)
    .maybeSingle();
  if (error || !data?.payload) return emptyBook(n);
  const book = data.payload as PaperBook;
  if (!book.runs) book.runs = [];
  if (!book.analyses) book.analyses = [];
  if (!book.positions) book.positions = [];
  return book;
}

export async function savePaperBook(book: PaperBook): Promise<void> {
  book.updatedAt = new Date().toISOString();
  const admin = supabaseAdmin();
  if (!admin) {
    throw new Error('Supabase not configured — cannot persist paper ledger');
  }
  const { error } = await admin.from('desk_prediction_paper_ledger').upsert({
    id: LEDGER_ID,
    payload: book,
    updated_at: book.updatedAt,
  });
  if (error) throw new Error(`Paper ledger save failed: ${error.message}`);
}

export async function settlePaperBook(opts?: PaperOpenOpts): Promise<PaperBook> {
  const n = normalizeOpts(opts);
  const book = await loadPaperBook(n);
  let settledN = 0;
  let stillOpen = 0;

  for (const pos of book.positions) {
    if (pos.status === 'settled') continue;
    const live = await getPredictionMarket(pos.marketId);
    if (!live) {
      stillOpen += 1;
      continue;
    }
    const result = settlePnL(pos, live.marketProbability);
    if (result.status === 'settled') {
      pos.status = 'settled';
      pos.realizedPnL = result.realizedPnL;
      pos.won = result.won;
      pos.settledAt = new Date().toISOString();
      pos.finalYesPct = live.marketProbability;
      settledN += 1;
    } else {
      pos.markMid = live.marketProbability;
      stillOpen += 1;
    }
  }

  recomputeSummary(book, n.bankroll);
  book.runs.unshift({
    at: new Date().toISOString(),
    action: 'settle',
    settled: settledN,
    stillOpen,
  });
  book.runs = book.runs.slice(0, 60);
  await savePaperBook(book);
  return book;
}

export async function openPaperBook(opts?: PaperOpenOpts): Promise<PaperBook> {
  const n = normalizeOpts(opts);
  if (!n.useClerk) {
    throw new Error('Paper book refuses template-only opens — set useClerk true');
  }
  if (!hasDeepseekKey()) {
    throw new Error('DEEPSEEK_API_KEY missing — paper book will not open on template gaps');
  }

  const book = await loadPaperBook(n);
  book.assumptions = DEFAULT_ASSUMPTIONS(n);

  const { markets, live } = await listPredictionMarkets();
  if (!live) {
    book.runs.unshift({
      at: new Date().toISOString(),
      action: 'open',
      analyzed: 0,
      opened: 0,
      note: 'Gamma/live feed unavailable — skipped open',
    });
    await savePaperBook(book);
    return book;
  }

  const openIds = new Set(book.positions.filter((p) => p.status === 'open').map((p) => p.marketId));
  const openDeployed = book.positions.filter((p) => p.status === 'open').reduce((s, p) => s + p.stake, 0);

  const candidates = markets
    .filter((m) => m.volumeUsd >= n.minVol)
    .filter((m) => m.marketProbability >= 12 && m.marketProbability <= 88)
    .filter((m) => !openIds.has(m.id))
    .slice(0, Math.max(n.limit * 3, 12));

  const analyses: Array<{ market: PredictionMarket; report: StrategyReport; note?: string }> = [];
  let clerkOk = 0;
  let clerkFail = 0;
  for (const market of candidates) {
    if (analyses.length >= n.limit) break;
    try {
      const report = await paperClerkAnalyze(market);
      if (report.engine === 'deepseek') clerkOk += 1;
      else clerkFail += 1;
      analyses.push({ market, report });
    } catch (e) {
      clerkFail += 1;
      analyses.push({
        market,
        report: seedTemplateReport(market),
        note: e instanceof Error ? e.message.slice(0, 120) : 'clerk failed',
      });
    }
  }

  let deployed = openDeployed;
  let opened = 0;
  const at = new Date().toISOString();

  for (const { market, report, note } of analyses) {
    const traded =
      report.engine === 'deepseek' &&
      Math.abs(report.probabilityGap) >= n.minGap &&
      report.resolutionRisk !== 'High' &&
      deployed + n.stake <= n.bankroll &&
      !openIds.has(market.id);

    book.analyses.unshift({
      marketId: market.id,
      question: market.question,
      mid: market.marketProbability,
      gap: report.probabilityGap,
      agents61: report.agents61Probability,
      engine: report.engine,
      traded,
      at,
      note,
    });

    if (!traded) continue;

    const side: PaperSide = report.probabilityGap > 0 ? 'YES' : 'NO';
    const math = paperMath(side, market.marketProbability, report.agents61Probability, n.stake);
    book.positions.push({
      id: `pp-${market.id}-${Date.now()}-${opened}`,
      marketId: market.id,
      question: market.question,
      url: market.url,
      category: market.category,
      openedAt: at,
      side,
      entryMid: market.marketProbability,
      agents61: report.agents61Probability,
      gap: gapOf(report.agents61Probability, market.marketProbability),
      confidence: report.confidence,
      resolutionRisk: report.resolutionRisk,
      engine: report.engine,
      volumeUsd: market.volumeUsd,
      endDate: market.endDate,
      daysToResolutionEst: daysUntil(market.endDate),
      stake: n.stake,
      modelEvUsd: Math.round(math.ev * 100) / 100,
      modelEvPct: Math.round(math.evPct * 10) / 10,
      roiIfCorrectPct: Math.round(math.roiIfWinPct * 10) / 10,
      status: 'open',
      realizedPnL: null,
      executiveSummary: report.executiveSummary ?? null,
      whyGap: report.whyMarketMayBeWrong?.[0] ?? report.whyDisagree?.[0] ?? null,
    });
    openIds.add(market.id);
    deployed += n.stake;
    opened += 1;
  }

  book.analyses = book.analyses.slice(0, 200);
  book.summary.analyzed = (book.summary.analyzed || 0) + analyses.length;
  book.summary.skipped = analyses.length - opened;
  recomputeSummary(book, n.bankroll);
  book.runs.unshift({
    at,
    action: 'open',
    analyzed: analyses.length,
    opened,
    clerkOk,
    clerkFail,
    note: live ? undefined : 'fallback markets',
  });
  book.runs = book.runs.slice(0, 60);
  await savePaperBook(book);
  return book;
}

/** Settle open positions, then open new clerk-only entries. */
export async function runPaperDaily(opts?: PaperOpenOpts): Promise<PaperBook> {
  await settlePaperBook(opts);
  const book = await openPaperBook(opts);
  const last = book.runs[0];
  book.runs[0] = {
    ...(last ?? { at: new Date().toISOString(), action: 'open' }),
    action: 'daily',
  };
  await savePaperBook(book);
  return book;
}

export function assertPaperAuth(request: Request): boolean {
  const secret = (process.env.CRON_SECRET || process.env.INTERNAL_PAPER_TOKEN || '').trim();
  if (!secret) return false;
  const auth = request.headers.get('authorization') || '';
  const bearer = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  const header = request.headers.get('x-paper-token')?.trim() || '';
  const url = new URL(request.url);
  const q = url.searchParams.get('token')?.trim() || '';
  return bearer === secret || header === secret || q === secret;
}
