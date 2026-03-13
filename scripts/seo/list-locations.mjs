import { google } from 'googleapis';
import path from 'path';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

async function getAuthClient() {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'http://localhost:3000/oauth2callback'
    );
    oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
    return oauth2Client;
}

async function listDetailedLocations() {
    const authClient = await getAuthClient();
    const bizInfo = google.mybusinessbusinessinformation({ version: 'v1', auth: authClient });
    const accountMgmt = google.mybusinessaccountmanagement({ version: 'v1', auth: authClient });

    const accounts = (await accountMgmt.accounts.list()).data.accounts || [];

    for (const account of accounts) {
        console.log(`\nAccount: ${account.title} (${account.name})`);
        const locations = (await bizInfo.accounts.locations.list({
            parent: account.name,
            readMask: 'name,title,storeCode,metadata.mapsUri,websiteUri'
        })).data.locations || [];

        for (const loc of locations) {
            if (loc.title.toLowerCase().includes('smile fotilo')) {
                console.log(`- Title: ${loc.title}`);
                console.log(`  ID: ${loc.name}`);
                console.log(`  Maps: ${loc.metadata?.mapsUri || 'N/A'}`);
                console.log(`  Current Website: ${loc.websiteUri || 'MISSING'}\n`);
            }
        }
    }
}

listDetailedLocations();
