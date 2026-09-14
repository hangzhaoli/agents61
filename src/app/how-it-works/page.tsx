import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import AuthGateLink from '@/components/auth/AuthGateLink';
import { pageMeta, PAGE_DESCRIPTIONS } from '@/lib/seo/meta';
import JsonLd from '@/components/seo/JsonLd';

export const metadata = pageMeta({
  title: 'How it works — isolated then assembled stock research',
  description: PAGE_DESCRIPTIONS.howItWorks,
  path: '/how-it-works',
  keywords: [
    'how to research a stock before buying',
    'AI investment committee',
    'how Agents61 works',
    'isolated research briefs',
    'multi-agent debate stocks',
  ],
});

const STEPS = [
  {
    n: '01',
    title: 'Enter the desk',
    body: 'Register, pick a seating plan (16 / 29 / 48 / 61), then open the committee dashboard. Locked seats stay empty.',
  },
  {
    n: '02',
    title: 'Choose how seats write',
    body: 'Isolated: nobody reads a peer. Division of labor: later pipeline groups may reference earlier notes. Same group stays silent.',
  },
  {
    n: '03',
    title: 'Ask a question or screen a market',
    body: 'Type a US ticker, scan opportunities, open the crypto board, or line up masters against US stocks, on-chain names, or emerging ADRs.',
  },
  {
    n: '04',
    title: 'Confirm the agenda',
    body: 'The desk names who will write and which pipeline steps run. You confirm before compute spends.',
  },
  {
    n: '05',
    title: 'Read briefs, then the clerk',
    body: 'Each master returns stance, why, risks, and what would change their mind. Deep seats also show method checks and source notes. The clerk stacks agreements and splits — never a buy rating.',
  },
];

const FAQS = [
  {
    q: 'Is this investment advice?',
    a: 'No. Agents61 is a research simulation and educational publication. Isolated briefs never say you should buy. There is no buy button and no order routing.',
  },
  {
    q: 'How is this different from ChatGPT stock analysis?',
    a: 'A chatbot writes one fluent memo. Agents61 runs named seats that cannot see each other (or only read earlier pipeline steps). A clerk keeps the split.',
  },
  {
    q: 'Can I use it like Yahoo Finance?',
    a: 'No. We are not a quote terminal. Keep Yahoo or Bloomberg for prices. Use the committee for thesis, inversion, and cycle notes.',
  },
  {
    q: 'What markets are covered?',
    a: 'US listed stocks first, US ETFs adjacent, crypto/on-chain, and US-listed emerging-market ADRs. A-shares later.',
  },
];

export default function HowItWorksPage() {
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <JsonLd data={faqLd} />
      <Navbar />
      <div className="section-container py-16">
        <div className="max-w-3xl mb-12">
          <div className="badge badge-primary mb-4">How it works</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            From question to committee report
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            How to research a stock with an AI investment committee: staff seats, pick Isolated or
            Division of labor, convene, read the split. Homework — not a signal.
          </p>
          <aside className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/80 p-5 text-sm text-slate-700 leading-relaxed">
            <div className="text-xs font-bold tracking-widest text-[#0052d9] mb-2">
              Definition for citations
            </div>
            <p>
              <strong>Agents61</strong> is a 61-master AI investment committee for US stock
              research, ETFs, and on-chain names. Seats write in isolation or as a pipeline
              handoff; a clerk stacks disagreements. It is a research simulation — not investment
              advice, not Yahoo Finance, not ChatGPT. Machine brief:{' '}
              <a href="/llms.txt" className="font-semibold text-[#0052d9] hover:underline">
                llms.txt
              </a>
              .
            </p>
          </aside>
        </div>

        <ol className="space-y-4 max-w-3xl">
          {STEPS.map((s) => (
            <li key={s.n} className="card p-6 flex gap-4">
              <span className="text-xs font-bold tracking-widest text-[#0052d9] shrink-0 mt-1">
                {s.n}
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{s.title}</h2>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="max-w-3xl mt-14">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Questions people actually search</h2>
          <div className="space-y-4">
            {FAQS.map((f) => (
              <div key={f.q} className="rounded-2xl border border-slate-100 p-5">
                <h3 className="text-base font-bold text-slate-900">{f.q}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <AuthGateLink href="/dashboard" className="btn-primary">
            Enter desk
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </AuthGateLink>
          <Link href="/features" className="btn-secondary">
            Feature list
          </Link>
          <Link href="/demo" className="btn-secondary">
            Kernel sample report
          </Link>
          <Link href="/methodology" className="btn-secondary">
            How personas are built
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
