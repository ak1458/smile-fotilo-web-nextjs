import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/app/lib/ai/smart-router';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { rating?: number; review?: string; businessName?: string };
    const review = body.review?.trim();

    if (!review) {
      return NextResponse.json({ error: 'review is required' }, { status: 400 });
    }

    const prompt = `Write a short professional response to this customer review for ${body.businessName ?? 'the business'}.
Rating: ${body.rating ?? 'unknown'}
Review: ${review}
Keep it polite and concise.`;

    const response = await generateAIResponse(prompt, { complexity: 'simple', maxTokens: 180, temperature: 0.4 });
    return NextResponse.json({ draftResponse: response });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}