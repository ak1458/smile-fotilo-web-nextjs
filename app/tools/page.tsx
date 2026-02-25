import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free AI Tools',
  description:
    'Use free AI tools to audit websites, generate content, build brand kits, and plan growth workflows.',
  alternates: {
    canonical: '/tools',
  },
};

const tools = [
  {
    href: '/tools/website-audit',
    title: 'Website Audit',
    badge: 'Audit',
    color: 'from-violet-600 to-indigo-600',
    borderColor: 'border-violet-500/20 hover:border-violet-500/40',
    glowColor: 'group-hover:shadow-violet-500/20',
    description: 'Instant SEO, performance, and security analysis with grading.',
    features: ['SEO checks', 'A-F score', 'Issue list', 'Recommendations'],
  },
  {
    href: '/tools/seo-content',
    title: 'SEO Content Engine',
    badge: 'SEO',
    color: 'from-emerald-600 to-cyan-600',
    borderColor: 'border-emerald-500/20 hover:border-emerald-500/40',
    glowColor: 'group-hover:shadow-emerald-500/20',
    description: 'Generate blog titles, meta descriptions, keywords, and outlines.',
    features: ['Titles', 'Meta descriptions', 'Keywords', 'Outlines'],
  },
  {
    href: '/tools/brand-kit',
    title: 'AI Brand Kit',
    badge: 'Brand',
    color: 'from-amber-600 to-orange-600',
    borderColor: 'border-amber-500/20 hover:border-amber-500/40',
    glowColor: 'group-hover:shadow-amber-500/20',
    description: 'Create color palettes, brand voice, taglines, and social bios.',
    features: ['Palette', 'Voice', 'Taglines', 'Social bios'],
  },
  {
    href: '/tools/content-calendar',
    title: 'Content Calendar',
    badge: 'Calendar',
    color: 'from-pink-600 to-rose-600',
    borderColor: 'border-pink-500/20 hover:border-pink-500/40',
    glowColor: 'group-hover:shadow-pink-500/20',
    description: 'Plan 7-day social content with captions and hashtags.',
    features: ['Weekly plan', 'Captions', 'Hashtags', 'Posting tips'],
  },
  {
    href: '/tools/document-intelligence',
    title: 'Document Intelligence',
    badge: 'Docs',
    color: 'from-blue-600 to-cyan-600',
    borderColor: 'border-blue-500/20 hover:border-blue-500/40',
    glowColor: 'group-hover:shadow-blue-500/20',
    description: 'Extract summaries and structured insights from raw documents.',
    features: ['Summary', 'Extraction', 'Action items', 'Multi-domain'],
  },
  {
    href: '/tools/website-factory',
    title: 'Website Factory',
    badge: 'Factory',
    color: 'from-sky-600 to-indigo-600',
    borderColor: 'border-sky-500/20 hover:border-sky-500/40',
    glowColor: 'group-hover:shadow-sky-500/20',
    description: 'Generate complete website blueprints from a short brief.',
    features: ['Sitemap', 'Copy blocks', 'SEO terms', 'Launch checklist'],
  },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/3 h-96 w-96 rounded-full bg-violet-500/5 blur-3xl" />
        <div className="absolute bottom-20 right-1/3 h-80 w-80 rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-24">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold md:text-6xl">
            Free AI <span className="bg-gradient-to-r from-violet-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">Tools</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/40">
            Analyze, optimize, and automate growth workflows without setup friction.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 md:gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.title}
              href={tool.href}
              className={`group min-h-[240px] sm:min-h-[280px] rounded-2xl border ${tool.borderColor} bg-white/5 p-3 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.07] hover:shadow-xl ${tool.glowColor} flex flex-col`}
            >
              <div className="mb-2 sm:mb-3 inline-flex rounded-full border border-white/10 bg-white/5 px-2.5 py-1 sm:px-3 text-[10px] sm:text-xs uppercase tracking-wide text-white/60">
                {tool.badge}
              </div>
              <h2 className="text-base sm:text-xl font-bold leading-tight">{tool.title}</h2>
              <p className="mb-3 sm:mb-4 mt-2 text-xs sm:text-sm leading-relaxed text-white/50 line-clamp-3 sm:line-clamp-none">{tool.description}</p>
              <div className="mb-3 sm:mb-4 flex flex-wrap gap-1.5 sm:gap-2">
                {tool.features.map((f, index) => (
                  <span key={f} className={`rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] sm:text-[11px] text-white/40 ${index > 1 ? 'hidden sm:inline-flex' : ''}`}>
                    {f}
                  </span>
                ))}
              </div>
              <span className={`mt-auto inline-flex items-center gap-1.5 bg-gradient-to-r ${tool.color} bg-clip-text text-xs sm:text-sm font-medium text-transparent`}>
                Open tool {"->"}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
