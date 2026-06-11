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
    const { businessName, industry, targetAudience = '', personality = 'Professional' } = body;

    if (!businessName || !industry) {
      return NextResponse.json(
        { error: 'Business name and industry are required' },
        { status: 400, headers: rateLimit.headers }
      );
    }

    // Guard against prompt injection
    const nameGuard = guardPromptInput(businessName, { maxLength: 100 });
    const industryGuard = guardPromptInput(industry, { maxLength: 50 });
    const audienceGuard = guardPromptInput(targetAudience, { maxLength: 100 });
    const personalityGuard = guardPromptInput(personality, { maxLength: 50 });

    if (!nameGuard.safe || !industryGuard.safe || !audienceGuard.safe || !personalityGuard.safe) {
      return NextResponse.json(
        { error: 'Invalid input detected' },
        { status: 400, headers: rateLimit.headers }
      );
    }

    const audienceText = audienceGuard.sanitized ? ` targeting ${audienceGuard.sanitized}` : '';

    // Generate taglines
    const taglinesPrompt = `Generate 5 creative tagline options for "${nameGuard.sanitized}" (${industryGuard.sanitized}${audienceText}).
Tone: ${personalityGuard.sanitized}. Keep them short, memorable, and brand-appropriate. Return ONLY a numbered list.`;

    const taglinesResponse = await withTimeout(
      generateAIResponse(taglinesPrompt, { complexity: 'medium', maxTokens: 250 }),
      { timeoutMs: timeouts.slowAI, errorMessage: 'Taglines generation timeout' }
    );

    // Generate brand voice
    const voicePrompt = `Define the brand voice for "${nameGuard.sanitized}" (${industryGuard.sanitized}).
Tone: ${personalityGuard.sanitized}${audienceText}.

Return in this exact format:
TONE: [2-3 sentences describing tone]
DO SAY: [3 examples of on-brand phrases]
DON'T SAY: [3 examples of off-brand phrases]
SAMPLE POST: [1 short social media post example]`;

    const voiceResponse = await withTimeout(
      generateAIResponse(voicePrompt, { complexity: 'medium', maxTokens: 400 }),
      { timeoutMs: timeouts.slowAI, errorMessage: 'Brand voice generation timeout' }
    );

    // Parse taglines
    const taglines = taglinesResponse
      .split('\n')
      .map(line => line.replace(/^\d+\.\s*["']?/, '').replace(/["']?\s*$/, '').trim())
      .filter(line => line.length > 0 && line.length < 100)
      .slice(0, 5);

    // Parse brand voice
    const tone = voiceResponse.match(/TONE:\s*([^]+?)(?=DO SAY:|$)/)?.[1]?.trim() || 
      `${personalityGuard.sanitized} and approachable, perfect for ${industryGuard.sanitized} customers`;
    
    const doSayMatch = voiceResponse.match(/DO SAY:\s*([^]+?)(?=DON'T SAY:|$)/)?.[1];
    const doSay = doSayMatch ? 
      doSayMatch.split('\n').map(l => l.replace(/^[-•\s]+/, '').trim()).filter(l => l.length > 0).slice(0, 3) :
      ['Welcome! How can we help you today?', 'Quality you can trust, service you deserve', 'Your satisfaction is our priority'];

    const dontSayMatch = voiceResponse.match(/DON'T SAY:\s*([^]+?)(?=SAMPLE POST:|$)/)?.[1];
    const dontSay = dontSayMatch ?
      dontSayMatch.split('\n').map(l => l.replace(/^[-•\s]+/, '').trim()).filter(l => l.length > 0).slice(0, 3) :
      ['That\'s not my problem', 'We don\'t do that here', 'You\'re wrong'];

    const samplePost = voiceResponse.match(/SAMPLE POST:\s*([^]+)/)?.[1]?.trim() ||
      `Excited to serve our amazing customers at ${nameGuard.sanitized}! 🎉 Quality ${industryGuard.sanitized.toLowerCase()} services you can count on. Visit us today!`;

    // Generate color palette based on industry and personality
    const colorPalettes: Record<string, any> = {
      'Professional': {
        primary: { hex: '#1e3a5f', name: 'Deep Navy', usage: 'Primary brand color, headers, key CTAs' },
        secondary: { hex: '#4a90a4', name: 'Steel Blue', usage: 'Secondary buttons, links, accents' },
        accent: { hex: '#f4a261', name: 'Warm Amber', usage: 'Highlights, icons, special offers' },
        dark: { hex: '#1a1a2e', name: 'Midnight', usage: 'Text, dark backgrounds' },
        light: { hex: '#f8f9fa', name: 'Cloud White', usage: 'Backgrounds, cards' },
        warning: { hex: '#e63946', name: 'Alert Red', usage: 'Errors, warnings, urgent actions' },
      },
      'Luxury': {
        primary: { hex: '#2c1810', name: 'Espresso', usage: 'Primary brand color, luxury feel' },
        secondary: { hex: '#c9a227', name: 'Gold', usage: 'Premium accents, highlights' },
        accent: { hex: '#8b7355', name: 'Bronze', usage: 'Details, borders' },
        dark: { hex: '#1a1a1a', name: 'Onyx', usage: 'Text, elegant backgrounds' },
        light: { hex: '#faf8f5', name: 'Ivory', usage: 'Clean backgrounds' },
        warning: { hex: '#b8860b', name: 'Dark Goldenrod', usage: 'Alerts that match luxury' },
      },
      'Fun': {
        primary: { hex: '#ff6b6b', name: 'Coral Pop', usage: 'Primary brand color, energetic' },
        secondary: { hex: '#4ecdc4', name: 'Turquoise', usage: 'Secondary actions, freshness' },
        accent: { hex: '#ffe66d', name: 'Sunny Yellow', usage: 'Highlights, fun elements' },
        dark: { hex: '#2d3436', name: 'Charcoal', usage: 'Text, grounding' },
        light: { hex: '#fff9f0', name: 'Cream', usage: 'Soft backgrounds' },
        warning: { hex: '#ff7675', name: 'Soft Red', usage: 'Friendly warnings' },
      },
      'Tech': {
        primary: { hex: '#6366f1', name: 'Electric Indigo', usage: 'Primary brand, innovation' },
        secondary: { hex: '#06b6d4', name: 'Cyan', usage: 'Tech accents, links' },
        accent: { hex: '#8b5cf6', name: 'Violet', usage: 'Highlights, features' },
        dark: { hex: '#0f172a', name: 'Deep Space', usage: 'Dark mode, code blocks' },
        light: { hex: '#f1f5f9', name: 'Slate 50', usage: 'Clean tech backgrounds' },
        warning: { hex: '#f43f5e', name: 'Rose', usage: 'Errors in tech style' },
      },
    };

    const defaultPalette = colorPalettes['Professional'];
    const paletteKey = Object.keys(colorPalettes).find(k => 
      personalityGuard.sanitized.toLowerCase().includes(k.toLowerCase())
    ) || 'Professional';
    const colorPalette = colorPalettes[paletteKey] || defaultPalette;

    // Typography based on personality
    const typographyOptions: Record<string, any> = {
      'Professional': {
        headingFont: 'Inter / SF Pro Display',
        bodyFont: 'Inter / Open Sans',
        headingStyle: 'Clean, modern sans-serif with medium weight for authority',
        bodyStyle: 'Highly readable, neutral sans-serif for professional content',
      },
      'Luxury': {
        headingFont: 'Playfair Display / Bodoni',
        bodyFont: 'Lato / Source Sans Pro',
        headingStyle: 'Elegant serif with high contrast for sophistication',
        bodyStyle: 'Clean sans-serif that complements elegant headings',
      },
      'Fun': {
        headingFont: 'Poppins / Raleway',
        bodyFont: 'Nunito / Quicksand',
        headingStyle: 'Rounded, friendly sans-serif with personality',
        bodyStyle: 'Warm, approachable with slight roundness',
      },
      'Tech': {
        headingFont: 'Space Grotesk / Montserrat',
        bodyFont: 'Inter / Roboto',
        headingStyle: 'Geometric, modern sans-serif for innovation',
        bodyStyle: 'Clean, neutral for readability of technical content',
      },
    };

    const typography = typographyOptions[paletteKey] || typographyOptions['Professional'];

    // Logo guidelines
    const logoGuidelines = {
      style: paletteKey === 'Luxury' ? 'Minimalist with elegant typography, possibly a monogram' :
             paletteKey === 'Fun' ? 'Playful with rounded elements and vibrant colors' :
             paletteKey === 'Tech' ? 'Modern geometric shapes, clean lines, possibly abstract icon' :
             'Clean wordmark or simple icon + text, professional and trustworthy',
      iconIdea: industryGuard.sanitized.toLowerCase().includes('restaurant') ? 'Fork & plate or food element' :
                industryGuard.sanitized.toLowerCase().includes('tech') ? 'Abstract circuit or code bracket' :
                industryGuard.sanitized.toLowerCase().includes('health') ? 'Cross or heart symbol' :
                industryGuard.sanitized.toLowerCase().includes('education') ? 'Book or graduation cap' :
                'Abstract geometric shape representing growth/progress',
      layoutTip: 'Ensure logo works in single color. Test at 32px (favicon) and 512px (app icon) sizes.',
    };

    // Social media templates
    const socialTemplates = {
      instagramBio: `${nameGuard.sanitized} ✨ ${taglines[0] || ''}\n📍 ${targetAudience || 'Serving our community'}\n👇 Book now / Learn more`,
      twitterBio: `${nameGuard.sanitized} | ${taglines[0] || industryGuard.sanitized + ' done right'} | ${targetAudience || 'Customer focused'}`,
      linkedinHeadline: `${nameGuard.sanitized} — ${industryGuard.sanitized} | ${taglines[0] || 'Quality & Service'}`,
    };

    return NextResponse.json(
      {
        colorPalette,
        typography,
        taglines: taglines.length > 0 ? taglines : [
          `${nameGuard.sanitized}: Excellence in ${industryGuard.sanitized}`,
          `Your Trusted ${industryGuard.sanitized} Partner`,
          `Quality ${industryGuard.sanitized} You Can Count On`,
          `Experience the ${nameGuard.sanitized} Difference`,
          `${industryGuard.sanitized} Made Simple`
        ],
        brandVoice: {
          tone,
          doSay,
          dontSay,
          samplePost,
        },
        logoGuidelines,
        socialTemplates,
        businessName: nameGuard.sanitized,
        industry: industryGuard.sanitized,
        success: true,
      },
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
