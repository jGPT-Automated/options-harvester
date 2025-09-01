'use client';

import React from 'react';

interface ExpirySelectProps {
  expiries: string[];
  selected: string;
  onChange: (expiry: string) => void;
}

export default function ExpirySelect({ expiries, selected, onChange }: ExpirySelectProps) {
  return (
    <div className="mb-4">
      <label className="mr-2">Expiry:</label>
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded p-2"
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
