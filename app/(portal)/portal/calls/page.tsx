import { createAdminClient } from '@/app/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export default async function PortalCallsPage() {
  let calls: Array<{ id: string; caller_number: string; recovery_status: string | null; call_time: string }> = [];
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('missed_calls')
      .select('id,caller_number,recovery_status,call_time')
      .order('call_time', { ascending: false })
      .limit(100);
    calls = data ?? [];
  } catch {
    calls = [];
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Missed Calls</h1>
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">Caller</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Time</th>
            </tr>
          </thead>
          <tbody>
            {calls.map((call) => (
              <tr key={call.id} className="border-t border-slate-200">
                <td className="px-4 py-3">{call.caller_number}</td>
                <td className="px-4 py-3">{call.recovery_status ?? 'pending'}</td>
                <td className="px-4 py-3">{new Date(call.call_time).toLocaleString()}</td>
              </tr>
            ))}
            {calls.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-slate-500" colSpan={3}>No missed calls recorded.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
