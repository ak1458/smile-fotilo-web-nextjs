import { redirect } from 'next/navigation';
import { getAdminSession } from './lib/admin-auth';
import AdminShell from './components/AdminShell';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session.userId) redirect('/login');
  if (!session.isAdmin) redirect('/portal');

  return <AdminShell sessionEmail={session.email}>{children}</AdminShell>;
}
