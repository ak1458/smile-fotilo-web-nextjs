/* eslint-disable @typescript-eslint/no-require-imports */
const { google } = require('googleapis');
const path = require('path');
const axios = require('axios');

const KEY_FILE_PATH = path.join(__dirname, '..', 'captcha-1747281225780-7cd3c8d65214.json');
const SITE_URL = 'sc-domain:smilefotilo.com';

async function deepScan() {
    const auth = new google.auth.GoogleAuth({
        keyFile: KEY_FILE_PATH,
        scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    });
    const searchconsole = google.searchconsole({ version: 'v1', auth });

    // Date range: last 1 year to find ALL pages Google still remembers
    const end = new Date();
    const start = new Date();
    start.setFullYear(end.getFullYear() - 1);

    const startDate = start.toISOString().split('T')[0];
    const endDate = end.toISOString().split('T')[0];

    console.log(`Fetching all historical search-indexed pages since ${startDate}...`);

    const res = await searchconsole.searchanalytics.query({
        siteUrl: SITE_URL,
        requestBody: {
            startDate,
            endDate,
            dimensions: ['page'],
            rowLimit: 500,
        },
    });

    const rows = res.data.rows || [];
    console.log(`Found ${rows.length} unique URLs in search history.\n`);

    const errors = [];
    const working = [];

    for (const row of rows) {
        const url = row.keys[0];
        try {
            // Probe the URL on the live Vercel site
            const response = await axios.get(url, { 
                timeout: 5000, 
                validateStatus: null, // Don't throw on error codes
                headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' }
            });

            if (response.status >= 400) {
                console.log(`❌ [${response.status}] ${url}`);
                errors.push({ url, status: response.status, impressions: row.impressions });
            } else {
                working.push({ url, status: response.status });
            }
        } catch (e) {
            console.log(`⚠️  [ERROR] ${url}: ${e.message}`);
            errors.push({ url, status: 'TIMEOUT/ERROR', impressions: row.impressions });
        }
    }

    console.log(`\n========================================`);
    console.log(`SCAN RESULTS`);
    console.log(`- Working: ${working.length}`);
    console.log(`- Broken: ${errors.length}`);
    console.log(`========================================\n`);

    if (errors.length > 0) {
        console.log('Broken Pages Identified:');
        console.table(errors);
        
        // Output for redirects plan
        console.log('\nSuggested Redirects List:');
        errors.forEach(err => {
            const shortPath = err.url.replace('https://smilefotilo.com', '');
            if (err.status === 404) {
                console.log(`{ source: '${shortPath}', destination: '/about', permanent: true }, // Fixed 404`);
            }
        });
    }
}

deepScan().catch(e => console.error('SCAN FAILED:', e.message));
