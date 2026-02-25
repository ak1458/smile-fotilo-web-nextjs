import { Metadata } from 'next';
import { createAdminClient } from '@/app/lib/supabase/admin';
import { AgentTemplateCard, type AgentTemplateCardData } from './components/AgentTemplateCard';
import { CategoryFilter } from './components/CategoryFilter';
import { SearchBar } from './components/SearchBar';

export const metadata: Metadata = {
  title: 'AI Agent Marketplace',
  description: 'Browse and install ready-to-use AI agent templates for clinics, restaurants, retail, and local businesses.',
  alternates: {
    canonical: '/marketplace',
  },
};

export const dynamic = 'force-dynamic';

const CATEGORIES = [
  { id: 'all', name: 'All Templates' },
  { id: 'clinic', name: 'Clinics' },
  { id: 'restaurant', name: 'Restaurants' },
  { id: 'retail', name: 'Retail' },
  { id: 'real_estate', name: 'Real Estate' },
  { id: 'education', name: 'Education' },
  { id: 'other', name: 'Other' },
];

function asString(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function MarketplacePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const category = asString(params.category) ?? 'all';
  const search = asString(params.search) ?? '';
  const businessId = asString(params.businessId);

  let templates: AgentTemplateCardData[] = [];

  try {
    const supabase = createAdminClient();
    let query = supabase
      .from('agent_templates')
      .select(
        'id,slug,name,short_description,category,price_inr,downloads_count,rating_average,rating_count,is_featured,status,description'
      )
      .eq('status', 'published')
      .order('is_featured', { ascending: false })
      .order('downloads_count', { ascending: false })
      .limit(120);

    if (category !== 'all') {
      query = query.eq('category', category);
    }

    if (search) {
      const q = search.replace(/[^a-zA-Z0-9\s_-]/g, ' ').trim();
      if (q) {
        query = query.or(
          `name.ilike.%${q}%,description.ilike.%${q}%,short_description.ilike.%${q}%`
        );
      }
    }

    const { data } = await query;
    templates = (data ?? []).map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      short_description: row.short_description,
      category: row.category,
      price_inr: row.price_inr,
      downloads_count: row.downloads_count,
      rating_average: row.rating_average,
      rating_count: row.rating_count,
      is_featured: row.is_featured,
    }));
  } catch {
    templates = [];
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-cyan-700 to-blue-700 pb-14 pt-32 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-3xl font-semibold md:text-4xl">AI Agent Marketplace</h1>
          <p className="mt-3 max-w-3xl text-sm text-cyan-50 md:text-base">
            Browse ready-to-install templates for clinics and local businesses. Filter by category,
            search by use case, and install in minutes.
          </p>
          {!businessId && (
            <p className="mt-3 text-xs text-cyan-100">
              Tip: include <code>?businessId=your-uuid</code> to keep install flow pre-filled.
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 pb-28 pt-8 md:grid-cols-[220px_1fr] md:pb-8">
        <aside className="order-2 space-y-4 md:order-1">
          <CategoryFilter
            categories={CATEGORIES}
            activeCategory={category}
            search={search}
            businessId={businessId}
          />
        </aside>

        <main className="order-1 space-y-4 md:order-2">
          <SearchBar
            defaultValue={search}
            category={category}
            businessId={businessId}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {templates.map((template) => (
              <AgentTemplateCard
                key={template.id}
                template={template}
                businessId={businessId}
              />
            ))}
          </div>

          {!templates.length && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
              No templates found for the current filters.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
