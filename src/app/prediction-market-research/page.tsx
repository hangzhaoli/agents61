import { FeatureRoute, featureMetadata } from '@/lib/seo/feature-page';

export const metadata = featureMetadata('prediction-market-research');
export default function Page() {
  return <FeatureRoute slug="prediction-market-research" />;
}
