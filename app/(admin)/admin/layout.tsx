import Link from 'next/link';

const adminNav = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/businesses', label: 'Businesses' },
  { href: '/admin/agents', label: 'Agents' },
  { href: '/admin/conversations', label: 'Conversations' },
  { href: '/admin/marketplace', label: 'Marketplace' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="mb-4 text-lg font-semibold">Admin</h2>
          <nav className="space-y-1">
            {adminNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="rounded-2xl border border-slate-200 bg-white p-6">{children}</main>
      </div>
    </div>
  );
}
