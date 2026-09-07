import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { Rocket } from 'lucide-react';
import { PRIVATE_COMPANIES, privateDeskPrompt } from '@/lib/private-universe';
import PrivateDeskHooks from '@/components/landing/PrivateDeskHooks';
import AuthGateLink from '@/components/auth/AuthGateLink';
import { pageMeta } from '@/lib/seo/meta';
import type { Metadata } from 'next';

export const metadata: Metadata = pageMeta({
  title: 'Private desk — Anduril, Stripe, OpenAI pre-IPO research',
  description:
    'Open questions on OpenAI, Anthropic, Stripe, Anduril: potential, IPO timing, kill-shots. Masters write alone on Agents61 — then open Dashboard. Not a secondary-market ticket.',
  path: '/research/private',
});

function money(n: number | null): string {
  if (n == null) return '—';
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  return `$${(n / 1e6).toFixed(0)}M`;
}

export default function PrivateResearchPage() {
  return (
    <>
      <Navbar />
      <div className="section-container py-16">
        <div className="max-w-3xl mb-12">
          <div className="badge badge-primary mb-4">Private desk</div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            Pre-IPO names. Open questions — not EDGAR.
          </h1>
          <p className="text-lg text-slate-600">
            Will OpenAI stay a toll road? Does Anthropic keep a trust premium? Can Stripe defend
            take-rate? Pick a doubt; unlocked masters write alone, then you read the split in
            Dashboard. SpaceX listed as SPCX in June 2026 — use the public equity desk.
          </p>
          <p className="text-sm text-slate-500 mt-3">
            Looking for SpaceX?{' '}
            <Link href="/stocks/spcx" className="font-semibold text-[#0052d9] hover:underline">
              Open SPCX public desk →
            </Link>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {PRIVATE_COMPANIES.map((c) => (
            <Link key={c.slug} href={`/private/${c.slug}`} className="private-desk-card group">
              <div className="flex items-start gap-3">
                <span className="private-desk-icon">
                  <Rocket className="h-4 w-4" strokeWidth={2} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-base font-bold text-slate-900 group-hover:text-[#0052d9]">{c.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{c.sector}</div>
                  <div className="text-sm text-slate-600 mt-2 line-clamp-2">{c.tagline}</div>
                  <div className="flex flex-wrap gap-3 mt-3 text-xs tabular-nums">
                    <span className="font-semibold text-slate-800">{c.lastValuationLabel ?? money(c.lastValuationUsd)}</span>
                    {c.revenueRunRateUsd != null && (
                      <span className="text-slate-400">Rev ~{money(c.revenueRunRateUsd)}</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-5 mb-8">
          <p className="text-sm text-amber-950 leading-relaxed">
            <strong>Disclaimer:</strong> Secondary marks are stale, non-executable estimates. Agents61
            is a research simulation — not a broker, not a secondary marketplace, not investment advice.
          </p>
        </div>

        <AuthGateLink
          href="/dashboard?entry=analyze&private=openai"
          guestHref="/register?next=%2Fdashboard%3Fentry%3Danalyze%26private%3Dopenai"
          className="btn-primary"
        >
          Convene OpenAI on the desk
        </AuthGateLink>
        <p className="text-xs text-slate-400 mt-3">
          Try: &quot;{privateDeskPrompt('anduril')}&quot;
        </p>
      </div>

      <PrivateDeskHooks
        title="Billions marked. Zero EDGAR. Still unanswered."
        subtitle="Each card is a kill-shot question with a live secondary mark on the line. Click through — prompt pre-filled, masters isolated, clerk frames dig-or-walk."
      />

      <Footer />
    </>
  );
}
