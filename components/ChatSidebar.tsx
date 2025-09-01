"use client";

import React from "react";

/**
 * Placeholder chat sidebar. In a full implementation this component
 * would show a chat interface powered by OpenAI or Gemini. For now
 * it displays a simple notice that chat is coming soon. This prevents
 * runtime errors if the sidebar is rendered conditionally in the page.
 */
export default function ChatSidebar() {
  return (
    <div className="p-4 border-l border-gray-200 bg-gray-50">
      <h2 className="font-bold mb-2">AI Assistant</h2>
      <p className="text-gray-600 text-sm">
        Chat functionality is coming soon. In the meantime, explore
        options chains and premium comparisons using the tools on the
        left.
      </p>
    </div>
  );
}