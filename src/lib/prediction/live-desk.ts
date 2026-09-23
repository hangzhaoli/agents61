/**
 * Browser ledger for live CLOB fills on /predictions/desk (V2).
 * Not custody — only records what the wallet already signed/posted.
 */

import type { DeskSide } from './paper-desk';

export type LiveFill = {
  id: string;
  marketId: string;
  question: string;
  url: string;
  side: DeskSide;
  amountUsd: number;
  entryMid: number;
  agents61: number;
  gap: number;
  tokenId: string;
  orderId?: string;
  status?: string;
  openedAt: string;
  error?: string;
  mode: 'live';
};

export type LiveBook = {
  version: 1;
  fills: LiveFill[];
  updatedAt: string;
};

const KEY = 'agents61_prediction_live_desk_v1';

export function emptyLiveBook(): LiveBook {
  return { version: 1, fills: [], updatedAt: new Date().toISOString() };
}

export function readLiveBook(): LiveBook {
  if (typeof window === 'undefined') return emptyLiveBook();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyLiveBook();
    const parsed = JSON.parse(raw) as LiveBook;
    if (!parsed.fills) parsed.fills = [];
    return parsed;
  } catch {
    return emptyLiveBook();
  }
}

export function writeLiveBook(book: LiveBook): void {
  book.updatedAt = new Date().toISOString();
  localStorage.setItem(KEY, JSON.stringify(book));
  window.dispatchEvent(new Event('agents61-live-desk'));
}

export function appendLiveFill(fill: LiveFill): LiveBook {
  const next = readLiveBook();
  next.fills.unshift(fill);
  writeLiveBook(next);
  return next;
}
