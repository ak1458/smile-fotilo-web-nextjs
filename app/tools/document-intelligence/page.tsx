'use client';

import { useState } from 'react';
import Link from 'next/link';

type AnalysisResult = {
  summary: string;
  keyFields: Record<string, string>;
  actionItems: string[];
  documentType: string;
  success: boolean;
  error?: string;
};

export default function DocumentIntelligencePage() {
  const [text, setText] = useState('');
  const [documentType, setDocumentType] = useState('general');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!text.trim()) return;
    
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, documentType, analysisType: 'all' }),
      });
      
      const data = await response.json();
      setResult(data);
    } catch {
      setResult({ 
        error: 'Failed to analyze document. Please try again.',
        summary: '',
        keyFields: {},
        actionItems: [],
        documentType,
        success: false,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl" />
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

      <div className="relative z-10 max-w-3xl mx-auto px-6 pt-12 pb-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-300 text-xs font-medium mb-6">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            FREE AI-POWERED TOOL
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Document
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Intelligence</span>
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Upload or paste any document text and get instant AI analysis — summaries, key data extraction, and actionable insights.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Document Type Selector */}
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'general', label: 'General' },
              { value: 'invoice', label: 'Invoice' },
              { value: 'prescription', label: 'Prescription' },
              { value: 'contract', label: 'Contract' },
            ].map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setDocumentType(type.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  documentType === type.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Text Input */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            placeholder={`Paste your ${documentType} text here...`}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 outline-none focus:border-blue-500/50 transition-colors text-sm resize-none"
            required
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold text-sm rounded-xl hover:from-blue-500 hover:to-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Analyzing Document...
              </span>
            ) : '🔍 Analyze Document'}
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

            {/* Summary */}
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">📄 Summary</h3>
              <p className="text-white/70 text-sm leading-relaxed">{result.summary}</p>
            </div>

            {/* Key Fields */}
            {Object.keys(result.keyFields).length > 0 && (
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">📋 Key Information</h3>
                <div className="grid gap-3">
                  {Object.entries(result.keyFields).map(([key, value]) => (
                    <div key={key} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                      <span className="text-white/40 text-sm font-medium w-32 shrink-0">{key}</span>
                      <span className="text-white/80 text-sm">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Items */}
            {result.actionItems.length > 0 && (
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">✅ Action Items</h3>
                <div className="space-y-2">
                  {result.actionItems.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 text-xs flex items-center justify-center font-bold shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-white/70 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-2xl border border-blue-500/20 p-6 text-center">
              <h3 className="text-lg font-bold mb-2">Need Document Processing Automation?</h3>
              <p className="text-white/50 text-sm mb-4">
                We can build custom AI workflows to process your documents automatically.
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold text-sm rounded-xl hover:from-blue-500 hover:to-cyan-500 transition-all"
              >
                Talk to Our Team →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
