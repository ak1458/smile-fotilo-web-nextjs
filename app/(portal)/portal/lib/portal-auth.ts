import { redirect } from 'next/navigation';
import { canAccessBusiness, getCurrentUser, getOwnedBusinesses } from '@/app/lib/auth/session';

function asString(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export async function requirePortalUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/');
  }
  return user;
}

export async function resolvePortalBusinessId(
  userId: string,
  value: string | string[] | undefined
): Promise<string | null> {
  const requested = asString(value);
  if (requested) {
    const allowed = await canAccessBusiness(userId, requested);
    return allowed ? requested : null;
  }

  const businesses = await getOwnedBusinesses(userId);
  return businesses[0]?.id ?? null;
}

export async function requirePortalBusinessId(
  userId: string,
  value: string | string[] | undefined
): Promise<string> {
  const businessId = await resolvePortalBusinessId(userId, value);
  if (!businessId) {
    redirect('/portal');
  }
  return businessId;
}

