import { Metadata } from 'next';
import Link from 'next/link';
import { NavBar } from '../../components/NavBar';
import { Footer } from '../../components/Footer';

export const metadata: Metadata = {
    title: 'Gonda | Smile Fotilo - Where It All Began',
    description: 'Smile Fotilo Gonda: Our headquarters. Silicon Valley quality from small-town roots.',
};

export default function GondaPage() {
    return (
        <main className="bg-[#020617] min-h-screen text-slate-200">
            <NavBar />

            {/* Hero Section */}
            <section
                className="relative pt-32 pb-24 overflow-hidden min-h-[90vh] flex items-center"
                style={{
                    backgroundImage: 'linear-gradient(to bottom, rgba(2, 6, 23, 0.6), rgba(15, 23, 42, 0.95)), url(/gonda-bg.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px]"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[128px]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1E293B] border border-emerald-500/30 mb-8">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-xs font-bold uppercase tracking-widest text-emerald-200">Headquarters</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-6">
                            Gonda<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Where It All Began</span>
                        </h1>

                        <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10 font-light leading-relaxed">
                            Proof that <strong className="text-emerald-300">world-class creativity</strong> isn&apos;t bound by geography.
                            From the heart of Uttar Pradesh, we deliver <strong className="text-emerald-300">Silicon Valley quality</strong>
                            digital solutions to clients worldwide.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/#contact" className="px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 text-white font-bold hover:opacity-90 transition-all shadow-lg">
                                Start a Project
                            </Link>
                            <Link href="/locations" className="px-8 py-4 rounded-full bg-white/5 border border-white/20 text-white font-bold hover:bg-white/10 transition-all">
                                View All Locations
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Gonda Section */}
            <section className="py-20 bg-[#0F172A]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                Why We&apos;re Proudly Based in <span className="text-emerald-400">Gonda</span>
                            </h2>
                            <p className="text-slate-400 mb-6 leading-relaxed">
                                While the world chases metro cities, we chose to stay rooted in our hometown.
                                Gonda gave us our values, our work ethic, and the hunger to prove that excellence
                                can come from anywhere.
                            </p>
                            <p className="text-slate-400 mb-8 leading-relaxed">
                                Our low overheads mean premium quality at competitive prices for you.
                                Our global mindset means we understand international markets.
                                The best of both worlds.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 text-emerald-400">
                                    <span className="material-symbols-rounded">check_circle</span>
                                    <span>Lower costs, same quality</span>
                                </div>
                                <div className="flex items-center gap-2 text-emerald-400">
                                    <span className="material-symbols-rounded">check_circle</span>
                                    <span>24/7 availability</span>
                                </div>
                                <div className="flex items-center gap-2 text-emerald-400">
                                    <span className="material-symbols-rounded">check_circle</span>
                                    <span>Global client portfolio</span>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-400 opacity-20 rounded-3xl blur-3xl"></div>
                            <div className="relative glass-card p-8 border-emerald-500/30 shadow-[0_0_60px_rgba(52,211,153,0.15)] backdrop-blur-3xl">
                                <h3 className="text-xl font-bold text-white mb-6">The Gonda Advantage</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <span className="material-symbols-rounded text-emerald-400 mt-1">rocket_launch</span>
                                        <div>
                                            <p className="font-bold text-white">Startup DNA</p>
                                            <p className="text-slate-400 text-sm">Hungry, agile, and always innovating.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="material-symbols-rounded text-emerald-400 mt-1">groups</span>
                                        <div>
                                            <p className="font-bold text-white">Talent Pool</p>
                                            <p className="text-slate-400 text-sm">Young, skilled developers from local colleges.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="material-symbols-rounded text-emerald-400 mt-1">handshake</span>
                                        <div>
                                            <p className="font-bold text-white">Personal Touch</p>
                                            <p className="text-slate-400 text-sm">Small-town values, big-city execution.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-20 bg-[#020617]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-white text-center mb-4">Empowering Gonda&apos;s Digital Growth</h2>
                    <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">Transforming local businesses while serving global clients.</p>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {[
                            { icon: 'school', title: 'For Education', desc: 'Transforming local schools and coaching institutes with modern Learning Management Systems, online exam portals, and responsive websites.' },
                            { icon: 'storefront', title: 'For Retail', desc: "Taking Gonda's famous markets online. From Chowk to Civil Lines, get your shop on Google Maps, social media, and the web." },
                            { icon: 'local_hospital', title: 'For Healthcare', desc: 'Building appointment booking systems and patient portals for local clinics and hospitals.' },
                            { icon: 'agriculture', title: 'For Agriculture', desc: 'Digital platforms connecting farmers to markets, weather updates, and government schemes.' },
                        ].map((service, i) => (
                            <div key={i} className="p-8 glass-card hover:border-emerald-500/50 transition-all hover:bg-emerald-950/20 group">
                                <span className="material-symbols-rounded text-4xl text-emerald-400 mb-4 group-hover:scale-110 transition-transform">{service.icon}</span>
                                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                                <p className="text-slate-400">{service.desc}</p>
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
                        <Link href="/locations/ayodhya" className="p-6 bg-[#1E293B] rounded-2xl border border-white/5 hover:border-orange-500/50 transition-all text-center group">
                            <span className="material-symbols-rounded text-2xl text-orange-400 mb-2">temple_hindu</span>
                            <p className="font-bold text-white group-hover:text-orange-400 transition-colors">Ayodhya</p>
                        </Link>
                        <Link href="/locations/lucknow" className="p-6 bg-[#1E293B] rounded-2xl border border-white/5 hover:border-rose-500/50 transition-all text-center group">
                            <span className="material-symbols-rounded text-2xl text-rose-400 mb-2">mosque</span>
                            <p className="font-bold text-white group-hover:text-rose-400 transition-colors">Lucknow</p>
                        </Link>
                        <Link href="/locations/greater-noida" className="p-6 bg-[#1E293B] rounded-2xl border border-white/5 hover:border-cyan-500/50 transition-all text-center group">
                            <span className="material-symbols-rounded text-2xl text-cyan-400 mb-2">apartment</span>
                            <p className="font-bold text-white group-hover:text-cyan-400 transition-colors">Greater Noida</p>
                        </Link>
                        <Link href="/locations" className="p-6 bg-[#1E293B] rounded-2xl border border-white/5 hover:border-sky-500/50 transition-all text-center group">
                            <span className="material-symbols-rounded text-2xl text-sky-400 mb-2">explore</span>
                            <p className="font-bold text-white group-hover:text-sky-400 transition-colors">All Locations</p>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Build Something Great?</h2>
                    <p className="text-slate-300 mb-8 text-lg">Join 50+ businesses in Gonda who trusted us with their digital transformation.</p>
                    <Link href="/#contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 text-white font-bold text-lg hover:opacity-90 transition-all shadow-lg">
                        <span className="material-symbols-rounded">rocket_launch</span>
                        Let&apos;s Talk
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}
