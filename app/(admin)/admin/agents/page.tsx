import { createAdminClient } from '@/app/lib/supabase/admin';
import { getAdminSession } from '../lib/admin-auth';

export default async function AdminAgentsPage() {
  const session = await getAdminSession();
  if (!session.isAdmin) {
    return (
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-white">Agents</h2>
        <p className="text-sm text-slate-300">Admin role is required to audit all agents.</p>
      </div>
    );
  }

  const supabase = createAdminClient();
  const { data: agents } = await supabase
    .from('agents')
    .select('id,name,type,is_active,business_id,created_at')
    .order('created_at', { ascending: false })
    .limit(300);

  return (
    <div className="space-y-7">
      <div className="space-y-4">
        <span className="inline-flex items-center rounded-full border border-violet-300/35 bg-violet-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-100">
          Agents
        </span>
        <h2 className="text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl">
          Automation Inventory
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
          Operational view of all AI agents deployed across businesses.
        </p>
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
                  Business
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 bg-slate-950/20">
              {(agents ?? []).map((agent) => (
                <tr key={agent.id} className="transition-colors hover:bg-violet-500/10">
                  <td className="px-4 py-3.5 align-top text-sm font-semibold text-slate-100">{agent.name}</td>
                  <td className="px-4 py-3.5 align-top text-sm text-slate-300">{agent.type ?? 'custom'}</td>
                  <td className="px-4 py-3.5 align-top text-sm text-slate-300">
                    <code className="rounded-md bg-black/25 px-2 py-1 text-xs text-slate-300 break-all">
                      {agent.business_id ?? '-'}
                    </code>
                  </td>
                  <td className="px-4 py-3.5 align-top text-sm">
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
                  <td className="px-4 py-3.5 align-top text-sm text-slate-300">
                    {agent.created_at ? new Date(agent.created_at).toLocaleString('en-IN') : '-'}
                  </td>
                </tr>
              ))}
              {!agents?.length && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-400">
                    No agents found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/55 p-4 sm:p-5">
        <p className="text-[11px] uppercase tracking-[0.13em] text-slate-400">Total Results</p>
        <p className="mt-1.5 text-base font-semibold text-slate-100">{agents?.length ?? 0} agents listed</p>
      </div>
    </div>
  );
}
