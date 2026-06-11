import { Metadata } from 'next';
import Link from 'next/link';
import { MdApartment, MdTempleHindu, MdHome, MdMosque, MdRocketLaunch } from 'react-icons/md';
import { Footer } from '../components/Footer';

export const metadata: Metadata = {
    title: 'Our Locations | Smile Fotilo',
    description: 'Find Smile Fotilo offices in Gonda, Greater Noida, Lucknow, and Ayodhya. Premium web design and digital marketing across Uttar Pradesh and NCR.',
    alternates: {
        canonical: '/locations',
    },
    openGraph: {
        title: 'Our Locations | Smile Fotilo',
        description: 'Web design and digital marketing studios in Gonda, Greater Noida, Lucknow, and Ayodhya — serving clients worldwide.',
        type: 'website',
        url: 'https://smilefotilo.com/locations',
        images: [
            {
                url: '/og?title=Our%20Locations&subtitle=Gonda%20%C2%B7%20Lucknow%20%C2%B7%20Ayodhya%20%C2%B7%20Greater%20Noida',
                width: 1200,
                height: 630,
                alt: 'Smile Fotilo Locations',
            },
        ],
    },
};

const locations = [
    {
        name: 'Greater Noida',
        slug: 'greater-noida',
        tagline: 'Tech Hub',
        description: 'Enterprise solutions for the industrial capital of NCR.',
        icon: 'apartment',
        iconClasses: 'bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500',
        taglineClasses: 'text-cyan-400',
    },
    {
        name: 'Ayodhya',
        slug: 'ayodhya',
        tagline: 'Vedic Smart City',
        description: 'Where ancient heritage meets modern technology.',
        icon: 'temple_hindu',
        iconClasses: 'bg-orange-500/10 text-orange-400 group-hover:bg-orange-500',
        taglineClasses: 'text-orange-400',
    },
    {
        name: 'Gonda',
        slug: 'gonda',
        tagline: 'Headquarters',
        description: 'Where it all began. Silicon Valley quality from hometown roots.',
        icon: 'home',
        iconClasses: 'bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500',
        taglineClasses: 'text-emerald-400',
    },
    {
        name: 'Lucknow',
        slug: 'lucknow',
        tagline: 'City of Nawabs',
        description: 'Cultural heritage meets digital transformation.',
        icon: 'mosque',
        iconClasses: 'bg-rose-500/10 text-rose-400 group-hover:bg-rose-500',
        taglineClasses: 'text-rose-400',
    },
] as const;

export default function LocationsPage() {
    return (
        <main className="bg-[#020617] min-h-screen text-slate-200">
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
                        Strategic <span className="text-indigo-300">Locations</span>
                    </h1>

                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Operating from key cities across Uttar Pradesh and NCR to deliver modern, results-focused digital solutions.
                    </p>
                </div>
            </section>

            {/* Locations Grid */}
            <section className="py-20 bg-[#0F172A]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {locations.map((loc) => (
                            <Link
                                key={loc.slug}
                                href={`/locations/${loc.slug}`}
                                className="group h-full p-4 sm:p-8 glass-card hover:bg-slate-800/50 hover:border-indigo-500/50 transition-all hover:-translate-y-2"
                            >
                                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-6 group-hover:text-white transition-colors ${loc.iconClasses}`}>
                                    <span className="text-xl sm:text-3xl">
                                        {loc.icon === 'apartment' ? <MdApartment /> :
                                            loc.icon === 'temple_hindu' ? <MdTempleHindu /> :
                                                loc.icon === 'home' ? <MdHome /> : <MdMosque />}
                                    </span>
                                </div>
                                <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest ${loc.taglineClasses}`}>{loc.tagline}</span>
                                <h3 className="text-sm sm:text-xl font-bold text-white mt-2 mb-1 sm:mb-3 line-clamp-2">{loc.name}</h3>
                                <p className="hidden sm:block text-slate-400 text-sm">{loc.description}</p>
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
                        <MdRocketLaunch />
                        Get Started
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}
