'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { IconType } from 'react-icons';
import { FiCpu, FiGrid, FiLogOut, FiMessageSquare, FiShield, FiUsers } from 'react-icons/fi';
import { signOutAction } from '@/app/actions/auth';

type AdminShellProps = {
  children: ReactNode;
  sessionEmail: string | null;
};

type NavItem = {
  href: '/admin' | '/admin/businesses' | '/admin/agents' | '/admin/conversations';
  label: string;
  subtitle: string;
  icon: IconType;
};

const NAV_ITEMS: NavItem[] = [
  {
    href: '/admin',
    label: 'Overview',
    subtitle: 'Live platform metrics',
    icon: FiGrid,
  },
  {
    href: '/admin/businesses',
    label: 'Businesses',
    subtitle: 'Tenant management',
    icon: FiUsers,
  },
  {
    href: '/admin/agents',
    label: 'Agents',
    subtitle: 'Automation inventory',
    icon: FiCpu,
  },
  {
    href: '/admin/conversations',
    label: 'Conversations',
    subtitle: 'Cross-tenant review',
    icon: FiMessageSquare,
  },
];

function isActiveRoute(pathname: string, href: NavItem['href']) {
  if (href === '/admin') {
    return pathname === '/admin';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function navItemClasses(active: boolean) {
  if (active) {
    return 'border-violet-300/40 bg-gradient-to-r from-violet-500/25 via-indigo-500/15 to-cyan-400/10 text-white shadow-[0_16px_35px_-18px_rgba(139,92,246,0.9)]';
  }

  return 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-violet-300/30 hover:bg-violet-500/10';
}

function mobileNavItemClasses(active: boolean) {
  if (active) {
    return 'border-violet-300/40 bg-violet-500/25 text-white';
  }

  return 'border-white/15 bg-slate-950/80 text-slate-300 hover:border-violet-300/30';
}

export default function AdminShell({ children, sessionEmail }: AdminShellProps) {
  const pathname = usePathname();

  return (
    <div className="admin-reset relative min-h-screen overflow-hidden bg-[#050112] text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-[-12%] h-[25rem] w-[25rem] rounded-full bg-violet-600/25 blur-[110px]" />
        <div className="absolute bottom-[-8rem] right-[-10%] h-[22rem] w-[22rem] rounded-full bg-cyan-500/20 blur-[120px]" />
      </div>

      <div className="relative mx-auto grid w-full max-w-[1360px] grid-cols-1 gap-4 px-3 py-4 sm:gap-5 sm:px-6 sm:py-6 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:gap-7 lg:px-8">
        <aside className="hidden self-start rounded-3xl border border-violet-200/20 bg-slate-950/70 p-5 backdrop-blur-xl lg:sticky lg:top-6 lg:flex lg:flex-col">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/20 text-violet-200">
                <FiShield className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-semibold tracking-tight text-white">Admin Console</h1>
                <p className="text-sm text-slate-400">Platform control center</p>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Signed in as</p>
              <p className="mt-1 break-all text-sm text-slate-200">
                {sessionEmail ?? 'Signed in session unavailable'}
              </p>
            </div>
          </div>

          <nav className="mt-5 space-y-2.5">
            {NAV_ITEMS.map((item) => {
              const active = isActiveRoute(pathname, item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`group flex items-start gap-3 rounded-2xl border px-3 py-3.5 transition-all duration-200 ${navItemClasses(
                    active,
                  )}`}
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/20 text-base text-slate-100">
                    <Icon />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold leading-tight">{item.label}</span>
                    <span className="mt-1 block text-xs leading-tight text-slate-400 group-hover:text-slate-300">
                      {item.subtitle}
                    </span>
                  </span>
                </Link>
              );
            })}
          </nav>

          <form action={signOutAction} className="mt-6 border-t border-white/10 pt-4">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2.5 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/20"
            >
              <FiLogOut className="h-4 w-4" />
              Sign Out
            </button>
          </form>
        </aside>

        <div className="min-w-0 space-y-3 sm:space-y-4">
          <div className="rounded-2xl border border-violet-200/20 bg-slate-950/65 p-3 backdrop-blur-xl lg:hidden">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/20 text-violet-200">
                  <FiShield className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-base font-semibold tracking-tight text-white">Admin Console</h1>
                  <p className="text-xs text-slate-400">Platform control center</p>
                </div>
              </div>

              <form action={signOutAction}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-rose-400/30 bg-rose-500/10 px-2.5 py-1.5 text-xs font-semibold text-rose-100"
                >
                  <FiLogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </form>
            </div>
            <div className="mt-3 rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Signed in as</p>
              <p className="mt-1 break-all text-xs text-slate-200">{sessionEmail ?? 'Signed in session unavailable'}</p>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto rounded-2xl border border-violet-200/20 bg-slate-950/55 p-2 lg:hidden">
            {NAV_ITEMS.map((item) => {
              const active = isActiveRoute(pathname, item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`flex min-w-[9.5rem] items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition ${mobileNavItemClasses(active)}`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <main className="min-w-0 rounded-3xl border border-violet-200/20 bg-slate-950/70 p-4 backdrop-blur-xl sm:p-6 xl:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
