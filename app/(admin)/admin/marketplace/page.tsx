import Link from 'next/link';

export default function AdminMarketplacePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Marketplace Admin</h1>
      <p className="text-sm text-slate-600">
        Manage template publishing and pricing from the marketplace surface.
      </p>
      <Link
        href="/marketplace"
        className="inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
      >
        Open Marketplace
      </Link>
    </div>
  );
}
