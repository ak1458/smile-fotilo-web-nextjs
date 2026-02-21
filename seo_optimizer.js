const { google } = require('googleapis');
const path = require('path');
const axios = require('axios');
const fs = require('fs');

// CONFIG
const KEY_FILE_PATH = path.join(__dirname, '..', 'captcha-1747281225780-8777cd95d4a8.json');
const SITE_URL = 'sc-domain:smilefotilo.com';
const GROQ_API_KEY = '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';

async function runOptimizer() {
    const auth = new google.auth.GoogleAuth({
        keyFile: KEY_FILE_PATH,
        scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    });

    const searchconsole = google.searchconsole({ version: 'v1', auth });

    try {
        console.log('--- STEP 1: Fetching Search Performance Data ---');
        const res = await searchconsole.searchanalytics.query({
            siteUrl: SITE_URL,
            requestBody: {
                startDate: '2026-01-20',
                endDate: '2026-02-21',
                dimensions: ['QUERY'],
                rowLimit: 20,
            },
        });

        const topQueries = (res.data.rows || []).map(r => r.keys[0]).join(', ');
        console.log(`Analyzing visibility for: ${topQueries}`);

        console.log('\n--- STEP 2: Generating AI GMB Post & Web Optimization ---');

        const prompt = `
            Context: Smile Fotilo is a web design & digital marketing agency with locations in Gonda, Noida, and Lucknow.
            Current High-Impression Keywords: ${topQueries}
            Task:
            1. Generate a sample GMB Post title and 100-word text for Gonda HQ that uses these keywords naturally.
            2. Suggest one specific sentence change for the Gonda location page to improve relevance.
            
            Return in JSON format: { "gmb_post": { "title": "", "text": "" }, "web_suggestion": "" }
        `;

        const groqRes = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: prompt }]
        }, {
            headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' }
        });

        let content = groqRes.data.choices[0].message.content;
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
        console.error('Optimization loop failed:', err.message);
        if (err.response && err.response.data) {
            console.error('Detailed Error:', JSON.stringify(err.response.data, null, 2));
        }
    }
}

runOptimizer();
