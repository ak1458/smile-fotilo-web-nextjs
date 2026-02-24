import Link from 'next/link';
import { createAdminClient } from '@/app/lib/supabase/admin';
import { requirePortalUser, resolvePortalBusinessId } from './lib/portal-auth';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PortalDashboardPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const user = await requirePortalUser();
  const businessId = await resolvePortalBusinessId(user.id, params.businessId);

  if (!businessId) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">Portal Overview</h2>
        <p className="text-sm text-slate-600">No business found for your account.</p>
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
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-900">Portal Overview</h2>
        <p className="text-sm text-red-700">Business not found for this id.</p>
      </div>
    );
  }

  const cards = [
    { label: 'Active Agents', value: agentsCount ?? 0 },
    { label: 'Total Conversations', value: conversationsCount ?? 0 },
    { label: 'Appointments', value: appointmentsCount ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">{business.name}</h2>
        <p className="mt-1 text-sm text-slate-600">
          Category: {business.category ?? 'other'} | Language: {business.language_preference ?? 'hi-EN'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-slate-900">Quick Actions</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href={`/portal/agents?businessId=${business.id}`}
            className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white"
          >
            Manage Agents
          </Link>
          <Link
            href={`/portal/conversations?businessId=${business.id}`}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
          >
            View Conversations
          </Link>
          <Link
            href={`/portal/calls?businessId=${business.id}`}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
          >
            Missed Calls
          </Link>
          <Link
            href={`/portal/videos?businessId=${business.id}`}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
          >
            Generate Video Script
          </Link>
        </div>
      </div>
    </div>
  );
}
