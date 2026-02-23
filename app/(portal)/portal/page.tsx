import { createAdminClient } from '@/app/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export default async function PortalPage() {
  let stats = { conversations: 0, appointments: 0, missedCalls: 0, videos: 0 };

  try {
    const supabase = createAdminClient();
    const [c, a, m, v] = await Promise.all([
      supabase.from('conversations').select('*', { head: true, count: 'exact' }),
      supabase.from('appointments').select('*', { head: true, count: 'exact' }),
      supabase.from('missed_calls').select('*', { head: true, count: 'exact' }),
      supabase.from('video_content').select('*', { head: true, count: 'exact' }),
    ]);

    stats = {
      conversations: c.count ?? 0,
      appointments: a.count ?? 0,
      missedCalls: m.count ?? 0,
      videos: v.count ?? 0,
    };
  } catch {
    stats = { conversations: 0, appointments: 0, missedCalls: 0, videos: 0 };
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Portal Overview</h1>
        <p className="text-sm text-slate-500">Daily operating metrics for business automation.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card label="Conversations" value={stats.conversations} />
        <Card label="Appointments" value={stats.appointments} />
        <Card label="Missed Calls" value={stats.missedCalls} />
        <Card label="Videos" value={stats.videos} />
      </div>
    </div>
  );
}

function Card({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
