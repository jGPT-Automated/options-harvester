/**
 * Unified provider API for fetching expiration lists and option chains from
 * multiple data sources. The primary and secondary providers are selected via
 * environment variables. Add additional providers here if needed.
 */
import { OptionContract } from '../types';
import * as Tradier from './tradier';
import * as Yahoo from './yahoo';

// Select primary and secondary providers. Default to Yahoo for broad access without API key.
const primary = (process.env.PROVIDER_PRIMARY || 'yahoo').toLowerCase();
const secondary = (process.env.PROVIDER_SECONDARY || 'tradier').toLowerCase();

/** Fetch expirations list for a given symbol. */
export async function getExpiries(symbol: string): Promise<string[]> {
  if (primary === 'tradier') {
    try {
      return await Tradier.fetchExpirations(symbol);
    } catch (e) {
      console.error('Primary provider (Tradier) expiries failed:', e);
    }
  } else if (primary === 'yahoo') {
    try {
      return await Yahoo.fetchExpirations(symbol);
    } catch (e) {
      console.error('Primary provider (Yahoo) expiries failed:', e);
    }
  }
  // Fallback to secondary
  if (secondary === 'tradier') {
    return Tradier.fetchExpirations(symbol);
  } else if (secondary === 'yahoo') {
    return Yahoo.fetchExpirations(symbol);
  }
  throw new Error('No provider available for expiries');
}

/** Fetch an options chain for a symbol + expiry. */
export async function getOptionsChain(symbol: string, expiry: string): Promise<OptionContract[]> {
  if (primary === 'tradier') {
    try {
      return await Tradier.fetchChain(symbol, expiry);
    } catch (e) {
      console.error('Primary provider (Tradier) chain failed:', e);
    }
  } else if (primary === 'yahoo') {
    try {
      return await Yahoo.fetchChain(symbol, expiry);
    } catch (e) {
      console.error('Primary provider (Yahoo) chain failed:', e);
    }
  }
  // Fallback to secondary
  if (secondary === 'tradier') {
    return Tradier.fetchChain(symbol, expiry);
  } else if (secondary === 'yahoo') {
    return Yahoo.fetchChain(symbol, expiry);
  }
  throw new Error('No provider available for options chain');
}

/** Create a streaming chat completion response using either Gemini or OpenAI. */
export async function createChatCompletionStream(messages: any[]): Promise<ReadableStream> {
  const provider = (process.env.LLM_PROVIDER || 'openai').toLowerCase();
  // Helper to flatten conversation for Gemini
  const toGeminiParts = (msgs: any[]) => {
    const text = msgs
      .map(m => {
        const role = m.role ?? 'user';
        return `${role.toUpperCase()}: ${typeof m.content === 'string' ? m.content : JSON.stringify(m.content)}`;
      })
      .join('\n\n');
    return { contents: [{ parts: [{ text }] }] };
  };
  if (provider === 'gemini') {
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    if (!apiKey) throw new Error('No GEMINI_API_KEY provided');
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toGeminiParts(messages))
      }
    );
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API error: ${res.status} - ${errText}`);
    }
    const json = await res.json();
    const text = json?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join('') || '';
    // Wrap the whole answer in an SSE-like stream
    const encoder = new TextEncoder();
    return new ReadableStream({
      start(controller) {
      const chunk = `data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`;
        controller.enqueue(encoder.encode(chunk));
        controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
        controller.close();
      }
    });
  }
  // Default to OpenAI streaming
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('No OpenAI API key provided');
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? 'gpt-3.5-turbo',
      messages,
      stream: true
    })
  });
  if (!res.ok || !res.body) {
    const errText = await res.text();
    throw new Error(`OpenAI API error: ${res.status} - ${errText}`);
  }
  // Pipe OpenAI stream through a new ReadableStream
  return new ReadableStream({
    start(controller) {
      const reader = res.body.getReader();
      const read = async () => {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
          return;
        }
        controller.enqueue(value);
        read();
      };
      read();
    }
  });
}
