import Link from 'next/link';
import { createAdminClient } from '@/app/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export default async function MarketplacePage() {
  let templates: Array<{
    id: string;
    slug: string;
    name: string;
    short_description: string | null;
    category: string | null;
    price_inr: number | null;
    downloads_count: number | null;
  }> = [];

  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('agent_templates')
      .select('id,slug,name,short_description,category,price_inr,downloads_count')
      .in('status', ['published', 'draft'])
      .order('downloads_count', { ascending: false })
      .limit(100);

    templates = data ?? [];
  } catch {
    templates = [];
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-900">AI Agent Marketplace</h1>
          <p className="text-sm text-slate-600">Install ready-made agent templates for clinics and local businesses.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {templates.map((template) => (
            <Link
              key={template.id}
              href={`/marketplace/${template.slug}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"
            >
              <p className="text-xs uppercase tracking-wide text-slate-500">{template.category ?? 'other'}</p>
              <h2 className="mt-2 text-lg font-semibold text-slate-900">{template.name}</h2>
              <p className="mt-2 text-sm text-slate-600">{template.short_description ?? 'No short description yet.'}</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-slate-500">Downloads: {template.downloads_count ?? 0}</span>
                <span className="font-medium text-slate-900">
                  {template.price_inr && template.price_inr > 0 ? `INR ${template.price_inr}` : 'Free'}
                </span>
              </div>
            </Link>
          ))}
          {templates.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
              No templates yet. Create one from the admin panel or API.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}