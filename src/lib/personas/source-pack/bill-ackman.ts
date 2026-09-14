import type { SourcePack } from './types';

/**
 * Deep pack — quality platform + activist catalyst (Ackman / Pershing Square).
 */
export const billAckmanPack: SourcePack = {
  slug: 'bill-ackman',
  status: 'deep',
  title: 'Bill Ackman — quality platform + catalyst unlock',
  summary:
    'Concentrate in simple, predictable, free-cash-flow businesses; when needed, pursue a catalyst that unlocks intrinsic value — with public accountability.',
  screeningChecklist: [
    {
      id: 'simple_predictable',
      label: 'Simple & predictable business',
      howToJudge:
        'Can the economics be explained plainly? Complexity without a clear owner-earnings path fails.',
    },
    {
      id: 'fcf_quality',
      label: 'Free-cash-flow durability',
      howToJudge:
        'Is FCF durable after maintenance needs — not peak-cycle theater?',
    },
    {
      id: 'moat',
      label: 'Platform / franchise quality',
      howToJudge:
        'Pricing power, switching costs, or brand that should still matter in a decade.',
    },
    {
      id: 'catalyst',
      label: 'Catalyst (if activist angle)',
      howToJudge:
        'Is there a concrete unlock (structure, capital return, ops) — or just “someone should fix it”?',
    },
    {
      id: 'leverage',
      label: 'Balance sheet survivable',
      howToJudge:
        'Leverage that forces a bad refinance destroys the platform thesis.',
    },
    {
      id: 'price_vs_quality',
      label: 'Price vs intrinsic unlock',
      howToJudge:
        'Quality alone is not enough if the price already embeds the unlock.',
    },
  ],
  positionRisk: [
    'Activism without a real unlock mechanic',
    'Concentrating into a narrative that is not FCF-backed',
    'Ignoring leverage because the brand is famous',
    'Treating a campaign as a substitute for business quality',
  ],
  exitRules: [
    'Catalyst fails or management integrity breaks',
    'Business quality thesis was wrong',
    'Price fully reflects the unlock and better uses of capital appear (research bar — not a trade ticket)',
    'Not an exit: temporary unpopularity while FCF and unlock path remain intact',
  ],
  cases: [
    {
      year: 2020,
      title: 'COVID hedge / credit protection (public record)',
      lesson:
        'Asymmetric protection can matter as much as the long book when tails are fat — still not a template to copy blindly.',
      source: 'Pershing Square public letters / interviews (2020)',
    },
    {
      year: '2010s',
      title: 'Herbalife campaign (public controversy)',
      lesson:
        'Activist theater is not proof; the method still requires a falsifiable business thesis.',
      source: 'Public activist campaign record',
    },
    {
      year: 'ongoing',
      title: 'Concentrated quality platforms',
      lesson:
        'Few names, deep work, public letters that stake a claim — concentration raises the cost of being wrong.',
      source: 'Pershing Square investor letters (themes)',
    },
  ],
  excerpts: [
    {
      id: 'ba-simple',
      work: 'Pershing Square investor letters',
      locator: 'simple predictable businesses',
      quote:
        'Prefer businesses whose cash economics can be explained simply and predicted without heroic forecasts.',
      tags: ['quality', 'FCF', 'simple', 'platform'],
    },
    {
      id: 'ba-catalyst',
      work: 'Pershing Square method themes',
      locator: 'catalyst unlock',
      quote:
        'A catalyst should unlock intrinsic value already present — not invent a story the cash flows cannot support.',
      tags: ['activist', 'catalyst', 'unlock'],
    },
    {
      id: 'ba-concentrate',
      work: 'Ackman public remarks / letters',
      locator: 'concentration',
      quote:
        'Concentration demands homework and emotional discipline — being “right” about a slogan is not enough.',
      tags: ['concentration', 'homework', 'risk'],
    },
    {
      id: 'ba-emotional',
      work: 'Ackman public remarks',
      locator: 'emotion vs correctness',
      quote:
        'Be emotional about being correct in the analysis — not about the position’s daily mark.',
      tags: ['process', 'discipline', 'psychology'],
    },
    {
      id: 'ba-fcf',
      work: 'Pershing Square letters',
      locator: 'owner cash',
      quote:
        'Free cash flow after necessary reinvestment is the language of platform quality.',
      tags: ['FCF', 'owner_earnings', 'cash'],
    },
  ],
  metricsBound: ['FCF_yield', 'owner_earnings', 'ROE', 'leverage', 'P/E', 'margin_durability', 'revenue_growth'],
  layerHints: { killShotsFirst: true },
  thirteenF: {
    cik: '0001336528',
    lagDisclaimer:
      '13F FACTS ONLY — Pershing Square filings lag (~45 days), omit shorts/derivatives nuance, and are not a follow signal. ILLUSTRATIVE lagged public record — verify on EDGAR.',
    holdingsSample: [
      {
        symbol: 'CMG',
        approxWeightNote: 'often a large disclosed sleeve in recent years',
        note: 'illustrative — verify latest EDGAR 13F',
      },
      {
        symbol: 'HLT',
        approxWeightNote: 'platform / lodging name frequently disclosed',
        note: 'illustrative sample',
      },
      {
        symbol: 'GOOG',
        approxWeightNote: 'large-cap platform sleeve in some recent prints',
        note: 'illustrative — weight changes; verify EDGAR',
      },
    ],
  },
  citedWorks: [
    'Pershing Square Capital Management investor letters (pershingsquareholdings.com / public filings)',
    'SEC 13F — Pershing Square CIK 0001336528',
  ],
};
