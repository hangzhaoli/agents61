/**
 * Browser paper-trading ledger for /predictions/desk (V1).
 * Mid fills, zero fees. Local only — not Polymarket execution.
 */

export type DeskSide = 'YES' | 'NO';

export type DeskPosition = {
  id: string;
  marketId: string;
  question: string;
  url: string;
  side: DeskSide;
  entryMid: number;
  agents61: number;
  gap: number;
  stake: number;
  openedAt: string;
  status: 'open' | 'settled';
  realizedPnL: number | null;
  won?: boolean;
  settledAt?: string;
  finalYesPct?: number;
  markMid?: number;
};

export type DeskBook = {
  version: 1;
  bankrollUsd: number;
  positions: DeskPosition[];
  updatedAt: string;
};

const KEY = 'agents61_prediction_paper_desk_v1';

export function emptyDeskBook(bankroll = 1000): DeskBook {
  return {
    version: 1,
    bankrollUsd: bankroll,
    positions: [],
    updatedAt: new Date().toISOString(),
  };
}

export function readDeskBook(): DeskBook {
  if (typeof window === 'undefined') return emptyDeskBook();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyDeskBook();
    const parsed = JSON.parse(raw) as DeskBook;
    if (!parsed.positions) parsed.positions = [];
    if (!parsed.bankrollUsd) parsed.bankrollUsd = 1000;
    return parsed;
  } catch {
    return emptyDeskBook();
  }
}

export function writeDeskBook(book: DeskBook): void {
  book.updatedAt = new Date().toISOString();
  localStorage.setItem(KEY, JSON.stringify(book));
  window.dispatchEvent(new Event('agents61-paper-desk'));
}

export function paperPnl(side: DeskSide, entryMid: number, stake: number, finalYesPct: number) {
  const won = side === 'YES' ? finalYesPct >= 50 : finalYesPct < 50;
  const entry = entryMid / 100;
  if (side === 'YES') {
    const shares = stake / entry;
    const realized = won ? shares * (1 - entry) : -stake;
    return { won, realizedPnL: Math.round(realized * 100) / 100 };
  }
  const noEntry = 1 - entry;
  const shares = stake / noEntry;
  const realized = won ? shares * entry : -stake;
  return { won, realizedPnL: Math.round(realized * 100) / 100 };
}

export function modelEv(side: DeskSide, entryMid: number, agents61: number, stake: number) {
  const entry = entryMid / 100;
  const pYes = agents61 / 100;
  if (side === 'YES') {
    const winProfit = (stake / entry) * (1 - entry);
    return Math.round((pYes * winProfit + (1 - pYes) * -stake) * 100) / 100;
  }
  const noEntry = 1 - entry;
  const winProfit = (stake / noEntry) * entry;
  const pNo = 1 - pYes;
  return Math.round((pNo * winProfit + (1 - pNo) * -stake) * 100) / 100;
}

export function openDeployed(book: DeskBook) {
  return book.positions.filter((p) => p.status === 'open').reduce((s, p) => s + p.stake, 0);
}

export function realizedTotal(book: DeskBook) {
  return book.positions
    .filter((p) => p.status === 'settled')
    .reduce((s, p) => s + (p.realizedPnL ?? 0), 0);
}
