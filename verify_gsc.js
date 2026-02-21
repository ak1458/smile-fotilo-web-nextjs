/* eslint-disable @typescript-eslint/no-require-imports */
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

// Path to your JSON key file (adjust if the name is different)
const KEY_FILE_PATH = path.join(__dirname, '..', 'captcha-1747281225780-8777cd95d4a8.json');
const SITE_URL = 'sc-domain:smilefotilo.com';

async function verifyAccess() {
    try {
        console.log(`Checking credentials at: ${KEY_FILE_PATH}`);

        if (!fs.existsSync(KEY_FILE_PATH)) {
            throw new Error(`Credential file not found at ${KEY_FILE_PATH}`);
        }

        const auth = new google.auth.GoogleAuth({
            keyFile: KEY_FILE_PATH,
            scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
        });

        const searchconsole = google.searchconsole({ version: 'v1', auth });

        console.log('Fetching available sites...');
        const sitesList = await searchconsole.sites.list();
        console.log('Available Sites:');
        if (sitesList.data.siteEntry) {
            console.table(sitesList.data.siteEntry.map(site => ({
                URL: site.siteUrl,
                Permission: site.permissionLevel
            })));
        } else {
            console.log('No sites found for this service account.');
        }

        console.log(`\nChecking details for: ${SITE_URL}`);
        const siteInfo = await searchconsole.sites.get({ siteUrl: SITE_URL });
        console.log('Connection Successful!');
        console.log('Site Permission Level:', siteInfo.data.permissionLevel);

        console.log('\nFetching last 7 days of performance data...');
        const now = new Date();
        const endDate = now.toISOString().split('T')[0];
        const startDate = new Date(now.setDate(now.getDate() - 7)).toISOString().split('T')[0];

        const res = await searchconsole.searchanalytics.query({
            siteUrl: SITE_URL,
            requestBody: {
                startDate,
                endDate,
                dimensions: ['query'],
                rowLimit: 10,
            },
        });

        if (res.data.rows && res.data.rows.length > 0) {
            console.log('\nTop 10 Performance Keywords (Last 7 Days):');
            console.table(res.data.rows.map(row => ({
                Keyword: row.keys[0],
                Clicks: row.clicks,
                Impressions: row.impressions,
                CTR: (row.ctr * 100).toFixed(2) + '%',
                Position: row.position.toFixed(1)
            })));
        } else {
            console.log('\nNo performance data found for the last 7 days.');
        }

    } catch (error) {
        console.error('Error verifying Search Console access:');
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Error Data:`, JSON.stringify(error.response.data, null, 2));
            if (error.response.status === 403) {
                console.log('\nTIP: Make sure you added the service account email to Users and Permissions in Search Console!');
            }
        } else {
            console.error(error.message);
        }
    }
}

verifyAccess();
