import { Metadata } from 'next';
import Link from 'next/link';
import { NavBar } from '../../components/NavBar';
import { Footer } from '../../components/Footer';

export const metadata: Metadata = {
    title: 'Lucknow | Smile Fotilo - City of Nawabs',
    description: 'Smile Fotilo Lucknow: Silicon Valley strategies for the City of Nawabs. Premium web design, SEO, and branding to scale your business.',
};

export default function LucknowPage() {
    return (
        <main className="bg-[#020617] min-h-screen text-slate-200">
            <NavBar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 overflow-hidden min-h-[90vh] flex items-center bg-gradient-to-b from-[#4338ca]/20 to-[#020617]">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-[128px]"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[128px]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1E293B] border border-rose-500/30 mb-8">
                                <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
                                <span className="text-xs font-bold uppercase tracking-widest text-rose-200">City of Nawabs</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white leading-[1.1] mb-6">
                                Lucknow<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-indigo-400">Dominate Digital</span>
                            </h1>

                            <p className="text-xl text-slate-300 mb-10 font-light leading-relaxed">
                                We bring <strong className="text-rose-300">Silicon Valley strategies</strong> to the City of Nawabs.
                                Premium Web Design, SEO, and Branding to scale your business 10X.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link href="/#contact" className="px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 to-indigo-500 text-white font-bold hover:opacity-90 transition-all shadow-lg">
                                    Book Consultation
                                </Link>
                                <Link href="/locations" className="px-8 py-4 rounded-full bg-white/5 border border-white/20 text-white font-bold hover:bg-white/10 transition-all">
                                    View All Locations
                                </Link>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-indigo-500 opacity-20 rounded-3xl blur-3xl"></div>
                                <div className="relative bg-[#1E293B] p-8 rounded-3xl border border-rose-500/30">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Lucknow&apos;s #1 Digital Agency</h3>
                                    <ul className="space-y-4">
                                        <li className="flex items-center gap-3 text-slate-300">
                                            <span className="material-symbols-rounded text-rose-400">check_circle</span>
                                            100+ Projects Delivered
                                        </li>
                                        <li className="flex items-center gap-3 text-slate-300">
                                            <span className="material-symbols-rounded text-rose-400">check_circle</span>
                                            5-Star Google Rating
                                        </li>
                                        <li className="flex items-center gap-3 text-slate-300">
                                            <span className="material-symbols-rounded text-rose-400">check_circle</span>
                                            Global Client Portfolio
                                        </li>
                                        <li className="flex items-center gap-3 text-slate-300">
                                            <span className="material-symbols-rounded text-rose-400">check_circle</span>
                                            24/7 Support Available
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-20 bg-[#0F172A]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-12">Services for Lucknow Businesses</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: 'web', title: 'Web Design', desc: 'Stunning, conversion-focused websites that represent your brand perfectly.' },
                            { icon: 'search', title: 'SEO & Marketing', desc: 'Dominate Google rankings and drive organic traffic to your business.' },
                            { icon: 'palette', title: 'Branding', desc: 'Complete brand identity from logos to brand guidelines.' },
                        ].map((service, i) => (
                            <div key={i} className="p-8 glass-card hover:border-rose-500/50 transition-all">
                                <span className="material-symbols-rounded text-4xl text-rose-400 mb-4">{service.icon}</span>
                                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                                <p className="text-slate-400">{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Other Locations */}
            <section className="py-20 bg-[#020617]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-8">Explore Our Other Locations</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link href="/locations/gonda" className="p-6 bg-[#1E293B] rounded-2xl border border-white/5 hover:border-emerald-500/50 transition-all text-center group">
                            <span className="material-symbols-rounded text-2xl text-emerald-400 mb-2">home</span>
                            <p className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-400 transition-colors">Gonda (HQ)</p>
                        </Link>
                        <Link href="/locations/greater-noida" className="p-6 bg-[#1E293B] rounded-2xl border border-white/5 hover:border-cyan-500/50 transition-all text-center group">
                            <span className="material-symbols-rounded text-2xl text-cyan-400 mb-2">apartment</span>
                            <p className="font-bold text-slate-900 dark:text-white group-hover:text-cyan-400 transition-colors">Greater Noida</p>
                        </Link>
                        <Link href="/locations/ayodhya" className="p-6 bg-[#1E293B] rounded-2xl border border-white/5 hover:border-orange-500/50 transition-all text-center group">
                            <span className="material-symbols-rounded text-2xl text-orange-400 mb-2">temple_hindu</span>
                            <p className="font-bold text-slate-900 dark:text-white group-hover:text-orange-400 transition-colors">Ayodhya</p>
                        </Link>
                        <Link href="/locations" className="p-6 bg-[#1E293B] rounded-2xl border border-white/5 hover:border-sky-500/50 transition-all text-center group">
                            <span className="material-symbols-rounded text-2xl text-sky-400 mb-2">explore</span>
                            <p className="font-bold text-slate-900 dark:text-white group-hover:text-sky-400 transition-colors">All Locations</p>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-r from-rose-500/10 to-indigo-500/10">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">Ready to Dominate Lucknow&apos;s Digital Space?</h2>
                    <p className="text-slate-300 mb-8 text-lg">Let&apos;s build something that makes your competitors jealous.</p>
                    <Link href="/#contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 to-indigo-500 text-white font-bold text-lg hover:opacity-90 transition-all shadow-lg">
                        <span className="material-symbols-rounded">rocket_launch</span>
                        Get Started
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}
