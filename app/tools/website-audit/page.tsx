'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type AuditResult = {
    url: string;
    score: number;
    grade: string;
    summary: string;
    issues: { category: string; severity: 'critical' | 'warning' | 'info'; message: string }[];
    recommendations: string[];
};

const severityStyles = {
    critical: 'bg-red-500/10 text-red-400 border-red-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

const severityIcons = {
    critical: '🔴',
    warning: '🟡',
    info: '🔵',
};

const gradeColors: Record<string, string> = {
    A: 'from-emerald-400 to-green-500',
    B: 'from-blue-400 to-cyan-500',
    C: 'from-amber-400 to-yellow-500',
    D: 'from-orange-400 to-red-400',
    F: 'from-red-500 to-red-700',
    'N/A': 'from-slate-400 to-slate-600',
};

export default function WebsiteAuditPage() {
    const [url, setUrl] = useState('');
    const [isAuditing, setIsAuditing] = useState(false);
    const [result, setResult] = useState<AuditResult | null>(null);
    const [email, setEmail] = useState('');
    const [emailCaptured, setEmailCaptured] = useState(false);

    const handleAudit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url.trim()) return;
        setIsAuditing(true);
        setResult(null);
        try {
            const res = await fetch('/api/audit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: url.trim() }),
            });
            const data = await res.json();
            setResult(data);
        } catch {
            setResult({
                url,
                score: 0,
                grade: 'N/A',
                summary: 'Network error. Please check your connection and try again.',
                issues: [],
                recommendations: [],
            });
        }
        setIsAuditing(false);
    };

    const handleEmailCapture = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            setEmailCaptured(true);
            // In a real implementation, send this to your API
            import('../../actions/email').then(({ sendChatLeadEmail }) => {
                sendChatLeadEmail({
                    email,
                    conversationSummary: `Website Audit Lead: ${url}\nScore: ${result?.score}/100 (${result?.grade})\nIssues: ${result?.issues.length}\n${result?.issues.map(i => `- [${i.severity}] ${i.message}`).join('\n')}`,
                });
            }).catch(console.error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
            {/* Hero */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,80,255,0.15),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]" />

                <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
                    <Link href="/" className="text-xl font-bold tracking-wider text-white/90 hover:text-white transition-colors">
                        SMILEFOTILO
                    </Link>
                    <Link href="/services" className="text-sm text-white/60 hover:text-white transition-colors">
                        ← Back to Services
                    </Link>
                </nav>

                <div className="relative z-10 max-w-3xl mx-auto text-center px-6 pt-16 pb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-300 text-xs font-medium mb-6">
                        <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
                        FREE AI-POWERED TOOL
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                        Instant Website
                        <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent"> Audit</span>
                    </h1>
                    <p className="text-white/50 text-lg max-w-xl mx-auto mb-10">
                        Enter any URL and get an AI-powered SEO, performance, and security analysis in seconds.
                    </p>

                    {/* Search Bar */}
                    <form onSubmit={handleAudit} className="relative max-w-2xl mx-auto">
                        <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl p-2 focus-within:border-violet-500/50 transition-colors shadow-2xl shadow-violet-500/5">
                            <div className="pl-4 text-white/30">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="Enter website URL (e.g. smilefotilo.com)"
                                className="flex-1 bg-transparent px-4 py-3 text-white placeholder-white/30 outline-none text-lg"
                                disabled={isAuditing}
                            />
                            <button
                                type="submit"
                                disabled={isAuditing || !url.trim()}
                                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm rounded-xl hover:from-violet-500 hover:to-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                                {isAuditing ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                        Auditing...
                                    </span>
                                ) : 'Run Audit'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Results */}
            {result && (
                <div className="max-w-4xl mx-auto px-6 pb-20 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* Score Card */}
                    <div className="bg-white/5 rounded-2xl border border-white/10 p-8">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            {/* Grade Circle */}
                            <div className="relative w-36 h-36 shrink-0">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                                    <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                                    <circle
                                        cx="60" cy="60" r="54"
                                        fill="none"
                                        stroke="url(#scoreGrad)"
                                        strokeWidth="8"
                                        strokeLinecap="round"
                                        strokeDasharray={`${(result.score / 100) * 339.3} 339.3`}
                                        className="transition-all duration-1000"
                                    />
                                    <defs>
                                        <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor={result.score >= 70 ? '#34d399' : result.score >= 50 ? '#fbbf24' : '#ef4444'} />
                                            <stop offset="100%" stopColor={result.score >= 70 ? '#06b6d4' : result.score >= 50 ? '#f97316' : '#dc2626'} />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className={`text-4xl font-black bg-gradient-to-br ${gradeColors[result.grade] || gradeColors['N/A']} bg-clip-text text-transparent`}>
                                        {result.grade}
                                    </span>
                                    <span className="text-white/40 text-sm">{result.score}/100</span>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-xl font-bold mb-1 truncate">{result.url}</h2>
                                <p className="text-white/50 text-sm mb-4">{result.summary}</p>
                                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-xs">
                                        🔴 {result.issues.filter(i => i.severity === 'critical').length} Critical
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs">
                                        🟡 {result.issues.filter(i => i.severity === 'warning').length} Warnings
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs">
                                        🔵 {result.issues.filter(i => i.severity === 'info').length} Info
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Issues List */}
                    {result.issues.length > 0 && (
                        <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                            <h3 className="text-lg font-bold mb-4">Issues Found</h3>
                            <div className="space-y-2">
                                {result.issues.map((issue, i) => (
                                    <div
                                        key={i}
                                        className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${severityStyles[issue.severity]}`}
                                    >
                                        <span className="shrink-0 mt-0.5">{severityIcons[issue.severity]}</span>
                                        <div className="flex-1 min-w-0">
                                            <span className="text-sm">{issue.message}</span>
                                        </div>
                                        <span className="text-xs opacity-50 shrink-0 uppercase">{issue.category}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recommendations */}
                    {result.recommendations.length > 0 && (
                        <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                            <h3 className="text-lg font-bold mb-4">💡 Recommendations</h3>
                            <div className="space-y-3">
                                {result.recommendations.map((rec, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <span className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-300 text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                                            {i + 1}
                                        </span>
                                        <p className="text-white/70 text-sm">{rec}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Email Capture CTA */}
                    <div className="bg-gradient-to-r from-violet-600/20 to-indigo-600/20 rounded-2xl border border-violet-500/20 p-8 text-center">
                        {!emailCaptured ? (
                            <>
                                <h3 className="text-xl font-bold mb-2">Want a Deeper Analysis?</h3>
                                <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">
                                    Get a comprehensive 20-page audit report with actionable fixes, competitor analysis, and a growth strategy — delivered to your inbox.
                                </p>
                                <form onSubmit={handleEmailCapture} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        required
                                        className="flex-1 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-violet-500/50 transition-colors text-sm"
                                    />
                                    <button
                                        type="submit"
                                        className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm rounded-xl hover:from-violet-500 hover:to-indigo-500 transition-all whitespace-nowrap"
                                    >
                                        Get Full Report
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="py-4">
                                <span className="text-3xl mb-3 block">✅</span>
                                <h3 className="text-xl font-bold mb-2">Report Requested!</h3>
                                <p className="text-white/50 text-sm">Our team will send a detailed audit to <strong className="text-white">{email}</strong> within 24 hours.</p>
                            </div>
                        )}
                    </div>

                    {/* CTA */}
                    <div className="text-center">
                        <p className="text-white/30 text-xs mb-4">Powered by Smile Fotilo AI</p>
                        <Link
                            href="/pricing"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white/70 hover:text-white hover:border-white/20 transition-all text-sm"
                        >
                            View Pricing Plans →
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
