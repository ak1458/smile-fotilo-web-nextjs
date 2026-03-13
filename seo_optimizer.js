/* eslint-disable @typescript-eslint/no-require-imports */
const { google } = require('googleapis');
const path = require('path');
const axios = require('axios');
const fs = require('fs');

// CONFIG
const KEY_FILE_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const SITE_URL = process.env.SITE_URL;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// AI PROVIDER SELECTION
const AI_PROVIDER = process.env.AI_PROVIDER || 'groq';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-lite-001';

function getDateRange() {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    return {
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0]
    };
}

async function runOptimizer() {
    const auth = new google.auth.GoogleAuth({
        keyFile: KEY_FILE_PATH,
        scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    });

    const searchconsole = google.searchconsole({ version: 'v1', auth });

    try {
        console.log('--- STEP 1: Fetching Search Performance Data ---');
        const dateRange = getDateRange();
        console.log(`Date Range: ${dateRange.startDate} to ${dateRange.endDate}`);

        const res = await searchconsole.searchanalytics.query({
            siteUrl: SITE_URL,
            requestBody: {
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
                dimensions: ['QUERY'],
                rowLimit: 20,
            },
        });

        const topQueries = (res.data.rows || []).map(r => r.keys[0]).join(', ');
        console.log(`Analyzing visibility for: ${topQueries}`);

        console.log('\n--- STEP 2: Generating AI GMB Post & Web Optimization ---');

        const prompt = `
            Context: Smile Fotilo is a web design & digital marketing agency with locations in Gonda, Noida, and Lucknow.
            Current Search Trends: ${topQueries}
            
            Task (Google Feb 2026 Core Update Safe Mode):
            1. Generate a DRAFT GMB Post idea (title and 100-word text) focusing on helpful tips, real-world agency experience, or recent project announcements. Do NOT just stuff the keywords. Use them only if they naturally fit a genuinely helpful update.
            2. Suggest one specific UX or content improvement for the Gonda location page based on what users are searching for, to build more trust (E-E-A-T).
            
            Return in JSON format: { "gmb_post": { "title": "", "text": "" }, "web_suggestion": "" }
        `;

        let aiRes;
        if (AI_PROVIDER === 'groq') {
            aiRes = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: prompt }]
            }, {
                headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' }
            });
        } else if (AI_PROVIDER === 'openrouter') {
            if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'your_openrouter_key_here') {
                throw new Error('OPENROUTER_API_KEY is missing or invalid in .env.local');
            }
            aiRes = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
                model: OPENROUTER_MODEL,
                messages: [{ role: 'user', content: prompt }]
            }, {
                headers: {
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'HTTP-Referer': 'https://smilefotilo.com',
                    'Content-Type': 'application/json'
                }
            });
        } else {
            throw new Error(`Unsupported AI_PROVIDER: ${AI_PROVIDER}`);
        }

        let content = aiRes.data.choices[0].message.content;
        // Basic JSON extraction if AI wraps in code blocks
        if (content.includes('```json')) {
            content = content.split('```json')[1].split('```')[0];
        } else if (content.includes('```')) {
            content = content.split('```')[1].split('```')[0];
        }

        const advice = JSON.parse(content);
        console.log('\n--- AI STRATEGY RESULTS ---');
        console.log('GMB POST IDEA:', advice.gmb_post);
        console.log('WEB IMPROVEMENT:', advice.web_suggestion);

        fs.writeFileSync('strategy_output.json', JSON.stringify(advice, null, 2));
        console.log('\nSuccessfully saved to strategy_output.json');

    } catch (err) {
        console.error('❌ Optimization loop failed:', err.message);
        console.error('Stack trace:', err.stack);

        // Check for specific errors
        if (err.message.includes('gaxios')) {
            console.error('🔧 This is a gaxios compatibility issue. Try running: npm install gaxios@6.3.0');
        }
        if (err.message.includes('401') || err.message.includes('403')) {
            console.error('🔐 Authentication error. Check your GOOGLE_SERVICE_ACCOUNT_JSON secret.');
        }
        if (err.response && err.response.data) {
            console.error('API Error Details:', JSON.stringify(err.response.data, null, 2));
        }
        process.exit(1);
    }
}

runOptimizer();
