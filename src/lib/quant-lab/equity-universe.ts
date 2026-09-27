/**
 * Paper equity / crypto pools for Quant Lab full pipeline.
 * Static liquid universes — not a live scanner product.
 */

export type QuantPoolId =
  | 'liquid-mega'
  | 'growth-liquid'
  | 'etf-core'
  | 'crypto-majors';

export type QuantPool = {
  id: QuantPoolId;
  label: string;
  assetClass: 'equity' | 'crypto';
  description: string;
  tickers: string[];
  benchmark: string;
};

export const QUANT_POOLS: QuantPool[] = [
  {
    id: 'liquid-mega',
    label: 'Liquid mega-cap',
    assetClass: 'equity',
    description: 'Large liquid US names — paper screen only',
    benchmark: 'SPY',
    tickers: [
      'AAPL',
      'MSFT',
      'NVDA',
      'AMZN',
      'GOOGL',
      'META',
      'TSLA',
      'AVGO',
      'BRK-B',
      'JPM',
      'V',
      'UNH',
      'XOM',
      'LLY',
      'MA',
      'COST',
      'HD',
      'PG',
      'ORCL',
      'CRM',
    ],
  },
  {
    id: 'growth-liquid',
    label: 'Growth liquid',
    assetClass: 'equity',
    description: 'Higher-beta growth names for breakout-style rules',
    benchmark: 'QQQ',
    tickers: [
      'NVDA',
      'AMD',
      'AVGO',
      'META',
      'TSLA',
      'AMZN',
      'GOOGL',
      'NFLX',
      'CRM',
      'NOW',
      'PANW',
      'CRWD',
      'SNOW',
      'PLTR',
      'SHOP',
      'UBER',
      'COIN',
      'ARM',
      'SMCI',
      'MU',
    ],
  },
  {
    id: 'etf-core',
    label: 'Core ETFs',
    assetClass: 'equity',
    description: 'Broad index / sector ETFs',
    benchmark: 'SPY',
    tickers: [
      'SPY',
      'QQQ',
      'IWM',
      'DIA',
      'XLK',
      'XLF',
      'XLE',
      'XLV',
      'XBI',
      'SMH',
      'ARKK',
      'EEM',
      'GLD',
      'TLT',
      'HYG',
    ],
  },
  {
    id: 'crypto-majors',
    label: 'Crypto majors',
    assetClass: 'crypto',
    description: 'yfinance USD pairs — price/volume rules only',
    benchmark: 'BTC-USD',
    tickers: ['BTC-USD', 'ETH-USD', 'SOL-USD', 'BNB-USD', 'XRP-USD', 'ADA-USD', 'DOGE-USD', 'AVAX-USD'],
  },
];

export function getQuantPool(id: string): QuantPool | undefined {
  return QUANT_POOLS.find((p) => p.id === id);
}

export function defaultPoolForAsset(assetClass: 'equity' | 'crypto'): QuantPoolId {
  return assetClass === 'crypto' ? 'crypto-majors' : 'liquid-mega';
}
