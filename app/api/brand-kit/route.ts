import { NextRequest, NextResponse } from 'next/server';

const GROQ_KEY = process.env.GROQ_API_KEY;
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;

async function callAI(prompt: string): Promise<string> {
    // Try Groq first (faster), fall back to OpenRouter
    if (GROQ_KEY) {
        try {
            const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${GROQ_KEY}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: [
                        { role: 'system', content: 'You are a world-class brand strategist and designer. Output structured, actionable brand guidelines. Always respond with valid JSON when asked.' },
                        { role: 'user', content: prompt },
                    ],
                    temperature: 0.8,
                    max_tokens: 2500,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                return data.choices?.[0]?.message?.content || '';
            }
        } catch { /* fallback */ }
    }

    if (OPENROUTER_KEY) {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${OPENROUTER_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'meta-llama/llama-3.3-70b-instruct:free',
                messages: [
                    { role: 'system', content: 'You are a world-class brand strategist and designer. Output structured, actionable brand guidelines. Always respond with valid JSON when asked.' },
                    { role: 'user', content: prompt },
                ],
                temperature: 0.8,
                max_tokens: 2500,
            }),
        });
        if (res.ok) {
            const data = await res.json();
            return data.choices?.[0]?.message?.content || '';
        }
    }

    throw new Error('No AI provider available');
}

function extractJSON(text: string) {
    // Try to extract JSON from markdown code blocks or raw text
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || text.match(/(\{[\s\S]*\})/);
    if (jsonMatch) {
        try {
            return JSON.parse(jsonMatch[1].trim());
        } catch { /* fallback */ }
    }
    try {
        return JSON.parse(text.trim());
    } catch {
        return null;
    }
}

export async function POST(request: NextRequest) {
    try {
        const { businessName, industry, targetAudience, personality, existingColors } = await request.json();

        if (!businessName || !industry) {
            return NextResponse.json({ error: 'Business name and industry are required' });
        }

        const personalityStr = personality || 'professional, modern, trustworthy';
        const audienceStr = targetAudience || 'general audience';
        const colorsNote = existingColors ? `Their existing brand colors are: ${existingColors}. Build upon these.` : '';

        const prompt = `Generate a complete brand kit for "${businessName}", a ${industry} business targeting ${audienceStr}. Brand personality: ${personalityStr}. ${colorsNote}

Return ONLY valid JSON (no markdown, no code blocks) with this exact structure:
{
  "colorPalette": {
    "primary": { "hex": "#XXXXXX", "name": "Color Name", "usage": "When to use" },
    "secondary": { "hex": "#XXXXXX", "name": "Color Name", "usage": "When to use" },
    "accent": { "hex": "#XXXXXX", "name": "Color Name", "usage": "When to use" },
    "dark": { "hex": "#XXXXXX", "name": "Color Name", "usage": "Backgrounds, text" },
    "light": { "hex": "#XXXXXX", "name": "Color Name", "usage": "Backgrounds, cards" },
    "warning": { "hex": "#XXXXXX", "name": "Color Name", "usage": "Alerts, CTAs" }
  },
  "typography": {
    "headingFont": "Font name from Google Fonts",
    "bodyFont": "Font name from Google Fonts",
    "headingStyle": "Bold/Semibold, size guidance",
    "bodyStyle": "Regular/Light, size guidance"
  },
  "taglines": [
    "Tagline 1 — short (under 8 words)",
    "Tagline 2 — medium (under 12 words)",
    "Tagline 3 — descriptive (under 15 words)"
  ],
  "brandVoice": {
    "tone": "2-3 word description",
    "doSay": ["phrase 1", "phrase 2", "phrase 3"],
    "dontSay": ["phrase 1", "phrase 2", "phrase 3"],
    "samplePost": "A sample social media post in their brand voice (2-3 sentences)"
  },
  "logoGuidelines": {
    "style": "Logo style recommendation",
    "iconIdea": "Icon concept description",
    "layoutTip": "Layout guidance"
  },
  "socialTemplates": {
    "instagramBio": "Instagram bio text (150 chars)",
    "twitterBio": "Twitter bio text (160 chars)",
    "linkedinHeadline": "LinkedIn headline"
  }
}`;

        const rawResponse = await callAI(prompt);
        const parsed = extractJSON(rawResponse);

        if (!parsed) {
            return NextResponse.json({
                error: 'AI response could not be parsed. Please try again.',
                rawOutput: rawResponse,
            });
        }

        return NextResponse.json({
            ...parsed,
            businessName,
            industry,
        });
    } catch (error: unknown) {
        console.error('[Brand Kit] Error:', error);
        const msg = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: `Brand kit generation failed: ${msg.slice(0, 80)}` }, { status: 200 });
    }
}
