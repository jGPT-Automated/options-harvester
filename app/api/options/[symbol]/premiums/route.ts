import { NextResponse } from 'next/server';
import { getOptionsChain } from '@/lib/providers';

/**
 * API route for comparing option premiums across multiple expiries. It
 * accepts the following query parameters:
 *  - `direction`: "call" or "put" (defaults to "call")
 *  - `targetPrice`: a numeric strike target around which to select
 *    contracts
 *  - `expiries`: a comma‑separated list of expiry dates to compare
 *
 * The response contains an array of objects with `expiry`, `strike` and
 * `premium` (mid price) for the closest strike in each expiry.
 */
export async function GET(
  req: Request,
  { params }: { params: { symbol: string } }
) {
  const { symbol } = params;
  const url = new URL(req.url);
  const direction = (url.searchParams.get('direction') || 'call').toLowerCase();
  const targetPrice = parseFloat(url.searchParams.get('targetPrice') || '');
  const expiriesParam = url.searchParams.get('expiries');

  if (!expiriesParam || isNaN(targetPrice)) {
    return NextResponse.json(
      { error: 'Missing required query parameters: targetPrice and expiries' },
      { status: 400 }
    );
  }
  const expiries = expiriesParam.split(',');
  const results: { expiry: string; strike: number; premium: number }[] = [];
  try {
    for (const expiry of expiries) {
      const chain = await getOptionsChain(symbol, expiry);
      const filtered = chain.filter(
        (c) => c.type?.toLowerCase() === direction
      );
      // Find the contract with strike closest to the target price
      let closest: any = null;
      for (const c of filtered) {
        if (!closest) {
          closest = c;
        } else {
          if (
            Math.abs(c.strike - targetPrice) <
            Math.abs(closest.strike - targetPrice)
          ) {
            closest = c;
          }
        }
      }
      if (closest) {
        const bid = closest.bid ?? 0;
        const ask = closest.ask ?? 0;
        const mid = (bid + ask) / 2;
        results.push({ expiry, strike: closest.strike, premium: mid });
      }
    }
    return NextResponse.json({ results });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error?.message || 'Failed to compute premiums' },
      { status: 500 }
    );
  }
}
