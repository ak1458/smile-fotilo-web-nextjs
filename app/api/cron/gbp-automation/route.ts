import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { GBPAgent } from '../../../lib/gbp/agent';

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
            auth: oauth2Client as any
        });

        const accountMgmt = google.mybusinessaccountmanagement({
            version: 'v1',
            auth: oauth2Client as any
        });

        const accountsResponse: any = await accountMgmt.accounts.list();
        const accounts = accountsResponse.data.accounts || [];
        const results = [];

        for (const account of accounts) {
            const locationsResponse: any = await bizInfo.accounts.locations.list({
                parent: account.name,
                readMask: 'name,title,websiteUri'
            });
            const locations = locationsResponse.data.locations || [];

            const myLocs = locations.filter((l: any) => l.title?.toLowerCase().includes('smile fotilo'));

            for (const loc of myLocs) {
                // Perform Automation
                await agent.generateReviewReplies(loc.name!, loc.title!);
                await agent.generateWeeklyPost(loc.name!, loc.title!);
                results.push({ location: loc.title, status: 'processed' });
            }
        }

        return NextResponse.json({
            success: true,
            message: 'GBP Automation complete. Drafts saved to Supabase.',
            results
        });

    } catch (error: any) {
        console.error('[GBP CRON ERROR]:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
