const UA =
  process.env.EDGAR_USER_AGENT?.trim() ||
  'Agents61/1.0 (https://agents61.com; research@agents61.com)';

const TICKER_MAP_URL = 'https://www.sec.gov/files/company_tickers.json';
const factsUrl = (cik10: string) =>
  `https://data.sec.gov/api/xbrl/companyfacts/CIK${cik10}.json`;

const ALIASES: Record<string, string> = {
  BRKB: 'BRK-B',
  'BRK.B': 'BRK-B',
  'BRK/B': 'BRK-B',
  GOOG: 'GOOGL',
  'BF.B': 'BF-B',
};

type SecTickerRow = { cik_str: number; ticker: string; title: string };

/** Fresh listings sometimes lag the public ticker map — keep a short override list. */
const CIK_OVERRIDES: Record<string, SecTickerRow> = {
  SPCX: {
    cik_str: 1181412,
    ticker: 'SPCX',
    title: 'SPACE EXPLORATION TECHNOLOGIES CORP',
  },
};

type FactPoint = {
  end?: string;
  val?: number;
  form?: string;
  fy?: number;
  fp?: string;
  filed?: string;
  frame?: string;
};

type GaapFact = { units?: Record<string, FactPoint[]> };

type CompanyFacts = {
  cik?: number | string;
  entityName?: string;
  facts?: { 'us-gaap'?: Record<string, GaapFact>; ifrs?: Record<string, GaapFact> };
};

const REVENUE_TAGS = [
  'RevenueFromContractWithCustomerExcludingAssessedTax',
  'Revenues',
  'SalesRevenueNet',
  'RevenueFromContractWithCustomerIncludingAssessedTax',
];

async function secFetch(url: string): Promise<Response> {
  return fetch(url, {
    headers: {
      'User-Agent': UA,
      Accept: 'application/json',
    },
    next: { revalidate: 604800 },
  });
}

function padCik(cik: number | string): string {
  return String(cik).replace(/\D/g, '').padStart(10, '0');
}

export function normalizeTicker(raw: string): string {
  const t = raw.trim().toUpperCase().replace(/\s+/g, '');
  return ALIASES[t] ?? t.replace('.', '-');
}

export async function lookupCik(ticker: string): Promise<SecTickerRow | null> {
  const symbol = normalizeTicker(ticker);
  if (CIK_OVERRIDES[symbol]) return CIK_OVERRIDES[symbol];

  const res = await secFetch(TICKER_MAP_URL);
  if (!res.ok) return CIK_OVERRIDES[symbol] ?? null;
  const data = (await res.json()) as Record<string, SecTickerRow>;
  const rows = Object.values(data);
  return (
    rows.find((r) => r.ticker.toUpperCase() === symbol) ??
    rows.find((r) => r.ticker.toUpperCase().replace('-', '') === symbol.replace('-', '')) ??
    null
  );
}

function allPoints(fact: GaapFact | undefined, preferredUnit?: string): FactPoint[] {
  if (!fact?.units) return [];
  if (preferredUnit && fact.units[preferredUnit]) return fact.units[preferredUnit];
  return Object.values(fact.units).flat();
}

function isQuarterDurationFrame(p: FactPoint): boolean {
  return typeof p.frame === 'string' && /Q[1-4]$/.test(p.frame);
}

function isInstantFrame(p: FactPoint): boolean {
  return typeof p.frame === 'string' && /(Q[1-4]I|CY\d{4}I)$/.test(p.frame);
}

function isAnnualPoint(p: FactPoint): boolean {
  return (
    typeof p.val === 'number' &&
    Boolean(p.end) &&
    !isQuarterDurationFrame(p) &&
    !isInstantFrame(p) &&
    (p.fp === 'FY' || p.form === '10-K' || p.form === '10-K/A')
  );
}

function isQuarterlyForm(p: FactPoint): boolean {
  return p.form === '10-Q' || p.form === '10-Q/A' || Boolean(p.fp && /^Q[1-4]$/.test(p.fp));
}

function annualPoints(points: FactPoint[]): FactPoint[] {
  return points.filter(isAnnualPoint);
}

function compareByEnd(a: FactPoint, b: FactPoint): number {
  const byEnd = (a.end ?? '').localeCompare(b.end ?? '');
  if (byEnd !== 0) return byEnd;
  return Math.abs(a.val ?? 0) - Math.abs(b.val ?? 0);
}

function pickLatest(pool: FactPoint[]): FactPoint | null {
  if (!pool.length) return null;
  return [...pool].sort(compareByEnd)[pool.length - 1];
}

function latestAnnual(points: FactPoint[]): FactPoint | null {
  const annual = annualPoints(points);
  return pickLatest(annual.filter((p) => p.fp === 'FY')) ?? pickLatest(annual);
}

function priorAnnual(points: FactPoint[], currentEnd: string): FactPoint | null {
  return latestAnnual(annualPoints(points).filter((p) => (p.end ?? '') < currentEnd));
}

/** Income / duration: prefer FY, else latest YTD 10-Q (no CY…Qn frame). */
function pickLatestDuration(points: FactPoint[]): FactPoint | null {
  const annual = latestAnnual(points);
  if (annual) return annual;

  const valid = points.filter((p) => typeof p.val === 'number' && p.end && isQuarterlyForm(p));
  const ytd = valid.filter((p) => !isQuarterDurationFrame(p));
  return pickLatest(ytd) ?? pickLatest(valid);
}

/** Balance sheet / instant: prefer FY, else latest instant/10-Q balance date. */
function pickLatestInstant(points: FactPoint[]): FactPoint | null {
  const annual = latestAnnual(points);
  if (annual) return annual;

  const valid = points.filter(
    (p) => typeof p.val === 'number' && p.end && (isInstantFrame(p) || isQuarterlyForm(p))
  );
  const instants = valid.filter((p) => isInstantFrame(p) || !isQuarterDurationFrame(p));
  return pickLatest(instants) ?? pickLatest(valid);
}

function shiftEndOneYear(end: string): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(end);
  if (!m) return null;
  return `${Number(m[1]) - 1}-${m[2]}-${m[3]}`;
}

function priorComparable(points: FactPoint[], current: FactPoint): FactPoint | null {
  if (!current.end) return null;
  if (isAnnualPoint(current)) return priorAnnual(points, current.end);

  const want = shiftEndOneYear(current.end);
  if (!want) return null;
  const wantQuarterFrame = isQuarterDurationFrame(current);
  const pool = points.filter((p) => {
    if (typeof p.val !== 'number' || p.end !== want) return false;
    return isQuarterDurationFrame(p) === wantQuarterFrame;
  });
  return pickLatest(pool);
}

function atEnd(points: FactPoint[], end: string, mode: 'duration' | 'instant'): FactPoint | null {
  const pool = points.filter((p) => typeof p.val === 'number' && p.end === end);
  if (!pool.length) return null;
  if (mode === 'duration') {
    const ytd = pool.filter((p) => !isQuarterDurationFrame(p));
    return pickLatest(ytd) ?? pickLatest(pool);
  }
  const instants = pool.filter((p) => isInstantFrame(p) || !isQuarterDurationFrame(p));
  return pickLatest(instants) ?? pickLatest(pool);
}

function alignedDuration(points: FactPoint[], end: string | null): FactPoint | null {
  if (end) {
    const match = atEnd(points, end, 'duration');
    if (match) return match;
  }
  return pickLatestDuration(points);
}

function alignedInstant(points: FactPoint[], end: string | null): FactPoint | null {
  if (end) {
    const match = atEnd(points, end, 'instant');
    if (match) return match;
  }
  return pickLatestInstant(points);
}

function pickLatestRevenue(gaap: Record<string, GaapFact>): {
  pts: FactPoint[];
  latest: FactPoint | null;
} {
  let pts: FactPoint[] = [];
  let latest: FactPoint | null = null;
  for (const tag of REVENUE_TAGS) {
    const candidate = allPoints(gaap[tag], 'USD');
    const candLatest = pickLatestDuration(candidate);
    if (candLatest && (!latest || (candLatest.end ?? '') > (latest.end ?? ''))) {
      pts = candidate;
      latest = candLatest;
    }
  }
  return { pts, latest };
}

function periodKind(p: FactPoint | null): 'annual' | 'interim' | null {
  if (!p) return null;
  if (isAnnualPoint(p)) return 'annual';
  return 'interim';
}

/** Distinct annual FY points (newest first), one per fiscal year. */
function annualSeries(points: FactPoint[], max = 5): FactPoint[] {
  const annual = points
    .filter((p) => typeof p.val === 'number' && isAnnualPoint(p) && p.fy != null)
    .sort((a, b) => (b.end ?? '').localeCompare(a.end ?? ''));
  const seen = new Set<number>();
  const out: FactPoint[] = [];
  for (const p of annual) {
    const fy = p.fy!;
    if (seen.has(fy)) continue;
    seen.add(fy);
    out.push(p);
    if (out.length >= max) break;
  }
  return out;
}

/** Rough CAGR from oldest→newest of up to 4 annual observations (needs ≥3 years span). */
function approxCagr(seriesNewestFirst: FactPoint[]): number | null {
  if (seriesNewestFirst.length < 3) return null;
  const newest = seriesNewestFirst[0]!;
  const oldest = seriesNewestFirst[Math.min(3, seriesNewestFirst.length - 1)]!;
  if (typeof newest.val !== 'number' || typeof oldest.val !== 'number') return null;
  if (oldest.val <= 0 || newest.val <= 0) return null;
  const years = Math.max(1, (newest.fy ?? 0) - (oldest.fy ?? 0));
  if (years < 2) return null;
  return Math.pow(newest.val / oldest.val, 1 / years) - 1;
}

export async function loadEdgarFacts(ticker: string) {
  const row = await lookupCik(ticker);
  if (!row) {
    return {
      ok: false as const,
      ticker: normalizeTicker(ticker),
      error: 'Not in the SEC ticker map (ADR/ETF or a non-US filing entity).',
    };
  }

  const cik10 = padCik(row.cik_str);
  const res = await secFetch(factsUrl(cik10));
  if (!res.ok) {
    return {
      ok: false as const,
      ticker: row.ticker,
      cik: cik10,
      entityName: row.title,
      error:
        res.status === 404
          ? 'SEC lists this issuer, but there are no us-gaap companyfacts (common for ETFs/trusts). Filing layer unavailable.'
          : `EDGAR companyfacts HTTP ${res.status}`,
    };
  }

  const json = (await res.json()) as CompanyFacts;
  const gaap = json.facts?.['us-gaap'] ?? {};

  const { pts: revenuePts, latest: revenue } = pickLatestRevenue(gaap);
  const periodEnd = revenue?.end ?? pickLatestDuration(allPoints(gaap.NetIncomeLoss, 'USD'))?.end ?? null;
  const revenuePrev = revenue ? priorComparable(revenuePts, revenue) : null;
  const netIncome = alignedDuration(allPoints(gaap.NetIncomeLoss, 'USD'), periodEnd);
  const equity = alignedInstant(allPoints(gaap.StockholdersEquity, 'USD'), periodEnd);
  const assets = alignedInstant(allPoints(gaap.Assets, 'USD'), periodEnd);
  const liabilities = alignedInstant(allPoints(gaap.Liabilities, 'USD'), periodEnd);
  const ltdPts = [
    ...allPoints(gaap.LongTermDebt, 'USD'),
    ...allPoints(gaap.LongTermDebtNoncurrent, 'USD'),
    ...allPoints(gaap.DebtInstrumentCarryingAmount, 'USD'),
  ];
  const ltd = alignedInstant(ltdPts, periodEnd);
  const eps = alignedDuration(allPoints(gaap.EarningsPerShareDiluted, 'USD/shares'), periodEnd);
  const shares = alignedDuration(
    [
      ...allPoints(gaap.WeightedAverageNumberOfDilutedSharesOutstanding, 'shares'),
      ...allPoints(gaap.WeightedAverageNumberOfSharesOutstandingBasic, 'shares'),
    ],
    periodEnd
  );

  const rev = revenue?.val ?? null;
  const prev = revenuePrev?.val ?? null;
  const ni = netIncome?.val ?? null;
  const eq = equity?.val ?? null;
  const debt = ltd?.val ?? null;
  const kind = periodKind(revenue ?? netIncome);

  const epsPts = allPoints(gaap.EarningsPerShareDiluted, 'USD/shares');
  const epsPrev = eps ? priorComparable(epsPts, eps) : null;
  const epsVal = eps?.val ?? null;
  const epsPrevVal = epsPrev?.val ?? null;
  const epsYoY =
    epsVal != null && epsPrevVal != null && epsPrevVal !== 0
      ? (epsVal - epsPrevVal) / Math.abs(epsPrevVal)
      : null;

  const revAnnual = annualSeries(revenuePts, 5);
  const revenueCagrApprox = approxCagr(revAnnual);

  const ocfPts = [
    ...allPoints(gaap.NetCashProvidedByUsedInOperatingActivities, 'USD'),
    ...allPoints(gaap.NetCashProvidedByUsedInOperatingActivitiesContinuingOperations, 'USD'),
  ];
  const ocf = alignedDuration(ocfPts, periodEnd);
  const operatingCashFlow = ocf?.val ?? null;
  const netMargin = ni != null && rev != null && rev !== 0 ? ni / rev : null;

  return {
    ok: true as const,
    ticker: row.ticker,
    cik: cik10,
    entityName: json.entityName ?? row.title,
    periodEnd: revenue?.end ?? netIncome?.end ?? periodEnd,
    form: revenue?.form ?? netIncome?.form ?? null,
    fiscalYear: revenue?.fy ?? netIncome?.fy ?? null,
    fiscalPeriod: revenue?.fp ?? netIncome?.fp ?? null,
    periodKind: kind,
    revenue: rev,
    revenueYoY: rev != null && prev != null && prev !== 0 ? (rev - prev) / Math.abs(prev) : null,
    revenueCagrApprox,
    netIncome: ni,
    netMargin,
    epsDiluted: epsVal,
    epsYoY,
    sharesDiluted: shares?.val ?? null,
    equity: eq,
    assets: assets?.val ?? null,
    liabilities: liabilities?.val ?? null,
    longTermDebt: debt,
    operatingCashFlow,
    roe: ni != null && eq ? ni / eq : null,
    debtToEquity: debt != null && eq ? debt / eq : null,
  };
}
