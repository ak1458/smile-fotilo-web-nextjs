'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { NavBar } from '../components/NavBar';
import { Footer } from '../components/Footer';
import Link from 'next/link';

export default function PricingPage() {
    return (
        <main className="bg-[#0F172A] min-h-screen text-slate-200 font-sans selection:bg-sky-400 selection:text-[#0F172A]">
            <NavBar />

            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-bold text-slate-50 mb-6">Transparent Pricing</h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Choose the perfect plan for your business growth. No hidden fees, just results.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Starter Plan */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="p-8 rounded-3xl bg-[#1E293B] border border-white/5 hover:border-sky-400 transition-all"
                    >
                        <div className="text-sky-400 font-bold uppercase text-xs mb-2">The Starter</div>
                        <h2 className="text-3xl font-bold text-slate-50 mb-4">₹15k <span className="text-sm text-slate-400 font-normal">/ project</span></h2>
                        <p className="text-slate-400 mb-8">Perfect for doctors, clinics, or small shops needing a professional digital presence.</p>

                        <ul className="space-y-4 mb-8 text-slate-300">
                            <li className="flex items-center gap-3">
                                <span className="material-symbols-rounded text-emerald-400">check_circle</span>
                                5 Page Professional Website
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="material-symbols-rounded text-emerald-400">check_circle</span>
                                Mobile Responsive Design
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="material-symbols-rounded text-emerald-400">check_circle</span>
                                Basic SEO Setup
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="material-symbols-rounded text-emerald-400">check_circle</span>
                                Contact Form Integration
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="material-symbols-rounded text-emerald-400">check_circle</span>
                                1 Month Support
                            </li>
                        </ul>

                        <Link href="/#contact" className="block w-full py-3 rounded-xl border border-white/10 text-center font-bold text-slate-50 hover:bg-sky-400 hover:text-[#0F172A] transition-colors">
                            Get Started
                        </Link>
                    </motion.div>

                    {/* Growth Plan */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="p-8 rounded-3xl bg-[#1E293B] border border-sky-400 relative shadow-[0_0_30px_rgba(56,189,248,0.15)]"
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-sky-400 text-[#0F172A] text-xs font-bold px-3 py-1 rounded-full uppercase">Most Popular</div>
                        <div className="text-sky-400 font-bold uppercase text-xs mb-2">The Growth</div>
                        <h2 className="text-3xl font-bold text-slate-50 mb-4">₹35k <span className="text-sm text-slate-400 font-normal">/ starting</span></h2>
                        <p className="text-slate-400 mb-8">For retail brands ready to sell online. Dynamic content management and e-commerce.</p>

                        <ul className="space-y-4 mb-8 text-slate-300">
                            <li className="flex items-center gap-3">
                                <span className="material-symbols-rounded text-emerald-400">check_circle</span>
                                E-commerce Functionality
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="material-symbols-rounded text-emerald-400">check_circle</span>
                                Admin Dashboard
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="material-symbols-rounded text-emerald-400">check_circle</span>
                                Payment Gateway Integration
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="material-symbols-rounded text-emerald-400">check_circle</span>
                                Advanced SEO & Analytics
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="material-symbols-rounded text-emerald-400">check_circle</span>
                                3 Months Support
                            </li>
                        </ul>

                        <Link href="/#contact" className="block w-full py-3 rounded-xl bg-sky-400 text-center font-bold text-[#0F172A] hover:bg-white transition-colors">
                            Choose Growth
                        </Link>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
