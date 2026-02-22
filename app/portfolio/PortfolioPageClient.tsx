'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
import { Footer } from '../components/Footer';
import Link from 'next/link';
import { MdArrowBack, MdWorkOutline, MdSchool, MdCheckCircle, MdMemory, MdLanguage, MdCode, MdArrowOutward } from 'react-icons/md';

interface Repo {
    id: number;
    name: string;
    description: string;
    html_url: string;
    language: string;
    stargazers_count: number;
}

// Custom hook for smooth spring physics on scroll values
function useSmoothTransform(value: MotionValue<number>, input: number[], output: number[]) {
    const raw = useTransform(value, input, output);
    return useSpring(raw, { stiffness: 100, damping: 30, mass: 0.5 });
}

export default function PortfolioPageClient({ initialRepos }: { initialRepos: Repo[] }) {
    // ------------------------------------------------------------------
    // Scroll Setup
    // ------------------------------------------------------------------
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress: mainScroll } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

    // Background parallax tied to main scroll
    const bgY = useSmoothTransform(mainScroll, [0, 1], [0, 500]);
    const bgOpacity = useSmoothTransform(mainScroll, [0, 0.2, 1], [1, 0.5, 0.1]);

    // ------------------------------------------------------------------
    // Hero Section Animation
    // ------------------------------------------------------------------
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });

    // Push Hero deep into Z-space (Graffico 3D feel)
    const heroScale = useSmoothTransform(heroScroll, [0, 1], [1, 0.7]);
    const heroY = useSmoothTransform(heroScroll, [0, 1], [0, 300]);
    const heroOpacity = useSmoothTransform(heroScroll, [0, 0.8, 1], [1, 0, 0]);

    // ------------------------------------------------------------------
    // "Who Am I" Text Reveal (Scroll Linked)
    // ------------------------------------------------------------------
    const aboutRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress: aboutScroll } = useScroll({ target: aboutRef, offset: ["start 80%", "end 50%"] });

    // Split text into words for stagger effect later or scroll-linked opacity
    const aboutText = "My journey began with a deep curiosity for how things work under the hood. Over the years, I have architected systems, optimized complex databases, and crafted pixel-perfect frontends. I believe in writing code that is not just functional, but maintainable and beautiful.";
    const words = aboutText.split(' ');

    // ------------------------------------------------------------------
    // Horizontal Scroll Section (Projects)
    // ------------------------------------------------------------------
    const horizontalContainerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress: horizontalScroll } = useScroll({ target: horizontalContainerRef });

    // Move the inner track horizontally based on vertical scroll
    const xTrack = useSmoothTransform(horizontalScroll, [0, 1], [0, -((initialRepos?.length || 1) * 450 + 500)]); // Estimate width based on card count


    return (
        <div ref={containerRef} className="min-h-screen bg-[#050505] text-white selection:bg-white/20 font-sans overflow-x-hidden relative">

            {/* Ambient Animated Background */}
            <motion.div style={{ y: bgY, opacity: bgOpacity }} className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-violet-900/20 blur-[150px] mix-blend-screen" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-900/10 blur-[120px] mix-blend-screen" />
                {/* Noise overlay for premium texture */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grain-image.s3.amazonaws.com/noise.png')] pointer-events-none" />
            </motion.div>

            {/* Navigation - Glassmorphism */}
            <nav className="fixed top-0 inset-x-0 z-50 mix-blend-difference pb-4 pt-6 px-6 md:px-12 backdrop-blur-[2px]">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-all group overflow-hidden">
                        <MdArrowBack className="text-xl group-hover:-translate-x-1 transition-transform" />
                        <span className="font-semibold tracking-widest text-xs uppercase relative">
                            Studio
                            <span className="absolute left-0 bottom-0 top-auto w-full h-[1px] bg-white transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                        </span>
                    </Link>
                    <div className="text-sm font-bold tracking-widest uppercase text-white/40">
                        portfolio ©{new Date().getFullYear()}
                    </div>
                </div>
            </nav>

            <main className="relative z-10">
                {/* 1. HERO SECTION (3D Parallax push back) */}
                <motion.section
                    ref={heroRef}
                    style={{ scale: heroScale, y: heroY, opacity: heroOpacity }}
                    className="h-screen flex flex-col justify-center items-center text-center px-4 sticky top-0 -z-10"
                >
                    <div className="overflow-hidden mb-6">
                        <motion.div
                            initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                            className="text-xs uppercase tracking-[0.3em] text-white/50 border border-white/10 px-6 py-2 rounded-full backdrop-blur-md"
                        >
                            Software Engineer
                        </motion.div>
                    </div>

                    <h1 className="text-[12vw] md:text-[8vw] font-black tracking-tighter leading-[0.85] uppercase mix-blend-difference">
                        <div className="overflow-hidden">
                            <motion.span initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} className="block">Crafting</motion.span>
                        </div>
                        <div className="overflow-hidden">
                            <motion.span initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.05 }} className="block text-transparent stroke-text" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.4)' }}>Experiences</motion.span>
                        </div>
                    </h1>
                </motion.section>

                <div className="bg-[#050505] relative z-10 w-full pt-32 pb-32 rounded-t-[3rem] border-t border-white/5">
                    {/* 2. WHO AM I (Scroll Linked Text Reveal) */}
                    <section ref={aboutRef} className="container mx-auto px-6 md:px-12 py-32 max-w-6xl">
                        <h2 className="text-sm uppercase tracking-widest text-white/40 mb-12 flex items-center gap-4">
                            <span className="w-12 h-px bg-white/40" /> Identity
                        </h2>

                        <p className="text-3xl md:text-5xl lg:text-7xl font-semibold leading-tight tracking-tight flex flex-wrap gap-x-3 gap-y-2">
                            {words.map((word, i) => {
                                // Calculate when each word should light up based on scroll progress
                                const start = i / words.length;
                                const end = start + (1 / words.length);
                                // eslint-disable-next-line react-hooks/rules-of-hooks
                                const opacity = useTransform(aboutScroll, [Math.max(0, start - 0.2), start], [0.15, 1]);

                                return (
                                    <motion.span key={i} style={{ opacity }} className="relative">
                                        {word}
                                    </motion.span>
                                );
                            })}
                        </p>

                        <div className="grid md:grid-cols-4 gap-8 mt-32">
                            {[
                                { title: "Frontend", tools: "React, Next.js, Framer" },
                                { title: "Backend", tools: "Node, Go, Postges" },
                                { title: "Architecture", tools: "AWS, Docker, Microservices" },
                                { title: "Performance", tools: "V8, Webpack, Redis" },
                            ].map((skill, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8, delay: i * 0.1 }}
                                    className="border-t border-white/10 pt-6"
                                >
                                    <h3 className="text-xl font-bold mb-2">{skill.title}</h3>
                                    <p className="text-white/40 font-mono text-xs">{skill.tools}</p>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* 3. HORIZONTAL SCROLL (GitHub Projects) */}
                    {/* The container is tall so the user scrolls vertically to move the content horizontally */}
                    <section ref={horizontalContainerRef} className="relative h-[300vh] mt-32">

                        {/* The sticky window that holds the horizontal track */}
                        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden border-t border-b border-white/5 bg-[#050505]/50 backdrop-blur-xl">

                            <div className="absolute top-20 left-12 z-20">
                                <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter opacity-10">Archives</h2>
                                <p className="text-white/40 font-mono text-sm uppercase tracking-widest mt-2 flex items-center gap-2">
                                    <MdCode /> Open Source Contributions
                                </p>
                            </div>

                            {/* The track moving left */}
                            <motion.div
                                style={{ x: xTrack }}
                                className="flex gap-8 px-12 items-center h-[500px] absolute w-max mt-16"
                            >
                                {/* Intro Card */}
                                <div className="w-[300px] shrink-0 p-8 h-full flex flex-col justify-center">
                                    <h3 className="text-3xl font-bold mb-4">Selected<br />Repositories</h3>
                                    <p className="text-white/40 mb-8">A curated list of my open-source work pulled live from GitHub @ak1458.</p>
                                    <a href="https://github.com/ak1458" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-violet-400 transition-colors">
                                        View Profile <MdArrowOutward />
                                    </a>
                                </div>

                                {/* GitHub Repo Cards */}
                                {initialRepos && initialRepos.length > 0 ? initialRepos.map((repo, i) => (
                                    <a
                                        href={repo.html_url} target="_blank" rel="noopener noreferrer" key={repo.id}
                                        className="group relative w-[350px] md:w-[450px] h-[400px] shrink-0 rounded-[2rem] bg-white/[0.02] border border-white/10 overflow-hidden flex flex-col justify-between p-8 hover:bg-white/[0.04] transition-colors"
                                    >
                                        {/* Hover Glow Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/0 via-transparent to-violet-500/0 group-hover:from-violet-600/10 group-hover:to-fuchsia-500/5 transition-colors duration-500" />

                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-8">
                                                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-black/50 backdrop-blur-sm group-hover:scale-110 group-hover:border-violet-400/50 group-hover:text-violet-400 transition-all duration-300">
                                                    <MdArrowOutward />
                                                </div>
                                                <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full font-mono text-xs text-white/50 flex items-center gap-2">
                                                    ⭐ {repo.stargazers_count || 0}
                                                </div>
                                            </div>
                                            <h3 className="text-2xl font-bold text-white mb-4 line-clamp-2">{repo.name}</h3>
                                            <p className="text-white/50 leading-relaxed line-clamp-3 group-hover:text-white/70 transition-colors">
                                                {repo.description || "No description available for this repository."}
                                            </p>
                                        </div>

                                        <div className="relative z-10 flex justify-between items-end border-t border-white/10 pt-6 mt-6">
                                            <div className="font-mono text-xs uppercase tracking-widest text-violet-400">
                                                {repo.language || 'Code'}
                                            </div>
                                            <div className="w-8 h-px bg-white/20 group-hover:w-16 group-hover:bg-violet-400 transition-all duration-500 origin-right" />
                                        </div>
                                    </a>
                                )) : (
                                    <div className="w-[400px] h-[400px] shrink-0 border border-white/5 border-dashed rounded-[2rem] flex items-center justify-center text-white/20">
                                        Loading repositories...
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </section>

                    {/* 4. TIMELINE (Vertical fade-ins) */}
                    <section className="container mx-auto px-6 md:px-12 py-32 max-w-4xl relative">
                        <div className="absolute left-[39px] md:left-[51px] top-40 bottom-32 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                        <h2 className="text-sm uppercase tracking-widest text-white/40 mb-24 flex items-center gap-4">
                            <span className="w-12 h-px bg-white/40" /> Milestones
                        </h2>

                        {[
                            { year: "2024", role: "Senior Software Engineer", company: "TechCorp", type: "work", desc: "Led the migration of the core monolith to a highly scalable microservices architecture. Reduced latency by 40%." },
                            { year: "2022", role: "Fullstack Developer", company: "InnovateStudio", type: "work", desc: "Developed highly interactive real-time dashboards processing thousands of events per second." },
                            { year: "2020", role: "Frontend Developer", company: "Creative Agency", type: "work", desc: "Built award-winning web experiences for prominent international brands with advanced GSAP animations." },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="relative pl-20 md:pl-28 mb-24 group"
                            >
                                {/* Node */}
                                <div className="absolute left-[12px] md:left-[24px] top-1 w-14 h-14 bg-[#050505] border border-white/10 rounded-full flex items-center justify-center group-hover:border-violet-500 transition-colors z-10">
                                    <MdWorkOutline className="text-white/40 group-hover:text-violet-400 transition-colors" />
                                </div>

                                <div className="text-violet-400/50 font-mono text-sm mb-2">{item.year}</div>
                                <h3 className="text-3xl font-bold mb-2">{item.role}</h3>
                                <div className="text-white/60 text-lg mb-6">{item.company}</div>
                                <p className="text-white/40 leading-relaxed max-w-2xl">{item.desc}</p>
                            </motion.div>
                        ))}
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
