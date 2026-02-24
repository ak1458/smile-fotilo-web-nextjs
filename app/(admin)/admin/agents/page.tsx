import { createAdminClient } from '@/app/lib/supabase/admin';
import { getAdminSession } from '../lib/admin-auth';

export default async function AdminAgentsPage() {
  const session = await getAdminSession();
  if (!session.isAdmin) {
    return (
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-900">Agents</h2>
        <p className="text-sm text-slate-600">Admin role is required to audit all agents.</p>
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
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Agents</h2>
        <p className="text-sm text-slate-600">All AI agents deployed across tenants.</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Business
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Created
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {(agents ?? []).map((agent) => (
              <tr key={agent.id}>
                <td className="px-4 py-3 text-sm font-medium text-slate-900">{agent.name}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{agent.type ?? 'custom'}</td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  <code>{agent.business_id ?? '-'}</code>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      agent.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {agent.is_active ? 'active' : 'inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {agent.created_at ? new Date(agent.created_at).toLocaleString('en-IN') : '-'}
                </td>
              </tr>
            ))}
            {!agents?.length && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                  No agents found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

