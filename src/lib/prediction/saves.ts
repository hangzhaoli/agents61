/**
 * Prediction saves — localStorage with optional cloud sync via /api/sync/prediction.
 */

import { predictionSaveLimitForPlan, type PlanId } from '@/lib/tiers';
import type { PredictionSave, StrategyReport } from './types';

const STORAGE_KEY = 'agents61_prediction_saves';

function uid(): string {
  return `pred-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function readPredictionSaves(): PredictionSave[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PredictionSave[];
    return Array.isArray(parsed) ? parsed.filter(isPredictionSave) : [];
  } catch {
    return [];
  }
}

export function writePredictionSaves(items: PredictionSave[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('agents61-prediction-saves'));
  } catch {
    /* private mode */
  }
}

export function isPredictionSave(v: unknown): v is PredictionSave {
  if (!v || typeof v !== 'object') return false;
  const o = v as PredictionSave;
  return (
    typeof o.id === 'string' &&
    typeof o.marketId === 'string' &&
    typeof o.question === 'string' &&
    typeof o.savedAt === 'string' &&
    typeof o.favorited === 'boolean' &&
    o.report != null &&
    typeof o.report === 'object'
  );
}

export function predictionSaveLimit(plan: PlanId): number {
  return predictionSaveLimitForPlan(plan);
}

export function upsertPredictionSave(
  plan: PlanId,
  input: {
    marketId: string;
    marketSlug: string;
    question: string;
    report: StrategyReport;
    favorited?: boolean;
  }
): { ok: true; items: PredictionSave[]; item: PredictionSave } | { ok: false; error: string } {
  const current = readPredictionSaves();
  const existingIdx = current.findIndex((s) => s.marketId === input.marketId);
  const favorited =
    input.favorited ?? (existingIdx >= 0 ? current[existingIdx]!.favorited : false);

  const item: PredictionSave = {
    id: existingIdx >= 0 ? current[existingIdx]!.id : uid(),
    marketId: input.marketId,
    marketSlug: input.marketSlug,
    question: input.question,
    marketProbability: input.report.marketProbability,
    agents61Probability: input.report.agents61Probability,
    probabilityGap: input.report.probabilityGap,
    confidence: input.report.confidence,
    engine: input.report.engine,
    favorited,
    savedAt: new Date().toISOString(),
    report: input.report,
  };

  let next: PredictionSave[];
  if (existingIdx >= 0) {
    next = [...current];
    next[existingIdx] = item;
  } else {
    if (current.length >= predictionSaveLimit(plan)) {
      return {
        ok: false,
        error: `Saved predictions full (${predictionSaveLimit(plan)} max on ${plan}). Upgrade or unfavorite older ones.`,
      };
    }
    next = [item, ...current];
  }

  writePredictionSaves(next);
  return { ok: true, items: next, item };
}

export function togglePredictionFavorite(marketId: string): PredictionSave[] {
  const next = readPredictionSaves().map((s) =>
    s.marketId === marketId ? { ...s, favorited: !s.favorited } : s
  );
  writePredictionSaves(next);
  return next;
}

export function removePredictionSave(id: string): PredictionSave[] {
  const next = readPredictionSaves().filter((s) => s.id !== id);
  writePredictionSaves(next);
  return next;
}
