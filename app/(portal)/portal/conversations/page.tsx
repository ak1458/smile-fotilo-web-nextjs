import Link from 'next/link';
import { createAdminClient } from '@/app/lib/supabase/admin';
import { requirePortalContext, resolvePortalBusinessId } from '../lib/portal-auth';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PortalConversationsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { user } = await requirePortalContext();
  const businessId = await resolvePortalBusinessId(user.id, params.businessId);

  if (!businessId) {
    return (
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-white">Conversations</h2>
        <p className="text-sm text-slate-300">No business found for your account.</p>
      </div>
    );
  }

  const supabase = createAdminClient();
  const { data: conversations } = await supabase
    .from('conversations')
    .select('id,customer_phone,source,status,last_message_at')
    .eq('business_id', businessId)
    .order('last_message_at', { ascending: false })
    .limit(80);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-white">Conversations</h2>
          <p className="mt-1 text-sm text-slate-400">Business id: {businessId}</p>
        </div>
        <Link
          href={`/portal/conversations?businessId=${businessId}`}
          prefetch={false}
          className="rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm font-medium text-slate-100 transition hover:border-violet-300/35 hover:bg-violet-500/10"
        >
          Refresh
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60">
        <div className="overflow-x-auto">
          <table className="min-w-[780px] divide-y divide-white/10">
            <thead className="bg-slate-900/95">
              <tr>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                  Customer
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
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 bg-slate-950/20">
              {(conversations ?? []).map((conversation) => (
                <tr key={conversation.id} className="transition-colors hover:bg-violet-500/10">
                  <td className="px-4 py-3.5 text-sm font-semibold text-slate-100 break-all">
                    {conversation.customer_phone}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-300">{conversation.source ?? 'unknown'}</td>
                  <td className="px-4 py-3.5 text-sm">
                    <span className="inline-flex rounded-full border border-slate-300/25 bg-slate-500/10 px-2.5 py-1 text-xs font-semibold text-slate-100">
                      {conversation.status ?? 'active'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-300">
                    {conversation.last_message_at ? new Date(conversation.last_message_at).toLocaleString('en-IN') : '-'}
                  </td>
                </tr>
              ))}
              {!conversations?.length && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-sm text-slate-400">
                    No conversations found.
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
