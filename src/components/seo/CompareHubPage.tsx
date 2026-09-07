import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AuthGateLink from '@/components/auth/AuthGateLink';
import JsonLd from '@/components/seo/JsonLd';
import type { CompareHub } from '@/lib/seo/hub-types';

export default function CompareHubPage({ hub }: { hub: CompareHub }) {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: hub.h1,
          description: hub.description,
          url: `https://agents61.com/compare/${hub.slug}`,
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: hub.faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        }}
      />
      <Navbar />
      <article className="section-container py-16">
        <div className="max-w-3xl mb-10">
          <p className="badge badge-primary mb-4">{hub.eyebrow}</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">{hub.h1}</h1>
          <p className="text-lg text-slate-600 leading-relaxed">{hub.intro}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <AuthGateLink href="/dashboard" className="btn-primary">
              Try the committee
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </AuthGateLink>
            <Link href="/compare" className="btn-secondary">
              All comparisons
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-10 max-w-4xl">
          <div className="card-flat p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2">
              When {hub.competitor} wins
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">{hub.whenCompetitorWins}</p>
          </div>
          <div className="card-flat p-5 border-[#0052d9]/20">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#0052d9] mb-2">
              When Agents61 wins
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">{hub.whenA61Wins}</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-100 mb-12">
          <table className="w-full text-sm min-w-[36rem]">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100 bg-slate-50/80">
                <th className="py-3 px-4"> </th>
                <th className="py-3 px-4 text-[#0052d9] font-bold">Agents61</th>
                <th className="py-3 px-4">{hub.competitor}</th>
              </tr>
            </thead>
            <tbody>
              {hub.rows.map((r) => (
                <tr key={r.feature} className="border-b border-slate-50 last:border-0 align-top">
                  <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">{r.feature}</td>
                  <td className="py-3 px-4 text-slate-800">{r.a61}</td>
                  <td className="py-3 px-4 text-slate-600">{r.competitor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section className="max-w-3xl mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Questions</h2>
          {hub.faqs.map((f) => (
            <details key={f.question} className="card-flat p-5 mb-3">
              <summary className="font-semibold text-slate-900 cursor-pointer">{f.question}</summary>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">{f.answer}</p>
            </details>
          ))}
        </section>

        <section className="max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Related</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {hub.related.map((r) => (
              <Link key={r.href} href={r.href} className="card-flat p-4 text-sm font-medium hover:text-[#0052d9]">
                {r.label}
              </Link>
            ))}
          </div>
        </section>
        <p className="mt-10 text-xs text-slate-400 max-w-3xl">
          Not a {hub.competitor} replacement for every job. Research simulation — not advice, no buy button.
        </p>
      </article>
      <Footer />
    </>
  );
}
