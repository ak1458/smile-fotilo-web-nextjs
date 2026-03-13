'use client';

import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const VIDEO_TEMPLATES = [
  { id: 'clinic_welcome', label: 'Clinic Welcome' },
  { id: 'festive_offer', label: 'Festive Offer' },
  { id: 'testimonial', label: 'Testimonial' },
  { id: 'educational', label: 'Educational' },
  { id: 'behind_scenes', label: 'Behind the Scenes' },
  { id: 'doctor_intro', label: 'Doctor Intro' },
];

type VideoResponse = {
  success?: boolean;
  error?: string;
  message?: string;
  data?: {
    script?: string;
    captions?: string[];
    hashtags?: string[];
    instructions?: string;
    canvaTemplate?: { url?: string; name?: string };
  };
};

function PortalVideosContent() {
  const searchParams = useSearchParams();
  const businessId = useMemo(() => searchParams.get('businessId') ?? '', [searchParams]);
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('hi-EN');
  const [template, setTemplate] = useState(VIDEO_TEMPLATES[0].id);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VideoResponse | null>(null);

  async function onGenerate(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/videos/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: businessId || null,
          prompt,
          template,
          language,
        }),
      });
      const payload = (await response.json()) as VideoResponse;
      setResult(payload);
    } catch {
      setResult({ error: 'Failed to generate video content' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">AI Video Content</h2>
        <p className="text-sm text-slate-300">
          Generate scripts, captions, and Canva guidance using free-tier models.
        </p>
      </div>

      <form onSubmit={onGenerate} className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">
              Template
            </label>
            <select
              value={template}
              onChange={(event) => setTemplate(event.target.value)}
              className="w-full rounded-lg border border-white/15 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none"
            >
              {VIDEO_TEMPLATES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">
              Language
            </label>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="w-full rounded-lg border border-white/15 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none"
            >
              <option value="hi-EN">Hinglish</option>
              <option value="hi">Hindi</option>
              <option value="en">English</option>
              <option value="bn">Bengali</option>
              <option value="ta">Tamil</option>
              <option value="te">Telugu</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">
            Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            rows={4}
            required
            placeholder="Example: A 30 second clinic welcome video for a new dental clinic in Lucknow."
            className="w-full rounded-lg border border-white/15 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-slate-400">
            Optional business context: <code>{businessId || 'not provided'}</code>
          </p>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg border border-cyan-300/35 bg-cyan-500/20 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-500/30 disabled:opacity-60"
          >
            {loading ? 'Generating...' : 'Generate Video Pack'}
          </button>
        </div>
      </form>

      {result && (
        <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4 sm:p-5">
          {result.error && <p className="text-sm text-rose-200">{result.error}</p>}
          {result.message && <p className="text-sm text-emerald-200">{result.message}</p>}

          {result.data?.script && (
            <section className="space-y-1">
              <h3 className="text-sm font-semibold text-slate-100">Script</h3>
              <pre className="whitespace-pre-wrap rounded-lg bg-slate-950/70 p-3 text-sm text-slate-300">
                {result.data.script}
              </pre>
            </section>
          )}

          {!!result.data?.captions?.length && (
            <section className="space-y-1">
              <h3 className="text-sm font-semibold text-slate-100">Captions</h3>
              <ul className="space-y-1">
                {result.data.captions.map((caption, index) => (
                  <li key={index} className="rounded-lg bg-slate-950/70 p-3 text-sm text-slate-300">
                    {caption}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {!!result.data?.hashtags?.length && (
            <section className="space-y-1">
              <h3 className="text-sm font-semibold text-slate-100">Hashtags</h3>
              <p className="rounded-lg bg-slate-950/70 p-3 text-sm text-slate-300">
                {result.data.hashtags.join(' ')}
              </p>
            </section>
          )}

          {result.data?.canvaTemplate?.url && (
            <a
              href={result.data.canvaTemplate.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm font-semibold text-slate-100 transition hover:border-violet-300/35 hover:bg-violet-500/10"
            >
              Open Canva Template
            </a>
          )}

          {result.data?.instructions && (
            <details className="rounded-lg bg-slate-950/70 p-3 text-sm text-slate-300">
              <summary className="cursor-pointer font-semibold text-slate-100">Creation Instructions</summary>
              <pre className="mt-2 whitespace-pre-wrap">{result.data.instructions}</pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

export default function PortalVideosPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-400">Loading video tools...</p>}>
      <PortalVideosContent />
    </Suspense>
  );
}
