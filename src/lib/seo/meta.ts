import type { Metadata } from 'next';
import { PRIMARY_KEYWORDS } from '@/lib/seo/keywords';

const SITE = 'https://agents61.com';

export function pageMeta(opts: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  const url = `${SITE}${opts.path}`;
  return {
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords ?? PRIMARY_KEYWORDS,
    alternates: { canonical: url },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: 'Agents61',
      type: 'website',
      images: [{ url: '/assets/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description: opts.description,
    },
  };
}

/** Canonical copy for public surfaces. Keep under ~160 characters. */
export const PAGE_DESCRIPTIONS = {
  home:
    '61-master AI investment committee for US stocks, ETFs, crypto, and Polymarket prediction market odds research. Probability gaps vs crowd YES%. Not a buy button.',
  predictions:
    'Polymarket odds research: compare crowd YES probability with Agents61 multi-agent prediction market analysis. Hunt probability gaps — research simulation, not betting.',
  features:
    'Features: isolated master agents, pipeline handoff, lineup stock screens, crypto research, red-team debate, cycle meter, PDF briefs. AI stock analysis without a copilot that agrees with you.',
  howItWorks:
    'How Agents61 works: pick Isolated or Division of labor, convene unlocked seats, each writes a stock research brief, a clerk stacks splits. Research simulation, not advice.',
  compare:
    'Agents61 vs Yahoo Finance, Seeking Alpha, Bloomberg, TradingView, and ChatGPT stock analysis. A committee of investment agents — not a quote terminal or a chatbot.',
  about:
    'About Agents61: 61 investment-master AI agents for intermediate US investors. Isolated then assembled equity research. Not a terminal, not an adviser, not a buy button.',
  blog:
    'Investment research notes: isolated AI committees, Buffett vs Wood, stock due diligence without a buy button, Seeking Alpha alternatives, multi-agent stock analysis.',
  masters:
    '61 investment masters as AI agents: Warren Buffett, Benjamin Graham, Cathie Wood, Ray Dalio, Peter Lynch, Michael Burry. Each seat is a stock-analysis methodology.',
  pipeline:
    'Six-step investment research pipeline: trend, cycle, stock selection, red-team debate, timing, exit, plus quant risk. How an AI investment committee actually writes.',
  methodology:
    'How Agents61 personas are built from books and shareholder letters — Graham, Buffett, Marks — not gossip. Isolated stock research, then clerk assembly.',
  pricing:
    'AI stock research pricing: Analyst 16 seats $19, Associate 29 $49, Principal 48 $79, Committee 61 $149. Isolated investment research, not a group chat.',
  markets:
    'Markets on Agents61: US stock analysis, US ETFs, Bitcoin and on-chain research, emerging-market ADRs. Equity research simulation, not a Bloomberg terminal.',
  crypto:
    'Blockchain asset analysis: BTC, ETH, SOL on-chain research by an AI investment committee. Not a P/E forced onto tokens. Crypto due diligence, not a buy signal.',
  emerging:
    'Emerging-market stock research via US-listed ADRs. Policy, FX, and listing structure beside fundamentals. Templeton-style pessimism, not a GDP slogan.',
  cycle:
    'Market cycle meter: Dalio debt cycle, Howard Marks pendulum, Templeton sentiment. Where we are in the cycle — a regime note, not a timing ticket.',
  contact:
    'Contact Agents61 about the AI investment committee, stock research desk, or billing. Research simulation — not personalized investment advice.',
} as const;
