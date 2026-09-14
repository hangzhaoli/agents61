import type { SourcePack } from './types';

/**
 * Deep pack — 段永平: buy the company, 本分, understand first.
 * Excerpts: short public Xueqiu/forum-style themes (CN OK) + EN paraphrases.
 * Compliance remains EN+CN via persona COMPLIANCE_BLOCK; pack is CONTEXT only.
 */
export const duanYongpingPack: SourcePack = {
  slug: 'duan-yongping',
  status: 'deep',
  title: 'Duan Yongping — 买股票就是买公司 · 本分 · understand first',
  summary:
    'Buying a stock is buying a piece of a company. If you do not understand the business model, pass. Prefer simple cash franchises and 本分 operators; turnover is a bug.',
  screeningChecklist: [
    {
      id: 'understand_first',
      label: '懂不懂 (understand first)',
      howToJudge:
        'Can the business be explained in one plain sentence? If not → 不懂 → pass. No price is low enough to fix opacity.',
    },
    {
      id: 'buy_company',
      label: '买股票就是买公司',
      howToJudge:
        'Would you happily own the whole firm at this appraisal? If you only want a ticker to flip, the method says stop.',
    },
    {
      id: 'good_business',
      label: '好生意 (business quality)',
      howToJudge:
        'Do customers pay repeatedly? Is there pricing power / brand habit? Are earnings real cash, not story?',
    },
    {
      id: 'benfen',
      label: '本分 (operator integrity)',
      howToJudge:
        'Does management look like a 本分 operator — or empire-building, related-party games, and hype? Culture is part of the underwrite.',
    },
    {
      id: 'margin_of_safety',
      label: '贵不贵 (price vs quality)',
      howToJudge:
        'Great businesses can be too expensive to act. Pass for now ≠ permanent bearishness — it means no margin at this quote.',
    },
    {
      id: 'leverage',
      label: 'Leverage / story dependence',
      howToJudge:
        'Dependence on hype cycles, policy lottery, or heavy leverage fails 本分 and durability tests.',
    },
    {
      id: 'hold_discipline',
      label: 'Sitting is the work',
      howToJudge:
        'If the thesis requires constant trading or themes (题材), it is not this method. Turnover is a bug.',
    },
  ],
  positionRisk: [
    'Touching what you do not understand because it looks cheap or trendy',
    'Paying any price for a familiar brand without a margin',
    'Management that is not 本分 (empire, related parties, story over cash)',
    'Confusing 博弈 / 跟庄 language with company ownership',
  ],
  exitRules: [
    'You discover you never understood the model (懂 was fake)',
    'Business quality or 本分 of people permanently deteriorates',
    'Price no longer offers any margin on a business you still like — sit out; do not invent a short-term game',
    'Not an exit: quote noise while the company and people still clear the tests',
  ],
  cases: [
    {
      year: '2000s–2010s',
      title: 'Consumer franchise pattern (Apple / Moutai-style clarity)',
      lesson:
        'Simple models with brand habit and cash generation fit the method; opaque “themes” do not. Understanding precedes price.',
      source: 'Public Xueqiu / forum remarks (method themes)',
    },
    {
      year: 'public remarks',
      title: '不懂就不碰',
      lesson:
        'Passing on what you cannot explain is discipline, not cowardice. Concentration only after 懂.',
      source: 'Archived public forum remarks (paraphrase)',
    },
    {
      year: 'long-hold practice',
      title: 'Sitting through noise',
      lesson:
        'If you bought a company, ordinary volatility is not a thesis change. Turnover for its own sake is the bug.',
      source: 'Public long-hold commentary themes',
    },
  ],
  excerpts: [
    {
      id: 'dy-buy-company',
      work: 'Public Xueqiu / forum remarks',
      locator: '买股票就是买公司',
      quote:
        '买股票就是买公司 — buying shares is buying a piece of the business; if you would not own the company, do not rent the ticker.',
      tags: ['买公司', 'ownership', 'value', 'hold'],
    },
    {
      id: 'dy-understand',
      work: 'Public Xueqiu / forum remarks',
      locator: '不懂就不碰',
      quote:
        '不懂就不碰 — if you cannot explain the business simply, pass. Opacity is not cured by a lower quote.',
      tags: ['懂', 'circle', 'competence', 'pass'],
    },
    {
      id: 'dy-benfen',
      work: 'Public remarks',
      locator: '本分',
      quote:
        '本分 matters: operators who empire-build, chase stories, or play related-party games fail the people test even if the spreadsheet looks neat.',
      tags: ['本分', 'management', 'culture', 'integrity'],
    },
    {
      id: 'dy-price',
      work: 'Public remarks',
      locator: '好公司也可以贵',
      quote:
        '好公司也可以贵到不做 — a wonderful business at a wonderful price to someone else can still be a pass for you today.',
      tags: ['price', 'margin of safety', '贵', 'patience'],
    },
    {
      id: 'dy-cash',
      work: 'Public remarks',
      locator: '真实现金',
      quote:
        'Prefer earnings that show up as cash and customers who pay repeatedly — story multiples without cash habit are not 好生意.',
      tags: ['cash', 'earnings', '好生意', 'margin_durability'],
    },
  ],
  metricsBound: ['P/E', 'P/B', 'ROE', 'margin_durability', 'owner_earnings', 'leverage', 'revenue_growth'],
  layerHints: {},
  citedWorks: [
    '段永平 publicly archived Xueqiu / forum remarks',
    'Stated philosophy themes: 买股票就是买公司 · 本分 · 不懂就不碰',
  ],
};
