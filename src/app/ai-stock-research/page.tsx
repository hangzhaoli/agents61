import { FeatureRoute, featureMetadata } from '@/lib/seo/feature-page';

export const metadata = featureMetadata('ai-stock-research');
export default function Page() {
  return <FeatureRoute slug="ai-stock-research" />;
}
