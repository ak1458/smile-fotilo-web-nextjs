import { getCurrentUser, getUserRole } from '@/app/lib/auth/session';

export type AdminSession = {
  userId: string | null;
  isAdmin: boolean;
  email: string | null;
};

export async function getAdminSession(): Promise<AdminSession> {
  const user = await getCurrentUser();
  if (!user) {
    return { userId: null, isAdmin: false, email: null };
  }

  const role = await getUserRole(user.id);
  return {
    userId: user.id,
    isAdmin: role === 'admin',
    email: user.email,
  };
}
