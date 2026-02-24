import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

type Severity = 'info' | 'warning' | 'critical';

type SearchConsoleIssue = {
  severity: Severity;
  title: string;
  detail: string;
  sample?: string[];
};

type FixResult = {
  action: string;
  status: 'applied' | 'skipped' | 'failed';
  detail: string;
};

type SearchAnalyticsRow = {
  keys?: string[];
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
};

const WEBMASTER_SCOPE_RW = 'https://www.googleapis.com/auth/webmasters';

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function parseIsoDate(raw?: string | null): Date | null {
  if (!raw) return null;
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function buildCriticalUrls(origin: string) {
  const raw = process.env.SEARCH_CONSOLE_CRITICAL_URLS?.trim();
  if (!raw) {
    return [
      `${origin}/`,
      `${origin}/pricing`,
      `${origin}/services/seo`,
      `${origin}/tools/website-audit`,
    ];
  }

  return raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 10);
}

function getGoogleAuth() {
  const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON?.trim();
  if (credentialsJson) {
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(credentialsJson) as Record<string, unknown>;
    } catch {
      throw new Error('GOOGLE_APPLICATION_CREDENTIALS_JSON is not valid JSON.');
    }

    if (typeof parsed.private_key === 'string') {
      parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
    }

    return new google.auth.GoogleAuth({
      credentials: parsed,
      scopes: [WEBMASTER_SCOPE_RW],
    });
  }

  const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
  if (keyFile) {
    return new google.auth.GoogleAuth({
      keyFile,
      scopes: [WEBMASTER_SCOPE_RW],
    });
  }

  throw new Error(
    'Search Console credentials missing. Set GOOGLE_APPLICATION_CREDENTIALS_JSON (recommended on Vercel) or GOOGLE_APPLICATION_CREDENTIALS.'
  );
}

async function submitSitemap(
  searchconsole: ReturnType<typeof google.searchconsole>,
  siteUrl: string,
  sitemapUrl: string
): Promise<FixResult> {
  try {
    await searchconsole.sitemaps.submit({
      siteUrl,
      feedpath: sitemapUrl,
    });
    return {
      action: 'submit_sitemap',
      status: 'applied',
      detail: `Submitted sitemap ${sitemapUrl}`,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      action: 'submit_sitemap',
      status: 'failed',
      detail: `Failed to submit sitemap: ${message}`,
    };
  }
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET?.trim();

  if (!cronSecret) {
    return NextResponse.json({ error: 'CRON_SECRET is not configured', working: false }, { status: 503 });
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized', working: false }, { status: 401 });
  }

  const issues: SearchConsoleIssue[] = [];
  const fixesApplied: FixResult[] = [];

  const siteUrl = process.env.SEARCH_CONSOLE_SITE_URL?.trim() || `sc-domain:${request.nextUrl.hostname.replace(/^www\./, '')}`;
  const sitemapUrl = process.env.SEARCH_CONSOLE_SITEMAP_URL?.trim() || `${request.nextUrl.origin}/sitemap.xml`;
  const autoSubmitSitemap = process.env.SEARCH_CONSOLE_AUTO_SUBMIT_SITEMAP !== 'false';
  const criticalUrls = buildCriticalUrls(request.nextUrl.origin);

  try {
    const auth = getGoogleAuth();
    const searchconsole = google.searchconsole({ version: 'v1', auth });

    const endDate = formatDate(new Date());
    const startDate = formatDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

    const [queriesResult, pagesResult, sitemapResult] = await Promise.allSettled([
      searchconsole.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate,
          endDate,
          dimensions: ['query'],
          rowLimit: 250,
        },
      }),
      searchconsole.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate,
          endDate,
          dimensions: ['page'],
          rowLimit: 250,
        },
      }),
      searchconsole.sitemaps.list({
        siteUrl,
      }),
    ]);

    let queryRows: SearchAnalyticsRow[] = [];
    if (queriesResult.status === 'fulfilled') {
      queryRows = (queriesResult.value.data.rows ?? []) as SearchAnalyticsRow[];
      const lowCtrQueries = queryRows
        .filter((row) => (row.impressions ?? 0) >= 30 && (row.ctr ?? 0) < 0.01)
        .sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0));

      if (lowCtrQueries.length > 0) {
        issues.push({
          severity: 'warning',
          title: 'Low CTR queries detected',
          detail: `${lowCtrQueries.length} queries have impressions but weak click-through rate (<1%).`,
          sample: lowCtrQueries.slice(0, 5).map((row) => {
            const keyword = row.keys?.[0] ?? '(unknown query)';
            const ctr = ((row.ctr ?? 0) * 100).toFixed(2);
            return `${keyword} | imp:${row.impressions ?? 0} | ctr:${ctr}% | pos:${(row.position ?? 0).toFixed(1)}`;
          }),
        });
      }
    } else {
      issues.push({
        severity: 'critical',
        title: 'Search analytics query fetch failed',
        detail: queriesResult.reason instanceof Error ? queriesResult.reason.message : 'Unknown error',
      });
    }

    let pageRows: SearchAnalyticsRow[] = [];
    if (pagesResult.status === 'fulfilled') {
      pageRows = (pagesResult.value.data.rows ?? []) as SearchAnalyticsRow[];
      const weakPages = pageRows
        .filter((row) => (row.impressions ?? 0) >= 20 && (row.position ?? 0) > 20)
        .sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0));

      if (weakPages.length > 0) {
        issues.push({
          severity: 'warning',
          title: 'Low-ranking pages detected',
          detail: `${weakPages.length} pages have impressions but average position is below page 2.`,
          sample: weakPages.slice(0, 5).map((row) => {
            const page = row.keys?.[0] ?? '(unknown page)';
            const ctr = ((row.ctr ?? 0) * 100).toFixed(2);
            return `${page} | imp:${row.impressions ?? 0} | ctr:${ctr}% | pos:${(row.position ?? 0).toFixed(1)}`;
          }),
        });
      }
    } else {
      issues.push({
        severity: 'critical',
        title: 'Search analytics page fetch failed',
        detail: pagesResult.reason instanceof Error ? pagesResult.reason.message : 'Unknown error',
      });
    }

    if (sitemapResult.status === 'fulfilled') {
      const sitemapEntries = sitemapResult.value.data.sitemap ?? [];
      const targetSitemap =
        sitemapEntries.find((item) => item.path === sitemapUrl) ||
        sitemapEntries.find((item) => item.path?.endsWith('/sitemap.xml'));

      if (!targetSitemap) {
        issues.push({
          severity: 'warning',
          title: 'Sitemap not found in Search Console',
          detail: `Expected sitemap ${sitemapUrl} was not listed in Search Console.`,
        });
        if (autoSubmitSitemap) {
          fixesApplied.push(await submitSitemap(searchconsole, siteUrl, sitemapUrl));
        }
      } else {
        const errors = Number(targetSitemap.errors ?? 0) || 0;
        const warnings = Number(targetSitemap.warnings ?? 0) || 0;
        const lastDownloaded = parseIsoDate(targetSitemap.lastDownloaded);
        const isStale = !lastDownloaded || Date.now() - lastDownloaded.getTime() > 7 * 24 * 60 * 60 * 1000;

        if (errors > 0 || warnings > 0) {
          issues.push({
            severity: errors > 0 ? 'critical' : 'warning',
            title: 'Sitemap has errors/warnings',
            detail: `Sitemap reported errors:${errors}, warnings:${warnings}.`,
          });
          if (autoSubmitSitemap) {
            fixesApplied.push(await submitSitemap(searchconsole, siteUrl, sitemapUrl));
          }
        } else if (isStale) {
          issues.push({
            severity: 'warning',
            title: 'Sitemap is stale',
            detail: 'Sitemap has not been downloaded recently by Google.',
          });
          if (autoSubmitSitemap) {
            fixesApplied.push(await submitSitemap(searchconsole, siteUrl, sitemapUrl));
          }
        } else {
          fixesApplied.push({
            action: 'sitemap_status',
            status: 'skipped',
            detail: 'Sitemap is healthy and fresh.',
          });
        }
      }
    } else {
      issues.push({
        severity: 'critical',
        title: 'Sitemap list fetch failed',
        detail: sitemapResult.reason instanceof Error ? sitemapResult.reason.message : 'Unknown error',
      });
    }

    for (const inspectionUrl of criticalUrls.slice(0, 5)) {
      try {
        const inspectResult = await searchconsole.urlInspection.index.inspect({
          requestBody: {
            inspectionUrl,
            siteUrl,
          },
        });
        const coverageState =
          inspectResult.data.inspectionResult?.indexStatusResult?.coverageState ?? 'Unknown coverage state';

        if (!coverageState.toLowerCase().includes('indexed')) {
          issues.push({
            severity: 'warning',
            title: 'Critical URL not fully indexed',
            detail: `${inspectionUrl} => ${coverageState}`,
          });
        }
      } catch (error: unknown) {
        issues.push({
          severity: 'info',
          title: 'URL inspection skipped',
          detail: `${inspectionUrl}: ${error instanceof Error ? error.message : 'Inspection not available'}`,
        });
      }
    }

    const criticalCount = issues.filter((issue) => issue.severity === 'critical').length;
    const working = criticalCount === 0;

    return NextResponse.json(
      {
        working,
        siteUrl,
        sitemapUrl,
        timeWindow: { startDate, endDate },
        metrics: {
          queryRowsAnalyzed: queryRows.length,
          pageRowsAnalyzed: pageRows.length,
          issuesFound: issues.length,
          criticalIssues: criticalCount,
          fixesAttempted: fixesApplied.length,
        },
        issues,
        fixesApplied,
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json(
      {
        working: false,
        error: message,
        issues,
        fixesApplied,
      },
      { status: 500 }
    );
  }
}
