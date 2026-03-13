/**
 * Rate Limiting Middleware
 * Protects APIs from abuse and excessive usage
 */

interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  limit: number;    // Max requests per interval
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store (use Redis in production for distributed systems)
// Added MAX_ENTRIES to prevent unbounded memory growth (LRU approach)
const rateLimitStore = new Map<string, RateLimitEntry>();
const MAX_ENTRIES = 5000;

// Cleanup expired entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;

function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Ensure store doesn't exceed MAX_ENTRIES
function enforceCacheLimit() {
  if (rateLimitStore.size > MAX_ENTRIES) {
    // Delete the oldest entry (Map iterates in insertion order)
    const oldestKey = rateLimitStore.keys().next().value;
    if (oldestKey !== undefined) {
      rateLimitStore.delete(oldestKey);
    }
  }
}

// Start cleanup interval
if (typeof globalThis !== 'undefined') {
  const globalState = globalThis as typeof globalThis & { __rateLimitCleanupStarted?: boolean };
  if (!globalState.__rateLimitCleanupStarted) {
    setInterval(cleanupExpiredEntries, CLEANUP_INTERVAL);
    globalState.__rateLimitCleanupStarted = true;
  }
}

/**
 * Get client identifier from request
 * Uses IP address + user agent fingerprint
 */
export function getClientIdentifier(request: Request): string {
  const ip = request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    'unknown';

  const userAgent = request.headers.get('user-agent') || '';
  const userAgentHash = userAgent.slice(0, 50); // First 50 chars

  // Create a simple hash
  return `${ip}_${userAgentHash}`.replace(/[^a-zA-Z0-9_-]/g, '_');
}

/**
 * Check if request is within rate limit
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetTime: number; retryAfter: number } {
  const now = Date.now();
  const key = identifier;

  const existing = rateLimitStore.get(key);

  if (!existing || now > existing.resetTime) {
    // New window
    const resetTime = now + config.interval;
    rateLimitStore.set(key, {
      count: 1,
      resetTime,
    });
    enforceCacheLimit();

    return {
      allowed: true,
      remaining: config.limit - 1,
      resetTime,
      retryAfter: 0,
    };
  }

  // Existing window
  if (existing.count >= config.limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: existing.resetTime,
      retryAfter: Math.ceil((existing.resetTime - now) / 1000),
    };
  }

  existing.count++;

  return {
    allowed: true,
    remaining: config.limit - existing.count,
    resetTime: existing.resetTime,
    retryAfter: 0,
  };
}

/**
 * Rate limit configurations for different API types
 */
export const rateLimits = {
  // Public AI APIs (strict to prevent abuse)
  publicApi: {
    interval: 60 * 1000, // 1 minute
    limit: parseInt(process.env.RATE_LIMIT_PUBLIC_API || '10'),
  },

  // Authenticated APIs (more lenient)
  authApi: {
    interval: 60 * 1000, // 1 minute
    limit: parseInt(process.env.RATE_LIMIT_AUTH_API || '30'),
  },

  // Webhook endpoints (generous but protected by signatures)
  webhook: {
    interval: 60 * 1000, // 1 minute
    limit: 100,
  },

  // Health check (very strict, should be minimal)
  health: {
    interval: 60 * 1000, // 1 minute
    limit: 5,
  },
};

/**
 * Middleware wrapper for rate limiting
 * Usage: await rateLimitMiddleware(request, rateLimits.publicApi)
 */
export async function rateLimitMiddleware(
  request: Request,
  config: RateLimitConfig
): Promise<{ allowed: boolean; headers: Record<string, string> }> {
  const identifier = getClientIdentifier(request);
  const result = checkRateLimit(identifier, config);

  const headers: Record<string, string> = {
    'X-RateLimit-Limit': config.limit.toString(),
    'X-RateLimit-Remaining': Math.max(0, result.remaining).toString(),
    'X-RateLimit-Reset': Math.ceil(result.resetTime / 1000).toString(),
  };

  if (!result.allowed) {
    headers['Retry-After'] = result.retryAfter.toString();
  }

  return { allowed: result.allowed, headers };
}
