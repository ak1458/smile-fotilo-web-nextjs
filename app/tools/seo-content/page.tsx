'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type SEOResult = {
    blogTitles: string[];
    metaDescriptions: string[];
    contentOutline: string;
    keywords: string[];
    linkingStrategy?: string;
    business: string;
    location: string;
    industry: string;
    error?: string;
};

const industries = [
    'Dental Clinic', 'Hospital', 'Restaurant', 'Cafe',
    'Salon & Spa', 'Gym & Fitness', 'Real Estate', 'Law Firm',
    'Education / Coaching', 'Retail / E-commerce', 'Photography',
    'IT / Software', 'Wedding Planner', 'Travel Agency', 'Other',
];

export default function SEOContentPage() {
    const [business, setBusiness] = useState('');
    const [location, setLocation] = useState('');
    const [industry, setIndustry] = useState('');
    const [language, setLanguage] = useState('English');
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<SEOResult | null>(null);
    const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!business.trim() || !industry) return;
        setIsGenerating(true);
        setResult(null);
        try {
            const res = await fetch('/api/seo-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ business: business.trim(), location: location.trim(), industry, language }),
            });
            const data = await res.json();
            setResult(data);
        } catch {
            setResult({
                blogTitles: [], metaDescriptions: [], contentOutline: '', keywords: [],
                business, location, industry, error: 'Network error. Please try again.',
            });
        }
        setIsGenerating(false);
    };

    const copyToClipboard = (text: string, idx: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
            {/* Ambient glow */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
            </div>

            <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
                <Link href="/" className="text-xl font-bold tracking-wider text-white/90 hover:text-white transition-colors">
                    SMILEFOTILO
                </Link>
                <div className="flex items-center gap-4">
                    <Link href="/tools" className="text-sm text-white/60 hover:text-white transition-colors">
                        ← All Tools
                    </Link>
                    <Link href="/tools/website-audit" className="text-sm text-white/60 hover:text-white transition-colors hidden sm:block">
                        Website Audit →
                    </Link>
                </div>
            </nav>

            <div className="relative z-10 max-w-3xl mx-auto text-center px-6 pt-12 pb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-300 text-xs font-medium mb-6">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    FREE AI-POWERED TOOL
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                    AI SEO Content
                    <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"> Engine</span>
                </h1>
                <p className="text-white/50 text-lg max-w-xl mx-auto mb-10">
                    Enter your business details and get AI-generated blog titles, meta descriptions, keywords & content outlines — optimized for local SEO.
                </p>

                {/* Input Form */}
                <form onSubmit={handleGenerate} className="max-w-2xl mx-auto space-y-4 text-left">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Business Name *</label>
                            <input
                                type="text" value={business} onChange={e => setBusiness(e.target.value)}
                                placeholder="e.g., Sharma Dental Clinic"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 outline-none focus:border-emerald-500/50 transition-colors text-sm"
                                disabled={isGenerating}
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Location</label>
                            <input
                                type="text" value={location} onChange={e => setLocation(e.target.value)}
                                placeholder="e.g., Lucknow, India"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 outline-none focus:border-emerald-500/50 transition-colors text-sm"
                                disabled={isGenerating}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Industry *</label>
                            <select
                                value={industry} onChange={e => setIndustry(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50 transition-colors text-sm appearance-none"
                                disabled={isGenerating}
                            >
                                <option value="" className="bg-slate-900">Select industry...</option>
                                {industries.map(i => <option key={i} value={i} className="bg-slate-900">{i}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Language</label>
                            <select
                                value={language} onChange={e => setLanguage(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50 transition-colors text-sm appearance-none"
                                disabled={isGenerating}
                            >
                                {['English', 'Hinglish', 'Hindi', 'Bengali', 'Tamil', 'Telugu'].map(l =>
                                    <option key={l} value={l} className="bg-slate-900">{l}</option>
                                )}
                            </select>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isGenerating || !business.trim() || !industry}
                        className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold text-sm rounded-xl hover:from-emerald-500 hover:to-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                Generating content strategy...
                            </span>
                        ) : '✨ Generate SEO Content Strategy'}
                    </button>
                </form>
            </div>

            {/* Results */}
            {result && (
                <div className="relative z-10 max-w-4xl mx-auto px-6 pb-20 space-y-6">

                    {result.error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm text-center">
                            {result.error}
                        </div>
                    )}

                    {/* Blog Titles */}
                    {result.blogTitles.length > 0 && (
                        <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">📝 Blog Titles</h3>
                            <div className="space-y-2">
                                {result.blogTitles.map((title, i) => (
                                    <div key={i} className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl border border-white/5 group hover:border-emerald-500/20 transition-colors">
                                        <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 text-xs flex items-center justify-center font-bold shrink-0">{i + 1}</span>
                                        <span className="flex-1 text-sm text-white/80 min-w-0 overflow-hidden text-ellipsis">{title}</span>
                                        <button
                                            onClick={() => copyToClipboard(title, i)}
                                            className="text-xs text-white/40 hover:text-emerald-400 transition-colors sm:opacity-0 sm:group-hover:opacity-100 shrink-0 p-2 -mr-2"
                                            aria-label="Copy to clipboard"
                                        >
                                            {copiedIdx === i ? '✅' : '📋'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Meta Descriptions */}
                    {result.metaDescriptions.length > 0 && (
                        <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">🏷️ Meta Descriptions</h3>
                            <div className="space-y-2">
                                {result.metaDescriptions.map((meta, i) => (
                                    <div key={i} className="flex items-start gap-3 px-4 py-3 bg-white/5 rounded-xl border border-white/5 group hover:border-cyan-500/20 transition-colors">
                                        <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">{i + 1}</span>
                                        <span className="flex-1 text-sm text-white/70 min-w-0 overflow-hidden text-ellipsis">{meta}</span>
                                        <button
                                            onClick={() => copyToClipboard(meta, 100 + i)}
                                            className="text-xs text-white/40 hover:text-cyan-400 transition-colors sm:opacity-0 sm:group-hover:opacity-100 shrink-0 p-2 -mr-2"
                                            aria-label="Copy to clipboard"
                                        >
                                            {copiedIdx === 100 + i ? '✅' : '📋'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Keywords */}
                    {result.keywords.length > 0 && (
                        <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">🎯 Target Keywords</h3>
                            <div className="flex flex-wrap gap-2">
                                {result.keywords.map((kw, i) => (
                                    <button
                                        key={i}
                                        onClick={() => copyToClipboard(kw.split('—')[0].trim(), 200 + i)}
                                        className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white/60 hover:text-emerald-300 hover:border-emerald-500/30 transition-colors cursor-pointer"
                                        title="Click to copy"
                                    >
                                        {copiedIdx === 200 + i ? '✅ Copied' : kw}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Content Outline */}
                    {result.contentOutline && (
                        <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold flex items-center gap-2">📋 Content Outline</h3>
                                <button
                                    onClick={() => copyToClipboard(result.contentOutline, 999)}
                                    className="text-xs px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-white/40 hover:text-emerald-400 hover:border-emerald-500/30 transition-colors"
                                >
                                    {copiedIdx === 999 ? '✅ Copied!' : 'Copy Outline'}
                                </button>
                            </div>
                            <div className="prose prose-invert prose-sm max-w-none">
                                <pre className="whitespace-pre-wrap text-sm text-white/60 bg-white/5 p-4 rounded-xl border border-white/5 overflow-x-auto">
                                    {result.contentOutline}
                                </pre>
                            </div>
                        </div>
                    )}

                    {/* CTA */}
                    <div className="bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 rounded-2xl border border-emerald-500/20 p-8 text-center">
                        <h3 className="text-xl font-bold mb-2">Want Us to Write the Full Content?</h3>
                        <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">
                            Our team writes SEO-optimized, industry-specific blog posts that rank on Google and drive leads to your business.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                href="/#contact"
                                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold text-sm rounded-xl hover:from-emerald-500 hover:to-cyan-500 transition-all"
                            >
                                Get Content Written →
                            </Link>
                            <Link
                                href="/tools/website-audit"
                                className="px-6 py-3 bg-white/5 border border-white/10 text-white/70 font-medium text-sm rounded-xl hover:text-white hover:border-white/20 transition-all"
                            >
                                🔍 Audit Your Website
                            </Link>
                        </div>
                    </div>

                    <p className="text-center text-white/20 text-xs">Powered by Smile Fotilo AI</p>
                </div>
            )}
        </div>
    );
}
