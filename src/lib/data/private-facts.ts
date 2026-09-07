/**
 * Private-company fact card — no SEC EDGAR. Cached secondary marks only.
 */

import { getPrivateCompany, type PrivateCompany } from '@/lib/private-universe';

export type PrivateFacts = {
  slug: string;
  name: string;
  sector: string;
  lastValuationUsd: number | null;
  lastValuationLabel: string | null;
  lastRound: string | null;
  revenueRunRateUsd: number | null;
  burnMonthlyUsd: number | null;
  runwayMonths: number | null;
  comparableTickers: string[];
  dataSources: string[];
  disclaimer: string;
  error: string | null;
};

function money(n: number | null): string {
  if (n == null) return '—';
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  return `$${n.toFixed(0)}`;
}

export function privateFactsFromCompany(c: PrivateCompany): PrivateFacts {
  return {
    slug: c.slug,
    name: c.name,
    sector: c.sector,
    lastValuationUsd: c.lastValuationUsd,
    lastValuationLabel: c.lastValuationLabel,
    lastRound: c.lastRound,
    revenueRunRateUsd: c.revenueRunRateUsd,
    burnMonthlyUsd: c.burnMonthlyUsd,
    runwayMonths: c.runwayMonths,
    comparableTickers: c.comparableTickers,
    dataSources: c.dataSources,
    disclaimer:
      'Private desk: secondary marks and public disclosures only. Not EDGAR. Not a live quote. Not investable price.',
    error: null,
  };
}

export function getPrivateFacts(slug: string): PrivateFacts {
  const c = getPrivateCompany(slug);
  if (!c) {
    return {
      slug: slug.toLowerCase(),
      name: slug,
      sector: 'Private / pre-IPO',
      lastValuationUsd: null,
      lastValuationLabel: null,
      lastRound: null,
      revenueRunRateUsd: null,
      burnMonthlyUsd: null,
      runwayMonths: null,
      comparableTickers: [],
      dataSources: [],
      disclaimer: 'Subject not on the private board.',
      error: 'Not on the Agents61 private desk board.',
    };
  }
  return privateFactsFromCompany(c);
}

export function privateFactsBlock(facts: PrivateFacts): string {
  const rows = [
    `Name: ${facts.name}`,
    `Sector: ${facts.sector}`,
    facts.lastValuationLabel ? `Secondary mark: ${facts.lastValuationLabel}` : null,
    facts.lastValuationUsd != null ? `Valuation USD (cached): ${money(facts.lastValuationUsd)}` : null,
    facts.lastRound ? `Last round: ${facts.lastRound}` : null,
    facts.revenueRunRateUsd != null ? `Revenue run-rate (est.): ${money(facts.revenueRunRateUsd)}` : null,
    facts.burnMonthlyUsd != null ? `Monthly burn (est.): ${money(facts.burnMonthlyUsd)}` : null,
    facts.runwayMonths != null ? `Runway (months): ${facts.runwayMonths}` : null,
    facts.comparableTickers.length ? `Comparables (listed): ${facts.comparableTickers.join(', ')}` : null,
    facts.dataSources.length ? `Sources: ${facts.dataSources.join('; ')}` : null,
    facts.disclaimer,
    facts.error,
  ].filter(Boolean);
  return rows.join('\n');
}
