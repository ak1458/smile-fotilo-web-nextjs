import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/app/lib/ai/smart-router';
import { rateLimitMiddleware, rateLimits } from '@/app/lib/security/rate-limit';
import { guardPromptInput } from '@/app/lib/security/prompt-guard';

export async function POST(request: NextRequest) {
  try {
    // Unauthenticated LLM endpoint — must be rate limited or it's a free
    // token drain for anyone with curl.
    const rateLimit = await rateLimitMiddleware(request, rateLimits.publicApi);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: rateLimit.headers }
      );
    }

    const body = (await request.json()) as { rating?: number; review?: string; businessName?: string };
    const review = body.review?.trim();

    if (!review) {
      return NextResponse.json({ error: 'review is required' }, { status: 400 });
    }

    const reviewGuard = guardPromptInput(review, { maxLength: 1200 });
    if (!reviewGuard.safe) {
      return NextResponse.json({ error: 'Review text could not be processed.' }, { status: 400 });
    }
    const nameGuard = guardPromptInput(body.businessName ?? 'the business', { maxLength: 120 });

    const prompt = `Write a short professional response to this customer review for ${nameGuard.safe ? nameGuard.sanitized : 'the business'}.
Rating: ${typeof body.rating === 'number' ? body.rating : 'unknown'}
Review: ${reviewGuard.sanitized}
Keep it polite and concise.`;

    const response = await generateAIResponse(prompt, { complexity: 'simple', maxTokens: 180, temperature: 0.4 });
    return NextResponse.json({ draftResponse: response });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
