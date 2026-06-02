'use client';

import { useState } from 'react';
import Link from 'next/link';

type BlueprintResult = {
  sitemap: Array<{ name: string; description: string; path: string }>;
  designDirection: {
    colors: string[];
    typography: string;
    mood: string;
    notes: string;
  };
  homeCopy: {
    headline: string;
    subheadline: string;
    cta: string;
  };
  seoKeywords: string[];
  launchChecklist: string[];
  businessName: string;
  success: boolean;
  error?: string;
};

export default function WebsiteFactoryPage() {
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [audience, setAudience] = useState('');
  const [style, setStyle] = useState('Professional');
  const [result, setResult] = useState<BlueprintResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!businessName.trim() || !industry.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/website-factory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName, industry, targetAudience: audience, style }),
      });

      const data = await response.json();
      setResult(data);
    } catch {
      setResult({
        error: 'Failed to generate blueprint. Please try again.',
        sitemap: [],
        designDirection: { colors: [], typography: '', mood: '', notes: '' },
        homeCopy: { headline: '', subheadline: '', cta: '' },
        seoKeywords: [],
        launchChecklist: [],
        businessName: '',
        success: false,
      });
    } finally {
      setLoading(false);
    }
  }

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Link href="/" className="text-xl font-bold tracking-wider text-white/90 hover:text-white transition-colors">
          SMILEFOTILO
        </Link>
        <Link href="/tools" className="text-sm text-white/60 hover:text-white transition-colors">
          ← All Tools
        </Link>
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-12 pb-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sky-500/10 border border-sky-500/20 rounded-full text-sky-300 text-xs font-medium mb-6">
            <span className="w-2 h-2 bg-sky-400 rounded-full animate-pulse" />
            FREE AI-POWERED TOOL
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            AI Website
            <span className="text-indigo-300"> Factory</span>
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Generate a complete website blueprint — sitemap, design direction, copy, SEO keywords, and launch checklist.
          </p>
        </div>

        <form onSubmit={onSubmit} className="bg-white/5 rounded-2xl border border-white/10 p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Business Name *</label>
              <input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g., Sharma Dental Clinic"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 outline-none focus:border-sky-500/50 transition-colors text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Industry *</label>
              <input
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g., Dental Clinic"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 outline-none focus:border-sky-500/50 transition-colors text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Target Audience</label>
            <input
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g., Families, Young professionals, Seniors"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 outline-none focus:border-sky-500/50 transition-colors text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Design Style</label>
            <div className="flex flex-wrap gap-2">
              {['Professional', 'Modern', 'Playful', 'Luxury', 'Minimal'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStyle(s)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    style === s
                      ? 'bg-sky-600 text-white'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !businessName.trim() || !industry.trim()}
            className="w-full py-3.5 bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-semibold text-sm rounded-xl hover:from-sky-500 hover:to-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating Blueprint...
              </span>
            ) : '🏗️ Generate Website Blueprint'}
          </button>
        </form>

        {/* Results */}
        {result && (
          <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {result.error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
                {result.error}
              </div>
            )}

            {/* Sitemap */}
            {result.sitemap.length > 0 && (
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">🗺️ Sitemap</h3>
                <div className="space-y-3">
                  {result.sitemap.map((page, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                      <span className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-300 text-xs flex items-center justify-center font-bold shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white/90">{page.name}</span>
                          <code className="text-[10px] text-white/40 bg-white/5 px-2 py-0.5 rounded">{page.path}</code>
                        </div>
                        {page.description && (
                          <p className="text-white/40 text-xs mt-0.5">{page.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Design Direction */}
            {result.designDirection.colors.length > 0 && (
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">🎨 Design Direction</h3>
                
                {/* Color Palette */}
                <div className="mb-4">
                  <span className="text-xs text-white/40 uppercase tracking-wider mb-2 block">Color Palette</span>
                  <div className="flex flex-wrap gap-2">
                    {result.designDirection.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => copyColor(color)}
                        className="group flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all"
                      >
                        <div className="w-6 h-6 rounded-md" style={{ backgroundColor: color }} />
                        <code className="text-xs text-white/60">{copiedColor === color ? 'Copied!' : color}</code>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-white/40 text-xs uppercase tracking-wider block mb-1">Typography</span>
                    <span className="text-white/70">{result.designDirection.typography}</span>
                  </div>
                  <div>
                    <span className="text-white/40 text-xs uppercase tracking-wider block mb-1">Mood</span>
                    <span className="text-white/70">{result.designDirection.mood}</span>
                  </div>
                </div>

                {result.designDirection.notes && (
                  <p className="text-white/50 text-sm mt-4 pt-4 border-t border-white/5">
                    {result.designDirection.notes}
                  </p>
                )}
              </div>
            )}

            {/* Homepage Copy */}
            {result.homeCopy.headline && (
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">✍️ Homepage Copy</h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-white/40 text-xs uppercase tracking-wider block mb-1">Headline</span>
                    <h4 className="text-2xl font-bold text-white/90">{result.homeCopy.headline}</h4>
                  </div>
                  <div>
                    <span className="text-white/40 text-xs uppercase tracking-wider block mb-1">Subheadline</span>
                    <p className="text-white/70">{result.homeCopy.subheadline}</p>
                  </div>
                  <div>
                    <span className="text-white/40 text-xs uppercase tracking-wider block mb-1">CTA Button</span>
                    <span className="inline-flex px-4 py-2 bg-sky-600 text-white text-sm font-medium rounded-lg">
                      {result.homeCopy.cta}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* SEO Keywords */}
            {result.seoKeywords.length > 0 && (
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">🔍 SEO Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {result.seoKeywords.map((keyword, i) => (
                    <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white/60">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Launch Checklist */}
            {result.launchChecklist.length > 0 && (
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">✅ Launch Checklist</h3>
                <div className="space-y-2">
                  {result.launchChecklist.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                      <input type="checkbox" className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 text-sky-600" readOnly />
                      <span className="text-white/70 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="bg-gradient-to-r from-sky-600/20 to-indigo-600/20 rounded-2xl border border-sky-500/20 p-6 text-center">
              <h3 className="text-lg font-bold mb-2">Ready to Build This Website?</h3>
              <p className="text-white/50 text-sm mb-4">
                Our team can turn this blueprint into a live, high-converting website in 2-3 weeks.
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-semibold text-sm rounded-xl hover:from-sky-500 hover:to-indigo-500 transition-all"
              >
                Start Your Project →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
