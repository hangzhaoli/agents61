/**
 * Debate / Munger helper: force kill-shots before thesis in the user CONTEXT block
 * (not baked into the long-lived systemPrompt).
 */
export function requireKillShotsFirst(enabled: boolean): string {
  if (!enabled) return '';
  return [
    'KILL-SHOTS FIRST (mandatory section before any bull case):',
    '1. LIST 3 KILL-SHOTS BEFORE THESIS — concrete failure modes (accounting, competition, leverage, incentives, regulation).',
    '2. Only after the three kill-shots, state what would have to be false for the bull case to survive.',
    '3. Do not soft-pedal: if you cannot name three, stance should lean inconclusive or skeptical.',
  ].join('\n');
}
