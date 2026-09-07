import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LegalShell from '@/components/layout/LegalShell';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Disclosure — Agents61',
  description: 'How Agents61 uses AI: isolated master briefs, then clerk assembly. Not a group chat.',
};

export default function AiDisclosurePage() {
  return (
    <>
      <Navbar />
      <LegalShell title="AI Disclosure" updated="September 3, 2026" active="/ai-disclosure">
        <h2>How We Use AI</h2>
        <p>
          Agents61 uses large language models to power 61 AI agent personas. When you
          request a report, only the seats your plan unlocks run: Analyst 16 isolated
          prompts, Associate 29, Principal 48, Committee or Partners 61 — plus one clerk assembly pass.
          Masters do
          not read each other&apos;s drafts. Debate, when unlocked, starts after those
          briefs exist.
        </p>

        <h2>What the AI Does</h2>
        <ul>
          <li>Writes an isolated brief from filings and that persona&apos;s published rules</li>
          <li>Assembles agreements, splits, and residual risks without averaging a fake consensus</li>
          <li>On paid desks, runs red-team interrogation after isolation when those seats are unlocked</li>
          <li>On unlocked quant seats, checks sizing and significance (Kelly, factors)</li>
        </ul>

        <h2>What the AI Does NOT Do</h2>
        <ul>
          <li>Access a brokerage, display a buy button, or execute trades</li>
          <li>Provide personalized advice based on your financial situation</li>
          <li>Guarantee the accuracy of any analysis or prediction</li>
          <li>Represent the actual views of the Masters (living or deceased)</li>
          <li>Fill locked seats with silent ghost writers</li>
        </ul>

        <h2>Data Sources</h2>
        <p>
          Filing facts come from SEC EDGAR (cached). Optional model-input ratios (P/E, P/B, P/S)
          may be cached from a licensed fundamentals API and are labeled as such — not live quotes.
          Crypto snapshots, when shown, come from a public market API and are cached. On-chain
          series (MVRV, fees, TVL) stay blank until those hooks are configured. Missing numbers
          stay inconclusive.
        </p>

        <h2>Model Information</h2>
        <p>
          Live desks call DeepSeek V4 when a server key is configured: <code>deepseek-v4-flash</code>{' '}
          (checkpoint V4-Flash-0731) for methodology-card seats with thinking off, and{' '}
          <code>deepseek-v4-pro</code> (checkpoint V4-Pro-0813) for debate and verdict seats with
          thinking on. A seat that times out or fails to parse falls back to that master&apos;s
          methodology-card template so the desk still finishes. Stock report pages stay on the
          template writer so crawlers are not blocked on 16–61 model calls. Compute scales with
          unlocked seat count, not with pairwise debate. Models are commercially licensed. We do
          not use the retired aliases <code>deepseek-chat</code> or <code>deepseek-reasoner</code>.
        </p>

        <h2>Persona Disclaimer</h2>
        <p>
          The AI personas are simulations inspired by publicly available information about
          each Master&apos;s investment philosophy, published works, and documented decisions.
          They are not endorsed by, affiliated with, or representative of the actual
          individuals, their estates, or their affiliated organizations.
        </p>
      </LegalShell>
      <Footer />
    </>
  );
}
