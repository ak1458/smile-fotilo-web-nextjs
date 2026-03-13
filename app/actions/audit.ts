'use server';

import { z } from 'zod';

type AuditResult = {
    url: string;
    score: number;
    grade: string;
    summary: string;
    issues: { category: string; severity: 'critical' | 'warning' | 'info'; message: string }[];
    recommendations: string[];
    quickReplies: string[];
};

// Use Zod for strict URL and length validation
const UrlSchema = z.string().trim().max(200, "URL is too long").refine((val) => {
    try {
        const parsed = new URL(val.startsWith('http') ? val : `https://${val}`);
        return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
        return false;
    }
}, { message: "Invalid URL format" });

function makeErrorResult(url: string, msg: string): AuditResult {
    return {
        url,
        score: 0,
        grade: 'N/A',
        summary: msg,
        issues: [{ category: 'Connectivity', severity: 'critical', message: msg }],
        recommendations: ['Verify the URL is correct and the site is online'],
        quickReplies: ['Try again', 'Contact us'],
    };
}

export async function runWebsiteAudit(rawUrl: string): Promise<AuditResult> {
    const parsed = UrlSchema.safeParse(rawUrl);

    if (!parsed.success) {
        return makeErrorResult(rawUrl?.slice(0, 100) || '', 'Please enter a valid URL (e.g., smilefotilo.com, max 200 chars)');
    }

    const url = parsed.data.startsWith('http') ? parsed.data : `https://${parsed.data}`;

    try {
        // Fetch main page
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 12000);
        let html: string;
        let loadTimeMs: number;

        try {
            const startTime = Date.now();
            const response = await fetch(url, {
                signal: controller.signal,
                redirect: 'follow',
                headers: { 'Accept': 'text/html,application/xhtml+xml' },
            });
            html = await response.text();
            loadTimeMs = Date.now() - startTime;
        } catch (fetchErr: unknown) {
            clearTimeout(timeout);
            const msg = fetchErr instanceof Error ? fetchErr.message : 'Network error';
            console.error('[Audit] Fetch failed:', msg);
            return makeErrorResult(url, `Could not reach ${url}: ${msg.slice(0, 80)}`);
        } finally {
            clearTimeout(timeout);
        }

        // Parse HTML metrics
        const getMetaContent = (name: string) => {
            const match = html.match(new RegExp(`<meta[^>]*(?:name|property)=["']${name}["'][^>]*content=["']([^"']*)["']`, 'i'))
                || html.match(new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*(?:name|property)=["']${name}["']`, 'i'));
            return match?.[1] || '';
        };

        const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
        const title = titleMatch?.[1]?.trim() || '';
        const description = getMetaContent('description');
        const h1Matches = html.match(/<h1[^>]*>/gi) || [];
        const imgMatches = html.match(/<img[^>]*>/gi) || [];
        const linkMatches = html.match(/<a[^>]*href/gi) || [];
        const h2Count = (html.match(/<h2[^>]*>/gi) || []).length;
        const h3Count = (html.match(/<h3[^>]*>/gi) || []).length;
        const hasViewport = /meta[^>]*name=["']viewport["']/i.test(html);
        const hasCanonical = /<link[^>]*rel=["']canonical["']/i.test(html);
        const hasOgTags = /property=["']og:/i.test(html);
        const hasFavicon = /<link[^>]*rel=["'](?:shortcut )?icon["']/i.test(html) || /<link[^>]*rel=["']apple-touch-icon["']/i.test(html);
        const hasStructuredData = /application\/ld\+json/i.test(html);
        const isHttps = url.startsWith('https');

        // Check robots.txt and sitemap (non-critical, don't fail if these error)
        let hasRobotsTxt = false;
        let hasSitemap = false;
        try {
            const baseUrl = new URL(url).origin;
            const rc = new AbortController();
            setTimeout(() => rc.abort(), 3000);
            const robotsRes = await fetch(`${baseUrl}/robots.txt`, { signal: rc.signal });
            hasRobotsTxt = robotsRes.ok && (await robotsRes.text()).length > 10;
        } catch { /* ignore */ }
        try {
            const baseUrl = new URL(url).origin;
            const sc = new AbortController();
            setTimeout(() => sc.abort(), 3000);
            const sitemapRes = await fetch(`${baseUrl}/sitemap.xml`, { signal: sc.signal });
            hasSitemap = sitemapRes.ok && (await sitemapRes.text()).includes('<urlset');
        } catch { /* ignore */ }

        // Score calculation
        const issues: AuditResult['issues'] = [];
        let score = 100;

        if (!title) {
            issues.push({ category: 'SEO', severity: 'critical', message: 'Missing page title tag' });
            score -= 15;
        } else if (title.length < 30 || title.length > 60) {
            issues.push({ category: 'SEO', severity: 'warning', message: `Title length (${title.length} chars) — ideal is 30-60` });
            score -= 5;
        }

        if (!description) {
            issues.push({ category: 'SEO', severity: 'critical', message: 'Missing meta description' });
            score -= 15;
        } else if (description.length < 120 || description.length > 160) {
            issues.push({ category: 'SEO', severity: 'warning', message: `Meta description (${description.length} chars) — ideal 120-160` });
            score -= 5;
        }

        if (!hasViewport) {
            issues.push({ category: 'Mobile', severity: 'critical', message: 'Missing viewport meta tag — not mobile-friendly' });
            score -= 15;
        }

        if (h1Matches.length === 0) {
            issues.push({ category: 'SEO', severity: 'critical', message: 'No H1 heading found' });
            score -= 10;
        } else if (h1Matches.length > 1) {
            issues.push({ category: 'SEO', severity: 'warning', message: `Multiple H1 tags (${h1Matches.length}) — use only one` });
            score -= 5;
        }

        if (!hasCanonical) {
            issues.push({ category: 'SEO', severity: 'warning', message: 'Missing canonical link tag' });
            score -= 5;
        }

        if (!hasOgTags) {
            issues.push({ category: 'Social', severity: 'warning', message: 'No Open Graph tags — poor social media previews' });
            score -= 5;
        }

        if (!hasStructuredData) {
            issues.push({ category: 'SEO', severity: 'warning', message: 'No structured data (JSON-LD) — missing rich snippets' });
            score -= 5;
        }

        if (!hasFavicon) {
            issues.push({ category: 'UX', severity: 'info', message: 'No favicon detected' });
            score -= 3;
        }

        if (!isHttps) {
            issues.push({ category: 'Security', severity: 'critical', message: 'Not using HTTPS — hurts SEO and trust' });
            score -= 15;
        }

        if (!hasRobotsTxt) {
            issues.push({ category: 'SEO', severity: 'warning', message: 'Missing robots.txt' });
            score -= 5;
        }

        if (!hasSitemap) {
            issues.push({ category: 'SEO', severity: 'warning', message: 'No XML sitemap found' });
            score -= 5;
        }

        if (loadTimeMs > 3000) {
            issues.push({ category: 'Performance', severity: 'critical', message: `Slow: ${(loadTimeMs / 1000).toFixed(1)}s — target under 3s` });
            score -= 10;
        } else if (loadTimeMs > 1500) {
            issues.push({ category: 'Performance', severity: 'warning', message: `Load: ${(loadTimeMs / 1000).toFixed(1)}s — could be faster` });
            score -= 3;
        }

        if (html.length > 500000) {
            issues.push({ category: 'Performance', severity: 'warning', message: `Large HTML (${(html.length / 1024).toFixed(0)}KB)` });
            score -= 5;
        }

        score = Math.max(0, Math.min(100, score));
        const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 50 ? 'D' : 'F';

        // Recommendations
        const recommendations: string[] = [];
        const criticals = issues.filter(i => i.severity === 'critical');
        const warns = issues.filter(i => i.severity === 'warning');

        if (criticals.length > 0) recommendations.push(`Fix ${criticals.length} critical issues first`);
        if (!hasStructuredData) recommendations.push('Add JSON-LD structured data for rich snippets');
        if (!hasOgTags) recommendations.push('Add Open Graph tags for social media');
        if (loadTimeMs > 2000) recommendations.push('Optimize images and enable lazy loading');
        if (warns.length > 2) recommendations.push(`Address ${warns.length} warnings to improve your score`);
        recommendations.push('Get a professional SEO audit for deeper analysis');

        return {
            url,
            score,
            grade,
            summary: `Scanned ${linkMatches.length} links, ${imgMatches.length} images. H1:${h1Matches.length} H2:${h2Count} H3:${h3Count}. Load: ${(loadTimeMs / 1000).toFixed(1)}s.`,
            issues: issues.sort((a, b) => ({ critical: 0, warning: 1, info: 2 })[a.severity] - ({ critical: 0, warning: 1, info: 2 })[b.severity]),
            recommendations,
            quickReplies: ['Get full audit', 'Fix my site', 'Pricing'],
        };
    } catch (error: unknown) {
        console.error('[Audit] Unexpected error:', error);
        const msg = error instanceof Error ? error.message : 'Unknown error';
        return makeErrorResult(url, `Audit failed: ${msg.slice(0, 80)}`);
    }
}
