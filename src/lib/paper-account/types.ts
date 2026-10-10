/**
 * Virtual $100k paper desk account — research only, not a brokerage.
 */

export const PAPER_START_CASH = 100_000;
export const PAPER_FEE_BPS = 1; // 1 bp per side

export type PaperFillSide = 'buy' | 'sell';

export type PaperLot = {
  id: string;
  ticker: string;
  shares: number;
  avgCost: number;
  lastPrice: number;
  openedAt: string;
  masterSlug?: string;
  source: 'quant-pipeline' | 'quant-compile' | 'manual';
  stopPrice?: number;
};

export type PaperFill = {
  id: string;
  at: string;
  ticker: string;
  side: PaperFillSide;
  shares: number;
  price: number;
  reason: string;
  masterSlug?: string;
};

export type PaperAccount = {
  version: 1;
  startCash: number;
  cash: number;
  positions: PaperLot[];
  fills: PaperFill[];
  lastMarkedAt: string | null;
  createdAt: string;
};

export type PaperAccountSnapshot = {
  account: PaperAccount;
  equity: number;
  marketValue: number;
  totalReturnPct: number;
  unrealizedPnl: number;
  unrealizedPnlPct: number;
  openCount: number;
};
