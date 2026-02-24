import Link from 'next/link';
import { getOwnedBusinesses } from '@/app/lib/auth/session';
import { requirePortalUser } from './lib/portal-auth';

const PORTAL_NAV = [
  { href: '/portal', label: 'Overview' },
  { href: '/portal/agents', label: 'Agents' },
  { href: '/portal/conversations', label: 'Conversations' },
  { href: '/portal/calls', label: 'Missed Calls' },
  { href: '/portal/videos', label: 'AI Videos' },
  { href: '/portal/settings', label: 'Settings' },
];

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = await requirePortalUser();
  const businesses = await getOwnedBusinesses(user.id);
  const defaultBusinessId = businesses[0]?.id;

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[220px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-4">
          <h1 className="mb-3 text-lg font-semibold text-slate-900">Client Portal</h1>
          <p className="mb-4 text-xs text-slate-500">Signed in: {user.email ?? user.id}</p>
          <p className="mb-4 text-xs text-slate-500">Businesses: {businesses.length}</p>
          <nav className="space-y-1">
            {PORTAL_NAV.map((item) => {
              const href = defaultBusinessId ? `${item.href}?businessId=${defaultBusinessId}` : item.href;
              return (
                <Link
                  key={item.href}
                  href={href}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="rounded-2xl border border-slate-200 bg-white p-6">{children}</main>
      </div>
    </div>
  );
}

