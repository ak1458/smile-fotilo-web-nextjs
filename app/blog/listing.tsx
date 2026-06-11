import Link from 'next/link';
import { MdSchedule, MdCalendarToday, MdArrowForward } from 'react-icons/md';
import {
  BlogPost,
  blogPosts,
  getAllCategories,
  categoryToSlug,
} from '../data/blogPosts';

// Accent strip per category — replaces the old emoji icon system.
export const categoryColors: Record<string, string> = {
  'Web Design': 'from-violet-600 to-purple-600',
  SEO: 'from-emerald-600 to-cyan-600',
  Business: 'from-amber-500 to-orange-500',
  'E-commerce': 'from-pink-500 to-rose-500',
  Branding: 'from-indigo-500 to-blue-500',
  Technology: 'from-cyan-500 to-blue-500',
  'How-To': 'from-green-500 to-emerald-500',
};

export function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <article className="h-full overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] transition-all duration-300 hover:border-violet-500/30 hover:bg-white/[0.05] sm:rounded-2xl">
        <div className={`h-1.5 bg-gradient-to-r ${categoryColors[post.category] || 'from-violet-600 to-purple-600'}`} />
        <div className="p-4 sm:p-6">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:text-xs">
            {post.category}
          </span>
          <h3 className="mt-2 mb-2 line-clamp-2 text-sm font-semibold text-white transition-colors group-hover:text-violet-300 sm:mb-3 sm:text-lg">
            {post.title}
          </h3>
          <p className="mb-4 hidden text-sm text-slate-400 line-clamp-2 sm:block">
            {post.description}
          </p>
          <div className="flex items-center gap-3 border-t border-white/5 pt-3 text-[10px] text-slate-500 sm:gap-4 sm:pt-4 sm:text-xs">
            <span className="flex items-center gap-1">
              <MdSchedule className="text-sm" />
              {post.readTime}
            </span>
            <span className="flex items-center gap-1">
              <MdCalendarToday className="text-sm" />
              {new Date(post.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export function CategoryNav({ activeCategory }: { activeCategory?: string }) {
  const categories = getAllCategories();
  const pill = (active: boolean) =>
    `px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
      active
        ? 'bg-violet-600 text-white'
        : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/10'
    }`;

  return (
    <nav aria-label="Blog categories" className="flex flex-wrap justify-center gap-3">
      <Link href="/blog" className={pill(!activeCategory)}>
        All ({blogPosts.length})
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat}
          href={`/blog/category/${categoryToSlug(cat)}`}
          className={pill(activeCategory === cat)}
        >
          {cat}
        </Link>
      ))}
    </nav>
  );
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
}) {
  if (totalPages <= 1) return null;

  const pageHref = (page: number) => (page === 1 ? basePath : `${basePath}?page=${page}`);

  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2">
      {currentPage > 1 ? (
        <Link
          href={pageHref(currentPage - 1)}
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-slate-400 transition-all hover:bg-white/10"
        >
          ← Previous
        </Link>
      ) : (
        <span className="cursor-not-allowed rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-slate-600">
          ← Previous
        </span>
      )}

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Link
            key={page}
            href={pageHref(page)}
            aria-current={currentPage === page ? 'page' : undefined}
            className={`flex h-10 w-10 items-center justify-center rounded-lg font-medium transition-all ${
              currentPage === page
                ? 'bg-violet-600 text-white'
                : 'bg-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            {page}
          </Link>
        ))}
      </div>

      {currentPage < totalPages ? (
        <Link
          href={pageHref(currentPage + 1)}
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-slate-400 transition-all hover:bg-white/10"
        >
          Next →
        </Link>
      ) : (
        <span className="cursor-not-allowed rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-slate-600">
          Next →
        </span>
      )}
    </nav>
  );
}

export function BlogCta() {
  return (
    <section className="relative overflow-hidden py-20">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/15 to-indigo-600/15" />
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
          Ready to put this into practice?
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-slate-400">
          Get a free quote for your website, SEO, or automation project — reply within 24 hours.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-4 font-bold text-white transition-colors hover:bg-indigo-500"
          >
            Get a Free Quote
            <MdArrowForward />
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-4 font-bold text-white transition-all hover:bg-white/20"
          >
            View Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}
