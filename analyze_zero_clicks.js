const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

async function analyzeZeroClicks() {
    const auth = new google.auth.GoogleAuth({
        keyFile: path.join(__dirname, '..', 'captcha-1747281225780-8777cd95d4a8.json'),
        scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    });

    const searchconsole = google.searchconsole({ version: 'v1', auth });

    try {
        const res = await searchconsole.searchanalytics.query({
            siteUrl: 'sc-domain:smilefotilo.com',
            requestBody: {
                startDate: '2026-01-20',
                endDate: '2026-02-20',
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

    } catch (err) {
        console.error('API Error:', err);
    }
}

analyzeZeroClicks();
