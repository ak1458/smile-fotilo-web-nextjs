import { NextRequest, NextResponse } from 'next/server';
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

    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400, headers: rateLimit.headers }
      );
    }

    // Guard against malicious URLs
    const urlGuard = guardPromptInput(url, { maxLength: 500 });
    if (!urlGuard.safe) {
      return NextResponse.json(
        { error: 'Invalid URL detected' },
        { status: 400, headers: rateLimit.headers }
      );
    }

    // Basic URL validation
    let validatedUrl: URL;
    try {
      validatedUrl = new URL(urlGuard.sanitized);
      if (!['http:', 'https:'].includes(validatedUrl.protocol)) {
        throw new Error('Invalid protocol');
      }
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400, headers: rateLimit.headers }
      );
    }

    // Perform basic audit checks
    const auditResults = {
      url: validatedUrl.toString(),
      checks: {
        https: validatedUrl.protocol === 'https:',
        www: validatedUrl.hostname.startsWith('www.'),
        mobileResponsive: 'manual_check_required',
        pageSpeed: 'manual_check_required',
        metaTags: 'manual_check_required',
      },
      recommendations: [
        'Ensure HTTPS is enabled site-wide',
        'Add/update meta title and description',
        'Implement structured data/schema markup',
        'Optimize images for faster loading',
        'Ensure mobile responsiveness',
      ],
    };

    return NextResponse.json(
      { audit: auditResults, success: true },
      { headers: rateLimit.headers }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Audit failed';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
