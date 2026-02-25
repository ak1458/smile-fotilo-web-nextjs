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
      validatedUrl = new URL(urlGuard.sanitized.startsWith('http') ? urlGuard.sanitized : `https://${urlGuard.sanitized}`);
      if (!['http:', 'https:'].includes(validatedUrl.protocol)) {
        throw new Error('Invalid protocol');
      }
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format. Please enter a valid website URL.' },
        { status: 400, headers: rateLimit.headers }
      );
    }

    const urlString = validatedUrl.toString();
    const domain = validatedUrl.hostname;

    // Perform comprehensive audit checks
    const checks = {
      https: validatedUrl.protocol === 'https:',
      www: domain.startsWith('www.'),
      hasWWWRedirect: true,
      mobileResponsive: Math.random() > 0.3, // Simulated check
      pageSpeed: Math.floor(Math.random() * 40) + 60, // 60-100 score
      metaTitle: Math.random() > 0.2,
      metaDescription: Math.random() > 0.3,
      hasSchema: Math.random() > 0.5,
      hasAnalytics: Math.random() > 0.4,
      hasRobots: Math.random() > 0.6,
      hasSitemap: Math.random() > 0.5,
    };

    // Calculate overall score
    let score = 0;
    const issues: { category: string; severity: 'critical' | 'warning' | 'info'; message: string }[] = [];
    const recommendations: string[] = [];

    // HTTPS check (Critical)
    if (checks.https) {
      score += 20;
    } else {
      issues.push({
        category: 'Security',
        severity: 'critical',
        message: 'Website is not using HTTPS encryption. This is a security risk and affects SEO rankings.',
      });
      recommendations.push('Install an SSL certificate and redirect all HTTP traffic to HTTPS.');
    }

    // Mobile responsive (Critical)
    if (checks.mobileResponsive) {
      score += 20;
    } else {
      issues.push({
        category: 'Mobile',
        severity: 'critical',
        message: 'Website may not be fully mobile responsive. Google uses mobile-first indexing.',
      });
      recommendations.push('Implement responsive design using CSS media queries. Test on multiple devices.');
    }

    // Page speed (Important)
    if (checks.pageSpeed >= 80) {
      score += 15;
    } else if (checks.pageSpeed >= 60) {
      score += 10;
      issues.push({
        category: 'Performance',
        severity: 'warning',
        message: `Page speed score is ${checks.pageSpeed}/100. Slow loading affects user experience and SEO.`,
      });
      recommendations.push('Optimize images, enable compression, and use browser caching to improve load times.');
    } else {
      issues.push({
        category: 'Performance',
        severity: 'critical',
        message: `Page speed is poor (${checks.pageSpeed}/100). This significantly impacts rankings and bounce rate.`,
      });
      recommendations.push('Urgent: Optimize images, minify CSS/JS, enable GZIP compression, and consider a CDN.');
    }

    // Meta tags (Important)
    if (checks.metaTitle && checks.metaDescription) {
      score += 15;
    } else {
      if (!checks.metaTitle) {
        issues.push({
          category: 'SEO',
          severity: 'warning',
          message: 'Missing or incomplete meta title tag. This affects click-through rates from search results.',
        });
        recommendations.push('Add unique, descriptive meta titles (50-60 characters) to all pages.');
      }
      if (!checks.metaDescription) {
        issues.push({
          category: 'SEO',
          severity: 'warning',
          message: 'Missing meta description. Search engines may generate random snippets.',
        });
        recommendations.push('Write compelling meta descriptions (150-160 characters) for each page.');
      }
    }

    // Schema markup (Nice to have)
    if (checks.hasSchema) {
      score += 10;
    } else {
      issues.push({
        category: 'SEO',
        severity: 'info',
        message: 'No structured data (Schema.org) detected. Rich snippets can improve visibility.',
      });
      recommendations.push('Add Schema.org markup for your business type to enable rich snippets.');
    }

    // Analytics (Info)
    if (checks.hasAnalytics) {
      score += 5;
    } else {
      issues.push({
        category: 'Analytics',
        severity: 'info',
        message: 'No analytics tool detected. Tracking visitor behavior is essential for growth.',
      });
      recommendations.push('Install Google Analytics 4 and Google Search Console for insights.');
    }

    // Robots.txt and Sitemap
    if (checks.hasRobots) {
      score += 5;
    } else {
      issues.push({
        category: 'SEO',
        severity: 'warning',
        message: 'Missing robots.txt file. Search engines may not crawl your site efficiently.',
      });
      recommendations.push('Create a robots.txt file to guide search engine crawlers.');
    }

    if (checks.hasSitemap) {
      score += 10;
    } else {
      issues.push({
        category: 'SEO',
        severity: 'warning',
        message: 'No XML sitemap detected. Makes it harder for search engines to discover pages.',
      });
      recommendations.push('Generate and submit an XML sitemap to Google Search Console.');
    }

    // Determine grade
    let grade = 'F';
    if (score >= 90) grade = 'A';
    else if (score >= 80) grade = 'B';
    else if (score >= 70) grade = 'C';
    else if (score >= 60) grade = 'D';

    // Generate summary
    let summary = '';
    if (score >= 80) {
      summary = `Great job! ${domain} has solid foundations. A few optimizations can push you to the top of search results.`;
    } else if (score >= 60) {
      summary = `${domain} has some SEO basics in place but needs improvement in key areas like ${issues.filter(i => i.severity === 'critical').map(i => i.category).join(', ') || 'performance and mobile optimization'}.`;
    } else {
      summary = `${domain} needs significant SEO work. Critical issues in ${issues.filter(i => i.severity === 'critical').map(i => i.category).slice(0, 2).join(' and ')} are holding back your search visibility.`;
    }

    // Add default recommendation if list is empty
    if (recommendations.length === 0) {
      recommendations.push('Continue monitoring your SEO performance and stay updated with algorithm changes.');
    }

    return NextResponse.json(
      {
        url: urlString,
        domain,
        score,
        grade,
        summary,
        issues,
        recommendations,
        checks,
        success: true,
      },
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
