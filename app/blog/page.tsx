import { Metadata } from 'next';
import Link from 'next/link';
import { blogPosts, getFeaturedPosts, getAllCategories } from '../data/blogPosts';

export const metadata: Metadata = {
    title: 'Blog | Web Design, SEO & Digital Marketing Tips | Smile Fotilo',
    description: 'Expert insights on web design, SEO, digital marketing, and business growth. Free guides and tutorials for Indian businesses.',
    openGraph: {
        title: 'Smile Fotilo Blog - Web Design & Marketing Insights',
        description: 'Expert tips on websites, SEO, branding for Indian businesses',
    },
};

export default function BlogPage() {
    const featured = getFeaturedPosts();
    const categories = getAllCategories();
    const recentPosts = [...blogPosts].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Hero */}
            <section className="bg-gradient-to-br from-indigo-600 to-violet-600 py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Blog & Resources
                    </h1>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto">
                        Expert insights on web design, SEO, and growing your business online
                    </p>
                </div>
            </section>

            {/* Categories */}
            <section className="py-8 border-b border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link href="/blog" className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-medium">
                            All Posts
                        </Link>
                        {categories.map(cat => (
                            <Link
                                key={cat}
                                href={`/blog?category=${encodeURIComponent(cat)}`}
                                className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors"
                            >
                                {cat}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Posts */}
            {featured.length > 0 && (
                <section className="py-12">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
                            Featured Articles
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featured.slice(0, 3).map(post => (
                                <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                                    <article className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                                        <div className="h-48 bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                                            <span className="text-6xl">📝</span>
                                        </div>
                                        <div className="p-6">
                                            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                                                {post.category}
                                            </span>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                                {post.title}
                                            </h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                                {post.description}
                                            </p>
                                            <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
                                                <span>{post.readTime}</span>
                                                <span>{new Date(post.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* All Posts */}
            <section className="py-12 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
                        All Articles ({blogPosts.length})
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recentPosts.map(post => (
                            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                                <article className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 hover:shadow-lg transition-all">
                                    <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                                        {post.category}
                                    </span>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mt-2 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                        {post.description}
                                    </p>
                                    <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
                                        <span>{post.readTime}</span>
                                        <span>{new Date(post.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-gradient-to-r from-indigo-600 to-violet-600">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to Build Your Website?
                    </h2>
                    <p className="text-white/80 mb-8 max-w-xl mx-auto">
                        Get a free consultation and quote for your project
                    </p>
                    <Link
                        href="/pricing"
                        className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold hover:bg-slate-100 transition-colors"
                    >
                        View Pricing
                        <span>→</span>
                    </Link>
                </div>
            </section>
        </main>
    );
}
