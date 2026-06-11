import Link from 'next/link';
import { Metadata } from 'next';
import { StructuredData, itemListSchema } from '../components/StructuredData';

export const metadata: Metadata = {
  title: 'Free AI Tools',
  description:
    'Use free AI tools to audit websites, generate content, build brand kits, and plan growth workflows.',
  alternates: {
    canonical: '/tools',
  },
  openGraph: {
    title: 'Free AI Tools | Smile Fotilo',
    description:
      'Free website audit, SEO content engine, brand kit generator, and more — no signup required.',
    type: 'website',
    url: 'https://smilefotilo.com/tools',
    images: [
      {
        url: '/og?title=Free%20AI%20Tools&subtitle=Website%20Audit%20%C2%B7%20SEO%20%C2%B7%20Brand%20Kit',
        width: 1200,
        height: 630,
        alt: 'Smile Fotilo Free AI Tools',
      },
    ],
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
    <>
    <StructuredData
      data={itemListSchema({
        id: 'https://smilefotilo.com/tools#tool-list',
        name: 'Smile Fotilo free AI tools',
        description: metadata.description as string,
        url: 'https://smilefotilo.com/tools',
        items: tools.map((tool) => ({
          name: tool.title,
          description: tool.description,
          url: `https://smilefotilo.com${tool.href}`,
        })),
      })}
    />
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/3 h-96 w-96 rounded-full bg-violet-500/5 blur-3xl" />
        <div className="absolute bottom-20 right-1/3 h-80 w-80 rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-24">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold md:text-6xl">
            Free <span className="text-indigo-300">Tools</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/40">
            No signup, no email gate. Run them now — and if the results show work to do, that&apos;s what I&apos;m here for.
          </p>
        </div>

        {/* Flagship: the audit tool runs real checks and is the natural first step. */}
        <Link
          href={tools[0].href}
          className="group mb-10 block rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-600/15 to-indigo-600/10 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/50 md:p-12"
        >
          <div className="mb-3 inline-flex rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-violet-300">
            Start here
          </div>
          <h2 className="text-2xl font-bold md:text-4xl">{tools[0].title}</h2>
          <p className="mt-3 max-w-2xl text-base text-white/60 md:text-lg">
            {tools[0].description} Enter your URL, get an A–F grade in seconds.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {tools[0].features.map((f) => (
              <span key={f} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/50">
                {f}
              </span>
            ))}
          </div>
          <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-violet-300 transition-transform group-hover:translate-x-1">
            Run a free audit {"->"}
          </span>
        </Link>

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-5 md:gap-6">
          {tools.slice(1).map((tool) => (
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
    </>
  );
}
