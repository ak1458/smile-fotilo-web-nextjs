/* eslint-disable @typescript-eslint/no-require-imports */
const { google } = require('googleapis');
const path = require('path');

const KEY_FILE_PATH = path.join(__dirname, '..', 'captcha-1747281225780-7cd3c8d65214.json');
const SITE_URL = 'sc-domain:smilefotilo.com';

async function checkIndex() {
    const auth = new google.auth.GoogleAuth({
        keyFile: KEY_FILE_PATH,
        scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    });
    const searchconsole = google.searchconsole({ version: 'v1', auth });

    // Date range: last 90 days
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 90);

    const startDate = start.toISOString().split('T')[0];
    const endDate = end.toISOString().split('T')[0];

    console.log(`\n========================================`);
    console.log(`SEARCH CONSOLE INDEX REPORT`);
    console.log(`Date Range: ${startDate} to ${endDate}`);
    console.log(`========================================\n`);

    // Get all indexed pages with impressions
    const res = await searchconsole.searchanalytics.query({
        siteUrl: SITE_URL,
        requestBody: {
            startDate,
            endDate,
            dimensions: ['page'],
            rowLimit: 100,
        },
    });

    const rows = res.data.rows || [];
    console.log(`Total pages with search impressions: ${rows.length}\n`);

    if (rows.length === 0) {
        console.log('No pages found with search data.');
        return;
    }

    // Sort by impressions descending
    rows.sort((a, b) => b.impressions - a.impressions);

    console.log('Page URL | Impressions | Clicks | CTR | Avg Position');
    console.log('---------|-------------|--------|-----|-------------');
    rows.forEach(row => {
        const url = row.keys[0].replace('https://smilefotilo.com', '');
        const imp = row.impressions;
        const clicks = row.clicks;
        const ctr = (row.ctr * 100).toFixed(1) + '%';
        const pos = row.position.toFixed(1);
        console.log(`${url || '/'} | ${imp} | ${clicks} | ${ctr} | ${pos}`);
    });

    // Now get the sitemap URLs to compare
    console.log(`\n========================================`);
    console.log(`SITEMAP STATUS`);
    console.log(`========================================\n`);

    const sitemaps = await searchconsole.sitemaps.list({ siteUrl: SITE_URL });
    if (sitemaps.data.sitemap) {
        sitemaps.data.sitemap.forEach(s => {
            console.log(`${s.path}`);
            console.log(`  Status: ${s.errors > 0 ? 'HAS ERRORS (' + s.errors + ')' : 'OK'}`);
            console.log(`  Last Downloaded: ${s.lastDownloaded || 'Never'}`);
            console.log('');
        });
    }
}

checkIndex().catch(e => console.error('ERROR:', e.message));
