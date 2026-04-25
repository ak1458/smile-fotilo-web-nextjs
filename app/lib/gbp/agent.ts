import { google } from 'googleapis';
import type { OAuth2Client } from 'google-auth-library';
import { createAdminClient } from '../supabase/admin';

type OpenRouterResponse = {
    choices?: Array<{
        message?: {
            content?: string;
        };
    }>;
};

export type GBPLocation = {
    name?: string;
    title?: string;
    websiteUri?: string;
    profile?: {
        description?: string;
    };
    metadata?: {
        mapsUri?: string;
    };
};

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

export interface GBPPostResult {
    status: 'drafted' | 'published' | 'skipped' | 'failed';
    locationId: string;
    locationTitle: string;
    detail: string;
}

export class GBPAgent {
    private auth: OAuth2Client;
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
            const data = await response.json() as OpenRouterResponse;
            return data.choices?.[0]?.message?.content?.trim() || null;
        } catch (err) {
            console.error("[AI ERROR]:", err);
            return null;
        }
    }

    private async getBusinessId(): Promise<string | null> {
        const { data } = await this.supabase
            .from('businesses')
            .select('id')
            .ilike('name', '%smile fotilo%')
            .limit(1)
            .single();
        return data?.id || null;
    }

    async saveDraftToDb(draft: GBPDraft) {
        const businessId = await this.getBusinessId();
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

    async runHealthAudit(location: GBPLocation): Promise<GBPRiskReport> {
        const riskReport: GBPRiskReport = { passed: [], warnings: [], critical: [] };
        const name = location.title?.toLowerCase() ?? '';
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

    private getV4LocationName(locationId: string, accountName?: string): string {
        if (locationId.startsWith('accounts/')) {
            return locationId;
        }

        if (locationId.startsWith('locations/') && accountName) {
            return `${accountName}/${locationId}`;
        }

        return locationId;
    }

    private async publishLocalPost(locationId: string, content: string, accountName?: string): Promise<string> {
        const accessToken = (await this.auth.getAccessToken()).token;
        if (!accessToken) {
            throw new Error('Google OAuth access token was not returned. Reconnect GBP OAuth.');
        }

        const locationName = this.getV4LocationName(locationId, accountName);
        if (!locationName.startsWith('accounts/')) {
            throw new Error(
                `GBP Local Posts require an account-qualified location path. Received "${locationId}".`
            );
        }

        const response = await fetch(`https://mybusiness.googleapis.com/v4/${locationName}/localPosts`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                languageCode: 'en-US',
                summary: content.slice(0, 1500),
                topicType: 'STANDARD',
                callToAction: {
                    actionType: 'LEARN_MORE',
                    url: 'https://smilefotilo.com',
                },
            }),
        });

        if (!response.ok) {
            const detail = await response.text();
            throw new Error(`GBP publish failed (${response.status}): ${detail}`);
        }

        const published = await response.json() as { name?: string };
        return published.name ?? locationName;
    }

    async generateWeeklyPost(
        locationId: string,
        locationTitle: string,
        accountName?: string
    ): Promise<GBPPostResult> {
        const prompt = `Create a Google Business Profile weekly update for Smile Fotilo in ${locationTitle}.
Focus: web design, SEO, branding, and AI growth systems for local businesses.
Rules: 120-220 words, no hashtags, no exaggerated claims, no keyword stuffing, one clear reason to visit the website.
Tone: helpful, specific, professional.`;
        const content = await this.generateAIContent(prompt);
        if (!content) {
            return {
                status: 'skipped',
                locationId,
                locationTitle,
                detail: 'AI content generation returned no post content.',
            };
        }

        const shouldPublish = process.env.GBP_AUTO_PUBLISH !== 'false';
        let status: GBPDraft['status'] = shouldPublish ? 'PUBLISHED' : 'PENDING';
        let detail = shouldPublish ? 'Published to Google Business Profile.' : 'Draft saved; GBP_AUTO_PUBLISH=false.';
        let resultStatus: GBPPostResult['status'] = shouldPublish ? 'published' : 'drafted';

        if (shouldPublish) {
            try {
                const publishedName = await this.publishLocalPost(locationId, content, accountName);
                detail = `Published to ${publishedName}.`;
            } catch (error) {
                status = 'PENDING';
                resultStatus = 'failed';
                detail = error instanceof Error ? error.message : 'Unknown GBP publish failure.';
            }
        }

        await this.saveDraftToDb({
            type: 'POST',
            locationId,
            locationTitle,
            content,
            status
        });

        return {
            status: resultStatus,
            locationId,
            locationTitle,
            detail,
        };
    }
}
