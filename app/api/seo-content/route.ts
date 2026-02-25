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
    const { business, location, industry, language = 'English' } = body;

    if (!business || !industry) {
      return NextResponse.json(
        { error: 'Business name and industry are required' },
        { status: 400, headers: rateLimit.headers }
      );
    }

    // Guard against prompt injection
    const businessGuard = guardPromptInput(business, { maxLength: 100 });
    const locationGuard = guardPromptInput(location || '', { maxLength: 100 });
    const industryGuard = guardPromptInput(industry, { maxLength: 50 });

    if (!businessGuard.safe || !industryGuard.safe || !locationGuard.safe) {
      return NextResponse.json(
        { error: 'Invalid input detected' },
        { status: 400, headers: rateLimit.headers }
      );
    }

    const locationText = locationGuard.sanitized ? ` in ${locationGuard.sanitized}` : '';

    // Generate blog titles
    const blogTitlesPrompt = `Generate 5 catchy, SEO-optimized blog post titles for a ${industryGuard.sanitized} business called "${businessGuard.sanitized}"${locationText}.
Titles should be engaging and help with local SEO. Return ONLY a numbered list, one title per line.`;

    const blogTitlesResponse = await withTimeout(
      generateAIResponse(blogTitlesPrompt, { complexity: 'medium', maxTokens: 300 }),
      { timeoutMs: timeouts.slowAI, errorMessage: 'Blog titles generation timeout' }
    );

    // Generate meta descriptions
    const metaPrompt = `Generate 3 compelling meta descriptions (under 160 characters each) for a ${industryGuard.sanitized} business called "${businessGuard.sanitized}"${locationText}.
Each should include a call-to-action and relevant keywords. Return ONLY a numbered list, one description per line.`;

    const metaResponse = await withTimeout(
      generateAIResponse(metaPrompt, { complexity: 'medium', maxTokens: 300 }),
      { timeoutMs: timeouts.slowAI, errorMessage: 'Meta descriptions generation timeout' }
    );

    // Generate keywords
    const keywordsPrompt = `Generate 10 relevant SEO keywords for a ${industryGuard.sanitized} business${locationText}.
Include a mix of short-tail and long-tail keywords. Format: keyword — search intent (e.g., "Info" or "Purchase"). Return ONLY a numbered list.`;

    const keywordsResponse = await withTimeout(
      generateAIResponse(keywordsPrompt, { complexity: 'medium', maxTokens: 300 }),
      { timeoutMs: timeouts.slowAI, errorMessage: 'Keywords generation timeout' }
    );

    // Generate content outline
    const outlinePrompt = `Create a detailed blog post outline for "${businessGuard.sanitized}" (${industryGuard.sanitized}${locationText}).
Include: Title, Introduction, 3-4 main sections with subsections, and Conclusion with CTA. Format with clear headings.`;

    const outlineResponse = await withTimeout(
      generateAIResponse(outlinePrompt, { complexity: 'medium', maxTokens: 500 }),
      { timeoutMs: timeouts.slowAI, errorMessage: 'Outline generation timeout' }
    );

    // Parse responses into arrays
    const parseNumberedList = (text: string): string[] => {
      return text
        .split('\n')
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(line => line.length > 0);
    };

    const blogTitles = parseNumberedList(blogTitlesResponse);
    const metaDescriptions = parseNumberedList(metaResponse);
    const keywords = parseNumberedList(keywordsResponse);

    return NextResponse.json(
      {
        blogTitles: blogTitles.length > 0 ? blogTitles : [
          `10 Tips for Choosing the Best ${industry} ${locationText}`,
          `Why ${business} is the Top Choice for ${industry} Services`,
          `The Complete Guide to ${industry} in ${location || 'Your Area'}`,
          `How to Get the Most Out of Your ${industry} Experience`,
          `${industry} Trends You Need to Know in 2026`
        ],
        metaDescriptions: metaDescriptions.length > 0 ? metaDescriptions : [
          `Looking for trusted ${industry.toLowerCase()} services${locationText}? ${business} delivers quality and reliability. Contact us today for a free consultation!`,
          `${business} offers professional ${industry.toLowerCase()} services${locationText}. Expert team, affordable prices. Book your appointment now!`,
          `Top-rated ${industry.toLowerCase()} services from ${business}${locationText}. Experience the difference. Call now or visit our website!`
        ],
        keywords: keywords.length > 0 ? keywords : [
          `${industry.toLowerCase()} services${locationText}`,
          `best ${industry.toLowerCase()} near me`,
          `${business.toLowerCase()} ${locationText}`,
          `professional ${industry.toLowerCase()}`,
          `affordable ${industry.toLowerCase()}`,
          `${industry.toLowerCase()} experts`,
          `local ${industry.toLowerCase()}`,
          `${industry.toLowerCase()} consultation`,
          `top ${industry.toLowerCase()} company`,
          `${industry.toLowerCase()} pricing`
        ],
        contentOutline: outlineResponse || `1. Introduction to ${industry} Services\n2. Why Choose ${business}\n3. Our Services\n4. Customer Success Stories\n5. Conclusion & Contact`,
        business: businessGuard.sanitized,
        location: locationGuard.sanitized,
        industry: industryGuard.sanitized,
        success: true,
      },
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
