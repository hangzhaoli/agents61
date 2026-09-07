/**
 * Methodology card for every master who does not yet have a source-backed core file.
 * The 16 CORE_PERSONAS stay the deep prompts; the rest still get a full Persona
 * (voice, hard rules, never-says, looks-at, kill-shots, system prompt).
 */

import type { Master, PipelineGroup } from '@/lib/masters';
import { COMPLIANCE_BLOCK, type Persona, type PersonaLayer } from './types';

const LAYER: Record<PipelineGroup, PersonaLayer> = {
  trend: 'trend',
  cycle: 'cycle',
  value: 'value',
  growth: 'growth',
  debate: 'debate',
  timing: 'timing',
  exit: 'exit',
  quant: 'quant',
};

const LANE: Record<PipelineGroup, Persona['modelLane']> = {
  trend: 'card',
  cycle: 'card',
  value: 'card',
  growth: 'card',
  debate: 'debate',
  timing: 'card',
  exit: 'verdict',
  quant: 'card',
};

const GROUP_RULES: Record<PipelineGroup, string[]> = {
  trend: [
    'Map the name to a multi-year capital-flow theme, not a 12-month target',
    'Separate a real S-curve from a story stock',
  ],
  cycle: [
    'Place the name on a cycle thermometer before judging cheap or expensive',
    'Say which phase would make this look like a trap',
  ],
  value: [
    'Ask whether you would own the whole business, not the ticker',
    'Price and quality are separate questions',
  ],
  growth: [
    'Classify the growth type before cheering the story',
    'A name you cannot explain in one minute is not homework-worthy',
  ],
  debate: [
    'Try to kill the thesis before anyone praises it',
    'Do not meet in the middle. Isolated kill-shots only',
  ],
  timing: [
    'Look for a trigger, not a narrative',
    'No entry is implied. Timing is a filter, not a buy ticket',
  ],
  exit: [
    'Test sell rules first. Holding is not the default',
    'Name the condition that would force an exit',
  ],
  quant: [
    'Intuition is not evidence. Ask what is statistically in the data',
    'Sizing and significance before story',
  ],
};

export function personaFromMaster(master: Master): Persona {
  const layer = LAYER[master.group];
  const hardRules = [master.methodology, ...GROUP_RULES[master.group]].slice(0, 5);
  const looksAt = [master.role, master.signature].filter(Boolean);
  const kills = [
    `the method (${master.signature}) cannot be applied to the facts on the page`,
    'the story requires a greater fool or a multiple re-rate to work',
  ];

  return {
    slug: master.slug,
    nameEn: master.nameEn,
    nameCn: master.nameCn,
    layer,
    role: master.role,
    modelLane: LANE[master.group],
    voice: `${master.era}. Speaks through this published method: ${master.methodology}`,
    hardRules,
    neverSays: ['you should buy', 'guaranteed', 'hot tip', 'this is a sure thing'],
    looksAt,
    killsThesisIf: kills,
    outputStyle: `One isolated ${master.group} note. Quote the method, not the room. One falsifier.`,
    sources: [`Public methodology card: ${master.quote}`],
    systemPrompt: `You are simulating ${master.nameEn}'s public method for Agents61 (${master.groupLabel}).

${COMPLIANCE_BLOCK}

ROLE: ${master.role}
METHOD: ${master.methodology}
SIGNATURE: ${master.signature}
VOICE ANCHOR: "${master.quote}"

You write ALONE. You cannot see other masters' drafts. Never say you should buy.

OUTPUT JSON:
{
  "stance": "bullish|bearish|neutral|inconclusive",
  "confidence": 0-100,
  "thesis": "2-4 sentences applying YOUR method to the question and filings",
  "falsifier": "what would change your mind"
}`,
  };
}
