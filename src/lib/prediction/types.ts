/**
 * Prediction Markets MVP types — research simulation only.
 * No trading, wallet, or order routing.
 */

export type Confidence = 'High' | 'Medium' | 'Low';
export type ResolutionRisk = 'Low' | 'Medium' | 'High';

export type PredictionProvider = 'polymarket' | 'kalshi';

export type PredictionMarket = {
  id: string;
  slug: string;
  question: string;
  /** YES implied probability 0–100 */
  marketProbability: number;
  volumeUsd: number;
  volumeLabel: string;
  endDate: string | null;
  endDateLabel: string;
  description: string;
  url: string;
  /** Venue / data origin (legacy). Prefer `provider`. */
  source: 'polymarket' | 'fallback';
  /** Canonical venue for multi-provider routing */
  provider: PredictionProvider;
  /** Optional category tag for domain expert routing */
  category: string;
};

export type PredictionAgentId =
  | 'news'
  | 'data'
  | 'base-rate'
  | 'domain'
  | 'market'
  | 'bayesian'
  | 'contrarian'
  | 'red-team'
  | 'resolution'
  | 'risk';

export type PredictionAgentNote = {
  id: PredictionAgentId;
  name: string;
  role: string;
  summary: string;
  /** Optional implied probability contribution 0–100 */
  impliedProbability?: number;
  sources: { title: string; url: string }[];
};

export type ScenarioBranch = {
  probability: number;
  reason: string;
};

export type StrategyScenarios = {
  yes: ScenarioBranch;
  base: ScenarioBranch;
  no: ScenarioBranch;
};

export type StrategyRisks = {
  resolution: ResolutionRisk;
  liquidity: ResolutionRisk;
  information: ResolutionRisk;
  event: ResolutionRisk;
  overall: ResolutionRisk;
};

export type ResolutionCheck = {
  source: string;
  deadline: string;
  ambiguity: ResolutionRisk;
  edgeCases: string[];
  summary: string;
};

export type StrategyReport = {
  marketId: string;
  marketQuestion: string;
  marketProbability: number;
  agents61Probability: number;
  probabilityGap: number;
  confidence: Confidence;
  probabilityRange: [number, number];
  /** @deprecated Prefer whyMarketMayBeWrong — kept for backward compat */
  whyDisagree: string[];
  /** Why the market mid may be miscalibrated vs Agents61 */
  whyMarketMayBeWrong: string[];
  /** Why the market mid may still be correct */
  whyMarketMayBeRight: string[];
  bullEvidence: string[];
  bearEvidence: string[];
  keyCatalysts: string[];
  /** @deprecated Prefer invalidationConditions */
  whatCouldMakeUsWrong: string[];
  invalidationConditions: string[];
  scenarios: StrategyScenarios;
  risks: StrategyRisks;
  resolutionCheck?: ResolutionCheck;
  /** Top-level resolution risk (mirrors risks.overall / risks.resolution) */
  resolutionRisk: ResolutionRisk;
  executiveSummary: string;
  sources: { title: string; url: string }[];
  agentNotes: PredictionAgentNote[];
  clerkNote: string;
  analyzedAt: string;
  engine: 'deepseek' | 'template';
  /** Optional news bullets injected for Pro clerk passes */
  newsBullets?: string[];
};

/** Client watchlist row (localStorage + optional cloud payload). */
export type PredictionWatchItem = {
  id: string;
  marketId: string;
  provider: PredictionProvider;
  question: string;
  marketProbability: number;
  agents61Probability: number | null;
  gap: number | null;
  marketProbAtAdd: number;
  agents61AtAdd: number | null;
  addedAt: string;
  updatedAt: string;
  favorited?: boolean;
};

/** Append-only probability history point for a market. */
export type ProbabilityHistoryPoint = {
  at: string;
  marketProbability: number;
  agents61Probability: number;
  gap: number;
  analysisId?: string;
};

/** User-saved prediction report (history / favorites). */
export type PredictionSave = {
  id: string;
  marketId: string;
  marketSlug: string;
  question: string;
  marketProbability: number;
  agents61Probability: number;
  probabilityGap: number;
  confidence: Confidence;
  engine: StrategyReport['engine'];
  favorited: boolean;
  savedAt: string;
  report: StrategyReport;
};

export function gapOf(agents61: number, market: number): number {
  return Math.round((agents61 - market) * 10) / 10;
}

export function formatGap(gap: number): string {
  const sign = gap > 0 ? '+' : '';
  return `${sign}${gap.toFixed(0)}%`;
}

export function formatVolume(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return '—';
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

export function formatEndDate(iso: string | null): string {
  if (!iso) return 'Open';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'Open';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/** Map legacy `source` onto canonical `provider`. */
export function providerFromSource(source: PredictionMarket['source']): PredictionProvider {
  return source === 'polymarket' || source === 'fallback' ? 'polymarket' : 'polymarket';
}
