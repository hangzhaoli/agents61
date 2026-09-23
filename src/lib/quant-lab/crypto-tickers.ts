/**
 * Crypto symbols for Quant Lab paper backtests (yfinance).
 * Research only — not live venue routing.
 */

export type QuantAssetClass = 'equity' | 'crypto';

export type CryptoQuantPreset = {
  symbol: string;
  yfinance: string;
  label: string;
};

/** Presets shown on Quant Lab crypto board */
export const CRYPTO_QUANT_PRESETS: CryptoQuantPreset[] = [
  { symbol: 'BTC', yfinance: 'BTC-USD', label: 'Bitcoin' },
  { symbol: 'ETH', yfinance: 'ETH-USD', label: 'Ethereum' },
  { symbol: 'SOL', yfinance: 'SOL-USD', label: 'Solana' },
];

const ALIAS: Record<string, string> = {
  BTC: 'BTC-USD',
  BITCOIN: 'BTC-USD',
  'BTC-USD': 'BTC-USD',
  ETH: 'ETH-USD',
  ETHEREUM: 'ETH-USD',
  'ETH-USD': 'ETH-USD',
  SOL: 'SOL-USD',
  SOLANA: 'SOL-USD',
  'SOL-USD': 'SOL-USD',
};

export function normalizeQuantTicker(raw: string, assetClass?: QuantAssetClass): string {
  const t = raw.trim().toUpperCase().replace(/\//g, '-');
  if (!t) return assetClass === 'crypto' ? 'BTC-USD' : 'SPY';
  if (ALIAS[t]) return ALIAS[t]!;
  if (assetClass === 'crypto' && !t.includes('-')) {
    return `${t}-USD`;
  }
  return t;
}

export function isCryptoTicker(ticker: string): boolean {
  const t = ticker.toUpperCase();
  return (
    Boolean(ALIAS[t]) ||
    /-USD$/.test(t) ||
    CRYPTO_QUANT_PRESETS.some((p) => p.yfinance === t || p.symbol === t)
  );
}
