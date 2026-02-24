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
    const { business, industry, keywords, tone = 'professional' } = body;

    if (!business || !industry) {
      return NextResponse.json(
        { error: 'Business name and industry are required' },
        { status: 400, headers: rateLimit.headers }
      );
    }

    // Guard against prompt injection
    const businessGuard = guardPromptInput(business, { maxLength: 100 });
    const industryGuard = guardPromptInput(industry, { maxLength: 50 });
    const keywordsGuard = guardPromptInput(keywords || '', { maxLength: 200 });

    if (!businessGuard.safe || !industryGuard.safe || !keywordsGuard.safe) {
      return NextResponse.json(
        { error: 'Invalid input detected' },
        { status: 400, headers: rateLimit.headers }
      );
    }

    const prompt = `Create SEO-optimized content for:
Business: ${businessGuard.sanitized}
Industry: ${industryGuard.sanitized}
Keywords: ${keywordsGuard.sanitized}
Tone: ${tone}

Generate:
1. Meta title (60 chars max)
2. Meta description (160 chars max)
3. 3 blog post ideas
4. 5 social media captions`;

    const content = await withTimeout(
      generateAIResponse(prompt, { complexity: 'medium', maxTokens: 800 }),
      { timeoutMs: timeouts.slowAI, errorMessage: 'Content generation timeout' }
    );

    return NextResponse.json(
      { content, success: true },
      { headers: rateLimit.headers }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to generate content';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
