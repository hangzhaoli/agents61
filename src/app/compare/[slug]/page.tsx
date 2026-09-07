import { notFound } from 'next/navigation';
import CompareHubPage from '@/components/seo/CompareHubPage';
import { COMPARE_HUBS, getCompareHub } from '@/lib/seo/compare-hubs';
import { pageMeta } from '@/lib/seo/meta';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return COMPARE_HUBS.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const hub = getCompareHub(slug);
  if (!hub) return {};
  return pageMeta({
    title: hub.title,
    description: hub.description,
    path: `/compare/${hub.slug}`,
    keywords: [hub.keyword, `${hub.competitor} alternative`],
  });
}

export default async function CompareSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const hub = getCompareHub(slug);
  if (!hub) notFound();
  return <CompareHubPage hub={hub} />;
}
