import Link from 'next/link';

export default function PortalVideosPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Videos</h1>
      <p className="text-sm text-slate-600">
        Use the AI video generator to create scripts, captions, and Canva-ready instructions.
      </p>
      <Link
        href="/tools/content-calendar"
        className="inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
      >
        Open Content Calendar Tool
      </Link>
    </div>
  );
}
