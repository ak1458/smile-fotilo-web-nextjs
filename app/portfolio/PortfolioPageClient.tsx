/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
import { Footer } from '../components/Footer';
import Link from 'next/link';
import { MdArrowBack, MdWorkOutline, MdSchool, MdCheckCircle, MdMemory, MdLanguage, MdCode, MdArrowOutward, MdStars } from 'react-icons/md';

interface Repo {
    id: number;
    name: string;
    description: string;
    html_url: string;
    language: string;
    stargazers_count: number;
}

function useSmoothTransform(value: MotionValue<number>, input: number[], output: number[]) {
    const raw = useTransform(value, input, output);
    return useSpring(raw, { stiffness: 100, damping: 30, mass: 0.5 });
}

export default function PortfolioPageClient({ initialRepos }: { initialRepos: Repo[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress: mainScroll } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

    // Background parallax tied to main scroll
    const bgY = useSmoothTransform(mainScroll, [0, 1], [0, 800]);

    // Hero Section
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const heroScale = useSmoothTransform(heroScroll, [0, 1], [1, 0.8]);
    const heroOpacity = useSmoothTransform(heroScroll, [0, 0.5], [1, 0]);
    const massiveTextX = useSmoothTransform(mainScroll, [0, 1], [0, -1000]);
    const massiveTextXReverse = useSmoothTransform(mainScroll, [0, 1], [-500, 500]);

    // Identity Reveal
    const aboutRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress: aboutScroll } = useScroll({ target: aboutRef, offset: ["start 90%", "end 50%"] });
    const aboutText = "My journey began with a deep curiosity for how things work under the hood. Over the years, I have architected systems, optimized complex databases, and crafted pixel-perfect frontends. I believe in writing code that is not just functional, but maintainable and beautiful.";
    const words = aboutText.split(' ');

    // Horizontal Scroll
    const horizontalContainerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress: horizontalScroll } = useScroll({ target: horizontalContainerRef });
    // Adjusted the translation distance so the cards don't scroll off-screen on the left
    const xTrack = useSmoothTransform(horizontalScroll, [0, 1], [0, -((initialRepos?.length || 1) * 300)]);

    return (
        <div ref={containerRef} className="min-h-screen bg-[#020202] text-white selection:bg-white/20 font-sans overflow-x-hidden relative">

            {/* Extremely Dense Background Texture & Lighting */}
            <motion.div style={{ y: bgY }} className="fixed inset-0 z-0 pointer-events-none">
                {/* Structural Grid lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

                {/* Massive Ambient Orbs */}
                <div className="absolute top-[-20%] left-[-20%] w-[100vw] h-[100vw] rounded-full bg-violet-900/10 blur-[150px] mix-blend-screen opacity-70" />
                <div className="absolute top-[20%] right-[-30%] w-[80vw] h-[80vw] rounded-full bg-indigo-900/15 blur-[120px] mix-blend-screen opacity-80" />
                <div className="absolute bottom-[-10%] left-1/4 w-[60vw] h-[60vw] rounded-full bg-fuchsia-900/10 blur-[150px] mix-blend-screen opacity-60" />

                {/* Abstract Graffico-style Bursts & Scatters */}
                <div className="absolute top-[15%] right-[10%] w-[800px] h-[800px] opacity-10 animate-[spin_120s_linear_infinite]">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
                        <path d="M50 0 L52 48 L100 50 L52 52 L50 100 L48 52 L0 50 L48 48 Z" />
                    </svg>
                </div>

                <div className="absolute top-[45%] left-[-15%] w-[1200px] h-[1200px] opacity-[0.15] animate-[spin_200s_linear_infinite_reverse]">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
                        <circle cx="50" cy="50" r="49" fill="none" stroke="currentColor" strokeWidth="0.2" strokeDasharray="1 2" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.1" />
                        <path d="M50 0 L50 100 M0 50 L100 50" stroke="currentColor" strokeWidth="0.1" />
                    </svg>
                </div>

                <div className="absolute bottom-[20%] right-[5%] w-[600px] h-[600px] opacity-20 animate-[pulse_10s_ease-in-out_infinite]">
                    {/* Scatter Dots */}
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_20px_#8b5cf6]" />
                    <div className="absolute top-1/2 right-1/4 w-1 h-1 rounded-full bg-indigo-400 shadow-[0_0_10px_#8b5cf6]" />
                    <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 rounded-full bg-fuchsia-400 shadow-[0_0_15px_#d946ef]" />

                    <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-none stroke-current">
                        <path d="M20,20 Q50,80 80,20" strokeWidth="0.1" strokeDasharray="0.5 1" />
                    </svg>
                </div>

                {/* Heavy Grain Overlay to kill "pure black" void */}
                <div className="absolute inset-0 opacity-[0.1] bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] mix-blend-overlay" />
            </motion.div>

            {/* Navigation Navigation */}
            <nav className="fixed top-0 inset-x-0 z-50 mix-blend-difference pb-4 pt-6 px-6 md:px-12 backdrop-blur-sm border-b border-white/5">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-all group overflow-hidden">
                        <MdArrowBack className="text-xl group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold tracking-[0.2em] text-xs uppercase relative">
                            Studio
                            <span className="absolute left-0 bottom-0 w-full h-px bg-white origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                        </span>
                    </Link>
                    <div className="text-xs font-black tracking-[0.3em] uppercase text-white/50 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                        portfolio ©{new Date().getFullYear()}
                    </div>
                </div>
            </nav>

            <main className="relative z-10">
                {/* 1. HERO SECTION (Massive overlay text to eliminate void) */}
                <motion.section
                    ref={heroRef}
                    style={{ scale: heroScale, opacity: heroOpacity }}
                    className="h-[100svh] flex flex-col justify-center items-center text-center px-4 relative overflow-hidden"
                >
                    {/* Background Massive Text */}
                    <motion.div style={{ x: massiveTextX }} className="absolute whitespace-nowrap top-[20%] left-0 text-[20vw] font-black text-white/[0.02] tracking-tighter leading-none pointer-events-none select-none">
                        ASHRAF KAMAL ASHRAF
                    </motion.div>
                    <motion.div style={{ x: massiveTextXReverse, WebkitTextStroke: '2px rgba(255,255,255,0.03)' }} className="absolute whitespace-nowrap bottom-[20%] right-0 text-[18vw] font-black italic text-transparent stroke-text overflow-visible pointer-events-none select-none">
                        CREATIVE ENGINEER
                    </motion.div>

                    <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.5, ease: "easeOut" }}
                            className="w-24 h-24 mb-10 rounded-full border border-white/20 bg-white/5 backdrop-blur-xl flex items-center justify-center p-2 relative shadow-[0_0_50px_rgba(139,92,246,0.3)]"
                        >
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-violet-600/40 to-indigo-600/40 animate-pulse" />
                            <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain brightness-0 invert relative z-10" />
                        </motion.div>

                        <h1 className="text-[14vw] md:text-[9vw] font-black tracking-tighter leading-[0.85] uppercase mix-blend-difference mb-6">
                            <motion.span initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.2 }} className="block">Digital</motion.span>
                            <motion.span initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.4 }} className="block text-transparent stroke-text" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.5)' }}>Craftsman</motion.span>
                        </h1>
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-xl md:text-2xl text-white/50 max-w-2xl font-light tracking-wide mix-blend-difference">
                            Bridging the gap between high-end design and highly scalable engineering.
                        </motion.p>
                    </div>
                </motion.section>

                <div className="bg-transparent relative z-10 w-full border-t border-white/10 pt-20 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] backdrop-blur-md">
                    {/* 2. IDENTITY REVEAL (Tighter padding, larger text) */}
                    <section ref={aboutRef} className="container mx-auto px-6 md:px-12 pb-32 max-w-7xl relative">
                        {/* Abstract structural piece */}
                        <div className="absolute top-0 right-10 w-px h-full bg-gradient-to-b from-violet-500/0 via-violet-500/50 to-transparent hidden lg:block" />
                        <div className="absolute top-1/2 right-[36px] w-2 h-2 rounded-full bg-violet-400 hidden lg:block shadow-[0_0_10px_#8b5cf6]" />

                        <div className="grid lg:grid-cols-12 gap-12">
                            <div className="lg:col-span-3">
                                <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-white/40 sticky top-32 flex items-center gap-4">
                                    <MdStars className="text-violet-400 text-xl" /> Identity
                                </h2>
                            </div>

                            <div className="lg:col-span-9">
                                <p className="text-4xl md:text-6xl lg:text-[5rem] font-bold leading-[1.1] tracking-tight flex flex-wrap gap-x-4 gap-y-2 mix-blend-difference">
                                    {words.map((word, i) => {
                                        const start = i / words.length;
                                        // eslint-disable-next-line react-hooks/rules-of-hooks
                                        const opacity = useTransform(aboutScroll, [Math.max(0, start - 0.15), start], [0.1, 1]);
                                        return (
                                            <motion.span key={i} style={{ opacity }} className="relative">
                                                {word}
                                            </motion.span>
                                        );
                                    })}
                                </p>

                                {/* Visual Density: Bento box skill grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-24">
                                    {[
                                        { title: "Frontend", tools: "React, Next.js, Framer", icon: <MdCode size={24} />, color: "from-blue-500/20" },
                                        { title: "Backend", tools: "Node, Go, Postges", icon: <MdMemory size={24} />, color: "from-violet-500/20" },
                                        { title: "Cloud", tools: "AWS, Docker, CI/CD", icon: <MdLanguage size={24} />, color: "from-fuchsia-500/20" },
                                        { title: "Scale", tools: "Performance, Redis", icon: <MdCheckCircle size={24} />, color: "from-indigo-500/20" },
                                    ].map((skill, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: i * 0.1 }}
                                            className="group relative p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all overflow-hidden"
                                        >
                                            <div className={`absolute inset-0 bg-gradient-to-br ${skill.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                            <h3 className="text-xl font-bold mb-8 text-white relative z-10">{skill.title}</h3>
                                            <p className="text-white/40 font-mono text-[10px] uppercase tracking-widest relative z-10">{skill.tools}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 3. HORIZONTAL SCROLL (Massive cards, structural lines) */}
                    {/* Decreased height from 400vh to 250vh so the horizontal scroll feels snappier and doesn't scroll off into emptiness */}
                    <section ref={horizontalContainerRef} className="relative h-[250vh] bg-transparent">

                        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden border-y border-white/10 bg-black/40 backdrop-blur-xl">

                            {/* Giant background text to fill void */}
                            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full pointer-events-none overflow-hidden">
                                <h2 className="text-[25vw] font-black uppercase text-white/[0.02] whitespace-nowrap select-none leading-none tracking-tighter mix-blend-screen">
                                    OPEN SOURCE OPEN SOURCE
                                </h2>
                            </div>

                            <div className="absolute top-12 md:top-24 left-6 md:left-12 z-20">
                                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 font-mono text-xs uppercase tracking-widest backdrop-blur-md">
                                    <MdCode size={16} /> Live Github Feed
                                </div>
                            </div>

                            <motion.div style={{ x: xTrack }} className="flex gap-12 px-6 md:px-24 items-center h-[600px] absolute w-max mt-8">

                                {/* Intro Structural Block */}
                                <div className="w-[300px] md:w-[500px] shrink-0 p-8 h-full flex flex-col justify-center relative">
                                    <div className="absolute left-0 top-1/4 bottom-1/4 w-px bg-white/20" />
                                    <h3 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-none uppercase">Selected<br />Works</h3>
                                    <p className="text-white/50 text-lg md:text-xl font-light mb-12 max-w-sm">A curated architecture of my repositories, pulled directly through the GitHub API.</p>
                                    <a href="https://github.com/ak1458" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-4 text-sm font-bold uppercase tracking-[0.2em] border border-white/20 px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all w-max group">
                                        View Full Record <MdArrowOutward className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </a>
                                </div>

                                {/* GitHub Repo Cards - Taller and wider for impact */}
                                {initialRepos && initialRepos.length > 0 ? initialRepos.map((repo) => (
                                    <a
                                        href={repo.html_url} target="_blank" rel="noopener noreferrer" key={repo.id}
                                        className="group relative w-[380px] md:w-[500px] h-[500px] shrink-0 rounded-[2rem] bg-[#0a0a0a] border border-white/10 hover:border-violet-500/50 overflow-hidden flex flex-col justify-between p-10 hover:shadow-[0_0_50px_rgba(139,92,246,0.1)] transition-all duration-500"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-tr from-violet-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                        <div className="relative z-10">
                                            <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/10">
                                                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 group-hover:scale-110 group-hover:bg-violet-500 group-hover:text-white transition-all duration-300">
                                                    <MdArrowOutward size={28} />
                                                </div>
                                                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full font-mono text-sm uppercase tracking-widest text-violet-300 flex items-center gap-2">
                                                    ⭐ {repo.stargazers_count || 0}
                                                </div>
                                            </div>
                                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight group-hover:text-violet-300 transition-colors">{repo.name}</h3>
                                            <p className="text-white/40 text-lg leading-relaxed line-clamp-3 font-light">
                                                {repo.description || "Experimental architecture and codebase engineering."}
                                            </p>
                                        </div>

                                        <div className="relative z-10 flex justify-between items-end">
                                            <div className="font-mono text-sm uppercase tracking-[0.2em] text-white/60">
                                                {repo.language || 'SYS/FILE'}
                                            </div>
                                            <div className="text-sm font-bold tracking-widest uppercase text-white/20 group-hover:text-white transition-colors">
                                                Examine Insight
                                            </div>
                                        </div>
                                    </a>
                                )) : (
                                    <div className="w-[500px] h-[500px] shrink-0 border border-white/5 border-dashed rounded-[2rem] flex flex-col items-center justify-center text-white/20 gap-4">
                                        <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        <span className="font-mono text-xs uppercase tracking-widest">Querying GitHub API...</span>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </section>

                    {/* 4. HIGH DENSITY TIMELINE */}
                    <section className="container mx-auto px-6 md:px-12 py-32 max-w-7xl relative z-10 bg-transparent">
                        <div className="grid lg:grid-cols-12 gap-12">
                            <div className="lg:col-span-4 relative z-20">
                                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter sticky top-32 mb-12">
                                    Track<br />Record
                                </h2>
                            </div>

                            <div className="lg:col-span-8 relative">
                                <div className="absolute left-[27px] md:left-[35px] top-6 bottom-6 w-px bg-white/10" />

                                {[
                                    { year: "2024", role: "Senior Software Engineer", company: "TechCorp", desc: "Spearheaded the monolithic decomposition into a robust microservices ecosystem. Improved core database latency by 45% utilizing advanced Redis caching layers and read-replicas." },
                                    { year: "2022", role: "Fullstack Developer", company: "InnovateStudio", desc: "Engineered real-time analytics dashboards processing 50k+ events/sec via WebSockets. Designed sleek, interactive data visualizations." },
                                    { year: "2020", role: "Frontend Architect", company: "Creative Agency", desc: "Delivered award-winning WebGL and GSAP animated experiences for Fortune 500 clients, strictly focusing on 60fps mobile performance." },
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        transition={{ duration: 0.6, ease: "easeOut" }}
                                        className="relative pl-24 md:pl-32 pb-24 group"
                                    >
                                        {/* Large Node */}
                                        <div className="absolute left-0 lg:left-2 top-0 w-16 h-16 bg-[#020202] border-2 border-white/20 rounded-full flex items-center justify-center group-hover:border-violet-500 group-hover:scale-110 transition-all z-10 shadow-[0_0_20px_rgba(0,0,0,1)]">
                                            <div className="w-3 h-3 bg-white/50 rounded-full group-hover:bg-violet-400 group-hover:shadow-[0_0_15px_#8b5cf6] transition-all" />
                                        </div>

                                        <div className="inline-block px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 font-mono text-xs tracking-widest mb-6">
                                            {item.year}
                                        </div>

                                        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 md:p-10 group-hover:bg-white/[0.04] group-hover:border-white/10 transition-colors">
                                            <h3 className="text-3xl md:text-4xl font-bold mb-3">{item.role}</h3>
                                            <div className="text-white/40 uppercase tracking-widest text-sm font-bold mb-8">{item.company}</div>
                                            <p className="text-white/60 text-lg leading-relaxed font-light">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* Footer with border separation */}
            <div className="relative z-20 bg-black border-t border-white/10">
                <Footer />
            </div>
        </div>
    );
}

// File End
