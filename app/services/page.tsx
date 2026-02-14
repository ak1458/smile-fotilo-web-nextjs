import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services | Smile Fotilo",
  description:
    "Explore Smile Fotilo services: web design and development, SEO & GEO, and brand identity. Built in India, delivered globally.",
  alternates: {
    canonical: "/services",
  },
};

const services = [
  {
    href: "/services/web-design",
    title: "Web Design & Development",
    desc: "Fast, SEO-ready websites built with WordPress, Next.js, and custom stacks.",
    accent: "from-indigo-500/20 to-violet-500/10",
    icon: "code",
  },
  {
    href: "/services/seo",
    title: "SEO & GEO (Zero Position)",
    desc: "Rank in AI Overviews, Featured Snippets, and traditional search with modern SEO.",
    accent: "from-emerald-500/20 to-teal-500/10",
    icon: "trending_up",
  },
  {
    href: "/services/branding",
    title: "Brand Identity & Creative",
    desc: "Logo design, brand systems, packaging, and visual identity that feels premium.",
    accent: "from-rose-500/20 to-pink-500/10",
    icon: "palette",
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Services That{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              Grow
            </span>{" "}
            Your Business
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
            Web design, SEO, and branding engineered for performance and built for
            trust.
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group rounded-3xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all overflow-hidden"
              >
                <div className={`p-8 bg-gradient-to-br ${s.accent}`}>
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white mb-6">
                    <span className="material-symbols-rounded text-3xl">
                      {s.icon}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold mb-3 group-hover:text-indigo-300 transition-colors">
                    {s.title}
                  </h2>
                  <p className="text-slate-300/90 leading-relaxed">{s.desc}</p>
                  <div className="mt-6 inline-flex items-center gap-2 font-semibold text-white/90 group-hover:gap-3 transition-all">
                    Explore <span className="material-symbols-rounded">arrow_forward</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-14 text-center">
            <p className="text-slate-400 mb-6">
              Not sure what you need? Start with pricing or a free consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/pricing"
                className="btn-secondary px-8 py-4 text-lg border border-white/20 rounded-xl hover:bg-white/5"
              >
                View Pricing
              </Link>
              <Link
                href="/#contact"
                className="btn-primary px-8 py-4 text-lg bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold"
              >
                Book a Strategy Call
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

