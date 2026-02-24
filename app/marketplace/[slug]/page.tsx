import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createAdminClient } from '@/app/lib/supabase/admin';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `AI Agent Template | Smile Fotilo Marketplace`,
    description: 'Browse AI agent templates for clinics and local businesses.',
    alternates: {
      canonical: `/marketplace/${slug}`,
    },
  };
}

export const dynamic = 'force-dynamic';

function asString(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function MarketplaceTemplatePage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const businessId = asString(query.businessId);

  let template:
    | {
        id: string;
        slug: string;
        name: string;
        description: string;
        short_description: string | null;
        category: string | null;
        price_inr: number | null;
        rating_average: number | null;
        rating_count: number | null;
        downloads_count: number | null;
        configuration: unknown;
      }
    | null = null;

  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('agent_templates')
      .select(
        'id,slug,name,description,short_description,category,price_inr,rating_average,rating_count,downloads_count,configuration'
      )
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();
    template = data;
  } catch {
    template = null;
  }

  if (!template) notFound();

  const installQuery = new URLSearchParams();
  if (businessId) installQuery.set('businessId', businessId);
  const installHref = installQuery.toString()
    ? `/marketplace/${template.slug}/install?${installQuery.toString()}`
    : `/marketplace/${template.slug}/install`;

  const configuration =
    template && template.configuration && typeof template.configuration === 'object' && !Array.isArray(template.configuration)
      ? (template.configuration as Record<string, unknown>)
      : {};
  const configPreview = Object.entries(configuration).slice(0, 8);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <Link href="/marketplace" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          Back to Marketplace
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {template.category ?? 'other'}
              </p>
              <h1 className="mt-1 text-3xl font-semibold text-slate-900">{template.name}</h1>
              <p className="mt-2 text-sm text-slate-600">
                {template.short_description ?? 'No short description available.'}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-right">
              <p className="text-xs uppercase tracking-wide text-slate-500">Price</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {template.price_inr && template.price_inr > 0 ? `INR ${template.price_inr}` : 'Free'}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Rating {(template.rating_average ?? 0).toFixed(1)} ({template.rating_count ?? 0}) |{' '}
                {template.downloads_count ?? 0} installs
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <section>
              <h2 className="text-sm font-semibold text-slate-900">Description</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                {template.description}
              </p>
            </section>

            <section>
              <h2 className="text-sm font-semibold text-slate-900">Configuration Snapshot</h2>
              {configPreview.length ? (
                <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                  {configPreview.map(([key, value]) => (
                    <div key={key} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                      <p className="text-xs uppercase tracking-wide text-slate-500">{key}</p>
                      <p className="mt-1 text-sm text-slate-700">{String(value)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-slate-500">No configuration details available.</p>
              )}
            </section>
          </div>

          <div className="mt-6 border-t border-slate-200 pt-4">
            <Link
              href={installHref}
              className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
            >
              Install Template
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
