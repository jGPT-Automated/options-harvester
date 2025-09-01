import { NextResponse } from 'next/server';
import { getExpiries } from '@/lib/providers';

/**
 * API route for retrieving option expiration dates for a given symbol.
 * The symbol is provided via the dynamic route parameter. On success,
 * returns a JSON object with an `expiries` array. On failure, returns
 * a 500 status with an error message.
 */
export async function GET(
  _req: Request,
  { params }: { params: { symbol: string } }
) {
  const { symbol } = params;
  try {
    const expiries = await getExpiries(symbol);
    return NextResponse.json({ expiries });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch expiries' },
      { status: 500 }
    );
  }
}
