export interface OptionContract {
  symbol: string;
  type: 'call' | 'put';
  strike: number;
  expiration: string;
  lastPrice?: number;
  bid: number | null;
  ask: number | null;
  volume: number | null;
  openInterest: number | null;
  impliedVolatility: number | null;
}
