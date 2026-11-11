import { SYSTEM_PROMPT } from '../../resume-context.js';

export const prerender = false;

// AICredits (aicredits.in): OpenAI-compatible gateway, billed in INR from a prepaid wallet.
const API_URL = 'https://api.aicredits.in/v1/chat/completions';
// Cheapest capable model first; the backup only runs when the first provider is down.
const MODELS = ['anthropic/claude-haiku-5.5', 'openai/gpt-4o-mini'];
// Wallet/key problems: another model won't help, it is the same wallet.
const ACCOUNT_ERRORS = new Set([401, 402, 403]);

const MAX_TURNS = 12;      // history kept per request
const MAX_CHARS = 1000;    // per message
const LIMIT = 20;          // requests per IP per window
const WINDOW_MS = 10 * 60 * 1000;
// shortcut: in-memory limiter resets on cold starts and isn't shared across instances; move to a KV store if abused.
const hits = new Map();

// What a visitor sees whenever the AI can't answer, whatever the reason (no credit, bad key,
// provider down). Internal causes go to the server log only, never to the recruiter.
const FALLBACK = "I can't answer right now, but Sushanta would be glad to: email him at nandysushanta8@gmail.com, or use the Download resume button for his full experience.";

const text = (body, status = 200) => new Response(body, { status, headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' } });

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
  while (messages[0]?.role === 'assistant') messages.shift(); // conversations start with the visitor
  const valid = messages.length > 0 && messages.at(-1).role === 'user' && messages.every(
    (m) => (m?.role === 'user' || m?.role === 'assistant') && typeof m.content === 'string' && m.content.trim() && m.content.length <= MAX_CHARS,
  );
  if (!valid) return text('Please send a question under 1000 characters.', 400);

  const apiKey = import.meta.env.AICREDITS_API_KEY ?? process.env.AICREDITS_API_KEY;
  if (!apiKey) {
    console.error('[chat] AICREDITS_API_KEY is not set');
    return text(FALLBACK);
  }

  // Get a streaming response from the first model that answers.
  let upstream = null;
  for (const model of MODELS) {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
        body: JSON.stringify({
          model,
          stream: true,
          max_tokens: 600,
          temperature: 0.3,
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages.map(({ role, content }) => ({ role, content }))],
        }),
        signal: AbortSignal.timeout(30_000),
      });
      if (res.ok && res.body) { upstream = res; break; }
      const detail = await res.text().catch(() => '');
      console.error(`[chat] ${model} failed: HTTP ${res.status} ${detail.slice(0, 300)}`); // 402 = wallet empty or key budget hit
      if (ACCOUNT_ERRORS.has(res.status)) break;
    } catch (err) {
      console.error(`[chat] ${model} unreachable: ${err?.name} ${err?.message}`);
    }
  }
  if (!upstream) return text(FALLBACK);

  // Relay only the answer text from the provider's server-sent events.
  const enc = new TextEncoder();
  const body = new ReadableStream({
    async start(controller) {
      const reader = upstream.body.getReader();
      const dec = new TextDecoder();
      let buf = '', sent = false;
      try {
        read: for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buf += dec.decode(value, { stream: true });
          let nl;
          while ((nl = buf.indexOf('\n')) >= 0) {
            const line = buf.slice(0, nl).trim();
            buf = buf.slice(nl + 1);
            if (!line.startsWith('data:')) continue;
            const data = line.slice(5).trim();
            if (data === '[DONE]') break read;
            let chunk;
            try { chunk = JSON.parse(data); } catch { continue; }
            if (chunk.error) throw new Error(`stream error: ${JSON.stringify(chunk.error).slice(0, 300)}`);
            const piece = chunk.choices?.[0]?.delta?.content;
            if (piece) { controller.enqueue(enc.encode(piece)); sent = true; }
          }
        }
        if (!sent) controller.enqueue(enc.encode(FALLBACK));
      } catch (err) {
        console.error('[chat] stream broke:', err?.message);
        controller.enqueue(enc.encode(sent ? '\n\n(The answer was cut short. Email nandysushanta8@gmail.com for anything more.)' : FALLBACK));
      }
      controller.close();
    },
  });
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' } });
}
