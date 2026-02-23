import { createAdminClient } from '@/app/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export default async function AdminBusinessesPage() {
  let businesses: Array<{ id: string; name: string; category: string | null; city: string | null; created_at: string | null }> = [];

  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('businesses')
      .select('id,name,category,city,created_at')
      .order('created_at', { ascending: false })
      .limit(50);
    businesses = data ?? [];
  } catch {
    businesses = [];
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Businesses</h1>
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {businesses.map((b) => (
              <tr key={b.id} className="border-t border-slate-200">
                <td className="px-4 py-3">{b.name}</td>
                <td className="px-4 py-3">{b.category ?? '-'}</td>
                <td className="px-4 py-3">{b.city ?? '-'}</td>
                <td className="px-4 py-3">{b.created_at ? new Date(b.created_at).toLocaleString() : '-'}</td>
              </tr>
            ))}
            {businesses.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-slate-500" colSpan={4}>
                  No businesses yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
