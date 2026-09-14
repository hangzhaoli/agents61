import type { SourcePack } from './types';

/**
 * Deep pilot pack — methodology structure inspired by AlphaGBM/investment-masters
 * (selection / risk / exit / optional 13F facts). Content re-authored for Agents61;
 * short public-letter themes only; not a vendor copy.
 */
export const warrenBuffettPack: SourcePack = {
  slug: 'warren-buffett',
  status: 'deep',
  title: 'Warren Buffett — moat, owner earnings, decade hold',
  summary:
    'Buy understandable businesses with durable advantages at sensible prices; judge as a full owner; hold for a decade when the thesis holds.',
  screeningChecklist: [
    {
      id: 'circle',
      label: 'Circle of competence',
      howToJudge:
        'Can the business model be explained in one plain paragraph? If the economics need a forecast circus, pass.',
    },
    {
      id: 'moat',
      label: 'Durable competitive advantage',
      howToJudge:
        'Evidence of pricing power, switching costs, brand, cost edge, or network effects that should still exist in 10 years.',
    },
    {
      id: 'owner_earnings',
      label: 'Owner earnings quality',
      howToJudge:
        'Cash generation after maintenance capex matters more than GAAP theater. Look for ROE/ROIC durability and honest reporting.',
    },
    {
      id: 'capital_allocation',
      label: 'Management as capital allocator',
      howToJudge:
        'Buybacks, dividends, M&A, and reinvestment should compound per-share value — not empire-build.',
    },
    {
      id: 'leverage',
      label: 'Leverage restraint',
      howToJudge:
        'Equity leverage that can force permanent capital loss fails the test. Prefer businesses that do not need heroic refinancing.',
    },
    {
      id: 'ten_year',
      label: 'Ten-year hold test',
      howToJudge:
        'If quotes vanished for a decade, would owning the whole firm still look attractive at this price?',
    },
    {
      id: 'price_vs_quality',
      label: 'Price fair for quality',
      howToJudge:
        'Wonderful at fair can clear; mediocre at “cheap” often does not. P/E and P/B are starting points, not the thesis.',
    },
  ],
  positionRisk: [
    'Permanent capital loss from a broken moat or overpayment for mediocrity',
    'Leverage (operating or financial) that turns a temporary problem into an exit at the bottom',
    'Management that allocates capital for size, ego, or short-term EPS optics',
    'Leaving circle of competence because a story is fashionable',
  ],
  exitRules: [
    'Thesis broken: moat eroded, economics permanently impaired, or competence claim was wrong',
    'Better use of capital with clearly higher expected return after tax/friction (rare, high bar)',
    'Management integrity or capital-allocation quality deteriorates',
    'Not an exit: ordinary quote volatility or a missed quarter alone',
  ],
  cases: [
    {
      year: '1960s–1980s',
      title: 'Textile-era lesson (Berkshire manufacturing legacy)',
      lesson:
        'Cheap assets in a structurally weak industry can destroy capital even when “value” looks obvious on paper. Prefer wonderful economics over cigar-butt leftovers when the industry is dying.',
      source: 'Berkshire Hathaway shareholder letters (textile / manufacturing retrospectives)',
    },
    {
      year: 1972,
      title: "See's Candies — quality over cigar butts",
      lesson:
        'Pricing power and brand can justify paying up versus scraping the last nickel of statistical cheapness. Owner returns compound when reinvestment needs are modest.',
      source: 'Berkshire letters / Essays of Warren Buffett (See’s discussions)',
    },
    {
      year: 1988,
      title: 'Coca-Cola — durable brand economics',
      lesson:
        'A wide moat with global distribution and pricing power can be owned for decades when purchased at a sensible owner’s price — still not a blank check on any multiple.',
      source: 'Berkshire Hathaway shareholder letters (late 1980s onward)',
    },
  ],
  excerpts: [
    {
      id: 'wb-forever',
      work: 'Berkshire Hathaway shareholder letters',
      locator: 'recurring theme — holding period',
      quote:
        'Favorite holding period framed as forever when the business remains wonderful — patience is part of the method, not a slogan.',
      tags: ['hold', 'patience', 'compounding', 'ten-year'],
    },
    {
      id: 'wb-moat',
      work: 'Berkshire Hathaway shareholder letters',
      locator: 'recurring theme — economic moats',
      quote:
        'Look for businesses protected by durable advantages; without a moat, competition eventually bids returns toward cost of capital.',
      tags: ['moat', 'competition', 'ROIC', 'quality'],
    },
    {
      id: 'wb-owner',
      work: 'Berkshire Hathaway shareholder letters',
      locator: 'owner earnings theme (1980s letters onward)',
      quote:
        'Owner earnings emphasize cash available to owners after maintaining competitive position — reported earnings can mislead.',
      tags: ['owner_earnings', 'cash', 'accounting'],
    },
    {
      id: 'wb-circle',
      work: 'Berkshire Hathaway shareholder letters / public remarks',
      locator: 'circle of competence',
      quote:
        'Risk comes from not knowing what you are doing — stay inside businesses you can understand.',
      tags: ['circle', 'risk', 'competence'],
    },
    {
      id: 'wb-wonderful',
      work: 'Berkshire Hathaway shareholder letters',
      locator: 'quality vs price evolution',
      quote:
        'Prefer a wonderful company at a fair price over a fair company at a wonderful price.',
      tags: ['price', 'quality', 'valuation'],
    },
  ],
  metricsBound: ['ROIC', 'ROE', 'owner_earnings', 'leverage', 'P/E', 'P/B', 'FCF_yield', 'margin_durability'],
  layerHints: {},
  thirteenF: {
    cik: '0001067983',
    lagDisclaimer:
      '13F FACTS ONLY — Berkshire filings lag by roughly a calendar quarter (~45 days after quarter-end), omit shorts/derivatives nuance, and are not a “follow Buffett” signal. ILLUSTRATIVE lagged public record only — never “Buffett owns X so you should.” Verify on EDGAR before citing as current.',
    holdingsSample: [
      {
        symbol: 'AAPL',
        approxWeightNote: 'often the largest reported common-stock sleeve in recent years',
        note: 'illustrative — verify latest EDGAR 13F-HR',
      },
      {
        symbol: 'AXP',
        approxWeightNote: 'long-held financials franchise',
        note: 'illustrative sample — multi-decade theme',
      },
      {
        symbol: 'KO',
        approxWeightNote: 'multi-decade consumer brand holding',
        note: 'illustrative sample',
      },
      {
        symbol: 'BAC',
        approxWeightNote: 'large financials sleeve in many recent prints',
        note: 'illustrative — size/weight changes; verify EDGAR',
      },
      {
        symbol: 'CVX',
        approxWeightNote: 'energy sleeve appears in many recent filings',
        note: 'illustrative sample — not a commodity call',
      },
      {
        symbol: 'OXY',
        approxWeightNote: 'energy name often disclosed in recent years',
        note: 'illustrative — warrants/common nuance omitted in 13F',
      },
    ],
  },
  citedWorks: [
    'Berkshire Hathaway annual shareholder letters (berkshirehathaway.com/letters)',
    'The Essays of Warren Buffett (Lawrence Cunningham, curated public letters)',
    'SEC 13F — Berkshire Hathaway CIK 0001067983',
  ],
};
