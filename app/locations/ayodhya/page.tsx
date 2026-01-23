import { Metadata } from 'next';
import Link from 'next/link';
import { NavBar } from '../../components/NavBar';
import { Footer } from '../../components/Footer';

export const metadata: Metadata = {
    title: 'Ayodhya | Smile Fotilo - Where Heritage Meets Technology',
    description: 'Smile Fotilo Ayodhya: Building digital bridges in the city of Lord Ram. AR/VR experiences, smart tourism, and digital heritage preservation.',
};

export default function AyodhyaPage() {
    return (
        <main className="bg-[#020617] dark:bg-[#020617] bg-white transition-colors duration-300 min-h-screen">
            <NavBar />

            {/* Hero Section with Custom Background */}
            <section
                className="relative pt-32 pb-24 overflow-hidden min-h-[90vh] flex items-center bg-[#fff7ed] dark:bg-[#0c0a09]"
            >
                {/* Spiritual Pattern Overlay */}
                <div className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ea580c' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>

                {/* Gradient Glows */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-[128px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-[128px]"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 dark:bg-[#1E293B] border border-orange-200 dark:border-orange-500/30 mb-8 shadow-sm">
                            <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
                            <span className="text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-200">The Vedic Smart City</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white leading-[1.1] mb-6">
                            Ayodhya<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500 dark:from-orange-400 dark:to-yellow-200">Where Faith Meets Future</span>
                        </h1>

                        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-10 font-light leading-relaxed">
                            In the sacred city of Lord Ram, we&apos;re building <span className="font-semibold text-orange-600 dark:text-orange-300">digital bridges</span> that connect
                            ancient wisdom with modern technology.
                            From AR-powered temple tours to solar-powered smart infrastructure, Ayodhya is rising.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/#contact" className="px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold hover:shadow-orange-500/25 transition-all shadow-lg hover:scale-105">
                                Start a Project in Ayodhya
                            </Link>
                            <Link href="/locations" className="px-8 py-4 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/20 text-slate-900 dark:text-white font-bold hover:bg-slate-50 dark:hover:bg-white/10 transition-all">
                                View All Locations
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Ayodhya Section */}
            <section className="py-20 bg-white dark:bg-[#0F172A] relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Why Smile Fotilo in Ayodhya?</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">We understand the unique blend of spirituality and progress that defines Ayodhya.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: 'temple_hindu', title: 'Heritage Digitization', desc: 'Preserving ancient scriptures and temple art through high-fidelity digital archives.' },
                            { icon: 'view_in_ar', title: 'AR/VR Experiences', desc: 'Bringing the Ramayana to life for global visitors with immersive augmented reality tours.' },
                            { icon: 'smart_toy', title: 'Smart Tourism Bots', desc: 'AI chatbots guiding millions of pilgrims with real-time information.' }
                        ].map((item, i) => (
                            <div key={i} className="p-8 bg-orange-50 dark:bg-slate-800/50 rounded-3xl border border-orange-100 dark:border-orange-500/20 hover:border-orange-500 dark:hover:border-orange-400 transition-all group">
                                <span className="material-symbols-rounded text-4xl text-orange-500 dark:text-orange-400 mb-4 group-hover:scale-110 transition-transform block">{item.icon}</span>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-20 bg-slate-50 dark:bg-[#020617]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-12">Digital Services for Ayodhya&apos;s Growth</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: 'storefront', title: 'Local Business Websites', desc: 'Helping prasad shops, hotels, and artisans reach global devotees.' },
                            { icon: 'videocam', title: 'Drone Cinematography', desc: 'Capturing the grandeur of Ram Mandir from breathtaking aerial views.' },
                            { icon: 'solar_power', title: 'Solar City Initiatives', desc: "Supporting Ayodhya's green transformation with digital monitoring systems." },
                            { icon: 'language', title: 'Multilingual Platforms', desc: 'Websites in Hindi, English, Sanskrit, and regional languages.' },
                        ].map((service, i) => (
                            <div key={i} className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 hover:border-orange-500/50 dark:hover:border-orange-500/50 rounded-2xl transition-all group hover:shadow-xl hover:-translate-y-1">
                                <span className="material-symbols-rounded text-3xl text-orange-500 dark:text-orange-400 mb-4 group-hover:scale-110 transition-transform inline-block">{service.icon}</span>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{service.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Other Locations */}
            <section className="py-20 bg-white dark:bg-[#0F172A]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-8">Explore Our Other Locations</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link href="/locations/gonda" className="p-6 bg-slate-50 dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-white/5 hover:border-emerald-500/50 transition-all text-center group">
                            <span className="material-symbols-rounded text-2xl text-emerald-500 dark:text-emerald-400 mb-2 block">home</span>
                            <p className="font-bold text-slate-700 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">Gonda (HQ)</p>
                        </Link>
                        <Link href="/locations/lucknow" className="p-6 bg-slate-50 dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-white/5 hover:border-rose-500/50 transition-all text-center group">
                            <span className="material-symbols-rounded text-2xl text-rose-500 dark:text-rose-400 mb-2 block">mosque</span>
                            <p className="font-bold text-slate-700 dark:text-white group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors">Lucknow</p>
                        </Link>
                        <Link href="/locations/greater-noida" className="p-6 bg-slate-50 dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-white/5 hover:border-cyan-500/50 transition-all text-center group">
                            <span className="material-symbols-rounded text-2xl text-cyan-500 dark:text-cyan-400 mb-2 block">apartment</span>
                            <p className="font-bold text-slate-700 dark:text-white group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">Greater Noida</p>
                        </Link>
                        <Link href="/locations" className="p-6 bg-slate-50 dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-white/5 hover:border-sky-500/50 transition-all text-center group">
                            <span className="material-symbols-rounded text-2xl text-sky-500 dark:text-sky-400 mb-2 block">explore</span>
                            <p className="font-bold text-slate-700 dark:text-white group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors">All Locations</p>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-orange-50 dark:bg-gradient-to-r dark:from-orange-500/10 dark:to-yellow-500/10">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">Ready to Build Something Sacred & Smart?</h2>
                    <p className="text-slate-600 dark:text-slate-300 mb-8 text-lg">Let us help you create a digital presence that honors tradition while embracing innovation.</p>
                    <Link href="/#contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                        <span className="material-symbols-rounded">rocket_launch</span>
                        Start Your Project
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}
