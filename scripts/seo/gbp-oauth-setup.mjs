import { google } from 'googleapis';
import http from 'http';
import url from 'url';
import opn from 'open';
import destroyer from 'server-destroy';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

// Setup OAuth2 
// Requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:3000/oauth2callback'
);

google.options({ auth: oauth2Client });

async function main() {
    console.log(`\n==================================================`);
    console.log(`🔐 OAUTH2 AUTHENTICATION FOR GOOGLE BUSINESS PROFILE`);
    console.log(`==================================================\n`);

    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        console.log(`❌ ERROR: You must generate an OAuth2 Client ID and Secret from Google Cloud Console.`);
        console.log(`   Go to APIs & Services > Credentials > Create Credentials > OAuth client ID`);
        console.log(`   Application Type: Web Application`);
        console.log(`   Authorized redirect URIs: http://localhost:3000/oauth2callback`);
        console.log(`   Then add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to your .env.local file.`);
        return;
    }

    const authorizeUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/business.manage'],
        prompt: 'consent'
    });

    console.log(`🌍 Opening browser for authentication...`);
    console.log(`🔗 AUTH URL: ${authorizeUrl}\n`);

    // Create a local server to handle the OAuth2 callback
    const server = http.createServer(async (req, res) => {
        try {
            if (req.url.indexOf('/oauth2callback') > -1) {
                const qs = new url.URL(req.url, 'http://localhost:3000').searchParams;
                const code = qs.get('code');
                res.end('Authentication successful! You can close this tab and return to the console.');
                server.destroy();

                const { tokens } = await oauth2Client.getToken(code);
                oauth2Client.credentials = tokens;
                console.log(`\n✅ OAuth2 Token Acquired Successfully!`);
                console.log(`🔑 Refresh Token (Save this to .env.local as GOOGLE_REFRESH_TOKEN):`);
                console.log(tokens.refresh_token);

                // Test the GBP API Connection immediately
                console.log(`\n[API Calling] -> Fetching linked Google My Business Accounts...`);
                const businessAPI = google.mybusinessaccountmanagement('v1');
                const accountsResult = await businessAPI.accounts.list();
                const accounts = accountsResult.data.accounts || [];

                if (accounts.length === 0) {
                    console.log(`🚨 [WARNING] Your personal Google account has zero GBP accounts associated with it.`);
                } else {
                    console.log(`✅ [SUCCESS] Found ${accounts.length} linked GBP Account(s) attached to your email!`);

                    for (const account of accounts) {
                        console.log(`\n-> Account Name: ${account.name}`);
                        console.log(`-> Account Title: ${account.accountName}`);

                        const businessInfoApi = google.mybusinessbusinessinformation('v1');
                        const locationsResult = await businessInfoApi.accounts.locations.list({
                            parent: account.name,
                            readMask: 'name,title,storeCode,metadata.mapsUri'
                        });

                        const locations = locationsResult.data.locations || [];
                        console.log(`   📍 Found ${locations.length} Locations for this account.`);
                        locations.forEach(loc => console.log(`      - ${loc.title} (ID: ${loc.name})`));
                    }
                }
            }
        } catch (e) {
            console.error('Error handling callback:', e.message);
        }
    }).listen(3000, () => {
        // Open the browser to the authorize url to start the workflow
        opn(authorizeUrl, { wait: false }).then(cp => cp.unref());
    });

    destroyer(server);
}

main().catch(console.error);
