import { cookies } from 'next/headers';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import IsolatedResearch from '@/components/report/IsolatedResearch';
import PlanSeatBar from '@/components/report/PlanSeatBar';
import { emptyFundamentals } from '@/lib/data/fundamentals';
import { getCryptoSnapshot } from '@/lib/data/crypto';
import { CRYPTO_ASSETS, getCryptoAsset } from '@/lib/crypto-universe';
import { PLAN_COOKIE } from '@/lib/demo-session';
import { parsePlan } from '@/lib/tiers';
import { runIsolatedResearch } from '@/lib/research';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const dynamicParams = true;

interface Props {
  params: Promise<{ asset: string }>;
  searchParams: Promise<{ plan?: string }>;
}

export async function generateStaticParams() {
  return CRYPTO_ASSETS.map((a) => ({ asset: a.symbol.toLowerCase() }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { asset } = await params;
  const row = getCryptoAsset(asset);
  const t = row?.symbol ?? asset.toUpperCase();
  return {
    title: `${t} on-chain research — crypto committee brief`,
    description: `${t} (${row?.name ?? 'crypto'}) blockchain asset analysis by isolated investment-master agents. Usage, settlement, and policy — not a forced P/E. Research simulation, not a buy signal.`,
    keywords: [
      `${t} crypto research`,
      `${t} on-chain analysis`,
      'blockchain asset analysis',
      'crypto investment committee',
    ],
  };
}

export default async function CryptoAssetPage({ params, searchParams }: Props) {
  const { asset } = await params;
  const row = getCryptoAsset(asset);
  if (!row) notFound();
  const { plan: planRaw } = await searchParams;
  const cookiePlan = (await cookies()).get(PLAN_COOKIE)?.value;
  const plan = parsePlan(planRaw ?? cookiePlan ?? 'analyst');
  const snap = await getCryptoSnapshot(row.symbol);
  const { briefs, assembly } = runIsolatedResearch(
    plan,
    row.symbol,
    emptyFundamentals(row.symbol),
    `Research ${row.symbol} (${row.name}) as a crypto/on-chain subject. Not a cash-flow equity unless proven.`,
    'crypto',
    snap
  );

  return (
    <>
      <Navbar />
      <div className="section-container py-12">
        <p className="text-xs font-semibold text-[#0052d9] mb-2">
          <Link href="/research/crypto" className="hover:underline">
            Blockchain research
          </Link>
        </p>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">
          {row.symbol} · {row.name}
        </h1>
        <p className="text-slate-500 mb-6 max-w-3xl">
          Isolated crypto/on-chain briefs, then clerk assembly. Public snapshot is cached, not a
          live quote. No buy button. Not investment advice.
        </p>
        <PlanSeatBar plan={plan} ticker={row.symbol} pathPrefix="/crypto" />
        <IsolatedResearch plan={plan} briefs={briefs} assembly={assembly} compact={plan === 'observer'} />
      </div>
      <Footer />
    </>
  );
}
