/* eslint-disable @typescript-eslint/no-require-imports */
const { google } = require('googleapis');

const path = require('path');

const KEY_FILE_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(__dirname, 'google-key.json');
const SITE_URL = process.env.SITE_URL || 'sc-domain:smilefotilo.com';

async function analyzeZeroClicks() {
    const auth = new google.auth.GoogleAuth({
        keyFile: KEY_FILE_PATH,
        scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    });

    const searchconsole = google.searchconsole({ version: 'v1', auth });

    try {
        // Get dynamic date range (last 30 days)
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 30);
        
        const res = await searchconsole.searchanalytics.query({
            siteUrl: SITE_URL,
            requestBody: {
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
                dimensions: ['QUERY'],
                rowLimit: 500,
            },
        });

        const rows = res.data.rows || [];
        const zeroClicks = rows.filter(r => r.impressions > 10 && r.clicks <= 1);

        console.log('--- ZERO CLICK KEYWORDS (High Interest, No Engagement) ---');
        zeroClicks.forEach(r => {
            console.log(`Keyword: ${r.keys[0]} | Impressions: ${r.impressions} | Position: ${r.position.toFixed(1)}`);
        });

    } catch {
        console.error('API Error:', err);
    }
}

analyzeZeroClicks();
