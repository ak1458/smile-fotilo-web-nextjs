import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'SEO & GEO Services India | Zero Position Ranking | Smile Fotilo',
    description: 'Master Zero Position ranking with our SEO & GEO services. We optimize for AI Overviews, Featured Snippets, and traditional search. Get found by both humans and AI.',
    keywords: 'SEO India, GEO optimization, Zero Position, AI Overview ranking, Featured Snippets, search engine optimization, digital marketing 2026',
    openGraph: {
        title: 'SEO & GEO Services India | Zero Position Ranking | Smile Fotilo',
        description: 'Master Zero Position ranking with our SEO & GEO services. We optimize for AI Overviews, Featured Snippets, and traditional search.',
        type: 'website',
    },
};

// FAQ Schema for this page
const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "What is Zero Position in SEO?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Zero Position is the top spot above all organic results on Google. In 2026, it primarily means appearing in AI Overviews (SGE) or Featured Snippets. Being cited in AI responses is now more valuable than ranking #1 in traditional blue links."
            }
        },
        {
            "@type": "Question",
            "name": "What is GEO (Generative Engine Optimization)?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "GEO is the practice of optimizing content so AI models like Gemini and ChatGPT cite your brand as a source. While SEO helps humans find your links, GEO ensures AI treats your brand as an authoritative entity worth citing."
            }
        },
        {
            "@type": "Question",
            "name": "How do I rank in AI Overviews?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "To rank in AI Overviews: 1) Structure content with direct answers in the first 2-3 sentences, 2) Use FAQ and HowTo schema markup, 3) Build topical authority with topic clusters, 4) Ensure factual accuracy with expert citations, and 5) Establish E-E-A-T through author credentials."
            }
        },
        {
            "@type": "Question",
            "name": "How long does SEO take to show results?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "SEO improvements appear in 2-3 months, significant results in 4-6 months, and substantial growth in 6-12 months. We provide monthly reports tracking rankings, traffic, and AI citations."
            }
        },
        {
            "@type": "Question",
            "name": "What's the difference between SEO and GEO?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "SEO focuses on ranking #1 for clicks using keywords and backlinks. GEO focuses on being cited in AI summaries through factual accuracy and entity authority. Modern optimization requires both."
            }
        },
        {
            "@type": "Question",
            "name": "How much does SEO cost per month?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Our SEO packages start from ₹9,999/month for local businesses. E-commerce and competitive industries may require ₹25,000-50,000/month. We customize based on your goals and competition."
            }
        },
        {
            "@type": "Question",
            "name": "What is E-E-A-T and why does it matter?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "E-E-A-T stands for Experience, Expertise, Authoritativeness, and Trust. In 2026, with AI-generated content flooding the web, Google rewards content with proven human experience. Phrases like 'In our 5 years of work...' signal authentic expertise."
            }
        },
        {
            "@type": "Question",
            "name": "Do you provide local SEO services?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. Local SEO helps your business appear in 'near me' searches and Google Maps. We optimize your Google Business Profile, local citations, and location-specific content for cities like Lucknow, Gonda, Greater Noida, and Ayodhya."
            }
        }
    ]
};

export default function SEOPage() {
    return (
        <main className="min-h-screen bg-[#020617] text-white">
            {/* FAQ Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            {/* Hero Section - Lead with Answer */}
            <section className="pt-32 pb-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        SEO & GEO Services <br />
                        <span className="text-emerald-400">Rank on Zero Position</span>
                    </h1>
                    <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
                        <strong>Zero Position is the new #1.</strong> We optimize your website for AI Overviews,
                        Featured Snippets, and traditional search. Get found by both humans and AI models.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/#contact" className="btn-primary px-8 py-4 text-lg bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold">
                            Free SEO Audit
                        </Link>
                        <Link href="/work" className="btn-secondary px-8 py-4 text-lg border border-white/20 rounded-xl hover:bg-white/5">
                            See Results
                        </Link>
                    </div>
                </div>
            </section>

            {/* What is Zero Position - Lead with Answer */}
            <section className="py-20 bg-[#0a0118]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">What is Zero Position?</h2>
                    <div className="p-8 border border-emerald-500/30 rounded-2xl bg-emerald-500/5 mb-12">
                        <p className="text-lg text-slate-300 leading-relaxed">
                            <strong className="text-emerald-400">Zero Position is the featured content that appears above all organic search results.</strong> In 2026,
                            this is primarily the AI Overview (Google&apos;s SGE) or Featured Snippet. Being cited here means your brand
                            is recognized as the authoritative source—more valuable than ranking #1 in traditional blue links.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-6 border border-white/10 rounded-2xl bg-[#0F172A]/50">
                            <h3 className="text-xl font-bold mb-4 text-emerald-400">Traditional SEO</h3>
                            <ul className="space-y-3 text-slate-400">
                                <li>• Goal: Rank #1 for clicks</li>
                                <li>• Focus: Keywords & backlinks</li>
                                <li>• Format: Long-form articles</li>
                                <li>• Metric: Click-Through Rate</li>
                            </ul>
                        </div>
                        <div className="p-6 border border-emerald-500/30 rounded-2xl bg-emerald-500/5">
                            <h3 className="text-xl font-bold mb-4 text-emerald-400">GEO (2026)</h3>
                            <ul className="space-y-3 text-slate-300">
                                <li>• Goal: Be cited by AI</li>
                                <li>• Focus: Factual accuracy & entity authority</li>
                                <li>• Format: Scannable, structured blocks</li>
                                <li>• Metric: Brand citations in AI</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20 bg-[#020617]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Our SEO & GEO Services</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: "🎯", title: "Zero Position Optimization", desc: "Structure content for AI Overviews and Featured Snippets. Lead-with-answer formatting, schema markup, and entity building." },
                            { icon: "📍", title: "Local SEO", desc: "Dominate 'near me' searches in Lucknow, Gonda, Greater Noida. Google Maps optimization and local citations." },
                            { icon: "🛒", title: "E-Commerce SEO", desc: "Product page optimization, category structure, and rich snippets for online stores." },
                            { icon: "⚙️", title: "Technical SEO", desc: "Core Web Vitals, crawlability, indexing, and structured data that AI models can parse instantly." },
                            { icon: "📝", title: "Content Strategy", desc: "Topic clusters, pillar pages, and content that establishes topical authority for AI citation." },
                            { icon: "🔗", title: "Entity Building", desc: "Digital PR, brand mentions, and authority building so AI recognizes your brand as a trusted source." }
                        ].map((service, i) => (
                            <div key={i} className="p-6 border border-white/10 rounded-2xl bg-[#0F172A]/50 hover:border-emerald-500/30 transition-colors">
                                <div className="text-4xl mb-4">{service.icon}</div>
                                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                                <p className="text-slate-400">{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why SEO Matters in 2026 */}
            <section className="py-20 bg-[#0a0118]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Why SEO & GEO Matter in 2026</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            { stat: "70%", desc: "of AI-driven searches happen on mobile devices" },
                            { stat: "40%", desc: "of search results now include AI Overviews" },
                            { stat: "5x", desc: "higher trust when cited as source in AI responses" },
                            { stat: "14.6%", desc: "close rate for organic leads vs 1.7% for outbound" }
                        ].map((item, i) => (
                            <div key={i} className="p-6 border border-white/10 rounded-2xl bg-[#0F172A]/50 text-center">
                                <div className="text-4xl md:text-5xl font-bold text-emerald-400 mb-2">{item.stat}</div>
                                <p className="text-slate-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-[#020617]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                        SEO & GEO Questions Answered
                    </h2>
                    <div className="space-y-6">
                        {[
                            { q: "What is Zero Position in SEO?", a: "Zero Position is the featured content above all organic results—primarily AI Overviews or Featured Snippets. Being cited here means AI recognizes your brand as the authoritative source." },
                            { q: "What is GEO (Generative Engine Optimization)?", a: "GEO optimizes content so AI models cite your brand. While SEO helps humans find links, GEO ensures AI treats your brand as an entity worth citing." },
                            { q: "How do I rank in AI Overviews?", a: "Use direct answers in the first 2-3 sentences, add FAQ schema, build topic clusters, ensure factual accuracy, and establish E-E-A-T through author credentials." },
                            { q: "How long does SEO take to show results?", a: "Initial improvements appear in 2-3 months, significant results in 4-6 months. We provide monthly reports tracking rankings, traffic, and AI citations." },
                            { q: "What's the difference between SEO and GEO?", a: "SEO = rank #1 for clicks. GEO = be cited in AI summaries. Modern optimization requires both approaches." },
                            { q: "How much does SEO cost per month?", a: "Starting from ₹9,999/month for local businesses. E-commerce may require ₹25,000-50,000/month based on competition." },
                            { q: "What is E-E-A-T?", a: "Experience, Expertise, Authoritativeness, Trust. In 2026, Google rewards content with proven human experience over AI-generated content." },
                            { q: "Do you provide local SEO?", a: "Yes. We optimize for 'near me' searches, Google Maps, and location pages for cities like Lucknow, Gonda, Greater Noida, and Ayodhya." }
                        ].map((faq, i) => (
                            <div key={i} className="p-6 border border-white/10 rounded-2xl bg-[#0F172A]/50">
                                <h3 className="text-lg font-bold mb-3">{faq.q}</h3>
                                <p className="text-slate-400">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Author/Expertise Section - E-E-A-T */}
            <section className="py-20 bg-[#0a0118]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="p-8 border border-white/10 rounded-2xl bg-[#0F172A]/50">
                        <h2 className="text-2xl font-bold mb-6">About Our SEO Expertise</h2>
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-3xl font-bold shrink-0">
                                SF
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-emerald-400 mb-2">Smile Fotilo Digital Team</h3>
                                <p className="text-slate-400 leading-relaxed mb-4">
                                    <strong>In our 5+ years at Smile Fotilo, we&apos;ve helped 100+ businesses rank on the first page of Google.</strong> Our
                                    team has hands-on experience with local SEO for clinics, e-commerce SEO for fashion brands, and technical
                                    SEO for SaaS platforms. We&apos;ve adapted our strategies from traditional SEO to modern GEO as AI reshapes search.
                                </p>
                                <p className="text-slate-400 leading-relaxed">
                                    We serve clients across Uttar Pradesh (Lucknow, Gonda, Greater Noida, Ayodhya) and internationally.
                                    Our data-driven approach focuses on measurable results: traffic, leads, and now—AI citations.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Get Your Free SEO & GEO Audit</h2>
                    <p className="text-xl text-white/80 mb-8">Discover what&apos;s stopping you from Zero Position. We&apos;ll analyze your site for both traditional SEO and AI readability.</p>
                    <Link href="/#contact" className="inline-block bg-white text-emerald-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-100 transition-colors">
                        Request Free Audit
                    </Link>
                </div>
            </section>

            {/* Internal Links */}
            <section className="py-16 bg-[#020617]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-slate-400 mb-4">Explore our other services</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/services/web-design" className="text-emerald-400 hover:text-emerald-300 underline">Web Design</Link>
                        <Link href="/services/branding" className="text-emerald-400 hover:text-emerald-300 underline">Brand Identity</Link>
                        <Link href="/pricing" className="text-emerald-400 hover:text-emerald-300 underline">Pricing</Link>
                        <Link href="/work" className="text-emerald-400 hover:text-emerald-300 underline">Portfolio</Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
