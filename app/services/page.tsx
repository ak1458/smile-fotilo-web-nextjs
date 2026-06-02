import type { Metadata } from "next";
import Link from "next/link";
import { MdCode, MdTrendingUp, MdPalette, MdArrowForward, MdLocalHospital } from 'react-icons/md';
import { OpenChatButton } from "../components/OpenChatButton";
import { Footer } from "../components/Footer";
import { StructuredData, itemListSchema } from "../components/StructuredData";

export const metadata: Metadata = {
  title: "Services | Smile Fotilo",
  description:
    "Explore Smile Fotilo services: web design and development, SEO & GEO, brand identity, and Growth Autopilot for local-business operations.",
  alternates: {
    canonical: "/services",
  },
};

const services = [
  {
    href: "/services/web-design",
    title: "Web Design & Development",
    mobileTitle: "Web Design",
    desc: "Fast, SEO-ready websites built with WordPress, Next.js, and custom stacks.",
    mobileDesc: "Fast, SEO-ready websites built to convert.",
    accent: "from-indigo-500/20 to-violet-500/10",
    icon: <MdCode />,
  },
  {
    href: "/services/seo",
    title: "SEO & GEO (Zero Position)",
    mobileTitle: "SEO & GEO",
    desc: "Rank in AI Overviews, Featured Snippets, and traditional search with modern SEO.",
    mobileDesc: "Rank in AI Overviews and search with modern SEO.",
    accent: "from-emerald-500/20 to-teal-500/10",
    icon: <MdTrendingUp />,
  },
  {
    href: "/services/branding",
    title: "Brand Identity & Creative",
    mobileTitle: "Brand Identity",
    desc: "Logo design, brand systems, packaging, and visual identity that feels premium.",
    mobileDesc: "Logo, brand system, and premium visual identity.",
    accent: "from-rose-500/20 to-pink-500/10",
    icon: <MdPalette />,
  },
  {
    href: "/services/clinic-growth-autopilot",
    title: "Growth Autopilot",
    mobileTitle: "Growth AI",
    desc: "Workflow automation for local businesses: followups, reminders, reviews, and bilingual inquiry handling.",
    mobileDesc: "AI workflows for followups, reminders, and reviews.",
    accent: "from-cyan-500/20 to-blue-500/10",
    icon: <MdLocalHospital />,
  },
];

export default function ServicesPage() {
  return (
    <>
      <StructuredData
        data={itemListSchema({
          id: 'https://smilefotilo.com/services#service-list',
          name: 'Smile Fotilo services',
          description: metadata.description as string,
          url: 'https://smilefotilo.com/services',
          items: services.map((service) => ({
            name: service.title,
            description: service.desc,
            url: `https://smilefotilo.com${service.href}`,
          })),
        })}
      />
      <main className="min-h-screen bg-[#020617] text-white">
        {/* Hero */}
        <section className="pt-32 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Services That{" "}
              <span className="text-indigo-300">
                Grow
              </span>{" "}
              Your Business
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
              Web design, SEO, branding, and vertical-first AI automation engineered for performance and trust.
            </p>
          </div>
        </section>

        {/* Cards */}
        <section className="pb-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:gap-6">
              {services.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="group h-full rounded-3xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 aspect-auto"
                >
                  <div className={`h-full min-h-[220px] sm:min-h-[250px] lg:min-h-[250px] p-4 sm:p-5 lg:p-6 bg-gradient-to-br ${s.accent} flex flex-col`}>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white mb-4 sm:mb-5">
                      <span className="text-2xl sm:text-3xl">{s.icon}</span>
                    </div>
                    <h2 className="text-xl sm:text-xl lg:text-2xl leading-tight font-bold mb-2 sm:mb-3 group-hover:text-indigo-300 transition-colors">
                      <span className="sm:hidden">{s.mobileTitle}</span>
                      <span className="hidden sm:inline">{s.title}</span>
                    </h2>
                    <p className="text-slate-300/90 text-sm sm:text-base leading-relaxed">
                      <span className="sm:hidden">{s.mobileDesc}</span>
                      <span className="hidden sm:inline">{s.desc}</span>
                    </p>
                    <div className="mt-auto pt-3 sm:pt-6 inline-flex items-center gap-2 font-semibold text-white/90 group-hover:gap-3 transition-all text-sm sm:text-base">
                      Explore <MdArrowForward />
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
                <OpenChatButton
                  prompt="I want to book a strategy call. Please ask me about my business and goals."
                  className="btn-primary px-8 py-4 text-lg bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold"
                >
                  <span>Book a Strategy Call</span>
                </OpenChatButton>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
