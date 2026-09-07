import SeoHubPage from '@/components/seo/SeoHubPage';
import { getFeatureHub } from '@/lib/seo/feature-hubs';
import { pageMeta } from '@/lib/seo/meta';
import { notFound } from 'next/navigation';

export function featureMetadata(slug: string) {
  const hub = getFeatureHub(slug);
  if (!hub) return {};
  return pageMeta({
    title: hub.title,
    description: hub.description,
    path: hub.path,
    keywords: [hub.keyword],
  });
}

export function FeatureRoute({ slug }: { slug: string }) {
  const hub = getFeatureHub(slug);
  if (!hub) notFound();
  return <SeoHubPage hub={hub} />;
}
