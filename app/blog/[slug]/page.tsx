import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { blogPosts, getBlogPost, getRecentPosts } from '../../data/blogPosts';

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
    return blogPosts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { slug } = await params;
    const post = getBlogPost(slug);

    if (!post) return { title: 'Post Not Found' };

    return {
        title: `${post.title} | Smile Fotilo Blog`,
        description: post.description,
        authors: [{ name: post.author }],
        openGraph: {
            title: post.title,
            description: post.description,
            type: 'article',
            publishedTime: post.date,
            authors: [post.author],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.description,
        },
    };
}

export default async function BlogPostPage({ params }: { params: Params }) {
    const { slug } = await params;
    const post = getBlogPost(slug);

    if (!post) {
        notFound();
    }

    const relatedPosts = getRecentPosts(4).filter(p => p.slug !== slug).slice(0, 3);

    // Article Schema
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.description,
        "author": {
            "@type": "Person",
            "name": post.author,
            "url": "https://smilefotilo.com/about"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Smile Fotilo",
            "logo": {
                "@type": "ImageObject",
                "url": "https://smilefotilo.com/logo.png"
            }
        },
        "datePublished": post.date,
        "dateModified": post.date,
        "mainEntityOfPage": `https://smilefotilo.com/blog/${post.slug}`
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />

            <main className="min-h-screen bg-white dark:bg-slate-950">
                {/* Breadcrumb */}
                <div className="bg-slate-100 dark:bg-slate-900 py-4">
                    <div className="container mx-auto px-4">
                        <nav className="text-sm text-slate-600 dark:text-slate-400">
                            <Link href="/" className="hover:text-indigo-600">Home</Link>
                            <span className="mx-2">/</span>
                            <Link href="/blog" className="hover:text-indigo-600">Blog</Link>
                            <span className="mx-2">/</span>
                            <span className="text-slate-900 dark:text-white">{post.category}</span>
                        </nav>
                    </div>
                </div>

                {/* Article Header */}
                <header className="py-12 bg-gradient-to-br from-indigo-600 to-violet-600">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <span className="inline-block bg-white/20 text-white text-sm px-3 py-1 rounded-full mb-4">
                            {post.category}
                        </span>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-white/80">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                    <span className="text-lg">👤</span>
                                </div>
                                <span>{post.author}</span>
                            </div>
                            <span>
                                {new Date(post.date).toLocaleDateString('en-IN', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </span>
                            <span>{post.readTime}</span>
                        </div>
                    </div>
                </header>

                {/* Article Content */}
                <article className="py-12">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="prose prose-lg dark:prose-invert max-w-none
                            prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white
                            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-slate-200 dark:prose-h2:border-slate-800
                            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                            prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-3
                            prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-4
                            prose-li:text-slate-700 dark:prose-li:text-slate-300 prose-li:my-1
                            prose-ul:my-6 prose-ol:my-6
                            prose-strong:text-slate-900 dark:prose-strong:text-white prose-strong:font-semibold
                            prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                            prose-blockquote:border-l-4 prose-blockquote:border-indigo-600 prose-blockquote:pl-4 prose-blockquote:italic
                            prose-code:text-indigo-600 dark:prose-code:text-indigo-400 prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                            prose-pre:bg-slate-900 prose-pre:text-slate-100
                            prose-table:border-collapse prose-table:w-full prose-table:my-8
                            prose-thead:bg-slate-100 dark:prose-thead:bg-slate-800
                            prose-th:p-3 prose-th:text-left prose-th:font-semibold prose-th:border prose-th:border-slate-300 dark:prose-th:border-slate-700
                            prose-td:p-3 prose-td:border prose-td:border-slate-200 dark:prose-td:border-slate-700
                            prose-hr:my-8 prose-hr:border-slate-200 dark:prose-hr:border-slate-800
                            prose-img:rounded-lg prose-img:shadow-lg">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {post.content}
                            </ReactMarkdown>
                        </div>

                        {/* Tags */}
                        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
                            <h3 className="text-sm font-semibold text-slate-500 mb-3">TAGS</h3>
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-sm"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* CTA Box */}
                        <div className="mt-12 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-8 text-center">
                            <h3 className="text-2xl font-bold text-white mb-3">
                                Need Help With Your Project?
                            </h3>
                            <p className="text-white/80 mb-6">
                                Get a free consultation and quote from our experts
                            </p>
                            <Link
                                href="/pricing"
                                className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold hover:bg-slate-100 transition-colors"
                            >
                                Get Free Quote →
                            </Link>
                        </div>
                    </div>
                </article>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <section className="py-12 bg-slate-50 dark:bg-slate-900">
                        <div className="container mx-auto px-4 max-w-4xl">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
                                Related Articles
                            </h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                {relatedPosts.map(related => (
                                    <Link key={related.slug} href={`/blog/${related.slug}`} className="group">
                                        <article className="bg-white dark:bg-slate-800 rounded-xl p-5 hover:shadow-lg transition-all">
                                            <span className="text-xs font-medium text-indigo-600">
                                                {related.category}
                                            </span>
                                            <h3 className="text-base font-semibold text-slate-900 dark:text-white mt-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                                {related.title}
                                            </h3>
                                            <span className="text-xs text-slate-500 mt-2 block">
                                                {related.readTime}
                                            </span>
                                        </article>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </>
    );
}
