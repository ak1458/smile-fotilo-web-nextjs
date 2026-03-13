import Link from 'next/link';
import { createAdminClient } from '@/app/lib/supabase/admin';
import { requirePortalContext, resolvePortalBusinessId } from '../lib/portal-auth';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function asString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function statusClass(status: string | null) {
  if (status === 'converted') return 'border-emerald-300/35 bg-emerald-500/15 text-emerald-100';
  if (status === 'whatsapp_sent') return 'border-cyan-300/35 bg-cyan-500/15 text-cyan-100';
  if (status === 'replied') return 'border-violet-300/35 bg-violet-500/15 text-violet-100';
  if (status === 'failed') return 'border-rose-300/35 bg-rose-500/15 text-rose-100';
  return 'border-amber-300/35 bg-amber-500/15 text-amber-100';
}

export default async function PortalCallsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { user } = await requirePortalContext();
  const businessId = await resolvePortalBusinessId(user.id, params.businessId);
  const filter = asString(params.status) ?? 'all';
  const statuses = ['all', 'pending', 'whatsapp_sent', 'replied', 'converted', 'failed'] as const;

  if (!businessId) {
    return (
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-white">Missed Calls</h2>
        <p className="text-sm text-slate-300">No business found for your account.</p>
      </div>
    );
  }

  const supabase = createAdminClient();
  let query = supabase
    .from('missed_calls')
    .select('id,caller_number,call_time,recovery_status,customer_response')
    .eq('business_id', businessId)
    .order('call_time', { ascending: false })
    .limit(200);

  if (filter !== 'all') {
    query = query.eq('recovery_status', filter);
  }

  const { data: calls } = await query;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-white">Missed Calls</h2>
          <p className="mt-1 text-sm text-slate-400">Business id: {businessId}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <Link
              key={status}
              href={`/portal/calls?businessId=${businessId}&status=${status}`}
              prefetch={false}
              className={`rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                filter === status
                  ? 'border-cyan-300/35 bg-cyan-500/20 text-cyan-50'
                  : 'border-white/15 bg-white/[0.02] text-slate-200 hover:border-cyan-300/35 hover:bg-cyan-500/10'
              }`}
            >
              {status.replace('_', ' ')}
            </Link>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60">
        <div className="overflow-x-auto">
          <table className="min-w-[860px] divide-y divide-white/10">
            <thead className="bg-slate-900/95">
              <tr>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                  Caller
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                  Time
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                  Response
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 bg-slate-950/20">
              {(calls ?? []).map((call) => (
                <tr key={call.id} className="transition-colors hover:bg-violet-500/10">
                  <td className="px-4 py-3.5 text-sm font-semibold text-slate-100 break-all">{call.caller_number}</td>
                  <td className="px-4 py-3.5 text-sm text-slate-300">{new Date(call.call_time).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3.5 text-sm">
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass(call.recovery_status)}`}>
                      {call.recovery_status ?? 'pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-300">{call.customer_response ?? '-'}</td>
                  <td className="px-4 py-3.5 text-right">
                    <a
                      href={`https://wa.me/${call.caller_number.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-white/15 bg-white/[0.02] px-2.5 py-1.5 text-xs font-semibold text-slate-100 transition hover:border-cyan-300/35 hover:bg-cyan-500/10"
                    >
                      Follow up
                    </a>
                  </td>
                </tr>
              ))}
              {!calls?.length && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-400">
                    No missed calls found.
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
