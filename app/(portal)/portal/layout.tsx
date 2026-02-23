import Link from 'next/link';

const portalNav = [
  { href: '/portal', label: 'Overview' },
  { href: '/portal/agents', label: 'Agents' },
  { href: '/portal/conversations', label: 'Conversations' },
  { href: '/portal/calls', label: 'Missed Calls' },
  { href: '/portal/videos', label: 'Videos' },
  { href: '/portal/settings', label: 'Settings' },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="mb-4 text-lg font-semibold">Client Portal</h2>
          <nav className="space-y-1">
            {portalNav.map((item) => (
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
