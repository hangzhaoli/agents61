import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import IsolatedResearch from '@/components/report/IsolatedResearch';
import AuthGateLink from '@/components/auth/AuthGateLink';
import { pageMeta } from '@/lib/seo/meta';
import { buildKernelDemoReport } from '@/lib/demo-kernel-report';
import { ArrowRight } from 'lucide-react';

export const revalidate = 3600;

export const metadata = pageMeta({
  title: 'Kernel demo — isolated NVDA committee report',
  description:
    'Sample Agents61 desk report with research-prep, method checks, source notes, and a clerk split. Research simulation — not advice. No buy button.',
  path: '/demo',
  keywords: [
    'Agents61 demo',
    'AI investment committee sample report',
    'isolated stock research brief',
    'NVDA research simulation',
  ],
});

export default async function KernelDemoPage() {
  const report = await buildKernelDemoReport();

  return (
    <>
      <Navbar />
      <article className="section-container py-12 md:py-16">
        <header className="max-w-3xl mb-10">
          <div className="badge badge-primary mb-4">Product demo · desk kernel</div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            Sample committee file: {report.ticker}
          </h1>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            {report.name}. Five deep seats, written in isolation, then a clerk stack. Method
            checks and source notes come from the live kernel (checklist + excerpt retrieval) on
            this ticker’s FACTS — {report.liveFilings ? 'cached SEC/desk filings' : 'illustrative cached snapshot if filings were thin'}.
            Not a live quote. Not advice. No buy button.
          </p>
          <p className="mt-3 text-sm text-slate-500">{report.question}</p>
        </header>

        <section className="card p-6 md:p-8 mb-6">
          <div className="badge badge-primary mb-2">Research prep · before personas</div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">
            Fundamentals / tone / valuation — shared FACTS only
          </h2>
          <p className="text-sm text-slate-600 mb-5">
            Same file for every seat. Seats still cannot see each other’s drafts. This layer is not
            a committee score.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-slate-900">
            {(
              [
                ['Fundamentals', report.prep.fundamentals.summary, report.prep.fundamentals.highlights],
                ['Tone (heuristic)', report.prep.sentiment.summary, report.prep.sentiment.highlights],
                ['Valuation (on file)', report.prep.valuation.summary, report.prep.valuation.highlights],
              ] as const
            ).map(([title, summary, highlights], i) => (
              <div
                key={title}
                className={`p-5 ${i < 2 ? 'md:border-r border-b md:border-b-0 border-slate-200' : ''}`}
              >
                <h3 className="text-sm font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-xs text-slate-500 mb-3 leading-relaxed">{summary}</p>
                <ul className="space-y-1.5">
                  {highlights.slice(0, 6).map((h) => (
                    <li key={h} className="text-sm text-slate-700 leading-snug pl-3 border-l-2 border-slate-200">
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <IsolatedResearch plan="observer" briefs={report.briefs} assembly={report.assembly} compact={false} />

        <section className="mt-4 mb-12 rounded-2xl bg-[#0052d9] text-white p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
            Run this kernel on a name you already hold
          </h2>
          <p className="text-blue-100 max-w-2xl mb-6 leading-relaxed">
            This page is a canned Observer-scale sample so you can see method checks, source notes,
            and the split. Live desks staff your seating plan on your ticker. Register or sign in —
            empty seats stay empty, and nothing here is a buy ticket.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <AuthGateLink
              href="/dashboard"
              guestHref="/register"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#0052d9] font-semibold px-6 py-3 rounded-xl hover:bg-blue-50"
            >
              Register and open the desk
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </AuthGateLink>
            <AuthGateLink
              href="/dashboard"
              guestHref="/login"
              className="inline-flex items-center justify-center gap-2 border border-white/40 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10"
            >
              Sign in
            </AuthGateLink>
          </div>
        </section>
      </article>
      <Footer />
    </>
  );
}
