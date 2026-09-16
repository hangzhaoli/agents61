/**
 * In-memory analysis cache for Prediction Markets MVP.
 * Warm instances keep Top Gaps populated; cold starts still work via Analyze CTA.
 */

import type { StrategyReport } from './types';

const g = globalThis as unknown as { __a61PredCache?: Map<string, StrategyReport> };

function store(): Map<string, StrategyReport> {
  if (!g.__a61PredCache) g.__a61PredCache = new Map();
  return g.__a61PredCache;
}

export function getCachedReport(marketId: string): StrategyReport | null {
  return store().get(marketId) ?? null;
}

export function setCachedReport(report: StrategyReport): void {
  store().set(report.marketId, report);
}

export function listCachedReports(): StrategyReport[] {
  return [...store().values()];
}
