import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createAdminClient } from '@/app/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export default async function MarketplaceTemplatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let template:
    | {
        id: string;
        slug: string;
        name: string;
        description: string;
        price_inr: number | null;
        category: string | null;
      }
    | null = null;

  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('agent_templates')
      .select('id,slug,name,description,price_inr,category')
      .eq('slug', slug)
      .maybeSingle();
    template = data;
  } catch {
    template = null;
  }

  if (!template) notFound();

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-xs uppercase tracking-wide text-slate-500">{template.category ?? 'other'}</p>
        <h1 className="text-3xl font-semibold text-slate-900">{template.name}</h1>
        <p className="text-sm leading-relaxed text-slate-700">{template.description}</p>
        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <p className="text-sm text-slate-600">
            Price: <span className="font-medium text-slate-900">{template.price_inr && template.price_inr > 0 ? `INR ${template.price_inr}` : 'Free'}</span>
          </p>
          <Link href={`/marketplace/${template.slug}/install`} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">
            Install Template
          </Link>
        </div>
      </div>
    </div>
  );
}