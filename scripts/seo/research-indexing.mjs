import { google } from 'googleapis';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KEY_FILE_PATH = path.join(__dirname, '..', '..', '..', 'captcha-1747281225780-7cd3c8d65214.json');
const SITE_URL = 'sc-domain:smilefotilo.com';

async function researchIndexing() {
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: KEY_FILE_PATH,
            scopes: [
                'https://www.googleapis.com/auth/webmasters.readonly',
                'https://www.googleapis.com/auth/webmasters'
            ],
        });

        const searchconsole = google.searchconsole({ version: 'v1', auth });

        console.log('--- FETCHING INDEXING STATUS ---');

        // Note: The GSC API searchanalytics doesn't give "Why not indexed" directly.
        // We usually have to check specific URLs or use the URL Inspection API for samples.
        // However, we can look at the Search Analytics data to see what IS being indexed and appearing.

        const res = await searchconsole.searchanalytics.query({
            siteUrl: SITE_URL,
            requestBody: {
                startDate: '2026-01-01',
                endDate: new Date().toISOString().split('T')[0],
                dimensions: ['page'],
                rowLimit: 100,
            },
        });

        const indexedPages = res.data.rows || [];
        console.log(`\nPages with Search Impressions: ${indexedPages.length}`);
        indexedPages.slice(0, 10).forEach(p => console.log(`- ${p.keys[0]} (${p.impressions} impressions)`));

        // Let's check for 404s reported in Search Console by looking for pages with 0 clicks but high errors? 
        // Actually, GSC API doesn't have a "get all 404s" endpoint like the UI has in the "Indexing" report.
        // But we can check sitemaps status.

        console.log('\n--- SITEMAP STATUS ---');
        const sitemaps = await searchconsole.sitemaps.list({ siteUrl: SITE_URL });
        if (sitemaps.data.sitemap) {
            for (const s of sitemaps.data.sitemap) {
                console.log(`Sitemap: ${s.path}`);
                console.log(`- Type: ${s.type}`);
                console.log(`- Is Pending: ${s.isPending}`);
                console.log(`- Warnings: ${s.warnings}`);
                console.log(`- Errors: ${s.errors}`);
                console.log(`- Last Downloaded: ${s.lastDownloaded}`);
                console.log('---');
            }
        }

        // To get details on "Not Indexed", we'll have to inspect some representative URLs from the sitemap.
        // Let's try to inspect the homepage and a few others.

        const urlsToInspect = [
            'https://smilefotilo.com/',
            'https://smilefotilo.com/about',
            'https://smilefotilo.com/services/seo',
            'https://smilefotilo.com/blog'
        ];

        console.log('\n--- URL INSPECTION SAMPLES ---');
        for (const url of urlsToInspect) {
            try {
                const inspect = await searchconsole.urlInspection.index.inspect({
                    requestBody: {
                        inspectionUrl: url,
                        siteUrl: SITE_URL,
                        languageCode: 'en-US'
                    }
                });

                const result = inspect.data.inspectionResult;
                console.log(`URL: ${url}`);
                console.log(`- Index Status: ${result.indexStatusResult.verdict}`);
                console.log(`- Coverage State: ${result.indexStatusResult.coverageState}`);
                console.log(`- Robots.txt: ${result.indexStatusResult.robotsTxtState}`);
                console.log(`- Canonical: ${result.indexStatusResult.userCanonical || 'None'}`);
                console.log('---');
            } catch (err) {
                console.log(`URL: ${url} - Inspection failed: ${err.message}`);
            }
        }

    } catch (error) {
        console.error('Research failed:', error.message);
    }
}

researchIndexing();
