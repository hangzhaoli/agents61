/**
 * Desk destinations that used to live in a second left column.
 * Clerk stays on the account cluster — it is the same /dashboard default.
 */

export type WorkspaceEntry =
  | 'clerk'
  | 'discover'
  | 'analyze'
  | 'crypto'
  | 'us-quant'
  | 'lineup'
  | 'watchlist'
  | 'private'
  | 'quant';

export const DESK_ENTRIES: {
  id: Exclude<WorkspaceEntry, 'clerk'>;
  title: string;
  subtitle: string;
}[] = [
  { id: 'analyze', title: 'Ask the committee', subtitle: 'Question → committee briefs' },
  { id: 'discover', title: 'Opportunity board', subtitle: 'Trend · cycle · dual track' },
  { id: 'crypto', title: 'Blockchain assets', subtitle: 'On-chain board · paper perps' },
  { id: 'us-quant', title: 'US quant', subtitle: 'Equity paper contracts' },
  { id: 'private', title: 'Private desk', subtitle: 'Anduril · Stripe · OpenAI' },
  { id: 'quant', title: 'Quant Lab', subtitle: 'Master → Python backtest' },
  { id: 'watchlist', title: 'Watchlist', subtitle: 'Alerts by plan tier' },
  { id: 'lineup', title: 'Lineup & screen', subtitle: 'Pick masters, then a market' },
];

export function parseWorkspaceEntry(raw: string | null): WorkspaceEntry {
  if (
    raw === 'analyze' ||
    raw === 'discover' ||
    raw === 'crypto' ||
    raw === 'us-quant' ||
    raw === 'lineup' ||
    raw === 'watchlist' ||
    raw === 'private' ||
    raw === 'quant'
  ) {
    return raw;
  }
  return 'clerk';
}
