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
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-white">Conversations</h2>
        <p className="text-sm text-slate-300">Admin role is required to inspect all tenant conversations.</p>
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
    <div className="space-y-7">
      <div className="space-y-4">
        <span className="inline-flex items-center rounded-full border border-fuchsia-300/35 bg-fuchsia-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-fuchsia-100">
          Conversations
        </span>
        <h2 className="text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl">
          Cross-Tenant Conversation Feed
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
          Monitor recent customer conversations to ensure response quality and system reliability.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] divide-y divide-white/10">
            <thead className="bg-slate-900/95">
              <tr>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                  Business
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                  Source
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                  Last Message
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 bg-slate-950/20">
              {rows.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-violet-500/10">
                  <td className="px-4 py-3.5 align-top text-sm font-semibold text-slate-100 break-all">{row.customer_phone}</td>
                  <td className="px-4 py-3.5 align-top text-sm text-slate-300">
                    <code className="rounded-md bg-black/25 px-2 py-1 text-xs text-slate-300 break-all">
                      {row.business_id}
                    </code>
                  </td>
                  <td className="px-4 py-3.5 align-top text-sm text-slate-300">{row.source ?? 'unknown'}</td>
                  <td className="px-4 py-3.5 align-top text-sm">
                    <span className="inline-flex rounded-full border border-slate-300/25 bg-slate-500/10 px-2.5 py-1 text-xs font-semibold text-slate-100">
                      {row.status ?? 'active'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 align-top text-sm text-slate-300">
                    {row.last_message_at ? new Date(row.last_message_at).toLocaleString('en-IN') : '-'}
                  </td>
                  <td className="px-4 py-3.5 text-right align-top">
                    <Link
                      href={`/portal/conversations?businessId=${row.business_id}`}
                      className="inline-flex items-center rounded-lg border border-violet-300/35 bg-violet-500/20 px-3 py-1.5 text-xs font-semibold text-violet-50 transition hover:bg-violet-500/30"
                    >
                      Open Tenant View
                    </Link>
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-400">
                    No conversations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/55 p-4 sm:p-5">
        <p className="text-[11px] uppercase tracking-[0.13em] text-slate-400">Total Results</p>
        <p className="mt-1.5 text-base font-semibold text-slate-100">{rows.length} conversations listed</p>
      </div>
    </div>
  );
}
