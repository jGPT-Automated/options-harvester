"use client";

import React, { useState } from "react";

interface Props {
  /**
   * Callback invoked when the user submits a ticker symbol. The symbol
   * will be upper‑cased and trimmed of whitespace before being passed.
   */
  onSubmit: (symbol: string) => void;
}

/**
 * A simple search bar for entering stock ticker symbols. Users can type a
 * symbol and hit enter or click the search button to trigger the
 * `onSubmit` callback provided via props. Input is controlled via React
 * state and automatically upper‑cased on submission.
 */
export default function TickerSearch({ onSubmit }: Props) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = input.trim().toUpperCase();
    if (trimmed) {
      onSubmit(trimmed);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex mb-4">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter ticker e.g. AAPL"
        className="p-2 border rounded-l flex-grow"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-r"
      >
        Search
      </button>
    </form>
  );
}