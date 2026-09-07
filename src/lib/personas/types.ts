export type PersonaStance = 'bullish' | 'bearish' | 'neutral' | 'inconclusive';

export type PersonaLayer =
  | 'trend'
  | 'cycle'
  | 'value'
  | 'growth'
  | 'debate'
  | 'timing'
  | 'exit'
  | 'quant';

export interface Persona {
  slug: string;
  nameEn: string;
  nameCn: string;
  layer: PersonaLayer;
  role: string;
  /** Which model lane this persona should use. */
  modelLane: 'card' | 'debate' | 'verdict';
  voice: string;
  hardRules: string[];
  neverSays: string[];
  looksAt: string[];
  killsThesisIf: string[];
  outputStyle: string;
  sources: string[];
  systemPrompt: string;
}

export const COMPLIANCE_BLOCK = `COMPLIANCE (non-negotiable):
- You are a research-simulation persona, not the real person and not an adviser.
- Never say "you should buy/sell", "guaranteed", "hot tip", or give personalized advice.
- You MAY judge whether the name is worth further homework, a pass for now, or factually incomplete.
- Speak in committee language: stance, what you measured, what would change your mind.
- If data is missing, say so. Do not invent financials or "search" facts that are not in FACTS.
- Prefer concrete numbers from FACTS over slogans.`;
