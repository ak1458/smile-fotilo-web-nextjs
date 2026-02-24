import { createAdminClient } from '@/app/lib/supabase/admin';
import { requirePortalUser, resolvePortalBusinessId } from '../lib/portal-auth';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PortalSettingsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const user = await requirePortalUser();
  const businessId = await resolvePortalBusinessId(user.id, params.businessId);

  if (!businessId) {
    return (
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-slate-900">Settings</h2>
        <p className="text-sm text-slate-600">No business found for your account.</p>
      </div>
    );
  }

  const supabase = createAdminClient();
  const { data: business } = await supabase
    .from('businesses')
    .select('id,name,phone,whatsapp_number,email,city,state,language_preference,subscription_tier')
    .eq('id', businessId)
    .maybeSingle();

  if (!business) {
    return (
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-900">Settings</h2>
        <p className="text-sm text-red-700">Business not found.</p>
      </div>
    );
  }

  const rows: Array<{ label: string; value: string }> = [
    { label: 'Business Name', value: business.name },
    { label: 'Phone', value: business.phone },
    { label: 'WhatsApp Number', value: business.whatsapp_number ?? '-' },
    { label: 'Email', value: business.email ?? '-' },
    { label: 'City', value: business.city ?? '-' },
    { label: 'State', value: business.state ?? '-' },
    { label: 'Language', value: business.language_preference ?? 'hi-EN' },
    { label: 'Subscription', value: business.subscription_tier ?? 'starter' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Settings</h2>
        <p className="text-sm text-slate-600">Configuration snapshot for this tenant.</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <tbody className="divide-y divide-slate-200 bg-white">
            {rows.map((row) => (
              <tr key={row.label}>
                <td className="w-56 px-4 py-3 text-sm font-medium text-slate-700">{row.label}</td>
                <td className="px-4 py-3 text-sm text-slate-900">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
