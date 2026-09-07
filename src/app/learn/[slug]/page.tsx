import { notFound } from 'next/navigation';
import LearnGuidePage from '@/components/seo/LearnGuidePage';
import { getLearnGuide, LEARN_GUIDES } from '@/lib/seo/learn-guides';
import { pageMeta } from '@/lib/seo/meta';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return LEARN_GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getLearnGuide(slug);
  if (!guide) return {};
  return pageMeta({
    title: guide.title,
    description: guide.description,
    path: `/learn/${guide.slug}`,
  });
}

export default async function LearnSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getLearnGuide(slug);
  if (!guide) notFound();
  return <LearnGuidePage guide={guide} />;
}
