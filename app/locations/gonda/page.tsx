"use client";

import { useState } from 'react';
import { NavBar } from '../../components/NavBar';
import { Footer } from '../../components/Footer';
import { ConnectModal } from '../../components/ConnectModal';
import { OtherLocations } from '../../components/OtherLocations';
import { LocationSchema } from '../../components/LocationSchema';

export default function GondaPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <main className="min-h-screen relative text-slate-200 selection:bg-emerald-500/30">
            <LocationSchema location="gonda" />
            <NavBar />
            <ConnectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} context="Gonda (HQ) Page" />

            {/* Global Animated Background */}
            <div className="fixed inset-0 z-[-2] animated-bg"></div>

            {/* Green Nature/Tech Overlay (Gonda HQ - User Uploaded) */}
            <div className="fixed inset-0 z-[-1] opacity-[0.35] pointer-events-none" style={{
                backgroundImage: `url('/gonda-bg-hq.webp')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                maskImage: 'linear-gradient(to bottom, black 20%, transparent 90%)'
            }}></div>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden min-h-[85vh] flex items-center">

                {/* Emerald Glow */}
                <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-emerald-500/20 mb-8 backdrop-blur-md">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_emerald]"></span>
                            <span className="text-xs font-bold uppercase tracking-widest text-emerald-200">Our Origins & Headquarters</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-8 tracking-tight">
                            Rooted in <span className="text-emerald-400">Gonda</span>. <br />
                            Growing <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-teal-300">Global</span>.
                        </h1>

                        <p className="text-xl text-slate-300 mb-10 font-light leading-relaxed">
                            Where it all began. From the heart of Uttar Pradesh, we are building world-class digital experiences for clients across the globe.
                            <span className="text-emerald-200 font-medium"> Local Heart, Global Standards.</span>
                        </p>

                        <div className="flex flex-wrap justify-center gap-5">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="btn-primary flex items-center gap-2 group bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/20"
                            >
                                <span>Visit Our HQ</span>
                                <span className="material-symbols-rounded group-hover:translate-x-1 transition-transform">domain</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Gonda Section */}
            <section className="py-20 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center mb-24">

                        <div className="text-center md:text-left">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">The Operational Hub</h2>
                            <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                                Gonda is not just our home; it&apos;s our strategic command center. By operating from here, we maintain **high efficiency and cost-effectiveness**, passing the value directly to our clients.
                            </p>
                            <p className="text-slate-400 leading-relaxed mb-6">
                                We are proving that world-class technology doesn&apos;t just come from metro cities. It comes from passion, talent, and dedication—right here in Gonda.
                            </p>

                            <div className="flex gap-4">
                                <div className="glass p-4 rounded-xl flex-1 text-center border-b-2 border-b-emerald-500/50">
                                    <h3 className="text-2xl font-bold text-emerald-400 mb-1">100%</h3>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider">Dedication</p>
                                </div>
                                <div className="glass p-4 rounded-xl flex-1 text-center border-b-2 border-b-emerald-500/50">
                                    <h3 className="text-2xl font-bold text-emerald-400 mb-1">HQ</h3>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider">Operations</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            {/* Abstract Nature/Tech Representation */}
                            <div className="absolute inset-0 bg-gradient-to-tl from-emerald-500/10 to-transparent blur-3xl rounded-full"></div>
                            <div className="glass-card p-8 md:p-12 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <span className="material-symbols-rounded text-9xl">forest</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">Empowering the Region</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3 text-slate-300">
                                        <span className="material-symbols-rounded text-emerald-400 mt-1">check_circle</span>
                                        <div>
                                            <strong className="text-white block mb-1">Digital Literacy</strong>
                                            Leading workshops and training for local businesses to go online.
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3 text-slate-300">
                                        <span className="material-symbols-rounded text-emerald-400 mt-1">check_circle</span>
                                        <div>
                                            <strong className="text-white block mb-1">Supporting Local Brands</strong>
                                            From agricultural startups to retail chains in Gonda.
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Connect CTA */}
            <section className="py-20 relative overflow-hidden flex items-center justify-center bg-emerald-900/10">
                <div className="relative z-10 text-center max-w-2xl px-4">
                    <h2 className="text-3xl font-bold text-white mb-6">
                        Ready to Grow with Us?
                    </h2>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-8 py-3 rounded-full border border-emerald-500/50 text-emerald-200 hover:bg-emerald-500/10 transition-colors uppercase tracking-widest text-sm font-bold"
                    >
                        Contact Headquarters
                    </button>
                </div>
            </section>

            <OtherLocations currentLocation="gonda" />
            <Footer />
        </main>
    );
}
