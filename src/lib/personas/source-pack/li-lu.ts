import type { SourcePack } from './types';

/**
 * Deep pack — circle of competence + civilization/modernization overlay (Li Lu).
 */
export const liLuPack: SourcePack = {
  slug: 'li-lu',
  status: 'deep',
  title: 'Li Lu — circle of competence, civilization cycle, owner mindset',
  summary:
    'Stay inside a hard circle of competence; understand business nature across modernization cycles; own like a partner, not a ticker tourist.',
  screeningChecklist: [
    {
      id: 'circle',
      label: 'Hard circle of competence',
      howToJudge:
        'Can you explain the business nature without borrowing someone else’s narrative?',
    },
    {
      id: 'business_nature',
      label: 'True nature of the business',
      howToJudge:
        'What is the enduring economic engine — not this year’s story?',
    },
    {
      id: 'civilization_cycle',
      label: 'Modernization / cycle context',
      howToJudge:
        'Where does this firm sit in a longer modernization or capital-cycle arc?',
    },
    {
      id: 'owner_mindset',
      label: 'Owner / partner mindset',
      howToJudge:
        'Would you own the whole firm at this price with illiquidity for years?',
    },
    {
      id: 'leverage',
      label: 'Leverage & survival',
      howToJudge:
        'Can the firm survive a modernization-cycle shock without forced dilution?',
    },
    {
      id: 'price_vs_quality',
      label: 'Price vs long-term value',
      howToJudge:
        'Is the price sane for the business nature — or are you paying for fashion?',
    },
  ],
  positionRisk: [
    'Leaving the circle because China/US narratives are fashionable',
    'Confusing macro civilization talk with ticker-level homework',
    'Ignoring leverage in “inevitable” modernization stories',
    'Trading like a tourist while claiming owner mindset',
  ],
  exitRules: [
    'Circle claim was false — you did not understand the business',
    'Business nature permanently impaired',
    'Better owner opportunity with clearer competence after friction',
    'Not an exit: quote volatility inside an intact long-term thesis',
  ],
  cases: [
    {
      year: '1990s–',
      title: 'Himalaya / Munger partnership themes',
      lesson:
        'Trusted capital allocation relationships reward circle discipline — not tip velocity.',
      source: 'Public profiles of Himalaya Capital / Li Lu–Munger association',
    },
    {
      year: 2019,
      title: 'Civilization, Modernization, Value Investing and China',
      lesson:
        'Value method sits inside longer historical arcs — still requires firm-level appraisal.',
      source: 'Civilization, Modernization, Value Investing and China (Li Lu)',
    },
    {
      year: 'ongoing',
      title: 'Understand before own',
      lesson:
        'Value investing is understanding the true nature of business — labels are not homework.',
      source: 'Li Lu public remarks',
    },
  ],
  excerpts: [
    {
      id: 'll-nature',
      work: 'Li Lu public remarks / book themes',
      locator: 'true nature of business',
      quote:
        'Value investing is about understanding the true nature of business — not collecting valuation slogans.',
      tags: ['business', 'nature', 'value', 'understand'],
    },
    {
      id: 'll-circle',
      work: 'Li Lu / Himalaya method themes',
      locator: 'circle of competence',
      quote:
        'A hard circle is a feature: refusing what you cannot understand protects capital.',
      tags: ['circle', 'competence', 'discipline'],
    },
    {
      id: 'll-civilization',
      work: 'Civilization, Modernization, Value Investing and China',
      locator: 'modernization overlay',
      quote:
        'Place firms in longer modernization arcs — then still do owner-level appraisal.',
      tags: ['civilization', 'cycle', 'modernization', 'china'],
    },
    {
      id: 'll-owner',
      work: 'Li Lu method themes',
      locator: 'owner mindset',
      quote:
        'Think like a partner in the enterprise; ticker tourism is a different game.',
      tags: ['owner', 'partner', 'long-term'],
    },
    {
      id: 'll-patience',
      work: 'Li Lu public remarks',
      locator: 'patience',
      quote:
        'Time is an ally inside competence; outside competence, time is an enemy.',
      tags: ['patience', 'time', 'competence'],
    },
  ],
  metricsBound: ['ROE', 'ROIC', 'leverage', 'P/E', 'P/B', 'owner_earnings', 'margin_durability', 'revenue_growth'],
  layerHints: {},
  citedWorks: [
    'Civilization, Modernization, Value Investing and China (Li Lu)',
    'Himalaya Capital / Li Lu public talks (circle & owner themes)',
  ],
};
