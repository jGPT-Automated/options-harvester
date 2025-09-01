"use client";

import React from "react";

interface Props {
  /** Array of available expiration dates (formatted as YYYY‑MM‑DD) */
  expiries: string[];
  /** Currently selected expiry */
  selected: string;
  /** Callback invoked when the user selects a new expiry */
  onSelect: (expiry: string) => void;
}

/**
 * Dropdown selector for options expiration dates. Displays a select box
 * populated with the provided `expiries` array. The currently selected
 * expiry is controlled via the `selected` prop. When the user chooses
 * a new expiry, the `onSelect` callback is called with the new value.
 */
export default function ExpirySelect({ expiries, selected, onSelect }: Props) {
  return (
    <div className="mb-4">
      <select
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        className="p-2 border rounded"
      >
        {expiries.map((exp) => (
          <option key={exp} value={exp}>
            {exp}
          </option>
        ))}
      </select>
    </div>
  );
}