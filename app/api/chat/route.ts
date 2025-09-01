import { createChatCompletionStream } from '@/lib/providers';
import { NextResponse } from 'next/server';

// Run this route on the Edge runtime to enable streaming responses.
export const runtime = 'edge';

/**
 * Simple chat API proxy. Accepts a POST request containing a `messages`
 * array in the body and returns a streaming response using either
 * OpenAI or Gemini (depending on environment variables). The client
 * should consume the response as Server‑Sent Events (SSE).
 */
export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Request body must include a messages array' },
        { status: 400 }
      );
    }
    const stream = await createChatCompletionStream(messages);
    return new Response(stream, {
      headers: { 'Content-Type': 'text/event-stream' }
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create chat completion' },
      { status: 500 }
    );
  }
}
