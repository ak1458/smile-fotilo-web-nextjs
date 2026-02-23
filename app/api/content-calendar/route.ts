import { NextRequest, NextResponse } from 'next/server';

const GROQ_KEY = process.env.GROQ_API_KEY;
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;

async function callAI(prompt: string): Promise<string> {
    if (GROQ_KEY) {
        try {
            const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${GROQ_KEY}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: [
                        { role: 'system', content: 'You are a social media marketing expert who creates viral content strategies for Indian businesses. Always respond with valid JSON.' },
                        { role: 'user', content: prompt },
                    ],
                    temperature: 0.8,
                    max_tokens: 3000,
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
                    { role: 'system', content: 'You are a social media marketing expert who creates viral content strategies for Indian businesses. Always respond with valid JSON.' },
                    { role: 'user', content: prompt },
                ],
                temperature: 0.8,
                max_tokens: 3000,
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
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || text.match(/(\{[\s\S]*\})/);
    if (jsonMatch) {
        try { return JSON.parse(jsonMatch[1].trim()); } catch { /* */ }
    }
    try { return JSON.parse(text.trim()); } catch { return null; }
}

export async function POST(request: NextRequest) {
    try {
        const { businessName, industry, platforms, tone, goals } = await request.json();

        if (!businessName || !industry) {
            return NextResponse.json({ error: 'Business name and industry are required' }, { status: 400 });
        }

        const platformList = platforms?.length ? platforms.join(', ') : 'Instagram, Facebook, LinkedIn';
        const toneStr = tone || 'professional and engaging';
        const goalsStr = goals || 'brand awareness and lead generation';

        const prompt = `Create a 7-day social media content calendar for "${businessName}", a ${industry} business.
Platforms: ${platformList}. Tone: ${toneStr}. Goals: ${goalsStr}.

Return ONLY valid JSON (no markdown, no explanation) with this exact structure:
{
  "weeklyTheme": "The overarching theme for this week",
  "days": [
    {
      "day": "Monday",
      "theme": "Daily theme name",
      "posts": [
        {
          "platform": "Instagram",
          "type": "Reel/Carousel/Story/Post/Thread",
          "caption": "Full caption text with emojis and line breaks (use \\n for line breaks)",
          "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5"],
          "bestTime": "9:00 AM",
          "tip": "One sentence content tip"
        }
      ]
    }
  ],
  "contentPillars": ["Pillar 1", "Pillar 2", "Pillar 3", "Pillar 4"],
  "weeklyTips": [
    "Tip 1 for better engagement",
    "Tip 2 for growth",
    "Tip 3 for consistency"
  ]
}

Generate posts for all 7 days (Monday to Sunday). Each day should have 1 post for the primary platform. Include variety in post types.`;

        const rawResponse = await callAI(prompt);
        const parsed = extractJSON(rawResponse);

        if (!parsed) {
            return NextResponse.json({
                error: 'AI response could not be parsed. Please try again.',
            }, { status: 422 });
        }

        return NextResponse.json({ ...parsed, businessName, industry });
    } catch (error: unknown) {
        console.error('[Content Calendar] Error:', error);
        const msg = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: `Calendar generation failed: ${msg.slice(0, 80)}` }, { status: 500 });
    }
}
