/**
 * Paper account mutations — equal-weight slots, fee haircut, mark-to-market.
 */

import {
  PAPER_FEE_BPS,
  PAPER_START_CASH,
  type PaperAccount,
  type PaperAccountSnapshot,
  type PaperFill,
  type PaperLot,
} from './types';

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function feeMult(side: 'buy' | 'sell') {
  const bps = PAPER_FEE_BPS / 10_000;
  return side === 'buy' ? 1 + bps : 1 - bps;
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function round4(n: number) {
  return Math.round(n * 10_000) / 10_000;
}

export function emptyPaperAccount(): PaperAccount {
  const now = new Date().toISOString();
  return {
    version: 1,
    startCash: PAPER_START_CASH,
    cash: PAPER_START_CASH,
    positions: [],
    fills: [],
    lastMarkedAt: null,
    createdAt: now,
  };
}

export function normalizeAccount(raw: unknown): PaperAccount {
  if (!raw || typeof raw !== 'object') return emptyPaperAccount();
  const a = raw as Partial<PaperAccount>;
  if (a.version !== 1 || typeof a.cash !== 'number') return emptyPaperAccount();
  return {
    version: 1,
    startCash: typeof a.startCash === 'number' ? a.startCash : PAPER_START_CASH,
    cash: a.cash,
    positions: Array.isArray(a.positions) ? a.positions : [],
    fills: Array.isArray(a.fills) ? a.fills.slice(-200) : [],
    lastMarkedAt: a.lastMarkedAt ?? null,
    createdAt: a.createdAt ?? new Date().toISOString(),
  };
}

export function snapshot(account: PaperAccount): PaperAccountSnapshot {
  const marketValue = account.positions.reduce((s, p) => s + p.shares * p.lastPrice, 0);
  const costBasis = account.positions.reduce((s, p) => s + p.shares * p.avgCost, 0);
  const equity = account.cash + marketValue;
  const unrealizedPnl = marketValue - costBasis;
  return {
    account,
    equity: round2(equity),
    marketValue: round2(marketValue),
    totalReturnPct: round4(((equity / account.startCash - 1) * 100)),
    unrealizedPnl: round2(unrealizedPnl),
    unrealizedPnlPct: costBasis > 0 ? round4((unrealizedPnl / costBasis) * 100) : 0,
    openCount: account.positions.length,
  };
}

export function markAccount(
  account: PaperAccount,
  prices: Record<string, number>
): PaperAccount {
  const positions = account.positions.map((p) => {
    const px = prices[p.ticker.toUpperCase()];
    if (typeof px !== 'number' || !(px > 0)) return p;
    return { ...p, lastPrice: round4(px) };
  });
  return {
    ...account,
    positions,
    lastMarkedAt: new Date().toISOString(),
  };
}

export function buyLot(
  account: PaperAccount,
  opts: {
    ticker: string;
    price: number;
    /** Dollar notional before fee (cash reserved). */
    notional: number;
    reason: string;
    masterSlug?: string;
    source: PaperLot['source'];
    stopPrice?: number;
  }
): { account: PaperAccount; fill: PaperFill | null; error?: string } {
  const ticker = opts.ticker.trim().toUpperCase();
  const price = opts.price;
  if (!(price > 0) || !(opts.notional > 0)) {
    return { account, fill: null, error: 'Invalid price or size' };
  }
  if (account.positions.some((p) => p.ticker === ticker)) {
    return { account, fill: null, error: `Already long ${ticker}` };
  }
  const spend = Math.min(opts.notional, account.cash);
  if (spend < 100) {
    return { account, fill: null, error: 'Not enough cash (need ≥ $100)' };
  }
  const shares = Math.floor(spend / (price * feeMult('buy')));
  if (shares < 1) {
    return { account, fill: null, error: 'Size too small for one share' };
  }
  const cost = round2(shares * price * feeMult('buy'));
  if (cost > account.cash + 0.01) {
    return { account, fill: null, error: 'Insufficient cash after fee' };
  }
  const now = new Date().toISOString();
  const lot: PaperLot = {
    id: uid('lot'),
    ticker,
    shares,
    avgCost: round4(price),
    lastPrice: round4(price),
    openedAt: now,
    masterSlug: opts.masterSlug,
    source: opts.source,
    stopPrice: opts.stopPrice,
  };
  const fill: PaperFill = {
    id: uid('fill'),
    at: now,
    ticker,
    side: 'buy',
    shares,
    price: round4(price),
    reason: opts.reason,
    masterSlug: opts.masterSlug,
  };
  return {
    account: {
      ...account,
      cash: round2(account.cash - cost),
      positions: [...account.positions, lot],
      fills: [...account.fills, fill].slice(-200),
    },
    fill,
  };
}

export function sellLot(
  account: PaperAccount,
  opts: { ticker: string; price: number; reason: string; masterSlug?: string }
): { account: PaperAccount; fill: PaperFill | null; error?: string } {
  const ticker = opts.ticker.trim().toUpperCase();
  const idx = account.positions.findIndex((p) => p.ticker === ticker);
  if (idx < 0) return { account, fill: null, error: `No open lot in ${ticker}` };
  const lot = account.positions[idx]!;
  const price = opts.price > 0 ? opts.price : lot.lastPrice;
  if (!(price > 0)) return { account, fill: null, error: 'Invalid exit price' };
  const proceeds = round2(lot.shares * price * feeMult('sell'));
  const now = new Date().toISOString();
  const fill: PaperFill = {
    id: uid('fill'),
    at: now,
    ticker,
    side: 'sell',
    shares: lot.shares,
    price: round4(price),
    reason: opts.reason,
    masterSlug: opts.masterSlug ?? lot.masterSlug,
  };
  const positions = account.positions.filter((_, i) => i !== idx);
  return {
    account: {
      ...account,
      cash: round2(account.cash + proceeds),
      positions,
      fills: [...account.fills, fill].slice(-200),
    },
    fill,
  };
}

export type StrategyBookIntent = {
  ticker: string;
  action: 'buy' | 'sell' | 'hold';
  price: number;
  reason: string;
  masterSlug?: string;
  stopPrice?: number;
};

/**
 * Apply strategy intents to the live paper book.
 * Buys fill equal cash slots up to maxPositions; sells close matching lots.
 */
export function applyStrategyIntents(
  account: PaperAccount,
  intents: StrategyBookIntent[],
  opts: { maxPositions: number; source: PaperLot['source'] }
): { account: PaperAccount; applied: number; skipped: string[] } {
  let next = account;
  const skipped: string[] = [];
  let applied = 0;

  for (const intent of intents) {
    if (intent.action === 'sell') {
      const r = sellLot(next, {
        ticker: intent.ticker,
        price: intent.price,
        reason: intent.reason,
        masterSlug: intent.masterSlug,
      });
      if (r.error) {
        skipped.push(`${intent.ticker}: ${r.error}`);
        continue;
      }
      next = r.account;
      applied += 1;
    }
  }

  const buys = intents.filter((i) => i.action === 'buy');
  const slotsLeft = Math.max(0, opts.maxPositions - next.positions.length);
  const toOpen = buys.filter((b) => !next.positions.some((p) => p.ticker === b.ticker.toUpperCase()));
  const take = toOpen.slice(0, slotsLeft);
  if (take.length === 0 && buys.length > 0) {
    for (const b of buys) skipped.push(`${b.ticker}: no free slot or already held`);
  }

  for (let i = 0; i < take.length; i++) {
    const intent = take[i]!;
    const remainingSlots = take.length - i;
    const notional = next.cash / remainingSlots;
    const r = buyLot(next, {
      ticker: intent.ticker,
      price: intent.price,
      notional,
      reason: intent.reason,
      masterSlug: intent.masterSlug,
      source: opts.source,
      stopPrice: intent.stopPrice,
    });
    if (r.error) {
      skipped.push(`${intent.ticker}: ${r.error}`);
      continue;
    }
    next = r.account;
    applied += 1;
  }

  return { account: next, applied, skipped };
}

export function resetPaperAccount(): PaperAccount {
  return emptyPaperAccount();
}
