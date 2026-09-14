/**
 * Source-pack schema for Agents61 persona depth.
 * Inspired by AlphaGBM/investment-masters structure (selection / risk / exit / 13F)
 * — re-expressed for research simulation; not a fork. Packs feed RAG/context blocks,
 * never wholesale into systemPrompt.
 */

export type MetricId =
  | 'P/B'
  | 'P/E'
  | 'PEG'
  | 'ROIC'
  | 'ROE'
  | 'FCF_yield'
  | 'owner_earnings'
  | 'earnings_yield'
  | 'credit_spreads'
  | 'leverage'
  | 'revenue_growth'
  | 'margin_durability'
  | 'valuation_vs_assumption';

export type ScreeningItem = {
  id: string;
  label: string;
  howToJudge: string;
};

export type CaseStudy = {
  year: number | string;
  title: string;
  lesson: string;
  source?: string;
};

export type PackExcerpt = {
  id: string;
  work: string;
  /** Chapter, letter year, memo title, etc. */
  locator: string;
  /** Short fair-use quote or tight paraphrase — never wholesale book text. */
  quote: string;
  tags: string[];
};

export type LayerHints = {
  /** Marks / cycle: contrast consensus (first-level) with second-level thinking. */
  consensusPriceContrast?: boolean;
  /** Debate / Munger: force kill-shots before thesis. */
  killShotsFirst?: boolean;
};

export type ThirteenFFact = {
  symbol: string;
  approxWeightNote?: string;
  note?: string;
};

export type ThirteenFPack = {
  cik?: string;
  /** Always shown: quarterly lag, not a follow signal. */
  lagDisclaimer: string;
  holdingsSample?: ThirteenFFact[];
};

export type SourcePack = {
  slug: string;
  status: 'deep' | 'stub';
  title: string;
  /** One-line methodology summary. */
  summary: string;
  screeningChecklist: ScreeningItem[];
  positionRisk: string[];
  exitRules: string[];
  cases: CaseStudy[];
  excerpts: PackExcerpt[];
  metricsBound: MetricId[];
  layerHints?: LayerHints;
  thirteenF?: ThirteenFPack;
  /** Public works cited by name (not pasted). */
  citedWorks: string[];
  /** Optional note for stub packs. */
  stubNote?: string;
};

export type ChecklistVerdict = 'pass' | 'fail' | 'unknown';

export type ChecklistScoreItem = {
  id: string;
  label: string;
  verdict: ChecklistVerdict;
  notes: string;
};

export type ChecklistScore = {
  slug: string;
  items: ChecklistScoreItem[];
  passCount: number;
  failCount: number;
  unknownCount: number;
};

export type RankedExcerpt = PackExcerpt & {
  score: number;
};
