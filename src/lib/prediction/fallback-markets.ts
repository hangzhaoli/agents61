/**
 * Curated Polymarket-style markets when Gamma API is unreachable.
 * Probabilities/volumes are illustrative snapshots for the research UI — not live quotes.
 */

import type { PredictionMarket } from './types';
import { formatEndDate, formatVolume } from './types';

function m(partial: Omit<PredictionMarket, 'volumeLabel' | 'endDateLabel' | 'source' | 'url'> & { url?: string }): PredictionMarket {
  return {
    ...partial,
    source: 'fallback',
    url: partial.url ?? `https://polymarket.com/event/${partial.slug}`,
    volumeLabel: formatVolume(partial.volumeUsd),
    endDateLabel: formatEndDate(partial.endDate),
  };
}

export const FALLBACK_MARKETS: PredictionMarket[] = [
  m({
    id: 'fallback-fed-cut',
    slug: 'fed-rate-cut-next-meeting',
    question: 'Will the Fed cut rates at the next FOMC meeting?',
    marketProbability: 32,
    volumeUsd: 48_200_000,
    endDate: '2026-11-15T00:00:00Z',
    description: 'Resolves YES if the Federal Reserve lowers the target federal funds rate at the next scheduled FOMC meeting.',
    category: 'macro',
  }),
  m({
    id: 'fallback-btc-150k',
    slug: 'bitcoin-above-150k-2026',
    question: 'Will Bitcoin trade above $150,000 before 2027?',
    marketProbability: 41,
    volumeUsd: 92_500_000,
    endDate: '2026-12-31T23:59:00Z',
    description: 'Resolves YES if any major exchange prints BTC/USD at or above 150,000 before 2027-01-01 UTC.',
    category: 'crypto',
  }),
  m({
    id: 'fallback-us-election',
    slug: 'us-house-majority-2026',
    question: 'Will Republicans hold the US House after the 2026 midterms?',
    marketProbability: 54,
    volumeUsd: 71_000_000,
    endDate: '2026-11-04T00:00:00Z',
    description: 'Resolves to the party that controls the House after midterm certification.',
    category: 'politics',
  }),
  m({
    id: 'fallback-ai-ipo',
    slug: 'openai-ipo-2026',
    question: 'Will OpenAI file for an IPO in 2026?',
    marketProbability: 18,
    volumeUsd: 22_400_000,
    endDate: '2026-12-31T23:59:00Z',
    description: 'Resolves YES on a public IPO registration statement (e.g. S-1) attributed to OpenAI in calendar 2026.',
    category: 'tech',
  }),
  m({
    id: 'fallback-recession',
    slug: 'us-recession-2026',
    question: 'Will the US enter a recession in 2026?',
    marketProbability: 27,
    volumeUsd: 35_800_000,
    endDate: '2026-12-31T23:59:00Z',
    description: 'Resolves YES if NBER dates a US recession with any month in 2026, or two consecutive negative GDP quarters widely accepted as recessionary.',
    category: 'macro',
  }),
  m({
    id: 'fallback-spacex',
    slug: 'spacex-starship-orbit-crew-2026',
    question: 'Will SpaceX fly a crewed Starship orbital mission in 2026?',
    marketProbability: 24,
    volumeUsd: 12_100_000,
    endDate: '2026-12-31T23:59:00Z',
    description: 'Resolves YES if a crewed Starship completes an orbital flight in 2026 per SpaceX / NASA public confirmation.',
    category: 'tech',
  }),
  m({
    id: 'fallback-oil',
    slug: 'brent-above-100-2026',
    question: 'Will Brent crude trade above $100 in 2026?',
    marketProbability: 36,
    volumeUsd: 19_600_000,
    endDate: '2026-12-31T23:59:00Z',
    description: 'Resolves YES if Brent spot prints at or above $100/bbl on a major pricing source in 2026.',
    category: 'macro',
  }),
  m({
    id: 'fallback-ai-regulation',
    slug: 'eu-ai-act-fine-2026',
    question: 'Will a major AI company be fined under the EU AI Act in 2026?',
    marketProbability: 44,
    volumeUsd: 8_900_000,
    endDate: '2026-12-31T23:59:00Z',
    description: 'Resolves YES on a public EU enforcement fine under the AI Act against a major AI lab or platform in 2026.',
    category: 'policy',
  }),
];
