import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/app/lib/ai/smart-router';
import { rateLimitMiddleware, rateLimits } from '@/app/lib/security/rate-limit';
import { guardPromptInput } from '@/app/lib/security/prompt-guard';

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

    const body = await request.json() as {
      businessName?: string;
      industry?: string;
      targetAudience?: string;
      features?: string[];
      style?: string;
    };

    const businessName = body.businessName?.trim();
    const industry = body.industry?.trim();
    const targetAudience = body.targetAudience?.trim() || 'General audience';
    const features = body.features || ['Contact form', 'Services page', 'About page'];
    const style = body.style || 'Professional';

    if (!businessName || !industry) {
      return NextResponse.json(
        { error: 'Business name and industry are required' },
        { status: 400, headers: rateLimit.headers }
      );
    }

    // Guard inputs
    const nameGuard = guardPromptInput(businessName, { maxLength: 100 });
    const industryGuard = guardPromptInput(industry, { maxLength: 50 });
    const audienceGuard = guardPromptInput(targetAudience, { maxLength: 100 });

    if (!nameGuard.safe || !industryGuard.safe || !audienceGuard.safe) {
      return NextResponse.json(
        { error: 'Invalid input detected' },
        { status: 400, headers: rateLimit.headers }
      );
    }

    // Generate sitemap
    const sitemapPrompt = `Create a website sitemap for ${nameGuard.sanitized} (${industryGuard.sanitized}).
Target audience: ${audienceGuard.sanitized}
Required features: ${features.join(', ')}

Return a list of 5-7 main pages with brief descriptions. Format: Page Name - Description`;

    let sitemapPages: Array<{ name: string; description: string; path: string }> = [];
    try {
      const sitemapResult = await generateAIResponse(sitemapPrompt, { 
        complexity: 'medium', 
        maxTokens: 300 
      });
      
      const lines = sitemapResult.split('\n').filter(l => l.trim());
      sitemapPages = lines.map(line => {
        const match = line.match(/^[-\s]*([^-:]+)[-:]\s*(.+)$/);
        if (match) {
          const name = match[1].trim();
          const description = match[2].trim();
          const path = '/' + name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
          return { name, description, path: path === '/home' ? '/' : path };
        }
        return { name: line.trim(), description: '', path: '/' + line.toLowerCase().replace(/\s+/g, '-') };
      }).slice(0, 7);
    } catch {
      sitemapPages = [
        { name: 'Home', description: 'Hero section with key value proposition', path: '/' },
        { name: 'About', description: 'Company story and team', path: '/about' },
        { name: 'Services', description: 'What we offer', path: '/services' },
        { name: 'Contact', description: 'Get in touch', path: '/contact' },
      ];
    }

    // Generate design direction
    const designPrompt = `Suggest a design direction for ${nameGuard.sanitized} website (${industryGuard.sanitized}, ${style} style).

Return:
COLOR_PALETTE: [3-4 color hex codes with names]
TYPOGRAPHY: [Heading font style and body font style]
MOOD: [2-3 words describing the visual feel]
STYLE_NOTES: [2 sentences about design approach]`;

    const designDirection = {
      colors: ['#1e3a5f', '#4a90a4', '#f4a261', '#ffffff'],
      typography: 'Modern sans-serif for headings, clean readable font for body',
      mood: 'Professional, Trustworthy',
      notes: 'Clean layout with plenty of whitespace. Focus on readability and clear CTAs.',
    };

    try {
      const designResult = await generateAIResponse(designPrompt, { 
        complexity: 'medium', 
        maxTokens: 250 
      });

      const colorMatch = designResult.match(/COLOR_PALETTE:\s*([^]+?)(?=TYPOGRAPHY:|$)/);
      const typoMatch = designResult.match(/TYPOGRAPHY:\s*([^]+?)(?=MOOD:|$)/);
      const moodMatch = designResult.match(/MOOD:\s*([^]+?)(?=STYLE_NOTES:|$)/);
      const notesMatch = designResult.match(/STYLE_NOTES:\s*([^]+)/);

      if (colorMatch) {
        const colorText = colorMatch[1];
        const hexCodes = colorText.match(/#[a-fA-F0-9]{6}/g);
        if (hexCodes) designDirection.colors = hexCodes.slice(0, 4);
      }
      if (typoMatch) designDirection.typography = typoMatch[1].trim().slice(0, 100);
      if (moodMatch) designDirection.mood = moodMatch[1].trim().slice(0, 50);
      if (notesMatch) designDirection.notes = notesMatch[1].trim().slice(0, 200);
    } catch {
      // Use defaults
    }

    // Generate homepage copy
    const copyPrompt = `Write homepage copy for ${nameGuard.sanitized} (${industryGuard.sanitized}).
Target: ${audienceGuard.sanitized}

Return:
HEADLINE: [Main headline, 5-8 words]
SUBHEADLINE: [Supporting text, 10-15 words]
CTA_BUTTON: [Call-to-action text, 2-4 words]`;

    const homeCopy = {
      headline: `${nameGuard.sanitized}: ${industryGuard.sanitized} Excellence`,
      subheadline: `We provide professional ${industryGuard.sanitized.toLowerCase()} services tailored to your needs. Quality you can trust.`,
      cta: 'Get Started',
    };

    try {
      const copyResult = await generateAIResponse(copyPrompt, { 
        complexity: 'medium', 
        maxTokens: 200 
      });

      const headlineMatch = copyResult.match(/HEADLINE:\s*(.+)/);
      const subheadlineMatch = copyResult.match(/SUBHEADLINE:\s*(.+)/);
      const ctaMatch = copyResult.match(/CTA_BUTTON:\s*(.+)/);

      if (headlineMatch) homeCopy.headline = headlineMatch[1].trim().slice(0, 60);
      if (subheadlineMatch) homeCopy.subheadline = subheadlineMatch[1].trim().slice(0, 120);
      if (ctaMatch) homeCopy.cta = ctaMatch[1].trim().slice(0, 30);
    } catch {
      // Use defaults
    }

    // Generate SEO keywords
    const seoPrompt = `Generate 8 SEO keywords for ${nameGuard.sanitized} (${industryGuard.sanitized}).
Return as a comma-separated list of relevant search terms.`;

    let seoKeywords: string[] = [
      `${industryGuard.sanitized.toLowerCase()} services`,
      `${nameGuard.sanitized.toLowerCase()}`,
      `professional ${industryGuard.sanitized.toLowerCase()}`,
      `best ${industryGuard.sanitized.toLowerCase()} near me`,
      `affordable ${industryGuard.sanitized.toLowerCase()}`,
      `local ${industryGuard.sanitized.toLowerCase()}`,
      `${industryGuard.sanitized.toLowerCase()} company`,
      `top rated ${industryGuard.sanitized.toLowerCase()}`,
    ];

    try {
      const seoResult = await generateAIResponse(seoPrompt, { 
        complexity: 'simple', 
        maxTokens: 150 
      });

      const keywords = seoResult
        .split(/[,\n]/)
        .map(k => k.trim())
        .filter(k => k.length > 0 && k.length < 50)
        .slice(0, 8);

      if (keywords.length >= 4) seoKeywords = keywords;
    } catch {
      // Use defaults
    }

    // Generate launch checklist
    const checklistPrompt = `Create a website launch checklist for ${nameGuard.sanitized}.
Return 6-8 essential tasks as a numbered list.`;

    let launchChecklist: string[] = [];
    try {
      const checklistResult = await generateAIResponse(checklistPrompt, { 
        complexity: 'simple', 
        maxTokens: 200 
      });

      launchChecklist = checklistResult
        .split('\n')
        .map(item => item.replace(/^\d+\.\s*/, '').trim())
        .filter(item => item.length > 0)
        .slice(0, 8);
    } catch {
      launchChecklist = [];
    }

    // Default checklist if empty
    if (launchChecklist.length < 4) {
      launchChecklist = [
        'Set up domain and hosting',
        'Install SSL certificate (HTTPS)',
        'Set up Google Analytics 4',
        'Create and submit sitemap.xml',
        'Test all forms and CTAs',
        'Optimize images for web',
        'Set up business email accounts',
        'Create social media profiles',
        'Launch and announce on social media',
      ];
    }

    return NextResponse.json(
      {
        sitemap: sitemapPages,
        designDirection,
        homeCopy,
        seoKeywords,
        launchChecklist,
        businessName: nameGuard.sanitized,
        industry: industryGuard.sanitized,
        success: true,
      },
      { headers: rateLimit.headers }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to generate blueprint';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
