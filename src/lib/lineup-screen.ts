/**
 * Isolated lineup screen: selected masters run their own rules on a market board.
 * Never a buy list. Never “you should buy.”
 */

import { CRYPTO_ASSETS, CRYPTO_THEMES } from '@/lib/crypto-universe';
import { EM_NAMES, EM_THEMES } from '@/lib/emerging-markets';
import { CANDIDATES, CYCLE_SNAPSHOT, TREND_THEMES } from '@/lib/opportunities';
import { GROUP_ORDER, getMasterBySlug, type Master } from '@/lib/masters';
import type { DeskMode } from '@/lib/desk-mode';
import { getPersona } from '@/lib/personas';
import { CYCLE_DUTIES, GROWTH_SCREENS, TREND_DUTIES, VALUE_SCREENS } from '@/lib/pipeline';
import type { BriefStance } from '@/lib/research';
import { isUnlocked, type PlanId } from '@/lib/tiers';

export type ScreenMarket = 'us' | 'crypto' | 'emerging';

export type ScreenName = {
  symbol: string;
  name: string;
  tags: string[];
  track?: 'value' | 'growth';
};

export type ScreenHit = {
  symbol: string;
  name: string;
  stance: BriefStance;
  why: string;
};

export type LineupSeatResult = {
  slug: string;
  nameEn: string;
  role: string;
  group: Master['group'];
  looksAt: string;
  thesis: string;
  hits: ScreenHit[];
  isolated: boolean;
  referencedFrom?: string[];
};

export type LineupAssembly = {
  market: ScreenMarket;
  marketLabel: string;
  seatCount: number;
  nameCount: number;
  constructive: { symbol: string; name: string; votes: number }[];
  splits: string[];
  clerkNote: string;
};

const MARKET_LABEL: Record<ScreenMarket, string> = {
  us: 'US-listed names',
  crypto: 'Crypto / on-chain board',
  emerging: 'US-listed emerging-market window',
};

export function marketLabel(market: ScreenMarket): string {
  return MARKET_LABEL[market];
}

export function parseScreenMarket(raw: string | null | undefined): ScreenMarket {
  if (raw === 'crypto' || raw === 'emerging') return raw;
  return 'us';
}

export function namesForMarket(market: ScreenMarket): ScreenName[] {
  if (market === 'crypto') {
    return CRYPTO_ASSETS.map((a) => ({
      symbol: a.symbol,
      name: a.name,
      tags: [a.category, ...CRYPTO_THEMES.flatMap((t) => t.industries)],
    }));
  }
  if (market === 'emerging') {
    return EM_NAMES.map((n) => ({
      symbol: n.ticker,
      name: n.name,
      tags: [n.region, n.theme, ...EM_THEMES.flatMap((t) => t.regions)],
    }));
  }
  return CANDIDATES.map((c) => ({
    symbol: c.ticker,
    name: c.name,
    tags: [c.track, c.reason],
    track: c.track,
  }));
}

function clip(s: string, n: number): string {
  const t = s.replace(/\s+/g, ' ').trim();
  return t.length <= n ? t : `${t.slice(0, n - 1)}…`;
}

function screenOne(master: Master, item: ScreenName, market: ScreenMarket): ScreenHit {
  const persona = getPersona(master.slug);
  const rule = persona?.hardRules?.[0] ?? master.methodology;
  let stance: BriefStance = 'cautious';
  let why = '';

  if (market === 'crypto') {
    if (master.group === 'value') {
      stance = item.symbol === 'BTC' ? 'cautious' : 'skeptical';
      why = `Cash-flow owner test usually fails on tokens. ${clip(rule, 120)} ${item.symbol} is a map, not Graham paper.`;
    } else if (master.group === 'debate' || master.group === 'exit') {
      stance = 'skeptical';
      why = `Invert first: issuer, contract, listings, and policy. ${clip(rule, 120)}`;
    } else if (master.group === 'trend' || master.group === 'growth') {
      stance = ['BTC', 'ETH', 'SOL'].includes(item.symbol) ? 'constructive' : 'cautious';
      why = `Classify usage versus narrative. Theme board still maps settlement / L2 / credit. ${clip(rule, 100)}`;
    } else if (master.group === 'cycle') {
      stance = CYCLE_SNAPSHOT.temperature >= 70 ? 'skeptical' : 'cautious';
      why = `Risk-asset beta in ${CYCLE_SNAPSHOT.phase} (${CYCLE_SNAPSHOT.temperature}). Phase reading only.`;
    } else if (master.group === 'quant') {
      stance = 'cautious';
      why = 'Fat tails. Size as if variance is understated. No formula turns a tape into an edge.';
    } else {
      stance = 'inconclusive';
      why = 'No trigger file on a screen — timing stays dark until a name is underwritten.';
    }
  } else if (market === 'emerging') {
    const row = EM_NAMES.find((n) => n.ticker === item.symbol);
    if (master.group === 'value') {
      stance = row?.theme.includes('bank') || row?.theme.includes('Foundry') ? 'constructive' : 'cautious';
      why = row
        ? `${row.whyOnBoard} Screen: ${clip(VALUE_SCREENS[master.slug] ?? rule, 100)}`
        : clip(rule, 140);
    } else if (master.group === 'growth') {
      stance = row?.theme.toLowerCase().includes('platform') ? 'constructive' : 'cautious';
      why = row
        ? `Classify first: ${row.theme}. ${clip(GROWTH_SCREENS[master.slug] ?? rule, 100)}`
        : clip(rule, 140);
    } else if (master.group === 'debate') {
      stance = 'skeptical';
      why = row ? `Kill-shot: ${row.killShot}` : 'Policy and listing structure before the multiple.';
    } else if (master.group === 'cycle') {
      stance = 'cautious';
      why = `${CYCLE_DUTIES[master.slug] ?? 'Regime overlay.'} GDP slogans are not a screen.`;
    } else if (master.group === 'trend') {
      stance = 'cautious';
      why = `${TREND_DUTIES[master.slug] ?? rule} EM diffusion is a map, not a ticket.`;
    } else {
      stance = 'inconclusive';
      why = clip(rule, 140);
    }
  } else {
    const row = CANDIDATES.find((c) => c.ticker === item.symbol);
    if (master.group === 'value') {
      stance = item.track === 'value' ? 'constructive' : 'cautious';
      why = row
        ? `${row.reason} ${clip(VALUE_SCREENS[master.slug] ?? rule, 110)}`
        : clip(rule, 140);
    } else if (master.group === 'growth') {
      stance = item.track === 'growth' ? 'constructive' : 'cautious';
      why = row
        ? `${row.reason} ${clip(GROWTH_SCREENS[master.slug] ?? rule, 110)}`
        : clip(rule, 140);
    } else if (master.group === 'debate') {
      stance = 'skeptical';
      why = `Kill-shot seat. ${clip(rule, 140)} A name on the board is not cleared.`;
    } else if (master.group === 'trend') {
      const theme = TREND_THEMES[0];
      stance = theme.strength >= 7 ? 'constructive' : 'cautious';
      why = `Era map: ${theme.title}. ${TREND_DUTIES[master.slug] ?? clip(rule, 100)}`;
    } else if (master.group === 'cycle') {
      stance = CYCLE_SNAPSHOT.temperature >= 70 ? 'skeptical' : 'cautious';
      why = `${CYCLE_SNAPSHOT.phase} at ${CYCLE_SNAPSHOT.temperature}. ${CYCLE_DUTIES[master.slug] ?? ''} Not a timing ticket.`;
    } else if (master.group === 'quant') {
      stance = 'cautious';
      why = 'Significance before story. Intuition is not a rank.';
    } else if (master.group === 'exit') {
      stance = 'inconclusive';
      why = 'Exit rules need a name you already hold. A screen is not a position.';
    } else {
      stance = 'inconclusive';
      why = 'Trigger file missing — this seat does not rank a pool.';
    }
  }

  return { symbol: item.symbol, name: item.name, stance, why };
}

export function runLineupScreen(opts: {
  plan: PlanId;
  slugs: string[];
  market: ScreenMarket;
  mode?: DeskMode;
}): { briefs: LineupSeatResult[]; assembly: LineupAssembly; skippedLocked: string[] } {
  const market = opts.market;
  const mode: DeskMode = opts.mode === 'handoff' ? 'handoff' : 'isolated';
  const names = namesForMarket(market);
  const skippedLocked: string[] = [];
  const unique = [...new Set(opts.slugs.map((s) => s.trim()).filter(Boolean))];
  const seats = unique
    .map((slug) => {
      if (!isUnlocked(opts.plan, slug)) {
        skippedLocked.push(slug);
        return null;
      }
      return getMasterBySlug(slug) ?? null;
    })
    .filter((m): m is Master => Boolean(m))
    .sort((a, b) => GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group));

  const briefs: LineupSeatResult[] = [];
  const upstreamByGroup: LineupSeatResult[] = [];

  for (const master of seats) {
    const persona = getPersona(master.slug);
    const looks = persona?.looksAt?.[0] ?? master.methodology.split('.')[0];
    let hits = names.map((n) => screenOne(master, n, market));
    const earlier = upstreamByGroup.filter(
      (b) => GROUP_ORDER.indexOf(b.group) < GROUP_ORDER.indexOf(master.group)
    );
    const constructiveUp = new Set(
      earlier.flatMap((b) => b.hits.filter((h) => h.stance === 'constructive').map((h) => h.symbol))
    );
    if (mode === 'handoff' && earlier.length) {
      hits = hits.map((h) => {
        if (constructiveUp.has(h.symbol)) {
          return {
            ...h,
            why: `Handoff: earlier groups marked ${h.symbol} constructive. This seat still ran its own test. ${h.why}`,
          };
        }
        return {
          ...h,
          why: `Handoff: ${h.symbol} was not a constructive overlap upstream. ${h.why}`,
        };
      });
    }
    const kept = hits.filter((h) => h.stance === 'constructive').length;
    const referencedFrom = mode === 'handoff' ? [...new Set(earlier.map((b) => b.nameEn))] : undefined;
    const row: LineupSeatResult = {
      slug: master.slug,
      nameEn: master.nameEn,
      role: master.role,
      group: master.group,
      looksAt: looks,
      thesis:
        mode === 'handoff' && earlier.length
          ? `${kept} constructive after a pipeline handoff (read ${referencedFrom?.slice(0, 4).join(', ') ?? 'upstream'}). Not a ranking. Not a buy list.`
          : `${kept} constructive on this board after an isolated pass. Not a ranking. Not a buy list.`,
      hits,
      isolated: mode === 'isolated',
      referencedFrom: referencedFrom?.length ? referencedFrom : undefined,
    };
    briefs.push(row);
    upstreamByGroup.push(row);
  }

  const vote = new Map<string, { name: string; votes: number }>();
  for (const b of briefs) {
    for (const h of b.hits) {
      if (h.stance !== 'constructive') continue;
      const prev = vote.get(h.symbol) ?? { name: h.name, votes: 0 };
      prev.votes += 1;
      vote.set(h.symbol, prev);
    }
  }
  const constructive = [...vote.entries()]
    .map(([symbol, v]) => ({ symbol, name: v.name, votes: v.votes }))
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 12);

  const splits: string[] = [];
  if (briefs.some((b) => b.group === 'value') && briefs.some((b) => b.group === 'growth')) {
    splits.push('Value and growth seats used different tests. The clerk does not merge them into one rank.');
  }
  if (briefs.some((b) => b.group === 'debate')) {
    splits.push('Debate seats stayed kill-shots. A constructive count elsewhere does not silence them.');
  }
  if (market === 'crypto') {
    splits.push('P/E and P/B are not forced onto tokens with no earnings.');
  }

  return {
    briefs,
    skippedLocked,
    assembly: {
      market,
      marketLabel: MARKET_LABEL[market],
      seatCount: briefs.length,
      nameCount: names.length,
      constructive,
      splits: splits.slice(0, 3),
      clerkNote:
        mode === 'handoff'
          ? 'Lined-up seats ran in pipeline order. Later groups could read earlier constructive marks; peers in the same group stayed silent. Overlap is not a vote to buy, and there is no buy button.'
          : 'Each master screened the same board alone. Assembly counts overlapping constructive notes — it is not a vote to buy, and there is no buy button.',
    },
  };
}
