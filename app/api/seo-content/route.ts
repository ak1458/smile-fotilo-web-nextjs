import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
const GROQ_KEY = process.env.GROQ_API_KEY;

async function generateWithGroq(prompt: string): Promise<string> {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${GROQ_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: 'You are a world-class SEO content strategist specializing in local business SEO for Indian markets. Output clean, structured, actionable content.' },
                { role: 'user', content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 2000,
        }),
    });
    if (!res.ok) throw new Error('Groq failed');
    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
}

async function generateWithOpenRouter(prompt: string): Promise<string> {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OPENROUTER_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'z-ai/glm-4.5-air:free',
            messages: [
                { role: 'system', content: 'You are a world-class SEO content strategist specializing in local business SEO for Indian markets. Output clean, structured, actionable content.' },
                { role: 'user', content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 2000,
        }),
    });
    if (!res.ok) throw new Error('OpenRouter failed');
    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
}

async function callAI(prompt: string): Promise<string> {
    // Try Groq first (faster), fall back to OpenRouter
    try {
        if (GROQ_KEY) return await generateWithGroq(prompt);
    } catch { /* fallback */ }
    try {
        if (OPENROUTER_KEY) return await generateWithOpenRouter(prompt);
    } catch { /* fallback */ }
    throw new Error('No AI provider available');
}

export async function POST(request: NextRequest) {
    try {
        const { business, location, industry, language = 'English' } = await request.json();

        if (!business || !industry) {
            return NextResponse.json({
                error: 'Business name and industry are required',
                blogTitles: [],
                metaDescriptions: [],
                contentOutline: '',
                keywords: [],
            }, { status: 400 });
        }

        const locationStr = location ? ` in ${location}` : '';
        const langNote = language !== 'English' ? `Write in ${language} (use natural, conversational style).` : '';

        const prompt = `Generate an SEO content strategy for a ${industry} business called "${business}"${locationStr}.
${langNote}

OUTPUT FORMAT (use exactly this structure):

## BLOG TITLES
1. [title 1 — targeting a specific long-tail keyword]
2. [title 2 — targeting a local search intent]
3. [title 3 — targeting a "how to" or question keyword]
4. [title 4 — targeting a comparison or "best" keyword]
5. [title 5 — targeting a seasonal or trending topic]

## META DESCRIPTIONS
For each blog title above, write a compelling 150-character meta description:
1. [meta for title 1]
2. [meta for title 2]
3. [meta for title 3]
4. [meta for title 4]
5. [meta for title 5]

## CONTENT OUTLINE
For the first blog title, provide a detailed outline:
### H1: [title]
- Introduction (what, why, who)
- H2: [subtopic 1]
  - Key points to cover
  - Local relevance angle
- H2: [subtopic 2]
  - Key points to cover
  - Statistics or data to include
- H2: [subtopic 3]
  - Key points to cover
  - Expert tips
- H2: FAQ Section
  - Q1 + A1
  - Q2 + A2
  - Q3 + A3
- Conclusion + CTA

## TARGET KEYWORDS
List 15 keywords to target (mix of short-tail and long-tail):
1. [keyword] — Search Volume: [estimate] — Difficulty: [Low/Medium/High]
...

## INTERNAL LINKING STRATEGY
Suggest 3 pages on the business website to link to/from this content.`;

        const aiResponse = await callAI(prompt);

        // Parse sections
        const sections = aiResponse.split('##').filter(Boolean);
        const blogTitlesSection = sections.find(s => s.trim().startsWith('BLOG TITLES')) || '';
        const metaSection = sections.find(s => s.trim().startsWith('META DESCRIPTIONS')) || '';
        const outlineSection = sections.find(s => s.trim().startsWith('CONTENT OUTLINE')) || '';
        const keywordsSection = sections.find(s => s.trim().startsWith('TARGET KEYWORDS')) || '';
        const linkingSection = sections.find(s => s.trim().startsWith('INTERNAL LINKING')) || '';

        // Extract blog titles as array
        const blogTitles = blogTitlesSection
            .split('\n')
            .filter(line => /^\d+\./.test(line.trim()))
            .map(line => line.replace(/^\d+\.\s*/, '').trim());

        // Extract meta descriptions
        const metaDescriptions = metaSection
            .split('\n')
            .filter(line => /^\d+\./.test(line.trim()))
            .map(line => line.replace(/^\d+\.\s*/, '').trim());

        // Extract keywords
        const keywords = keywordsSection
            .split('\n')
            .filter(line => /^\d+\./.test(line.trim()))
            .map(line => line.replace(/^\d+\.\s*/, '').trim());

        return NextResponse.json({
            blogTitles,
            metaDescriptions,
            contentOutline: outlineSection.trim(),
            keywords,
            linkingStrategy: linkingSection.trim(),
            rawOutput: aiResponse,
            business,
            location,
            industry,
        });
    } catch (error: unknown) {
        console.error('[SEO Content] Error:', error);
        const msg = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({
            error: `Content generation failed: ${msg.slice(0, 80)}`,
            blogTitles: [],
            metaDescriptions: [],
            contentOutline: '',
            keywords: [],
        }, { status: 500 });
    }
}
