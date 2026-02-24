import Link from 'next/link';
import { createAdminClient } from '@/app/lib/supabase/admin';
import { getAdminSession } from './lib/admin-auth';

export default async function AdminOverviewPage() {
  const session = await getAdminSession();

  if (!session.isAdmin) {
    return (
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-900">Platform Overview</h2>
        <p className="text-sm text-slate-600">
          Sign in as an admin user to access system-wide metrics and controls.
        </p>
      </div>
    );
  }

  const supabase = createAdminClient();
  const [
    { count: businessesCount },
    { count: agentsCount },
    { count: conversationsCount },
    { count: templatesCount },
    { count: purchasesCount },
  ] = await Promise.all([
    supabase.from('businesses').select('*', { count: 'exact', head: true }),
    supabase.from('agents').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('conversations').select('*', { count: 'exact', head: true }),
    supabase.from('agent_templates').select('*', { count: 'exact', head: true }),
    supabase
      .from('marketplace_purchases')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed'),
  ]);

  const cards = [
    { label: 'Businesses', value: businessesCount ?? 0 },
    { label: 'Active Agents', value: agentsCount ?? 0 },
    { label: 'Conversations', value: conversationsCount ?? 0 },
    { label: 'Templates', value: templatesCount ?? 0 },
    { label: 'Completed Purchases', value: purchasesCount ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Platform Overview</h2>
        <p className="text-sm text-slate-600">High-level metrics across all tenants.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-slate-900">Quick Actions</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/admin/businesses"
            className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white"
          >
            Review Businesses
          </Link>
          <Link
            href="/admin/agents"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
          >
            Audit Agents
          </Link>
          <Link
            href="/admin/conversations"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
          >
            Inspect Conversations
          </Link>
          <Link
            href="/marketplace"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
          >
            Open Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}

