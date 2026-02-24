import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

const baseUrl = process.env.BASE_URL || 'https://smilefotilo.com';
const includeScreenshots = process.env.MCP_SCREENSHOTS === '1';

const pages = [
  '/',
  '/about',
  '/services',
  '/services/web-design',
  '/services/seo',
  '/services/branding',
  '/services/ai-growth-os',
  '/services/clinic-growth-autopilot',
  '/portfolio',
  '/pricing',
  '/blog',
  '/tools',
  '/tools/website-audit',
  '/tools/seo-content',
  '/tools/brand-kit',
  '/tools/content-calendar',
  '/marketplace',
];

const viewports = [
  { name: 'desktop', width: 1440, height: 900, isMobile: false, hasTouch: false },
  { name: 'mobile', width: 390, height: 844, isMobile: true, hasTouch: true },
];

const outDir = path.join(process.cwd(), 'audit-output');
const screenshotsDir = path.join(outDir, 'web-mcp-screenshots');

function cleanPath(pagePath) {
  if (pagePath === '/') return 'home';
  return pagePath.replace(/^\//, '').replace(/[\\/]/g, '__');
}

async function fetchMcp(pathname) {
  try {
    const response = await fetch(`${baseUrl}/api/web-mcp?path=${encodeURIComponent(pathname)}`);
    const json = await response.json();
    return { status: response.status, ok: response.ok, data: json };
  } catch (error) {
    return {
      status: 0,
      ok: false,
      data: { error: error instanceof Error ? error.message : 'MCP request failed' },
    };
  }
}

function detectAnomalies(dom, mcpOk) {
  const anomalies = [];
  if (!mcpOk) anomalies.push('mcp-missing');
  if (!dom.h1) anomalies.push('missing-h1');
  if (dom.firstHeadingTop >= 0 && dom.firstHeadingTop < 76) anomalies.push('hero-may-overlap-header');
  if (dom.overflowX > 0) anomalies.push('horizontal-overflow');
  if (dom.tinyTouchTargets > 12) anomalies.push('many-small-touch-targets');
  return anomalies;
}

async function runCheck(context, viewportName, pagePath) {
  const page = await context.newPage();
  const url = new URL(pagePath, baseUrl).toString();

  let mainStatus = 0;
  const started = Date.now();
  const failedResponses = [];

  page.on('response', (response) => {
    if (response.status() >= 400) {
      failedResponses.push({
        status: response.status(),
        resourceType: response.request().resourceType(),
        url: response.url(),
      });
    }
  });

  const mcp = await fetchMcp(pagePath);

  try {
    const mainResponse = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    mainStatus = mainResponse?.status() ?? 0;
  } catch {
    mainStatus = 0;
  }

  await page.waitForTimeout(1500);
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});

  const dom = await page.evaluate(() => {
    const h1 = document.querySelector('h1')?.textContent?.trim() || null;
    const allHeadings = Array.from(document.querySelectorAll('h1, h2, h3'))
      .map((node) => ({
        tag: node.tagName.toLowerCase(),
        text: (node.textContent || '').trim().slice(0, 120),
        top: Math.round(node.getBoundingClientRect().top),
      }))
      .filter((node) => node.text.length > 0)
      .slice(0, 40);

    const sections = Array.from(document.querySelectorAll('main section, section, article, aside'))
      .map((node) => {
        const rect = node.getBoundingClientRect();
        const heading = node.querySelector('h1, h2, h3')?.textContent?.trim() || null;
        return {
          heading: heading?.slice(0, 100) || null,
          top: Math.round(rect.top),
          height: Math.round(rect.height),
        };
      })
      .filter((section) => section.height > 50)
      .slice(0, 40);

    const doc = document.documentElement;
    const overflowX = Math.max(0, doc.scrollWidth - window.innerWidth);

    const interactive = Array.from(
      document.querySelectorAll('a, button, [role=\"button\"], input[type=\"button\"], input[type=\"submit\"]')
    ).filter((node) => {
      const rect = node.getBoundingClientRect();
      const style = window.getComputedStyle(node);
      return (
        rect.width > 0 &&
        rect.height > 0 &&
        style.display !== 'none' &&
        style.visibility !== 'hidden'
      );
    });

    const tinyTouchTargets = interactive.filter((node) => {
      const rect = node.getBoundingClientRect();
      return rect.width < 44 || rect.height < 44;
    }).length;

    const fixedElements = Array.from(document.querySelectorAll('body *')).filter((node) => {
      const style = window.getComputedStyle(node);
      return style.position === 'fixed';
    }).length;

    return {
      title: document.title,
      h1,
      firstHeadingTop: allHeadings[0]?.top ?? -1,
      headings: allHeadings,
      sections,
      overflowX,
      interactiveCount: interactive.length,
      tinyTouchTargets,
      fixedElements,
    };
  });

  const anomalies = detectAnomalies(dom, mcp.ok);
  let screenshotPath = null;

  if (includeScreenshots && anomalies.length > 0) {
    const filePath = path.join(screenshotsDir, `${viewportName}-${cleanPath(pagePath)}.png`);
    await page.screenshot({ path: filePath, fullPage: true }).catch(() => {});
    screenshotPath = filePath;
  }

  await page.close();

  return {
    page: pagePath,
    viewport: viewportName,
    url,
    loadMs: Date.now() - started,
    mainStatus,
    mcp: {
      status: mcp.status,
      ok: mcp.ok,
      routeTitle: mcp.data?.route?.title || null,
      sectionCount: mcp.data?.route?.sections?.length || 0,
      error: mcp.data?.error || null,
    },
    dom,
    anomalies,
    failedResponses,
    screenshotPath,
  };
}

async function main() {
  await fs.mkdir(outDir, { recursive: true });
  await fs.mkdir(screenshotsDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const viewport of viewports) {
    const context = await browser.newContext(viewport);
    for (const pagePath of pages) {
      const result = await runCheck(context, viewport.name, pagePath);
      results.push(result);
    }
    await context.close();
  }

  await browser.close();

  const summary = {
    totalChecks: results.length,
    non200Pages: results.filter((result) => result.mainStatus !== 200).length,
    checksWithNetworkFailures: results.filter((result) => result.failedResponses.length > 0).length,
    checksMissingMcpRoute: results.filter((result) => !result.mcp.ok).length,
    checksWithAnomalies: results.filter((result) => result.anomalies.length > 0).length,
    checksWithOverflowX: results.filter((result) => result.dom.overflowX > 0).length,
    checksWithManyTinyTargets: results.filter((result) => result.dom.tinyTouchTargets > 12).length,
    outPath: path.join(outDir, 'web-mcp-audit.json'),
  };

  await fs.writeFile(path.join(outDir, 'web-mcp-audit.json'), JSON.stringify({ summary, results }, null, 2));
  await fs.writeFile(path.join(outDir, 'web-mcp-summary.json'), JSON.stringify(summary, null, 2));

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

