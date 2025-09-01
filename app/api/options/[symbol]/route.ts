import { NextResponse } from 'next/server';
import { getOptionsChain } from '@/lib/providers';

/**
 * API route for retrieving an options chain for a given symbol and
 * expiration. The expiration date is provided via the `expiry` query
 * parameter. Returns an array of `OptionContract` objects on success.
 */
export async function GET(
  req: Request,
  { params }: { params: { symbol: string } }
) {
  const { symbol } = params;
  const url = new URL(req.url);
  const expiry = url.searchParams.get('expiry');
  if (!expiry) {
    return NextResponse.json(
      { error: 'Missing required query parameter: expiry' },
      { status: 400 }
    );
  }
  try {
    const contracts = await getOptionsChain(symbol, expiry);
    return NextResponse.json({ contracts });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch options chain' },
      { status: 500 }
    );
  }
}
