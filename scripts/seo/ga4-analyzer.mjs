import { google } from 'googleapis';

const KEY_FILE_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const PROPERTY_ID = process.env.GA4_PROPERTY_ID; // e.g. 'properties/123456789'

async function getGA4Metrics() {
    if (!KEY_FILE_PATH || !PROPERTY_ID) {
        console.warn('⚠️ GA4 configuration missing. Skipping GA4 analysis.');
        return null;
    }

    const auth = new google.auth.GoogleAuth({
        keyFile: KEY_FILE_PATH,
        scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
    });

    const analyticsData = google.analyticsdata({ version: 'v1beta', auth });

    try {
        console.log('--- Fetching GA4 Performance Data (Last 7 Days) ---');
        const res = await analyticsData.properties.runReport({
            property: PROPERTY_ID,
            requestBody: {
                dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
                metrics: [
                    { name: 'activeUsers' },
                    { name: 'sessions' },
                    { name: 'bounceRate' },
                    { name: 'averageSessionDuration' }
                ],
                dimensions: [{ name: 'pagePath' }],
                limit: 20
            }
        });

        return res.data;
    } catch (error) {
        console.error('❌ GA4 Metrics fetch failed:', error.message);
        return null;
    }
}

export { getGA4Metrics };
