/**
 * API Timeout Wrapper
 * Prevents hung requests from blocking resources
 */

export interface TimeoutOptions {
  timeoutMs: number;
  errorMessage?: string;
}

/**
 * Wrap a promise with a timeout
 */
export function withTimeout<T>(
  promise: Promise<T>,
  options: TimeoutOptions
): Promise<T> {
  const { timeoutMs, errorMessage = 'Request timeout' } = options;
  
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(errorMessage));
      }, timeoutMs);
    }),
  ]);
}

/**
 * Fetch with timeout
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit & { timeoutMs?: number } = {}
): Promise<Response> {
  const { timeoutMs = 10000, ...fetchOptions } = options;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Timeout configurations for different API calls
 */
export const timeouts = {
  // Fast AI models (Groq, Gemini)
  fastAI: 15000,      // 15 seconds
  
  // Slower AI models (OpenRouter free)
  slowAI: 30000,      // 30 seconds
  
  // External APIs
  externalAPI: 10000, // 10 seconds
  
  // Database operations
  database: 5000,     // 5 seconds
  
  // Webhook processing
  webhook: 10000,     // 10 seconds
};
