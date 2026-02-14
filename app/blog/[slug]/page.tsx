import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { blogPosts, getBlogPost, getRecentPosts } from '../../data/blogPosts';
import { ReadingProgressBar } from './ReadingProgressBar';

type Params = Promise<{ slug: string }>;

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
    return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { slug } = await params;
    const post = getBlogPost(slug);
    if (!post) return {};

    const title = `${post.title} | Smile Fotilo`;
    const description = post.description;
    const canonical = `/blog/${post.slug}`;
    const ogImage = `/og?title=${encodeURIComponent(post.title)}&subtitle=${encodeURIComponent(post.category)}`;

    return {
        title,
        description,
        keywords: post.tags,
        alternates: {
            canonical,
        },
        openGraph: {
            title,
            description,
            type: 'article',
            url: canonical,
            publishedTime: new Date(post.date).toISOString(),
            authors: [post.author],
            tags: post.tags,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImage],
        },
    };
}

export default async function BlogPostPage({ params }: { params: Params }) {
    const { slug } = await params;

    const post = getBlogPost(slug);
    if (!post) {
        notFound();
    }

    const relatedPosts = getRecentPosts(4).filter((p) => p.slug !== slug).slice(0, 3);

    const canonicalUrl = `https://smilefotilo.com/blog/${post.slug}`;
    const ogImageUrl = `https://smilefotilo.com/og?title=${encodeURIComponent(post.title)}&subtitle=${encodeURIComponent(post.category)}`;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        name: 'Home',
                        item: 'https://smilefotilo.com/',
                    },
                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: 'Blog',
                        item: 'https://smilefotilo.com/blog',
                    },
                    {
                        '@type': 'ListItem',
                        position: 3,
                        name: post.title,
                        item: canonicalUrl,
                    },
                ],
            },
            {
                '@type': 'BlogPosting',
                mainEntityOfPage: {
                    '@type': 'WebPage',
                    '@id': canonicalUrl,
                },
                headline: post.title,
                description: post.description,
                image: [ogImageUrl],
                datePublished: new Date(post.date).toISOString(),
                dateModified: new Date(post.date).toISOString(),
                author: {
                    '@type': 'Person',
                    name: post.author,
                },
                publisher: {
                    '@type': 'Organization',
                    name: 'Smile Fotilo',
                    logo: {
                        '@type': 'ImageObject',
                        url: 'https://smilefotilo.com/logo.png',
                    },
                },
                articleSection: post.category,
                keywords: post.tags.join(', '),
            },
        ],
    };

    return (
        <>
            <ReadingProgressBar />

            <main className="min-h-screen bg-white dark:bg-slate-950">
                {/* BlogPosting Schema */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />

                {/* Hero Section with Image */}
                <article>
                    <header className="relative">
                        {/* Hero Image */}
                        <div className="relative w-full h-[60vh] bg-gradient-to-br from-indigo-600 to-violet-600">
                            {post.image && (
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover opacity-20"
                                    priority
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                            {/* Title Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                                <div className="container mx-auto max-w-4xl">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                                            {post.category}
                                        </span>
                                        <span className="text-white/80 text-sm">{post.readTime}</span>
                                    </div>
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                                        {post.title}
                                    </h1>
                                    <p className="text-xl text-white/90 mb-6 max-w-3xl">
                                        {post.description}
                                    </p>
                                    <div className="flex items-center gap-4 text-white/80">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                                <span className="text-2xl">✍️</span>
                                            </div>
                                            <div>
                                                <div className="font-medium text-white">{post.author}</div>
                                                <div className="text-sm">
                                                    {new Date(post.date).toLocaleDateString('en-IN', {
                                                        month: 'long',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Breadcrumb */}
                        <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                            <div className="container mx-auto px-4 max-w-4xl py-3">
                                <nav className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                    <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
                                    <span>/</span>
                                    <Link href="/blog" className="hover:text-indigo-600 transition-colors">Blog</Link>
                                    <span>/</span>
                                    <span className="text-slate-900 dark:text-white font-medium line-clamp-1">{post.title}</span>
                                </nav>
                            </div>
                        </div>
                    </header>

                    {/* Article Content */}
                    <div className="py-12 md:py-16">
                        <div className="container mx-auto px-4 max-w-3xl">
                            {/* Main Content */}
                            <div className="prose prose-xl dark:prose-invert max-w-none
                                prose-headings:font-bold prose-headings:tracking-tight
                                prose-h2:text-4xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:leading-tight
                                prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-4
                                prose-h4:text-xl prose-h4:mt-8 prose-h4:mb-3
                                prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:text-lg prose-p:leading-relaxed prose-p:mb-6
                                prose-li:text-slate-700 dark:prose-li:text-slate-300 prose-li:text-lg prose-li:my-2
                                prose-ul:my-8 prose-ol:my-8 prose-ul:space-y-2 prose-ol:space-y-2
                                prose-strong:text-slate-900 dark:prose-strong:text-white prose-strong:font-semibold
                                prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium prose-a:transition-colors
                                prose-blockquote:border-l-4 prose-blockquote:border-indigo-600 prose-blockquote:bg-indigo-50 dark:prose-blockquote:bg-indigo-950/20 prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:my-8 prose-blockquote:italic prose-blockquote:text-slate-700 dark:prose-blockquote:text-slate-300
                                prose-code:text-indigo-600 dark:prose-code:text-indigo-400 prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-base prose-code:font-mono
                                prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-xl prose-pre:p-6 prose-pre:my-8
                                prose-table:border-collapse prose-table:w-full prose-table:my-10 prose-table:rounded-lg prose-table:overflow-hidden
                                prose-thead:bg-slate-100 dark:prose-thead:bg-slate-800
                                prose-th:p-4 prose-th:text-left prose-th:font-semibold prose-th:border-b-2 prose-th:border-slate-300 dark:prose-th:border-slate-700 prose-th:text-slate-900 dark:prose-th:text-white
                                prose-td:p-4 prose-td:border-b prose-td:border-slate-200 dark:prose-td:border-slate-800
                                prose-hr:my-12 prose-hr:border-slate-200 dark:prose-hr:border-slate-800
                                prose-img:rounded-2xl prose-img:shadow-2xl prose-img:my-12">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        // Custom rendering for images
                                        img: ({ ...props }) => (
                                            <div className="my-12">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img {...props} alt={props.alt || ''} className="rounded-2xl shadow-2xl w-full" />
                                                {props.alt && (
                                                    <p className="text-center text-sm text-slate-500 mt-3 italic">{props.alt}</p>
                                                )}
                                            </div>
                                        ),
                                        // Custom rendering for links
                                        a: ({ ...props }) => (
                                            <a {...props} className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium transition-colors" />
                                        ),
                                    }}
                                >
                                    {post.content}
                                </ReactMarkdown>
                            </div>

                            {/* Tags */}
                            <div className="mt-16 pt-8 border-t-2 border-slate-200 dark:border-slate-800">
                                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Topics</h2>
                                <div className="flex flex-wrap gap-3">
                                    {post.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Author CTA */}
                            <div className="mt-16 bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20 rounded-3xl p-8 md:p-10 border border-indigo-100 dark:border-indigo-900">
                                <div className="flex items-start gap-6">
                                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-4xl">✍️</span>
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                            Written by {post.author}
                                        </h2>
                                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                                            Expert in web design and development, helping businesses grow online since 2020.
                                        </p>
                                        <Link
                                            href="/pricing"
                                            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
                                        >
                                            Work With Us →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <section className="py-16 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                        <div className="container mx-auto px-4 max-w-6xl">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-10">
                                Continue Reading
                            </h2>
                            <div className="grid md:grid-cols-3 gap-8">
                                {relatedPosts.map((related) => (
                                    <Link key={related.slug} href={`/blog/${related.slug}`} className="group">
                                        <article className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                                            {related.image && (
                                                <div className="relative h-48 bg-gradient-to-br from-indigo-600 to-violet-600 overflow-hidden">
                                                    <Image
                                                        src={related.image}
                                                        alt={related.title}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>
                                            )}
                                            <div className="p-6 flex-1 flex flex-col">
                                                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-3">
                                                    {related.category}
                                                </span>
                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                                                    {related.title}
                                                </h3>
                                                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-4 flex-1">
                                                    {related.description}
                                                </p>
                                                <div className="flex items-center justify-between text-sm text-slate-500">
                                                    <span>{related.readTime}</span>
                                                    <span className="text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">→</span>
                                                </div>
                                            </div>
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
