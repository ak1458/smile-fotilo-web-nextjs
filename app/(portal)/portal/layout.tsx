import Link from 'next/link';
import {
  FiHome,
  FiCpu,
  FiMessageSquare,
  FiPhoneCall,
  FiVideo,
  FiSettings,
  FiLogOut,
  FiBriefcase,
} from 'react-icons/fi';
import { signOutAction } from '@/app/actions/auth';
import { requirePortalContext } from './lib/portal-auth';

const PORTAL_NAV = [
  { href: '/portal', label: 'Overview', icon: FiHome },
  { href: '/portal/agents', label: 'Agents', icon: FiCpu },
  { href: '/portal/conversations', label: 'Conversations', icon: FiMessageSquare },
  { href: '/portal/calls', label: 'Missed Calls', icon: FiPhoneCall },
  { href: '/portal/videos', label: 'AI Videos', icon: FiVideo },
  { href: '/portal/settings', label: 'Settings', icon: FiSettings },
];

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const { user, businesses } = await requirePortalContext();
  const defaultBusinessId = businesses[0]?.id;

  return (
    <div className="portal-reset relative min-h-screen overflow-hidden bg-[#060b1a] text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-[-12%] h-[22rem] w-[22rem] rounded-full bg-cyan-500/20 blur-[120px]" />
        <div className="absolute bottom-[-9rem] right-[-10%] h-[24rem] w-[24rem] rounded-full bg-indigo-500/20 blur-[130px]" />
      </div>

      <div className="relative mx-auto grid w-full max-w-[1360px] grid-cols-1 gap-4 px-3 py-4 sm:gap-5 sm:px-6 sm:py-6 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:gap-7 lg:px-8">
        <aside className="rounded-3xl border border-cyan-200/20 bg-slate-950/70 p-4 backdrop-blur-xl sm:p-5 lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <h1 className="text-xl font-semibold tracking-tight text-white">Client Portal</h1>
            <p className="mt-1 text-sm text-slate-400">Business command center</p>

            <div className="mt-4 rounded-xl border border-white/10 bg-slate-900/75 px-3 py-2.5">
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Signed in</p>
              <p className="mt-1 break-all text-sm text-slate-200">{user.email ?? user.id}</p>
            </div>

            <div className="mt-3 rounded-xl border border-white/10 bg-slate-900/75 px-3 py-2.5">
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Business access</p>
              <p className="mt-1 text-sm text-slate-200">{businesses.length} active account(s)</p>
            </div>
          </div>

          {businesses.length > 1 && (
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] p-3">
              <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Businesses
              </p>
              <div className="mt-2 space-y-2">
                {businesses.slice(0, 6).map((business) => (
                  <div key={business.id} className="flex items-center gap-2 rounded-lg bg-slate-900/75 px-2.5 py-2">
                    <FiBriefcase className="h-3.5 w-3.5 text-cyan-200" />
                    <p className="truncate text-xs text-slate-200">{business.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <nav className="mt-4 space-y-2">
            {PORTAL_NAV.map((item) => {
              const href = defaultBusinessId ? `${item.href}?businessId=${defaultBusinessId}` : item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={href}
                  prefetch={false}
                  className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm font-medium text-slate-200 transition hover:border-cyan-300/35 hover:bg-cyan-500/10"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black/25 text-cyan-100">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-5 border-t border-white/10 pt-4">
            <form action={signOutAction}>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2.5 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/20"
              >
                <FiLogOut className="h-4 w-4" />
                Sign Out
              </button>
            </form>
          </div>
        </aside>

        <main className="min-w-0 rounded-3xl border border-cyan-200/20 bg-slate-950/70 p-4 backdrop-blur-xl sm:p-6 xl:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
