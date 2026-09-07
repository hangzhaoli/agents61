/**
 * Crypto / on-chain research universe.
 * Research simulation only — never an order ticket or a buy button.
 * Price snapshots come from a public API hook (CoinGecko). Future: on-chain APIs.
 */

export type CryptoAsset = {
  symbol: string;
  coingeckoId: string;
  name: string;
  category: 'l1' | 'l2' | 'defi' | 'infra';
  thesis: string;
  risks: string;
};

export const CRYPTO_ASSETS: CryptoAsset[] = [
  {
    symbol: 'BTC',
    coingeckoId: 'bitcoin',
    name: 'Bitcoin',
    category: 'l1',
    thesis: 'Scarce settlement asset. Research the monetary premium, not a cash-flow multiple.',
    risks: 'Drawdowns, energy narrative, and regulatory classification still dominate.',
  },
  {
    symbol: 'ETH',
    coingeckoId: 'ethereum',
    name: 'Ethereum',
    category: 'l1',
    thesis: 'Smart-contract settlement plus staking yield. Treat fees and issuance as the business.',
    risks: 'L2 fee leakage, restaking complexity, and competing L1 share.',
  },
  {
    symbol: 'SOL',
    coingeckoId: 'solana',
    name: 'Solana',
    category: 'l1',
    thesis: 'High-throughput execution venue. Research usage and outage history, not slogans.',
    risks: 'Client diversity, downtime, and valuation as a growth story.',
  },
  {
    symbol: 'BNB',
    coingeckoId: 'binancecoin',
    name: 'BNB',
    category: 'infra',
    thesis: 'Exchange-adjacent utility token. Research the issuer and regulation first.',
    risks: 'Single-venue concentration and policy risk.',
  },
  {
    symbol: 'XRP',
    coingeckoId: 'ripple',
    name: 'XRP',
    category: 'infra',
    thesis: 'Payments-rail narrative. Legal overhang is part of the research, not a footnote.',
    risks: 'Issuer control, legal residual, and actual corridor usage.',
  },
  {
    symbol: 'LINK',
    coingeckoId: 'chainlink',
    name: 'Chainlink',
    category: 'infra',
    thesis: 'Oracle infrastructure. Research fee capture versus token float.',
    risks: 'Competition and whether usage accrues to holders.',
  },
  {
    symbol: 'AVAX',
    coingeckoId: 'avalanche-2',
    name: 'Avalanche',
    category: 'l1',
    thesis: 'Subnet / L1 competitor. Usage and validator economics over branding.',
    risks: 'Share of mind versus ETH L2s.',
  },
  {
    symbol: 'TON',
    coingeckoId: 'the-open-network',
    name: 'Toncoin',
    category: 'l1',
    thesis: 'Messenger-distribution L1. Research real users versus airdrop theater.',
    risks: 'Distribution concentration and policy in large consumer markets.',
  },
  {
    symbol: 'AAVE',
    coingeckoId: 'aave',
    name: 'Aave',
    category: 'defi',
    thesis: 'On-chain credit market. Research utilization, bad debt, and governance.',
    risks: 'Smart-contract, oracle, and recursive-leverage events.',
  },
  {
    symbol: 'UNI',
    coingeckoId: 'uniswap',
    name: 'Uniswap',
    category: 'defi',
    thesis: 'Spot AMM franchise. Fee switch and governance are the actual debate.',
    risks: 'Aggregator take-rate and whether token holders ever get cash flows.',
  },
  {
    symbol: 'NEAR',
    coingeckoId: 'near',
    name: 'NEAR',
    category: 'l1',
    thesis: 'Sharded L1 / chain-abstraction. Research developers and retained users.',
    risks: 'Crowded L1 tape and incentive-driven TVL.',
  },
  {
    symbol: 'SUI',
    coingeckoId: 'sui',
    name: 'Sui',
    category: 'l1',
    thesis: 'Move-based high-throughput L1. Treat it as a growth classification, not a bond.',
    risks: 'Unlock schedules and whether activity survives incentives.',
  },
];

export const CRYPTO_THEMES = [
  {
    id: 'settlement-premium',
    title: 'Settlement assets still compete with duration cash',
    strength: 7,
    industries: ['BTC', 'ETF wrappers', 'Custody'],
  },
  {
    id: 'l2-fee-split',
    title: 'L2s are taking execution; L1s keep settlement',
    strength: 8,
    industries: ['ETH', 'Rollups', 'DA'],
  },
  {
    id: 'onchain-credit',
    title: 'On-chain credit is a cycle product, not a perpetual yield',
    strength: 5,
    industries: ['Aave', 'Money markets', 'Stables'],
  },
  {
    id: 'exchange-policy',
    title: 'Venue tokens price regulation as much as volume',
    strength: 6,
    industries: ['BNB', 'Listings', 'Compliance'],
  },
];

const BY_SYMBOL = new Map(CRYPTO_ASSETS.map((a) => [a.symbol, a]));
const BY_ID = new Map(CRYPTO_ASSETS.map((a) => [a.coingeckoId, a]));

const ALIASES: Record<string, string> = {
  BITCOIN: 'BTC',
  ETHEREUM: 'ETH',
  ETHER: 'ETH',
  SOLANA: 'SOL',
  RIPPLE: 'XRP',
  CHAINLINK: 'LINK',
  AVALANCHE: 'AVAX',
  TONCOIN: 'TON',
  UNISWAP: 'UNI',
  POLYGON: 'MATIC',
};

export function getCryptoAsset(symbol: string): CryptoAsset | undefined {
  return BY_SYMBOL.get(symbol.trim().toUpperCase());
}

export function getCryptoById(id: string): CryptoAsset | undefined {
  return BY_ID.get(id);
}

export function isCryptoSymbol(raw: string): boolean {
  const t = raw.trim().toUpperCase();
  return BY_SYMBOL.has(t) || Boolean(ALIASES[t]);
}

export function resolveCryptoSymbol(raw: string): string | null {
  const t = raw.trim().toUpperCase();
  if (BY_SYMBOL.has(t)) return t;
  return ALIASES[t] ?? null;
}

export const CRYPTO_SYMBOLS = CRYPTO_ASSETS.map((a) => a.symbol);
export const COINGECKO_IDS = CRYPTO_ASSETS.map((a) => a.coingeckoId);
