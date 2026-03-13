import { redirect } from 'next/navigation';
import { cache } from 'react';
import { getCurrentUser, getOwnedBusinesses } from '@/app/lib/auth/session';

function asString(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

const getPortalContext = cache(async () => {
  const user = await getCurrentUser();
  if (!user) return null;

  const businesses = await getOwnedBusinesses(user.id);
  return { user, businesses };
});

export async function requirePortalContext() {
  const context = await getPortalContext();
  if (!context) {
    redirect('/login');
  }
  return context;
}

export async function requirePortalUser() {
  const { user } = await requirePortalContext();
  return user;
}

export async function getPortalBusinesses() {
  const { businesses } = await requirePortalContext();
  return businesses;
}

export async function resolvePortalBusinessId(
  userId: string,
  value: string | string[] | undefined
): Promise<string | null> {
  const { user, businesses } = await requirePortalContext();
  if (user.id !== userId) {
    return null;
  }

  const requested = asString(value);
  if (requested) {
    return businesses.some((business) => business.id === requested) ? requested : null;
  }

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
