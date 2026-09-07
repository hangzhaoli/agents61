import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import JsonLd from '@/components/seo/JsonLd';
import type { LearnGuide } from '@/lib/seo/hub-types';

export default function LearnGuidePage({ guide }: { guide: LearnGuide }) {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: guide.h1,
          description: guide.description,
          totalTime: `PT${guide.minutes}M`,
          step: guide.steps.map((s, i) => ({
            '@type': 'HowToStep',
            position: i + 1,
            name: s.heading,
            text: s.body,
          })),
        }}
      />
      <Navbar />
      <article className="section-container py-16 max-w-3xl">
        <p className="badge badge-primary mb-4">Learn · {guide.minutes} min</p>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-8">{guide.h1}</h1>
        <ol className="space-y-6">
          {guide.steps.map((s, i) => (
            <li key={s.heading} className="card-flat p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Step {i + 1}</p>
              <h2 className="text-lg font-bold text-slate-900 mb-2">{s.heading}</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{s.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex flex-wrap gap-3">
          {guide.next.map((n) => (
            <Link key={n.href} href={n.href} className="btn-secondary">
              {n.label}
            </Link>
          ))}
        </div>
        <p className="mt-10 text-xs text-slate-400">Research simulation. Not advice.</p>
      </article>
      <Footer />
    </>
  );
}
