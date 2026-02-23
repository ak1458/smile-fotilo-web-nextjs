import { createAdminClient } from '@/app/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export default async function PortalConversationsPage() {
  let rows: Array<{ id: string; customer_phone: string; status: string | null; source: string | null; last_message_at: string | null }> = [];
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('conversations')
      .select('id,customer_phone,status,source,last_message_at')
      .order('last_message_at', { ascending: false })
      .limit(100);
    rows = data ?? [];
  } catch {
    rows = [];
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Conversations</h1>
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.id} className="rounded-xl border border-slate-200 p-4">
            <p className="font-medium">{row.customer_phone}</p>
            <p className="text-xs text-slate-500">
              {row.source ?? '-'} | {row.status ?? '-'} | {row.last_message_at ? new Date(row.last_message_at).toLocaleString() : '-'}
            </p>
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-slate-500">No conversations found.</p>}
      </div>
    </div>
  );
}
