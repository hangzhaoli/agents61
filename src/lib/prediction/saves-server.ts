import { supabaseAdmin, supabaseConfigured } from '@/lib/supabase/admin';
import { syncUserEmail, syncUserPlan } from '@/lib/sync/auth';
import { predictionSaveLimitForPlan } from '@/lib/tiers';
import { isPredictionSave } from './saves';
import type { PredictionSave } from './types';

export async function requirePredictionUser(): Promise<string> {
  const email = await syncUserEmail();
  if (!email) throw new Error('UNAUTHORIZED');
  if (!supabaseConfigured()) throw new Error('SUPABASE_UNAVAILABLE');
  return email;
}

export async function getPredictionSavesForUser(email: string): Promise<PredictionSave[]> {
  const db = supabaseAdmin();
  if (!db) throw new Error('SUPABASE_UNAVAILABLE');
  const { data, error } = await db
    .from('desk_prediction_saves')
    .select('client_id, payload, favorited, created_at, updated_at')
    .eq('user_email', email)
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return (data ?? [])
    .map((row) => {
      const payload = row.payload as PredictionSave;
      if (!isPredictionSave(payload)) return null;
      return {
        ...payload,
        id: String(row.client_id),
        favorited: Boolean(row.favorited),
      };
    })
    .filter((x): x is PredictionSave => x != null);
}

export async function replacePredictionSavesForUser(
  email: string,
  items: PredictionSave[]
): Promise<PredictionSave[]> {
  const db = supabaseAdmin();
  if (!db) throw new Error('SUPABASE_UNAVAILABLE');

  const plan = await syncUserPlan();
  const limit = predictionSaveLimitForPlan(plan);
  if (items.length > limit) {
    throw new Error(`PRED_SAVE_LIMIT:${limit}`);
  }

  const rows = items.map((item) => ({
    user_email: email,
    client_id: item.id,
    market_id: item.marketId,
    favorited: item.favorited,
    payload: item,
    updated_at: new Date().toISOString(),
  }));

  const { error: delErr } = await db.from('desk_prediction_saves').delete().eq('user_email', email);
  if (delErr) throw delErr;

  if (rows.length === 0) return [];

  const { error: insErr } = await db.from('desk_prediction_saves').insert(rows);
  if (insErr) throw insErr;

  return getPredictionSavesForUser(email);
}

export async function deletePredictionSaveForUser(
  email: string,
  clientId: string
): Promise<PredictionSave[]> {
  const db = supabaseAdmin();
  if (!db) throw new Error('SUPABASE_UNAVAILABLE');
  const { error } = await db
    .from('desk_prediction_saves')
    .delete()
    .eq('user_email', email)
    .eq('client_id', clientId);
  if (error) throw error;
  return getPredictionSavesForUser(email);
}

export function parsePredictionSaves(raw: unknown): PredictionSave[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(isPredictionSave);
}
