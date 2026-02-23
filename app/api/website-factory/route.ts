import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/app/lib/ai/smart-router';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      businessName?: string;
      industry?: string;
      targetAudience?: string;
      features?: string[];
    };

    if (!body.businessName || !body.industry) {
      return NextResponse.json({ error: 'businessName and industry are required' }, { status: 400 });
    }

    const prompt = `Create a website blueprint for this business:
- Name: ${body.businessName}
- Industry: ${body.industry}
- Audience: ${body.targetAudience ?? 'General'}
- Desired features: ${(body.features ?? []).join(', ') || 'Contact form, services, testimonials'}

Return JSON with:
- sitemap (pages)
- design direction
- copy blocks for home page
- SEO keywords
- launch checklist`;

    const result = await generateAIResponse(prompt, { complexity: 'complex', maxTokens: 800, temperature: 0.5 });
    return NextResponse.json({ blueprint: result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}