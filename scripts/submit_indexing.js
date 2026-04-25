/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * submit_indexing.js
 * 
 * Tells Google: "Our site has migrated from WordPress to Next.js. 
 * Please crawl and index these new pages immediately."
 * 
 * Uses the Google Indexing API (URL_UPDATED notification).
 */
const { google } = require('googleapis');
const path = require('path');

const KEY_FILE_PATH = path.join(__dirname, '..', '..', 'captcha-1747281225780-7cd3c8d65214.json');

// All pages from sitemap.ts that need to be indexed
const PAGES_TO_INDEX = [
    // Core pages
    'https://smilefotilo.com/',
    'https://smilefotilo.com/about',
    'https://smilefotilo.com/pricing',
    'https://smilefotilo.com/privacy',
    'https://smilefotilo.com/terms',

    // Services (priority - these drive revenue)
    'https://smilefotilo.com/services',
    'https://smilefotilo.com/services/web-design',
    'https://smilefotilo.com/services/seo',
    'https://smilefotilo.com/services/branding',
    'https://smilefotilo.com/services/ai-growth-os',
    'https://smilefotilo.com/services/clinic-growth-autopilot',

    // Work / Portfolio
    'https://smilefotilo.com/work',
    'https://smilefotilo.com/work/pulsekart',
    'https://smilefotilo.com/work/kapda-factory',
    'https://smilefotilo.com/work/orderflow',
    'https://smilefotilo.com/work/storybook-weddings',

    // Locations (critical for Local SEO)
    'https://smilefotilo.com/locations',
    'https://smilefotilo.com/locations/gonda',
    'https://smilefotilo.com/locations/lucknow',
    'https://smilefotilo.com/locations/greater-noida',
    'https://smilefotilo.com/locations/ayodhya',
    'https://smilefotilo.com/locations/global',

    // Blog
    'https://smilefotilo.com/blog',
    'https://smilefotilo.com/blog/seo-cost-india-2026',
    'https://smilefotilo.com/blog/geo-generative-engine-optimization-2026',
    'https://smilefotilo.com/blog/local-seo-small-business-india',
    'https://smilefotilo.com/blog/google-business-profile-guide',
    'https://smilefotilo.com/blog/on-page-seo-checklist-2026',
    'https://smilefotilo.com/blog/keyword-research-guide-india',
    'https://smilefotilo.com/blog/link-building-strategies-2026',
    'https://smilefotilo.com/blog/technical-seo-audit-guide',
    'https://smilefotilo.com/blog/google-ads-vs-seo-india',
    'https://smilefotilo.com/blog/content-marketing-strategy-2026',
    'https://smilefotilo.com/blog/search-console-indexing-fix-redesign',
    'https://smilefotilo.com/blog/google-business-profile-not-getting-calls',
    'https://smilefotilo.com/blog/website-not-getting-leads-gonda',

    // Tools
    'https://smilefotilo.com/tools',
    'https://smilefotilo.com/tools/website-audit',
    'https://smilefotilo.com/tools/seo-content',
    'https://smilefotilo.com/tools/brand-kit',
    'https://smilefotilo.com/tools/content-calendar',
    'https://smilefotilo.com/tools/document-intelligence',
    'https://smilefotilo.com/tools/website-factory',

    // Marketplace
    'https://smilefotilo.com/marketplace',
];

async function submitForIndexing() {
    const auth = new google.auth.GoogleAuth({
        keyFile: KEY_FILE_PATH,
        scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    const authClient = await auth.getClient();
    const indexing = google.indexing({ version: 'v3', auth: authClient });

    console.log(`\n==============================================`);
    console.log(`  GOOGLE INDEXING REQUEST — Site Migration`);
    console.log(`  WordPress → Next.js (Feb 2026)`);
    console.log(`  Total URLs: ${PAGES_TO_INDEX.length}`);
    console.log(`==============================================\n`);

    let success = 0;
    let failed = 0;

    for (const url of PAGES_TO_INDEX) {
        try {
            await indexing.urlNotifications.publish({
                requestBody: {
                    url: url,
                    type: 'URL_UPDATED',
                },
            });
            console.log(`  ✅ Submitted: ${url}`);
            success++;
        } catch (err) {
            console.error(`  ❌ Failed: ${url} — ${err.message}`);
            failed++;
        }

        // Small delay to avoid rate limiting
        await new Promise(r => setTimeout(r, 300));
    }

    console.log(`\n==============================================`);
    console.log(`  RESULTS:`);
    console.log(`  ✅ Success: ${success}`);
    console.log(`  ❌ Failed:  ${failed}`);
    console.log(`==============================================`);

    // Also ping the sitemap via Search Console
    console.log(`\n  📋 Pinging updated sitemap...`);
    try {
        const searchconsole = google.searchconsole({ version: 'v1', auth });
        // Force Google to re-download the sitemap
        await searchconsole.sitemaps.submit({
            siteUrl: 'sc-domain:smilefotilo.com',
            feedpath: 'https://smilefotilo.com/sitemap.xml',
        });
        console.log(`  ✅ Sitemap resubmitted: https://smilefotilo.com/sitemap.xml`);
    } catch (err) {
        console.error(`  ⚠️  Sitemap ping failed: ${err.message}`);
    }
}

submitForIndexing().catch(e => console.error('FATAL:', e.message));
