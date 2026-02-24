import { createAdminClient } from '@/app/lib/supabase/admin';
import { createClient } from '@/app/lib/supabase/server';

export type AppUser = {
  id: string;
  email: string | null;
};

export async function getCurrentUser(): Promise<AppUser | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) return null;
    return { id: user.id, email: user.email ?? null };
  } catch {
    return null;
  }
}

export async function getUserRole(userId: string): Promise<string | null> {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .maybeSingle();

    return data?.role ?? null;
  } catch {
    return null;
  }
}

export async function getOwnedBusinesses(userId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('businesses')
    .select('id,name,owner_id')
    .eq('owner_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function canAccessBusiness(userId: string, businessId: string): Promise<boolean> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('businesses')
    .select('id')
    .eq('id', businessId)
    .eq('owner_id', userId)
    .maybeSingle();

  if (error) return false;
  return Boolean(data?.id);
}

