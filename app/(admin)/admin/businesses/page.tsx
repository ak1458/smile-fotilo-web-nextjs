import Link from 'next/link';
import { createAdminClient } from '@/app/lib/supabase/admin';
import { getAdminSession } from '../lib/admin-auth';

export default async function AdminBusinessesPage() {
  const session = await getAdminSession();
  if (!session.isAdmin) {
    return (
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-white">Businesses</h2>
        <p className="text-sm text-slate-300">Admin role is required to view all businesses.</p>
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
    <div className="space-y-7">
      <div className="space-y-4">
        <span className="inline-flex items-center rounded-full border border-cyan-300/35 bg-cyan-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-100">
          Businesses
        </span>
        <h2 className="text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl">
          Tenant Directory
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
          Centralized view of subscriptions, languages, and contact details across every business.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60">
        <div className="overflow-x-auto">
          <table className="min-w-[860px] divide-y divide-white/10">
            <thead className="bg-slate-900/95">
              <tr>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                  Language
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                  Subscription
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 bg-slate-950/20">
              {(businesses ?? []).map((business) => (
                <tr key={business.id} className="transition-colors hover:bg-violet-500/10">
                  <td className="px-4 py-3.5 align-top text-sm text-slate-100">
                    <p className="break-words text-sm font-semibold">{business.name}</p>
                    <p className="mt-1 break-all text-xs text-slate-400">{business.phone ?? 'No phone added'}</p>
                  </td>
                  <td className="px-4 py-3.5 align-top text-sm text-slate-300">
                    {[business.city, business.state].filter(Boolean).join(', ') || '-'}
                  </td>
                  <td className="px-4 py-3.5 align-top text-sm text-slate-300">{business.category ?? 'other'}</td>
                  <td className="px-4 py-3.5 align-top text-sm text-slate-300">
                    {business.language_preference ?? 'hi-EN'}
                  </td>
                  <td className="px-4 py-3.5 align-top text-sm">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                        business.is_active
                          ? 'border-emerald-300/35 bg-emerald-500/15 text-emerald-100'
                          : 'border-slate-300/20 bg-slate-500/10 text-slate-200'
                      }`}
                    >
                      {(business.subscription_tier ?? 'starter') + (business.is_active ? ' active' : ' inactive')}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right align-top">
                    <Link
                      href={`/portal?businessId=${business.id}`}
                      className="inline-flex items-center rounded-lg border border-violet-300/35 bg-violet-500/20 px-3 py-1.5 text-xs font-semibold text-violet-50 transition hover:bg-violet-500/30"
                    >
                      Open Portal
                    </Link>
                  </td>
                </tr>
              ))}
              {!businesses?.length && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-400">
                    No businesses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/55 p-4 sm:p-5">
        <p className="text-[11px] uppercase tracking-[0.13em] text-slate-400">Total Results</p>
        <p className="mt-1.5 text-base font-semibold text-slate-100">{businesses?.length ?? 0} businesses listed</p>
      </div>
    </div>
  );
}
