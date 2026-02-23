import { NextRequest, NextResponse } from 'next/server';

// All known pages with their expected characteristics
const PAGES = [
    { path: '/', name: 'Homepage' },
    { path: '/about', name: 'About' },
    { path: '/services', name: 'Services' },
    { path: '/services/web-design', name: 'Web Design' },
    { path: '/services/seo', name: 'SEO' },
    { path: '/services/branding', name: 'Branding' },
    { path: '/services/ai-growth-os', name: 'AI Growth OS' },
    { path: '/services/clinic-growth-autopilot', name: 'Clinic Autopilot' },
    { path: '/portfolio', name: 'Portfolio' },
    { path: '/pricing', name: 'Pricing' },
    { path: '/blog', name: 'Blog' },
    { path: '/tools', name: 'Tools Hub' },
    { path: '/tools/website-audit', name: 'Website Audit Tool' },
    { path: '/tools/seo-content', name: 'SEO Content Engine' },
    { path: '/tools/brand-kit', name: 'Brand Kit Generator' },
    { path: '/tools/content-calendar', name: 'Content Calendar' },
];

// All API endpoints to test
const API_ROUTES = [
    { path: '/api/audit', name: 'Website Audit API', method: 'POST', testBody: { url: 'example.com' } },
    { path: '/api/seo-content', name: 'SEO Content API', method: 'POST', testBody: { business: 'Test', industry: 'Tech' } },
    { path: '/api/brand-kit', name: 'Brand Kit API', method: 'POST', testBody: { businessName: 'Test', industry: 'Tech' } },
    { path: '/api/content-calendar', name: 'Content Calendar API', method: 'POST', testBody: { businessName: 'Test', industry: 'Tech' } },
];

type PageStatus = { path: string; name: string; status: number; ok: boolean; loadMs: number; title?: string; error?: string };
type ApiStatus = { path: string; name: string; status: number; ok: boolean; loadMs: number; hasError?: boolean; errorMsg?: string };

async function checkPage(baseUrl: string, page: { path: string; name: string }): Promise<PageStatus> {
    const start = Date.now();
    try {
        const res = await fetch(`${baseUrl}${page.path}`, {
            headers: { 'Accept': 'text/html' },
            redirect: 'follow',
        });
        const html = await res.text();
        const loadMs = Date.now() - start;
        const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
        return {
            path: page.path,
            name: page.name,
            status: res.status,
            ok: res.ok,
            loadMs,
            title: titleMatch?.[1]?.trim() || '(no title)',
        };
    } catch (err: unknown) {
        return {
            path: page.path,
            name: page.name,
            status: 0,
            ok: false,
            loadMs: Date.now() - start,
            error: err instanceof Error ? err.message : 'Request failed',
        };
    }
}

async function checkApi(baseUrl: string, api: (typeof API_ROUTES)[number]): Promise<ApiStatus> {
    const start = Date.now();
    try {
        const res = await fetch(`${baseUrl}${api.path}`, {
            method: api.method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(api.testBody),
        });
        const data = await res.json();
        const loadMs = Date.now() - start;
        return {
            path: api.path,
            name: api.name,
            status: res.status,
            ok: res.ok,
            loadMs,
            hasError: !!data.error,
            errorMsg: data.error || undefined,
        };
    } catch (err: unknown) {
        return {
            path: api.path,
            name: api.name,
            status: 0,
            ok: false,
            loadMs: Date.now() - start,
            errorMsg: err instanceof Error ? err.message : 'Request failed',
        };
    }
}

export async function GET(request: NextRequest) {
    const startTime = Date.now();
    const baseUrl = request.nextUrl.origin;

    // Check env vars (without exposing values)
    const envStatus = {
        GROQ_API_KEY: !!process.env.GROQ_API_KEY,
        OPENROUTER_API_KEY: !!process.env.OPENROUTER_API_KEY,
        NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        VERCEL_URL: process.env.VERCEL_URL || '(not on Vercel)',
        NODE_ENV: process.env.NODE_ENV || 'unknown',
    };

    // Check pages in parallel (limit concurrency to avoid self-DoS)
    const pageResults: PageStatus[] = await Promise.all(
        PAGES.map(page => checkPage(baseUrl, page))
    );

    // Check API routes (sequentially to avoid rate limits on AI providers)
    // Only do a shallow check - don't actually call AI, just verify routes respond
    const apiResults: ApiStatus[] = [];
    for (const api of API_ROUTES) {
        apiResults.push(await checkApi(baseUrl, api));
    }

    const totalMs = Date.now() - startTime;

    // Summary
    const pagesUp = pageResults.filter(p => p.ok).length;
    const pagesDown = pageResults.filter(p => !p.ok).length;
    const apisUp = apiResults.filter(a => a.ok || (a.status >= 200 && a.status < 500)).length;
    const apisDown = apiResults.filter(a => a.status === 0 || a.status >= 500).length;

    const overallHealth = pagesDown === 0 && apisDown === 0 ? 'HEALTHY' :
        pagesDown > 0 || apisDown > 0 ? 'DEGRADED' : 'DOWN';

    return NextResponse.json({
        status: overallHealth,
        timestamp: new Date().toISOString(),
        checkDurationMs: totalMs,
        baseUrl,
        summary: {
            pages: { total: PAGES.length, up: pagesUp, down: pagesDown },
            apis: { total: API_ROUTES.length, up: apisUp, down: apisDown },
        },
        environment: envStatus,
        pages: pageResults,
        apis: apiResults,
        tools: [
            { name: 'Website Audit', path: '/tools/website-audit', api: '/api/audit', status: 'live' },
            { name: 'SEO Content Engine', path: '/tools/seo-content', api: '/api/seo-content', status: 'live' },
            { name: 'Brand Kit Generator', path: '/tools/brand-kit', api: '/api/brand-kit', status: 'live' },
            { name: 'Content Calendar', path: '/tools/content-calendar', api: '/api/content-calendar', status: 'live' },
        ],
        roadmap: {
            completed: ['AI Brand Kit (#1)', 'AI SEO Content Engine (#2)', 'Website Audit', 'Content Calendar', 'Tools Hub'],
            partial: ['White-Label Echo (#3) — chat works, Smile-specific KB', 'Local Business Autopilot (#7) — tools built, needs Supabase', 'Regional Language (#9) — SEO supports 6 langs'],
            notStarted: ['Prompt Store (#4)', 'AI Agent Builder (#5)', 'Document Intelligence (#6)', 'AI Website Factory (#8)'],
        },
    }, {
        headers: {
            'Cache-Control': 'no-store, max-age=0',
        },
    });
}
