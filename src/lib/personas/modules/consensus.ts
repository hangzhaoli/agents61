/**
 * Cycle / Marks: inject first-level vs second-level / what’s-in-the-price framing.
 */
export function formatConsensusContrast(enabled: boolean): string {
  if (!enabled) return '';
  return [
    'CONSENSUS vs PRICE (second-level):',
    '- First-level: what does the average bull say (good company / good story)?',
    '- Second-level: what is already in the price? Which assumptions (growth, margins, multiple, credit) are required?',
    '- Where might consensus be wrong — too optimistic or too fearful?',
    '- Risk here means permanent loss given the price paid, not day-to-day volatility.',
    'Do not turn this into a buy/sell ticket or a composite score.',
  ].join('\n');
}
