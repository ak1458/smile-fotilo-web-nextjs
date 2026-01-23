import { Metadata } from 'next';
import Link from 'next/link';
import { NavBar } from '../../components/NavBar';
import { Footer } from '../../components/Footer';

export const metadata: Metadata = {
    title: 'Greater Noida | Smile Fotilo - The Tech & Industrial Hub',
    description: 'Smile Fotilo Greater Noida: Enterprise solutions for the industrial capital. Web design for manufacturers, exporters, real estate, and educational institutions.',
};

export default function GreaterNoidaPage() {
    return (
        <main className="bg-[#020617] min-h-screen text-slate-200">
            <NavBar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 overflow-hidden min-h-[90vh] flex items-center">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px]"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1E293B] border border-cyan-500/30 mb-8">
                            <span className="flex h-2 w-2 rounded-full bg-cyan-500 animate-pulse"></span>
                            <span className="text-xs font-bold uppercase tracking-widest text-cyan-200">Tech Hub</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white leading-[1.1] mb-6">
                            Greater Noida<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Engine of Innovation</span>
                        </h1>

                        <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10 font-light leading-relaxed">
                            Home to the <strong className="text-cyan-300">India Expo Mart</strong>, world-class universities,
                            and the <strong className="text-cyan-300">Data Center Capital</strong> of India.
                            We build enterprise-grade digital solutions for the businesses driving the nation&apos;s economy.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/#contact" className="px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold hover:opacity-90 transition-all shadow-lg">
                                Start a Project
                            </Link>
                            <Link href="/locations" className="px-8 py-4 rounded-full bg-white/5 border border-white/20 text-white font-bold hover:bg-white/10 transition-all">
                                View All Locations
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Greater Noida Section */}
            <section className="py-20 bg-[#0F172A]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Smile Fotilo in Greater Noida?</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">Strategic presence in India&apos;s fastest-growing industrial corridor.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-8 glass-card border-cyan-500/30 shadow-[0_0_60px_rgba(34,211,238,0.15)]">
                            <span className="material-symbols-rounded text-4xl text-cyan-400 mb-4">factory</span>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Manufacturing & Exports</h3>
                            <p className="text-slate-400">Digital catalogs, B2B portals, and lead generation for manufacturers and exporters in the industrial belt.</p>
                        </div>
                        <div className="p-8 glass-card border-cyan-500/30 shadow-[0_0_60px_rgba(34,211,238,0.15)]">
                            <span className="material-symbols-rounded text-4xl text-cyan-400 mb-4">apartment</span>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Real Estate</h3>
                            <p className="text-slate-400">Immersive property showcases, virtual tours, and lead generation for developers in the booming NCR market.</p>
                        </div>
                        <div className="p-8 glass-card border-cyan-500/30 shadow-[0_0_60px_rgba(34,211,238,0.15)]">
                            <span className="material-symbols-rounded text-4xl text-cyan-400 mb-4">school</span>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Education Hub</h3>
                            <p className="text-slate-400">Branding and student acquisition for universities, colleges, and coaching institutes in Knowledge Park.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-20 bg-[#020617]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-12">Enterprise Solutions for NCR</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: 'web', title: 'Corporate Websites', desc: 'Professional web presence for MNCs and large enterprises.' },
                            { icon: 'inventory_2', title: 'E-commerce Platforms', desc: 'B2B and B2C e-commerce for manufacturers and wholesalers.' },
                            { icon: 'event', title: 'Event Marketing', desc: 'Digital campaigns for expos and trade shows at India Expo Mart.' },
                            { icon: 'timeline', title: 'Growth Marketing', desc: 'SEO, PPC, and performance marketing for rapid scaling.' },
                        ].map((service, i) => (
                            <div key={i} className="p-6 glass-card hover:border-cyan-500/50 transition-all group">
                                <span className="material-symbols-rounded text-3xl text-cyan-400 mb-4 group-hover:scale-110 transition-transform">{service.icon}</span>
                                <h3 className="text-lg font-bold mb-2">{service.title}</h3>
                                <p className="text-slate-400 text-sm">{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Other Locations */}
            <section className="py-20 bg-[#0F172A]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-white text-center mb-8">Explore Our Other Locations</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link href="/locations/gonda" className="p-6 bg-[#1E293B] rounded-2xl border border-white/5 hover:border-emerald-500/50 transition-all text-center group">
                            <span className="material-symbols-rounded text-2xl text-emerald-400 mb-2">home</span>
                            <p className="font-bold text-white group-hover:text-emerald-400 transition-colors">Gonda (HQ)</p>
                        </Link>
                        <Link href="/locations/lucknow" className="p-6 bg-[#1E293B] rounded-2xl border border-white/5 hover:border-rose-500/50 transition-all text-center group">
                            <span className="material-symbols-rounded text-2xl text-rose-400 mb-2">mosque</span>
                            <p className="font-bold text-white group-hover:text-rose-400 transition-colors">Lucknow</p>
                        </Link>
                        <Link href="/locations/ayodhya" className="p-6 bg-[#1E293B] rounded-2xl border border-white/5 hover:border-orange-500/50 transition-all text-center group">
                            <span className="material-symbols-rounded text-2xl text-orange-400 mb-2">temple_hindu</span>
                            <p className="font-bold text-white group-hover:text-orange-400 transition-colors">Ayodhya</p>
                        </Link>
                        <Link href="/locations" className="p-6 bg-[#1E293B] rounded-2xl border border-white/5 hover:border-sky-500/50 transition-all text-center group">
                            <span className="material-symbols-rounded text-2xl text-sky-400 mb-2">explore</span>
                            <p className="font-bold text-white group-hover:text-sky-400 transition-colors">All Locations</p>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Scale Your Enterprise?</h2>
                    <p className="text-slate-300 mb-8 text-lg">Let&apos;s build digital infrastructure that powers your growth.</p>
                    <Link href="/#contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-lg hover:opacity-90 transition-all shadow-lg">
                        <span className="material-symbols-rounded">rocket_launch</span>
                        Get Started
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}
