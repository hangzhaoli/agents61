import type { SourcePack } from './types';

/**
 * Deep pack — disruptive innovation / S-curve / TAM. Short fair-use themes from
 * ARK public research notes and interviews; not wholesale model dumps.
 */
export const cathieWoodPack: SourcePack = {
  slug: 'cathie-wood',
  status: 'deep',
  title: 'Cathie Wood — platforms, S-curves, cost-decline disruption',
  summary:
    'Map the name to multi-year innovation platforms; judge adoption S-curves and falling cost curves — not next-quarter EPS theater.',
  screeningChecklist: [
    {
      id: 'platform_fit',
      label: 'Innovation platform fit',
      howToJudge:
        'Does the business sit on AI, robotics, energy storage, multiomics, or fintech rails — or is “disruption” only marketing?',
    },
    {
      id: 's_curve',
      label: 'S-curve / adoption path',
      howToJudge:
        'Is there a credible multi-year adoption curve, or a linear product cycle dressed as exponential?',
    },
    {
      id: 'cost_decline',
      label: 'Cost-decline / Wright’s-law path',
      howToJudge:
        'Do unit costs or enabling tech costs fall on a learning curve that expands TAM — or is the story price-insensitive forever?',
    },
    {
      id: 'tam_expansion',
      label: 'TAM expansion vs priced growth',
      howToJudge:
        'Does the thesis need perpetual 40%+ growth already fully in the multiple, or is consensus still linear while the category may go exponential?',
    },
    {
      id: 'unit_economics_path',
      label: 'Path to unit economics',
      howToJudge:
        'Within a decade, is there a path from tech to cash flow — or only narrative with no economics?',
    },
    {
      id: 'margin_trajectory',
      label: 'Margin / R&D trajectory',
      howToJudge:
        'Gross-margin and R&D intensity should support the platform bet; chronic losses without a cost curve fail.',
    },
    {
      id: 'horizon_discipline',
      label: '5-year horizon (not quarter trade)',
      howToJudge:
        'If the only bull case is next-year multiple expansion, the innovation screen fails.',
    },
  ],
  positionRisk: [
    'Paying perfection for a story stock with no unit-economics path',
    'Confusing a cyclical product cycle with an S-curve platform',
    'Regulatory or adoption timing risk that turns “early” into permanent capital loss',
    'Crowded thematic ownership when the multiple already assumes exponential success',
  ],
  exitRules: [
    'Platform thesis falsified (no adoption, cost curve stalled, or linear business only)',
    'Unit-economics path disappears while valuation still prices disruption',
    'Horizon collapses to short-term multiple games',
    'Not an exit: ordinary quote volatility while the multi-year platform thesis is intact',
  ],
  cases: [
    {
      year: '2010s–2020s',
      title: 'Platform mapping (ARK-style innovation baskets)',
      lesson:
        'Names that fit a clear platform with falling enabling costs differ from “innovation” labels on legacy linear businesses.',
      source: 'ARK Invest public research notes / open models (method themes)',
    },
    {
      year: '2021–2022',
      title: 'Narrative vs cost-curve timing',
      lesson:
        'Being early on a real platform still fails if price embeds perfection before adoption shows up. Horizon discipline ≠ ignoring valuation.',
      source: 'Public ARK / Wood interviews on disruption timing',
    },
    {
      year: 'ongoing',
      title: 'S-curve falsifiers',
      lesson:
        'The kill-shot is often “no path to cash within a decade” or “consensus already prices the exponential.”',
      source: 'ARK methodology themes (public)',
    },
  ],
  excerpts: [
    {
      id: 'cw-platform',
      work: 'ARK Invest research notes (public)',
      locator: 'innovation platforms theme',
      quote:
        'Judge businesses by which multi-year platforms they sit on — AI, robotics, energy storage, multiomics, fintech rails — not by next-quarter EPS alone.',
      tags: ['platform', 'innovation', 'TAM', 'disruption', 'S-curve'],
    },
    {
      id: 'cw-scurve',
      work: 'ARK public research / interviews',
      locator: 'adoption S-curve',
      quote:
        'Disruptive technologies often follow S-curve adoption; linear models can miss exponential phases — and hype can also overshoot the curve.',
      tags: ['S-curve', 'adoption', 'growth', 'revenue_growth'],
    },
    {
      id: 'cw-cost',
      work: 'ARK research themes (Wright’s law / learning curves)',
      locator: 'cost declines expand markets',
      quote:
        'Falling costs on learning curves can expand addressable markets — the thesis needs a cost path, not only a slogan.',
      tags: ['cost decline', 'Wright', 'TAM', 'unit economics'],
    },
    {
      id: 'cw-horizon',
      work: 'Public Cathie Wood interviews',
      locator: 'long-horizon framing',
      quote:
        'Innovation underwriting is a multi-year horizon; twelve-month price targets are a weak primary frame for platform bets.',
      tags: ['horizon', '5-year', 'patience', 'valuation'],
    },
    {
      id: 'cw-falsify',
      work: 'ARK methodology themes',
      locator: 'story vs economics',
      quote:
        'Separate real disruption from narrative with no unit-economics path — story stocks fail the platform screen.',
      tags: ['unit economics', 'narrative', 'falsify', 'margin'],
    },
  ],
  metricsBound: ['revenue_growth', 'margin_durability', 'P/E', 'valuation_vs_assumption', 'ROE'],
  layerHints: {},
  citedWorks: [
    'ARK Invest public research notes and open-source models',
    'Public Cathie Wood interviews on innovation platforms',
  ],
};
