import Link from 'next/link';
import { createAdminClient } from '@/app/lib/supabase/admin';
import { requirePortalUser, resolvePortalBusinessId } from '../lib/portal-auth';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PortalAgentsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const user = await requirePortalUser();
  const businessId = await resolvePortalBusinessId(user.id, params.businessId);

  if (!businessId) {
    return (
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-slate-900">Agents</h2>
        <p className="text-sm text-slate-600">No business found for your account.</p>
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
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Agents</h2>
          <p className="text-sm text-slate-600">Business id: {businessId}</p>
        </div>
        <Link
          href={`/marketplace?businessId=${businessId}`}
          className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white"
        >
          Install from Marketplace
        </Link>
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
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Created
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {(agents ?? []).map((agent) => (
              <tr key={agent.id}>
                <td className="px-4 py-3 text-sm font-medium text-slate-900">{agent.name}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{agent.type ?? 'custom'}</td>
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
                <td className="px-4 py-3 text-right text-sm">
                  <Link
                    href={`/portal/conversations?businessId=${businessId}`}
                    className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-700"
                  >
                    View Chats
                  </Link>
                </td>
              </tr>
            ))}
            {!agents?.length && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                  No agents installed yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
