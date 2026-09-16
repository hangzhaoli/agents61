/**
 * Prediction Markets MVP types — research simulation only.
 * No trading, wallet, or order routing.
 */

export type Confidence = 'High' | 'Medium' | 'Low';
export type ResolutionRisk = 'Low' | 'Medium' | 'High';

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
  source: 'polymarket' | 'fallback';
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

export type StrategyReport = {
  marketId: string;
  marketQuestion: string;
  marketProbability: number;
  agents61Probability: number;
  probabilityGap: number;
  confidence: Confidence;
  probabilityRange: [number, number];
  whyDisagree: string[];
  bullEvidence: string[];
  bearEvidence: string[];
  keyCatalysts: string[];
  whatCouldMakeUsWrong: string[];
  resolutionRisk: ResolutionRisk;
  sources: { title: string; url: string }[];
  agentNotes: PredictionAgentNote[];
  clerkNote: string;
  analyzedAt: string;
  engine: 'deepseek' | 'template';
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
