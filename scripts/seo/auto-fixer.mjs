import fs from 'fs';
import path from 'path';
import axios from 'axios';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const LAYOUT_FILE_PATH = path.join(process.cwd(), 'app', 'layout.tsx');

async function runAutoFixer() {
    console.log('🔄 Starting AI Auto-Fixer & Republish System...');

    if (!GROQ_API_KEY) {
        console.error('❌ GROQ_API_KEY is missing. Cannot run auto-fixer.');
        process.exit(1);
    }

    try {
        // 1. Find the latest SEO report
        const reportDir = path.join(process.cwd(), 'audit-output');
        if (!fs.existsSync(reportDir)) {
            console.log('⚠️ No audit reports found to analyze. Skipping auto-fix.');
            return;
        }

        const files = fs.readdirSync(reportDir).filter(f => f.startsWith('seo-report-') && f.endsWith('.json'));
        if (files.length === 0) {
            console.log('⚠️ No recent audit reports found. Skipping auto-fix.');
            return;
        }

        // Get the most recent file
        const latestReportFile = files.sort().reverse()[0];
        const reportData = JSON.parse(fs.readFileSync(path.join(reportDir, latestReportFile), 'utf8'));

        console.log(`--- Analyzing Report: ${latestReportFile} ---`);

        // Extract top 15 queries to pass to AI
        let currentQueries = [];
        if (reportData.gsc && Array.isArray(reportData.gsc)) {
            currentQueries = reportData.gsc.slice(0, 15).map(r => r.keys[0]);
        }

        if (currentQueries.length === 0) {
            console.log('⚠️ No query data found in the report. Skipping global keyword update.');
            return;
        }

        console.log(`Top keywords driving traffic: ${currentQueries.join(', ')}`);

        // 2. Read Current Layout Metadata
        let layoutContent = fs.readFileSync(LAYOUT_FILE_PATH, 'utf8');

        // Extract current description and keywords
        const descMatch = layoutContent.match(/description:\s*"([^"]+)"/);
        const keywordMatch = layoutContent.match(/keywords:\s*\[([^\]]+)\]/);

        const currentDesc = descMatch ? descMatch[1] : '';
        const currentKeywordsArr = keywordMatch ? keywordMatch[1].replace(/"/g, '').split(',').map(k => k.trim()) : [];

        // 3. Ask Groq AI for safe improvements
        const prompt = `
            You are an expert SEO specialist reviewing a website's performance.
            The site is "Smile Fotilo", a Web Design & Digital Marketing agency serving globally, but with HQs in Gonda, Noida, and Lucknow, India.
            
            Current Global Meta Description: "${currentDesc}"
            Current Global Keywords: [${currentKeywordsArr.join(', ')}]
            
            Based on the last 7 days of Google Search Console data, these are the top queries people are actually typing to find the site:
            ${currentQueries.join(', ')}

            Task:
            1. Update the "description" to subtly incorporate 1-2 of the new top queries, ONLY if it sounds natural and human-written. Do NOT make it sound like spam. Keep it under 155 characters.
            2. Add up to 3 highly relevant new keywords from the incoming queries list to the "keywords" array. Keep the existing most important ones. Return a maximum of 15 keywords total.

            Return your expert recommendations strictly in this JSON format, nothing else:
            {
                "new_description": "the updated description",
                "new_keywords": ["keyword1", "keyword2", "keyword3", "etc"]
            }
        `;

        console.log('--- Calling Groq AI for SEO Improvements ---');
        const aiRes = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: prompt }]
        }, {
            headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' }
        });

        let content = aiRes.data.choices[0].message.content;

        // Clean JSON formatting if Groq returns markdown blocks
        if (content.includes('```json')) {
            content = content.split('```json')[1].split('```')[0];
        } else if (content.includes('```')) {
            content = content.split('```')[1].split('```')[0];
        }

        const advice = JSON.parse(content);

        if (!advice.new_description || !Array.isArray(advice.new_keywords)) {
            throw new Error("AI returned malformed JSON structure.");
        }

        console.log('\n--- Applying AI Optimizations ---');
        console.log(`New Description: ${advice.new_description}`);
        console.log(`New Keywords: ${advice.new_keywords.join(', ')}`);

        // 4. Update the Layout File via Regex Replacement
        const updatedKeywordsString = advice.new_keywords.map((k) => `"${k}"`).join(", ");

        layoutContent = layoutContent.replace(
            /(description:\s*)"[^"]+"/,
            `$1"${advice.new_description}"`
        );

        layoutContent = layoutContent.replace(
            /(keywords:\s*\[)[^\]]+(\])/,
            `$1${updatedKeywordsString}$2`
        );

        // Save back to file
        fs.writeFileSync(LAYOUT_FILE_PATH, layoutContent);
        console.log('✅ Successfully updated app/layout.tsx with new AI-optimized metadata.');
        console.log('📌 Any git commit following this will trigger an automatic Vercel Republish.');

    } catch (error) {
        console.error('❌ Auto-Fixer failed:', error.message);
        if (error.response && error.response.data) {
            console.error('API Error Details:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

runAutoFixer();
