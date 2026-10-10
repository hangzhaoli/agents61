import { FeatureRoute, featureMetadata } from '@/lib/seo/feature-page';

export const metadata = featureMetadata('ai-quant-lab');
export default function Page() {
  return <FeatureRoute slug="ai-quant-lab" />;
}