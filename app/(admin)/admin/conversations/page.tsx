import { createAdminClient } from '@/app/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export default async function AdminConversationsPage() {
  let conversations: Array<{
    id: string;
    business_id: string;
    customer_phone: string;
    source: string | null;
    status: string | null;
    last_message_at: string | null;
  }> = [];

  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('conversations')
      .select('id,business_id,customer_phone,source,status,last_message_at')
      .order('last_message_at', { ascending: false })
      .limit(100);
    conversations = data ?? [];
  } catch {
    conversations = [];
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Conversations</h1>
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Business</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Last message</th>
            </tr>
          </thead>
          <tbody>
            {conversations.map((c) => (
              <tr key={c.id} className="border-t border-slate-200">
                <td className="px-4 py-3">{c.customer_phone}</td>
                <td className="px-4 py-3">{c.business_id}</td>
                <td className="px-4 py-3">{c.source ?? '-'}</td>
                <td className="px-4 py-3">{c.status ?? '-'}</td>
                <td className="px-4 py-3">{c.last_message_at ? new Date(c.last_message_at).toLocaleString() : '-'}</td>
              </tr>
            ))}
            {conversations.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-slate-500" colSpan={5}>
                  No conversations yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
