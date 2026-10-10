import { getDeskQuotes } from '@/lib/data/desk-quotes';
import { fetchDailyBars } from '@/lib/quant-lab/yahoo-bars';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

/**
 * Latest marks for paper account tickers.
 * Desk quotes first; daily last close as fallback (crypto / blocked quote feeds).
 */
export async function POST(request: Request) {
  let body: { symbols?: string[] } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const symbols = [...new Set((body.symbols ?? []).map((s) => s.trim().toUpperCase()).filter(Boolean))].slice(
    0,
    40
  );
  if (symbols.length === 0) {
    return Response.json({ prices: {}, sources: {}, markedAt: new Date().toISOString() });
  }

  const quotes = await getDeskQuotes(symbols);
  const prices: Record<string, number> = {};
  const sources: Record<string, string> = {};

  for (const sym of symbols) {
    const q = quotes.get(sym);
    if (q?.price != null && q.price > 0) {
      prices[sym] = q.price;
      sources[sym] = q.source;
    }
  }

  const missing = symbols.filter((s) => prices[s] == null);
  await Promise.all(
    missing.map(async (sym) => {
      const { bars, source } = await fetchDailyBars(sym);
      const last = bars[bars.length - 1];
      if (last && last.close > 0) {
        prices[sym] = last.close;
        sources[sym] = source;
      }
    })
  );

  return Response.json({
    prices,
    sources,
    markedAt: new Date().toISOString(),
  });
}
