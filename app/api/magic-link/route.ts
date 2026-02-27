import { NextResponse } from 'next/server';
import { createAdminClient } from '@/app/lib/supabase/admin';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    if (secret !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();

    // Reset password directly via Admin API so the user can log in without hitting Supabase themselves
    const { data, error } = await supabase.auth.admin.updateUserById(
        '8c7128a7-578c-4504-9243-37c88cd2ae8a',
        { password: 'SmileFotiloAdmin2026!' }
    );

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Password reset successfully.' });
}
