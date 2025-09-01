"use client";

import React from "react";

interface Result {
  expiry: string;
  strike: number;
  premium: number;
}

interface Props {
  /** Array of premium comparison results */
  results: Result[];
}

/**
 * Displays a table comparing option premiums across different expirations.
 * Each result includes the expiry, the strike chosen for the comparison
 * and the computed premium (mid price). The table shows these values
 * and formats premiums to two decimal places.
 */
export default function PremiumComparison({ results }: Props) {
  if (!results || results.length === 0) return null;
  return (
    <div className="mb-4">
      <h2 className="font-bold mb-2">Premium Comparison</h2>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1 text-left">Expiry</th>
            <th className="border px-2 py-1 text-left">Strike</th>
            <th className="border px-2 py-1 text-left">Premium</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <tr key={i} className="odd:bg-white even:bg-gray-50">
              <td className="border px-2 py-1">{r.expiry}</td>
              <td className="border px-2 py-1">{r.strike}</td>
              <td className="border px-2 py-1">{r.premium.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}