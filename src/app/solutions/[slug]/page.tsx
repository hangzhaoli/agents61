import { notFound } from 'next/navigation';
import SeoHubPage from '@/components/seo/SeoHubPage';
import { getSolution, SOLUTION_HUBS } from '@/lib/seo/solution-hubs';
import { pageMeta } from '@/lib/seo/meta';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return SOLUTION_HUBS.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const hub = getSolution(slug);
  if (!hub) return {};
  return pageMeta({ title: hub.title, description: hub.description, path: hub.path, keywords: [hub.keyword] });
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const hub = getSolution(slug);
  if (!hub) notFound();
  return <SeoHubPage hub={hub} />;
}
