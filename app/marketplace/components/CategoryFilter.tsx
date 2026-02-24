import Link from 'next/link';

type Category = { id: string; name: string };

type Props = {
  categories: Category[];
  activeCategory: string;
  search?: string;
  businessId?: string;
};

function buildCategoryHref(input: {
  category: string;
  search?: string;
  businessId?: string;
}) {
  const query = new URLSearchParams();
  if (input.category && input.category !== 'all') query.set('category', input.category);
  if (input.search) query.set('search', input.search);
  if (input.businessId) query.set('businessId', input.businessId);

  const qs = query.toString();
  return qs ? `/marketplace?${qs}` : '/marketplace';
}

export function CategoryFilter({ categories, activeCategory, search, businessId }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3">
      <h2 className="mb-2 px-2 text-sm font-semibold text-slate-900">Categories</h2>
      <div className="space-y-1">
        {categories.map((category) => {
          const active = activeCategory === category.id;
          return (
            <Link
              key={category.id}
              href={buildCategoryHref({
                category: category.id,
                search,
                businessId,
              })}
              className={`block min-h-11 rounded-lg px-3 py-3 text-sm font-medium transition ${
                active ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {category.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
