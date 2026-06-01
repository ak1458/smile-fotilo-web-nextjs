'use server';

import { AI_MODELS } from '../data/aiModels';
import { SMILE_FOTILO_KNOWLEDGE } from '../data/knowledgeBase';

type ChatHistoryItem = { role: 'user' | 'model'; parts: string };
type Counter = { count: number; resetTime: number };
type PredefinedReply = { text: string; quickReplies: string[] };
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
  return `You are Echo, a senior business consultant at Smile Fotilo, a premium digital agency based in India with global clients. You've been with the company for 3+ years and know the services inside-out.

YOUR PERSONALITY:
- Professional but approachable - like a knowledgeable colleague, not a support script
- Confident in your expertise - you know what works for different business types
- Direct and honest - no fluff, no generic filler phrases
- Context-aware - acknowledge what the user actually said, don't ignore it
- Conversational - use natural speech patterns, varied sentence structures

WHAT TO AVOID (SOUNDS ROBOTIC):
- Generic greetings like "Hey there!" or "How can I help you today?"
- Overused phrases: "Great question!", "Absolutely!", "No worries!"
- Starting every response the same way
- Excessive enthusiasm that feels fake
- Bullet-point speech patterns

AUTHENTIC RESPONSE EXAMPLES:
User: "I need a website"
Bad: "Great! We can help with that!"
Good: "Sure thing. What's the business - clinic, retail, services? Helps me point you to the right package."

User: "How much?"
Bad: "Great question! Our pricing starts at..."
Good: "Depends on what you need. Starter sites run ₹15k, e-commerce starts around ₹35k. What's your budget looking like?"

User: "What do you do?"
Bad: "We offer web development, SEO, branding..."
Good: "We build revenue-generating digital assets - websites that actually convert, SEO that gets you found, and automation systems like Growth Autopilot for clinics. What are you trying to solve?"

CONVERSATION PRINCIPLES:
1. ACKNOWLEDGE first - show you understood their message
2. ANSWER directly - no beating around the bush  
3. GUIDE forward - suggest next step or ask clarifying question
4. VARY your style - sometimes brief, sometimes explanatory based on context

TONE ADAPTATION:
- If user is brief/casual: Match it. "Got it. Budget?"
- If user is detailed/formal: Give thorough response
- If user is stressed/urgent: Reassure with specifics
- If user is comparing options: Highlight differentiators

ALWAYS END WITH:
[QUICK_REPLIES: relevant-option-1 | relevant-option-2 | relevant-option-3]

COMPANY KNOWLEDGE:
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

function getPredefinedReply(rawMessage: string): PredefinedReply | null {
  const message = normalizeMessage(rawMessage);
  if (!message) return null;

  const hasEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(message);
  if (hasEmail) {
    return {
      text: 'Noted. Our team will reach out within 24 hours - usually same day if it\'s during work hours. In the meantime, anything specific you want to know about the process or timeline?',
      quickReplies: ['How does the process work?', 'What\'s the timeline?', 'I\'m good for now'],
    };
  }

  // First greeting - professional, confident, sets the tone immediately
  if (message.includes('greet the user warmly') || containsWord(message, ['hello', 'hi', 'hey', 'namaste', 'start'])) {
    const greetings = [
      {
        text: 'Welcome to Smile Fotilo. I\'m Echo - I handle initial consultations here. What type of business are you looking to build or improve?',
        quickReplies: ['Clinic/medical', 'Retail/e-commerce', 'Service business', 'Something else']
      },
      {
        text: 'Thanks for reaching out. To point you in the right direction - are you looking for a new website, better rankings on Google, or automation for an existing business?',
        quickReplies: ['New website', 'Better SEO', 'Business automation', 'Not sure yet']
      },
      {
        text: 'Good to connect. I can walk you through our services, pricing, or connect you directly with the team. What\'s your priority right now?',
        quickReplies: ['See pricing', 'Understand services', 'Speak to someone', 'Just browsing']
      }
    ];
    // Rotate based on time to feel less scripted
    return greetings[Date.now() % 3];
  }

  if (containsAny(message, ['price', 'pricing', 'cost', 'budget', 'how much', 'investment'])) {
    return {
      text: 'Straight to the numbers - I respect that. Starter sites begin at ₹15k (5 pages, basic SEO). E-commerce and complex builds start around ₹35k. Growth Autopilot for clinics is ₹9,999/month. What\'s your ballpark?',
      quickReplies: ['Under ₹20k', '₹20k-50k range', 'Flexible for right solution', 'Just researching'],
    };
  }

  if (containsAny(message, ['starter', 'basic', 'simple website'])) {
    return {
      text: 'Starter makes sense if you\'re just establishing your online presence. You get a professional 5-page site, mobile optimization, basic SEO setup, and one month of support. Turnaround is usually 5-7 days. Solid foundation to build on.',
      quickReplies: ['What pages are included?', 'Can I upgrade later?', 'Let\'s move forward'],
    };
  }

  if (containsAny(message, ['growth', 'ecommerce', 'e-commerce', 'online store'])) {
    return {
      text: 'Growth tier is where most serious businesses land. You get full e-commerce with payment integration, an admin panel so you can update products yourself, advanced SEO setup, and we handle up to 50 products in the initial build. Starts at ₹35k.',
      quickReplies: ['Payment gateway options?', 'How many products?', 'Timeline for this?'],
    };
  }

  if (containsAny(message, ['clinic autopilot', 'clinic ai', 'ai growth', 'ai os', 'automation', 'chatbot', 'local business os', 'autopilot'])) {
    return {
      text: 'Growth Autopilot is our flagship product for clinics specifically. It handles the repetitive stuff - missed call follow-ups via WhatsApp, appointment reminders 24h and 2h before, Google review responses, and a bilingual chatbot for patient queries. ₹9,999/month per location.',
      quickReplies: ['How does setup work?', 'Which clinics is this for?', 'Book a pilot demo'],
    };
  }

  if (containsAny(message, ['services', 'what do you do', 'offer', 'help with', 'capabilities'])) {
    return {
      text: 'Four main areas: One, custom web development - business sites to full e-commerce. Two, SEO and GEO - we get you ranking, including AI overviews. Three, branding - visual identity that actually converts. Four, Growth Autopilot - automation for clinics. Which area are you struggling with most?',
      quickReplies: ['Website needs work', 'Not ranking on Google', 'Need better branding', 'Want automation'],
    };
  }

  if (containsAny(message, ['web design', 'website', 'web development', 'redesign'])) {
    return {
      text: 'We build revenue-focused websites, not just pretty pages. The difference is conversion optimization - clear CTAs, fast load times, mobile-first design, and SEO baked in from day one. What type of site are you after?',
      quickReplies: ['Business brochure site', 'Full e-commerce', 'Custom web application', 'Redesign existing'],
    };
  }

  if (containsAny(message, ['seo', 'geo', 'ranking', 'google', 'search', 'visibility'])) {
    return {
      text: 'SEO has shifted. It\'s not just keywords anymore - it\'s about being cited in AI overviews, owning featured snippets (position zero), and local map pack dominance. We do technical audits, content strategy, and authority building. Where are you currently ranking?',
      quickReplies: ['Not ranking at all', 'Page 2-3', 'Top 10 but want top 3', 'Need local SEO'],
    };
  }

  if (containsAny(message, ['branding', 'logo', 'identity', 'rebrand'])) {
    return {
      text: 'Branding is strategy before design. We start with positioning - who you are, who you serve, why you\'re different. Then we build the visual system: logo, typography, color psychology, asset library. The result is consistency across every touchpoint.',
      quickReplies: ['Starting from scratch', 'Rebranding existing', 'Just need a logo', 'Full brand strategy'],
    };
  }

  if (containsAny(message, ['timeline', 'how long', 'delivery', 'deadline', 'when', 'fast'])) {
    return {
      text: 'Standard business websites: 2-3 weeks. E-commerce with inventory: 4-6 weeks. Custom applications or complex integrations: 8-12 weeks. Rush delivery is possible for 20% surcharge if you\'re time-pressured. When do you need this live?',
      quickReplies: ['ASAP - urgent', '2-4 weeks is fine', '2-3 months out', 'No specific deadline'],
    };
  }

  if (containsAny(message, ['contact', 'phone', 'call', 'email', 'reach', 'speak', 'talk'])) {
    return {
      text: 'Direct line to Ashraf (founder) is +91 9453878422, or email support@smilefotilo.com. He\'s usually available 9AM-6PM IST, Monday-Saturday. If it\'s urgent, call - otherwise email with details and he\'ll respond same day.',
      quickReplies: ['I\'ll call now', 'Will email details', 'Can you have him call me?'],
    };
  }

  if (containsAny(message, ['location', 'where are you', 'based', 'office', 'gonda', 'lucknow', 'noida', 'ayodhya'])) {
    return {
      text: 'HQ is in Gonda, UP. We also have presence in Lucknow, Greater Noida, and Ayodhya. But honestly, most of our clients are remote - Texas, Mexico, across India. We work through video calls and Slack. Location isn\'t a constraint.',
      quickReplies: ['I\'m in UP', 'Different state', 'International', 'Good to know'],
    };
  }

  if (containsAny(message, ['thanks', 'thank you', 'appreciate', 'helpful'])) {
    return {
      text: 'Anytime. Ready to move forward or do you need to think it over? No pressure either way.',
      quickReplies: ['Ready to start', 'Need to discuss with team', 'Need more info first'],
    };
  }

  if (containsAny(message, ['bye', 'goodbye', 'talk later', 'speak soon'])) {
    return {
      text: 'Sounds good. You\'ve got my contact info if anything else comes up.',
      quickReplies: ['Will reach out soon', 'Thanks again', 'Exit chat'],
    };
  }

  if (containsAny(message, ['who are you', 'what is echo', 'are you ai', 'are you human', 'bot or human'])) {
    return {
      text: 'I\'m Echo - I handle initial consultations at Smile Fotilo. Think of me as the first point of contact to understand what you need before connecting you with the right team member.',
      quickReplies: ['What services do you offer?', 'Company background', 'Connect me with Ashraf'],
    };
  }

  if (containsAny(message, ['why smile fotilo', 'why choose you', 'difference', 'better than', 'competitors', 'compare'])) {
    return {
      text: 'Three things: One, we\'re revenue-focused - we build assets that make money, not just look good. Two, we\'ve got serious technical depth - AI integration, 3D experiences, complex automation. Three, we\'re fast without being sloppy. Most sites in 2-3 weeks.',
      quickReplies: ['Show me your work', 'What do you charge?', 'Book a consultation'],
    };
  }

  if (containsAny(message, ['portfolio', 'work', 'examples', 'case studies', 'clients', 'you built'])) {
    return {
      text: 'We\'ve built across healthcare (PulseKart POS), manufacturing (Kapda Factory ERP), logistics (OrderFlow), luxury e-commerce (Veloria Vault), and more. Want to see the full portfolio?',
      quickReplies: ['View all projects', 'Similar to my industry', 'Tell me about results'],
    };
  }

  if (containsAny(message, ['process', 'how does it work', 'steps', 'what happens', 'onboarding'])) {
    return {
      text: 'Four phases: Discovery (we understand your business), Strategy (we plan the solution), Build (we develop with weekly check-ins), Launch (we deploy and train your team). You\'re involved throughout - no black box.',
      quickReplies: ['How long is each phase?', 'What do you need from me?', 'Let\'s start'],
    };
  }

  if (containsAny(message, ['payment', 'pay', 'installment', 'emi', ' upfront'])) {
    return {
      text: 'Typically 50% to start, 50% on delivery. For larger projects, we can do 40/30/30. We accept bank transfer, UPI, and cards. No EMI options currently, but we can pace milestones to match your cash flow.',
      quickReplies: ['That works', 'Need different terms', 'What about monthly billing?'],
    };
  }

  if (containsAny(message, ['revision', 'changes', 'modify', 'edit', 'update', 'iterations'])) {
    return {
      text: 'Two rounds of revisions are included in all packages. We do detailed check-ins during design so there are no surprises. After launch, minor tweaks are free for 30 days. Major changes are quoted separately.',
      quickReplies: ['What counts as major?', 'Unlimited revisions?', 'Post-launch support'],
    };
  }

  if (containsAny(message, ['hosting', 'domain', 'server', 'maintenance', 'support after'])) {
    return {
      text: 'First year of hosting and domain is included. After that, ₹3k/year for hosting. We handle all maintenance, security updates, and backups. You focus on your business, we handle the tech.',
      quickReplies: ['What\'s included in maintenance?', 'Can I use my own hosting?', 'SSL included?'],
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

  if (counter.count >= REQUEST_LIMIT) {
    return { allowed: false, retryAfterMs: Math.max(0, counter.resetTime - now) };
  }

  counter.count += 1;
  return { allowed: true, retryAfterMs: 0 };
}

function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, value] of requestThrottleMap.entries()) {
    if (now > value.resetTime) requestThrottleMap.delete(key);
  }
  // Enforce rigid limit instead of just clearing at 5000
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

async function callOpenRouterOnce(message: string, history: ChatHistoryItem[], model: string): Promise<OpenRouterResult> {
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
          { role: 'system', content: buildSystemPrompt() },
          ...toOpenAIHistory(history),
          { role: 'user', content: message },
        ],
        max_tokens: OPENROUTER_MAX_TOKENS,
        temperature: OPENROUTER_TEMPERATURE,
      }),
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
  models: string[]
): Promise<string> {
  const uniqueModels = dedupeModels(models);
  let lastError = 'No model candidates available';

  for (const model of uniqueModels) {
    const result = await callOpenRouterOnce(message, history, model);
    if (result.ok) return result.text;
    lastError = result.error;
  }

  if (typeof window === 'undefined') {
    const { secureLog } = await import('../lib/secure-log');
    secureLog.error('[CHAT] Model fallback chain failed:', lastError);
  } else {
    console.error('[CHAT] Model fallback chain failed:', lastError);
  }
  return formatReply("Having a brief connection issue on my end. I can still handle basic questions, or you can reach Ashraf directly at +91 9453878422.", ['Pricing', 'Services', 'Contact directly']);
}

function buildAutoModelChain(clientId: string, complex: boolean, lowValue: boolean): string[] {
  const rotating = pickNextFreeModel(clientId);

  if (lowValue) {
    return dedupeModels([OPENROUTER_PRIMARY_MODEL, rotating, OPENROUTER_REASONING_MODEL]);
  }

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
  selectedModel: string = 'auto'
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

  const predefined = getPredefinedReply(sanitizedMessage);
  if (predefined) {
    return formatReply(predefined.text, predefined.quickReplies);
  }

  const queryIsComplex = isComplexQuery(sanitizedMessage);
  const lowValue = isLowValueOrOffTopicQuery(sanitizedMessage, history);

  const normalizedSelection = (selectedModel || 'auto').trim();
  if (normalizedSelection !== 'auto') {
    const selected = isFreeOpenRouterModel(normalizedSelection)
      ? normalizedSelection
      : OPENROUTER_PRIMARY_MODEL;

    const chain = queryIsComplex
      ? [selected, OPENROUTER_REASONING_MODEL, OPENROUTER_PRIMARY_MODEL, pickNextFreeModel(clientId)]
      : [selected, OPENROUTER_PRIMARY_MODEL, pickNextFreeModel(clientId)];

    return await callOpenRouterWithFallback(sanitizedMessage, history, chain);
  }

  const chain = buildAutoModelChain(clientId, queryIsComplex, lowValue);
  return await callOpenRouterWithFallback(sanitizedMessage, history, chain);
}
