import { getPerpBacktest } from '@/lib/quant-lab/perp-candles';
import { findContract } from '@/lib/quant-lab/perp-universe';
import { parseUsBookStyle } from '@/lib/quant-lab/us-books';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const spec = findContract(url.searchParams.get('symbol'));
  const style = parseUsBookStyle(url.searchParams.get('style'), spec.kind === 'equity');
  const result = await getPerpBacktest(spec.symbol, style);
  return Response.json(result);
}
