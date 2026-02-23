import { createAdminClient } from '@/app/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export default async function AdminAgentsPage() {
  let agents: Array<{ id: string; name: string; type: string | null; business_id: string | null; is_active: boolean | null }> = [];

  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('agents')
      .select('id,name,type,business_id,is_active')
      .order('created_at', { ascending: false })
      .limit(100);
    agents = data ?? [];
  } catch {
    agents = [];
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Agents</h1>
      <div className="space-y-2">
        {agents.map((agent) => (
          <div key={agent.id} className="rounded-xl border border-slate-200 p-4">
            <p className="font-medium">{agent.name}</p>
            <p className="text-xs text-slate-500">
              Type: {agent.type ?? '-'} | Business: {agent.business_id ?? '-'} | Active:{' '}
              {agent.is_active ? 'Yes' : 'No'}
            </p>
          </div>
        ))}
        {agents.length === 0 && <p className="text-sm text-slate-500">No agents yet.</p>}
      </div>
    </div>
  );
}
