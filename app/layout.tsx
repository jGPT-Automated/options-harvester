import React from 'react';
import '../styles/globals.css';

export const metadata = {
  title: 'Options Chain Explorer',
  description: 'Explore options chains and chat with an AI about them'
};

/**
 * Root layout for the application. Applies global styles and wraps all pages.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
