import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/app/lib/ai/smart-router';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { text?: string; documentType?: string; language?: string };
    const text = body.text?.trim();
    if (!text) return NextResponse.json({ error: 'text is required' }, { status: 400 });

    const prompt = `You are an AI document intelligence assistant.
Document type: ${body.documentType ?? 'general'}
Target language: ${body.language ?? 'English'}

Document:
${text}

Return:
1) summary
2) key fields extracted as JSON
3) action items`;

    const response = await generateAIResponse(prompt, { complexity: 'complex', maxTokens: 600, temperature: 0.3 });
    return NextResponse.json({ result: response });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}