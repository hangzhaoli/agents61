/**
 * Probability history — append-only client localStorage.
 */

import type { ProbabilityHistoryPoint } from './types';

const STORAGE_KEY = 'agents61_prediction_history';

type HistoryStore = Record<string, ProbabilityHistoryPoint[]>;

function readStore(): HistoryStore {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as HistoryStore;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeStore(store: HistoryStore): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    window.dispatchEvent(new Event('agents61-prediction-history'));
  } catch {
    /* private mode */
  }
}

function isPoint(v: unknown): v is ProbabilityHistoryPoint {
  if (!v || typeof v !== 'object') return false;
  const o = v as ProbabilityHistoryPoint;
  return (
    typeof o.at === 'string' &&
    typeof o.marketProbability === 'number' &&
    typeof o.agents61Probability === 'number' &&
    typeof o.gap === 'number'
  );
}

/** Append a history point — never overwrite past points. */
export function appendPoint(marketId: string, point: ProbabilityHistoryPoint): ProbabilityHistoryPoint[] {
  const store = readStore();
  const existing = (store[marketId] ?? []).filter(isPoint);
  const next = [...existing, point];
  store[marketId] = next;
  writeStore(store);
  return next;
}

export function listHistory(marketId: string): ProbabilityHistoryPoint[] {
  const store = readStore();
  return (store[marketId] ?? []).filter(isPoint);
}
