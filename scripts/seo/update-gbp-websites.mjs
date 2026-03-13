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

const UPDATES = [
    {
        name: "locations/12149603150166218782", // Greater Noida
        websiteUri: "https://smilefotilo.com/locations/greater-noida"
    },
    {
        name: "locations/9470686576602627628", // Ayodhya
        websiteUri: "https://smilefotilo.com/locations/ayodhya"
    },
    {
        name: "locations/12032265850332873954", // Gonda (HQ)
        websiteUri: "https://smilefotilo.com/locations/gonda"
    }
];

async function updateWebsites() {
    console.log(`\n==================================================`);
    console.log(`🚀 UPDATING SMILE FOTILO GMB WEBSITES (REST MODE)`);
    console.log(`==================================================`);

    try {
        const authClient = await getAuthClient();
        const token = (await authClient.getAccessToken()).token;

        for (const item of UPDATES) {
            console.log(`\n🔄 Updating ${item.name}...`);
            console.log(`   New URL: ${item.websiteUri}`);

            try {
                // PATCH https://mybusinessbusinessinformation.googleapis.com/v1/{name}
                const url = `https://mybusinessbusinessinformation.googleapis.com/v1/${item.name}?updateMask=websiteUri`;

                const res = await fetch(url, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        websiteUri: item.websiteUri
                    })
                });

                if (res.ok) {
                    const data = await res.json();
                    console.log(`   ✅ Success! URL now set to: ${data.websiteUri}`);
                } else {
                    const errorText = await res.text();
                    console.error(`   ❌ Failed: Status ${res.status}`);
                    console.error(`      Detail: ${errorText}`);
                }
            } catch (err) {
                console.error(`   ❌ Request Error: ${err.message}`);
            }
        }
        console.log(`\n✅ All approved updates processed.`);
    } catch (error) {
        console.error(`❌ Fatal Error: ${error.message}`);
    }
}

updateWebsites();
