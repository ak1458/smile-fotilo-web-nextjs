'use server';

import Groq from 'groq-sdk';
import { AI_MODELS } from '../data/aiModels';
import { SMILE_FOTILO_KNOWLEDGE } from '../data/knowledgeBase';

type ChatHistoryItem = { role: 'user' | 'model'; parts: string };
type Counter = { count: number; resetTime: number };
type PredefinedReply = { text: string; quickReplies: string[] };
type ResolvedModel = {
  provider: 'openrouter' | 'openai' | 'gemini';
  model: string;
  paid: boolean;
};

function readPositiveNumber(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
}

const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

const REQUEST_LIMIT = readPositiveNumber(process.env.CHAT_REQUEST_LIMIT, 25);
const REQUEST_WINDOW_MS = readPositiveNumber(process.env.CHAT_REQUEST_WINDOW_MS, MINUTE_MS);

const SMART_ROUTING = process.env.AI_PROVIDER === 'smart' || process.env.AI_PROVIDER === 'openrouter';
const GROQ_ENABLED = process.env.GROQ_ENABLED !== 'false';
const GROQ_CLIENT_HOURLY_LIMIT = readPositiveNumber(process.env.GROQ_CLIENT_HOURLY_LIMIT, 8);
const GROQ_CLIENT_DAILY_LIMIT = readPositiveNumber(process.env.GROQ_CLIENT_DAILY_LIMIT, 20);
const GROQ_GLOBAL_HOURLY_LIMIT = readPositiveNumber(process.env.GROQ_GLOBAL_HOURLY_LIMIT, 120);
const GROQ_GLOBAL_DAILY_LIMIT = readPositiveNumber(process.env.GROQ_GLOBAL_DAILY_LIMIT, 400);
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'z-ai/glm-4.5-air:free';
const OPENROUTER_DEEP_MODEL = process.env.OPENROUTER_DEEP_MODEL || 'google/gemini-2.0-flash-lite-001';
const OPENAI_PAID_MODEL =
  process.env.OPENAI_PAID_MODEL || process.env.OPENAI_MODEL || 'gpt-5.2-chat-latest';
const GEMINI_PAID_MODEL =
  process.env.GEMINI_PAID_MODEL || process.env.GOOGLE_GEMINI_MODEL || 'gemini-3.1-pro-preview';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GOOGLE_GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

const FREE_OPENROUTER_MODELS = AI_MODELS
  .map((model) => model.id)
  .filter((modelId) => modelId !== 'auto' && !modelId.startsWith('openai:') && !modelId.startsWith('google:'));

const requestThrottleMap = new Map<string, Counter>();
const groqClientHourMap = new Map<string, Counter>();
const groqClientDayMap = new Map<string, Counter>();
const freeModelPointerMap = new Map<string, number>();

let groqGlobalHourCounter: Counter = { count: 0, resetTime: Date.now() + HOUR_MS };
let groqGlobalDayCounter: Counter = { count: 0, resetTime: Date.now() + DAY_MS };

function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';

  let cleaned = input.replace(/\0/g, '');
  cleaned = cleaned.slice(0, 2000);
  cleaned = cleaned
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();

  return cleaned;
}

function normalizeMessage(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^\w\s@.+-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function containsAny(text: string, terms: string[]): boolean {
  return terms.some((term) => text.includes(term));
}

function containsWord(text: string, words: string[]): boolean {
  return words.some((word) => new RegExp(`\\b${word}\\b`, 'i').test(text));
}

function formatReply(text: string, quickReplies: string[]): string {
  if (!quickReplies.length) return text;
  return `${text}\n[QUICK_REPLIES: ${quickReplies.join(' | ')}]`;
}

function buildSystemPrompt(): string {
  return `You are Echo, sales assistant for Smile Fotilo.
Rules:
- Sound natural and conversational while staying concise.
- Use at most 2 short sentences per reply.
- End every reply with this exact format:
[QUICK_REPLIES: Option1 | Option2 | Option3]
- Stay focused on Smile Fotilo services and lead qualification.
- If user asks off-topic, gently redirect to agency services.
Knowledge:
${SMILE_FOTILO_KNOWLEDGE}`;
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

function toGeminiHistory(history: ChatHistoryItem[]) {
  return history
    .map((msg) => ({
      role: msg.role === 'model' ? ('model' as const) : ('user' as const),
      parts: [{ text: sanitizeInput(msg.parts) }],
    }))
    .filter((msg) => msg.parts[0].text.length > 0)
    .slice(-8);
}

function getPredefinedReply(rawMessage: string): PredefinedReply | null {
  const message = normalizeMessage(rawMessage);
  if (!message) return null;

  const hasEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(message);
  if (hasEmail) {
    return {
      text: 'Thanks, we got your email and our team will contact you shortly.',
      quickReplies: ['Share budget', 'Share timeline', 'Call now'],
    };
  }

  if (message.includes('greet the user warmly') || containsWord(message, ['hello', 'hi', 'hey', 'namaste', 'start'])) {
    return {
      text: 'Hi, I can help with pricing, services, timeline, and Growth Autopilot.',
      quickReplies: ['Pricing', 'Services', 'Growth Autopilot'],
    };
  }

  if (containsAny(message, ['price', 'pricing', 'cost', 'budget', 'how much'])) {
    return {
      text: 'Starter is INR 15k, Growth starts INR 35k, and Growth Autopilot starts INR 9,999 monthly.',
      quickReplies: ['Starter plan', 'Growth plan', 'Autopilot plan'],
    };
  }

  if (containsAny(message, ['starter'])) {
    return {
      text: 'Starter includes a 5-page website, basic SEO, and one-month support for INR 15k.',
      quickReplies: ['Timeline', 'Growth plan', 'Book call'],
    };
  }

  if (containsAny(message, ['growth'])) {
    return {
      text: 'Growth starts at INR 35k with ecommerce, admin panel, and advanced SEO setup.',
      quickReplies: ['Starter plan', 'AI OS plan', 'Book call'],
    };
  }

  if (containsAny(message, ['clinic autopilot', 'clinic ai', 'ai growth', 'ai os', 'automation', 'chatbot', 'local business os'])) {
    return {
      text: 'Growth Autopilot automates follow-ups, reminders, reviews, and bilingual patient workflows.',
      quickReplies: ['Clinic pricing', 'Book pilot', 'How it works'],
    };
  }

  if (containsAny(message, ['services', 'what do you do', 'offer'])) {
    return {
      text: 'We offer web development, SEO, branding, creative studio, and Growth Autopilot.',
      quickReplies: ['Web design', 'SEO', 'Branding'],
    };
  }

  if (containsAny(message, ['web design', 'website', 'web development'])) {
    return {
      text: 'We build fast business websites, ecommerce stores, and custom web apps.',
      quickReplies: ['Website pricing', 'Timeline', 'Book consultation'],
    };
  }

  if (containsAny(message, ['seo', 'geo', 'ranking', 'google'])) {
    return {
      text: 'Our SEO and GEO service targets AI overviews, snippets, and local search growth.',
      quickReplies: ['SEO pricing', 'Free audit', 'Case studies'],
    };
  }

  if (containsAny(message, ['branding', 'logo', 'identity'])) {
    return {
      text: 'Branding includes logo systems, visual identity, and premium brand assets.',
      quickReplies: ['Brand pricing', 'Portfolio', 'Book call'],
    };
  }

  if (containsAny(message, ['timeline', 'how long', 'delivery', 'deadline'])) {
    return {
      text: 'Typical websites take 2-4 weeks, while advanced custom builds take 4-8 weeks.',
      quickReplies: ['Starter plan', 'Growth plan', 'Discuss project'],
    };
  }

  if (containsAny(message, ['contact', 'phone', 'call', 'email', 'reach'])) {
    return {
      text: 'Call +91 9453878422 or email ashrafkamal1458@gmail.com for direct support.',
      quickReplies: ['Call now', 'Share email', 'Book call'],
    };
  }

  if (containsAny(message, ['location', 'where are you', 'gonda', 'lucknow', 'noida', 'ayodhya'])) {
    return {
      text: 'We serve from Gonda, Lucknow, Greater Noida, and Ayodhya, with global delivery.',
      quickReplies: ['Book call', 'See locations', 'Pricing'],
    };
  }

  if (containsAny(message, ['thanks', 'thank you'])) {
    return {
      text: 'You are welcome. Tell me what you want next and I will help quickly.',
      quickReplies: ['Pricing', 'Services', 'Contact'],
    };
  }

  if (containsAny(message, ['bye', 'goodbye'])) {
    return {
      text: 'Thanks for visiting. Reach us anytime and we can continue from here.',
      quickReplies: ['Start again', 'Pricing', 'Call now'],
    };
  }

  return null;
}

function isComplexQuery(rawMessage: string): boolean {
  const message = normalizeMessage(rawMessage);
  if (!message) return false;

  const complexSignals = [
    'strategy',
    'roadmap',
    'detailed plan',
    'compare',
    'proposal',
    'architecture',
    'workflow',
    'integration',
    'api',
    'crm',
    'erp',
    'funnel',
    'content calendar',
    'step by step',
    'case study',
    'custom solution',
  ];

  const wordCount = message.split(' ').filter(Boolean).length;
  return containsAny(message, complexSignals) || wordCount > 20;
}

function looksGibberish(rawMessage: string): boolean {
  const text = normalizeMessage(rawMessage).replace(/\s+/g, '');
  if (!text) return true;
  if (text.length >= 7 && /(.)\1{4,}/.test(text)) return true;
  if (text.length >= 8 && /^[a-z]{8,}$/.test(text) && !/[aeiou]/.test(text)) return true;
  return false;
}

function isLowValueOrOffTopicQuery(rawMessage: string, history: ChatHistoryItem[]): boolean {
  const message = normalizeMessage(rawMessage);
  if (!message) return true;

  const words = message.split(' ').filter(Boolean);
  const userMessagesInHistory = history.filter((item) => item.role === 'user').length;

  const fillerTerms = [
    'lol', 'lmao', 'rofl', 'haha', 'hehe', 'hmm', 'hmmm', 'ok', 'okay', 'k',
    'test', 'testing', 'asdf', 'qwerty', 'random', 'timepass', 'tp',
  ];

  const offTopicTerms = [
    'joke', 'meme', 'rap', 'lyrics', 'song', 'poem', 'story', 'movie', 'game',
    'roleplay', 'politics', 'crypto signal', 'stock tip', 'adult', 'dating',
    'astrology', 'horoscope', 'hack', 'exploit', 'malware',
  ];

  const businessIntentTerms = [
    'website', 'web design', 'seo', 'branding', 'growth', 'autopilot', 'clinic',
    'service', 'price', 'pricing', 'cost', 'budget', 'timeline', 'delivery',
    'contact', 'call', 'email', 'quote', 'project', 'portfolio', 'location',
  ];

  if (containsAny(message, offTopicTerms)) return true;
  if (looksGibberish(message)) return true;

  const veryShort = words.length <= 2;
  const fillerOnly = words.every((word) => fillerTerms.includes(word));
  const hasBusinessSignal = containsAny(message, businessIntentTerms);

  if (veryShort && fillerOnly) return true;
  if (veryShort && !hasBusinessSignal && userMessagesInHistory > 0) return true;

  return false;
}

function resolveModelSelection(modelSelection: string): ResolvedModel {
  const selection = (modelSelection || 'auto').trim();

  if (selection.startsWith('openai:')) {
    const alias = selection.split(':')[1] || 'latest';
    return {
      provider: 'openai',
      model: alias === 'latest' ? OPENAI_PAID_MODEL : alias,
      paid: true,
    };
  }

  if (selection.startsWith('google:') || selection.startsWith('gemini:')) {
    const alias = selection.split(':')[1] || 'latest';
    return {
      provider: 'gemini',
      model: alias === 'latest' ? GEMINI_PAID_MODEL : alias,
      paid: true,
    };
  }

  return {
    provider: 'openrouter',
    model: selection || OPENROUTER_MODEL,
    paid: false,
  };
}

function pickNextFreeModel(clientId: string): string {
  if (!FREE_OPENROUTER_MODELS.length) return OPENROUTER_MODEL;
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
    return fresh;
  }
  return current;
}

function resetGlobalCounter(counter: Counter, windowMs: number, now: number): Counter {
  if (now > counter.resetTime) {
    return { count: 0, resetTime: now + windowMs };
  }
  return counter;
}

function consumeRequestQuota(clientId: string): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  const counter = touchCounter(requestThrottleMap, clientId, REQUEST_WINDOW_MS, now);

  if (counter.count >= REQUEST_LIMIT) {
    return { allowed: false, retryAfterMs: Math.max(0, counter.resetTime - now) };
  }

  counter.count += 1;
  return { allowed: true, retryAfterMs: 0 };
}

function consumeGroqQuota(clientId: string): { allowed: boolean; reason?: string } {
  const now = Date.now();
  const clientHour = touchCounter(groqClientHourMap, clientId, HOUR_MS, now);
  const clientDay = touchCounter(groqClientDayMap, clientId, DAY_MS, now);
  groqGlobalHourCounter = resetGlobalCounter(groqGlobalHourCounter, HOUR_MS, now);
  groqGlobalDayCounter = resetGlobalCounter(groqGlobalDayCounter, DAY_MS, now);

  if (clientHour.count >= GROQ_CLIENT_HOURLY_LIMIT) return { allowed: false, reason: 'client_hourly' };
  if (clientDay.count >= GROQ_CLIENT_DAILY_LIMIT) return { allowed: false, reason: 'client_daily' };
  if (groqGlobalHourCounter.count >= GROQ_GLOBAL_HOURLY_LIMIT) return { allowed: false, reason: 'global_hourly' };
  if (groqGlobalDayCounter.count >= GROQ_GLOBAL_DAILY_LIMIT) return { allowed: false, reason: 'global_daily' };

  clientHour.count += 1;
  clientDay.count += 1;
  groqGlobalHourCounter.count += 1;
  groqGlobalDayCounter.count += 1;

  return { allowed: true };
}

function cleanupExpiredEntries(): void {
  const now = Date.now();
  const maps = [requestThrottleMap, groqClientHourMap, groqClientDayMap];
  for (const map of maps) {
    for (const [key, value] of map.entries()) {
      if (now > value.resetTime) map.delete(key);
    }
  }
  if (freeModelPointerMap.size > 5000) freeModelPointerMap.clear();
}

const globalState = globalThis as typeof globalThis & { __echoCleanupIntervalStarted?: boolean };
if (!globalState.__echoCleanupIntervalStarted) {
  setInterval(cleanupExpiredEntries, MINUTE_MS);
  globalState.__echoCleanupIntervalStarted = true;
}

export async function chatWithGemini(
  history: ChatHistoryItem[],
  message: string,
  clientId: string = 'anonymous',
  selectedModel: string = 'auto'
) {
  const throttle = consumeRequestQuota(clientId);
  if (!throttle.allowed) {
    return formatReply(
      'Too many messages right now. Please wait a bit and try again.',
      ['Try again', 'Pricing', 'Contact']
    );
  }

  const sanitizedMessage = sanitizeInput(message);
  if (!sanitizedMessage) {
    return formatReply('Please type your question again.', ['Pricing', 'Services', 'Contact']);
  }

  const predefined = getPredefinedReply(sanitizedMessage);
  if (predefined) {
    return formatReply(predefined.text, predefined.quickReplies);
  }

  const queryIsComplex = isComplexQuery(sanitizedMessage);
  const lowValue = isLowValueOrOffTopicQuery(sanitizedMessage, history);

  if (selectedModel && selectedModel !== 'auto') {
    const chosen = resolveModelSelection(selectedModel);
    if (chosen.paid && lowValue) {
      return await callOpenRouter(sanitizedMessage, history, pickNextFreeModel(clientId));
    }
    return await callModelBySelection(chosen, sanitizedMessage, history, clientId);
  }

  if (lowValue) {
    return await callOpenRouter(sanitizedMessage, history, pickNextFreeModel(clientId));
  }

  if (SMART_ROUTING && !queryIsComplex) {
    return await callOpenRouter(sanitizedMessage, history, OPENROUTER_MODEL);
  }

  if (SMART_ROUTING && queryIsComplex) {
    const paidOpenAI = await callOpenAI(sanitizedMessage, history, OPENAI_PAID_MODEL);
    if (paidOpenAI) return paidOpenAI;

    const paidGemini = await callGemini(sanitizedMessage, history, GEMINI_PAID_MODEL);
    if (paidGemini) return paidGemini;

    const groqResult = await tryGroq(sanitizedMessage, history, clientId);
    if (groqResult) return groqResult;

    return await callOpenRouter(sanitizedMessage, history, OPENROUTER_DEEP_MODEL);
  }

  if (!queryIsComplex) {
    return formatReply(
      'I can instantly help with pricing, services, timeline, and contact details.',
      ['Pricing', 'Services', 'Timeline']
    );
  }

  const paidOpenAI = await callOpenAI(sanitizedMessage, history, OPENAI_PAID_MODEL);
  if (paidOpenAI) return paidOpenAI;

  const paidGemini = await callGemini(sanitizedMessage, history, GEMINI_PAID_MODEL);
  if (paidGemini) return paidGemini;

  const groqResult = await tryGroq(sanitizedMessage, history, clientId);
  if (groqResult) return groqResult;

  return formatReply(
    'I am having trouble with advanced AI right now. Basic help is still available.',
    ['Pricing', 'Services', 'Contact']
  );
}

async function callModelBySelection(
  selection: ResolvedModel,
  message: string,
  history: ChatHistoryItem[],
  clientId: string
): Promise<string> {
  if (selection.provider === 'openrouter') {
    return await callOpenRouter(message, history, selection.model);
  }

  if (selection.provider === 'openai') {
    const openAIText = await callOpenAI(message, history, selection.model);
    if (openAIText) return openAIText;
    return await callOpenRouter(message, history, pickNextFreeModel(clientId));
  }

  const geminiText = await callGemini(message, history, selection.model);
  if (geminiText) return geminiText;
  return await callOpenRouter(message, history, pickNextFreeModel(clientId));
}

async function callOpenRouter(message: string, history: ChatHistoryItem[], model: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey === 'your_openrouter_key_here') {
    console.error('[CHAT] OPENROUTER_API_KEY is missing');
    return formatReply('AI is not configured yet. Basic help is active.', ['Pricing', 'Services', 'Contact']);
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
          { role: 'system', content: buildSystemPrompt() },
          ...toOpenAIHistory(history),
          { role: 'user', content: message },
        ],
        max_tokens: 180,
        temperature: 0.45,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || `OpenRouter API error: ${response.status}`);
    }

    const text = data.choices?.[0]?.message?.content || 'I could not process that right now.';
    return sanitizeInput(text);
  } catch (error: unknown) {
    console.error('[CHAT] OpenRouter error:', error instanceof Error ? error.message : 'Unknown error');
    return formatReply('AI is temporarily unavailable. Basic help is active.', ['Pricing', 'Services', 'Contact']);
  }
}

async function callOpenAI(message: string, history: ChatHistoryItem[], model: string): Promise<string | null> {
  if (!OPENAI_API_KEY) return null;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: buildSystemPrompt() },
          ...toOpenAIHistory(history),
          { role: 'user', content: message },
        ],
        max_tokens: 180,
        temperature: 0.45,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.warn('[CHAT] OpenAI failed:', response.status, (data?.error?.message || '').slice(0, 180));
      return null;
    }

    const text = data.choices?.[0]?.message?.content;
    if (!text) return null;
    return sanitizeInput(text);
  } catch (error: unknown) {
    console.warn('[CHAT] OpenAI error:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}

async function callGemini(message: string, history: ChatHistoryItem[], model: string): Promise<string | null> {
  if (!GOOGLE_GEMINI_API_KEY) return null;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${GOOGLE_GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: buildSystemPrompt() }],
          },
          contents: [
            ...toGeminiHistory(history),
            { role: 'user', parts: [{ text: message }] },
          ],
          generationConfig: {
            maxOutputTokens: 180,
            temperature: 0.45,
          },
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      console.warn('[CHAT] Gemini failed:', response.status, JSON.stringify(data).slice(0, 180));
      return null;
    }

    const parts = data?.candidates?.[0]?.content?.parts;
    const text = Array.isArray(parts) ? parts.map((part: { text?: string }) => part.text || '').join(' ').trim() : '';
    if (!text) return null;
    return sanitizeInput(text);
  } catch (error: unknown) {
    console.warn('[CHAT] Gemini error:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}

async function tryGroq(message: string, history: ChatHistoryItem[], clientId: string): Promise<string | null> {
  if (!GROQ_ENABLED) return null;

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const quota = consumeGroqQuota(clientId);
  if (!quota.allowed) return null;

  try {
    const groq = new Groq({ apiKey });

    const response = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        ...toOpenAIHistory(history),
        { role: 'user', content: message },
      ],
      max_tokens: 180,
      temperature: 0.45,
    });

    const text = response.choices[0]?.message?.content || 'I could not process that right now.';
    return sanitizeInput(text);
  } catch (error: unknown) {
    console.error('[CHAT] Groq error:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}
