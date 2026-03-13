import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
const outDir = path.join(process.cwd(), 'audit-output');

const pagesToTest = [
    { path: '/', name: 'Homepage' },
    { path: '/services/web-design', name: 'Web Design Service' },
    { path: '/services/seo', name: 'SEO Service' },
    { path: '/blog', name: 'Blog Hub' }
];

const results = [];

function logResult(category, target, status, details) {
    const result = { category, target, status, details };
    results.push(result);
    console.log(`[${status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️'}] ${category}: ${target} - ${details}`);
}

async function analyzeTechnicalSEO(page, routeName) {
    console.log(`\n--- Technical SEO Audit: ${routeName} ---`);

    const seoData = await page.evaluate(() => {
        const metaTags = Array.from(document.querySelectorAll('meta')).reduce((acc, meta) => {
            const name = meta.getAttribute('name') || meta.getAttribute('property');
            if (name) acc[name] = meta.getAttribute('content');
            return acc;
        }, {});

        const h1s = Array.from(document.querySelectorAll('h1')).map(h => h.innerText.trim());
        const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
        const hasJsonLd = document.querySelectorAll('script[type="application/ld+json"]').length > 0;

        return {
            title: document.title,
            description: metaTags['description'] || '',
            h1Count: h1s.length,
            h1Text: h1s[0] || '',
            canonical: canonical,
            hasJsonLd: hasJsonLd,
            robots: metaTags['robots'] || 'index, follow'
        };
    });

    // H1 Checks
    if (seoData.h1Count === 1) {
        logResult('Tech_SEO', `${routeName} H1`, 'PASS', `Exact 1 H1 found: "${seoData.h1Text.substring(0, 30)}..."`);
    } else {
        logResult('Tech_SEO', `${routeName} H1`, 'FAIL', `Found ${seoData.h1Count} H1 tags. Should be exactly 1.`);
    }

    // Title Checks
    if (seoData.title.length > 30 && seoData.title.length < 65) {
        logResult('Tech_SEO', `${routeName} Title`, 'PASS', `Good length (${seoData.title.length} chars).`);
    } else {
        logResult('Tech_SEO', `${routeName} Title`, 'WARN', `Suboptimal length (${seoData.title.length} chars). Target 30-65.`);
    }

    // Schema Checks
    if (seoData.hasJsonLd) {
        logResult('Tech_SEO', `${routeName} Schema`, 'PASS', 'JSON-LD Structured Data detected.');
    } else {
        logResult('Tech_SEO', `${routeName} Schema`, 'WARN', 'No JSON-LD structured data detected.');
    }

    // Canonical Checks 
    if (seoData.canonical) {
        logResult('Tech_SEO', `${routeName} Canonical`, 'PASS', `Canonical set to: ${seoData.canonical}`);
    } else {
        logResult('Tech_SEO', `${routeName} Canonical`, 'WARN', 'No Canonical URL defined.');
    }
}

async function analyzeGSEOSignals(page, routeName) {
    console.log(`\n--- GSEO (Generative SEO) & E-E-A-T Audit: ${routeName} ---`);

    const gseoData = await page.evaluate(() => {
        const textContent = document.body.innerText.toLowerCase();

        // GSEO signals: Experience, Expertise, Authoritativeness, Trustworthiness
        // And markers of "Information Gain" / non-commoditized content

        const hasFirstPerson = /\b(i |we |my |our )\b/.test(textContent);
        const hasDataStats = /\b([0-9]+%|[0-9]+ (clients|businesses|leads|years))\b/.test(textContent);
        const hasEntities = /\b(seo|web design|branding|marketing|crm|ai|lucknow)\b/.test(textContent);
        const hasAIDisclosure = textContent.includes('ai-assisted') || textContent.includes('human-reviewed');

        // Check for conversational/semantic Q&A structures (good for LLMs)
        const qnaMatches = Array.from(document.querySelectorAll('h2, h3'))
            .filter(h => h.innerText.includes('?')).length;

        return {
            hasFirstPerson,
            hasDataStats,
            hasEntities,
            hasAIDisclosure,
            qnaCount: qnaMatches,
            wordCount: textContent.split(/\s+/).length
        };
    });

    // Evaluate Semantic Density & Entities (LLMs love entities)
    if (gseoData.hasEntities && gseoData.wordCount > 300) {
        logResult('GSEO_Content', `${routeName} Entropy`, 'PASS', `High semantic density (${gseoData.wordCount} words) with strong industry entities.`);
    } else {
        logResult('GSEO_Content', `${routeName} Entropy`, 'WARN', 'Low semantic density or missing core entities.');
    }

    // Evaluate Experience (E-E-A-T)
    if (gseoData.hasFirstPerson && gseoData.hasDataStats) {
        logResult('GSEO_EEAT', `${routeName} Experience`, 'PASS', 'Detected First-Person POV and original data/stats (Information Gain).');
    } else {
        logResult('GSEO_EEAT', `${routeName} Experience`, 'WARN', 'Missing First-Person markers or original data points (Risk of commoditized content flag by LLMs).');
    }

    // Atomic Answers (Targeting AI Overviews/SGE)
    if (gseoData.qnaCount > 0) {
        logResult('GSEO_Structure', `${routeName} Atomic`, 'PASS', `Found ${gseoData.qnaCount} Q&A heading pairs (Optimized for Google AI Overviews).`);
    } else {
        logResult('GSEO_Structure', `${routeName} Atomic`, 'WARN', 'No explicit Q&A structures found. Adding exact-match question headings improves AI-Overview chances.');
    }

    // AI Content Disclosure Policy
    if (gseoData.hasAIDisclosure) {
        logResult('GSEO_Policy', `${routeName} Disclosure`, 'PASS', 'Adheres to 2026 Google AI Content guidelines (Disclosure found).');
    } else {
        logResult('GSEO_Policy', `${routeName} Disclosure`, 'FAIL', 'Missing AI Content Disclosure. Risk of algorithmic penalty.');
    }
}

async function runSeoPentest() {
    console.log('==================================================');
    console.log('🤖 STARTING COMPREHENSIVE SEO & GSEO AUDIT');
    console.log('==================================================');

    await fs.mkdir(outDir, { recursive: true });
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();

    for (const pageInfo of pagesToTest) {
        const page = await context.newPage();
        const url = `${baseUrl}${pageInfo.path}`;

        console.log(`\nNavigating to ${url}...`);
        await page.goto(url, { waitUntil: 'networkidle' });

        await analyzeTechnicalSEO(page, pageInfo.name);
        await analyzeGSEOSignals(page, pageInfo.name);

        await page.close();
    }

    // Global Site Checks (Robots & Sitemap)
    console.log(`\n--- Global Coverage Audits ---`);
    try {
        const robotsRes = await fetch(`${baseUrl}/robots.txt`);
        if (robotsRes.ok && (await robotsRes.text()).includes('User-agent')) {
            logResult('Tech_SEO', `robots.txt`, 'PASS', 'Valid robots.txt found.');
        } else {
            logResult('Tech_SEO', `robots.txt`, 'FAIL', 'Missing or invalid robots.txt.');
        }

        const sitemapRes = await fetch(`${baseUrl}/sitemap.xml`);
        if (sitemapRes.ok && (await sitemapRes.text()).includes('<urlset')) {
            logResult('Tech_SEO', `sitemap.xml`, 'PASS', 'Valid XML Sitemap found.');
        } else {
            logResult('Tech_SEO', `sitemap.xml`, 'WARN', 'Missing XML Sitemap.');
        }
    } catch (e) {
        logResult('Tech_SEO', `Core Files`, 'FAIL', `Error fetching global files: ${e.message}`);
    }

    await browser.close();

    const reportPath = path.join(outDir, 'gseo-audit-report.json');
    await fs.writeFile(reportPath, JSON.stringify(results, null, 2));

    console.log('\n=======================================');
    console.log('📊 AUDIT COMPLETE');
    console.log('=======================================');
    const passes = results.filter(r => r.status === 'PASS').length;
    const warns = results.filter(r => r.status === 'WARN').length;
    const fails = results.filter(r => r.status === 'FAIL').length;

    console.log(`✅ SEO/GSEO Passed Checkpoints: ${passes}`);
    console.log(`⚠️ Optimization Opportunities: ${warns}`);
    console.log(`❌ Critical Failures: ${fails}`);
    console.log(`📄 Detailed JSON Report saved: ${reportPath}`);
}

runSeoPentest().catch(console.error);
