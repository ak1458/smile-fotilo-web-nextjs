import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { submitToIndexNow } from './bing-indexer.mjs';
import { getGA4Metrics } from './ga4-analyzer.mjs';

const KEY_FILE_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const SITE_URL = process.env.SITE_URL || 'sc-domain:smilefotilo.com';

async function runUnifiedAudit() {
    console.log('🚀 Starting 7-Day Unified SEO Automation Process...');
    const report = {
        timestamp: new Date().toISOString(),
        gsc: null,
        ga4: null,
        indexing: { bing: 'pending', yandex: 'pending' },
        recommendations: []
    };

    try {
        // 1. Search Console Audit
        if (KEY_FILE_PATH && fs.existsSync(KEY_FILE_PATH)) {
            const auth = new google.auth.GoogleAuth({
                keyFile: KEY_FILE_PATH,
                scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
            });
            const searchconsole = google.searchconsole({ version: 'v1', auth });

            console.log('--- Fetching Search Console Data ---');
            const traffic = await searchconsole.searchanalytics.query({
                siteUrl: SITE_URL,
                requestBody: {
                    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    endDate: new Date().toISOString().split('T')[0],
                    dimensions: ['query', 'page'],
                    rowLimit: 50,
                },
            });
            report.gsc = traffic.data.rows || [];
        }

        // 2. GA4 Analysis
        const ga4Data = await getGA4Metrics();
        report.ga4 = ga4Data;

        // 3. Global Indexing (Bing/Yandex via IndexNow)
        const urlsToIndex = [
            'https://smilefotilo.com/',
            'https://smilefotilo.com/about',
            'https://smilefotilo.com/pricing',
            'https://smilefotilo.com/services/seo',
            'https://smilefotilo.com/services/web-design'
        ];
        await submitToIndexNow(urlsToIndex);
        report.indexing.bing = 'Success';

        // 4. Save Report
        const reportPath = path.join(process.cwd(), 'audit-output', `seo-report-${new Date().toISOString().split('T')[0]}.json`);
        if (!fs.existsSync(path.dirname(reportPath))) {
            fs.mkdirSync(path.dirname(reportPath), { recursive: true });
        }
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`✅ Unified report generated: ${reportPath}`);

    } catch (error) {
        console.error('❌ Unified SEO process failed:', error.message);
    }
}

runUnifiedAudit();
