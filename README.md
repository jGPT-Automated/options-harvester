# Options Chain Explorer with AI Chat

This project provides a Next.js 14 application that fetches delayed U.S. equity options chain data and lets you ask questions about it via an AI chat assistant. It supports free data providers (Tradier by default, with Yahoo as fallback) and streams answers using OpenAI or Google Gemini.

## Features

* **Free options data:** Integrates with Tradier and Yahoo to fetch 15‑minute delayed option chains, including volume, open interest and implied volatility.
* **Interactive filtering:** Search for a ticker, select expiration dates, filter by calls or puts, strike ranges and ITM/OTM status. The table updates instantly.
* **AI chat assistant:** Ask questions about the currently loaded options chain and get context‑aware answers. Uses OpenAI by default, with optional Gemini support.
* **Serverless and secure:** All API keys are kept server‑side. Responses are cached to reduce API calls.

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Configure your environment:** Create a `.env.local` file at the project root and set required variables. At minimum you need an OpenAI API key (or Gemini key) and optionally a Tradier token:
   ```env
   PROVIDER_PRIMARY=tradier
   PROVIDER_SECONDARY=yahoo
   TRADIER_TOKEN=<your_tradier_token>
   OPENAI_API_KEY=<your_openai_api_key>
   # Optional: GEMINI_API_KEY and GEMINI_MODEL if using Gemini
   # Optional: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN for shared cache
   ```
3. **Run the development server:**
   ```sh
   npm run dev
   ```
   The app will be available at http://localhost:3000.
4. **Deploy:** See `DEPLOYMENT.md` for details on deploying to Vercel.

## Usage Tips

* By default, the app loads data for `AAPL`. Use the search box to load another ticker.
* Implied volatility values are shown as percentages. ITM options are highlighted.
* The chat assistant will decline to provide trading advice and only discuss the loaded options chain.

## License

This project is provided for educational and informational purposes. Use at your own risk.
