import type { Metadata } from "next";
import { Footer } from "../components/Footer";
import { blogPosts, getFeaturedPosts } from "../data/blogPosts";
import { PostCard, CategoryNav, Pagination, BlogCta } from "./listing";

const POSTS_PER_PAGE = 12;

export const metadata: Metadata = {
  title: "Blog | Smile Fotilo",
  description:
    "50+ practical guides on web design, local SEO, branding, e-commerce, and AI automation for Indian businesses — costs, checklists, and 2026 trends.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog | Smile Fotilo",
    description:
      "Practical guides on web design, local SEO, branding, and AI automation for growing businesses.",
    type: "website",
    url: "https://smilefotilo.com/blog",
    images: [
      {
        url: "/og?title=Smile%20Fotilo%20Blog&subtitle=Web%20Design%20%C2%B7%20SEO%20%C2%B7%20Branding%20%C2%B7%20AI",
        width: 1200,
        height: 630,
        alt: "Smile Fotilo Blog",
      },
    ],
  },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const sorted = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const totalPages = Math.ceil(sorted.length / POSTS_PER_PAGE);
  const currentPage = Math.min(Math.max(Number(page) || 1, 1), totalPages);
  const paginated = sorted.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  );

  const featured = getFeaturedPosts().slice(0, 3);

  return (
    <>
      <main className="min-h-screen bg-[#0a0118]">
        <section className="relative overflow-hidden pt-32 pb-16">
          <div className="absolute inset-0 bg-gradient-to-b from-violet-950/25 via-[#0a0118] to-[#0a0118] sm:from-violet-950/50" />
          <div className="relative z-10 container mx-auto px-4 text-center">
            <h1 className="mb-6 text-4xl font-bold text-white md:text-6xl">
              Insights &amp; <span className="text-indigo-300">Resources</span>
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-slate-400">
              {blogPosts.length} practical guides on web design, SEO, branding, and growing
              your business online — written from real client work.
            </p>
          </div>
        </section>

        <section className="sticky top-20 z-30 border-y border-white/5 bg-[#0a0118]/80 py-6 backdrop-blur-xl">
          <div className="container mx-auto px-4">
            <CategoryNav />
          </div>
        </section>

        {currentPage === 1 && featured.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="mb-10 flex items-center gap-3">
                <div className="h-8 w-2 rounded-full bg-gradient-to-b from-violet-500 to-purple-500" />
                <h2 className="text-2xl font-bold text-white md:text-3xl">Featured Articles</h2>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
                {featured.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-10 flex items-center gap-3">
              <div className="h-8 w-2 rounded-full bg-gradient-to-b from-cyan-500 to-blue-500" />
              <h2 className="text-2xl font-bold text-white md:text-3xl">All Articles</h2>
              <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-slate-400">
                {sorted.length} posts
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
              {paginated.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/blog" />
          </div>
        </section>

        <BlogCta />
      </main>
      <Footer />
    </>
  );
}
