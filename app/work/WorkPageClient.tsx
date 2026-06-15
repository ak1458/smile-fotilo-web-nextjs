'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Footer } from '../components/Footer';
import { MdArrowForward, MdOpenInNew } from 'react-icons/md';
import Image from 'next/image';

export default function WorkPage() {
    const projects = [
        {
            slug: "pulsekart",
            title: "PulseKart",
            category: "Pharma POS System",
            description: "A highly customizable, advanced Point of Sale system for pharmacies. Features high-level scalability, detailed inventory tracking, and flexible billing modules.",
            image: "/project-pulsekart.png",
            color: "from-teal-600 to-cyan-500",
            tags: ["SaaS", "Healthcare", "POS", "Inventory Management"],
            delay: 0
        },
        {
            slug: "kapda-factory",
            title: "Kapda Factory",
            category: "Manufacturing ERP",
            description: "End-to-end textile manufacturing solution including WordPress e-commerce. Tracks order loading, payment collections, and shipment status in real-time.",
            image: "/project-kapdafactory.png",
            color: "from-amber-600 to-orange-500",
            tags: ["WordPress", "E-Commerce", "ERP", "Manufacturing"],
            delay: 0.1
        },
        {
            slug: "orderflow",
            title: "OrderFlow",
            category: "Logistics & Tracking",
            description: "Daily order tracking and collection ecosystem with mobile app and Android tablet dashboard for delivery hubs.",
            image: "/project-orderflow.png",
            color: "from-blue-600 to-cyan-500",
            tags: ["React Native", "Real-Time", "Logistics", "Dashboard"],
            delay: 0.2
        },
        {
            slug: "curbit",
            title: "Curbit",
            category: "Service Website (USA)",
            description: "Website for a US-based company providing curb-related services. Clean, professional design with service booking.",
            image: "/project-curbit.png",
            color: "from-indigo-600 to-violet-500",
            tags: ["Web Platform", "Service Booking", "Local SEO", "USA"],
            delay: 0.3
        },
        {
            slug: "veloria-vault",
            title: "Veloria Vault",
            category: "Luxury E-Commerce",
            description: "Complete WordPress website for a women's luxury fashion brand selling premium leather handbags. High-end design and immersive product storytelling.",
            image: "/project-veloriavault.png",
            color: "from-rose-600 to-pink-600",
            tags: ["WordPress", "E-Commerce", "Luxury", "Fashion"],
            delay: 0.4
        },
        {
            slug: "storybook-weddings",
            title: "StoryBook Weddings",
            category: "Wedding Photography",
            description: "Professional website for Lucknow's premier wedding photography studio. Beautiful portfolio showcasing engagement, haldi, pre-wedding, and wedding ceremonies.",
            image: "/project-storybook-weddings.png",
            color: "from-amber-500 to-rose-500",
            tags: ["WordPress", "Photography", "Portfolio", "Lucknow"],
            delay: 0.5
        }
    ];

    return (
        <main className="min-h-screen bg-[#0a0118] text-white selection:bg-indigo-500 selection:text-white pt-24 pb-20">
            {/* Background Atmosphere */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-violet-900/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Header */}
                <div className="text-center mb-20">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold mb-6"
                    >
                        Selected <span className="text-indigo-400">Works</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-400 max-w-2xl mx-auto text-lg"
                    >
                        Real projects I&apos;ve built for real businesses — from pharmacy POS systems to luxury e-commerce stores.
                    </motion.p>
                </div>

                {/* Case Studies Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-10 mb-20 sm:mb-32">
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: project.delay }}
                            className="group relative h-full bg-[#0f0720] border border-white/5 rounded-3xl sm:rounded-[2.5rem] overflow-hidden hover:border-white/10 transition-all duration-500 shadow-2xl hover:shadow-[0_0_50px_rgba(99,102,241,0.15)]"
                        >
                            {/* Image Section */}
                            <div className="h-[185px] sm:h-[240px] md:h-[400px] w-full overflow-hidden relative">
                                <div className={`absolute inset-0 bg-gradient-to-b from-transparent to-[#0f0720] z-10 opacity-60`} />
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    loading={index < 2 ? 'eager' : 'lazy'}
                                />
                            </div>

                            {/* Content Section */}
                            <div className="relative z-20 -mt-8 sm:-mt-20 p-4 sm:p-8 md:p-10">
                                <div className="inline-flex sm:hidden px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-semibold text-indigo-300 mb-3">
                                    {project.category}
                                </div>
                                <div className="hidden sm:flex flex-wrap gap-2 mb-6">
                                    {project.tags.map((tag, i) => (
                                        <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-indigo-300">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <h2 className="text-lg sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 group-hover:text-indigo-400 transition-colors line-clamp-2 sm:line-clamp-none">{project.title}</h2>
                                <p className="hidden sm:block text-slate-400 leading-relaxed mb-8 text-lg">
                                    {project.description}
                                </p>
                                <Link href={`/work/${project.slug}`} className="inline-flex items-center gap-2 text-white font-bold text-sm sm:text-base hover:gap-4 transition-all">
                                    View Case Study <MdArrowForward />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* GitHub Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="glass-card p-12 md:p-20 text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10 relative">
                            <Image src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" fill className="object-contain p-5 invert opacity-80" alt="GitHub" unoptimized />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Explore the Codebase</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto mb-10 text-lg">
                            All my project code is on GitHub. Check it out to see how I build things — real commits, real projects, no fluff.
                        </p>
                        <a
                            href="https://github.com/ak1458"
                            target="_blank"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                        >
                            View GitHub Profile <MdOpenInNew />
                        </a>
                    </div>
                </motion.div>

            </div>

            <Footer />
        </main>
    );
}
