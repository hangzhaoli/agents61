import type { SourcePack } from './types';

/**
 * Deep pack — CANSLIM timing / breakout discipline.
 * Short fair-use themes from How to Make Money in Stocks / IBD CANSLIM canon.
 */
export const williamOneilPack: SourcePack = {
  slug: 'william-oneil',
  status: 'deep',
  title: "William O'Neil — CANSLIM, breakouts, cut losses short",
  summary:
    'Score C-A-N-S-L-I-M with evidence; prefer proper bases and market follow-through; treat ~7–8% invalidation as research discipline — not a trade order.',
  screeningChecklist: [
    {
      id: 'canslim_c',
      label: 'C — Current earnings strength',
      howToJudge:
        'Recent earnings should show acceleration, not deceleration dressed as a base. Missing data = unknown, not pass.',
    },
    {
      id: 'canslim_a',
      label: 'A — Annual earnings growth',
      howToJudge:
        'Multi-year earnings growth should support a growth leader profile. Soft annuals fail this letter.',
    },
    {
      id: 'canslim_n',
      label: 'N — New product / high / catalyst',
      howToJudge:
        'Something new: product, service, high, or management shift that can drive demand — not a stale name.',
    },
    {
      id: 'canslim_s',
      label: 'S — Supply / demand',
      howToJudge:
        'Prefer constructive demand (volume on strength). Heavy supply into weakness fails timing.',
    },
    {
      id: 'canslim_l',
      label: 'L — Leader vs laggard',
      howToJudge:
        'Prefer relative-strength leaders in strong groups. Laggards in leading groups fail.',
    },
    {
      id: 'canslim_i',
      label: 'I — Institutional sponsorship',
      howToJudge:
        'Quality sponsorship accumulating — not frantic late distribution. Unknown if no ownership FACTS.',
    },
    {
      id: 'canslim_m',
      label: 'M — Market direction',
      howToJudge:
        'Individual setups fail under distribution-heavy general markets. Market letter often dominates.',
    },
    {
      id: 'breakout_discipline',
      label: 'Proper base / breakout condition',
      howToJudge:
        'Cup-with-handle / tight bases with volume confirmation beat falling knives. No chart FACTS = unknown.',
    },
    {
      id: 'cut_loss_rule',
      label: 'Cut-loss discipline (~7–8%)',
      howToJudge:
        'State research invalidation near 7–8% from a proper entry concept — discipline reminder, not an order ticket.',
    },
  ],
  positionRisk: [
    'Buying laggards because the story is familiar',
    'Averaging down a broken growth name',
    'Ignoring market distribution days',
    'Treating a weak-volume breakout as a buy point',
  ],
  exitRules: [
    'Research invalidation: ~7–8% from a proper buy-point concept (discipline — not an order)',
    'Earnings deceleration breaks C/A letters',
    'Market letter fails (distribution) while the name is not a true leader',
    'Not an exit: ordinary noise inside a still-valid base with intact CANSLIM letters',
  ],
  cases: [
    {
      year: 1988,
      title: 'How to Make Money in Stocks — CANSLIM canon',
      lesson:
        'Historical study of winners emphasized earnings power + proper bases + market timing — rules over tips.',
      source: 'How to Make Money in Stocks',
    },
    {
      year: 'IBD era',
      title: 'Follow-through days & distribution',
      lesson:
        'General market direction often overrides a pretty individual story. Timing is a letter, not a footnote.',
      source: "Investor's Business Daily CANSLIM canon",
    },
    {
      year: 'ongoing',
      title: 'Cut losses short',
      lesson:
        'Small controlled research invalidations beat large hope-based holdouts — still not a brokerage order on this desk.',
      source: "O'Neil / IBD risk rules (method)",
    },
  ],
  excerpts: [
    {
      id: 'wo-canslim',
      work: 'How to Make Money in Stocks',
      locator: 'CANSLIM framework',
      quote:
        'CANSLIM: Current earnings, Annual earnings, New, Supply/demand, Leader, Institutional sponsorship, Market direction — score letters with evidence.',
      tags: ['CANSLIM', 'timing', 'growth', 'earnings'],
    },
    {
      id: 'wo-earnings',
      work: 'How to Make Money in Stocks',
      locator: 'earnings acceleration',
      quote:
        'Big winners often show accelerating quarterly and strong annual earnings — deceleration is not a buy-point costume.',
      tags: ['earnings', 'acceleration', 'C', 'A', 'revenue_growth'],
    },
    {
      id: 'wo-base',
      work: 'How to Make Money in Stocks',
      locator: 'bases and breakouts',
      quote:
        'Prefer proper bases and breakouts with volume — falling knives are not CANSLIM entries.',
      tags: ['breakout', 'base', 'volume', 'timing', 'chart'],
    },
    {
      id: 'wo-market',
      work: "Investor's Business Daily / O'Neil",
      locator: 'market direction',
      quote:
        'Most stocks follow the general market — distribution-heavy tape can invalidate otherwise pretty setups.',
      tags: ['market', 'M', 'distribution', 'follow-through'],
    },
    {
      id: 'wo-cut',
      work: 'How to Make Money in Stocks',
      locator: 'cut losses short',
      quote:
        'Cut losses short as discipline (classic ~7–8% research invalidation) — averaging down broken growth names is not the method.',
      tags: ['cut loss', 'risk', 'discipline', 'invalidation'],
    },
  ],
  metricsBound: ['revenue_growth', 'PEG', 'P/E', 'ROE', 'margin_durability'],
  layerHints: {},
  citedWorks: [
    'How to Make Money in Stocks (William J. O\'Neil)',
    "Investor's Business Daily CANSLIM educational materials (public canon)",
  ],
};
