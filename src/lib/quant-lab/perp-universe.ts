/**
 * Paper contract universe. Crypto pairs are USDT perpetuals.
 * US names are equity contracts marked on the stock’s daily bars.
 */

export type ContractKind = 'crypto' | 'equity';

export type ContractSpec = {
  symbol: string;
  kind: ContractKind;
  pair: string;
  label: string;
  binance?: string;
  gecko?: string;
};

export const CRYPTO_CONTRACTS: ContractSpec[] = [
  { symbol: 'BTC', kind: 'crypto', pair: 'BTCUSDT', label: 'Bitcoin', binance: 'BTCUSDT', gecko: 'bitcoin' },
  { symbol: 'ETH', kind: 'crypto', pair: 'ETHUSDT', label: 'Ethereum', binance: 'ETHUSDT', gecko: 'ethereum' },
  { symbol: 'SOL', kind: 'crypto', pair: 'SOLUSDT', label: 'Solana', binance: 'SOLUSDT', gecko: 'solana' },
  { symbol: 'BNB', kind: 'crypto', pair: 'BNBUSDT', label: 'BNB', binance: 'BNBUSDT', gecko: 'binancecoin' },
  { symbol: 'XRP', kind: 'crypto', pair: 'XRPUSDT', label: 'XRP', binance: 'XRPUSDT', gecko: 'ripple' },
  { symbol: 'DOGE', kind: 'crypto', pair: 'DOGEUSDT', label: 'Dogecoin', binance: 'DOGEUSDT', gecko: 'dogecoin' },
  { symbol: 'ADA', kind: 'crypto', pair: 'ADAUSDT', label: 'Cardano', binance: 'ADAUSDT', gecko: 'cardano' },
  { symbol: 'AVAX', kind: 'crypto', pair: 'AVAXUSDT', label: 'Avalanche', binance: 'AVAXUSDT', gecko: 'avalanche-2' },
  { symbol: 'LINK', kind: 'crypto', pair: 'LINKUSDT', label: 'Chainlink', binance: 'LINKUSDT', gecko: 'chainlink' },
  { symbol: 'TON', kind: 'crypto', pair: 'TONUSDT', label: 'Toncoin', binance: 'TONUSDT', gecko: 'the-open-network' },
  { symbol: 'SUI', kind: 'crypto', pair: 'SUIUSDT', label: 'Sui', binance: 'SUIUSDT', gecko: 'sui' },
  { symbol: 'LTC', kind: 'crypto', pair: 'LTCUSDT', label: 'Litecoin', binance: 'LTCUSDT', gecko: 'litecoin' },
];

export const EQUITY_CONTRACTS: ContractSpec[] = [
  { symbol: 'SPY', kind: 'equity', pair: 'SPY', label: 'S&P 500' },
  { symbol: 'QQQ', kind: 'equity', pair: 'QQQ', label: 'Nasdaq 100' },
  { symbol: 'IWM', kind: 'equity', pair: 'IWM', label: 'Russell 2000' },
  { symbol: 'DIA', kind: 'equity', pair: 'DIA', label: 'Dow 30' },
  { symbol: 'AAPL', kind: 'equity', pair: 'AAPL', label: 'Apple' },
  { symbol: 'MSFT', kind: 'equity', pair: 'MSFT', label: 'Microsoft' },
  { symbol: 'NVDA', kind: 'equity', pair: 'NVDA', label: 'NVIDIA' },
  { symbol: 'AMZN', kind: 'equity', pair: 'AMZN', label: 'Amazon' },
  { symbol: 'GOOGL', kind: 'equity', pair: 'GOOGL', label: 'Alphabet' },
  { symbol: 'META', kind: 'equity', pair: 'META', label: 'Meta' },
  { symbol: 'TSLA', kind: 'equity', pair: 'TSLA', label: 'Tesla' },
];

export const CONTRACTS: ContractSpec[] = [...CRYPTO_CONTRACTS, ...EQUITY_CONTRACTS];

const BY_SYMBOL = new Map(CONTRACTS.map((c) => [c.symbol, c]));

export function findContract(raw: string | null | undefined): ContractSpec {
  const symbol = (raw ?? 'BTC').trim().toUpperCase();
  return BY_SYMBOL.get(symbol) ?? CRYPTO_CONTRACTS[0]!;
}
