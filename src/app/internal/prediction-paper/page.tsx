import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { loadPaperBook, type PaperBook } from '@/lib/prediction/paper-book';

export const metadata: Metadata = {
  title: 'Internal · Prediction paper book',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

type Props = { searchParams: Promise<{ token?: string }> };

function authorized(token: string | undefined): boolean {
  const secret = (process.env.CRON_SECRET || process.env.INTERNAL_PAPER_TOKEN || '').trim();
  if (!secret || !token) return false;
  return token === secret;
}

function fmtUsd(n: number | null | undefined) {
  if (n == null || !Number.isFinite(n)) return '—';
  const sign = n > 0 ? '+' : '';
  return `${sign}$${n.toFixed(2)}`;
}

function BookView({ book }: { book: PaperBook }) {
  const open = book.positions.filter((p) => p.status === 'open');
  const settled = book.positions.filter((p) => p.status === 'settled');
  const recentAnalyses = book.analyses.slice(0, 12);
  const recentRuns = book.runs.slice(0, 10);

  return (
    <article className="section-container py-12 max-w-4xl">
      <p className="badge badge-neutral mb-3">Internal · noindex</p>
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Prediction paper book</h1>
      <p className="text-sm text-slate-600 mb-8 leading-relaxed">
        Virtual money only — mid fills, zero fees, clerk-only entries. Not advice. Updated{' '}
        {book.updatedAt ? new Date(book.updatedAt).toLocaleString() : '—'}.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
        <div className="card-flat p-4">
          <p className="text-xs uppercase tracking-wider text-slate-400">Open</p>
          <p className="text-2xl font-bold text-slate-900">{book.summary.openCount ?? open.length}</p>
        </div>
        <div className="card-flat p-4">
          <p className="text-xs uppercase tracking-wider text-slate-400">Deployed</p>
          <p className="text-2xl font-bold text-slate-900">${book.summary.deployedUsd}</p>
        </div>
        <div className="card-flat p-4">
          <p className="text-xs uppercase tracking-wider text-slate-400">Realized P&amp;L</p>
          <p className="text-2xl font-bold text-slate-900">{fmtUsd(book.summary.realizedPnLUsd)}</p>
        </div>
        <div className="card-flat p-4">
          <p className="text-xs uppercase tracking-wider text-slate-400">Model EV (open)</p>
          <p className="text-2xl font-bold text-slate-900">{fmtUsd(book.summary.modelImpliedEvUsd)}</p>
        </div>
      </div>

      <div className="mb-10 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-sm text-slate-600 leading-relaxed">
        <p className="font-semibold text-slate-800 mb-1">Daily cron</p>
        <p>
          Vercel hits <code className="text-xs">GET /api/internal/prediction-paper?action=daily</code>{' '}
          with <code className="text-xs">Authorization: Bearer $CRON_SECRET</code>. Manual:{' '}
          <code className="text-xs">npm run paper:daily</code>
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-slate-900 mb-3">Open positions</h2>
        {open.length === 0 ? (
          <p className="text-sm text-slate-500">No open paper positions.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-sm min-w-[40rem]">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100 bg-slate-50/80">
                  <th className="py-2 px-3">Market</th>
                  <th className="py-2 px-3">Side</th>
                  <th className="py-2 px-3">Entry</th>
                  <th className="py-2 px-3">Gap</th>
                  <th className="py-2 px-3">Model EV</th>
                  <th className="py-2 px-3">Days</th>
                </tr>
              </thead>
              <tbody>
                {open.map((p) => (
                  <tr key={p.id} className="border-b border-slate-50 last:border-0 align-top">
                    <td className="py-2 px-3">
                      <a href={p.url} className="text-[#0052d9] font-medium hover:underline" target="_blank" rel="noreferrer">
                        {p.question.slice(0, 72)}
                        {p.question.length > 72 ? '…' : ''}
                      </a>
                    </td>
                    <td className="py-2 px-3 font-semibold">{p.side}</td>
                    <td className="py-2 px-3">{p.entryMid}%</td>
                    <td className="py-2 px-3">
                      {p.gap > 0 ? '+' : ''}
                      {p.gap}
                    </td>
                    <td className="py-2 px-3">{fmtUsd(p.modelEvUsd)}</td>
                    <td className="py-2 px-3">{p.daysToResolutionEst ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-slate-900 mb-3">Settled</h2>
        {settled.length === 0 ? (
          <p className="text-sm text-slate-500">Nothing settled yet — wait for mids near 0/100.</p>
        ) : (
          <ul className="space-y-2">
            {settled
              .slice()
              .reverse()
              .slice(0, 20)
              .map((p) => (
                <li key={p.id} className="card-flat p-3 text-sm flex flex-wrap gap-x-3 gap-y-1">
                  <span className="font-semibold">{p.won ? 'WIN' : 'LOSS'}</span>
                  <span>
                    {p.side} · {p.question.slice(0, 60)}
                  </span>
                  <span className="text-slate-600">{fmtUsd(p.realizedPnL)}</span>
                </li>
              ))}
          </ul>
        )}
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-slate-900 mb-3">Recent clerk scans</h2>
        {recentAnalyses.length === 0 ? (
          <p className="text-sm text-slate-500">No scans yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-sm min-w-[36rem]">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100 bg-slate-50/80">
                  <th className="py-2 px-3">Market</th>
                  <th className="py-2 px-3">Mid</th>
                  <th className="py-2 px-3">A61</th>
                  <th className="py-2 px-3">Gap</th>
                  <th className="py-2 px-3">Engine</th>
                  <th className="py-2 px-3">Traded</th>
                </tr>
              </thead>
              <tbody>
                {recentAnalyses.map((a) => (
                  <tr key={`${a.marketId}-${a.at}`} className="border-b border-slate-50 last:border-0">
                    <td className="py-2 px-3">{a.question.slice(0, 56)}</td>
                    <td className="py-2 px-3">{a.mid}</td>
                    <td className="py-2 px-3">{a.agents61}</td>
                    <td className="py-2 px-3">
                      {a.gap > 0 ? '+' : ''}
                      {a.gap}
                    </td>
                    <td className="py-2 px-3">{a.engine}</td>
                    <td className="py-2 px-3">{a.traded ? 'yes' : 'no'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-3">Runs</h2>
        <ul className="space-y-1 text-sm text-slate-600">
          {recentRuns.map((r) => (
            <li key={`${r.at}-${r.action}`}>
              {new Date(r.at).toLocaleString()} · {r.action}
              {r.opened != null ? ` · opened ${r.opened}` : ''}
              {r.settled != null ? ` · settled ${r.settled}` : ''}
              {r.analyzed != null ? ` · analyzed ${r.analyzed}` : ''}
              {r.note ? ` · ${r.note}` : ''}
            </li>
          ))}
        </ul>
      </section>

      <p className="text-xs text-slate-400 leading-relaxed">
        Assumptions: {book.assumptions.warning} Cron hits{' '}
        <code className="text-slate-500">POST /api/internal/prediction-paper?action=daily</code>.{' '}
        <Link href="/predictions" className="text-[#0052d9]">
          Live desk
        </Link>
      </p>
    </article>
  );
}

export default async function InternalPredictionPaperPage({ searchParams }: Props) {
  const { token } = await searchParams;
  if (!authorized(token)) notFound();

  let book: PaperBook;
  try {
    book = await loadPaperBook();
  } catch {
    notFound();
  }

  return (
    <>
      <Navbar />
      <BookView book={book} />
      <Footer />
    </>
  );
}
