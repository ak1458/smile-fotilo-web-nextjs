import Link from 'next/link';
import { createAdminClient } from '@/app/lib/supabase/admin';
import { FiArrowRight, FiCalendar, FiCpu, FiMessageSquare } from 'react-icons/fi';
import { requirePortalContext, resolvePortalBusinessId } from './lib/portal-auth';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PortalDashboardPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { user } = await requirePortalContext();
  const businessId = await resolvePortalBusinessId(user.id, params.businessId);

  if (!businessId) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Portal Overview</h2>
        <p className="text-sm text-slate-300">No business found for your account.</p>
      </div>
    );
  }

  const supabase = createAdminClient();
  const [{ data: business }, { count: agentsCount }, { count: conversationsCount }, { count: appointmentsCount }] =
    await Promise.all([
      supabase
        .from('businesses')
        .select('id,name,category,language_preference')
        .eq('id', businessId)
        .maybeSingle(),
      supabase
        .from('agents')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', businessId)
        .eq('is_active', true),
      supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', businessId),
      supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', businessId),
    ]);

  if (!business) {
    return (
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-white">Portal Overview</h2>
        <p className="text-sm text-rose-300">Business not found for this id.</p>
      </div>
    );
  }

  const cards = [
    {
      label: 'Active Agents',
      helper: 'Running automations',
      value: agentsCount ?? 0,
      icon: FiCpu,
      tone: 'from-cyan-500/35 to-sky-500/15',
    },
    {
      label: 'Total Conversations',
      helper: 'Customer touchpoints',
      value: conversationsCount ?? 0,
      icon: FiMessageSquare,
      tone: 'from-violet-500/35 to-fuchsia-500/15',
    },
    {
      label: 'Appointments',
      helper: 'Booked opportunities',
      value: appointmentsCount ?? 0,
      icon: FiCalendar,
      tone: 'from-emerald-500/35 to-cyan-500/15',
    },
  ];

  return (
    <div className="space-y-7">
      <div className="space-y-3">
        <span className="inline-flex items-center rounded-full border border-cyan-300/35 bg-cyan-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-100">
          Portal Overview
        </span>
        <h2 className="text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl">{business.name}</h2>
        <p className="text-sm text-slate-300 sm:text-base">
          Category: {business.category ?? 'other'} | Language: {business.language_preference ?? 'hi-EN'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-white/10 bg-slate-900/55 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-slate-100">{card.label}</p>
                <p className="mt-1 text-xs text-slate-400">{card.helper}</p>
              </div>
              <span className={`rounded-lg bg-gradient-to-br p-2 text-slate-100 ${card.tone}`}>
                <card.icon className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-white">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/55 p-5 sm:p-6">
        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">Quick Actions</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href={`/portal/agents?businessId=${business.id}`}
            prefetch={false}
            className="inline-flex items-center gap-2 rounded-lg border border-cyan-300/35 bg-cyan-500/20 px-3 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-500/30"
          >
            Manage Agents
            <FiArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={`/portal/conversations?businessId=${business.id}`}
            prefetch={false}
            className="rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm font-medium text-slate-100 transition hover:border-violet-300/35 hover:bg-violet-500/10"
          >
            View Conversations
          </Link>
          <Link
            href={`/portal/calls?businessId=${business.id}`}
            prefetch={false}
            className="rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm font-medium text-slate-100 transition hover:border-violet-300/35 hover:bg-violet-500/10"
          >
            Missed Calls
          </Link>
          <Link
            href={`/portal/videos?businessId=${business.id}`}
            prefetch={false}
            className="rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm font-medium text-slate-100 transition hover:border-violet-300/35 hover:bg-violet-500/10"
          >
            Generate Video Script
          </Link>
        </div>
      </div>
    </div>
  );
}
