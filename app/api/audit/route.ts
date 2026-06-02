import { NextRequest, NextResponse } from 'next/server';
import { rateLimitMiddleware, rateLimits } from '@/app/lib/security/rate-limit';
import { guardPromptInput } from '@/app/lib/security/prompt-guard';

export const runtime = 'nodejs';
export const maxDuration = 30;

type Severity = 'critical' | 'warning' | 'info';
type Issue = { category: string; severity: Severity; message: string };
type Category = { name: string; score: number; icon: string };

const UA = 'Mozilla/5.0 (compatible; SmileFotiloAudit/1.0; +https://smilefotilo.com/tools/website-audit)';

// Block SSRF to internal/private targets.
function isBlockedHost(host: string): boolean {
  const h = host.toLowerCase();
  if (h === 'localhost' || h.endsWith('.local') || h.endsWith('.internal') || !h.includes('.')) return true;
  if (/^(127\.|10\.|192\.168\.|169\.254\.|0\.0\.0\.0|::1)/.test(h)) return true;
  if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(h)) return true;
  if (h === '169.254.169.254') return true; // cloud metadata
  return false;
}

async function fetchWithTimeout(url: string, ms: number, init?: RequestInit) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal, headers: { 'User-Agent': UA, ...(init?.headers || {}) }, redirect: 'follow' });
  } finally {
    clearTimeout(t);
  }
}

function clamp(n: number) { return Math.max(0, Math.min(100, Math.round(n))); }

export async function POST(request: NextRequest) {
  try {
    const rateLimit = await rateLimitMiddleware(request, rateLimits.publicApi);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429, headers: rateLimit.headers });
    }

    const body = await request.json();
    const { url } = body;
    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400, headers: rateLimit.headers });

    const urlGuard = guardPromptInput(url, { maxLength: 500 });
    if (!urlGuard.safe) return NextResponse.json({ error: 'Invalid URL detected' }, { status: 400, headers: rateLimit.headers });

    let target: URL;
    try {
      target = new URL(urlGuard.sanitized.startsWith('http') ? urlGuard.sanitized : `https://${urlGuard.sanitized}`);
      if (!['http:', 'https:'].includes(target.protocol)) throw new Error('proto');
    } catch {
      return NextResponse.json({ error: 'Invalid URL format. Please enter a valid website URL.' }, { status: 400, headers: rateLimit.headers });
    }

    if (isBlockedHost(target.hostname)) {
      return NextResponse.json({ error: 'That URL points to a private/internal address and cannot be audited.' }, { status: 400, headers: rateLimit.headers });
    }

    const urlString = target.toString();
    const domain = target.hostname;
    const origin = target.origin;

    // --- Fetch the page (timed) ---
    let html = '';
    let ttfbMs = 0;
    let pageOk = false;
    let statusCode = 0;
    try {
      const t0 = Date.now();
      const res = await fetchWithTimeout(urlString, 9000);
      ttfbMs = Date.now() - t0;
      statusCode = res.status;
      pageOk = res.ok;
      if (res.ok) html = (await res.text()).slice(0, 1_500_000);
    } catch {
      return NextResponse.json({
        url: urlString, domain, score: 0, grade: 'N/A',
        summary: `Could not reach ${domain}. The site may be down, blocking bots, or too slow to respond.`,
        categories: [], issues: [{ category: 'Availability', severity: 'critical', message: 'The site did not respond within 9 seconds.' }],
        recommendations: ['Confirm the site is online and not blocking automated requests, then re-run the audit.'],
        success: true,
      }, { headers: rateLimit.headers });
    }

    const lower = html.toLowerCase();
    const htmlKB = Math.round(html.length / 1024);

    // --- Parse signals (real) ---
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim().replace(/\s+/g, ' ') : '';
    const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]*>/i);
    const desc = descMatch ? (descMatch[0].match(/content=["']([\s\S]*?)["']/i)?.[1] || '').trim() : '';
    const hasViewport = /<meta[^>]+name=["']viewport["']/i.test(html);
    const hasCanonical = /<link[^>]+rel=["']canonical["']/i.test(html);
    const h1Count = (lower.match(/<h1[\s>]/g) || []).length;
    const hasOgTitle = /<meta[^>]+property=["']og:title["']/i.test(html);
    const hasOgImage = /<meta[^>]+property=["']og:image["']/i.test(html);
    const hasSchema = /application\/ld\+json/i.test(html);
    const hasLang = /<html[^>]+lang=/i.test(html);
    const hasAnalytics = /(googletagmanager\.com|google-analytics\.com|gtag\(|gtm\.js|plausible|clarity\.ms|posthog)/i.test(lower);
    const imgTags = (lower.match(/<img[\s>]/g) || []).length;
    const imgWithAlt = (html.match(/<img[^>]+alt=["'][^"']*["']/gi) || []).length;
    const altCoverage = imgTags === 0 ? 100 : Math.round((imgWithAlt / imgTags) * 100);
    const scripts = (lower.match(/<script[\s>]/g) || []).length;
    const stylesheets = (lower.match(/<link[^>]+rel=["']stylesheet["']/gi) || []).length;
    const mixedContent = target.protocol === 'https:' && /(src|href)=["']http:\/\//i.test(html);

    // --- robots.txt + sitemap (real fetches) ---
    let hasRobots = false, robotsHasSitemap = false, hasSitemap = false;
    try {
      const r = await fetchWithTimeout(`${origin}/robots.txt`, 5000);
      if (r.ok) { hasRobots = true; const txt = (await r.text()).toLowerCase(); robotsHasSitemap = txt.includes('sitemap:'); }
    } catch { /* ignore */ }
    try {
      const s = await fetchWithTimeout(`${origin}/sitemap.xml`, 5000, { method: 'GET' });
      hasSitemap = s.ok || robotsHasSitemap;
    } catch { hasSitemap = robotsHasSitemap; }

    // --- PageSpeed Insights (best-effort, real Lighthouse perf) ---
    let perfScore: number | null = null;
    let lcp: string | null = null, cls: string | null = null;
    let perfSource: 'psi' | 'heuristic' = 'heuristic';
    try {
      const key = process.env.PAGESPEED_API_KEY;
      const psiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(urlString)}&strategy=mobile&category=performance${key ? `&key=${key}` : ''}`;
      const psi = await fetchWithTimeout(psiUrl, 12000);
      if (psi.ok) {
        const data = await psi.json();
        const s = data?.lighthouseResult?.categories?.performance?.score;
        if (typeof s === 'number') { perfScore = clamp(s * 100); perfSource = 'psi'; }
        const audits = data?.lighthouseResult?.audits;
        lcp = audits?.['largest-contentful-paint']?.displayValue || null;
        cls = audits?.['cumulative-layout-shift']?.displayValue || null;
      }
    } catch { /* fall back to heuristic */ }

    if (perfScore === null) {
      // Lightweight real heuristic: response time + page weight + request fan-out.
      let p = 100;
      if (ttfbMs > 600) p -= Math.min(35, (ttfbMs - 600) / 60);
      if (htmlKB > 150) p -= Math.min(25, (htmlKB - 150) / 20);
      if (scripts > 15) p -= Math.min(20, (scripts - 15) * 1.5);
      if (stylesheets > 6) p -= Math.min(10, (stylesheets - 6) * 2);
      perfScore = clamp(p);
    }

    // --- Category scoring ---
    const issues: Issue[] = [];
    const recommendations: string[] = [];

    // SEO
    let seo = 100;
    if (!title) { seo -= 30; issues.push({ category: 'SEO', severity: 'critical', message: 'No <title> tag found — the single most important on-page SEO element.' }); recommendations.push('Add a unique, descriptive <title> (30–60 chars) to every page.'); }
    else if (title.length < 30 || title.length > 65) { seo -= 8; issues.push({ category: 'SEO', severity: 'warning', message: `Title length is ${title.length} chars (aim for 30–60): "${title.slice(0, 70)}".` }); recommendations.push('Tighten the title to 30–60 characters with the primary keyword near the front.'); }
    if (!desc) { seo -= 15; issues.push({ category: 'SEO', severity: 'warning', message: 'Missing meta description — Google may show a random snippet.' }); recommendations.push('Write a compelling 120–160 char meta description per page.'); }
    else if (desc.length < 80 || desc.length > 170) { seo -= 5; issues.push({ category: 'SEO', severity: 'info', message: `Meta description is ${desc.length} chars (aim for 120–160).` }); }
    if (!hasCanonical) { seo -= 8; issues.push({ category: 'SEO', severity: 'info', message: 'No canonical tag — risks duplicate-content dilution.' }); recommendations.push('Add a self-referencing <link rel="canonical"> on each page.'); }
    if (!hasSchema) { seo -= 12; issues.push({ category: 'SEO', severity: 'warning', message: 'No structured data (JSON-LD) detected — blocks rich results and AI extraction.' }); recommendations.push('Add Schema.org JSON-LD (Organization/LocalBusiness + per-page types).'); }
    if (!hasRobots) { seo -= 8; issues.push({ category: 'SEO', severity: 'warning', message: 'No robots.txt found.' }); recommendations.push('Add a robots.txt that allows crawling and points to your sitemap.'); }
    if (!hasSitemap) { seo -= 10; issues.push({ category: 'SEO', severity: 'warning', message: 'No XML sitemap found at /sitemap.xml or in robots.txt.' }); recommendations.push('Generate /sitemap.xml and submit it in Google Search Console.'); }

    // Performance
    const perf = perfScore;
    if (perf < 50) { issues.push({ category: 'Performance', severity: 'critical', message: `Performance is poor (${perf}/100${perfSource === 'psi' ? ', Lighthouse mobile' : ''}). Slow sites lose rankings and visitors.` }); recommendations.push('Compress/lazy-load images, reduce JS, enable caching/CDN.'); }
    else if (perf < 80) { issues.push({ category: 'Performance', severity: 'warning', message: `Performance is ${perf}/100 — room to improve load speed.` }); recommendations.push('Optimize the largest image and defer non-critical scripts.'); }
    if (ttfbMs > 1000) { issues.push({ category: 'Performance', severity: 'warning', message: `Slow server response (${ttfbMs}ms TTFB). Aim for under 600ms.` }); }

    // Mobile
    let mobile = 100;
    if (!hasViewport) { mobile -= 60; issues.push({ category: 'Mobile', severity: 'critical', message: 'No mobile viewport meta tag — the site will not scale on phones (Google uses mobile-first indexing).' }); recommendations.push('Add <meta name="viewport" content="width=device-width, initial-scale=1">.'); }
    if (perfSource === 'psi') mobile = Math.round((mobile + perf) / 2);

    // Security / Trust
    let trust = 100;
    if (target.protocol !== 'https:') { trust -= 60; issues.push({ category: 'Security', severity: 'critical', message: 'Site is not served over HTTPS — a security and ranking problem.' }); recommendations.push('Install an SSL certificate and 301-redirect all HTTP to HTTPS.'); }
    if (mixedContent) { trust -= 20; issues.push({ category: 'Security', severity: 'warning', message: 'Mixed content: HTTPS page loads some resources over HTTP.' }); recommendations.push('Update all asset URLs to https://.'); }
    if (!hasAnalytics) { trust -= 5; issues.push({ category: 'Analytics', severity: 'info', message: 'No analytics detected — you are flying blind on visitor behavior.' }); recommendations.push('Install GA4 + Google Search Console.'); }

    // Structure / Content
    let structure = 100;
    if (h1Count === 0) { structure -= 25; issues.push({ category: 'Structure', severity: 'warning', message: 'No <h1> heading found.' }); recommendations.push('Add exactly one descriptive <h1> per page.'); }
    else if (h1Count > 1) { structure -= 10; issues.push({ category: 'Structure', severity: 'info', message: `${h1Count} <h1> tags found — use one primary H1 per page.` }); }
    if (!hasLang) { structure -= 8; issues.push({ category: 'Structure', severity: 'info', message: 'No lang attribute on <html>.' }); }
    if (imgTags > 0 && altCoverage < 80) { structure -= 12; issues.push({ category: 'Accessibility', severity: 'warning', message: `Only ${altCoverage}% of images have alt text.` }); recommendations.push('Add descriptive alt text to all meaningful images.'); }
    if (!hasOgTitle || !hasOgImage) { structure -= 8; issues.push({ category: 'Social', severity: 'info', message: 'Missing Open Graph tags — links share without a title/image preview.' }); recommendations.push('Add og:title, og:description, and og:image (1200×630).'); }

    const categories: Category[] = [
      { name: 'SEO', score: clamp(seo), icon: '🔍' },
      { name: 'Performance', score: clamp(perf), icon: '⚡' },
      { name: 'Mobile', score: clamp(mobile), icon: '📱' },
      { name: 'Security', score: clamp(trust), icon: '🔒' },
      { name: 'Structure', score: clamp(structure), icon: '🧱' },
    ];

    const score = clamp(categories.reduce((a, c) => a + c.score, 0) / categories.length);
    let grade = 'F';
    if (score >= 90) grade = 'A'; else if (score >= 80) grade = 'B'; else if (score >= 70) grade = 'C'; else if (score >= 55) grade = 'D';

    const crit = issues.filter(i => i.severity === 'critical').map(i => i.category);
    const summary = score >= 80
      ? `${domain} has strong fundamentals (${score}/100). A few fixes can push it to the top.`
      : score >= 55
        ? `${domain} scores ${score}/100 — solid basics, but ${crit[0] || 'SEO and performance'} need work.`
        : `${domain} scores ${score}/100. Critical issues${crit.length ? ` in ${[...new Set(crit)].slice(0, 2).join(' and ')}` : ''} are holding back its visibility.`;

    if (recommendations.length === 0) recommendations.push('Strong site — keep monitoring Core Web Vitals and publishing helpful content.');

    return NextResponse.json({
      url: urlString, domain, score, grade, summary,
      categories,
      metrics: { ttfbMs, htmlKB, scripts, perfSource, lcp, cls, statusCode },
      issues, recommendations,
      checks: { https: target.protocol === 'https:', hasViewport, hasSchema, hasRobots, hasSitemap, hasCanonical, hasAnalytics, h1Count, altCoverage, pageOk },
      success: true,
    }, { headers: rateLimit.headers });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Audit failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
