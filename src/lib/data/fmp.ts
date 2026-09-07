/**
 * FMP is server-side only. Do not render quotes/ratios as live market data
 * unless a Data Display Agreement is in place. Used as optional model input.
 */

export type FmpInternal = {
  symbol: string;
  price: number | null;
  pe: number | null;
  pb: number | null;
  ps: number | null;
  marketCap: number | null;
  fetchedAt: string;
};

export function hasFmpKey(): boolean {
  return Boolean(process.env.FMP_API_KEY?.trim());
}

export async function loadFmpInternal(ticker: string): Promise<FmpInternal | null> {
  const key = process.env.FMP_API_KEY?.trim();
  if (!key) return null;

  const symbol = ticker.trim().toUpperCase();
  const url = `https://financialmodelingprep.com/stable/profile?symbol=${encodeURIComponent(symbol)}&apikey=${encodeURIComponent(key)}`;

  try {
    const res = await fetch(url, { next: { revalidate: 604800 } });
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{
      symbol?: string;
      price?: number;
      mktCap?: number;
      pe?: number;
      priceToBook?: number;
      priceToSales?: number;
    }>;
    const row = Array.isArray(data) ? data[0] : null;
    if (!row) return null;
    return {
      symbol: row.symbol ?? symbol,
      price: typeof row.price === 'number' ? row.price : null,
      pe: typeof row.pe === 'number' ? row.pe : null,
      pb: typeof row.priceToBook === 'number' ? row.priceToBook : null,
      ps: typeof row.priceToSales === 'number' ? row.priceToSales : null,
      marketCap: typeof row.mktCap === 'number' ? row.mktCap : null,
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}
