import Link from 'next/link';
import { createAdminClient } from '@/app/lib/supabase/admin';
import { getAdminSession } from '../lib/admin-auth';

export default async function AdminBusinessesPage() {
  const session = await getAdminSession();
  if (!session.isAdmin) {
    return (
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-900">Businesses</h2>
        <p className="text-sm text-slate-600">Admin role is required to view all businesses.</p>
      </div>
    );
  }

  const supabase = createAdminClient();
  const { data: businesses } = await supabase
    .from('businesses')
    .select('id,name,category,city,state,phone,language_preference,subscription_tier,is_active,created_at')
    .order('created_at', { ascending: false })
    .limit(200);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Businesses</h2>
        <p className="text-sm text-slate-600">Tenant directory with subscription and language preferences.</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Location
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Language
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Subscription
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {(businesses ?? []).map((business) => (
              <tr key={business.id}>
                <td className="px-4 py-3 text-sm font-medium text-slate-900">
                  <p>{business.name}</p>
                  <p className="text-xs text-slate-500">{business.phone}</p>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {[business.city, business.state].filter(Boolean).join(', ') || '-'}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{business.category ?? 'other'}</td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {business.language_preference ?? 'hi-EN'}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      business.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {(business.subscription_tier ?? 'starter') + (business.is_active ? ' active' : ' inactive')}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/portal?businessId=${business.id}`}
                    className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-700"
                  >
                    Open Portal
                  </Link>
                </td>
              </tr>
            ))}
            {!businesses?.length && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">
                  No businesses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

