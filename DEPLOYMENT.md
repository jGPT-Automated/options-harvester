# Deployment Guide

This document explains how to deploy the Options Chain Explorer app to Vercel or another Node host.

## Prerequisites

- Node.js LTS installed locally.
- A Vercel account and optionally the Vercel CLI (`npm i -g vercel`).
- API credentials:
  - **Tradier** (optional) — sign up for a free developer token to get delayed option data.
  - **OpenAI** or **Google Gemini** API key — needed for the chat assistant.
  - **Upstash Redis** credentials (optional) for caching and chat history.

## Setup

1. **Clone or copy the project** into a directory and install dependencies:
   ```sh
   npm install
   ```
2. **Environment variables:** Create a `.env.local` file at the root of the project. Set at least the following variables:
   ```env
   PROVIDER_PRIMARY=tradier
   PROVIDER_SECONDARY=yahoo
   TRADIER_TOKEN=your_tradier_token
   OPENAI_API_KEY=your_openai_key
   OPENAI_MODEL=gpt-3.5-turbo
   # To use Gemini instead of OpenAI:
   # LLM_PROVIDER=gemini
   # GEMINI_API_KEY=your_gemini_key
   # GEMINI_MODEL=gemini-1.5-flash
   # Optional Redis
   # UPSTASH_REDIS_REST_URL=https://...
   # UPSTASH_REDIS_REST_TOKEN=...
   ```
3. **Run locally:** Start the dev server with:
   ```sh
   npm run dev
   ```
   and visit http://localhost:3000. Verify that data loads and chat works.

## Deployment to Vercel

1. **Login:** Make sure you are logged in to Vercel. In your terminal:
   ```sh
   vercel login
   ```
2. **Add environment variables:** In the Vercel dashboard, navigate to your project settings and add the same environment variables you set in `.env.local`. You can also use the CLI:
   ```sh
   vercel env add PROVIDER_PRIMARY
   vercel env add PROVIDER_SECONDARY
   vercel env add TRADIER_TOKEN
   vercel env add OPENAI_API_KEY
   # etc.
   ```
3. **Deploy:** Run the deploy command from the project directory:
   ```sh
   vercel --prod
   ```
   Vercel will build the Next.js app and deploy it as serverless functions.
4. **Verify:** After deployment completes, open the provided Vercel URL. Ensure the options chain loads, the filters work and the chat assistant responds. Check Vercel logs if any errors appear.

## Maintenance

- **Rate limits:** The app caches provider responses for 60 seconds (chains) and 10 minutes (expiries). Adjust the TTLs in `lib/cache.ts` to tune usage.
- **Switch providers:** Set `PROVIDER_PRIMARY` to `yahoo` if you don't have a Tradier token. You can also add `finnhub` later by implementing its fetchers.
- **LLM provider:** To use Gemini instead of OpenAI, set `LLM_PROVIDER=gemini` and provide `GEMINI_API_KEY` and `GEMINI_MODEL`. The current implementation sends the entire response in one chunk for Gemini.

## Troubleshooting

- **Data not loading:** Ensure your API keys are valid and set correctly. Check server logs for errors.
- **Chat not responding:** Verify your OpenAI or Gemini key has sufficient quota and that the model names are correct.
- **Rate‑limited:** If you hit provider limits, increase cache TTL or reduce requests. Tradier’s free tier allows around 120 requests per minute.
