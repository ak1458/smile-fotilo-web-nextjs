'use client';

import { useState } from 'react';

export default function DocumentIntelligencePage() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, documentType: 'general' }),
      });
      const data = (await response.json()) as { result?: string; error?: string };
      setResult(data.result ?? data.error ?? 'No output');
    } catch {
      setResult('Failed to process document');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl font-semibold">Document Intelligence</h1>
        <p className="text-sm text-slate-300">Paste document text to get summary and structured extraction.</p>

        <form onSubmit={onSubmit} className="space-y-3">
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={10}
            placeholder="Paste invoice, prescription, legal note, or any document text"
            className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm outline-none"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 disabled:opacity-60"
          >
            {loading ? 'Analyzing...' : 'Analyze Document'}
          </button>
        </form>

        {result && (
          <pre className="whitespace-pre-wrap rounded-xl border border-slate-700 bg-slate-900 p-4 text-sm text-slate-100">
            {result}
          </pre>
        )}
      </div>
    </div>
  );
}