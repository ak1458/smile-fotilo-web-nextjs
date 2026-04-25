import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { GBPAgent, type GBPLocation } from '../../../lib/gbp/agent';

type GBPAccount = {
    name?: string;
};

type AccountListResponse = {
    data: {
        accounts?: GBPAccount[];
    };
};

type LocationListResponse = {
    data: {
        locations?: GBPLocation[];
    };
};

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET?.trim();

    if (!cronSecret) {
        return NextResponse.json({ error: 'CRON_SECRET is not configured' }, { status: 503 });
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const agent = new GBPAgent();
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET
        );
        oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

        const bizInfo = google.mybusinessbusinessinformation({
            version: 'v1',
            auth: oauth2Client
        });

        const accountMgmt = google.mybusinessaccountmanagement({
            version: 'v1',
            auth: oauth2Client
        });

        const accountsResponse = await accountMgmt.accounts.list() as AccountListResponse;
        const accounts = accountsResponse.data.accounts || [];
        const results = [];

        for (const account of accounts) {
            if (!account.name) {
                continue;
            }

            const locationsResponse = await bizInfo.accounts.locations.list({
                parent: account.name,
                readMask: 'name,title,websiteUri,profile.description,metadata.mapsUri'
            }) as LocationListResponse;
            const locations = locationsResponse.data.locations || [];

            const myLocs = locations.filter((location) =>
                location.title?.toLowerCase().includes('smile fotilo')
            );

            for (const loc of myLocs) {
                if (!loc.name || !loc.title) {
                    continue;
                }

                const riskReport = await agent.runHealthAudit(loc);
                await agent.generateReviewReplies(loc.name, loc.title);
                const weeklyPost = await agent.generateWeeklyPost(loc.name, loc.title, account.name);
                results.push({
                    location: loc.title,
                    status: weeklyPost.status,
                    detail: weeklyPost.detail,
                    audit: riskReport,
                });
            }
        }

        return NextResponse.json({
            success: true,
            message: 'GBP automation complete.',
            autoPublish: process.env.GBP_AUTO_PUBLISH !== 'false',
            results
        });

    } catch (error: unknown) {
        console.error('[GBP CRON ERROR]:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown GBP automation error' },
            { status: 500 }
        );
    }
}
