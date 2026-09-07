import { unstable_cache } from 'next/cache';
import { loadEdgarFacts } from '@/lib/data/edgar';
import { getDeskQuotes } from '@/lib/data/desk-quotes';
import { hasFmpKey, loadFmpInternal, type FmpInternal } from '@/lib/data/fmp';

export type Fundamentals = {
  ticker: string;
  cik: string | null;
  entityName: string | null;
  periodEnd: string | null;
  form: string | null;
  fiscalYear: number | null;
  fiscalPeriod: string | null;
  periodKind: 'annual' | 'interim' | null;
  revenue: number | null;
  revenueYoY: number | null;
  netIncome: number | null;
  epsDiluted: number | null;
  sharesDiluted: number | null;
  equity: number | null;
  assets: number | null;
  liabilities: number | null;
  longTermDebt: number | null;
  roe: number | null;
  debtToEquity: number | null;
  price: number | null;
  marketCap: number | null;
  pe: number | null;
  /** When EPS ≤ 0, P/E is not meaningful — UI shows n/m instead of a blank dash. */
  peNm: boolean;
  pb: number | null;
  ps: number | null;
  source: 'sec-edgar';
  fmpInternalReady: boolean;
  ratiosNote: string | null;
  error: string | null;
};

function computeRatios(input: {
  fmp: FmpInternal | null;
  price: number | null;
  shares: number | null;
  equity: number | null;
  revenue: number | null;
  eps: number | null;
  periodKind: 'annual' | 'interim' | null;
}): {
  pe: number | null;
  peNm: boolean;
  pb: number | null;
  ps: number | null;
  price: number | null;
  marketCap: number | null;
  ratiosNote: string | null;
  fmpInternalReady: boolean;
} {
  const { fmp, price: quotePrice, shares, equity, revenue, eps, periodKind } = input;
  const price = fmp?.price ?? quotePrice;
  const marketCap =
    fmp?.marketCap ?? (price != null && shares != null && shares > 0 ? price * shares : null);

  const peNm = eps != null && eps <= 0;
  const pe =
    fmp?.pe ??
    (!peNm && price != null && eps != null && eps > 0 ? price / eps : null);
  const pb = fmp?.pb ?? (marketCap != null && equity != null && equity > 0 ? marketCap / equity : null);
  const ps =
    fmp?.ps ?? (marketCap != null && revenue != null && revenue > 0 ? marketCap / revenue : null);

  const bits: string[] = [];
  if (fmp) bits.push('P/E, P/B, P/S from cached model-input profile');
  else if (price != null) bits.push('P/B, P/S from cached price × diluted shares vs filings');
  if (periodKind === 'interim' && ps != null && !fmp?.ps) {
    bits.push('P/S uses YTD sales (interim — not annualized)');
  }
  if (peNm) bits.push('P/E n/m while diluted EPS ≤ 0');

  return {
    pe,
    peNm,
    pb,
    ps,
    price: price ?? null,
    marketCap: marketCap ?? null,
    ratiosNote: bits.length ? `${bits.join('. ')}. Not a live quote.` : null,
    fmpInternalReady: Boolean(fmp),
  };
}

async function assemble(ticker: string): Promise<Fundamentals> {
  const symbol = ticker.trim().toUpperCase();
  const [edgar, fmp, quotes] = await Promise.all([
    loadEdgarFacts(symbol),
    hasFmpKey() ? loadFmpInternal(symbol) : Promise.resolve(null as FmpInternal | null),
    getDeskQuotes([symbol]),
  ]);
  const quotePrice = quotes.get(symbol)?.price ?? null;

  if (!edgar.ok) {
    const ratios = computeRatios({
      fmp,
      price: quotePrice,
      shares: null,
      equity: null,
      revenue: null,
      eps: null,
      periodKind: null,
    });
    return {
      ticker: edgar.ticker,
      cik: 'cik' in edgar ? edgar.cik ?? null : null,
      entityName: 'entityName' in edgar ? edgar.entityName ?? null : null,
      periodEnd: null,
      form: null,
      fiscalYear: null,
      fiscalPeriod: null,
      periodKind: null,
      revenue: null,
      revenueYoY: null,
      netIncome: null,
      epsDiluted: null,
      sharesDiluted: null,
      equity: null,
      assets: null,
      liabilities: null,
      longTermDebt: null,
      roe: null,
      debtToEquity: null,
      price: ratios.price,
      marketCap: ratios.marketCap,
      pe: ratios.pe,
      peNm: ratios.peNm,
      pb: ratios.pb,
      ps: ratios.ps,
      source: 'sec-edgar',
      fmpInternalReady: ratios.fmpInternalReady,
      ratiosNote: ratios.ratiosNote,
      error: edgar.error,
    };
  }

  const ratios = computeRatios({
    fmp,
    price: quotePrice,
    shares: edgar.sharesDiluted,
    equity: edgar.equity,
    revenue: edgar.revenue,
    eps: edgar.epsDiluted,
    periodKind: edgar.periodKind,
  });

  return {
    ticker: edgar.ticker,
    cik: edgar.cik,
    entityName: edgar.entityName,
    periodEnd: edgar.periodEnd,
    form: edgar.form,
    fiscalYear: edgar.fiscalYear,
    fiscalPeriod: edgar.fiscalPeriod,
    periodKind: edgar.periodKind,
    revenue: edgar.revenue,
    revenueYoY: edgar.revenueYoY,
    netIncome: edgar.netIncome,
    epsDiluted: edgar.epsDiluted,
    sharesDiluted: edgar.sharesDiluted,
    equity: edgar.equity,
    assets: edgar.assets,
    liabilities: edgar.liabilities,
    longTermDebt: edgar.longTermDebt,
    roe: edgar.roe,
    debtToEquity: edgar.debtToEquity,
    price: ratios.price,
    marketCap: ratios.marketCap,
    pe: ratios.pe,
    peNm: ratios.peNm,
    pb: ratios.pb,
    ps: ratios.ps,
    source: 'sec-edgar',
    fmpInternalReady: ratios.fmpInternalReady,
    ratiosNote: ratios.ratiosNote,
    error: null,
  };
}

export const getFundamentals = unstable_cache(
  async (ticker: string) => assemble(ticker),
  ['fundamentals-v7-ratios'],
  { revalidate: 3600, tags: ['fundamentals'] }
);

/** Methodology-only facts when the user question has no ticker. */
export function emptyFundamentals(label = 'QUESTION'): Fundamentals {
  return {
    ticker: label,
    cik: null,
    entityName: null,
    periodEnd: null,
    form: null,
    fiscalYear: null,
    fiscalPeriod: null,
    periodKind: null,
    revenue: null,
    revenueYoY: null,
    netIncome: null,
    epsDiluted: null,
    sharesDiluted: null,
    equity: null,
    assets: null,
    liabilities: null,
    longTermDebt: null,
    roe: null,
    debtToEquity: null,
    price: null,
    marketCap: null,
    pe: null,
    peNm: false,
    pb: null,
    ps: null,
    source: 'sec-edgar',
    fmpInternalReady: false,
    ratiosNote: null,
    error: 'No ticker in the question — methodology only, no invented numbers.',
  };
}
