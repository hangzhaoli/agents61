import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import AuthGateLink from '@/components/auth/AuthGateLink';
import { pageMeta, PAGE_DESCRIPTIONS } from '@/lib/seo/meta';
import JsonLd from '@/components/seo/JsonLd';
import { COMPARE_HUBS } from '@/lib/seo/compare-hubs';

export const metadata = pageMeta({
  title: 'Agents61 vs Yahoo Finance, Seeking Alpha, and ChatGPT',
  description: PAGE_DESCRIPTIONS.compare,
  path: '/compare',
  keywords: [
    'Seeking Alpha alternative',
    'Yahoo Finance stock analysis',
    'ChatGPT stock analysis',
    'Bloomberg terminal alternative for retail',
    'compare stock research tools',
  ],
});

const ROWS: { label: string; a61: string; yahoo: string; sa: string; gpt: string }[] = [
  {
    label: 'Job',
    a61: 'Investment committee simulation',
    yahoo: 'Quotes, charts, filings links',
    sa: 'Articles and ratings',
    gpt: 'One fluent memo',
  },
  {
    label: 'Stock analysis',
    a61: 'Named masters, isolated or handoff',
    yahoo: 'Data first',
    sa: 'Author narrative',
    gpt: 'Single model voice',
  },
  {
    label: 'Red team / inversion',
    a61: 'Dedicated debate seats',
    yahoo: 'Not the product',
    sa: 'Sometimes, uneven',
    gpt: 'Only if you prompt it',
  },
  {
    label: 'Buy button / rating',
    a61: 'None. Splits stay splits',
    yahoo: 'Not advice; still a tape',
    sa: 'Ratings are the hook',
    gpt: 'Often sounds like a call',
  },
  {
    label: 'Crypto / on-chain',
    a61: 'Separate board, no fake P/E',
    yahoo: 'Prices if listed',
    sa: 'Mixed',
    gpt: 'Generic writeup',
  },
  {
    label: 'Best for',
    a61: 'Intermediate investors who already research',
    yahoo: 'Checking a last price',
    sa: 'Reading one thesis',
    gpt: 'A first draft, not a committee',
  },
];

export default function ComparePage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Agents61 vs Yahoo Finance, Seeking Alpha, ChatGPT',
          description: PAGE_DESCRIPTIONS.compare,
          url: 'https://agents61.com/compare',
        }}
      />
      <Navbar />
      <div className="section-container py-16">
        <div className="max-w-3xl mb-12">
          <div className="badge badge-primary mb-4">Compare</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            Not a terminal. Not an article mill. Not a chatbot.
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Traditional finance websites (Yahoo Finance, TradingView, Koyfin, Bloomberg) win at
            data. Seeking Alpha and similar stock-analysis sites win at a human byline. ChatGPT
            wins at speed. Agents61 is for when you need an investment committee to disagree on
            purpose.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full text-sm min-w-[40rem]">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100 bg-slate-50/80">
                <th className="py-3 px-4"> </th>
                <th className="py-3 px-4 text-[#0052d9] font-bold">Agents61</th>
                <th className="py-3 px-4">Yahoo Finance</th>
                <th className="py-3 px-4">Seeking Alpha</th>
                <th className="py-3 px-4">ChatGPT</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.label} className="border-b border-slate-50 last:border-0 align-top">
                  <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">{r.label}</td>
                  <td className="py-3 px-4 text-slate-800">{r.a61}</td>
                  <td className="py-3 px-4 text-slate-600">{r.yahoo}</td>
                  <td className="py-3 px-4 text-slate-600">{r.sa}</td>
                  <td className="py-3 px-4 text-slate-600">{r.gpt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-8 max-w-3xl text-sm text-slate-600 leading-relaxed">
          Keep the tape you already use. Add a desk that will invert the idea: Buffett and Wood
          on the same ticker without averaging, Einhorn on earnings quality, Dalio on the cycle,
          Thorp on size. Research simulation — not a FactSet replacement, not personalized advice.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-16 mb-3">Named comparisons</h2>
        <p className="text-sm text-slate-600 mb-6 max-w-2xl">
          Same desk, one competitor per page. Each page says when the other product wins.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {COMPARE_HUBS.map((h) => (
            <Link key={h.slug} href={`/compare/${h.slug}`} className="card p-5 block group">
              <p className="text-xs text-slate-400 mb-1">vs {h.competitor}</p>
              <h3 className="font-bold text-slate-900 group-hover:text-[#0052d9] transition-colors">
                {h.h1}
              </h3>
              <p className="text-sm text-slate-600 mt-2 line-clamp-3">{h.description}</p>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <AuthGateLink href="/dashboard" className="btn-primary">
            Try the committee
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </AuthGateLink>
          <Link href="/blog/vs-yahoo-seeking-alpha-chatgpt" className="btn-secondary">
            Longer note
          </Link>
          <Link href="/alternatives" className="btn-secondary">
            Alternatives index
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
