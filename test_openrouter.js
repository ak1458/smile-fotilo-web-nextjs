/* eslint-disable @typescript-eslint/no-require-imports */
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-lite-001';

async function testOpenRouter() {
    console.log('--- Testing OpenRouter Integration ---');
    console.log(`Model: ${OPENROUTER_MODEL}`);

    if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'your_openrouter_key_here') {
        console.error('Error: OPENROUTER_API_KEY is not set in .env.local');
        process.exit(1);
    }

    try {
        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: OPENROUTER_MODEL,
                messages: [{ role: 'user', content: 'Say hello!' }],
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'HTTP-Referer': 'https://smilefotilo.com', // Optional, for OpenRouter rankings
                    'X-Title': 'Smile Fotilo Admin', // Optional
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('Response:', response.data.choices[0].message.content);
        console.log('Connection Successful!');
    } catch (error) {
        console.error('Connection Failed:');
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

testOpenRouter();
