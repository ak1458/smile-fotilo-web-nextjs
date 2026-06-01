// SMART AI ROUTER - Prioritizes FREE APIs first
// Falls back through: OpenRouter (free) → Gemini (free) → Groq (free $5/mo)

// API Keys from environment
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const GOOGLE_GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const GEMINI_ROUTER_MODEL =
  process.env.GEMINI_ROUTER_MODEL ||
  process.env.GEMINI_PAID_MODEL ||
  process.env.GOOGLE_GEMINI_MODEL ||
  'gemini-3-flash-preview';

// Track API usage (simple in-memory tracking, reset on deploy)
const usageTracker = {
  gemini: { count: 0, resetAt: Date.now() },
  groq: { tokens: 0, resetAt: Date.now() }
};

// Reset counters daily
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Main function to generate AI response
 * Tries free options first, falls back to paid only if needed
 */
export async function generateAIResponse(
  prompt: string,
  options: {
    maxTokens?: number;
    temperature?: number;
    complexity?: 'simple' | 'medium' | 'complex';
  } = {}
): Promise<string> {
  const { maxTokens = 300, temperature = 0.7, complexity = 'medium' } = options;

  // Reset counters if it's a new day
  const now = Date.now();
  if (now - usageTracker.gemini.resetAt > DAY_MS) {
    usageTracker.gemini = { count: 0, resetAt: now };
    usageTracker.groq = { tokens: 0, resetAt: now };
  }

  // Strategy based on complexity
  if (complexity === 'simple') {
    // Try OpenRouter free first (unlimited but slower)
    try {
      const result = await callOpenRouterFree(prompt, maxTokens, temperature);
      if (result) return result;
    } catch {
      // OpenRouter failed, will try Gemini next
    }
  }

  // Try Gemini (1,500 requests/day free)
  if (usageTracker.gemini.count < 1500) {
    try {
      const result = await callGemini(prompt, maxTokens, temperature);
      if (result) {
        usageTracker.gemini.count++;
        return result;
      }
    } catch {
      // Gemini failed, will try Groq next
    }
  }

  // Try Groq ($5/month credit - very fast)
  try {
    const result = await callGroq(prompt, maxTokens, temperature);
    if (result) return result;
  } catch {
    // Groq failed, using fallback template
  }

  // Final fallback: Template response
  return getTemplateResponse(prompt);
}

/**
 * OpenRouter FREE tier
 * Unlimited requests but rate limited to 20 RPM
 */
async function callOpenRouterFree(
  prompt: string,
  maxTokens: number,
  temperature: number
): Promise<string | null> {
  if (!OPENROUTER_API_KEY) return null;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://smilefotilo.com',
      'X-Title': 'Smile Fotilo'
    },
    body: JSON.stringify({
      model: 'z-ai/glm-4.5-air:free', // FREE MODEL
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
      temperature: temperature
    })
  });

  if (!response.ok) return null;

  const data = await response.json();
  return data.choices?.[0]?.message?.content || null;
}

/**
 * Google Gemini FREE tier
 * 1,500 requests per day
 * Great for most use cases
 */
async function callGemini(
  prompt: string,
  maxTokens: number,
  temperature: number
): Promise<string | null> {
  if (!GOOGLE_GEMINI_API_KEY) return null;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_ROUTER_MODEL)}:generateContent?key=${GOOGLE_GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: temperature
        }
      })
    }
  );

  if (!response.ok) return null;

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
}

/**
 * Groq FREE tier
 * $5/month credit (approximately 500K tokens)
 * Very fast inference!
 */
async function callGroq(
  prompt: string,
  maxTokens: number,
  temperature: number
): Promise<string | null> {
  if (!GROQ_API_KEY) return null;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
      temperature: temperature
    })
  });

  if (!response.ok) return null;

  const data = await response.json();
  
  // Track token usage
  const tokensUsed = data.usage?.total_tokens || 0;
  usageTracker.groq.tokens += tokensUsed;
  
  return data.choices?.[0]?.message?.content || null;
}

/**
 * Template fallback for when all APIs fail
 */
function getTemplateResponse(prompt: string): string {
  // Fallback for the Smile Fotilo site assistant when all AI providers are down.
  // (Previously held leftover clinic-bot templates — wrong for our own site.)
  const p = prompt.toLowerCase();
  const wa = 'WhatsApp +91 94538 78422';

  if (p.includes('price') || p.includes('cost') || p.includes('rate') || p.includes('budget')) {
    return `Websites start at ₹25,000 (Launch) and ₹65,000 (Growth, with e-commerce). Local SEO from ₹15,000/month. Tell me your project and I'll point you to the right fit — or ${wa} for a fast quote.`;
  }
  if (p.includes('time') || p.includes('hour') || p.includes('open') || p.includes('reply')) {
    return `We reply the same day, Monday–Saturday, 9am–6pm IST. Fastest way to reach Ashraf: ${wa}.`;
  }
  if (p.includes('appointment') || p.includes('booking') || p.includes('call') || p.includes('meeting')) {
    return `Happy to set up a quick call. Share your name and what you need (website, SEO, or automation) and the best time — or message us on ${wa}.`;
  }
  if (p.includes('location') || p.includes('address') || p.includes('where')) {
    return `We're based in Gonda (HQ) with studios in Greater Noida and Ayodhya, and we work with clients across Uttar Pradesh and worldwide.`;
  }
  if (p.includes('service') || p.includes('do you') || p.includes('what can')) {
    return `We build websites, run local SEO, set up e-commerce, and add AI automation (like WhatsApp follow-ups and missed-call recovery). What are you trying to grow?`;
  }
  if (p.includes('thank') || p.includes('thanks') || p.includes('dhanyavad')) {
    return `You're welcome! Anything else I can help with? You can also reach us on ${wa}.`;
  }
  return `I can help with websites, SEO, and automation. Tell me a bit about your business and I'll guide you — or reach Ashraf directly on ${wa}.`;
}

/**
 * Check current API status
 */
export function getAPIStatus() {
  return {
    openrouter: { available: !!OPENROUTER_API_KEY, type: 'free' },
    gemini: { 
      available: !!GOOGLE_GEMINI_API_KEY, 
      type: 'free', 
      remainingToday: Math.max(0, 1500 - usageTracker.gemini.count) 
    },
    groq: { 
      available: !!GROQ_API_KEY, 
      type: 'free ($5/mo)', 
      estimatedRemaining: Math.max(0, 500000 - usageTracker.groq.tokens) 
    }
  };
}

/**
 * Batch process multiple prompts efficiently
 */
export async function batchGenerate(
  prompts: string[],
  options: { maxTokens?: number; temperature?: number } = {}
): Promise<string[]> {
  // For batch processing, use Gemini (better for bulk)
  const results: string[] = [];
  
  for (const prompt of prompts) {
    const result = await generateAIResponse(prompt, options);
    results.push(result);
    
    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return results;
}

/**
 * Generate embeddings for RAG (use Gemini or OpenRouter)
 */
export async function generateEmbedding(text: string): Promise<number[] | null> {
  // Use Gemini for embeddings (free)
  if (GOOGLE_GEMINI_API_KEY && usageTracker.gemini.count < 1500) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key=${GOOGLE_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'models/embedding-001',
            content: { parts: [{ text }] }
          })
        }
      );

      if (response.ok) {
        usageTracker.gemini.count++;
        const data = await response.json();
        return data.embedding?.values || null;
      }
    } catch {
      // Gemini embedding failed
    }
  }

  // Fallback: Use OpenRouter with embedding model
  if (OPENROUTER_API_KEY) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai/text-embedding-ada-002',
          input: text
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.data?.[0]?.embedding || null;
      }
    } catch {
      // OpenRouter embedding failed
    }
  }

  return null;
}
