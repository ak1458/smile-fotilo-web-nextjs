'use client';

import { useState } from 'react';

export default function WebsiteFactoryPage() {
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [audience, setAudience] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setOutput('');

    try {
      const response = await fetch('/api/website-factory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName, industry, targetAudience: audience }),
      });

      const data = (await response.json()) as { blueprint?: string; error?: string };
      setOutput(data.blueprint ?? data.error ?? 'No output');
    } catch {
      setOutput('Failed to generate blueprint');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl font-semibold">AI Website Factory</h1>
        <p className="text-sm text-slate-300">Generate a complete website blueprint from a short business brief.</p>

        <form onSubmit={onSubmit} className="space-y-3 rounded-xl border border-slate-700 bg-slate-900 p-4">
          <input
            value={businessName}
            onChange={(event) => setBusinessName(event.target.value)}
            placeholder="Business name"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none"
            required
          />
          <input
            value={industry}
            onChange={(event) => setIndustry(event.target.value)}
            placeholder="Industry"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none"
            required
          />
          <input
            value={audience}
            onChange={(event) => setAudience(event.target.value)}
            placeholder="Target audience"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 disabled:opacity-60"
          >
            {loading ? 'Generating...' : 'Generate Website Blueprint'}
          </button>
        </form>

        {output && (
          <pre className="whitespace-pre-wrap rounded-xl border border-slate-700 bg-slate-900 p-4 text-sm text-slate-100">
            {output}
          </pre>
        )}
      </div>
    </div>
  );
}