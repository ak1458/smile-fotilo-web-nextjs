"use client";

import { useState } from 'react';
import { Footer } from '../../components/Footer';
import { ConnectModal } from '../../components/ConnectModal';
import { OtherLocations } from '../../components/OtherLocations';
import { LocationSchema } from '../../components/LocationSchema';
import { MdArrowForward, MdArchitecture, MdCheckCircle, MdShoppingBag, MdSearch, MdSmartphone, MdHandshake } from 'react-icons/md';


export default function LucknowPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <main className="min-h-screen relative text-slate-200 selection:bg-amber-500/30">
            <LocationSchema location="lucknow" />
            <ConnectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} context="Lucknow Location Page" />

            {/* Global Animated Background */}
            <div className="fixed inset-0 z-[-2] animated-bg"></div>

            {/* Generated Cultural Background Art (Rumi Darwaza + Digital) */}
            <div className="fixed inset-0 z-[-1] opacity-45 pointer-events-none" style={{
                backgroundImage: `url('/lucknow-bg-art.webp')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                maskImage: 'linear-gradient(to bottom, black 20%, transparent 90%)'
            }}></div>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden min-h-[85vh] flex items-center">

                {/* Royal Glow */}
                <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-amber-500/20 mb-8 backdrop-blur-md">
                            <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_orange]"></span>
                            <span className="text-xs font-bold uppercase tracking-widest text-amber-200">The City of Nawabs & Innovation</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-8 tracking-tight">
                            Blending <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-yellow-600">Tehzeeb</span> with <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-violet-300">Technology</span>
                        </h1>

                        <p className="text-xl text-slate-300 mb-10 font-light leading-relaxed">
                            Welcome to Lucknow, where heritage weaves into the digital fabric. We bring the
                            <span className="text-amber-200 font-medium"> intricate craftsmanship of Chikankari</span> to the precision of modern web design.
                            Elevating local businesses with global digital strategies.
                        </p>

                        <div className="flex flex-wrap justify-center gap-5">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="btn-primary flex items-center gap-2 group bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 shadow-amber-500/20"
                            >
                                <span>Start Your Journey</span>
                                <MdArrowForward className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Culture & Tech Section */}
            <section className="py-20 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center mb-24">

                        <div className="text-center md:text-left">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Tehzeeb in Every Pixel</h2>
                            <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                                Lucknow is known for its politeness, hospitality, and attention to detail. We apply these same principles to our User Experience (UX) design and customer support.
                            </p>
                            <p className="text-slate-400 leading-relaxed mb-6">
                                Whether you are a historic Perfumery in Aminabad or a Tech Startup in Gomti Nagar, we ensure your digital presence carries the same grace and elegance that defines this city.
                            </p>

                            <div className="flex gap-4">
                                <div className="glass p-4 rounded-xl flex-1 text-center">
                                    <h3 className="text-2xl font-bold text-amber-400 mb-1">500+</h3>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider">Happy Clients</p>
                                </div>
                                <div className="glass p-4 rounded-xl flex-1 text-center">
                                    <h3 className="text-2xl font-bold text-amber-400 mb-1">24/7</h3>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider">Premium Support</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            {/* Abstract Rumi Darwaza Silhouette Representation */}
                            <div className="absolute inset-0 bg-gradient-to-bl from-amber-500/10 to-transparent blur-3xl rounded-full"></div>
                            <div className="glass-card p-8 md:p-12 relative overflow-hidden group hover:border-amber-500/30 transition-colors">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <MdArchitecture className="text-9xl" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">Empowering Local Legacy</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3 text-slate-300">
                                        <MdCheckCircle className="text-amber-400 mt-1" />
                                        <div>
                                            <strong className="text-white block mb-1">Chikankari Exports</strong>
                                            Helping artisans skip the middleman and sell directly to global markets via Shopify/WooCommerce.
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3 text-slate-300">
                                        <MdCheckCircle className="text-amber-400 mt-1" />
                                        <div>
                                            <strong className="text-white block mb-1">Culinary Heritage</strong>
                                            Digital branding for Tunday-style eateries to attract food tourism.
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3 text-slate-300">
                                        <MdCheckCircle className="text-amber-400 mt-1" />
                                        <div>
                                            <strong className="text-white block mb-1">Modern Education</strong>
                                            LMS platforms for Lucknow&apos;s growing coaching and educational hubs.
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Services Grid (Lucknow Specific) */}
            <section className="py-20 relative bg-black/20 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">Digital Solutions for Lucknow</h2>
                        <div className="h-1 w-20 bg-gradient-to-r from-amber-500 to-transparent mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: 'shopping_bag',
                                title: 'E-Commerce Solutions',
                                desc: 'Perfect for retail stores in Hazratganj wanting to expand online.',
                                color: 'text-rose-400'
                            },
                            {
                                icon: 'search',
                                title: 'Local SEO Dominance',
                                desc: 'Rank #1 when customers search for "Best services in Lucknow".',
                                color: 'text-amber-400'
                            },
                            {
                                icon: 'smartphone',
                                title: 'App Development',
                                desc: 'Custom apps for startups in Gomti Nagar and IT City.',
                                color: 'text-blue-400'
                            }
                        ].map((service, i) => (
                            <div key={i} className="glass p-8 rounded-2xl hover:bg-white/5 transition-all group hover:-translate-y-2 border border-white/5 hover:border-amber-500/20">
                                <div className={`text-4xl mb-4 block ${service.color} group-hover:scale-110 transition-transform`}>
                                    {service.icon === 'shopping_bag' ? <MdShoppingBag /> : service.icon === 'search' ? <MdSearch /> : <MdSmartphone />}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Connect CTA */}
            <section className="py-32 relative overflow-hidden flex items-center justify-center text-center">
                <div className="relative z-10 text-center max-w-2xl px-4">
                    <MdHandshake className="text-6xl text-amber-500/50 mx-auto mb-6 block" />
                    <h2 className="text-3xl md:text-5xl font-serif text-amber-100/90 italic mb-8">
                        &quot;Muskuraiye, aap digital duniya mein hain.&quot;
                    </h2>
                    <p className="text-slate-400 mb-8">Smile, you are in the digital world. Let&apos;s build something iconic.</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-8 py-3 rounded-full border border-amber-500/50 text-amber-200 hover:bg-amber-500/10 transition-colors uppercase tracking-widest text-sm font-bold"
                    >
                        Schedule a Consultation
                    </button>
                </div>
            </section>

            {/* Other Locations Nav */}
            <OtherLocations currentLocation="lucknow" />

            <Footer />
        </main>
    );
}
