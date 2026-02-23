// SMART AI ROUTER - Prioritizes FREE APIs first
// Falls back through: OpenRouter (free) → Gemini (free) → Groq (free $5/mo)

// API Keys from environment
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const GOOGLE_GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

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
    } catch (e) {
      console.log('OpenRouter free failed, trying Gemini');
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
    } catch (e) {
      console.log('Gemini failed or limit reached, trying Groq');
    }
  }

  // Try Groq ($5/month credit - very fast)
  try {
    const result = await callGroq(prompt, maxTokens, temperature);
    if (result) return result;
  } catch (e) {
    console.log('Groq failed, using fallback template');
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
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_GEMINI_API_KEY}`,
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
  const prompt_lower = prompt.toLowerCase();

  // Common business queries
  if (prompt_lower.includes('price') || prompt_lower.includes('cost') || prompt_lower.includes('rate')) {
    return 'Hamari services ki pricing bahut competitive hai. Starter plan ₹15,000 se shuru hota hai. Details ke liye call karein!';
  }

  if (prompt_lower.includes('time') || prompt_lower.includes('hour') || prompt_lower.includes('open')) {
    return 'Hamara clinic subah 9 baje se shaam 7 baje tak open rehta hai. Monday to Saturday.';
  }

  if (prompt_lower.includes('appointment') || prompt_lower.includes('booking') || prompt_lower.includes('slot')) {
    return 'Appointment book karne ke liye aapna naam aur preferred date/time bataiye. Main aapko confirm kar deta hoon.';
  }

  if (prompt_lower.includes('location') || prompt_lower.includes('address') || prompt_lower.includes('where')) {
    return 'Hamara address: [Business Address]. Aap Google Maps par "[Business Name]" search kar sakte hain.';
  }

  if (prompt_lower.includes('service') || prompt_lower.includes('treatment') || prompt_lower.includes('facility')) {
    return 'Ham yeh services provide karte hain: [List services]. Koi specific service ke baare mein jaankari chahiye?';
  }

  if (prompt_lower.includes('doctor') || prompt_lower.includes('dr.') || prompt_lower.includes('who')) {
    return 'Hamare yahan experienced doctors hain. Dr. [Name] ke paas 10+ saal ka experience hai. Aap unse milna chahenge?';
  }

  if (prompt_lower.includes('thank') || prompt_lower.includes('thanks') || prompt_lower.includes('dhanyavad')) {
    return 'Aapka welcome hai! Koi aur madad chahiye toh batana.';
  }

  // Default response
  return 'Main aapki madad karna chahta hoon. Kripaya apna sawal thoda detail mein batayein.';
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
    } catch (e) {
      console.log('Gemini embedding failed');
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
    } catch (e) {
      console.log('OpenRouter embedding failed');
    }
  }

  return null;
}
