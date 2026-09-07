import { supabaseAdmin, supabaseConfigured } from '@/lib/supabase/admin';
import { syncUserEmail, syncUserPlan } from '@/lib/sync/auth';
import { vaultItemToRow, vaultRowToItem } from '@/lib/sync/vault-map';
import { vaultLimitForPlan } from '@/lib/tiers';
import type { VaultStrategy } from '@/lib/quant-lab/types';

export async function getVaultForUser(email: string): Promise<VaultStrategy[]> {
  const db = supabaseAdmin();
  if (!db) throw new Error('SUPABASE_UNAVAILABLE');
  const { data, error } = await db
    .from('desk_strategy_vault')
    .select('client_id, payload, created_at, updated_at')
    .eq('user_email', email)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => vaultRowToItem(row));
}

export async function replaceVaultForUser(email: string, items: VaultStrategy[]): Promise<VaultStrategy[]> {
  const db = supabaseAdmin();
  if (!db) throw new Error('SUPABASE_UNAVAILABLE');

  const plan = await syncUserPlan();
  const limit = vaultLimitForPlan(plan);
  if (items.length > limit) {
    throw new Error(`VAULT_LIMIT:${limit}`);
  }

  const rows = items.map((item) => vaultItemToRow(email, item));

  const { error: delErr } = await db.from('desk_strategy_vault').delete().eq('user_email', email);
  if (delErr) throw delErr;

  if (rows.length === 0) return [];

  const { error: insErr } = await db.from('desk_strategy_vault').insert(rows);
  if (insErr) throw insErr;

  return getVaultForUser(email);
}

export async function deleteVaultItemForUser(email: string, clientId: string): Promise<VaultStrategy[]> {
  const db = supabaseAdmin();
  if (!db) throw new Error('SUPABASE_UNAVAILABLE');
  const { error } = await db
    .from('desk_strategy_vault')
    .delete()
    .eq('user_email', email)
    .eq('client_id', clientId);
  if (error) throw error;
  return getVaultForUser(email);
}

export async function requireVaultUser(): Promise<string> {
  const email = await syncUserEmail();
  if (!email) throw new Error('UNAUTHORIZED');
  if (!supabaseConfigured()) throw new Error('SUPABASE_UNAVAILABLE');
  return email;
}

function isVaultStrategy(v: unknown): v is VaultStrategy {
  if (!v || typeof v !== 'object') return false;
  const o = v as VaultStrategy;
  return (
    typeof o.id === 'string' &&
    typeof o.createdAt === 'string' &&
    o.spec != null &&
    typeof o.python === 'string' &&
    o.thorpReview != null
  );
}

export function parseVaultItems(raw: unknown): VaultStrategy[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(isVaultStrategy);
}
