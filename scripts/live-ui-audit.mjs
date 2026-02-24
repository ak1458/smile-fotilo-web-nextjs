import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

const baseUrl = 'https://smilefotilo.com';
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

const auditDir = path.join(process.cwd(), 'audit-output');
const screenshotDir = path.join(auditDir, 'screenshots');

function cleanPath(p) {
  if (p === '/') return 'home';
  return p.replace(/^\//, '').replace(/[\\/]/g, '__');
}

async function ensureDirs() {
  await fs.mkdir(auditDir, { recursive: true });
  await fs.mkdir(screenshotDir, { recursive: true });
}

async function runAxeIfPossible(page) {
  try {
    await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.9.0/axe.min.js' });
    const result = await page.evaluate(async () => {
      // eslint-disable-next-line no-undef
      const axeResult = await axe.run(document, {
        runOnly: {
          type: 'rule',
          values: ['color-contrast', 'image-alt', 'button-name', 'link-name'],
        },
      });
      return {
        violations: axeResult.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          help: v.help,
          nodes: v.nodes.length,
        })),
      };
    });
    return result;
  } catch {
    return { violations: [] };
  }
}

async function analyzePage(page, pagePath, viewportName) {
  const consoleMessages = [];
  const pageErrors = [];
  const failedResponses = [];

  page.on('console', (msg) => {
    const type = msg.type();
    if (type === 'error' || type === 'warning') {
      consoleMessages.push({ type, text: msg.text().slice(0, 500) });
    }
  });

  page.on('pageerror', (err) => {
    pageErrors.push((err?.message || String(err)).slice(0, 500));
  });

  page.on('response', (resp) => {
    const status = resp.status();
    if (status >= 400) {
      failedResponses.push({
        status,
        resourceType: resp.request().resourceType(),
        url: resp.url().slice(0, 220),
      });
    }
  });

  const url = new URL(pagePath, baseUrl).toString();
  const start = Date.now();
  let mainStatus = 0;

  try {
    const mainResp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    mainStatus = mainResp?.status() ?? 0;
  } catch {
    mainStatus = 0;
  }

  await page.waitForTimeout(2000);
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});

  const domStats = await page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    const overflowX = Math.max(0, doc.scrollWidth - window.innerWidth);

    const images = Array.from(document.images);
    const brokenImages = images.filter((img) => img.complete && img.naturalWidth === 0).length;
    const missingAlt = images.filter((img) => !img.hasAttribute('alt')).length;

    const textNodes = Array.from(document.querySelectorAll('body *')).filter((el) => {
      const text = (el.textContent || '').trim();
      if (!text) return false;
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') return false;
      return true;
    });

    let clippedTextCount = 0;
    for (const el of textNodes.slice(0, 2500)) {
      const style = window.getComputedStyle(el);
      const hasClipping =
        style.overflow === 'hidden' ||
        style.overflowX === 'hidden' ||
        style.overflowY === 'hidden' ||
        style.textOverflow === 'ellipsis' ||
        Number(style.webkitLineClamp || 0) > 0;
      if (!hasClipping) continue;
      if (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1) {
        clippedTextCount += 1;
      }
    }

    const interactive = Array.from(
      document.querySelectorAll('a, button, [role="button"], input[type="button"], input[type="submit"]')
    ).filter((el) => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return (
        rect.width > 0 &&
        rect.height > 0 &&
        rect.bottom > 0 &&
        rect.top < window.innerHeight &&
        style.display !== 'none' &&
        style.visibility !== 'hidden'
      );
    });

    const tinyTouchTargets = interactive.filter((el) => {
      const rect = el.getBoundingClientRect();
      return rect.width < 44 || rect.height < 44;
    }).length;

    const smallTextCount = textNodes.filter((el) => {
      const fontSize = parseFloat(window.getComputedStyle(el).fontSize || '16');
      return fontSize < 12;
    }).length;

    const title = document.title;
    const h1 = document.querySelector('h1')?.textContent?.trim() || null;

    return {
      title,
      h1,
      overflowX,
      brokenImages,
      missingAlt,
      clippedTextCount,
      tinyTouchTargets,
      smallTextCount,
      totalImages: images.length,
      totalInteractive: interactive.length,
      bodyHeight: body?.scrollHeight || 0,
    };
  });

  const interactive = page.locator('a, button, [role="button"], input[type="button"], input[type="submit"]');
  const interactiveCount = await interactive.count();
  let hoverChecked = 0;
  let hoverChanged = 0;

  for (let i = 0; i < Math.min(interactiveCount, 14); i += 1) {
    const el = interactive.nth(i);
    const visible = await el.isVisible().catch(() => false);
    if (!visible) continue;

    await el.scrollIntoViewIfNeeded().catch(() => {});

    const before = await el.evaluate((node) => {
      const s = window.getComputedStyle(node);
      return {
        color: s.color,
        backgroundColor: s.backgroundColor,
        transform: s.transform,
        boxShadow: s.boxShadow,
        opacity: s.opacity,
        textDecoration: s.textDecorationLine,
      };
    }).catch(() => null);

    if (!before) continue;

    await el.hover({ force: true }).catch(() => {});
    await page.waitForTimeout(70);

    const after = await el.evaluate((node) => {
      const s = window.getComputedStyle(node);
      return {
        color: s.color,
        backgroundColor: s.backgroundColor,
        transform: s.transform,
        boxShadow: s.boxShadow,
        opacity: s.opacity,
        textDecoration: s.textDecorationLine,
      };
    }).catch(() => null);

    hoverChecked += 1;
    if (after && JSON.stringify(before) !== JSON.stringify(after)) {
      hoverChanged += 1;
    }
  }

  const axeNeeded =
    viewportName === 'desktop' &&
    ['/', '/pricing', '/tools', '/services/web-design', '/blog'].includes(pagePath);
  const axe = axeNeeded ? await runAxeIfPossible(page) : { violations: [] };

  const screenshotPath = path.join(screenshotDir, `${viewportName}-${cleanPath(pagePath)}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => {});

  return {
    page: pagePath,
    viewport: viewportName,
    url,
    mainStatus,
    loadMs: Date.now() - start,
    dom: domStats,
    hover: {
      checked: hoverChecked,
      changed: hoverChanged,
      unchanged: Math.max(hoverChecked - hoverChanged, 0),
    },
    consoleMessages,
    pageErrors,
    failedResponses,
    axe,
    screenshotPath,
  };
}

async function main() {
  await ensureDirs();

  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      isMobile: viewport.isMobile,
      hasTouch: viewport.hasTouch,
      deviceScaleFactor: viewport.isMobile ? 2 : 1,
    });

    for (const p of pages) {
      const page = await context.newPage();
      const result = await analyzePage(page, p, viewport.name);
      results.push(result);
      await page.close();
    }

    await context.close();
  }

  await browser.close();

  const outPath = path.join(auditDir, 'live-ui-audit.json');
  await fs.writeFile(outPath, JSON.stringify(results, null, 2), 'utf8');

  const summary = {
    totalChecks: results.length,
    non200Pages: results.filter((r) => r.mainStatus !== 200).length,
    pagesWithOverflowX: results.filter((r) => r.dom.overflowX > 0).length,
    pagesWithBrokenImages: results.filter((r) => r.dom.brokenImages > 0).length,
    pagesWithClippedText: results.filter((r) => r.dom.clippedTextCount > 0).length,
    pagesWithConsoleIssues: results.filter((r) => r.consoleMessages.length > 0 || r.pageErrors.length > 0).length,
    pagesWithFailedResponses: results.filter((r) => r.failedResponses.length > 0).length,
    pagesWithTinyTouchTargets: results.filter((r) => r.dom.tinyTouchTargets > 0).length,
    axeViolations: results.reduce((acc, r) => acc + (r.axe?.violations?.length || 0), 0),
    outPath,
  };

  const summaryPath = path.join(auditDir, 'live-ui-summary.json');
  await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2), 'utf8');

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
