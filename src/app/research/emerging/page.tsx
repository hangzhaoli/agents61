import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { EM_NAMES, EM_THEMES } from '@/lib/emerging-markets';
import { pageMeta, PAGE_DESCRIPTIONS } from '@/lib/seo/meta';
import type { Metadata } from 'next';

export const metadata: Metadata = pageMeta({
  title: 'Emerging-market ADR stock research',
  description: PAGE_DESCRIPTIONS.emerging,
  path: '/research/emerging',
});

export default function EmergingResearchPage() {
  return (
    <>
      <Navbar />
      <div className="section-container py-16">
        <div className="max-w-3xl mb-12">
          <div className="badge badge-primary mb-4">Emerging markets</div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            US-listed window, not a local-exchange ticket
          </h1>
          <p className="text-lg text-slate-600">
            English-speaking US investors first. ADRs and US names with EM cash flows. Policy,
            FX, and listing structure sit beside P/E and P/B. Isolated masters, then a clerk.
            No buy button.
          </p>
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-4">Themes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-12">
          {EM_THEMES.map((t) => (
            <div key={t.id} className="rounded-xl border border-slate-100 p-4">
              <div className="text-sm font-semibold text-slate-900">{t.title}</div>
              <div className="text-xs text-slate-400 mt-1">Strength {t.strength}/10</div>
              <div className="mt-2 flex flex-wrap gap-1">
                {t.regions.map((r) => (
                  <span key={r} className="badge badge-neutral text-[10px]">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-4">Sample names (homework, not a list to buy)</h2>
        <div className="overflow-x-auto card mb-10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Ticker</th>
                <th className="py-3 px-4">Region</th>
                <th className="py-3 px-4">Theme</th>
                <th className="py-3 px-4">Why on the board</th>
                <th className="py-3 px-4">Report</th>
              </tr>
            </thead>
            <tbody>
              {EM_NAMES.map((n) => (
                <tr key={n.ticker} className="border-b border-slate-100 last:border-0 align-top">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{n.ticker}</div>
                    <div className="text-xs text-slate-500">{n.name}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{n.region}</td>
                  <td className="py-3 px-4 text-slate-600">{n.theme}</td>
                  <td className="py-3 px-4 text-slate-600">{n.whyOnBoard}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <Link
                      href={`/stocks/${n.ticker.toLowerCase()}`}
                      className="font-semibold text-[#0052d9] hover:underline"
                    >
                      Open report →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Link href="/dashboard?entry=analyze" className="btn-primary">
          Ask the desk about emerging markets
        </Link>
      </div>
      <Footer />
    </>
  );
}
