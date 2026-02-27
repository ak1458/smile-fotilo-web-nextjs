'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/app/lib/supabase/server';
import { createAdminClient } from '@/app/lib/supabase/admin';

export type SignInResult = {
    error: string | null;
};

export async function signInAction(formData: FormData): Promise<SignInResult> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { error: 'Email and password are required.' };
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        return { error: error.message };
    }

    // Get user to determine redirect target
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Authentication succeeded but no user returned.' };
    }

    // Check role using admin client (bypasses RLS)
    const adminClient = createAdminClient();
    const { data: profile } = await adminClient
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

    const target = profile?.role === 'admin' ? '/admin' : '/portal';
    redirect(target);
}

export async function signOutAction() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/login');
}
