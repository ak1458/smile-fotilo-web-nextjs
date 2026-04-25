type Props = {
  defaultValue?: string;
  category?: string;
  businessId?: string;
};

export function SearchBar({ defaultValue, category, businessId }: Props) {
  return (
    <form action="/marketplace" method="GET" className="sf-marketplace-search rounded-2xl border border-slate-200 bg-white p-3">
      <label htmlFor="search" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        Search
      </label>
      <div className="flex items-center gap-2">
        <input
          id="search"
          name="search"
          defaultValue={defaultValue}
          placeholder="Find templates by name or use case"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none"
        />
        <button
          type="submit"
          className="min-h-11 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Find
        </button>
      </div>

      {category && category !== 'all' && <input type="hidden" name="category" value={category} />}
      {businessId && <input type="hidden" name="businessId" value={businessId} />}
    </form>
  );
}
