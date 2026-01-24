import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Web Design & Development Services India | Smile Fotilo',
    description: 'Custom web design starting ₹15,999. We build WordPress, e-commerce, and Next.js websites for Indian businesses. Mobile-first, SEO-optimized, 2-3 week delivery.',
    keywords: 'web design India, website development Lucknow, WordPress developer, e-commerce website, responsive web design, website cost India',
    openGraph: {
        title: 'Web Design & Development Services India | Smile Fotilo',
        description: 'Custom web design starting ₹15,999. Mobile-first, SEO-optimized websites for Indian businesses.',
        type: 'website',
    },
};

// FAQ Schema for featured snippets
const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "How much does a website cost in India?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Website costs in India range from ₹15,999 for basic business websites to ₹35,000-75,000 for e-commerce sites. Enterprise solutions are custom-quoted based on requirements. At Smile Fotilo, all packages include mobile optimization, basic SEO, and SSL security."
            }
        },
        {
            "@type": "Question",
            "name": "How long does it take to build a website?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "A standard business website takes 2-3 weeks. E-commerce sites with inventory take 4-6 weeks. Complex web applications may take 8-12 weeks. We provide detailed timelines during your free strategy call."
            }
        },
        {
            "@type": "Question",
            "name": "Do you build on WordPress or custom code?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "We specialize in both. WordPress is ideal for content-heavy sites with easy updates. For complex applications, we use Next.js, React, or custom PHP solutions. We recommend the best fit during consultation."
            }
        },
        {
            "@type": "Question",
            "name": "Will my website work on mobile phones?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, all our websites are mobile-first, meaning they're designed for phones first, then scaled up. We test on 20+ device sizes before launch to ensure perfect responsiveness."
            }
        },
        {
            "@type": "Question",
            "name": "What about SEO?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Every website includes on-page SEO fundamentals: meta tags, schema markup, fast loading, and mobile optimization. For ongoing SEO campaigns, we offer dedicated SEO services that can help you rank on Google's Zero Position."
            }
        }
    ]
};

export default function WebDesignPage() {
    const faqs = [
        {
            question: "How much does a website cost in India?",
            answer: "Our website packages start from ₹15,999 for basic business websites. E-commerce sites typically range from ₹35,000-75,000 depending on features. Enterprise solutions are custom-quoted based on requirements."
        },
        {
            question: "How long does it take to build a website?",
            answer: "A standard business website takes 2-3 weeks. E-commerce sites with inventory take 4-6 weeks. Complex web applications may take 8-12 weeks. We provide detailed timelines during your strategy call."
        },
        {
            question: "Do you build on WordPress or custom code?",
            answer: "We specialize in both. WordPress is ideal for content-heavy sites with easy updates. For complex applications, we use Next.js, React, or custom PHP solutions. We recommend the best fit during consultation."
        },
        {
            question: "Will my website work on mobile phones?",
            answer: "Absolutely. All our websites are mobile-first, meaning they're designed for phones first, then scaled up. We test on 20+ device sizes before launch."
        },
        {
            question: "Do you provide hosting and domain?",
            answer: "Yes. We offer managed hosting starting ₹2,999/year with SSL, daily backups, and 99.9% uptime. Domain registration is included in most packages or available separately."
        },
        {
            question: "What about SEO?",
            answer: "Every website includes on-page SEO fundamentals: meta tags, schema markup, fast loading, and mobile optimization. For ongoing SEO campaigns, see our SEO services."
        },
        {
            question: "Can you redesign my existing website?",
            answer: "Yes. We can migrate and redesign existing WordPress, Wix, or custom sites while preserving your SEO rankings. We handle content migration and 301 redirects."
        },
        {
            question: "Do you work with clients outside India?",
            answer: "Yes! We serve enterprise clients in USA (Texas), Mexico, and across Asia. We're comfortable with timezone differences and use Zoom, Slack, and WhatsApp for communication."
        }
    ];

    return (
        <main className="min-h-screen bg-[#020617] text-white">
            {/* FAQ Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            {/* Hero Section - Lead with Answer */}
            <section className="pt-32 pb-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Web Design & Development <br />
                        <span className="text-indigo-400">for Indian Businesses</span>
                    </h1>
                    {/* Lead-with-Answer: Direct answer for featured snippets */}
                    <p className="text-xl text-slate-300 mb-4 max-w-2xl mx-auto">
                        <strong className="text-white">Custom websites starting at ₹15,999 with 2-3 week delivery.</strong> We build
                        fast, secure, SEO-optimized websites using WordPress, Next.js, and custom solutions.
                    </p>
                    <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
                        Mobile-first design, on-page SEO included, and 24/7 support. From local shops to enterprise brands.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/#contact" className="btn-primary px-8 py-4 text-lg bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold">
                            Get Free Quote
                        </Link>
                        <Link href="/work" className="btn-secondary px-8 py-4 text-lg border border-white/20 rounded-xl hover:bg-white/5">
                            View Portfolio
                        </Link>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20 bg-[#0a0118]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">What We Build</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: "🏪", title: "Business Websites", desc: "Professional websites for local businesses, startups, and professionals. Clean design, fast loading, SEO-ready." },
                            { icon: "🛒", title: "E-Commerce Stores", desc: "WooCommerce and custom stores with payment gateway, inventory, and shipping integration." },
                            { icon: "📱", title: "Web Applications", desc: "Custom dashboards, CRM systems, booking platforms built with React/Next.js." },
                            { icon: "📝", title: "WordPress Sites", desc: "Content management, blogs, portfolios with easy self-editing capabilities." },
                            { icon: "🔄", title: "Website Redesigns", desc: "Modern redesigns that preserve SEO while improving performance and conversions." },
                            { icon: "🚀", title: "Landing Pages", desc: "High-converting landing pages for campaigns, launches, and lead generation." }
                        ].map((service, i) => (
                            <div key={i} className="p-6 border border-white/10 rounded-2xl bg-[#0F172A]/50 hover:border-indigo-500/30 transition-colors">
                                <div className="text-4xl mb-4">{service.icon}</div>
                                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                                <p className="text-slate-400">{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-20 bg-[#020617]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Our Process</h2>
                    <div className="space-y-8">
                        {[
                            { step: "1", title: "Discovery Call", desc: "We understand your business, goals, and target audience. Free 30-minute consultation." },
                            { step: "2", title: "Strategy & Proposal", desc: "Detailed proposal with wireframes, timeline, and transparent pricing within 48 hours." },
                            { step: "3", title: "Design Phase", desc: "Custom designs in Figma. You review and approve before any coding begins." },
                            { step: "4", title: "Development", desc: "Clean, fast code with daily updates. You see progress in real-time." },
                            { step: "5", title: "Testing & Launch", desc: "Cross-browser testing, performance optimization, and smooth launch with zero downtime." },
                            { step: "6", title: "Ongoing Support", desc: "24/7 support, regular maintenance, and growth consulting." }
                        ].map((phase, i) => (
                            <div key={i} className="flex gap-6 items-start">
                                <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-xl font-bold shrink-0">
                                    {phase.step}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">{phase.title}</h3>
                                    <p className="text-slate-400">{phase.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-[#0a0118]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-6">
                        {faqs.map((faq, i) => (
                            <div key={i} className="p-6 border border-white/10 rounded-2xl bg-[#0F172A]/50">
                                <h3 className="text-lg font-bold mb-3">{faq.question}</h3>
                                <p className="text-slate-400">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-indigo-600 to-violet-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Build Your Website?</h2>
                    <p className="text-xl text-white/80 mb-8">Book a free strategy call. No pressure, just honest advice.</p>
                    <Link href="/#contact" className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-100 transition-colors">
                        Get Started Today
                    </Link>
                </div>
            </section>

            {/* Internal Links */}
            <section className="py-16 bg-[#020617]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-slate-400 mb-4">Explore our other services</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/services/seo" className="text-indigo-400 hover:text-indigo-300 underline">SEO Services</Link>
                        <Link href="/services/branding" className="text-indigo-400 hover:text-indigo-300 underline">Brand Identity</Link>
                        <Link href="/pricing" className="text-indigo-400 hover:text-indigo-300 underline">Pricing</Link>
                        <Link href="/work" className="text-indigo-400 hover:text-indigo-300 underline">Portfolio</Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
