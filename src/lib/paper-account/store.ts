/**
 * Browser store for the virtual $100k paper account.
 */

import { emptyPaperAccount, normalizeAccount } from './engine';
import type { PaperAccount } from './types';

const STORAGE_KEY = 'agents61_paper_account_v1';
export const PAPER_ACCOUNT_EVENT = 'agents61-paper-account';

export function readPaperAccount(): PaperAccount {
  if (typeof window === 'undefined') return emptyPaperAccount();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyPaperAccount();
    return normalizeAccount(JSON.parse(raw));
  } catch {
    return emptyPaperAccount();
  }
}

export function writePaperAccount(account: PaperAccount): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
    window.dispatchEvent(new Event(PAPER_ACCOUNT_EVENT));
  } catch {
    /* private mode */
  }
}
