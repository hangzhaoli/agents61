import { FeatureRoute, featureMetadata } from '@/lib/seo/feature-page';

export const metadata = featureMetadata('ai-investment-committee');
export default function Page() {
  return <FeatureRoute slug="ai-investment-committee" />;
}
