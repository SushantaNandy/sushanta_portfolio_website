import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT } from '../../resume-context.js';

export const prerender = false;

const MAX_TURNS = 12;      // history kept per request
const MAX_CHARS = 1000;    // per message
const LIMIT = 20;          // requests per IP per window
const WINDOW_MS = 10 * 60 * 1000;
// shortcut: in-memory limiter resets on cold starts and isn't shared across instances; move to a KV store if abused.
const hits = new Map();

const text = (body, status) => new Response(body, { status, headers: { 'content-type': 'text/plain; charset=utf-8' } });

export async function POST({ request, clientAddress }) {
  const now = Date.now();
  const ip = clientAddress ?? 'unknown';
  const h = hits.get(ip);
  if (!h || now > h.reset) hits.set(ip, { n: 1, reset: now + WINDOW_MS });
  else if (++h.n > LIMIT) return text('Too many questions in a short time. Please try again in a few minutes.', 429);

  let messages;
  try {
    messages = (await request.json())?.messages;
  } catch {
    return text('Invalid request.', 400);
  }
  if (!Array.isArray(messages)) return text('Invalid request.', 400);
  messages = messages.slice(-MAX_TURNS);
  while (messages[0]?.role === 'assistant') messages.shift(); // the API needs a user turn first
  const valid = messages.length > 0 && messages.at(-1).role === 'user' && messages.every(
    (m) => (m?.role === 'user' || m?.role === 'assistant') && typeof m.content === 'string' && m.content.trim() && m.content.length <= MAX_CHARS,
  );
  if (!valid) return text('Please send a question under 1000 characters.', 400);

  const apiKey = import.meta.env.ANTHROPIC_API_KEY ?? process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return text('The assistant is not set up yet. Please email nandysushanta8@gmail.com.', 503);
  const client = new Anthropic({ apiKey });

  const enc = new TextEncoder();
  const body = new ReadableStream({
    async start(controller) {
      try {
        const stream = client.beta.messages.stream({
          model: 'claude-opus-5-5',
          max_tokens: 1024,
          output_config: { effort: 'low' }, // short factual chat answers
          betas: ['server-side-fallback-2026-07-01'],
          fallbacks: 'default',
          system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
          messages: messages.map(({ role, content }) => ({ role, content })),
        });
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') controller.enqueue(enc.encode(event.delta.text));
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === 'refusal') controller.enqueue(enc.encode("I can only help with questions about Sushanta's professional experience."));
      } catch (err) {
        console.error('chat error', err);
        controller.enqueue(enc.encode('Sorry, the assistant is unavailable right now. Please email nandysushanta8@gmail.com.'));
      }
      controller.close();
    },
  });
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' } });
}
