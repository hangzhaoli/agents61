/**
 * Quant Lab types — paper backtest only, not live trading.
 */

export type QuantMasterSlug =
  | 'jesse-livermore'
  | 'william-oneil'
  | 'richard-dennis'
  | 'ed-seykota'
  | 'mark-minervini';

export type StrategySpec = {
  name: string;
  masterSlug: string;
  masterName: string;
  ticker: string;
  timeframe: 'daily' | 'weekly';
  style: string;
  entryRules: string[];
  exitRules: string[];
  filters: string[];
  parameters: Record<string, number | string | boolean>;
  positionSizing: string;
  disclaimer: string;
};

export type ThorpReview = {
  edgeClaim: 'yes' | 'no' | 'unknown';
  kellyFractionBand: string;
  overfittingWarnings: string[];
  significanceNotes: string[];
  ruinNote: string;
  paperTradingOnly: true;
  summary: string;
};

export type GeneratedQuantStrategy = {
  spec: StrategySpec;
  python: string;
  thorpReview: ThorpReview;
  engine: 'deepseek-v4-pro' | 'deepseek-v4-flash' | 'template';
};

export type VaultStrategy = GeneratedQuantStrategy & {
  id: string;
  createdAt: string;
  notes?: string;
};
