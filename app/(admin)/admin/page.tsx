import Link from 'next/link';
import {
  FiActivity,
  FiArrowRight,
  FiBriefcase,
  FiCpu,
  FiMessageSquare,
  FiShoppingBag,
} from 'react-icons/fi';
import { createAdminClient } from '@/app/lib/supabase/admin';
import { getAdminSession } from './lib/admin-auth';

export default async function AdminOverviewPage() {
  const session = await getAdminSession();

  if (!session.isAdmin) {
    return (
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-white">Platform Overview</h2>
        <p className="text-sm text-slate-300">
          Sign in as an admin user to access system-wide metrics and controls.
        </p>
      </div>
    );
  }

  const supabase = createAdminClient();
  const [
    { count: businessesCount },
    { count: agentsCount },
    { count: conversationsCount },
    { count: templatesCount },
    { count: purchasesCount },
  ] = await Promise.all([
    supabase.from('businesses').select('*', { count: 'exact', head: true }),
    supabase.from('agents').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('conversations').select('*', { count: 'exact', head: true }),
    supabase.from('agent_templates').select('*', { count: 'exact', head: true }),
    supabase
      .from('marketplace_purchases')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed'),
  ]);

  const cards = [
    {
      label: 'Businesses',
      helper: 'Registered tenants',
      value: businessesCount ?? 0,
      icon: FiBriefcase,
      tone: 'from-violet-500/35 to-indigo-500/15',
    },
    {
      label: 'Active Agents',
      helper: 'Live automations',
      value: agentsCount ?? 0,
      icon: FiCpu,
      tone: 'from-cyan-500/35 to-sky-500/15',
    },
    {
      label: 'Conversations',
      helper: 'Customer touchpoints',
      value: conversationsCount ?? 0,
      icon: FiMessageSquare,
      tone: 'from-fuchsia-500/35 to-violet-500/15',
    },
    {
      label: 'Templates',
      helper: 'Marketplace inventory',
      value: templatesCount ?? 0,
      icon: FiShoppingBag,
      tone: 'from-amber-500/35 to-rose-500/15',
    },
    {
      label: 'Completed Purchases',
      helper: 'Successful checkouts',
      value: purchasesCount ?? 0,
      icon: FiActivity,
      tone: 'from-emerald-500/35 to-cyan-500/15',
    },
  ];

  const quickActions = [
    {
      href: '/admin/businesses',
      label: 'Review Businesses',
      description: 'Inspect tenant details and subscriptions.',
      style:
        'border-violet-300/35 bg-gradient-to-r from-violet-500/25 to-indigo-500/20 text-white hover:from-violet-500/35 hover:to-indigo-500/30',
    },
    {
      href: '/admin/agents',
      label: 'Audit Agents',
      description: 'Validate active automations and business links.',
      style:
        'border-cyan-300/35 bg-gradient-to-r from-cyan-500/20 to-sky-500/15 text-cyan-50 hover:from-cyan-500/30 hover:to-sky-500/25',
    },
    {
      href: '/admin/conversations',
      label: 'Inspect Conversations',
      description: 'Review cross-tenant communication status.',
      style:
        'border-fuchsia-300/35 bg-gradient-to-r from-fuchsia-500/20 to-violet-500/15 text-fuchsia-50 hover:from-fuchsia-500/30 hover:to-violet-500/25',
    },
    {
      href: '/marketplace',
      label: 'Open Marketplace',
      description: 'Check live templates and listing quality.',
      style:
        'border-white/20 bg-white/[0.04] text-slate-100 hover:border-violet-300/35 hover:bg-violet-500/10',
    },
  ] as const;

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <span className="inline-flex items-center rounded-full border border-violet-300/35 bg-violet-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-100">
          Admin Overview
        </span>
        <h2 className="text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl xl:text-[2rem]">
          Platform Command Center
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
          Real-time performance snapshot across tenants, automations, and revenue-linked activity.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        {cards.map((card) => (
          <div
            key={card.label}
            className="min-w-0 rounded-2xl border border-white/10 bg-slate-900/55 p-4 shadow-[0_15px_35px_-22px_rgba(139,92,246,0.7)] sm:p-5"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="break-words text-sm font-semibold leading-snug text-slate-100">{card.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">{card.helper}</p>
              </div>
              <span className={`rounded-lg bg-gradient-to-br p-2 text-slate-100 ${card.tone}`}>
                <card.icon className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-5 text-2xl font-semibold tracking-tight text-white sm:text-[2rem]">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
        <div className="rounded-2xl border border-white/10 bg-slate-900/55 p-5 sm:p-6">
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">Quick Actions</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={`group rounded-xl border px-4 py-3.5 text-left transition-all ${action.style}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-base font-semibold leading-tight">{action.label}</p>
                  <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-200/85">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/55 p-5 sm:p-6">
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">Status Snapshot</h3>
          <div className="mt-4 space-y-3">
            {[
              { label: 'Business Coverage', value: `${businessesCount ?? 0} tenants tracked` },
              { label: 'Agent Runtime', value: `${agentsCount ?? 0} active automations` },
              { label: 'Conversation Pulse', value: `${conversationsCount ?? 0} conversations` },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-3">
                <p className="text-[11px] uppercase tracking-[0.13em] text-slate-400">{item.label}</p>
                <p className="mt-1.5 text-base font-semibold leading-tight text-slate-100">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
