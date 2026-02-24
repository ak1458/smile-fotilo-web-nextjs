import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminSession } from './lib/admin-auth';

const ADMIN_NAV = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/businesses', label: 'Businesses' },
  { href: '/admin/agents', label: 'Agents' },
  { href: '/admin/conversations', label: 'Conversations' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session.userId) redirect('/');
  if (!session.isAdmin) redirect('/portal');

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[220px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-4">
          <h1 className="mb-3 text-lg font-semibold text-slate-900">Admin Console</h1>
          <p className="mb-4 text-xs text-slate-500">
            {session.email ? `Signed in: ${session.email}` : 'No authenticated session'}
          </p>
          <nav className="space-y-1">
            {ADMIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">{children}</main>
      </div>
    </div>
  );
}
