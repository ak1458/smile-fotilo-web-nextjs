import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Free AI Tools | Smile Fotilo — Website Audit, SEO Content & More',
    description: 'Use our free AI-powered tools to audit your website, generate SEO content, and grow your business online. No signup required.',
    openGraph: {
        title: 'Free AI Tools by Smile Fotilo',
        description: 'Audit your website, generate SEO blog titles & keywords — all free, all AI-powered.',
    },
};

const tools = [
    {
        href: '/tools/website-audit',
        title: 'Website Audit',
        emoji: '🔍',
        color: 'from-violet-600 to-indigo-600',
        borderColor: 'border-violet-500/20 hover:border-violet-500/40',
        glowColor: 'group-hover:shadow-violet-500/20',
        description: 'Enter any URL and get an instant SEO, performance, and security analysis with an A-F score.',
        features: ['15+ SEO checks', 'A-F scoring', 'Issue detection', 'Fix recommendations'],
    },
    {
        href: '/tools/seo-content',
        title: 'SEO Content Engine',
        emoji: '✨',
        color: 'from-emerald-600 to-cyan-600',
        borderColor: 'border-emerald-500/20 hover:border-emerald-500/40',
        glowColor: 'group-hover:shadow-emerald-500/20',
        description: 'Generate AI-powered blog titles, meta descriptions, keyword lists, and content outlines for your business.',
        features: ['Blog titles', 'Meta descriptions', '15 keywords', 'Content outlines'],
    },
    {
        href: '#',
        title: 'AI Brand Kit',
        emoji: '🎨',
        color: 'from-amber-600 to-orange-600',
        borderColor: 'border-amber-500/20',
        glowColor: '',
        description: 'Upload your business info and get AI-generated color palettes, taglines, and brand voice guidelines.',
        features: ['Color palettes', 'Taglines', 'Brand voice', 'Social templates'],
        comingSoon: true,
    },
    {
        href: '#',
        title: 'Content Calendar',
        emoji: '📅',
        color: 'from-pink-600 to-rose-600',
        borderColor: 'border-pink-500/20',
        glowColor: '',
        description: 'Get a 30-day social media content calendar with post ideas, captions, and hashtags — tailored to your industry.',
        features: ['30-day plan', 'Post ideas', 'Captions', 'Hashtags'],
        comingSoon: true,
    },
];

export default function ToolsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 left-1/3 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-1/3 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-20">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/50 text-xs font-medium mb-6">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        NO SIGNUP REQUIRED
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                        Free AI
                        <span className="bg-gradient-to-r from-violet-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent"> Tools</span>
                    </h1>
                    <p className="text-white/40 text-lg max-w-2xl mx-auto">
                        Powerful AI-powered tools to analyze, optimize, and grow your online presence — completely free.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tools.map((tool) => (
                        <Link
                            key={tool.title}
                            href={tool.href}
                            className={`group relative bg-white/5 rounded-2xl border ${tool.borderColor} p-6 transition-all duration-300 shadow-lg ${tool.glowColor} ${tool.comingSoon ? 'pointer-events-none opacity-60' : 'hover:bg-white/[0.07] hover:shadow-xl hover:-translate-y-1'}`}
                        >
                            {tool.comingSoon && (
                                <span className="absolute top-4 right-4 px-2 py-0.5 bg-white/10 border border-white/10 rounded-full text-white/40 text-[10px] uppercase tracking-wider font-medium">
                                    Coming Soon
                                </span>
                            )}

                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-3xl">{tool.emoji}</span>
                                <h2 className="text-xl font-bold">{tool.title}</h2>
                            </div>

                            <p className="text-white/50 text-sm mb-4 leading-relaxed">{tool.description}</p>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {tool.features.map((f) => (
                                    <span key={f} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[11px] text-white/40">
                                        {f}
                                    </span>
                                ))}
                            </div>

                            {!tool.comingSoon && (
                                <span className={`inline-flex items-center gap-1.5 text-sm font-medium bg-gradient-to-r ${tool.color} bg-clip-text text-transparent`}>
                                    Try it free →
                                </span>
                            )}
                        </Link>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-white/30 text-sm mb-6">Need something custom? We build AI solutions for businesses.</p>
                    <Link
                        href="/#contact"
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm rounded-xl hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-500/20"
                    >
                        Talk to Us About Custom AI →
                    </Link>
                </div>
            </div>
        </div>
    );
}
