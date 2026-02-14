"use client";

import { useState } from 'react';
import { NavBar } from '../../components/NavBar';
import { Footer } from '../../components/Footer';
import { ConnectModal } from '../../components/ConnectModal';
import { OtherLocations } from '../../components/OtherLocations';
import { LocationSchema } from '../../components/LocationSchema';

export default function GreaterNoidaPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <main className="min-h-screen relative text-slate-200 selection:bg-cyan-500/30">
            <LocationSchema location="greaterNoida" />
            <NavBar />
            <ConnectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} context="Greater Noida/NCR Location Page" />

            {/* Global Animated Background */}
            <div className="fixed inset-0 z-[-2] animated-bg"></div>

            {/* Futuristic Tech Overlay (Circuit / Data Stream) - User Uploaded */}
            <div className="fixed inset-0 z-[-1] opacity-[0.25] pointer-events-none" style={{
                backgroundImage: `url('/greater-noida-bg.webp')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                maskImage: 'linear-gradient(to bottom, black 20%, transparent 90%)'
            }}></div>

            {/* Fallback pattern if image missing or for extra texture */}
            <div className="fixed inset-0 z-[-1] opacity-[0.05] pointer-events-none" style={{
                backgroundImage: `linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
                maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
            }}></div>


            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden min-h-[85vh] flex items-center">

                {/* Cyber Glow */}
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                    <div className="text-center max-w-5xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-cyan-500/20 mb-8 backdrop-blur-md">
                            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_cyan]"></span>
                            <span className="text-xs font-bold uppercase tracking-widest text-cyan-200">The Silicon Valley of North India</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-8 tracking-tight">
                            Powering <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">Innovation</span> across <span className="text-white">Noida & NCR</span>
                        </h1>

                        <p className="text-xl text-slate-300 mb-10 font-light leading-relaxed max-w-3xl mx-auto">
                            From the skyscrapers of <span className="text-cyan-200 font-medium">Cyber City</span> to the industrial hubs of Greater Noida.
                            We engineer high-performance digital solutions for the fastest-growing tech region in India.
                        </p>

                        <div className="flex flex-wrap justify-center gap-5">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="btn-primary flex items-center gap-2 group bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-500/20"
                            >
                                <span>Scale Your Business</span>
                                <span className="material-symbols-rounded group-hover:translate-x-1 transition-transform">rocket_launch</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Innovation & Scale Section */}
            <section className="py-20 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-16 items-center mb-24">

                        <div className="relative order-2 md:order-1">
                            {/* Abstract Chip/Tech Representation */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-transparent blur-3xl rounded-full"></div>
                            <div className="glass-card p-8 md:p-12 relative overflow-hidden group hover:border-cyan-500/30 transition-colors boundary-glow-cyan">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <span className="material-symbols-rounded text-9xl">hub</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-6">Designed for Scale</h3>
                                <ul className="space-y-6">
                                    <li className="flex items-start gap-4 text-slate-300">
                                        <div className="bg-cyan-500/10 p-2 rounded-lg">
                                            <span className="material-symbols-rounded text-cyan-400">factory</span>
                                        </div>
                                        <div>
                                            <strong className="text-white block mb-1">Manufacturing & Exports</strong>
                                            B2B portals optimized for global trade, serving the industrial belts of Greater Noida.
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4 text-slate-300">
                                        <div className="bg-cyan-500/10 p-2 rounded-lg">
                                            <span className="material-symbols-rounded text-cyan-400">code</span>
                                        </div>
                                        <div>
                                            <strong className="text-white block mb-1">Tech Startups & SaaS</strong>
                                            High-conversion landing pages and product dashboards for NCR&apos;s booming startup ecosystem.
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4 text-slate-300">
                                        <div className="bg-cyan-500/10 p-2 rounded-lg">
                                            <span className="material-symbols-rounded text-cyan-400">apartment</span>
                                        </div>
                                        <div>
                                            <strong className="text-white block mb-1">Real Estate Excellence</strong>
                                            Immersive 3D web experiences for the rapid infrastructure development in Noida.
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="text-center md:text-left order-1 md:order-2">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Zero Error. Maximum Impact.</h2>
                            <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                                In a region defined by precision engineering and rapid growth, there is no room for mistakes.
                                We deliver <strong>pixel-perfect, high-availability</strong> web solutions that match the speed of NCR.
                            </p>
                            <p className="text-slate-400 leading-relaxed mb-6">
                                Whether you are in the <strong>Logistics Hub</strong> or the <strong>Electronic City</strong>, our localized SEO strategies ensure you dominate search results across the entire National Capital Region.
                            </p>

                            <div className="flex gap-4">
                                <div className="glass p-4 rounded-xl flex-1 text-center border-t-2 border-t-cyan-500/50">
                                    <h3 className="text-2xl font-bold text-cyan-400 mb-1">99.9%</h3>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider">Uptime</p>
                                </div>
                                <div className="glass p-4 rounded-xl flex-1 text-center border-t-2 border-t-cyan-500/50">
                                    <h3 className="text-2xl font-bold text-cyan-400 mb-1">#1</h3>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider">NCR Ranking</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Services Grid (Tech Focus) */}
            <section className="py-20 relative bg-black/40 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">Future-Ready Stack</h2>
                        <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: 'speed',
                                title: 'Performance Marketing',
                                desc: 'Data-driven campaigns to capture the NCR market share.',
                                color: 'text-cyan-400'
                            },
                            {
                                icon: 'database',
                                title: 'Enterprise Solutions',
                                desc: 'Scalable ERP and CRM integrations for large-scale industries.',
                                color: 'text-blue-400'
                            },
                            {
                                icon: 'devices',
                                title: 'IoT & Smart Web',
                                desc: 'Dashboards and interfaces for smart city applications.',
                                color: 'text-teal-400'
                            }
                        ].map((service, i) => (
                            <div key={i} className="glass p-8 rounded-2xl hover:bg-cyan-900/10 transition-all group hover:-translate-y-2 border border-white/5 hover:border-cyan-500/30">
                                <span className={`material-symbols-rounded text-4xl mb-4 block ${service.color} group-hover:scale-110 transition-transform`}>{service.icon}</span>
                                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Connect CTA */}
            <section className="py-32 relative overflow-hidden flex items-center justify-center">
                <div className="relative z-10 text-center max-w-2xl px-4">
                    <span className="material-symbols-rounded text-6xl text-cyan-500/50 mb-6 block">bolt</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 tracking-tight">
                        Built for the <span className="text-cyan-400">Speed of Now</span>.
                    </h2>
                    <p className="text-slate-400 mb-8 max-w-lg mx-auto">Don&apos;t get left behind. Upgrade your digital infrastructure today.</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-10 py-4 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white transition-all shadow-lg shadow-cyan-500/25 font-bold uppercase tracking-wider"
                    >
                        Launch Project
                    </button>
                </div>
            </section>

            {/* Other Locations Nav */}
            <OtherLocations currentLocation="greater-noida" />

            <Footer />
        </main>
    );
}
