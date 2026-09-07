import { cookies } from 'next/headers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CommitteeReport from '@/components/report/CommitteeReport';
import StockDeskIntro from '@/components/stocks/StockDeskIntro';
import { getFundamentals } from '@/lib/data/fundamentals';
import { PLAN_COOKIE } from '@/lib/demo-session';
import { parsePlan } from '@/lib/tiers';
import { getTickerProfile, POPULAR_TICKERS } from '@/lib/popular-tickers';
import type { Metadata } from 'next';

export const dynamicParams = true;

interface Props {
  params: Promise<{ ticker: string }>;
  searchParams: Promise<{ plan?: string }>;
}

export function generateStaticParams() {
  return POPULAR_TICKERS.map((t) => ({ ticker: t.symbol.toLowerCase() }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ticker } = await params;
  const profile = getTickerProfile(ticker);
  const t = profile.symbol;
  const kind = profile.kind === 'etf' ? 'ETF' : 'stock';
  return {
    title: `${profile.name} (${t}) ${kind} analysis — committee report`,
    description: `${profile.whyOnDesk.slice(0, 155)} Not a buy rating. Not advice.`,
    keywords: [
      `${t} stock analysis`,
      `${profile.name} investment research`,
      `${t} stock report`,
      'AI investment committee',
      'fundamental analysis',
    ],
    alternates: { canonical: `https://agents61.com/stocks/${t.toLowerCase()}` },
  };
}

export default async function StockCommitteePage({ params, searchParams }: Props) {
  const { ticker } = await params;
  const { plan: planRaw } = await searchParams;
  const cookiePlan = (await cookies()).get(PLAN_COOKIE)?.value;
  const plan = parsePlan(planRaw ?? cookiePlan ?? 'analyst');
  const facts = await getFundamentals(ticker);
  const profile = getTickerProfile(ticker);
  const heading =
    profile.name === profile.symbol
      ? profile.symbol
      : `${profile.name} (${profile.symbol})`;

  return (
    <>
      <Navbar />
      <div className="section-container pt-12 pb-0">
        <StockDeskIntro profile={profile} />
      </div>
      <CommitteeReport ticker={ticker} facts={facts} plan={plan} heading={heading} />
      <Footer />
    </>
  );
}
