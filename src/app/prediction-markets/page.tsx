import { redirect } from 'next/navigation';

/** Legacy path — permanently redirected to /predictions via next.config + this guard. */
export default function LegacyPredictionMarketsRedirect() {
  redirect('/predictions');
}
