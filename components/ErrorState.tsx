"use client";

import React from "react";

interface Props {
  /** The error message to display */
  message: string;
}

/**
 * Generic error display component. Renders the provided error message in
 * red text. If no message is provided, nothing is shown.
 */
export default function ErrorState({ message }: Props) {
  if (!message) return null;
  return <p className="text-red-500 mb-4">{message}</p>;
}