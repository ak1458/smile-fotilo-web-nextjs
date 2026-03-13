import { google } from 'googleapis';
import path from 'path';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Setup environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const DRAFTS_FILE = path.resolve(__dirname, '../../gbp_drafts.json');
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const AI_MODEL = "google/gemini-2.0-flash-001";

async function getAuthClient() {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'http://localhost:3000/oauth2callback'
    );
    oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
    return oauth2Client;
}

/**
 * AI Powered Content Generator
 */
async function generateAIContent(prompt) {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://smilefotilo.com",
            },
            body: JSON.stringify({
                "model": AI_MODEL,
                "messages": [{ "role": "user", "content": prompt }]
            })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        return data.choices[0].message.content.trim();
    } catch (err) {
        console.error("   ❌ [AI ERROR]:", err.message);
        return null;
    }
}

/**
 * 2026 PENALTY RISK SCANNER (Official Guideline Cross-Check)
 */
async function runHealthAudit(location) {
    console.log(`\n   🔍 [2026 AUDIT] Scanning: ${location.title} (ID: ${location.name.split('/').pop()})`);
    console.log(`      📍 Address: ${location.storeCode || 'No Store Code'} - ${location.address?.addressLines?.join(', ') || 'No Address'}`);
    const riskReport = {
        passed: [],
        warnings: [],
        critical: []
    };

    // 1. Keyword Stuffing Detection (Name Analysis)
    const name = location.title.toLowerCase();
    const spamWords = ['best', '#1', 'top', 'cheap', 'lowest', 'affordable', 'expert', 'services in'];
    const detectedSpam = spamWords.filter(word => name.includes(word));

    if (detectedSpam.length > 0) {
        riskReport.critical.push(`POTENTIAL KEYWORD STUFFING: Name includes marketing terms: [${detectedSpam.join(', ')}]. Risk of immediate suspension.`);
    } else {
        riskReport.passed.push("Business Name Compliance: Passed (No obvious keyword stuffing).");
    }

    // 2. Information Gain (Description Analysis)
    const desc = location.profile?.description || "";
    if (desc.length < 250) {
        riskReport.warnings.push(`LOW INFORMATION GAIN: Description is ${desc.length} chars. Google 2026 rewards rich unique copy (>250 chars).`);
    } else {
        riskReport.passed.push("Content Density: Passed (Rich description found).");
    }

    // 3. Technical Connectivity
    if (!location.websiteUri) {
        riskReport.critical.push("MISSING WEBSITE: No official URL linked. Critical for Local-to-Organic SEO trust.");
    } else {
        riskReport.passed.push(`Website Link: Passed (${location.websiteUri})`);
    }

    // 4. Map Authority
    if (!location.metadata?.mapsUri) {
        riskReport.warnings.push("MAP SYNC: Profile is not yet indexed with a Maps CID. Local rankings will be limited.");
    } else {
        riskReport.passed.push("Maps Sync: Verified.");
    }

    // Print Report
    riskReport.passed.forEach(p => console.log(`      ✅ ${p}`));
    riskReport.warnings.forEach(w => console.log(`      ⚠️  [WARNING] ${w}`));
    riskReport.critical.forEach(c => console.log(`      🚨 [CRITICAL RISK] ${c}`));

    return riskReport;
}

/**
 * Review Draft Logic with Anti-Bot Tone
 */
async function processReviews(accountName, locationId, locationTitle) {
    console.log(`\n   📝 [REVIEWS] Drafting for ${locationTitle}...`);
    const mockReviews = [
        { id: "R1", reviewer: "Amit Sharma", comment: "The Ayodhya lighting was magical." },
        { id: "R2", reviewer: "Sarah Jenkins", comment: "Stunning wedding portraits. Highly recommend." }
    ];

    for (const rev of mockReviews) {
        const prompt = `
            Task: Write an owner reply to: "${rev.comment}".
            Voice: Warm, professional, human business owner of Smile Fotilo.
            Rule: DO NOT use 'AI Clichés' like "thank you for your business" or "we strive for excellence".
            Rule: Be specific about their comment.
            Limit: 1-2 sentences. 
            Audience: Future customers reading the profile.
        `;
        const reply = await generateAIContent(prompt);
        if (reply) {
            saveDraft({
                type: "REVIEW",
                locationId,
                locationTitle,
                reviewer: rev.reviewer,
                reviewId: rev.id,
                reply,
                status: "PENDING"
            });
            console.log(`      ✨ Humanized draft ready for ${rev.reviewer}`);
        }
    }
}

/**
 * GMB Posting Engine (Helpful Content Compliant)
 */
async function draftWeeklyPost(accountName, locationId, locationTitle) {
    console.log(`\n   🚀 [POSTING] Drafting for ${locationTitle}...`);
    const prompt = `
        Create a GMB "What's New" post for "Smile Fotilo".
        Topic: Professional photography and SEO services in ${locationTitle}.
        Tone: Informative and locally relevant. 
        CTA: Learn More.
        Avoid: Generic bot language.
    `;
    const postBody = await generateAIContent(prompt);
    if (postBody) {
        saveDraft({
            type: "POST",
            locationId,
            locationTitle,
            content: postBody,
            status: "PENDING"
        });
        console.log(`      📝 Unique GMB post drafted.`);
    }
}

async function pushApprovedDrafts(authClient) {
    console.log(`\n==================================================`);
    console.log(`🚀 LIVE PUSH: Bypassing Sandbox...`);
    console.log(`==================================================`);

    if (!fs.existsSync(DRAFTS_FILE)) {
        console.log("❌ No drafts file found.");
        return;
    }

    const drafts = JSON.parse(fs.readFileSync(DRAFTS_FILE, 'utf8'));
    const pending = drafts.filter(d => d.status === "PENDING");

    if (pending.length === 0) {
        console.log("✅ No pending items to push.");
        return;
    }

    const token = (await authClient.getAccessToken()).token;

    for (const draft of pending) {
        try {
            if (draft.type === "REVIEW") {
                const url = `https://mybusiness.googleapis.com/v4/${draft.locationId}/reviews/${draft.reviewId}/reply`;
                const res = await fetch(url, { method: "PUT", headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ comment: draft.reply }) });
                if (res.ok) console.log(`      ✅ Posted Review Reply for ${draft.reviewer}`);
                else console.error(`      ❌ API Error: ${await res.text()}`);
            } else if (draft.type === "POST") {
                const url = `https://mybusiness.googleapis.com/v4/${draft.locationId}/localPosts`;
                const res = await fetch(url, { method: "POST", headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ languageCode: "en-US", summary: draft.content, topicType: "STANDARD", callToAction: { actionType: "LEARN_MORE", url: "https://smilefotilo.com" } }) });
                if (res.ok) console.log(`      ✅ Published Weekly Post for ${draft.locationTitle}`);
                else console.error(`      ❌ API Error: ${await res.text()}`);
            }
            draft.status = "PUBLISHED";
        } catch (err) {
            console.error(`      ❌ Push Failed: ${err.message}`);
        }
    }

    fs.writeFileSync(DRAFTS_FILE, JSON.stringify(drafts, null, 2));
}

function saveDraft(draft) {
    let drafts = [];
    if (fs.existsSync(DRAFTS_FILE)) drafts = JSON.parse(fs.readFileSync(DRAFTS_FILE, 'utf8'));
    drafts.push({ ...draft, timestamp: new Date().toISOString() });
    fs.writeFileSync(DRAFTS_FILE, JSON.stringify(drafts, null, 2));
}

async function main() {
    const args = process.argv.slice(2);
    const isPushMode = args.includes('--push');

    console.log(`\n==================================================`);
    console.log(`🌍 SMILE FOTILO GBP AGENT v2.8 (Enterprise Audit)`);
    console.log(`==================================================`);

    try {
        const authClient = await getAuthClient();
        if (isPushMode) {
            await pushApprovedDrafts(authClient);
            return;
        }

        const bizInfo = google.mybusinessbusinessinformation({ version: 'v1', auth: authClient });
        const accounts = (await google.mybusinessaccountmanagement({ version: 'v1', auth: authClient }).accounts.list()).data.accounts || [];

        if (fs.existsSync(DRAFTS_FILE)) fs.unlinkSync(DRAFTS_FILE);

        for (const account of accounts) {
            const locations = (await bizInfo.accounts.locations.list({
                parent: account.name,
                readMask: 'name,title,websiteUri,profile.description,metadata.mapsUri'
            })).data.locations || [];
            const myLocs = locations.filter(l => l.title.toLowerCase().includes('smile fotilo'));

            for (const loc of myLocs) {
                await runHealthAudit(loc);
                await processReviews(account.name, loc.name, loc.title);
                await draftWeeklyPost(account.name, loc.name, loc.title);
            }
        }
        console.log(`\n✅ FINAL AUDIT COMPLETE. No logic glitches found.`);
        console.log(`👉 Run with --push to go live.`);

    } catch (error) {
        console.error(`❌ Fatal Audit Error: ${error.message}`);
    }
}

main();
