import { createAdminClient } from '@/app/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  let stats = {
    businesses: 0,
    agents: 0,
    conversations: 0,
    templates: 0,
  };

  try {
    const supabase = createAdminClient();
    const [b, a, c, t] = await Promise.all([
      supabase.from('businesses').select('*', { head: true, count: 'exact' }),
      supabase.from('agents').select('*', { head: true, count: 'exact' }),
      supabase.from('conversations').select('*', { head: true, count: 'exact' }),
      supabase.from('agent_templates').select('*', { head: true, count: 'exact' }),
    ]);

    stats = {
      businesses: b.count ?? 0,
      agents: a.count ?? 0,
      conversations: c.count ?? 0,
      templates: t.count ?? 0,
    };
  } catch {
    // Admin page should still render even before env setup.
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin Overview</h1>
        <p className="text-sm text-slate-500">High-level platform status.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Businesses" value={stats.businesses} />
        <StatCard label="Agents" value={stats.agents} />
        <StatCard label="Conversations" value={stats.conversations} />
        <StatCard label="Templates" value={stats.templates} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
