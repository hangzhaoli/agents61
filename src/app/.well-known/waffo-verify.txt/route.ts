import { NextResponse } from 'next/server';
import { waffoVerifyFileBody } from '@/lib/waffo-verify';

export const dynamic = 'force-dynamic';

export function GET() {
  const body = waffoVerifyFileBody();
  if (!body) {
    return new NextResponse('not configured', { status: 404, headers: { 'Content-Type': 'text/plain' } });
  }
  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
