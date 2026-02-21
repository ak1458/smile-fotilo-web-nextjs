/* eslint-disable @typescript-eslint/no-require-imports */
const { google } = require('googleapis');
const path = require('path');

const KEY_FILE_PATH = path.join(__dirname, '..', 'captcha-1747281225780-8777cd95d4a8.json');
const SITE_URL = 'sc-domain:smilefotilo.com';

async function verifyIndexing() {
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: KEY_FILE_PATH,
            scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
        });

        const searchconsole = google.searchconsole({ version: 'v1', auth });

        console.log('\n--- VERIFIED SITEMAPS ---');
        const sitemaps = await searchconsole.sitemaps.list({ siteUrl: SITE_URL });
        if (sitemaps.data.sitemap) {
            sitemaps.data.sitemap.forEach(s => {
                console.log(`URL: ${s.path}`);
                console.log(`- Status: ${s.errors > 0 ? 'HAS ERRORS' : 'OK'}`);
                console.log(`- Last Downloaded: ${s.lastDownloaded || 'Never'}`);
                console.log('---');
            });
        } else {
            console.log('None found.');
        }

        console.log('\n--- TOP INDEXED PAGES (LAST 90 DAYS) ---');
        const traffic = await searchconsole.searchanalytics.query({
            siteUrl: SITE_URL,
            requestBody: {
                startDate: '2025-11-20', // Arbitrary safe range
                endDate: new Date().toISOString().split('T')[0],
                dimensions: ['page'],
                rowLimit: 50,
            },
        });

        if (traffic.data.rows) {
            console.log(`Confirmed indexed pages: ${traffic.data.rows.length}`);
            traffic.data.rows.slice(0, 10).forEach(row => {
                console.log(`- ${row.keys[0]} (${row.impressions} appearances in search)`);
            });
        } else {
            console.log('No search data found for any pages (might still be indexed but no traffic).');
        }

    } catch (error) {
        console.error('Check failed:', error.message);
    }
}

verifyIndexing();
