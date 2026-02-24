import Link from 'next/link';

export type AgentTemplateCardData = {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  category: string | null;
  price_inr: number | null;
  downloads_count: number | null;
  rating_average: number | null;
  rating_count: number | null;
  is_featured: boolean | null;
};

type Props = {
  template: AgentTemplateCardData;
  businessId?: string;
};

function buildTemplateHref(slug: string, businessId?: string) {
  const query = new URLSearchParams();
  if (businessId) query.set('businessId', businessId);
  const qs = query.toString();
  return qs ? `/marketplace/${slug}?${qs}` : `/marketplace/${slug}`;
}

export function AgentTemplateCard({ template, businessId }: Props) {
  return (
    <Link
      href={buildTemplateHref(template.slug, businessId)}
      className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
          {template.category ?? 'other'}
        </span>
        {template.is_featured && (
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
            Featured
          </span>
        )}
      </div>

      <h3 className="mt-3 text-lg font-semibold text-slate-900">{template.name}</h3>
      <p className="mt-2 line-clamp-3 text-sm text-slate-600">
        {template.short_description ?? 'No short description available.'}
      </p>

      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="text-slate-500">
          <span>{template.downloads_count ?? 0} installs</span>
          <span className="mx-1">|</span>
          <span>
            {(template.rating_average ?? 0).toFixed(1)} ({template.rating_count ?? 0})
          </span>
        </div>
        <span className="font-semibold text-slate-900">
          {template.price_inr && template.price_inr > 0 ? `INR ${template.price_inr}` : 'Free'}
        </span>
      </div>
    </Link>
  );
}
