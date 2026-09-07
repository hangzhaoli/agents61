/**
 * Pre-IPO / private-company board. No SEC EDGAR — secondary marks and public filings only.
 * Research simulation. Not a rating, not a live quote, not advice.
 */

export type PrivateCompany = {
  slug: string;
  name: string;
  sector: string;
  tagline: string;
  /** Why this name sits on the private desk */
  whyOnDesk: string;
  committeeAngle: string;
  risksToWatch: string;
  /** Cached secondary / media mark — not a live quote */
  lastValuationUsd: number | null;
  lastValuationLabel: string | null;
  lastRound: string | null;
  revenueRunRateUsd: number | null;
  burnMonthlyUsd: number | null;
  runwayMonths: number | null;
  comparableTickers: string[];
  dataSources: string[];
  relatedMasters: string[];
};

/**
 * Names that graduated from the private desk to a US listing.
 * Keep redirects for SEO; do not treat them as private anymore.
 */
export const LISTED_GRADUATES: Record<string, { ticker: string; listedAt: string; note: string }> = {
  spacex: {
    ticker: 'SPCX',
    listedAt: '2026-06-12',
    note: 'SpaceX Class A listed on Nasdaq as SPCX (IPO priced $135, June 2026). Research on the public equity desk with EDGAR when available — not as a private secondary mark.',
  },
};

export const PRIVATE_COMPANIES: PrivateCompany[] = [
  {
    slug: 'anduril',
    name: 'Anduril',
    sector: 'Defense tech / autonomy',
    tagline: 'Software-defined defense vs. prime contractor timelines',
    whyOnDesk:
      'Anduril is the default post-SpaceX private compounder test on this desk: autonomy, sensors, and government contracting without an issuer 10-K. Secondary marks only — no EDGAR, no live quote.',
    committeeAngle:
      'Wood-style disruption vs. Buffett-style procurement cycles. The debate is whether software margins survive DoD budget politics, or whether primes absorb the category.',
    risksToWatch:
      'Contract concentration, export controls, and valuation marks that re-rate on a single award. Do not treat a media round as an executable price.',
    lastValuationUsd: 28e9,
    lastValuationLabel: '~$28B secondary (2025–26 media range)',
    lastRound: 'Primary / secondary reports',
    revenueRunRateUsd: null,
    burnMonthlyUsd: null,
    runwayMonths: null,
    comparableTickers: ['LMT', 'NOC', 'RTX', 'PL'],
    dataSources: ['Funding disclosures', 'Public contract announcements'],
    relatedMasters: ['cathie-wood', 'stanley-druckenmiller', 'ray-dalio', 'seth-klarman'],
  },
  {
    slug: 'stripe',
    name: 'Stripe',
    sector: 'Fintech / payments infrastructure',
    tagline: 'Take-rate on internet GDP, not a bank balance sheet',
    whyOnDesk:
      'Stripe prices global payment rails. Value seats ask about take-rate durability; growth seats ask whether AI checkout and embedded finance expand TAM or compress margins.',
    committeeAngle:
      'Quality compounder vs. fintech cyclical. The kill-shot is regulatory and interchange pressure — not “payments are growing.”',
    risksToWatch:
      'Private marks are stale fast in rate cycles. Interchange regulation and big-tech wallet competition are structural, not quarterly noise.',
    lastValuationUsd: 65e9,
    lastValuationLabel: '~$65B secondary (2024 reset)',
    lastRound: 'Tender offer',
    revenueRunRateUsd: 16e9,
    burnMonthlyUsd: null,
    runwayMonths: null,
    comparableTickers: ['SQ', 'PYPL', 'V', 'MA'],
    dataSources: ['Secondary market reports', 'Public customer disclosures'],
    relatedMasters: ['warren-buffett', 'peter-lynch', 'charlie-munger'],
  },
  {
    slug: 'openai',
    name: 'OpenAI',
    sector: 'AI foundation models / API',
    tagline: 'Compute moat vs. open-weight commoditization',
    whyOnDesk:
      'OpenAI sits at the intersection of trend (AI capex supercycle) and debate (margin structure). No earnings file — the desk models usage, capex intensity, and competitive substitution.',
    committeeAngle:
      'Wood-style platform vs. Munger-style “too hard.” The question is whether API usage is a toll road or a race to zero.',
    risksToWatch:
      'Capex commitments, model commoditization, and corporate governance. Valuation marks from VC rounds are not investable prices.',
    lastValuationUsd: 157e9,
    lastValuationLabel: '~$157B round (2024–25 range)',
    lastRound: 'Primary / employee liquidity',
    revenueRunRateUsd: 3.4e9,
    burnMonthlyUsd: null,
    runwayMonths: null,
    comparableTickers: ['MSFT', 'GOOGL', 'META', 'NVDA'],
    dataSources: ['Public funding disclosures', 'API pricing pages', 'Partner filings (MSFT)'],
    relatedMasters: ['cathie-wood', 'philip-fisher', 'michael-burry'],
  },
  {
    slug: 'anthropic',
    name: 'Anthropic',
    sector: 'AI safety / enterprise models',
    tagline: 'Enterprise trust premium vs. compute bill',
    whyOnDesk:
      'Anthropic competes on safety and enterprise contracts. The desk separates narrative from unit economics — inference cost per token vs. seat pricing.',
    committeeAngle:
      'Quality-of-revenue test: are enterprises paying for reliability or for brand? Red team asks what happens when models commoditize.',
    risksToWatch:
      'Concentration in cloud partners, inference cost deflation, and open-model substitution.',
    lastValuationUsd: 61.5e9,
    lastValuationLabel: '~$61.5B round (2024)',
    lastRound: 'Series E',
    revenueRunRateUsd: 875e6,
    burnMonthlyUsd: null,
    runwayMonths: null,
    comparableTickers: ['MSFT', 'GOOGL', 'AMZN'],
    dataSources: ['Funding disclosures', 'Enterprise pricing'],
    relatedMasters: ['cathie-wood', 'seth-klarman', 'charlie-munger'],
  },
  {
    slug: 'databricks',
    name: 'Databricks',
    sector: 'Data / AI infrastructure',
    tagline: 'Lakehouse seat expansion vs. cloud vendor bundling',
    whyOnDesk:
      'Databricks is the data-platform compounder private markets still bid. Value asks about net retention; debate asks whether hyperscalers bundle the category away.',
    committeeAngle:
      'SaaS quality vs. cyclical IT spend. The falsifier is seat compression when AI features get bundled into cloud contracts.',
    risksToWatch:
      'Cloud vendor bundling, open-source substitution, and late-cycle IT budget cuts.',
    lastValuationUsd: 43e9,
    lastValuationLabel: '~$43B secondary (2024)',
    lastRound: 'Tender / secondary',
    revenueRunRateUsd: 2.4e9,
    burnMonthlyUsd: null,
    runwayMonths: null,
    comparableTickers: ['SNOW', 'MSFT', 'GOOGL'],
    dataSources: ['Secondary reports', 'Public customer references'],
    relatedMasters: ['philip-fisher', 'peter-lynch', 'david-einhorn'],
  },
  {
    slug: 'xai',
    name: 'xAI',
    sector: 'AI / social distribution',
    tagline: 'Distribution + GPUs — optionality, not filings',
    whyOnDesk:
      'xAI bundles model training with X distribution. Trend seats map the AI capex cycle; debate seats ask whether distribution is monetizable or a distraction.',
    committeeAngle:
      'Platform vs. science project. The desk will not invent user or revenue numbers not on the public record.',
    risksToWatch:
      'Governance, capex intensity, and advertiser cyclicality on the distribution asset.',
    lastValuationUsd: 50e9,
    lastValuationLabel: '~$50B round (2024 range)',
    lastRound: 'Primary',
    revenueRunRateUsd: null,
    burnMonthlyUsd: null,
    runwayMonths: null,
    comparableTickers: ['META', 'GOOGL', 'NVDA'],
    dataSources: ['Funding disclosures', 'Public statements'],
    relatedMasters: ['cathie-wood', 'michael-burry', 'carl-icahn'],
  },
];

export function getPrivateCompany(slug: string): PrivateCompany | undefined {
  return PRIVATE_COMPANIES.find((c) => c.slug === slug.toLowerCase());
}

export function getListedGraduate(slug: string) {
  return LISTED_GRADUATES[slug.toLowerCase()] ?? null;
}

/** SpaceX → SPCX and other private→public aliases for desk routing. */
export function resolveListedTicker(text: string): string | null {
  const q = text.toLowerCase();
  if (/\bspacex\b|\bspace\s*x\b|\bspcx\b/.test(q)) return 'SPCX';
  for (const [slug, g] of Object.entries(LISTED_GRADUATES)) {
    if (q.includes(slug) || q.includes(g.ticker.toLowerCase())) return g.ticker;
  }
  return null;
}

export function resolvePrivateName(text: string): PrivateCompany | undefined {
  // Graduates must not resolve as private.
  if (resolveListedTicker(text)) return undefined;
  const q = text.toLowerCase();
  for (const c of PRIVATE_COMPANIES) {
    if (q.includes(c.slug) || q.includes(c.name.toLowerCase())) return c;
  }
  return undefined;
}

export function privateDeskPrompt(slug: string): string {
  const listed = getListedGraduate(slug);
  if (listed) {
    return `Research ${listed.ticker} as a listed US equity — EDGAR when available. Not a private secondary mark.`;
  }
  const c = getPrivateCompany(slug);
  if (!c) return `Research ${slug} as a private / pre-IPO subject — secondary marks only, no EDGAR.`;
  return `Research ${c.name} as a private company — secondary valuation, usage, and policy. No EDGAR. Not a buy button.`;
}
