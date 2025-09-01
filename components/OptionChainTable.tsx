"use client";

import React from "react";
import { OptionContract } from "@/lib/types";

interface Props {
  /** Array of option contracts to display */
  contracts: OptionContract[];
}

/**
 * Renders a simple options chain table with common contract fields. The
 * table displays strike, type (call/put), bid, ask, last price,
 * volume, open interest and implied volatility. Missing numeric fields
 * render as a dash to avoid showing `undefined`.
 */
export default function OptionChainTable({ contracts }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1 text-left">Strike</th>
            <th className="border px-2 py-1 text-left">Type</th>
            <th className="border px-2 py-1 text-left">Bid</th>
            <th className="border px-2 py-1 text-left">Ask</th>
            <th className="border px-2 py-1 text-left">Last</th>
            <th className="border px-2 py-1 text-left">Vol</th>
            <th className="border px-2 py-1 text-left">OI</th>
            <th className="border px-2 py-1 text-left">IV</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((c, i) => (
            <tr key={i} className="odd:bg-white even:bg-gray-50">
              <td className="border px-2 py-1">{c.strike}</td>
              <td className="border px-2 py-1 capitalize">{c.type}</td>
              <td className="border px-2 py-1">
                {c.bid !== undefined && c.bid !== null ? c.bid : "-"}
              </td>
              <td className="border px-2 py-1">
                {c.ask !== undefined && c.ask !== null ? c.ask : "-"}
              </td>
              <td className="border px-2 py-1">
                {c.lastPrice !== undefined && c.lastPrice !== null
                  ? c.lastPrice
                  : "-"}
              </td>
              <td className="border px-2 py-1">
                {c.volume !== undefined && c.volume !== null ? c.volume : "-"}
              </td>
              <td className="border px-2 py-1">
                {c.openInterest !== undefined && c.openInterest !== null
                  ? c.openInterest
                  : "-"}
              </td>
              <td className="border px-2 py-1">
                {c.impliedVolatility !== undefined && c.impliedVolatility !== null
                  ? c.impliedVolatility
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}