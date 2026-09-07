/**
 * Homepage / markets pulse. Prefer cached desk quotes; fall back to fixtures.
 * Not a live quote product — model-input snapshots only.
 */

import { CANDIDATES, TREND_THEMES } from '@/lib/opportunities';
import {
  changeTone,
  formatChangePct,
  formatPrice,
  getDeskQuotes,
  type DeskQuote,
} from '@/lib/data/desk-quotes';

export interface TapeItem {
  kicker: string;
  text: string;
}

export interface PulseCell {
  label: string;
  value: string;
  hint: string;
  seed: string;
  tone: 'up' | 'down' | 'flat';
}

/** Board symbols shown on homepage pulse + tape. */
export const PULSE_SYMBOLS = ['SPCX', 'AAPL', 'NVDA', 'MSFT', 'QQQ', 'BTC-USD'] as const;

export const TAPE_ITEMS: TapeItem[] = [
  { kicker: 'CLERK', text: 'Stacks splits · never averages' },
  { kicker: 'BOARD', text: '61 legends · 16 headliners · isolated' },
  { kicker: 'SPCX', text: 'SpaceX listed Jun 2026 · public desk' },
  { kicker: 'AAPL', text: 'Quality compounder on the desk' },
  { kicker: 'NVDA', text: 'S-curve vs. capex-cycle kill-shot' },
  { kicker: 'MSFT', text: 'Azure attach · quality vs. utility' },
  { kicker: 'QQQ', text: 'Wrapper — not a moat screen' },
  { kicker: 'RED TEAM', text: 'Einhorn · Burry · Icahn still silent until debate' },
  { kicker: 'EDGAR', text: 'Companyfacts cached 7 days' },
  { kicker: 'RULE', text: 'No buy button · not advice' },
  { kicker: 'BTC', text: 'Settlement premium · not a P/E' },
  { kicker: 'BOGLE', text: 'Beat the index in the argument, or switch' },
  ...TREND_THEMES.slice(0, 3).map((t) => ({
    kicker: 'TREND',
    text: t.title,
  })),
  ...CANDIDATES.slice(0, 8).map((c) => ({
    kicker: c.ticker,
    text: `${c.track.toUpperCase()} track · ${c.name}`,
  })),
];

export const PULSE_CELLS: PulseCell[] = [
  { label: 'CLERK', value: 'SPLIT', hint: 'Never averages', seed: 'clerk', tone: 'flat' },
  { label: 'SPCX', value: 'LISTED', hint: 'Nasdaq · Jun 2026', seed: 'SPCX', tone: 'up' },
  { label: 'AAPL', value: 'DESK', hint: 'Quality / buybacks', seed: 'AAPL', tone: 'up' },
  { label: 'NVDA', value: 'SPLIT', hint: 'Theme vs. cycle', seed: 'NVDA', tone: 'up' },
  { label: 'QQQ', value: 'NDX', hint: 'ETF wrapper', seed: 'QQQ', tone: 'flat' },
  { label: 'LEGENDS', value: '61', hint: '16 headliners on', seed: 'legends', tone: 'up' },
  { label: 'BTC', value: 'L1', hint: 'Not a cash-flow', seed: 'BTC', tone: 'down' },
  { label: 'RED', value: 'LIVE', hint: 'After isolation', seed: 'redteam', tone: 'down' },
];

function displaySym(sym: string): string {
  return sym === 'BTC-USD' ? 'BTC' : sym;
}

function tapeFromQuotes(quotes: Map<string, DeskQuote>): TapeItem[] {
  const live: TapeItem[] = [];
  for (const sym of PULSE_SYMBOLS) {
    const q = quotes.get(sym);
    if (!q?.price) continue;
    const label = displaySym(sym);
    live.push({
      kicker: label,
      text: `${formatPrice(q.price)} ${formatChangePct(q.changePct)} · cached`,
    });
  }
  if (live.length === 0) return TAPE_ITEMS;
  return [
    { kicker: 'CLERK', text: 'Stacks splits · never averages' },
    { kicker: 'SPCX', text: 'SpaceX public since Jun 2026 · not private' },
    ...live,
    { kicker: 'BOARD', text: '61 legends · isolated briefs' },
    { kicker: 'EDGAR', text: 'Companyfacts cached 7 days' },
    { kicker: 'RULE', text: 'No buy button · not advice' },
    ...TAPE_ITEMS.filter((t) => !['CLERK', 'BOARD', 'EDGAR', 'RULE', 'SPCX', 'AAPL', 'NVDA', 'MSFT', 'QQQ', 'BTC'].includes(t.kicker)).slice(0, 6),
  ];
}

function cellsFromQuotes(quotes: Map<string, DeskQuote>): PulseCell[] {
  const board: PulseCell[] = [
    {
      label: 'CLERK',
      value: 'SPLIT',
      hint: 'Never averages',
      seed: 'clerk',
      tone: 'flat',
    },
  ];

  for (const sym of ['SPCX', 'AAPL', 'NVDA', 'MSFT', 'QQQ'] as const) {
    const q = quotes.get(sym);
    if (q?.price != null) {
      board.push({
        label: sym,
        value: formatPrice(q.price),
        hint: `${formatChangePct(q.changePct)} · cached`,
        seed: sym,
        tone: changeTone(q.changePct),
      });
    } else {
      const fallback = PULSE_CELLS.find((c) => c.label === sym);
      if (fallback) board.push(fallback);
    }
  }

  board.push(
    { label: 'LEGENDS', value: '61', hint: 'Isolated seats', seed: 'legends', tone: 'up' },
    { label: 'RED', value: 'LIVE', hint: 'After isolation', seed: 'redteam', tone: 'down' }
  );
  return board.slice(0, 8);
}

/** Server-only: build homepage tape + pulse from hourly-cached quotes. */
export async function getLivePulse(): Promise<{ tape: TapeItem[]; cells: PulseCell[] }> {
  try {
    const quotes = await getDeskQuotes([...PULSE_SYMBOLS]);
    return { tape: tapeFromQuotes(quotes), cells: cellsFromQuotes(quotes) };
  } catch {
    return { tape: TAPE_ITEMS, cells: PULSE_CELLS };
  }
}

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** Tiny illustrative path for pulse chips — not a price. */
export function sparkPoints(seed: string, n = 24): number[] {
  let a = hash(seed) | 0;
  const rand = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const pts: number[] = [50];
  for (let i = 1; i < n; i += 1) {
    const prev = pts[i - 1] ?? 50;
    pts.push(Math.max(8, Math.min(92, prev + (rand() - 0.46) * 14)));
  }
  return pts;
}
