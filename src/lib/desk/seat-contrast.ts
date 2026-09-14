import type { BriefStance, IndependentBrief } from '@/lib/research';

export type SeatContrastRow = {
  id: string;
  left: { slug: string; nameEn: string; stance: BriefStance };
  right: { slug: string; nameEn: string; stance: BriefStance };
  /** Short textual contrast — never a vote or averaged score. */
  note: string;
};

const BULLISH: BriefStance[] = ['constructive'];
const BEARISH: BriefStance[] = ['skeptical'];

function clip(s: string, n = 90): string {
  const t = s.replace(/\s+/g, ' ').trim();
  return t.length <= n ? t : `${t.slice(0, n - 1)}…`;
}

function killish(b: IndependentBrief): boolean {
  const blob = `${b.finding} ${b.risks} ${b.wouldChangeMind} ${b.thesis}`.toLowerCase();
  return (
    b.stance === 'skeptical' ||
    /\b(kill|invert|falsif|broken thesis|do not|avoid|trap|fraud|overpay)\b/.test(blob)
  );
}

function bullish(b: IndependentBrief): boolean {
  const blob = `${b.finding} ${b.thesis} ${b.why}`.toLowerCase();
  return (
    b.stance === 'constructive' ||
    /\b(compound|moat|asymmetric upside|own for|franchise|platform quality)\b/.test(blob)
  );
}

/**
 * Heuristic pairwise contrasts from isolated briefs.
 * Never averages confidence into a recommendation.
 */
export function buildSeatContrasts(briefs: IndependentBrief[], max = 4): SeatContrastRow[] {
  if (briefs.length < 2) return [];

  const rows: SeatContrastRow[] = [];
  const used = new Set<string>();

  const byStance = (s: BriefStance) => briefs.filter((b) => b.stance === s);

  // Constructive vs skeptical pairs
  for (const left of byStance('constructive')) {
    for (const right of byStance('skeptical')) {
      const key = [left.slug, right.slug].sort().join('|');
      if (used.has(key)) continue;
      used.add(key);
      rows.push({
        id: key,
        left: { slug: left.slug, nameEn: left.nameEn, stance: left.stance },
        right: { slug: right.slug, nameEn: right.nameEn, stance: right.stance },
        note: `${left.nameEn} stays constructive (${clip(left.thesis)}); ${right.nameEn} stays skeptical (${clip(right.thesis || right.finding)}). Split kept — not averaged.`,
      });
      if (rows.length >= max) return rows;
    }
  }

  // Kill-language vs bull-language when stances alone are thin
  const killers = briefs.filter(killish);
  const bulls = briefs.filter(bullish);
  for (const left of bulls) {
    for (const right of killers) {
      if (left.slug === right.slug) continue;
      if (BULLISH.includes(left.stance) && BEARISH.includes(right.stance) && used.has([left.slug, right.slug].sort().join('|'))) {
        continue;
      }
      const key = [left.slug, right.slug].sort().join('|');
      if (used.has(key)) continue;
      used.add(key);
      rows.push({
        id: key,
        left: { slug: left.slug, nameEn: left.nameEn, stance: left.stance },
        right: { slug: right.slug, nameEn: right.nameEn, stance: right.stance },
        note: `${left.nameEn} leans bull-frame; ${right.nameEn} leans kill/falsifier frame. Isolated views — clerk does not pick a winner.`,
      });
      if (rows.length >= max) return rows;
    }
  }

  // Different stance labels (cautious vs constructive, etc.)
  for (let i = 0; i < briefs.length && rows.length < max; i++) {
    for (let j = i + 1; j < briefs.length && rows.length < max; j++) {
      const a = briefs[i]!;
      const b = briefs[j]!;
      if (a.stance === b.stance) continue;
      const key = [a.slug, b.slug].sort().join('|');
      if (used.has(key)) continue;
      used.add(key);
      rows.push({
        id: key,
        left: { slug: a.slug, nameEn: a.nameEn, stance: a.stance },
        right: { slug: b.slug, nameEn: b.nameEn, stance: b.stance },
        note: `Stance split: ${a.nameEn} (${a.stance}) vs ${b.nameEn} (${b.stance}). Falsifiers stay seat-local.`,
      });
    }
  }

  return rows.slice(0, max);
}
