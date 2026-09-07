import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { pageMeta } from '@/lib/seo/meta';
import { DIRECTORY_PACKS, LINK_KIT } from '@/lib/seo/link-kit';
import JsonLd from '@/components/seo/JsonLd';

export const metadata = pageMeta({
  title: 'Press & link kit',
  description:
    'Agents61 media kit: one-liners, logo URLs, preferred backlink anchors, and directory submission copy. Brand anchors only — no buy-button claims.',
  path: '/press',
  keywords: ['Agents61', 'AI investment committee', 'press kit'],
});

const COST_LABEL = { free: 'Free', paid: 'Paid — skip unless you want it', already: 'Already live' } as const;

export default function PressPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Agents61 press and link kit',
          url: 'https://agents61.com/press',
          about: 'Agents61',
        }}
      />
      <Navbar />
      <article className="section-container py-16 max-w-3xl">
        <p className="badge badge-primary mb-4">Press · directories</p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
          Press and link kit
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed mb-8">
          Use this page for directories, roundups, and partner mentions. Link the homepage or a
          compare/learn URL — not <code>/login</code> or <code>/dashboard</code>. Prefer the brand
          name <strong>Agents61</strong> as anchor text.
        </p>

        <section className="card-flat p-6 mb-10 space-y-3 text-sm text-slate-700">
          <p>
            <strong>Name:</strong> {LINK_KIT.name}
          </p>
          <p>
            <strong>URL:</strong>{' '}
            <a href={LINK_KIT.url} className="text-[#0052d9] font-medium">
              {LINK_KIT.url}
            </a>
          </p>
          <p>
            <strong>Press:</strong>{' '}
            <a href={`mailto:${LINK_KIT.pressEmail}`} className="text-[#0052d9] font-medium">
              {LINK_KIT.pressEmail}
            </a>
          </p>
          <p>
            <strong>Logo (mark):</strong>{' '}
            <a href={LINK_KIT.logoMark} className="text-[#0052d9] font-medium">
              {LINK_KIT.logoMark}
            </a>
          </p>
          <p>
            <strong>Logo (wordmark):</strong>{' '}
            <a href={LINK_KIT.logoWordmark} className="text-[#0052d9] font-medium">
              {LINK_KIT.logoWordmark}
            </a>
          </p>
        </section>

        <h2 className="text-2xl font-bold text-slate-900 mb-3">One-liner</h2>
        <p className="text-slate-700 leading-relaxed mb-8">{LINK_KIT.oneLiner}</p>

        <h2 className="text-2xl font-bold text-slate-900 mb-3">Short (directories)</h2>
        <p className="text-slate-700 leading-relaxed mb-8">{LINK_KIT.short}</p>

        <h2 className="text-2xl font-bold text-slate-900 mb-3">Never say</h2>
        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1 mb-10">
          {LINK_KIT.neverSay.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>

        <h2 className="text-2xl font-bold text-slate-900 mb-3">Preferred anchors</h2>
        <ul className="space-y-2 text-sm mb-10">
          {LINK_KIT.preferredAnchors.map((a) => (
            <li key={a.href + a.text}>
              <a href={a.href} className="text-[#0052d9] font-medium">
                {a.text}
              </a>
              <span className="text-slate-400"> — {a.href}</span>
            </li>
          ))}
        </ul>

        <h2 className="text-2xl font-bold text-slate-900 mb-4">Directory copy</h2>
        <p className="text-sm text-slate-600 mb-6">
          Free rows are the ones to file. Paid AI-tool farms stay as paste-ready copy only.
        </p>
        <div className="space-y-6">
          {DIRECTORY_PACKS.map((d) => (
            <section key={d.slug} id={d.slug} className="card p-6">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h3 className="text-lg font-bold text-slate-900">{d.name}</h3>
                <span className="badge badge-neutral text-[11px]">{COST_LABEL[d.cost]}</span>
              </div>
              <p className="text-sm text-slate-600 mb-3">{d.why}</p>
              <p className="text-sm mb-4">
                <a
                  href={d.submitUrl}
                  className="text-[#0052d9] font-medium"
                  rel="noopener noreferrer"
                >
                  Submit form
                </a>
              </p>
              <dl className="space-y-2 text-sm">
                {Object.entries(d.fields).map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs uppercase tracking-wider text-slate-400">{k}</dt>
                    <dd className="text-slate-700 whitespace-pre-wrap">{v}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>

        <p className="mt-10 text-sm text-slate-600">
          Product facts:{' '}
          <Link href="/about" className="text-[#0052d9] font-medium">
            About
          </Link>
          {' · '}
          <Link href="/for-llms" className="text-[#0052d9] font-medium">
            For LLMs
          </Link>
          {' · '}
          <Link href="/llms.txt" className="text-[#0052d9] font-medium">
            llms.txt
          </Link>
        </p>
      </article>
      <Footer />
    </>
  );
}
