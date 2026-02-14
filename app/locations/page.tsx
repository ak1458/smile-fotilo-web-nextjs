import { Metadata } from 'next';
import Link from 'next/link';
import { NavBar } from '../components/NavBar';
import { Footer } from '../components/Footer';

export const metadata: Metadata = {
    title: 'Our Locations | Smile Fotilo',
    description: 'Find Smile Fotilo offices in Gonda, Greater Noida, Lucknow, and Ayodhya. Premium web design and digital marketing across Uttar Pradesh and NCR.',
    alternates: {
        canonical: '/locations',
    },
};

const locations = [
    {
        name: 'Greater Noida',
        slug: 'greater-noida',
        tagline: 'Tech Hub',
        description: 'Enterprise solutions for the industrial capital of NCR.',
        icon: 'apartment',
        color: 'cyan',
    },
    {
        name: 'Ayodhya',
        slug: 'ayodhya',
        tagline: 'Vedic Smart City',
        description: 'Where ancient heritage meets modern technology.',
        icon: 'temple_hindu',
        color: 'orange',
    },
    {
        name: 'Gonda',
        slug: 'gonda',
        tagline: 'Headquarters',
        description: 'Where it all began. Silicon Valley quality from hometown roots.',
        icon: 'home',
        color: 'emerald',
    },
    {
        name: 'Lucknow',
        slug: 'lucknow',
        tagline: 'City of Nawabs',
        description: 'Cultural heritage meets digital transformation.',
        icon: 'mosque',
        color: 'rose',
    },
];

export default function LocationsPage() {
    return (
        <main className="bg-[#020617] min-h-screen text-slate-200">
            <NavBar />

            {/* Hero */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[128px]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1E293B] border border-indigo-500/20 mb-8">
                        <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                        <span className="text-xs font-bold uppercase tracking-widest text-indigo-200">Our Network</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                        Strategic <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Locations</span>
                    </h1>

                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Operating from key cities across Uttar Pradesh and NCR to deliver world-class digital solutions.
                    </p>
                </div>
            </section>

            {/* Locations Grid */}
            <section className="py-20 bg-[#0F172A]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {locations.map((loc) => (
                            <Link
                                key={loc.slug}
                                href={`/locations/${loc.slug}`}
                                className="group p-8 glass-card hover:bg-slate-800/50 hover:border-indigo-500/50 transition-all hover:-translate-y-2"
                            >
                                <div className={`w-16 h-16 rounded-2xl bg-${loc.color}-500/10 flex items-center justify-center text-${loc.color}-400 mb-6 group-hover:bg-${loc.color}-500 group-hover:text-white transition-colors`}>
                                    <span className="material-symbols-rounded text-3xl">{loc.icon}</span>
                                </div>
                                <span className={`text-xs font-bold uppercase tracking-widest text-${loc.color}-400`}>{loc.tagline}</span>
                                <h3 className="text-xl font-bold text-white mt-2 mb-3">{loc.name}</h3>
                                <p className="text-slate-400 text-sm">{loc.description}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">Ready to Start Your Project?</h2>
                    <p className="text-slate-300 mb-8">No matter where you are, we deliver premium digital solutions.</p>
                    <Link href="/#contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-all">
                        <span className="material-symbols-rounded">rocket_launch</span>
                        Get Started
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}
