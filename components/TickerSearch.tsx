'use client';

import { useState, FormEvent } from 'react';

interface TickerSearchProps {
  onSymbolSubmit: (symbol: string) => void;
}

export default function TickerSearch({ onSymbolSubmit }: TickerSearchProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const sym = input.trim().toUpperCase();
    if (sym) {
      onSymbolSubmit(sym);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter ticker (e.g., AAPL)"
        className="border rounded p-2 flex-1"
      />
      <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2">
        Search
      </button>
    </form>
  );
}
