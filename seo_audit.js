/* eslint-disable @typescript-eslint/no-require-imports */
const { google } = require('googleapis');
const path = require('path');


const KEY_FILE_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(__dirname, 'google-key.json');
const SITE_URL = process.env.SITE_URL || 'sc-domain:smilefotilo.com';

async function performAudit() {
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: KEY_FILE_PATH,
            scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
        });

        const searchconsole = google.searchconsole({ version: 'v1', auth });

        console.log('--- 1. Checking Sitemaps ---');
        const sitemaps = await searchconsole.sitemaps.list({ siteUrl: SITE_URL });
        if (sitemaps.data.sitemap) {
            console.table(sitemaps.data.sitemap.map(s => ({
                Path: s.path,
                LastCheck: s.lastCheckTime,
                LastMod: s.lastDownloaded,
                Status: s.errors > 0 ? 'Errors' : 'OK'
            })));
        } else {
            console.log('No sitemaps found.');
        }

        console.log('\n--- 2. Checking Indexed Pages (Search Traffic) ---');
        const now = new Date();
        const endDate = now.toISOString().split('T')[0];
        const startDate = new Date(now.setDate(now.getDate() - 30)).toISOString().split('T')[0];

        const traffic = await searchconsole.searchanalytics.query({
            siteUrl: SITE_URL,
            requestBody: {
                startDate,
                endDate,
                dimensions: ['page'],
                rowLimit: 50,
            },
        });

        if (traffic.data.rows) {
            console.log(`Found ${traffic.data.rows.length} pages receiving search impressions/clicks (confirmed indexed).`);
            console.table(traffic.data.rows.map(row => ({
                Page: row.keys[0],
                Clicks: row.clicks,
                Impressions: row.impressions,
                Position: row.position.toFixed(1)
            })));
        } else {
            console.log('No pages found with search traffic in the last 30 days.');
        }

        console.log('\n--- 3. Checking for Errored Crawls (Last 30 Days) ---');
        // We can indirectly see this by checking performance for pages that suddenly dropped
        // or by looking at errors in sitemap (done above).
        console.log('Note: High-level error reports are summarized in the Sitemaps section.');

    } catch (error) {
        console.error('Audit failed:', error.message);
    }
}

performAudit();
