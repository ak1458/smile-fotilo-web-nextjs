import axios from 'axios';

const HOST = 'smilefotilo.com';
const BING_ENDPOINT = 'https://www.bing.com/IndexNow';
const YANDEX_ENDPOINT = 'https://yandex.com/indexnow';
const KEY_LOCATION = `https://${HOST}/bing-indexing-key.txt`; // Standard IndexNow location

async function submitToIndexNow(urls) {
    if (!urls || urls.length === 0) return;

    const BING_API_KEY = process.env.BING_API_KEY;
    if (!BING_API_KEY) {
        throw new Error('BING_API_KEY is not configured. IndexNow submissions require a matching key and key-location response.');
    }

    console.log(`--- Submitting ${urls.length} URLs to IndexNow (Bing & Yandex) ---`);

    const endpoints = [BING_ENDPOINT, YANDEX_ENDPOINT];

    for (const endpoint of endpoints) {
        try {
            console.log(`Submitting to ${endpoint}...`);
            const response = await axios.post(endpoint, {
                host: HOST,
                key: BING_API_KEY,
                keyLocation: KEY_LOCATION,
                urlList: urls
            });

            if (response.status === 200) {
                console.log(`✅ URLs submitted successfully to ${new URL(endpoint).hostname}.`);
            } else {
                console.log(`⚠️ ${new URL(endpoint).hostname} responded with status: ${response.status}`);
            }
        } catch (error) {
            console.error(`❌ ${new URL(endpoint).hostname} submission failed:`, error.message);
        }
    }
}

export { submitToIndexNow };
