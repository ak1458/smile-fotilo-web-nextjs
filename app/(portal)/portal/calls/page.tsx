'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/app/lib/supabase/client';

type MissedCall = {
  id: string;
  caller_number: string;
  call_time: string;
  recovery_status: string | null;
  customer_response: string | null;
};

function statusClass(status: string | null) {
  if (status === 'converted') return 'bg-emerald-100 text-emerald-700';
  if (status === 'whatsapp_sent') return 'bg-blue-100 text-blue-700';
  if (status === 'replied') return 'bg-violet-100 text-violet-700';
  if (status === 'failed') return 'bg-red-100 text-red-700';
  return 'bg-amber-100 text-amber-700';
}

function PortalCallsContent() {
  const searchParams = useSearchParams();
  const businessId = useMemo(() => searchParams.get('businessId') ?? '', [searchParams]);
  const [filter, setFilter] = useState('all');
  const [calls, setCalls] = useState<MissedCall[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!businessId) return;
    void loadCalls(businessId, filter);
  }, [businessId, filter]);

  useEffect(() => {
    if (!businessId) return;

    let cleanup = () => {};
    try {
      const supabase = createClient();
      const channel = supabase
        .channel(`missed-calls-${businessId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'missed_calls',
            filter: `business_id=eq.${businessId}`,
          },
          (payload) => {
            setCalls((prev) => [payload.new as MissedCall, ...prev]);
          }
        )
        .subscribe();

      cleanup = () => {
        supabase.removeChannel(channel);
      };
    } catch {
      cleanup = () => {};
    }

    return cleanup;
  }, [businessId]);

  async function loadCalls(targetBusinessId: string, targetFilter: string) {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      let query = supabase
        .from('missed_calls')
        .select('id,caller_number,call_time,recovery_status,customer_response')
        .eq('business_id', targetBusinessId)
        .order('call_time', { ascending: false })
        .limit(200);

      if (targetFilter !== 'all') {
        query = query.eq('recovery_status', targetFilter);
      }

      const { data, error: queryError } = await query;
      if (queryError) {
        setError(queryError.message);
        setCalls([]);
      } else {
        setCalls(data ?? []);
      }
    } catch {
      setError('Failed to load missed calls');
      setCalls([]);
    } finally {
      setLoading(false);
    }
  }

  function openWhatsApp(number: string) {
    const digits = number.replace(/\D/g, '');
    window.open(`https://wa.me/${digits}`, '_blank');
  }

  if (!businessId) {
    return (
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-900">Missed Calls</h2>
        <p className="text-sm text-slate-600">Pass <code>businessId</code> in URL to load missed-call history.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Missed Calls</h2>
          <p className="text-sm text-slate-600">Business id: {businessId}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'whatsapp_sent', 'replied', 'converted', 'failed'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wide ${
                filter === status ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Caller
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Response
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {calls.map((call) => (
              <tr key={call.id}>
                <td className="px-4 py-3 text-sm font-medium text-slate-900">{call.caller_number}</td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {new Date(call.call_time).toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(call.recovery_status)}`}>
                    {call.recovery_status ?? 'pending'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{call.customer_response ?? '-'}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => openWhatsApp(call.caller_number)}
                    className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Follow up
                  </button>
                </td>
              </tr>
            ))}
            {!calls.length && !loading && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                  No missed calls found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {loading && <p className="text-sm text-slate-500">Loading calls...</p>}
    </div>
  );
}

export default function PortalCallsPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Loading missed-call dashboard...</p>}>
      <PortalCallsContent />
    </Suspense>
  );
}
