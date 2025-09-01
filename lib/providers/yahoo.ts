import { OptionContract } from '../types';

const BASE_URL = 'https://query1.finance.yahoo.com/v7/finance/options';

function unixToYmd(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export async function fetchExpirations(symbol: string): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(symbol)}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Yahoo expirations error: ${res.status}`);
  const data = await res.json();
  const dates: number[] = data?.optionChain?.result?.[0]?.expirationDates ?? [];
  return dates.map(unixToYmd);
}

export async function fetchChain(symbol: string, expiration: string): Promise<OptionContract[]> {
  // convert YYYY-MM-DD to unix timestamp (seconds)
  const ts = Math.floor(new Date(`${expiration}T00:00:00Z`).getTime() / 1000);
  const url = `${BASE_URL}/${encodeURIComponent(symbol)}?date=${ts}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Yahoo chain error: ${res.status}`);
  const data = await res.json();
  const option = data?.optionChain?.result?.[0]?.options?.[0];
  if (!option) return [];
  const parseSide = (contracts: any[], type: 'call' | 'put'): OptionContract[] =>
    contracts.map((opt: any) => {
      const ivRaw = opt.impliedVolatility;
      const iv = ivRaw !== undefined && ivRaw !== null ? parseFloat((ivRaw * 100).toFixed(2)) : null;
      return {
        symbol: opt.contractSymbol,
        type,
        strike: opt.strike,
        expiration: unixToYmd(opt.expiration),
        lastPrice: opt.lastPrice ?? null,
        bid: opt.bid ?? null,
        ask: opt.ask ?? null,
        volume: opt.volume ?? null,
        openInterest: opt.openInterest ?? null,
        impliedVolatility: iv,
      } as OptionContract;
    });
  const calls = parseSide(option.calls ?? [], 'call');
  const puts = parseSide(option.puts ?? [], 'put');
  return [...calls, ...puts];
}
