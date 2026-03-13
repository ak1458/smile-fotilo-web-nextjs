import Link from 'next/link';
import { createAdminClient } from '@/app/lib/supabase/admin';
import { requirePortalContext, resolvePortalBusinessId } from '../lib/portal-auth';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PortalAgentsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { user } = await requirePortalContext();
  const businessId = await resolvePortalBusinessId(user.id, params.businessId);

  if (!businessId) {
    return (
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-white">Agents</h2>
        <p className="text-sm text-slate-300">No business found for your account.</p>
      </div>
    );
  }

  const supabase = createAdminClient();
  const { data: agents } = await supabase
    .from('agents')
    .select('id,name,type,is_active,created_at')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-white">Agents</h2>
          <p className="mt-1 text-sm text-slate-400">Business id: {businessId}</p>
        </div>
        <Link
          href={`/marketplace?businessId=${businessId}`}
          prefetch={false}
          className="rounded-lg border border-cyan-300/35 bg-cyan-500/20 px-3 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-500/30"
        >
          Install from Marketplace
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60">
        <div className="overflow-x-auto">
          <table className="min-w-[760px] divide-y divide-white/10">
            <thead className="bg-slate-900/95">
            <tr>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                Name
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                Type
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                Status
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                Created
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                Actions
              </th>
            </tr>
            </thead>
            <tbody className="divide-y divide-white/10 bg-slate-950/20">
            {(agents ?? []).map((agent) => (
              <tr key={agent.id} className="transition-colors hover:bg-violet-500/10">
                <td className="px-4 py-3.5 text-sm font-semibold text-slate-100">{agent.name}</td>
                <td className="px-4 py-3.5 text-sm text-slate-300">{agent.type ?? 'custom'}</td>
                <td className="px-4 py-3.5 text-sm">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                      agent.is_active
                        ? 'border-emerald-300/35 bg-emerald-500/15 text-emerald-100'
                        : 'border-slate-300/20 bg-slate-500/10 text-slate-200'
                    }`}
                  >
                    {agent.is_active ? 'active' : 'inactive'}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-sm text-slate-300">
                  {agent.created_at ? new Date(agent.created_at).toLocaleString('en-IN') : '-'}
                </td>
                <td className="px-4 py-3.5 text-right text-sm">
                  <Link
                    href={`/portal/conversations?businessId=${businessId}`}
                    prefetch={false}
                    className="rounded-lg border border-white/15 bg-white/[0.02] px-2.5 py-1.5 text-xs font-semibold text-slate-100 transition hover:border-violet-300/35 hover:bg-violet-500/10"
                  >
                    View Chats
                  </Link>
                </td>
              </tr>
            ))}
            {!agents?.length && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-400">
                  No agents installed yet.
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
