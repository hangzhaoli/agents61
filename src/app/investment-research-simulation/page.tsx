import { FeatureRoute, featureMetadata } from '@/lib/seo/feature-page';

export const metadata = featureMetadata('investment-research-simulation');
export default function Page() {
  return <FeatureRoute slug="investment-research-simulation" />;
}
