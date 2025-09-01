'use client';

import React from 'react';
import { OptionContract } from '@/lib/types';

interface Props {
  chain: OptionContract[];
}

export default function OptionChainTable({ chain }: Props) {
  if (!chain || chain.length === 0) {
    return <div>No options data</div>;
  }
  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="px-2 py-1 border">Strike</th>
            <th className="px-2 py-1 border">Type</th>
            <th className="px-2 py-1 border">Expiration</th>
            <th className="px-2 py-1 border">Bid</th>
            <th className="px-2 py-1 border">Ask</th>
            <th className="px-2 py-1 border">Last</th>
            <th className="px-2 py-1 border">Volume</th>
            <th className="px-2 py-1 border">Open Int</th>
            <th className="px-2 py-1 border">IV%</th>
          </tr>
        </thead>
        <tbody>
          {chain.map((opt) => (
            <tr key={`${opt.symbol}-${opt.strike}-${opt.expiration}-${opt.type}`}> 
              <td className="px-2 py-1 border">{opt.strike}</td>
              <td className="px-2 py-1 border capitalize">{opt.type}</td>
              <td className="px-2 py-1 border">{opt.expiration}</td>
              <td className="px-2 py-1 border">{opt.bid}</td>
              <td className="px-2 py-1 border">{opt.ask}</td>
              <td className="px-2 py-1 border">{opt.lastPrice}</td>
              <td className="px-2 py-1 border">{opt.volume}</td>
              <td className="px-2 py-1 border">{opt.openInterest}</td>
              <td className="px-2 py-1 border">{opt.impliedVolatility}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
