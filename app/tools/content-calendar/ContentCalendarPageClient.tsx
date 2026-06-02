'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type Post = {
    platform: string;
    type: string;
    caption: string;
    hashtags: string[];
    bestTime: string;
    tip: string;
};

type DayPlan = {
    day: string;
    theme: string;
    posts: Post[];
};

type CalendarResult = {
    weeklyTheme: string;
    days: DayPlan[];
    contentPillars: string[];
    weeklyTips: string[];
    businessName: string;
    industry: string;
    error?: string;
};

const platformOptions = ['Instagram', 'Facebook', 'LinkedIn', 'Twitter/X', 'YouTube'];
const dayColors: Record<string, string> = {
    Monday: 'from-blue-500/20 to-blue-600/20 border-blue-500/20',
    Tuesday: 'from-purple-500/20 to-purple-600/20 border-purple-500/20',
    Wednesday: 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/20',
    Thursday: 'from-amber-500/20 to-amber-600/20 border-amber-500/20',
    Friday: 'from-pink-500/20 to-pink-600/20 border-pink-500/20',
    Saturday: 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/20',
    Sunday: 'from-rose-500/20 to-rose-600/20 border-rose-500/20',
};
const dayEmojis: Record<string, string> = {
    Monday: '🚀', Tuesday: '💡', Wednesday: '📸', Thursday: '🎯',
    Friday: '🎉', Saturday: '🌟', Sunday: '☀️',
};
const platformIcons: Record<string, string> = {
    Instagram: '📸', Facebook: '👤', LinkedIn: '💼', 'Twitter/X': '🐦', YouTube: '▶️',
};

export default function ContentCalendarPage() {
    const [businessName, setBusinessName] = useState('');
    const [industry, setIndustry] = useState('');
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['Instagram']);
    const [tone, setTone] = useState('Professional & Engaging');
    const [goals, setGoals] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<CalendarResult | null>(null);
    const [expandedDay, setExpandedDay] = useState<number | null>(null);
    const [copiedItem, setCopiedItem] = useState('');

    const togglePlatform = (p: string) => {
        setSelectedPlatforms(prev =>
            prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
        );
    };

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!businessName.trim() || !industry.trim()) return;
        setIsGenerating(true);
        setResult(null);
        setExpandedDay(null);
        try {
            const res = await fetch('/api/content-calendar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    businessName: businessName.trim(),
                    industry: industry.trim(),
                    platforms: selectedPlatforms,
                    tone,
                    goals: goals.trim(),
                }),
            });
            const data = await res.json();
            setResult(data);
            if (data.days?.length) setExpandedDay(0);
        } catch {
            setResult({ error: 'Network error. Please try again.' } as CalendarResult);
        }
        setIsGenerating(false);
    };

    const copyText = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopiedItem(label);
        setTimeout(() => setCopiedItem(''), 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-10 left-1/3 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl" />
            </div>

            <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
                <Link href="/" className="text-xl font-bold tracking-wider text-white/90">SMILEFOTILO</Link>
                <Link href="/tools" className="text-sm text-white/60 hover:text-white transition-colors">← All Tools</Link>
            </nav>

            <div className="relative z-10 max-w-3xl mx-auto text-center px-6 pt-12 pb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-pink-500/10 border border-pink-500/20 rounded-full text-pink-300 text-xs font-medium mb-6">
                    <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
                    FREE AI-POWERED TOOL
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                    AI Content
                    <span className="text-indigo-300"> Calendar</span>
                </h1>
                <p className="text-white/50 text-lg max-w-xl mx-auto mb-10">
                    Get a 7-day social media content calendar with AI-written captions, hashtags, and posting tips — tailored to your business.
                </p>

                <form onSubmit={handleGenerate} className="max-w-2xl mx-auto space-y-4 text-left">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Business Name *</label>
                            <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="e.g., FitZone Gym" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 outline-none focus:border-pink-500/50 transition-colors text-sm" disabled={isGenerating} />
                        </div>
                        <div>
                            <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Industry *</label>
                            <input type="text" value={industry} onChange={e => setIndustry(e.target.value)} placeholder="e.g., Gym & Fitness" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 outline-none focus:border-pink-500/50 transition-colors text-sm" disabled={isGenerating} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Platforms</label>
                        <div className="flex flex-wrap gap-2">
                            {platformOptions.map(p => (
                                <button key={p} type="button" onClick={() => togglePlatform(p)} disabled={isGenerating}
                                    className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${selectedPlatforms.includes(p) ? 'bg-pink-500/20 border-pink-500/30 text-pink-300' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'}`}
                                >
                                    {platformIcons[p]} {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Tone</label>
                            <select value={tone} onChange={e => setTone(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-pink-500/50 transition-colors text-sm appearance-none" disabled={isGenerating}>
                                {['Professional & Engaging', 'Fun & Casual', 'Inspirational', 'Educational', 'Bold & Edgy', 'Warm & Community'].map(t =>
                                    <option key={t} value={t} className="bg-slate-900">{t}</option>
                                )}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Goals</label>
                            <input type="text" value={goals} onChange={e => setGoals(e.target.value)} placeholder="e.g., Get more followers, drive sales" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 outline-none focus:border-pink-500/50 transition-colors text-sm" disabled={isGenerating} />
                        </div>
                    </div>

                    <button type="submit" disabled={isGenerating || !businessName.trim() || !industry.trim()} className="w-full py-3.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold text-sm rounded-xl hover:from-pink-500 hover:to-rose-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        {isGenerating ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                Creating your content calendar...
                            </span>
                        ) : '📅 Generate 7-Day Calendar'}
                    </button>
                </form>
            </div>

            {/* Results */}
            {result && !result.error && (
                <div className="relative z-10 max-w-4xl mx-auto px-6 pb-20 space-y-6">

                    {/* Weekly Overview */}
                    {result.weeklyTheme && (
                        <div className="bg-white/5 rounded-2xl border border-white/10 p-6 text-center">
                            <div className="text-xs text-white/30 uppercase tracking-wider mb-2">This Week&apos;s Theme</div>
                            <h2 className="text-xl font-bold text-indigo-300">{result.weeklyTheme}</h2>
                        </div>
                    )}

                    {/* Content Pillars */}
                    {result.contentPillars?.length > 0 && (
                        <div className="flex flex-wrap gap-2 justify-center">
                            {result.contentPillars.map((pillar, i) => (
                                <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-white/50">
                                    {['🎯', '📚', '💬', '🔥'][i] || '✦'} {pillar}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Day Cards */}
                    <div className="space-y-3">
                        {result.days?.map((day, dayIdx) => (
                            <div key={dayIdx} className={`bg-gradient-to-r ${dayColors[day.day] || 'from-slate-500/20 to-slate-600/20 border-slate-500/20'} rounded-2xl border overflow-hidden transition-all`}>
                                <button onClick={() => setExpandedDay(expandedDay === dayIdx ? null : dayIdx)} className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-white/5 transition-colors">
                                    <span className="text-2xl">{dayEmojis[day.day] || '📌'}</span>
                                    <div className="flex-1">
                                        <span className="font-bold text-white/90">{day.day}</span>
                                        <span className="text-white/40 text-sm ml-2">— {day.theme}</span>
                                    </div>
                                    <span className="text-xs text-white/30 shrink-0">
                                        {day.posts?.length || 0} post{day.posts?.length !== 1 ? 's' : ''}
                                    </span>
                                    <svg className={`w-4 h-4 text-white/30 transition-transform ${expandedDay === dayIdx ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
                                </button>

                                {expandedDay === dayIdx && day.posts?.map((post, postIdx) => (
                                    <div key={postIdx} className="px-5 pb-4 space-y-3">
                                        <div className="bg-black/20 rounded-xl p-4 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span>{platformIcons[post.platform] || '📱'}</span>
                                                    <span className="text-sm font-medium text-white/80">{post.platform}</span>
                                                    <span className="px-2 py-0.5 bg-white/10 rounded-full text-[10px] text-white/50">{post.type}</span>
                                                </div>
                                                <span className="text-xs text-white/40">⏰ {post.bestTime}</span>
                                            </div>

                                            <div className="relative group">
                                                <p className="text-sm text-white/70 whitespace-pre-line leading-relaxed">{post.caption}</p>
                                                <button onClick={() => copyText(post.caption + '\n\n' + post.hashtags?.map((h: string) => `#${h}`).join(' '), `post-${dayIdx}-${postIdx}`)}
                                                    className="absolute top-0 right-0 text-xs px-2 py-1 bg-white/10 rounded-lg text-white/40 hover:text-pink-400 opacity-0 group-hover:opacity-100 transition-all">
                                                    {copiedItem === `post-${dayIdx}-${postIdx}` ? '✅ Copied!' : '📋 Copy'}
                                                </button>
                                            </div>

                                            {post.hashtags?.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {post.hashtags.map((tag: string, i: number) => (
                                                        <span key={i} className="text-[11px] text-pink-400/60">#{tag}</span>
                                                    ))}
                                                </div>
                                            )}

                                            {post.tip && (
                                                <div className="flex items-start gap-2 px-3 py-2 bg-white/5 rounded-lg">
                                                    <span className="text-xs">💡</span>
                                                    <p className="text-[11px] text-white/40">{post.tip}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Weekly Tips */}
                    {result.weeklyTips?.length > 0 && (
                        <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">💡 Weekly Growth Tips</h3>
                            <div className="space-y-2">
                                {result.weeklyTips.map((tip, i) => (
                                    <div key={i} className="flex items-start gap-3 px-3 py-2">
                                        <span className="w-5 h-5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">{i + 1}</span>
                                        <p className="text-sm text-white/60">{tip}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CTA */}
                    <div className="bg-gradient-to-r from-pink-600/20 to-rose-600/20 rounded-2xl border border-pink-500/20 p-8 text-center">
                        <h3 className="text-xl font-bold mb-2">Want Content Written & Designed?</h3>
                        <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">
                            Our team creates scroll-stopping social media content — graphics, reels, captions — all managed for you.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link href="/#contact" className="px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold text-sm rounded-xl hover:from-pink-500 hover:to-rose-500 transition-all">
                                Get Social Media Managed →
                            </Link>
                            <Link href="/tools/brand-kit" className="px-6 py-3 bg-white/5 border border-white/10 text-white/70 font-medium text-sm rounded-xl hover:text-white hover:border-white/20 transition-all">
                                🎨 Create Brand Kit
                            </Link>
                        </div>
                    </div>
                    <p className="text-center text-white/20 text-xs">Powered by Smile Fotilo AI</p>
                </div>
            )}

            {result?.error && (
                <div className="relative z-10 max-w-2xl mx-auto px-6 pb-20">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm text-center">{result.error}</div>
                </div>
            )}
        </div>
    );
}
