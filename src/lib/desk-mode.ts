/**
 * How unlocked seats write.
 * Isolated: nobody reads a peer. Handoff: later pipeline groups may read earlier notes.
 * Same group still cannot see each other. Never a 61² debate. Locked seats stay empty.
 */

export type DeskMode = 'isolated' | 'handoff';

export const DESK_MODES: {
  id: DeskMode;
  title: string;
  hint: string;
}[] = [
  {
    id: 'isolated',
    title: 'Isolated',
    hint: 'Each seat writes alone. The clerk stacks after.',
  },
  {
    id: 'handoff',
    title: 'Division of labor',
    hint: 'Later seats may read earlier pipeline notes. Same group stays silent.',
  },
];

export function parseDeskMode(raw: string | null | undefined): DeskMode {
  return raw === 'handoff' ? 'handoff' : 'isolated';
}

export function deskModeLabel(mode: DeskMode): string {
  return mode === 'handoff' ? 'Division of labor' : 'Isolated';
}
