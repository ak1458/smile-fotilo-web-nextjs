'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InstallTemplatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const [businessId, setBusinessId] = useState('');
  const [isInstalling, setIsInstalling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsInstalling(true);

    try {
      const { slug } = await params;
      const response = await fetch('/api/marketplace/install', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateSlug: slug,
          businessId,
          configuration: {},
        }),
      });

      const data = (await response.json()) as { agentId?: string; error?: string };
      if (!response.ok || !data.agentId) {
        setError(data.error ?? 'Installation failed');
        return;
      }

      router.push('/portal/agents');
    } catch {
      setError('Installation failed');
    } finally {
      setIsInstalling(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Install Agent Template</h1>
        <p className="mt-2 text-sm text-slate-600">
          Enter the business id where this template should be installed.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input
            type="text"
            value={businessId}
            onChange={(event) => setBusinessId(event.target.value)}
            placeholder="Business UUID"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isInstalling}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {isInstalling ? 'Installing...' : 'Install'}
          </button>
        </form>
      </div>
    </div>
  );
}