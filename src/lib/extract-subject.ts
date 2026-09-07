import { isCryptoSymbol, resolveCryptoSymbol } from '@/lib/crypto-universe';
import { isEmergingTicker } from '@/lib/emerging-markets';
import { extractTicker } from '@/lib/extract-ticker';
import { resolveListedTicker, resolvePrivateName } from '@/lib/private-universe';

export type ResearchDomain = 'equity' | 'crypto' | 'emerging' | 'opportunity' | 'private';

export type ExtractedSubject = {
  domain: ResearchDomain | null;
  ticker: string | null;
  cryptoSymbol: string | null;
};

const CRYPTO_ASK =
  /\b(crypto|bitcoin|ethereum|solana|on-?chain|blockchain|defi|token|btc|eth|web3)\b/i;
const EM_ASK =
  /\b(emerging market|emerging markets|\bem\b|india|brazil|latam|southeast asia|adr|china adr)\b/i;

const CORE_CRYPTO = new Set(['BTC', 'ETH', 'SOL']);

export function extractSubject(message: string): ExtractedSubject {
  const words = message.toLowerCase();

  // Graduates (e.g. SpaceX → SPCX) before private desk.
  const listed = resolveListedTicker(message);
  if (listed && /\b(spacex|space\s*x|spcx)\b/i.test(message)) {
    return { domain: 'equity', ticker: listed, cryptoSymbol: null };
  }

  const privateCo = resolvePrivateName(message);
  if (privateCo) {
    return { domain: 'private', ticker: privateCo.slug.toUpperCase(), cryptoSymbol: null };
  }

  if (/\b(private|pre-ipo|secondary mark|stripe|openai|anthropic|databricks|anduril|xai)\b/i.test(message) && !extractTicker(message)) {
    return { domain: 'private', ticker: null, cryptoSymbol: null };
  }

  if (/\bbitcoin\b/.test(words)) {
    return { domain: 'crypto', ticker: 'BTC', cryptoSymbol: 'BTC' };
  }
  if (/\bethereum\b|\bether\b/.test(words)) {
    return { domain: 'crypto', ticker: 'ETH', cryptoSymbol: 'ETH' };
  }
  if (/\bsolana\b/.test(words)) {
    return { domain: 'crypto', ticker: 'SOL', cryptoSymbol: 'SOL' };
  }

  const dollar = message.toUpperCase().match(/\$([A-Z]{2,10})\b/);
  if (dollar) {
    const symbol = resolveCryptoSymbol(dollar[1]);
    if (symbol) return { domain: 'crypto', ticker: symbol, cryptoSymbol: symbol };
  }

  const cryptoContext = CRYPTO_ASK.test(message);
  const tokens = message.toUpperCase().match(/\b([A-Z]{2,10})\b/g) ?? [];
  for (const raw of tokens) {
    const symbol = resolveCryptoSymbol(raw);
    if (!symbol || !isCryptoSymbol(symbol)) continue;
    if (cryptoContext || CORE_CRYPTO.has(symbol) || /^[A-Za-z]{2,5}$/.test(message.trim())) {
      return { domain: 'crypto', ticker: symbol, cryptoSymbol: symbol };
    }
  }

  const ticker = extractTicker(message);
  if (ticker && isEmergingTicker(ticker)) {
    return { domain: 'emerging', ticker, cryptoSymbol: null };
  }
  if (ticker) {
    return { domain: 'equity', ticker, cryptoSymbol: null };
  }
  if (CRYPTO_ASK.test(message)) {
    return { domain: 'crypto', ticker: null, cryptoSymbol: null };
  }
  if (EM_ASK.test(message)) {
    return { domain: 'emerging', ticker: null, cryptoSymbol: null };
  }
  return { domain: null, ticker: null, cryptoSymbol: null };
}
