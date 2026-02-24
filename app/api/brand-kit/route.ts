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
    const { businessName, industry, values, targetAudience } = body;

    if (!businessName || !industry) {
      return NextResponse.json(
        { error: 'Business name and industry are required' },
        { status: 400, headers: rateLimit.headers }
      );
    }

    // Guard against prompt injection
    const nameGuard = guardPromptInput(businessName, { maxLength: 100 });
    const industryGuard = guardPromptInput(industry, { maxLength: 50 });
    const valuesGuard = guardPromptInput(values || '', { maxLength: 200 });
    const audienceGuard = guardPromptInput(targetAudience || '', { maxLength: 100 });

    if (!nameGuard.safe || !industryGuard.safe || !valuesGuard.safe || !audienceGuard.safe) {
      return NextResponse.json(
        { error: 'Invalid input detected' },
        { status: 400, headers: rateLimit.headers }
      );
    }

    const prompt = `Create a brand kit for:
Business: ${nameGuard.sanitized}
Industry: ${industryGuard.sanitized}
Values: ${valuesGuard.sanitized}
Target Audience: ${audienceGuard.sanitized}

Generate:
1. 3 tagline options
2. Brand voice description
3. Color palette suggestion (primary, secondary, accent)
4. Font pairing recommendation
5. 3 brand messaging pillars`;

    const brandKit = await withTimeout(
      generateAIResponse(prompt, { complexity: 'medium', maxTokens: 800 }),
      { timeoutMs: timeouts.slowAI, errorMessage: 'Brand kit generation timeout' }
    );

    return NextResponse.json(
      { brandKit, success: true },
      { headers: rateLimit.headers }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to generate brand kit';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
