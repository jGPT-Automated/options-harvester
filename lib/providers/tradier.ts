import { OptionContract } from '../types';

const BASE_URL = process.env.TRADIER_API_BASE ?? 'https://api.tradier.com/v1';

function getAuthHeader() {
  const token = process.env.TRADIER_TOKEN;
  if (!token) throw new Error('Tradier API token is not set');
  return { Authorization: `Bearer ${token}` };
}

/**
 * Fetch list of expiration dates for a symbol from Tradier. Returns array of
 * YYYY-MM-DD strings.
 */
export async function fetchExpirations(symbol: string): Promise<string[]> {
  const url = `${BASE_URL}/markets/options/expirations?symbol=${encodeURIComponent(symbol)}`;
  const res = await fetch(url, {
    headers: { ...getAuthHeader(), Accept: 'application/json' },
    cache: 'no-store'
  });
  if (!res.ok) throw new Error(`Tradier expirations error: ${res.status}`);
  const data = await res.json();
  const dates: string[] = data?.expirations?.date ?? [];
  return dates;
}

/**
 * Fetch option chain for a symbol and expiration from Tradier. Normalizes
 * values into OptionContract objects.
 */
export async function fetchChain(symbol: string, expiration: string): Promise<OptionContract[]> {
  const url = `${BASE_URL}/markets/options/chains?symbol=${encodeURIComponent(symbol)}&expiration=${expiration}&greeks=true`;
  const res = await fetch(url, {
    headers: { ...getAuthHeader(), Accept: 'application/json' },
    cache: 'no-store'
  });
  if (!res.ok) throw new Error(`Tradier chain error: ${res.status}`);
  const data = await res.json();
  const optionsArray = data?.options?.option;
  if (!optionsArray) return [];
  return optionsArray.map((opt: any) => {
    const iv = opt.greeks?.mid_iv ?? opt.greeks?.ask_iv ?? opt.greeks?.bid_iv;
    return {
      symbol: opt.symbol,
      type: opt.option_type === 'call' ? 'call' : 'put',
      strike: opt.strike,
      expiration: opt.expiration_date,
      lastPrice: opt.last ?? null,
      bid: opt.bid ?? null,
      ask: opt.ask ?? null,
      volume: opt.volume ?? null,
      openInterest: opt.open_interest ?? null,
      impliedVolatility:
        iv !== null && iv !== undefined ? parseFloat((iv * 100).toFixed(2)) : null
    } as OptionContract;
  });
}