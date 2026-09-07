import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AuthGateLink from '@/components/auth/AuthGateLink';
import JsonLd from '@/components/seo/JsonLd';
import type { SeoHub } from '@/lib/seo/hub-types';

export default function SeoHubPage({ hub }: { hub: SeoHub }) {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: hub.h1,
          description: hub.description,
          url: `https://agents61.com${hub.path}`,
          about: hub.keyword,
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
      <article className="section-container py-16 max-w-3xl">
        <p className="badge badge-primary mb-4">{hub.eyebrow}</p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">{hub.h1}</h1>
        <p className="text-lg text-slate-600 leading-relaxed mb-6">{hub.intro}</p>
        <ul className="space-y-2 mb-8">
          {hub.bullets.map((b) => (
            <li key={b} className="text-sm text-slate-700 leading-relaxed pl-4 border-l-2 border-[#0052d9]/30">
              {b}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-3 mb-12">
          <AuthGateLink href="/dashboard" className="btn-primary">
            Open the desk
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </AuthGateLink>
          <Link href="/pricing" className="btn-secondary">
            Seating and price
          </Link>
        </div>
        {hub.sections.map((s) => (
          <section key={s.heading} className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">{s.heading}</h2>
            <p className="text-slate-600 leading-relaxed">{s.body}</p>
          </section>
        ))}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Questions</h2>
          <div className="space-y-3">
            {hub.faqs.map((f) => (
              <details key={f.question} className="card-flat p-5">
                <summary className="font-semibold text-slate-900 cursor-pointer">{f.question}</summary>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Related</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {hub.related.map((r) => (
              <Link key={r.href} href={r.href} className="card-flat p-4 text-sm font-medium text-slate-800 hover:text-[#0052d9]">
                {r.label}
              </Link>
            ))}
          </div>
        </section>
        <p className="mt-10 text-xs text-slate-400">
          Research simulation. Isolated briefs never say you should buy. No order routing.
        </p>
      </article>
      <Footer />
    </>
  );
}
