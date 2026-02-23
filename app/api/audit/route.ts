import { NextRequest, NextResponse } from 'next/server';

function isValidUrl(url: string): boolean {
    try {
        const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
        return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
        return false;
    }
}

export async function POST(request: NextRequest) {
    try {
        const { url: rawUrl } = await request.json();

        if (!rawUrl || !isValidUrl(rawUrl)) {
            return NextResponse.json({
                url: rawUrl || '',
                score: 0,
                grade: 'N/A',
                summary: 'Please enter a valid URL (e.g., smilefotilo.com)',
                issues: [],
                recommendations: [],
            });
        }

        const url = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;

        // Fetch main page
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        let html: string;
        let loadTimeMs: number;

        try {
            const startTime = Date.now();
            const response = await fetch(url, {
                signal: controller.signal,
                redirect: 'follow',
                headers: { 'Accept': 'text/html' },
            });
            html = await response.text();
            loadTimeMs = Date.now() - startTime;
        } catch (fetchErr: unknown) {
            clearTimeout(timeout);
            const msg = fetchErr instanceof Error ? fetchErr.message : 'Network error';
            return NextResponse.json({
                url,
                score: 0,
                grade: 'N/A',
                summary: `Could not reach ${url}: ${msg.slice(0, 80)}`,
                issues: [{ category: 'Connectivity', severity: 'critical', message: `Site unreachable: ${msg.slice(0, 60)}` }],
                recommendations: ['Verify the URL is correct and the site is online'],
            });
        } finally {
            clearTimeout(timeout);
        }

        // Parse HTML
        const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
        const title = titleMatch?.[1]?.trim() || '';
        const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i)
            || html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);
        const description = descMatch?.[1] || '';
        const h1Matches = html.match(/<h1[^>]*>/gi) || [];
        const imgMatches = html.match(/<img[^>]*>/gi) || [];
        const linkMatches = html.match(/<a[^>]*href/gi) || [];
        const h2Count = (html.match(/<h2[^>]*>/gi) || []).length;
        const h3Count = (html.match(/<h3[^>]*>/gi) || []).length;
        const hasViewport = /meta[^>]*name=["']viewport["']/i.test(html);
        const hasCanonical = /<link[^>]*rel=["']canonical["']/i.test(html);
        const hasOgTags = /property=["']og:/i.test(html);
        const hasFavicon = /<link[^>]*rel=["'](?:shortcut )?icon["']/i.test(html);
        const hasStructuredData = /application\/ld\+json/i.test(html);
        const isHttps = url.startsWith('https');

        // Check robots.txt and sitemap (quick, non-blocking)
        let hasRobotsTxt = false;
        let hasSitemap = false;
        try {
            const baseUrl = new URL(url).origin;
            const rc = new AbortController();
            setTimeout(() => rc.abort(), 2000);
            const r = await fetch(`${baseUrl}/robots.txt`, { signal: rc.signal });
            hasRobotsTxt = r.ok;
        } catch { /* ok */ }
        try {
            const baseUrl = new URL(url).origin;
            const sc = new AbortController();
            setTimeout(() => sc.abort(), 2000);
            const s = await fetch(`${baseUrl}/sitemap.xml`, { signal: sc.signal });
            hasSitemap = s.ok && s.headers.get('content-type')?.includes('xml') || false;
        } catch { /* ok */ }

        // Score
        type Issue = { category: string; severity: 'critical' | 'warning' | 'info'; message: string };
        const issues: Issue[] = [];
        let score = 100;

        if (!title) { issues.push({ category: 'SEO', severity: 'critical', message: 'Missing page title' }); score -= 15; }
        else if (title.length < 30 || title.length > 60) { issues.push({ category: 'SEO', severity: 'warning', message: `Title: ${title.length} chars (ideal 30-60)` }); score -= 5; }

        if (!description) { issues.push({ category: 'SEO', severity: 'critical', message: 'Missing meta description' }); score -= 15; }
        else if (description.length < 120 || description.length > 160) { issues.push({ category: 'SEO', severity: 'warning', message: `Description: ${description.length} chars (ideal 120-160)` }); score -= 5; }

        if (!hasViewport) { issues.push({ category: 'Mobile', severity: 'critical', message: 'Missing viewport — not mobile-friendly' }); score -= 15; }
        if (h1Matches.length === 0) { issues.push({ category: 'SEO', severity: 'critical', message: 'No H1 heading' }); score -= 10; }
        else if (h1Matches.length > 1) { issues.push({ category: 'SEO', severity: 'warning', message: `${h1Matches.length} H1 tags (use 1)` }); score -= 5; }
        if (!hasCanonical) { issues.push({ category: 'SEO', severity: 'warning', message: 'Missing canonical tag' }); score -= 5; }
        if (!hasOgTags) { issues.push({ category: 'Social', severity: 'warning', message: 'No Open Graph tags' }); score -= 5; }
        if (!hasStructuredData) { issues.push({ category: 'SEO', severity: 'warning', message: 'No JSON-LD structured data' }); score -= 5; }
        if (!hasFavicon) { issues.push({ category: 'UX', severity: 'info', message: 'No favicon' }); score -= 3; }
        if (!isHttps) { issues.push({ category: 'Security', severity: 'critical', message: 'Not using HTTPS' }); score -= 15; }
        if (!hasRobotsTxt) { issues.push({ category: 'SEO', severity: 'warning', message: 'Missing robots.txt' }); score -= 5; }
        if (!hasSitemap) { issues.push({ category: 'SEO', severity: 'warning', message: 'No sitemap.xml' }); score -= 5; }
        if (loadTimeMs > 3000) { issues.push({ category: 'Performance', severity: 'critical', message: `Slow: ${(loadTimeMs / 1000).toFixed(1)}s` }); score -= 10; }
        else if (loadTimeMs > 1500) { issues.push({ category: 'Performance', severity: 'warning', message: `Load: ${(loadTimeMs / 1000).toFixed(1)}s` }); score -= 3; }

        score = Math.max(0, Math.min(100, score));
        const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 50 ? 'D' : 'F';

        const recommendations: string[] = [];
        const criticals = issues.filter(i => i.severity === 'critical').length;
        if (criticals > 0) recommendations.push(`Fix ${criticals} critical issues first`);
        if (!hasStructuredData) recommendations.push('Add JSON-LD structured data');
        if (!hasOgTags) recommendations.push('Add Open Graph tags for social sharing');
        if (loadTimeMs > 2000) recommendations.push('Optimize images & enable lazy loading');
        recommendations.push('Get a professional audit for deeper analysis');

        return NextResponse.json({
            url,
            score,
            grade,
            summary: `${linkMatches.length} links, ${imgMatches.length} images. H1:${h1Matches.length} H2:${h2Count} H3:${h3Count}. Load: ${(loadTimeMs / 1000).toFixed(1)}s`,
            issues: issues.sort((a, b) => ({ critical: 0, warning: 1, info: 2 })[a.severity] - ({ critical: 0, warning: 1, info: 2 })[b.severity]),
            recommendations,
        });
    } catch (error: unknown) {
        console.error('[Audit API] Error:', error);
        return NextResponse.json({
            url: '',
            score: 0,
            grade: 'N/A',
            summary: 'An unexpected error occurred',
            issues: [],
            recommendations: [],
        }, { status: 200 }); // Return 200 with error data so client can display it
    }
}
