/**
 * Prediction watchlist — client localStorage.
 */

import type { PredictionMarket, PredictionWatchItem } from './types';
import { gapOf } from './types';

const STORAGE_KEY = 'agents61_prediction_watchlist';

function uid(): string {
  return `watch-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function isWatchItem(v: unknown): v is PredictionWatchItem {
  if (!v || typeof v !== 'object') return false;
  const o = v as PredictionWatchItem;
  return (
    typeof o.id === 'string' &&
    typeof o.marketId === 'string' &&
    typeof o.question === 'string' &&
    typeof o.addedAt === 'string' &&
    typeof o.provider === 'string'
  );
}

export function readWatchlist(): PredictionWatchItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PredictionWatchItem[];
    return Array.isArray(parsed) ? parsed.filter(isWatchItem) : [];
  } catch {
    return [];
  }
}

export function writeWatchlist(items: PredictionWatchItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('agents61-prediction-watchlist'));
  } catch {
    /* private mode */
  }
}

export function addToWatchlist(
  market: PredictionMarket,
  agents61Probability: number | null = null
): PredictionWatchItem {
  const current = readWatchlist();
  const existing = current.find((w) => w.marketId === market.id);
  const now = new Date().toISOString();
  const gap =
    agents61Probability != null ? gapOf(agents61Probability, market.marketProbability) : null;

  if (existing) {
    const updated: PredictionWatchItem = {
      ...existing,
      question: market.question,
      provider: market.provider,
      marketProbability: market.marketProbability,
      agents61Probability,
      gap,
      updatedAt: now,
    };
    writeWatchlist(current.map((w) => (w.marketId === market.id ? updated : w)));
    return updated;
  }

  const item: PredictionWatchItem = {
    id: uid(),
    marketId: market.id,
    provider: market.provider,
    question: market.question,
    marketProbability: market.marketProbability,
    agents61Probability,
    gap,
    marketProbAtAdd: market.marketProbability,
    agents61AtAdd: agents61Probability,
    addedAt: now,
    updatedAt: now,
    favorited: false,
  };
  writeWatchlist([item, ...current]);
  return item;
}

export function removeFromWatchlist(marketId: string): PredictionWatchItem[] {
  const next = readWatchlist().filter((w) => w.marketId !== marketId);
  writeWatchlist(next);
  return next;
}

export function isOnWatchlist(marketId: string): boolean {
  return readWatchlist().some((w) => w.marketId === marketId);
}

export function updateWatchSnapshots(
  updates: Array<{
    marketId: string;
    marketProbability?: number;
    agents61Probability?: number | null;
    favorited?: boolean;
  }>
): PredictionWatchItem[] {
  const now = new Date().toISOString();
  const next = readWatchlist().map((w) => {
    const u = updates.find((x) => x.marketId === w.marketId);
    if (!u) return w;
    const marketProbability = u.marketProbability ?? w.marketProbability;
    const agents61Probability =
      u.agents61Probability !== undefined ? u.agents61Probability : w.agents61Probability;
    const gap =
      agents61Probability != null ? gapOf(agents61Probability, marketProbability) : null;
    return {
      ...w,
      marketProbability,
      agents61Probability,
      gap,
      favorited: u.favorited ?? w.favorited,
      updatedAt: now,
    };
  });
  writeWatchlist(next);
  return next;
}
