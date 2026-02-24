import Link from 'next/link';
import { createAdminClient } from '@/app/lib/supabase/admin';
import { getAdminSession } from '../lib/admin-auth';

type Row = {
  id: string;
  business_id: string;
  customer_phone: string;
  source: string | null;
  status: string | null;
  last_message_at: string | null;
};

export default async function AdminConversationsPage() {
  const session = await getAdminSession();
  if (!session.isAdmin) {
    return (
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-900">Conversations</h2>
        <p className="text-sm text-slate-600">Admin role is required to inspect all tenant conversations.</p>
      </div>
    );
  }

  const supabase = createAdminClient();
  const { data } = await supabase
    .from('conversations')
    .select('id,business_id,customer_phone,source,status,last_message_at')
    .order('last_message_at', { ascending: false })
    .limit(250);

  const rows = (data ?? []) as Row[];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Conversations</h2>
        <p className="text-sm text-slate-600">Recent multi-tenant conversations for operational review.</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Business
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Source
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Last Message
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-3 text-sm font-medium text-slate-900">{row.customer_phone}</td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  <code>{row.business_id}</code>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{row.source ?? 'unknown'}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{row.status ?? 'active'}</td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {row.last_message_at ? new Date(row.last_message_at).toLocaleString('en-IN') : '-'}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/portal/conversations?businessId=${row.business_id}`}
                    className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-700"
                  >
                    Open Tenant View
                  </Link>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">
                  No conversations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

