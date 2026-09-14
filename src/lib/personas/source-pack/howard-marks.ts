import type { SourcePack } from './types';

/**
 * Deep pilot pack — cycle / second-level structure inspired by AlphaGBM/investment-masters
 * Howard Marks profile shape; re-authored for Agents61 research simulation.
 */
export const howardMarksPack: SourcePack = {
  slug: 'howard-marks',
  status: 'deep',
  title: 'Howard Marks — second-level thinking, pendulum, risk ≠ volatility',
  summary:
    'Judge where we are in the cycle, what is already in the price, and whether risk is being compensated — not whether the story sounds clever.',
  screeningChecklist: [
    {
      id: 'second_level',
      label: 'Second-level thinking',
      howToJudge:
        'What does the consensus already believe? What would have to be true for this price to be wrong? First-level “good company” is not enough.',
    },
    {
      id: 'pendulum',
      label: 'Pendulum / cycle position',
      howToJudge:
        'Are credit, risk appetite, and valuation behavior nearer euphoria or fear? Extreme optimism usually means thin risk premia.',
    },
    {
      id: 'risk_definition',
      label: 'Risk ≠ volatility',
      howToJudge:
        'Risk is permanent loss and the chance of a bad outcome given the price paid — not day-to-day wobble.',
    },
    {
      id: 'price_vs_assumption',
      label: 'What’s in the price',
      howToJudge:
        'Map the growth, margin, and multiple assumptions embedded in today’s quote. Aggressive assumptions + crowded consensus = asymmetric downside.',
    },
    {
      id: 'credit_thermometer',
      label: 'Credit / risk appetite check',
      howToJudge:
        'When spreads are tight and weak credits fund easily, risk is often underpriced across the board — equity stories share that air.',
    },
    {
      id: 'asymmetric',
      label: 'Asymmetry of outcomes',
      howToJudge:
        'Prefer situations where being roughly right on the cycle/price pays more than being precisely right on a narrative.',
    },
  ],
  positionRisk: [
    'Buying because the story is good while the price already assumes perfection',
    'Confusing low volatility with low risk near cycle peaks',
    'Ignoring credit-market signals when equity narratives feel “unique”',
    'Averaging into a thesis that required a different cycle regime',
  ],
  exitRules: [
    'The risk premium you needed is gone — price now embeds optimism you cannot defend',
    'Cycle/credit pendulum has swung such that the original second-level edge inverted',
    'Your key assumption about what was “in the price” is falsified by facts',
    'Not an exit: short-term volatility alone, or consensus becoming temporarily louder',
  ],
  cases: [
    {
      year: '2005–2007',
      title: 'Late-cycle complacency (credit boom)',
      lesson:
        'When everyone is paid to stretch for yield, risk is usually mispriced. Second-level work asks what happens when the music stops — not whether the last print looked fine.',
      source: 'Oaktree memos (pre-crisis risk themes)',
    },
    {
      year: 2008,
      title: 'Crisis — fear as opportunity frame',
      lesson:
        'Extreme pessimism can create mispricing; the method is still price vs fundamentals and risk control, not heroic forecasting.',
      source: 'Oaktree / Marks crisis-period memos',
    },
    {
      year: '2010s–2020s',
      title: 'Low-return world & FOMO',
      lesson:
        'Prolonged easy money trains investors to treat risk assets as one-way. Pendulum awareness matters most when it feels unnecessary.',
      source: 'The Most Important Thing; Oaktree memos on risk and cycles',
    },
  ],
  excerpts: [
    {
      id: 'hm-second',
      work: 'The Most Important Thing (Howard Marks)',
      locator: 'second-level thinking theme',
      quote:
        'First-level thinking says “this is a good company.” Second-level asks what is already priced and where consensus may be wrong.',
      tags: ['second-level', 'consensus', 'price'],
    },
    {
      id: 'hm-pendulum',
      work: 'Oaktree memos / The Most Important Thing',
      locator: 'market pendulum',
      quote:
        'Markets swing between extremes of greed and fear; knowing roughly where the pendulum is matters more than precise forecasts.',
      tags: ['pendulum', 'cycle', 'greed', 'fear'],
    },
    {
      id: 'hm-risk',
      work: 'Oaktree memos',
      locator: 'risk definition theme',
      quote:
        'Risk is the possibility of permanent loss and of outcomes worse than expected given the price — volatility is not the same thing.',
      tags: ['risk', 'volatility', 'permanent_loss'],
    },
    {
      id: 'hm-price',
      work: 'Oaktree memos',
      locator: 'price and value',
      quote:
        'No asset is so good that it cannot become a bad investment at the wrong price; no asset is so bad that it cannot become a bargain.',
      tags: ['price', 'valuation', 'margin'],
    },
    {
      id: 'hm-credit',
      work: 'Oaktree memos',
      locator: 'credit market as thermometer',
      quote:
        'Credit markets often reveal risk appetite earlier than equity narratives admit — watch spreads and financing ease.',
      tags: ['credit_spreads', 'cycle', 'thermometer'],
    },
  ],
  metricsBound: ['credit_spreads', 'valuation_vs_assumption', 'P/E', 'P/B', 'leverage', 'revenue_growth'],
  layerHints: {
    consensusPriceContrast: true,
  },
  citedWorks: [
    'The Most Important Thing (Howard Marks)',
    'Oaktree Capital Management public memos (oaktreecapital.com)',
    'Mastering the Market Cycle (Howard Marks)',
  ],
};
