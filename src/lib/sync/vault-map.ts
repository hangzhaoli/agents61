import type { VaultStrategy } from '@/lib/quant-lab/types';

type VaultRow = {
  client_id: string;
  payload: VaultStrategy;
  created_at: string;
  updated_at: string;
};

export function vaultRowToItem(row: VaultRow): VaultStrategy {
  const p = row.payload;
  return {
    ...p,
    id: row.client_id,
    createdAt: p.createdAt || row.created_at,
  };
}

export function vaultItemToRow(email: string, item: VaultStrategy): VaultRow & { user_email: string } {
  const now = new Date().toISOString();
  return {
    user_email: email,
    client_id: item.id,
    payload: item,
    created_at: item.createdAt || now,
    updated_at: now,
  };
}
