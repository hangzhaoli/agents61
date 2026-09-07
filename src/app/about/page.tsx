import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { RESEARCH_PROTOCOL, PLANS } from '@/lib/tiers';
import AuthGateLink from '@/components/auth/AuthGateLink';
import { pageMeta, PAGE_DESCRIPTIONS } from '@/lib/seo/meta';
import type { Metadata } from 'next';

export const metadata: Metadata = pageMeta({
  title: 'About the 61-master investment committee',
  description: PAGE_DESCRIPTIONS.about,
  path: '/about',
});

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="section-container py-16">
        <div className="max-w-3xl">
          <div className="badge badge-primary mb-4">About</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            A committee that writes alone, then meets on paper
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Agents61 is a research simulation for intermediate US investors. Sixty-one master
            personas — from Graham to Wood — sit in a six-step pipeline. They do not share a
            group chat. Each unlocked seat writes an isolated brief. A clerk assembles
            agreements and splits. Never “you should buy.”
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12">
          {RESEARCH_PROTOCOL.steps.map((s) => (
            <div key={s.n} className="card p-6">
              <div className="text-xs font-bold tracking-widest text-[#0052d9] mb-2">Step {s.n}</div>
              <h2 className="text-lg font-bold text-slate-900">{s.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
          {(['observer', 'analyst', 'committee'] as const).map((id) => {
            const p = PLANS[id];
            return (
              <div key={id} className="rounded-2xl border border-slate-100 p-5">
                <div className="text-sm font-bold text-slate-900">{p.name}</div>
                <div className="text-3xl font-extrabold text-[#0052d9] my-1">{p.seats}</div>
                <p className="text-sm text-slate-600">{p.tagline}</p>
                <p className="text-xs text-slate-400 mt-2">{p.computeNote}</p>
              </div>
            );
          })}
        </div>

        <div className="max-w-3xl mt-14 space-y-6 text-slate-600">
          <h2 className="text-2xl font-bold text-slate-900">Who it is for</h2>
          <p>
            English-speaking intermediate US investors who already research names — roughly
            a few years in, a five- to six-figure account, value and quality readers included.
            Not a buy button for beginners. Not a Bloomberg replacement.
          </p>
          <h2 className="text-2xl font-bold text-slate-900">Who it is not</h2>
          <p>
            We are not an adviser. Reports are general, impersonal, and AI-generated.
            Personas are simulations from public books and letters, unaffiliated with the
            people. US stocks first; A-shares later.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <AuthGateLink href="/dashboard" className="btn-primary">Enter Desk</AuthGateLink>
          <Link href="/methodology" className="btn-secondary">How personas are built</Link>
          <Link href="/features" className="btn-secondary">Features</Link>
          <Link href="/how-it-works" className="btn-secondary">How it works</Link>
          <Link href="/compare" className="btn-secondary">vs Yahoo / Seeking Alpha / ChatGPT</Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
