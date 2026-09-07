import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import {
  ArrowRight,
  Bitcoin,
  GitMerge,
  Lock,
  Scale,
  ShieldCheck,
  Users,
} from 'lucide-react';
import AuthGateLink from '@/components/auth/AuthGateLink';
import { pageMeta, PAGE_DESCRIPTIONS } from '@/lib/seo/meta';
import JsonLd from '@/components/seo/JsonLd';

export const metadata = pageMeta({
  title: 'Features — AI stock research committee',
  description: PAGE_DESCRIPTIONS.features,
  path: '/features',
  keywords: [
    'AI stock analysis',
    'investment research features',
    'multi-agent stock research',
    'stock screener vs research report',
    'crypto on-chain research',
    'red team stock idea',
  ],
});

const FEATURES = [
  {
    icon: Lock,
    title: 'Isolated master briefs',
    body: 'Each unlocked seat writes stock analysis alone — Buffett, Graham, Lynch, Burry. No group chat. No copilot that agrees with you.',
  },
  {
    icon: GitMerge,
    title: 'Division of labor',
    body: 'Optional pipeline handoff: trend → cycle → selection → debate. Later seats may reference earlier notes. Same group stays silent.',
  },
  {
    icon: Users,
    title: 'Lineup & screen',
    body: 'Pick masters, pick US stocks, crypto, or emerging ADRs, screen a board. Overlap is counted. It is not a buy list.',
  },
  {
    icon: Scale,
    title: 'Red-team debate',
    body: 'Short-side seats try to kill the thesis before a clerk summary. Inversion is a pipeline step, not a balanced paragraph.',
  },
  {
    icon: Bitcoin,
    title: 'On-chain board',
    body: 'BTC, ETH, SOL and the crypto desk. Settlement, usage, policy — not a P/E forced onto tokens.',
  },
  {
    icon: ShieldCheck,
    title: 'Quant always on',
    body: 'Thorp, Simons, and platform-quant seats refuse stories without significance. Size as if variance is understated.',
  },
];

export default function FeaturesPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Agents61 features',
          description: PAGE_DESCRIPTIONS.features,
          url: 'https://agents61.com/features',
        }}
      />
      <Navbar />
      <div className="section-container py-16">
        <div className="max-w-3xl mb-12">
          <div className="badge badge-primary mb-4">Features</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            Stock research with a committee, not a chatbot
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Agents61 is AI investment research for intermediate US investors: fundamental analysis,
            red-team debate, cycle notes, and on-chain due diligence. It is not Yahoo Finance, not
            a Bloomberg terminal, and not ChatGPT with extra names.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0052d9]/10 text-[#0052d9] mb-4">
                <f.icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <h2 className="text-lg font-bold text-slate-900">{f.title}</h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <AuthGateLink href="/dashboard" className="btn-primary">
            Open the desk
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </AuthGateLink>
          <Link href="/how-it-works" className="btn-secondary">
            How it works
          </Link>
          <Link href="/compare" className="btn-secondary">
            vs Yahoo, Seeking Alpha, ChatGPT
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
