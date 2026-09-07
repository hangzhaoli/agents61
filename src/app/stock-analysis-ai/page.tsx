import { FeatureRoute, featureMetadata } from '@/lib/seo/feature-page';

export const metadata = featureMetadata('stock-analysis-ai');
export default function Page() {
  return <FeatureRoute slug="stock-analysis-ai" />;
}
