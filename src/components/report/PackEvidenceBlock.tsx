import Link from 'next/link';
import type { PackEvidence } from '@/lib/personas/modules';
import type { ChecklistVerdict } from '@/lib/personas/source-pack/types';

const VERDICT_STYLE: Record<ChecklistVerdict, string> = {
  pass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  fail: 'bg-red-50 text-red-800 border-red-200',
  unknown: 'bg-slate-50 text-slate-600 border-slate-200',
};

const VERDICT_LABEL: Record<ChecklistVerdict, string> = {
  pass: 'Pass',
  fail: 'Fail',
  unknown: 'Unknown',
};

/**
 * Compact methodology evidence from a deep source pack.
 * Heuristic checklist + short citations — not a buy score.
 * Fail items are listed first (sorted upstream in buildPackContext).
 */
export default function PackEvidenceBlock({ evidence }: { evidence: PackEvidence }) {
  if (
    !evidence.checklist.length &&
    !evidence.excerpts.length &&
    !evidence.thirteenFNote &&
    !(evidence.metricsBound && evidence.metricsBound.length)
  ) {
    return null;
  }

  const failCount = evidence.checklist.filter((c) => c.verdict === 'fail').length;

  return (
    <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5 space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Method pack
        </p>
        <Link
          href={`/masters/${evidence.slug}`}
          className="text-[10px] font-medium text-[#0052d9] hover:underline"
        >
          Method →
        </Link>
      </div>
      {evidence.checklist.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Method checklist
            {failCount > 0 ? (
              <span className="ml-1.5 font-medium normal-case tracking-normal text-red-600/80">
                · {failCount} fail first
              </span>
            ) : null}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {evidence.checklist.map((item) => (
              <span
                key={item.id}
                className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${VERDICT_STYLE[item.verdict]}`}
                title={item.label}
              >
                <span className="opacity-70">{VERDICT_LABEL[item.verdict]}</span>
                <span className="max-w-[10rem] truncate">{item.label}</span>
              </span>
            ))}
          </div>
        </div>
      )}
      {evidence.metricsBound && evidence.metricsBound.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {evidence.metricsBound.map((m) => (
            <span
              key={m}
              className="inline-flex rounded border border-slate-200/80 bg-white/60 px-1.5 py-0.5 text-[9px] font-medium text-slate-400"
            >
              {m}
            </span>
          ))}
        </div>
      )}
      {evidence.excerpts.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Cited source notes
          </p>
          <ul className="space-y-1">
            {evidence.excerpts.map((ex, i) => (
              <li key={`${ex.work}-${ex.locator}-${i}`} className="text-[11px] text-slate-600 leading-snug">
                <span className="font-medium text-slate-700">
                  {ex.work}
                  <span className="font-normal text-slate-400"> · {ex.locator}</span>
                </span>
                <span className="text-slate-500"> — {ex.quote}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {evidence.thirteenFNote ? (
        <p className="text-[10px] text-amber-800/80 bg-amber-50/80 border border-amber-100 rounded-md px-2 py-1">
          {evidence.thirteenFNote}
        </p>
      ) : null}
      <p className="text-[10px] text-slate-400">
        Pack aids only · heuristic pass/fail/unknown · not a composite buy rating
      </p>
    </div>
  );
}
