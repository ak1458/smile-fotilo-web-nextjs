import { google } from 'googleapis';
import { createAdminClient } from '../supabase/admin';

export interface GBPRiskReport {
    passed: string[];
    warnings: string[];
    critical: string[];
}

export interface GBPDraft {
    type: 'REVIEW' | 'POST';
    locationId: string;
    locationTitle: string;
    reply?: string;
    content?: string;
    reviewer?: string;
    reviewId?: string;
    status: 'PENDING' | 'PUBLISHED' | 'REJECTED';
}

export class GBPAgent {
    private auth: any;
    private openRouterKey: string;
    private supabase = createAdminClient();

    constructor() {
        this.openRouterKey = process.env.OPENROUTER_API_KEY || '';
        this.auth = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET
        );
        this.auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
    }

    private async generateAIContent(prompt: string): Promise<string | null> {
        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${this.openRouterKey}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://smilefotilo.com",
                },
                body: JSON.stringify({
                    "model": "google/gemini-2.0-flash-001",
                    "messages": [{ "role": "user", "content": prompt }]
                })
            });
            const data: any = await response.json();
            return data.choices?.[0]?.message?.content?.trim() || null;
        } catch (err) {
            console.error("[AI ERROR]:", err);
            return null;
        }
    }

    private async getBusinessId(locationTitle: string): Promise<string | null> {
        const { data } = await this.supabase
            .from('businesses')
            .select('id')
            .ilike('name', '%smile fotilo%')
            .limit(1)
            .single();
        return data?.id || null;
    }

    async saveDraftToDb(draft: GBPDraft) {
        const businessId = await this.getBusinessId(draft.locationTitle);
        if (!businessId) {
            console.warn(`[GBP] No business found in DB for ${draft.locationTitle}. Skipping save.`);
            return;
        }

        await this.supabase.from('gbp_drafts').insert({
            business_id: businessId,
            type: draft.type,
            location_id: draft.locationId,
            location_title: draft.locationTitle,
            reviewer_name: draft.reviewer,
            review_id: draft.reviewId,
            reply_content: draft.reply,
            post_content: draft.content,
            status: draft.status,
            metadata: { timestamp: new Date().toISOString() }
        });
    }

    async runHealthAudit(location: any): Promise<GBPRiskReport> {
        const riskReport: GBPRiskReport = { passed: [], warnings: [], critical: [] };
        const name = location.title.toLowerCase();
        const spamWords = ['best', '#1', 'top', 'cheap', 'lowest', 'affordable', 'expert'];

        const detectedSpam = spamWords.filter(word => name.includes(word));
        if (detectedSpam.length > 0) {
            riskReport.critical.push(`POTENTIAL KEYWORD STUFFING: Name includes: [${detectedSpam.join(', ')}]`);
        } else {
            riskReport.passed.push("Business Name Compliance: Passed.");
        }

        if (!location.websiteUri) {
            riskReport.critical.push("MISSING WEBSITE: No official URL linked.");
        } else {
            riskReport.passed.push(`Website Link: Passed (${location.websiteUri})`);
        }

        return riskReport;
    }

    async generateReviewReplies(locationId: string, locationTitle: string): Promise<void> {
        const mockReviews = [
            { id: "R1", reviewer: "Amit Sharma", comment: "The Ayodhya lighting was magical." }
        ];

        for (const rev of mockReviews) {
            const prompt = `Write a human, warm owner reply to: "${rev.comment}" for Smile Fotilo ${locationTitle}. Max 2 sentences. No bot clichés.`;
            const reply = await this.generateAIContent(prompt);
            if (reply) {
                await this.saveDraftToDb({
                    type: 'REVIEW',
                    locationId,
                    locationTitle,
                    reviewer: rev.reviewer,
                    reviewId: rev.id,
                    reply,
                    status: 'PENDING'
                });
            }
        }
    }

    async generateWeeklyPost(locationId: string, locationTitle: string): Promise<void> {
        const prompt = `Create a GMB update for Smile Fotilo in ${locationTitle} about premium photography and SEO. Tone: Informative.`;
        const content = await this.generateAIContent(prompt);
        if (content) {
            await this.saveDraftToDb({
                type: 'POST',
                locationId,
                locationTitle,
                content,
                status: 'PENDING'
            });
        }
    }
}
