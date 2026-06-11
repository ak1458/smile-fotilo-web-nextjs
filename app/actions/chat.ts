'use server';

import { AI_MODELS } from '../data/aiModels';
import {
  ChatHistoryItem,
  buildSystemPrompt,
  formatReply,
  getPredefinedReply,
  isComplexQuery,
  isLowValueOrOffTopicQuery,
  sanitizeInput,
} from '../lib/ai/echo-brain';

type Counter = { count: number; resetTime: number };
type OpenRouterResult = { ok: true; text: string } | { ok: false; error: string };

function readPositiveNumber(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
}

function readNumberInRange(value: string | undefined, fallback: number, min: number, max: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

const MINUTE_MS = 60 * 1000;

const REQUEST_LIMIT = readPositiveNumber(process.env.CHAT_REQUEST_LIMIT, 25);
const REQUEST_WINDOW_MS = readPositiveNumber(process.env.CHAT_REQUEST_WINDOW_MS, MINUTE_MS);
// Daily ceiling per client on top of the per-minute throttle — bounds worst-case
// token spend from a single visitor to ~DAILY_LIMIT * OPENROUTER_MAX_TOKENS.
const DAILY_REQUEST_LIMIT = readPositiveNumber(process.env.CHAT_DAILY_REQUEST_LIMIT, 80);
const DAY_MS = 24 * 60 * 60 * 1000;

const OPENROUTER_PRIMARY_MODEL = process.env.OPENROUTER_MODEL || 'z-ai/glm-4.5-air:free';
const OPENROUTER_REASONING_MODEL =
  process.env.OPENROUTER_REASONING_MODEL ||
  process.env.OPENROUTER_DEEP_MODEL ||
  'deepseek/deepseek-r1-0528:free';

const OPENROUTER_MAX_TOKENS = readPositiveNumber(process.env.OPENROUTER_MAX_TOKENS, 220);
const OPENROUTER_TEMPERATURE = readNumberInRange(process.env.OPENROUTER_TEMPERATURE, 0.45, 0, 1);

const baseOpenRouterModels: string[] = AI_MODELS
  .map((model) => model.id as string)
  .filter((modelId) => modelId !== 'auto');

const FREE_OPENROUTER_MODELS: string[] = Array.from(
  new Set([...baseOpenRouterModels, OPENROUTER_PRIMARY_MODEL, OPENROUTER_REASONING_MODEL])
);

const requestThrottleMap = new Map<string, Counter>();
const dailyThrottleMap = new Map<string, Counter>();
const freeModelPointerMap = new Map<string, number>();

const MAX_CACHE_ENTRIES = 1000;

function enforceCacheLimit<K, V>(map: Map<K, V>) {
  if (map.size > MAX_CACHE_ENTRIES) {
    const oldestKey = map.keys().next().value;
    if (oldestKey !== undefined) {
      map.delete(oldestKey);
    }
  }
}

function toOpenAIHistory(history: ChatHistoryItem[]) {
  return history
    .map((msg) => ({
      role: msg.role === 'model' ? ('assistant' as const) : ('user' as const),
      content: sanitizeInput(msg.parts),
    }))
    .filter((msg) => msg.content.length > 0)
    .slice(-8);
}

function dedupeModels(models: string[]): string[] {
  return Array.from(new Set(models.filter(Boolean)));
}

function isFreeOpenRouterModel(modelId: string): boolean {
  return FREE_OPENROUTER_MODELS.includes(modelId);
}

function pickNextFreeModel(clientId: string): string {
  if (!FREE_OPENROUTER_MODELS.length) return OPENROUTER_PRIMARY_MODEL;
  const current = freeModelPointerMap.get(clientId) || 0;
  const selected = FREE_OPENROUTER_MODELS[current % FREE_OPENROUTER_MODELS.length];
  freeModelPointerMap.set(clientId, current + 1);
  return selected;
}

function touchCounter(map: Map<string, Counter>, key: string, windowMs: number, now: number): Counter {
  const current = map.get(key);
  if (!current || now > current.resetTime) {
    const fresh = { count: 0, resetTime: now + windowMs };
    map.set(key, fresh);
    enforceCacheLimit(map);
    return fresh;
  }
  return current;
}

function consumeRequestQuota(clientId: string): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  const counter = touchCounter(requestThrottleMap, clientId, REQUEST_WINDOW_MS, now);
  const daily = touchCounter(dailyThrottleMap, clientId, DAY_MS, now);

  if (counter.count >= REQUEST_LIMIT) {
    return { allowed: false, retryAfterMs: Math.max(0, counter.resetTime - now) };
  }
  if (daily.count >= DAILY_REQUEST_LIMIT) {
    return { allowed: false, retryAfterMs: Math.max(0, daily.resetTime - now) };
  }

  counter.count += 1;
  daily.count += 1;
  return { allowed: true, retryAfterMs: 0 };
}

function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, value] of requestThrottleMap.entries()) {
    if (now > value.resetTime) requestThrottleMap.delete(key);
  }
  for (const [key, value] of dailyThrottleMap.entries()) {
    if (now > value.resetTime) dailyThrottleMap.delete(key);
  }
  enforceCacheLimit(freeModelPointerMap);
}

const globalState = globalThis as typeof globalThis & { __echoCleanupIntervalStarted?: boolean };
if (!globalState.__echoCleanupIntervalStarted) {
  setInterval(cleanupExpiredEntries, MINUTE_MS);
  globalState.__echoCleanupIntervalStarted = true;
}

function extractOpenRouterText(data: unknown): string {
  const candidate = (data as { choices?: Array<{ message?: { content?: unknown } }> })?.choices?.[0]?.message?.content;
  if (typeof candidate === 'string') return candidate;

  if (Array.isArray(candidate)) {
    const joined = candidate
      .map((item) => {
        if (typeof item === 'string') return item;
        if (item && typeof item === 'object' && 'text' in item) {
          return String((item as { text?: unknown }).text || '');
        }
        return '';
      })
      .join(' ')
      .trim();
    return joined;
  }

  return '';
}

const PROVIDER_TIMEOUT_MS = 20_000;

async function callOpenRouterOnce(
  message: string,
  history: ChatHistoryItem[],
  model: string,
  pageContext?: string,
): Promise<OpenRouterResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey === 'your_openrouter_key_here') {
    return { ok: false, error: 'OPENROUTER_API_KEY is missing' };
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://smilefotilo.com',
        'X-Title': 'Smile Fotilo Echo',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: buildSystemPrompt(pageContext) },
          ...toOpenAIHistory(history),
          { role: 'user', content: message },
        ],
        max_tokens: OPENROUTER_MAX_TOKENS,
        temperature: OPENROUTER_TEMPERATURE,
      }),
      signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
    });

    const data = await response.json();
    if (!response.ok) {
      const errorMessage = (data as { error?: { message?: string } })?.error?.message || `Service error ${response.status}`;
      return { ok: false, error: `${model}: ${errorMessage}` };
    }

    const text = extractOpenRouterText(data);
    if (!text) return { ok: false, error: `${model}: Empty response` };

    return { ok: true, text: sanitizeInput(text) };
  } catch (error: unknown) {
    return { ok: false, error: `${model}: ${error instanceof Error ? error.message : 'Connection issue'}` };
  }
}

async function callOpenRouterWithFallback(
  message: string,
  history: ChatHistoryItem[],
  models: string[],
  pageContext?: string,
): Promise<string | null> {
  const uniqueModels = dedupeModels(models);
  let lastError = 'No model candidates available';

  for (const model of uniqueModels) {
    const result = await callOpenRouterOnce(message, history, model, pageContext);
    if (result.ok) return result.text;
    lastError = result.error;
  }

  const { secureLog } = await import('../lib/secure-log');
  secureLog.error('[CHAT] Model fallback chain failed:', lastError);
  return null; // signal total OpenRouter failure so caller can try other providers
}

function buildAutoModelChain(clientId: string, complex: boolean): string[] {
  const rotating = pickNextFreeModel(clientId);

  if (complex) {
    return dedupeModels([
      OPENROUTER_REASONING_MODEL,
      OPENROUTER_PRIMARY_MODEL,
      rotating,
      ...FREE_OPENROUTER_MODELS,
    ]);
  }

  return dedupeModels([OPENROUTER_PRIMARY_MODEL, rotating, OPENROUTER_REASONING_MODEL]);
}

export async function chatWithGemini(
  history: ChatHistoryItem[],
  message: string,
  clientId: string = 'anonymous',
  selectedModel: string = 'auto',
  pageContext?: string,
) {
  const throttle = consumeRequestQuota(clientId);
  if (!throttle.allowed) {
    return formatReply(
      "Hit our rate limit - too many messages in a short window. Give it a minute and try again, or call +91 9453878422 if it's urgent.",
      ['Will try again', 'Call now', 'Email instead']
    );
  }

  const sanitizedMessage = sanitizeInput(message);
  if (!sanitizedMessage) {
    return formatReply('Please type your question again.', ['Pricing', 'Services', 'Contact']);
  }

  const queryIsComplex = isComplexQuery(sanitizedMessage);

  // Off-topic / gibberish / filler: don't burn an LLM call, redirect politely.
  if (isLowValueOrOffTopicQuery(sanitizedMessage, history)) {
    const canned = getPredefinedReply(sanitizedMessage);
    if (canned) return formatReply(canned.text, canned.quickReplies);
    return formatReply(
      "I'm Echo — I help with websites, SEO, and AI automation at Smile Fotilo. What are you looking to build or grow?",
      ['Pricing', 'Services', 'See our work']
    );
  }

  // AI-FIRST: answer generatively. The system prompt carries the pricing facts
  // and company knowledge, so the LLM gives real, contextual answers instead of
  // canned scripts. Canned replies are only a last-resort fallback.
  const normalizedSelection = (selectedModel || 'auto').trim();
  let chain: string[];
  if (normalizedSelection !== 'auto') {
    const selected = isFreeOpenRouterModel(normalizedSelection) ? normalizedSelection : OPENROUTER_PRIMARY_MODEL;
    chain = queryIsComplex
      ? [selected, OPENROUTER_REASONING_MODEL, OPENROUTER_PRIMARY_MODEL, pickNextFreeModel(clientId)]
      : [selected, OPENROUTER_PRIMARY_MODEL, pickNextFreeModel(clientId)];
  } else {
    chain = buildAutoModelChain(clientId, queryIsComplex);
  }

  const aiText = await callOpenRouterWithFallback(sanitizedMessage, history, chain, pageContext);
  if (aiText) return aiText;

  // Secondary AI fallback: Gemini / Groq via the smart router (different providers,
  // different keys) so a single provider outage doesn't drop us to scripts.
  try {
    const { generateAIResponse } = await import('../lib/ai/smart-router');
    const recent = history.slice(-4).map((h) => `${h.role === 'user' ? 'User' : 'Echo'}: ${h.parts}`).join('\n');
    const prompt = `${buildSystemPrompt(pageContext)}\n\nConversation so far:\n${recent}\nUser: ${sanitizedMessage}\nEcho:`;
    const alt = await generateAIResponse(prompt, {
      maxTokens: OPENROUTER_MAX_TOKENS,
      temperature: OPENROUTER_TEMPERATURE,
      complexity: queryIsComplex ? 'complex' : 'medium',
    });
    if (alt && alt.trim()) return sanitizeInput(alt);
  } catch {
    // fall through to canned
  }

  // Last resort: canned FAQ if it matches, else a direct-contact nudge.
  const canned = getPredefinedReply(sanitizedMessage);
  if (canned) return formatReply(canned.text, canned.quickReplies);
  return formatReply(
    "Quick connection hiccup on my end. Reach Ashraf directly at +91 9453878422 or support@smilefotilo.com — same-day reply.",
    ['Pricing', 'Services', 'Contact directly']
  );
}
