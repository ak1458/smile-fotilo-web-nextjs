import { google } from 'googleapis';
import path from 'path';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

async function introspect() {
    const auth = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
    );
    auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

    const bizInfo = google.mybusinessbusinessinformation({ version: 'v1', auth });

    console.log("bizInfo keys:", Object.keys(bizInfo));
    if (bizInfo.accounts) {
        console.log("bizInfo.accounts keys:", Object.keys(bizInfo.accounts));
        if (bizInfo.accounts.locations) {
            console.log("bizInfo.accounts.locations keys:", Object.keys(bizInfo.accounts.locations));
        }
    }
    if (bizInfo.locations) {
        console.log("bizInfo.locations keys:", Object.keys(bizInfo.locations));
    }
}

introspect();
