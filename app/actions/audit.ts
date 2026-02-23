'use server';

type AuditResult = {
    url: string;
    score: number;
    grade: string;
    summary: string;
    issues: { category: string; severity: 'critical' | 'warning' | 'info'; message: string }[];
    recommendations: string[];
    quickReplies: string[];
};

function isValidUrl(url: string): boolean {
    try {
        const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
        return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
        return false;
    }
}

async function fetchSiteData(url: string) {
    const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
    const startTime = Date.now();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
        const response = await fetch(normalizedUrl, {
            headers: { 'User-Agent': 'SmileFotilo-AuditBot/1.0' },
            signal: controller.signal,
            redirect: 'follow',
        });
        const html = await response.text();
        const loadTimeMs = Date.now() - startTime;

        const getMetaContent = (name: string) => {
            const match = html.match(new RegExp(`<meta[^>]*(?:name|property)=["']${name}["'][^>]*content=["']([^"']*)["']`, 'i'))
                || html.match(new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*(?:name|property)=["']${name}["']`, 'i'));
            return match?.[1] || '';
        };

        const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
        const h1Matches = html.match(/<h1[^>]*>/gi) || [];
        const imgMatches = html.match(/<img[^>]*>/gi) || [];
        const linkMatches = html.match(/<a[^>]*href/gi) || [];
        const h2Count = (html.match(/<h2[^>]*>/gi) || []).length;
        const h3Count = (html.match(/<h3[^>]*>/gi) || []).length;

        let hasRobotsTxt = false;
        let hasSitemap = false;
        try {
            const baseUrl = new URL(normalizedUrl).origin;
            const rc = new AbortController();
            const rt = setTimeout(() => rc.abort(), 3000);
            const robotsRes = await fetch(`${baseUrl}/robots.txt`, { signal: rc.signal });
            hasRobotsTxt = robotsRes.ok && (await robotsRes.text()).length > 10;
            clearTimeout(rt);
            const sc = new AbortController();
            const st = setTimeout(() => sc.abort(), 3000);
            const sitemapRes = await fetch(`${baseUrl}/sitemap.xml`, { signal: sc.signal });
            hasSitemap = sitemapRes.ok && (await sitemapRes.text()).includes('<urlset');
            clearTimeout(st);
        } catch { /* ignore */ }

        return {
            title: titleMatch?.[1]?.trim() || '',
            description: getMetaContent('description'),
            hasViewport: /meta[^>]*name=["']viewport["']/i.test(html),
            hasCanonical: /<link[^>]*rel=["']canonical["']/i.test(html),
            hasH1: h1Matches.length > 0,
            h1Count: h1Matches.length,
            hasOgTags: /property=["']og:/i.test(html),
            hasFavicon: /<link[^>]*rel=["'](?:shortcut )?icon["']/i.test(html) || /<link[^>]*rel=["']apple-touch-icon["']/i.test(html),
            hasStructuredData: /application\/ld\+json/i.test(html),
            hasRobotsTxt,
            hasSitemap,
            loadTimeMs,
            htmlSize: html.length,
            imageCount: imgMatches.length,
            linkCount: linkMatches.length,
            headingStructure: `H1: ${h1Matches.length}, H2: ${h2Count}, H3: ${h3Count}`,
            isHttps: normalizedUrl.startsWith('https'),
        };
    } finally {
        clearTimeout(timeout);
    }
}

export async function runWebsiteAudit(rawUrl: string): Promise<AuditResult> {
    if (!rawUrl || !isValidUrl(rawUrl)) {
        return {
            url: rawUrl,
            score: 0,
            grade: 'N/A',
            summary: 'Please enter a valid URL (e.g., smilefotilo.com)',
            issues: [],
            recommendations: [],
            quickReplies: [],
        };
    }

    const url = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;

    try {
        const data = await fetchSiteData(url);
        const issues: AuditResult['issues'] = [];
        let score = 100;

        if (!data.title) {
            issues.push({ category: 'SEO', severity: 'critical', message: 'Missing page title tag' });
            score -= 15;
        } else if (data.title.length < 30 || data.title.length > 60) {
            issues.push({ category: 'SEO', severity: 'warning', message: `Title length (${data.title.length} chars) — ideal is 30-60` });
            score -= 5;
        }

        if (!data.description) {
            issues.push({ category: 'SEO', severity: 'critical', message: 'Missing meta description' });
            score -= 15;
        } else if (data.description.length < 120 || data.description.length > 160) {
            issues.push({ category: 'SEO', severity: 'warning', message: `Meta description length (${data.description.length} chars) — ideal is 120-160` });
            score -= 5;
        }

        if (!data.hasViewport) {
            issues.push({ category: 'Mobile', severity: 'critical', message: 'Missing viewport meta tag — site may not be mobile-friendly' });
            score -= 15;
        }

        if (!data.hasH1) {
            issues.push({ category: 'SEO', severity: 'critical', message: 'No H1 heading found on the page' });
            score -= 10;
        } else if (data.h1Count > 1) {
            issues.push({ category: 'SEO', severity: 'warning', message: `Multiple H1 tags found (${data.h1Count}) — use only one per page` });
            score -= 5;
        }

        if (!data.hasCanonical) {
            issues.push({ category: 'SEO', severity: 'warning', message: 'Missing canonical link tag' });
            score -= 5;
        }

        if (!data.hasOgTags) {
            issues.push({ category: 'Social', severity: 'warning', message: 'Missing Open Graph tags — links won\'t preview well on social media' });
            score -= 5;
        }

        if (!data.hasStructuredData) {
            issues.push({ category: 'SEO', severity: 'warning', message: 'No structured data (JSON-LD) found — missing rich snippets in Google' });
            score -= 5;
        }

        if (!data.hasFavicon) {
            issues.push({ category: 'UX', severity: 'info', message: 'No favicon detected' });
            score -= 3;
        }

        if (!data.isHttps) {
            issues.push({ category: 'Security', severity: 'critical', message: 'Site is not using HTTPS — this hurts SEO and trust' });
            score -= 15;
        }

        if (!data.hasRobotsTxt) {
            issues.push({ category: 'SEO', severity: 'warning', message: 'Missing robots.txt — search engines may crawl inefficiently' });
            score -= 5;
        }

        if (!data.hasSitemap) {
            issues.push({ category: 'SEO', severity: 'warning', message: 'No XML sitemap found — makes indexing slower' });
            score -= 5;
        }

        if (data.loadTimeMs > 3000) {
            issues.push({ category: 'Performance', severity: 'critical', message: `Slow load time: ${(data.loadTimeMs / 1000).toFixed(1)}s — target is under 3s` });
            score -= 10;
        } else if (data.loadTimeMs > 1500) {
            issues.push({ category: 'Performance', severity: 'warning', message: `Load time: ${(data.loadTimeMs / 1000).toFixed(1)}s — good but could be faster` });
            score -= 3;
        }

        if (data.htmlSize > 500000) {
            issues.push({ category: 'Performance', severity: 'warning', message: `Large HTML (${(data.htmlSize / 1024).toFixed(0)}KB) — consider code splitting` });
            score -= 5;
        }

        score = Math.max(0, Math.min(100, score));
        const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 50 ? 'D' : 'F';

        const recommendations: string[] = [];
        const criticalIssues = issues.filter(i => i.severity === 'critical');
        const warnings = issues.filter(i => i.severity === 'warning');

        if (criticalIssues.length > 0) {
            recommendations.push(`Fix ${criticalIssues.length} critical issues first — they're hurting your rankings`);
        }
        if (!data.hasStructuredData) {
            recommendations.push('Add JSON-LD structured data for your business type');
        }
        if (!data.hasOgTags) {
            recommendations.push('Add Open Graph meta tags for better social media sharing');
        }
        if (data.loadTimeMs > 2000) {
            recommendations.push('Optimize images and enable lazy loading to improve speed');
        }
        if (warnings.length > 2) {
            recommendations.push(`Address ${warnings.length} warnings to push your score above ${Math.min(score + 20, 100)}`);
        }
        recommendations.push('Consider a professional SEO audit for deeper analysis');

        return {
            url,
            score,
            grade,
            summary: `Scanned ${data.linkCount} links, ${data.imageCount} images. Headings: ${data.headingStructure}. Load: ${(data.loadTimeMs / 1000).toFixed(1)}s.`,
            issues: issues.sort((a, b) => {
                const order = { critical: 0, warning: 1, info: 2 };
                return order[a.severity] - order[b.severity];
            }),
            recommendations,
            quickReplies: ['Get full audit', 'Fix my site', 'Pricing'],
        };
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Unknown error';
        return {
            url,
            score: 0,
            grade: 'N/A',
            summary: `Could not reach ${url}. Error: ${msg.slice(0, 100)}`,
            issues: [{ category: 'Connectivity', severity: 'critical', message: `Site unreachable: ${msg.slice(0, 80)}` }],
            recommendations: ['Verify the URL is correct and the site is online'],
            quickReplies: ['Try again', 'Contact us'],
        };
    }
}
