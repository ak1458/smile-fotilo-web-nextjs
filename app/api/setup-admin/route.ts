import { NextResponse } from 'next/server';
import { createAdminClient } from '@/app/lib/supabase/admin';

// One-time admin profile seed endpoint
// DELETE THIS FILE after initial setup
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    // Simple security — require the CRON_SECRET to run
    if (secret !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();

    // Upsert admin profile
    const { data, error } = await supabase
        .from('profiles')
        .upsert(
            {
                id: '8c7128a7-578c-4504-9243-37c88cd2ae8a',
                email: 'admin@smilefotilo.com',
                full_name: 'Smile Fotilo Admin',
                role: 'admin',
            },
            { onConflict: 'id' }
        )
        .select();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, profile: data });
}
