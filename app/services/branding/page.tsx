import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Brand Identity & Logo Design India — Starting ₹7,999 | Smile Fotilo',
    description: 'Professional logo design starting ₹7,999 and brand identity from ₹25,000. 3 concepts, 2 revisions, all vector files. Packaging design, brand guidelines, and visual identity systems. 2-4 week delivery.',
    alternates: {
        canonical: '/services/branding',
    },
    keywords: [
        'brand identity India', 'logo design India', 'brand guidelines design',
        'visual identity system', 'branding agency India', 'graphic design Lucknow',
        'logo cost India', 'logo designer near me', 'brand identity agency',
        'packaging design India', 'product photography', 'business card design',
        'brand strategy India', 'corporate branding', 'startup branding India',
        'logo design Gonda', 'branding company UP', 'visual branding',
        'brand book design', 'social media branding', 'affordable logo design India'
    ],
    openGraph: {
        title: 'Brand Identity & Logo Design — Starting ₹7,999 | Smile Fotilo',
        description: 'Professional brand identity design. 3 concepts, 2 revisions, all vector files. Complete visual identity systems.',
        type: 'website',
        url: 'https://smilefotilo.com/services/branding',
        images: [{
            url: '/og?title=Brand%20Identity%20%26%20Logo%20Design&subtitle=Starting%20₹7%2C999',
            width: 1200,
            height: 630,
            alt: 'Smile Fotilo Brand Identity Services',
        }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Brand Identity & Logo Design — ₹7,999 | Smile Fotilo',
        description: 'Professional logos & brand identity. 3 concepts, 2 revisions, all vector files. 2-4 week delivery.',
        images: ['/og?title=Brand%20Identity%20%26%20Logo%20Design&subtitle=Starting%20₹7%2C999'],
    },
};

// FAQ Schema for featured snippets
const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "What is brand identity?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Brand identity is the visual and verbal elements that represent your business: logo, colors, typography, imagery style, voice, and how these come together consistently across all touchpoints. It's what makes your business recognizable and memorable."
            }
        },
        {
            "@type": "Question",
            "name": "How much does a logo cost in India?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Standalone logos start from ₹7,999 in India. However, complete brand identity packages (₹25,000+) are recommended as they include logo variations, color palette, typography, and usage guidelines for consistency across all platforms."
            }
        },
        {
            "@type": "Question",
            "name": "How long does branding take?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Logo-only projects take 1-2 weeks. Complete brand identity systems take 3-4 weeks. This includes research, concepts, revisions, and final delivery of all assets including vector files and brand guidelines."
            }
        },
        {
            "@type": "Question",
            "name": "How many logo concepts do you provide?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "We provide 3 distinct initial concepts based on your brief. You select one direction, then we refine with 2 rounds of revisions until you're completely satisfied with the final design."
            }
        },
        {
            "@type": "Question",
            "name": "What are brand guidelines?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "A brand guidelines document (brand book) specifies how to use your logo, colors, fonts, and imagery correctly. It's essential for maintaining consistency as you grow and work with different vendors or team members."
            }
        }
    ]
};

export default function BrandingPage() {
    const faqs = [
        {
            question: "What is brand identity?",
            answer: "Brand identity is the visual and verbal elements that represent your business: logo, colors, typography, imagery style, voice, and how these come together consistently across all touchpoints."
        },
        {
            question: "How much does a logo cost?",
            answer: "Standalone logos start from ₹7,999. However, we recommend complete brand identity packages (₹25,000+) that include logo variations, color palette, typography, and usage guidelines for consistency."
        },
        {
            question: "How long does branding take?",
            answer: "Logo-only projects take 1-2 weeks. Complete brand identity systems take 3-4 weeks. This includes research, concepts, revisions, and final delivery of all assets."
        },
        {
            question: "How many logo concepts do you provide?",
            answer: "We provide 3 distinct initial concepts based on your brief. You select one direction, then we refine with 2 rounds of revisions until you're completely satisfied."
        },
        {
            question: "What files do I receive?",
            answer: "Complete package includes: vector files (AI, EPS, SVG), print-ready files (PDF, high-res PNG), web files (optimized PNG, favicon), and brand guidelines document."
        },
        {
            question: "Do you design packaging?",
            answer: "Yes. We design product packaging, labels, boxes, and bags. We work with printers and can manage production for you."
        },
        {
            question: "What are brand guidelines?",
            answer: "A brand guidelines document (brand book) specifies how to use your logo, colors, fonts, and imagery correctly. Essential for maintaining consistency as you grow."
        },
        {
            question: "What industries do you work with?",
            answer: "We've branded retail stores, restaurants, tech startups, healthcare providers, manufacturers, and professional services. Our process adapts to any industry."
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
                <div className="absolute inset-0 bg-gradient-to-b from-rose-500/10 to-transparent pointer-events-none" />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Brand Identity <br />
                        <span className="text-rose-400">That Tells Your Story</span>
                    </h1>
                    {/* Lead-with-Answer for featured snippets */}
                    <p className="text-xl text-slate-300 mb-4 max-w-2xl mx-auto">
                        <strong className="text-white">Logo design starting ₹7,999, complete brand identity from ₹25,000.</strong> We
                        create memorable logos, color palettes, typography systems, and brand guidelines in 2-4 weeks.
                    </p>
                    <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
                        3 concepts, 2 revision rounds, all vector files included. From startups to established businesses.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/#contact" className="btn-primary px-8 py-4 text-lg bg-rose-600 hover:bg-rose-500 rounded-xl font-semibold">
                            Start Your Brand
                        </Link>
                        <Link href="/work" className="btn-secondary px-8 py-4 text-lg border border-white/20 rounded-xl hover:bg-white/5">
                            See Our Work
                        </Link>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20 bg-[#0a0118]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Branding Services</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: "✨", title: "Logo Design", desc: "Memorable, versatile logos that work across all media from business cards to billboards." },
                            { icon: "🎨", title: "Visual Identity", desc: "Complete color palette, typography, iconography, and visual language for your brand." },
                            { icon: "📖", title: "Brand Guidelines", desc: "Comprehensive documentation ensuring consistent brand application by anyone." },
                            { icon: "📦", title: "Packaging Design", desc: "Product packaging, labels, and unboxing experiences that delight customers." },
                            { icon: "📸", title: "Product Photography", desc: "Professional studio photography for e-commerce, catalogs, and marketing." },
                            { icon: "🖼️", title: "Marketing Collateral", desc: "Business cards, brochures, social media templates, and presentation decks." }
                        ].map((service, i) => (
                            <div key={i} className="p-6 border border-white/10 rounded-2xl bg-[#0F172A]/50 hover:border-rose-500/30 transition-colors">
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
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Our Branding Process</h2>
                    <div className="space-y-8">
                        {[
                            { step: "1", title: "Discovery", desc: "We learn about your business, audience, competitors, and vision. Questionnaire + call." },
                            { step: "2", title: "Research", desc: "Industry analysis, competitor audit, and moodboard creation to align on direction." },
                            { step: "3", title: "Concepts", desc: "3 distinct logo concepts with rationale. You select the direction that feels right." },
                            { step: "4", title: "Refinement", desc: "We refine your chosen concept with 2 revision rounds until perfect." },
                            { step: "5", title: "System Design", desc: "Building out the complete visual identity: colors, fonts, patterns, iconography." },
                            { step: "6", title: "Delivery", desc: "Final files, brand guidelines, and handover session to ensure you can use everything." }
                        ].map((phase, i) => (
                            <div key={i} className="flex gap-6 items-start">
                                <div className="w-12 h-12 rounded-full bg-rose-600 flex items-center justify-center text-xl font-bold shrink-0">
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
                        Branding Questions Answered
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
            <section className="py-20 bg-gradient-to-r from-rose-600 to-pink-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Build Your Brand?</h2>
                    <p className="text-xl text-white/80 mb-8">Let&apos;s create something memorable together.</p>
                    <Link href="/#contact" className="inline-block bg-white text-rose-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-100 transition-colors">
                        Start Your Project
                    </Link>
                </div>
            </section>

            {/* Internal Links */}
            <section className="py-16 bg-[#020617]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-slate-400 mb-4">Explore our other services</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/services/web-design" className="text-rose-400 hover:text-rose-300 underline">Web Design</Link>
                        <Link href="/services/seo" className="text-rose-400 hover:text-rose-300 underline">SEO Services</Link>
                        <Link href="/pricing" className="text-rose-400 hover:text-rose-300 underline">Pricing</Link>
                        <Link href="/work" className="text-rose-400 hover:text-rose-300 underline">Portfolio</Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
