import type { SourcePack } from './types';

/**
 * Deep pack — tech-stack commercialization / inflection. Short fair-use themes from
 * Coatue-style public remarks on when trends become revenue — not a vendor copy.
 */
export const philippeLaffontPack: SourcePack = {
  slug: 'philippe-laffont',
  status: 'deep',
  title: 'Philippe Laffont — tech-stack inflection, commercialization over hype',
  summary:
    'Ask which layer of the stack already shows revenue and unit-economics inflection — separate commercialized trends from science-project narratives.',
  screeningChecklist: [
    {
      id: 'stack_layer',
      label: 'Stack layer clarity',
      howToJudge:
        'Is the company infrastructure, application, or distribution — and does the layer already monetize, or is it still a slide-deck bet?',
    },
    {
      id: 'inflection_evidence',
      label: 'Commercial inflection evidence',
      howToJudge:
        'Look for revenue acceleration, expanding customers, or margin turns that show the trend has hit an inflection — not only TAM slides.',
    },
    {
      id: 'unit_economics',
      label: 'Unit economics appearing',
      howToJudge:
        'Gross margin, payback, or contribution should be moving toward a real business. Pure burn without a path fails.',
    },
    {
      id: 'competitive_moat_tech',
      label: 'Tech edge durability',
      howToJudge:
        'Is the edge data, distribution, switching costs, or a fleeting feature? Feature-only growth is fragile.',
    },
    {
      id: 'growth_quality',
      label: 'Growth quality vs multiple',
      howToJudge:
        'High growth with weak retention or weak gross margin does not clear a growth screen at any story price.',
    },
    {
      id: 'balance_sheet_ok',
      label: 'Balance sheet survives the ramp',
      howToJudge:
        'Growth stories die on funding walls. Check leverage and cash runway before celebrating inflection.',
    },
    {
      id: 'price_vs_assumption',
      label: 'What’s already priced',
      howToJudge:
        'Map the growth and margin assumptions in the quote. Late-cycle hype + rich multiples = thin second-level edge.',
    },
  ],
  positionRisk: [
    'Confusing a hot category with a commercialized stack winner',
    'Paying for TAM while unit economics never appear',
    'Feature competition that resets every product cycle',
    'Ignoring funding risk during the ramp',
  ],
  exitRules: [
    'Inflection thesis breaks (growth stalls without a new commercial layer)',
    'Unit economics deteriorate while the multiple still prices perfection',
    'Competitive edge collapses to commodity features',
    'Not an exit: a noisy quarter while revenue inflection and unit economics remain intact',
  ],
  cases: [
    {
      year: '2010s',
      title: 'Cloud / mobile commercialization waves',
      lesson:
        'Winners often showed stack clarity and revenue inflection before narratives peaked — homework on commercialization beats theme-chasing.',
      source: 'Public Coatue / Laffont tech investing themes',
    },
    {
      year: '2020–2022',
      title: 'Hype vs inflection',
      lesson:
        'Category excitement without unit-economics turns is a growth trap. Price what is commercialized, not what is fashionable.',
      source: 'Public growth-tech method themes',
    },
    {
      year: 'ongoing',
      title: 'AI stack layering',
      lesson:
        'Separate infrastructure, models, and applications — ask which layer already shows paid demand versus science-project spend.',
      source: 'Public tech-stack inflection themes',
    },
  ],
  excerpts: [
    {
      id: 'plf-stack',
      work: 'Public Coatue / Laffont remarks (method themes)',
      locator: 'tech stack commercialization',
      quote:
        'Trends matter when they commercialize — map which stack layer already shows paid demand, not only which theme is trending.',
      tags: ['stack', 'commercialization', 'inflection', 'tech', 'TAM'],
    },
    {
      id: 'plf-inflect',
      work: 'Public growth-tech method themes',
      locator: 'revenue inflection',
      quote:
        'Look for inflection in revenue and unit economics — late narrative without numbers is not an edge.',
      tags: ['inflection', 'revenue_growth', 'unit economics', 'growth'],
    },
    {
      id: 'plf-edge',
      work: 'Public tech investing themes',
      locator: 'durable tech edge',
      quote:
        'Ask whether the edge is durable (data, distribution, switching costs) or a feature that competitors clone next cycle.',
      tags: ['moat', 'competition', 'tech', 'edge'],
    },
    {
      id: 'plf-price',
      work: 'Public method themes',
      locator: 'what’s in the price',
      quote:
        'Even strong stack stories fail when the quote already assumes perfect adoption and perfect margins.',
      tags: ['valuation', 'price', 'assumption', 'growth'],
    },
    {
      id: 'plf-funding',
      work: 'Public growth-risk themes',
      locator: 'funding the ramp',
      quote:
        'Commercialization ramps still die on balance-sheet and funding walls — growth without survival capital is a trap.',
      tags: ['leverage', 'funding', 'risk', 'balance sheet'],
    },
  ],
  metricsBound: ['revenue_growth', 'margin_durability', 'P/E', 'ROE', 'leverage', 'valuation_vs_assumption'],
  layerHints: {},
  citedWorks: [
    'Public Coatue Capital / Philippe Laffont interviews and conference themes',
    'Tech-stack commercialization method notes (Agents61 re-author)',
  ],
};
