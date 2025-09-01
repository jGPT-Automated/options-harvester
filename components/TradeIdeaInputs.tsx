"use client";

import React, { useState } from "react";

interface Props {
  /** Invoked when the user submits a trade idea. */
  onSubmit: (direction: string, targetPrice: number) => void;
}

/**
 * Input controls for generating a trade idea. Lets the user choose a
 * direction (call or put) and target price. Submitting the form calls
 * the provided `onSubmit` handler with the current values. This
 * component is optional and can be omitted if premium comparison is
 * unused.
 */
export default function TradeIdeaInputs({ onSubmit }: Props) {
  const [direction, setDirection] = useState("call");
  const [target, setTarget] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = parseFloat(target);
    if (!isNaN(value)) {
      onSubmit(direction, value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex mb-4">
      <select
        value={direction}
        onChange={(e) => setDirection(e.target.value)}
        className="p-2 border rounded-l"
      >
        <option value="call">Call</option>
        <option value="put">Put</option>
      </select>
      <input
        type="number"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        placeholder="Target price"
        className="p-2 border flex-grow"
      />
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded-r"
      >
        Compare
      </button>
    </form>
  );
}