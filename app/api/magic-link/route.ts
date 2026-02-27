import { NextResponse } from 'next/server';
import { createAdminClient } from '@/app/lib/supabase/admin';

// Temporary endpoint to generate a magic link so the admin can log in and reset their password.
// DELETE THIS FILE after use.
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    // Simple security — require the CRON_SECRET to run
    if (secret !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();

    // Generate a magic link for the admin user
    // This gives a direct login URL that bypasses the password requirement
    const { data, error } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: 'admin@smilefotilo.com',
    });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Return the clickable link
    // The user clicks this, it logs them in via the callback route, and they are in.
    return NextResponse.json({
        success: true,
        message: 'Copy the link below and open it in your browser to log in.',
        magicLink: data.properties.action_link
    });
}
