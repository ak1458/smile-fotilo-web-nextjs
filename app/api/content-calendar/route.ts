import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/app/lib/ai/smart-router';
import { rateLimitMiddleware, rateLimits } from '@/app/lib/security/rate-limit';
import { guardPromptInput } from '@/app/lib/security/prompt-guard';
import { withTimeout, timeouts } from '@/app/lib/security/api-timeout';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimit = await rateLimitMiddleware(request, rateLimits.publicApi);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: rateLimit.headers }
      );
    }

    const body = await request.json();
    const { businessName, industry, platforms = ['instagram', 'facebook'] } = body;

    if (!businessName || !industry) {
      return NextResponse.json(
        { error: 'Business name and industry are required' },
        { status: 400, headers: rateLimit.headers }
      );
    }

    // Guard against prompt injection
    const nameGuard = guardPromptInput(businessName, { maxLength: 100 });
    const industryGuard = guardPromptInput(industry, { maxLength: 50 });

    if (!nameGuard.safe || !industryGuard.safe) {
      return NextResponse.json(
        { error: 'Invalid input detected' },
        { status: 400, headers: rateLimit.headers }
      );
    }

    const prompt = `Create a 2-week content calendar for:
Business: ${nameGuard.sanitized}
Industry: ${industryGuard.sanitized}
Platforms: ${platforms.join(', ')}

Generate 6 content ideas with:
1. Content theme/topic
2. Caption (with hashtags)
3. Best time to post
4. Platform recommendation`;

    const calendar = await withTimeout(
      generateAIResponse(prompt, { complexity: 'medium', maxTokens: 1000 }),
      { timeoutMs: timeouts.slowAI, errorMessage: 'Calendar generation timeout' }
    );

    return NextResponse.json(
      { calendar, success: true },
      { headers: rateLimit.headers }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to generate calendar';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
