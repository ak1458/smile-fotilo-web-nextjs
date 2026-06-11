import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Footer } from '../../../components/Footer';
import {
  getAllCategories,
  categoryToSlug,
  getCategoryBySlug,
  getPostsByCategory,
} from '../../../data/blogPosts';
import { PostCard, CategoryNav, BlogCta } from '../../listing';

type Params = Promise<{ category: string }>;

export const dynamic = 'force-static';
export const dynamicParams = false;

// Why a hub gets indexed: one crawlable URL per topic cluster with intro
// copy, instead of client-side filters Google never sees.
const categoryIntros: Record<string, string> = {
  'Web Design':
    'Design decisions, redesign strategy, and what actually makes a business website convert — from someone who builds them every week.',
  SEO: 'Local SEO, rankings, and search strategy for Indian businesses — costs, checklists, and what works in 2026.',
  Business:
    'Growing a business online: lead generation, digital strategy, and lessons from real client projects.',
  'E-commerce':
    'Online stores that sell — WooCommerce, marketplaces, product pages, and conversion.',
  Branding:
    'Brand identity, logos, and positioning for startups and local businesses.',
  Technology:
    'Tools, frameworks, and tech trends that matter for business websites — explained without the jargon.',
  'How-To':
    'Step-by-step guides you can follow today — practical, tested, no fluff.',
};

export function generateStaticParams() {
  return getAllCategories().map((category) => ({
    category: categoryToSlug(category),
  }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};

  const title = `${category} Articles | Smile Fotilo Blog`;
  const description =
    categoryIntros[category] ??
    `Guides and insights on ${category.toLowerCase()} from Smile Fotilo.`;

  return {
    title,
    description,
    alternates: { canonical: `/blog/category/${slug}` },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://smilefotilo.com/blog/category/${slug}`,
      images: [
        {
          url: `/og?title=${encodeURIComponent(category)}&subtitle=Smile%20Fotilo%20Blog`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const posts = getPostsByCategory(category).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <>
      <main className="min-h-screen bg-[#0a0118]">
        <section className="relative overflow-hidden pt-32 pb-16">
          <div className="absolute inset-0 bg-gradient-to-b from-violet-950/50 via-[#0a0118] to-[#0a0118]" />
          <div className="relative z-10 container mx-auto px-4 text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-violet-300">
              Blog · {posts.length} {posts.length === 1 ? 'article' : 'articles'}
            </p>
            <h1 className="mb-6 text-4xl font-bold text-white md:text-6xl">{category}</h1>
            <p className="mx-auto max-w-2xl text-xl text-slate-400">
              {categoryIntros[category]}
            </p>
          </div>
        </section>

        <section className="sticky top-20 z-30 border-y border-white/5 bg-[#0a0118]/80 py-6 backdrop-blur-xl">
          <div className="container mx-auto px-4">
            <CategoryNav activeCategory={category} />
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>

        <BlogCta />
      </main>
      <Footer />
    </>
  );
}
