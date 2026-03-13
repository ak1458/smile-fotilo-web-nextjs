import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

// Load credentials
const jsonCreds = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
const KEY_FILE_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS;

let auth;
if (jsonCreds) {
    auth = new google.auth.GoogleAuth({
        credentials: JSON.parse(jsonCreds),
        scopes: ['https://www.googleapis.com/auth/indexing'],
    });
} else if (KEY_FILE_PATH && fs.existsSync(KEY_FILE_PATH)) {
    auth = new google.auth.GoogleAuth({
        keyFile: KEY_FILE_PATH,
        scopes: ['https://www.googleapis.com/auth/indexing'],
    });
} else {
    // Attempt fallback to the local service account file if it exists
    const fallbackPath = path.join(process.cwd(), '..', 'captcha-1747281225780-7cd3c8d65214.json');
    if (fs.existsSync(fallbackPath)) {
        auth = new google.auth.GoogleAuth({
            keyFile: fallbackPath,
            scopes: ['https://www.googleapis.com/auth/indexing'],
        });
    } else {
        console.error('No Google credentials found.');
        process.exit(1);
    }
}

async function requestIndexing(url) {
    const indexing = google.indexing({ version: 'v3', auth });

    try {
        const response = await indexing.urlNotifications.publish({
            requestBody: {
                url: url,
                type: 'URL_UPDATED',
            },
        });
        console.log(`✅ Indexing requested for ${url}`);
        console.log(`   Response: ${JSON.stringify(response.data)}`);
    } catch (error) {
        console.error(`❌ Failed to request indexing for ${url}`);
        console.error(error.message);
    }
}

async function run() {
    const urlsToUpdate = [
        'https://smilefotilo.com/',
        'https://smilefotilo.com/about',
        'https://smilefotilo.com/services/seo',
        'https://smilefotilo.com/services/web-design',
        'https://smilefotilo.com/portfolio'
    ];

    console.log('--- Requesting Google Indexing for critical pages ---');
    for (const url of urlsToUpdate) {
        await requestIndexing(url);
    }
}

run();
