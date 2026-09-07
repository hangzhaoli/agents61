/**
 * Strategy Vault — localStorage with optional cloud sync via /api/sync/vault.
 */

import type { VaultStrategy } from '@/lib/quant-lab/types';
import { vaultLimitForPlan, type PlanId } from '@/lib/tiers';

const STORAGE_KEY = 'agents61_strategy_vault';

function uid(): string {
  return `str-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function readVault(): VaultStrategy[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as VaultStrategy[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeVault(items: VaultStrategy[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('agents61-vault'));
  } catch {
    /* private mode */
  }
}

export function vaultLimit(plan: PlanId): number {
  return vaultLimitForPlan(plan);
}

export function saveToVault(
  plan: PlanId,
  strategy: Omit<VaultStrategy, 'id' | 'createdAt'>
): { ok: true; items: VaultStrategy[] } | { ok: false; error: string } {
  const current = readVault();
  if (current.length >= vaultLimit(plan)) {
    return { ok: false, error: `Strategy Vault full (${vaultLimit(plan)} max on ${plan}). Upgrade for more slots.` };
  }
  const item: VaultStrategy = {
    ...strategy,
    id: uid(),
    createdAt: new Date().toISOString(),
  };
  const items = [item, ...current];
  writeVault(items);
  return { ok: true, items };
}

export function removeFromVault(id: string): VaultStrategy[] {
  const items = readVault().filter((s) => s.id !== id);
  writeVault(items);
  return items;
}
