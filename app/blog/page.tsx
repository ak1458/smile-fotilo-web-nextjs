'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { blogPosts, getFeaturedPosts, getAllCategories } from '../data/blogPosts';

const POSTS_PER_PAGE = 12;

// Category colors for blog cards
const categoryColors: Record<string, string> = {
    'Web Design': 'from-violet-600 to-purple-600',
    'SEO': 'from-emerald-600 to-cyan-600',
    'Business': 'from-amber-500 to-orange-500',
    'E-commerce': 'from-pink-500 to-rose-500',
    'Branding': 'from-indigo-500 to-blue-500',
    'Technology': 'from-cyan-500 to-blue-500',
    'How-To': 'from-green-500 to-emerald-500',
};

// Category icons
const categoryIcons: Record<string, string> = {
    'Web Design': '🎨',
    'SEO': '🔍',
    'Business': '💼',
    'E-commerce': '🛒',
    'Branding': '✨',
    'Technology': '⚡',
    'How-To': '📚',
};

export default function BlogPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const categories = getAllCategories();

    // Filter posts by category
    const filteredPosts = selectedCategory
        ? blogPosts.filter(post => post.category === selectedCategory)
        : blogPosts;

    // Sort by date
    const sortedPosts = [...filteredPosts].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Pagination
    const totalPages = Math.ceil(sortedPosts.length / POSTS_PER_PAGE);
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const paginatedPosts = sortedPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

    const featured = getFeaturedPosts().slice(0, 3);

    return (
        <main className="min-h-screen bg-[#0a0118]">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-violet-950/50 via-[#0a0118] to-[#0a0118]" />
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px]" />
                <div className="absolute top-40 right-1/4 w-64 h-64 bg-purple-600/15 rounded-full blur-[100px]" />

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/20 border border-violet-500/30 rounded-full text-violet-300 text-sm font-medium mb-6">
                        <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
                        {blogPosts.length} Articles
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Insights & <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">Resources</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Expert tips on web design, SEO, branding, and growing your business online in 2026
                    </p>
                </div>
            </section>

            {/* Category Filter */}
            <section className="py-6 border-y border-white/5 bg-[#0a0118]/80 backdrop-blur-xl sticky top-20 z-30">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap gap-3 justify-center">
                        <button
                            onClick={() => { setSelectedCategory(null); setCurrentPage(1); }}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${!selectedCategory
                                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-600/25'
                                    : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/10'
                                }`}
                        >
                            All ({blogPosts.length})
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${selectedCategory === cat
                                        ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-600/25'
                                        : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/10'
                                    }`}
                            >
                                <span>{categoryIcons[cat] || '📄'}</span>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Posts (only show when no filter) */}
            {!selectedCategory && currentPage === 1 && featured.length > 0 && (
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-2 h-8 bg-gradient-to-b from-violet-500 to-purple-500 rounded-full" />
                            <h2 className="text-2xl md:text-3xl font-bold text-white">Featured Articles</h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {featured.map((post, index) => (
                                <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                                    <article className="relative h-full rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 to-transparent hover:border-violet-500/50 transition-all duration-500">
                                        {/* Gradient Background */}
                                        <div className={`h-48 bg-gradient-to-br ${categoryColors[post.category] || 'from-violet-600 to-purple-600'} flex items-center justify-center relative overflow-hidden`}>
                                            <div className="absolute inset-0 bg-black/20" />
                                            <span className="text-7xl relative z-10">{categoryIcons[post.category] || '📝'}</span>
                                            {/* Featured badge */}
                                            <div className="absolute top-4 left-4 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                                                ⭐ Featured
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r ${categoryColors[post.category] || 'from-violet-600 to-purple-600'} text-white mb-3`}>
                                                {post.category}
                                            </span>
                                            <h3 className="text-lg font-bold text-white mb-3 group-hover:text-violet-300 transition-colors line-clamp-2">
                                                {post.title}
                                            </h3>
                                            <p className="text-sm text-slate-400 line-clamp-2 mb-4">
                                                {post.description}
                                            </p>
                                            <div className="flex items-center justify-between text-xs text-slate-500">
                                                <span>{post.readTime}</span>
                                                <span>{new Date(post.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* All Posts Grid */}
            <section className="py-16 bg-gradient-to-b from-transparent to-[#0a0118]">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-8 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full" />
                            <h2 className="text-2xl md:text-3xl font-bold text-white">
                                {selectedCategory ? selectedCategory : 'All Articles'}
                            </h2>
                            <span className="px-3 py-1 bg-white/10 rounded-full text-slate-400 text-sm">
                                {sortedPosts.length} posts
                            </span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedPosts.map((post) => (
                            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                                <article className="h-full rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-violet-500/30 transition-all duration-300 overflow-hidden">
                                    {/* Mini gradient header */}
                                    <div className={`h-2 bg-gradient-to-r ${categoryColors[post.category] || 'from-violet-600 to-purple-600'}`} />

                                    <div className="p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-2xl">{categoryIcons[post.category] || '📝'}</span>
                                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                                {post.category}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-violet-300 transition-colors line-clamp-2">
                                            {post.title}
                                        </h3>

                                        <p className="text-sm text-slate-400 line-clamp-2 mb-4">
                                            {post.description}
                                        </p>

                                        <div className="flex items-center gap-4 text-xs text-slate-500 pt-4 border-t border-white/5">
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-rounded text-sm">schedule</span>
                                                {post.readTime}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-rounded text-sm">calendar_today</span>
                                                {new Date(post.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-12">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                ← Previous
                            </button>

                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-10 h-10 rounded-lg font-medium transition-all ${currentPage === page
                                                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white'
                                                : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-purple-600/20" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-600/30 rounded-full blur-[150px]" />

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Build Your Website?
                    </h2>
                    <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                        Get a free consultation and quote for your project
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link
                            href="/pricing"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-8 py-4 rounded-full font-bold hover:opacity-90 transition-all shadow-lg shadow-violet-600/25"
                        >
                            View Pricing
                            <span className="material-symbols-rounded">arrow_forward</span>
                        </Link>
                        <Link
                            href="/#contact"
                            className="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-4 rounded-full font-bold border border-white/20 hover:bg-white/20 transition-all"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
