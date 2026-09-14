import type { Fundamentals } from '@/lib/data/fundamentals';
import { getSourcePack } from '@/lib/personas/source-pack';
import type { ChecklistScoreItem, ChecklistVerdict, MetricId } from '@/lib/personas/source-pack/types';
import { formatChecklistSummary, scoreChecklist } from './checklist';
import { formatConsensusContrast } from './consensus';
import { requireKillShotsFirst } from './killshots';
import { formatMetricsContext } from './metrics';
import {
  formatRetrievedExcerpts,
  retrieveExcerpts,
  retrieveExcerptsAsync,
} from './rag';
import { formatThirteenFContext, thirteenFLagUiNote } from './thirteenf';
import type { RankedExcerpt } from '@/lib/personas/source-pack/types';

export type PackContextInput = {
  slug: string;
  question: string;
  subject?: string;
  fundamentals?: Fundamentals | null;
  /** Extra text for retrieval + checklist heuristics (news, handoff, etc.). */
  extraText?: string;
  excerptK?: number;
};

/** Compact evidence for UI — checklist chips + short excerpt citations. */
export type PackEvidence = {
  slug: string;
  checklist: Array<{
    id: string;
    label: string;
    verdict: ChecklistVerdict;
  }>;
  excerpts: Array<{
    work: string;
    locator: string;
    /** Short clip for UI — not a giant quote. */
    quote: string;
  }>;
  /** Bound metrics for muted chips (desk FACTS the method cares about). */
  metricsBound?: MetricId[];
  /** When pack has thirteenF — always illustrative / lagged. */
  thirteenFNote?: string;
};

export type PackContextResult = {
  /** Empty when no pack / stub-only note. */
  block: string;
  evidence: PackEvidence | null;
};

function clipQuote(s: string, n = 140): string {
  const t = s.replace(/\s+/g, ' ').trim();
  return t.length <= n ? t : `${t.slice(0, n - 1)}…`;
}

function assemblePackContext(
  input: PackContextInput,
  excerpts: RankedExcerpt[]
): PackContextResult {
  const pack = getSourcePack(input.slug);
  if (!pack) return { block: '', evidence: null };

  if (pack.status === 'stub') {
    return {
      block: `SOURCE PACK: ${pack.slug} (stub). ${pack.stubNote ?? 'Deep pack coming soon.'} Use persona hard rules only.`,
      evidence: null,
    };
  }

  const query = [input.question, input.subject, input.extraText].filter(Boolean).join(' ');
  const checklist = scoreChecklist(pack, {
    fundamentals: input.fundamentals,
    textFacts: query,
  });

  const parts = [
    `SOURCE PACK CONTEXT (${pack.slug} · deep) — methodology aids for this seat only. Not a buy score. Not advice.`,
    formatRetrievedExcerpts(excerpts),
    formatChecklistSummary(checklist),
    formatMetricsContext(input.slug, input.fundamentals),
    requireKillShotsFirst(!!pack.layerHints?.killShotsFirst),
    formatConsensusContrast(!!pack.layerHints?.consensusPriceContrast),
    formatThirteenFContext(pack),
  ].filter(Boolean);

  const evidence: PackEvidence = {
    slug: pack.slug,
    checklist: [...checklist.items]
      .sort((a, b) => {
        const rank = (v: ChecklistVerdict) => (v === 'fail' ? 0 : v === 'unknown' ? 1 : 2);
        return rank(a.verdict) - rank(b.verdict);
      })
      .map((i: ChecklistScoreItem) => ({
        id: i.id,
        label: i.label,
        verdict: i.verdict,
      })),
    excerpts: excerpts.slice(0, 3).map((e) => ({
      work: e.work,
      locator: e.locator,
      quote: clipQuote(e.quote, 140),
    })),
    metricsBound: pack.metricsBound.length ? [...pack.metricsBound] : undefined,
    ...(pack.thirteenF
      ? {
          thirteenFNote: thirteenFLagUiNote(pack),
        }
      : {}),
  };

  return { block: parts.join('\n\n'), evidence };
}

/**
 * Build FACTS/CONTEXT blocks from a source pack for the brief user message.
 * Never merges pack content into systemPrompt.
 * Sync path uses keyword RAG (embeddings if already warm).
 */
export function buildPackContextBlocks(input: PackContextInput): string {
  return buildPackContext(input).block;
}

/** Same as buildPackContextBlocks plus structured evidence for the brief result / UI. */
export function buildPackContext(input: PackContextInput): PackContextResult {
  const pack = getSourcePack(input.slug);
  if (!pack) return { block: '', evidence: null };
  if (pack.status === 'stub') {
    return assemblePackContext(input, []);
  }
  const query = [input.question, input.subject, input.extraText].filter(Boolean).join(' ');
  const excerpts = retrieveExcerpts(input.slug, query, input.excerptK ?? 3);
  return assemblePackContext(input, excerpts);
}

/**
 * Prefer embeddings-lite when OPENAI_API_KEY / AGENTS61_EMBEDDING_* is set;
 * otherwise identical to buildPackContext (keyword).
 */
export async function buildPackContextAsync(
  input: PackContextInput
): Promise<PackContextResult> {
  const pack = getSourcePack(input.slug);
  if (!pack) return { block: '', evidence: null };
  if (pack.status === 'stub') {
    return assemblePackContext(input, []);
  }
  const query = [input.question, input.subject, input.extraText].filter(Boolean).join(' ');
  const excerpts = await retrieveExcerptsAsync(input.slug, query, input.excerptK ?? 3);
  return assemblePackContext(input, excerpts);
}

export {
  scoreChecklist,
  formatChecklistSummary,
  retrieveExcerpts,
  retrieveExcerptsAsync,
  formatRetrievedExcerpts,
  formatMetricsContext,
  formatThirteenFContext,
  formatConsensusContrast,
  requireKillShotsFirst,
};
