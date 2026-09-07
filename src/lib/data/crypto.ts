/**
 * Public crypto snapshot hook (CoinGecko). Cached.
 * Not a live quote product. Swap this module when a licensed feed exists.
 */

import { unstable_cache } from 'next/cache';
import { COINGECKO_IDS, getCryptoById, type CryptoAsset } from '@/lib/crypto-universe';

export type CryptoSnapshot = {
  symbol: string;
  coingeckoId: string;
  name: string;
  priceUsd: number | null;
  marketCap: number | null;
  volume24h: number | null;
  change24h: number | null;
  change7d: number | null;
  circulatingSupply: number | null;
  source: 'coingecko';
  fetchedAt: string;
  error: string | null;
  asset: CryptoAsset | null;
};

type GeckoRow = {
  id?: string;
  symbol?: string;
  name?: string;
  current_price?: number;
  market_cap?: number;
  total_volume?: number;
  price_change_percentage_24h?: number;
  price_change_percentage_7d_in_currency?: number;
  circulating_supply?: number;
};

const BASE = process.env.COINGECKO_API_URL?.trim() || 'https://api.coingecko.com/api/v3';

function emptySnap(id: string, error: string): CryptoSnapshot {
  const asset = getCryptoById(id);
  return {
    symbol: asset?.symbol ?? id.toUpperCase(),
    coingeckoId: id,
    name: asset?.name ?? id,
    priceUsd: null,
    marketCap: null,
    volume24h: null,
    change24h: null,
    change7d: null,
    circulatingSupply: null,
    source: 'coingecko',
    fetchedAt: new Date().toISOString(),
    error,
    asset: asset ?? null,
  };
}

async function fetchMarkets(ids: string[]): Promise<GeckoRow[]> {
  const url =
    `${BASE}/coins/markets?vs_currency=usd` +
    `&ids=${encodeURIComponent(ids.join(','))}` +
    `&price_change_percentage=7d&precision=2`;
  const headers: Record<string, string> = { Accept: 'application/json' };
  const key = process.env.COINGECKO_API_KEY?.trim();
  if (key) headers['x-cg-demo-api-key'] = key;
  const res = await fetch(url, { headers, next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
  const data = (await res.json()) as GeckoRow[];
  return Array.isArray(data) ? data : [];
}

function rowToSnap(row: GeckoRow): CryptoSnapshot {
  const id = row.id ?? '';
  const asset = getCryptoById(id);
  return {
    symbol: asset?.symbol ?? (row.symbol ?? '').toUpperCase(),
    coingeckoId: id,
    name: row.name ?? asset?.name ?? id,
    priceUsd: typeof row.current_price === 'number' ? row.current_price : null,
    marketCap: typeof row.market_cap === 'number' ? row.market_cap : null,
    volume24h: typeof row.total_volume === 'number' ? row.total_volume : null,
    change24h:
      typeof row.price_change_percentage_24h === 'number' ? row.price_change_percentage_24h / 100 : null,
    change7d:
      typeof row.price_change_percentage_7d_in_currency === 'number'
        ? row.price_change_percentage_7d_in_currency / 100
        : null,
    circulatingSupply: typeof row.circulating_supply === 'number' ? row.circulating_supply : null,
    source: 'coingecko',
    fetchedAt: new Date().toISOString(),
    error: null,
    asset: asset ?? null,
  };
}

export const getCryptoMarkets = unstable_cache(
  async () => {
    try {
      const rows = await fetchMarkets(COINGECKO_IDS);
      return rows.map(rowToSnap);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'CoinGecko unavailable';
      return COINGECKO_IDS.map((id) => emptySnap(id, msg));
    }
  },
  ['crypto-markets-v1'],
  { revalidate: 3600, tags: ['crypto'] }
);

export const getCryptoSnapshot = unstable_cache(
  async (symbolOrId: string) => {
    const needle = symbolOrId.trim().toLowerCase();
    const markets = await getCryptoMarkets();
    const hit = markets.find(
      (m) =>
        m.symbol.toLowerCase() === needle ||
        m.coingeckoId === needle ||
        m.coingeckoId === symbolOrId.trim()
    );
    if (hit) return hit;
    return emptySnap(needle, 'Asset not on the Agents61 crypto board.');
  },
  ['crypto-snap-v1'],
  { revalidate: 3600, tags: ['crypto'] }
);

export function emptyCryptoSnapshot(label = 'CRYPTO'): CryptoSnapshot {
  return emptySnap(label.toLowerCase(), 'No crypto asset in the question — methodology only.');
}
