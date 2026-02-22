'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Footer } from '../components/Footer';
import { BackToTop } from '../components/BackToTop';
import Link from 'next/link';
import { MdArrowBack, MdWorkOutline, MdSchool, MdCheckCircle, MdMemory, MdLanguage, MdCode, MdArrowOutward } from 'react-icons/md';

// Type definition for basic GitHub Repo structure
interface Repo {
    id: number;
    name: string;
    description: string;
    html_url: string;
    language: string;
    stargazers_count: number;
}

export default function PortfolioPageClient({ initialRepos }: { initialRepos: Repo[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    return (
        <div ref={containerRef} className="min-h-screen bg-black text-white selection:bg-violet-500/30 font-sans overflow-hidden">
            {/* Animated Background Mesh */}
            <motion.div
                style={{ y: yBackground }}
                className="fixed inset-0 z-0 opacity-40 pointer-events-none"
            >
                <div className="absolute top-0 -left-1/4 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/40 via-purple-900/10 to-transparent blur-3xl transform -rotate-12" />
                <div className="absolute bottom-0 right-0 w-full h-[80%] bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent blur-2xl" />
            </motion.div>

            {/* Navigation */}
            <nav className="fixed top-0 inset-x-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group">
                        <MdArrowBack className="text-xl group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium tracking-wide">Back to Studio</span>
                    </Link>
                    <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-purple-400">
                        Portfolio.
                    </div>
                </div>
            </nav>

            <main className="relative z-10 pt-32 pb-20">
                {/* Hero Section */}
                <section className="container mx-auto px-6 min-h-[70vh] flex flex-col justify-center items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="inline-block px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium tracking-wide mb-8">
                            Software Engineer & Creator
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
                            Building digital experiences with <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-purple-500">
                                precision & passion.
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
                            I specialize in scalable architectures, high-performance web applications, and seamless user interfaces.
                        </p>
                    </motion.div>
                </section>

                {/* Who Am I Section */}
                <section className="container mx-auto px-6 py-24">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="grid md:grid-cols-2 gap-16 items-center"
                    >
                        <div className="space-y-8">
                            <h2 className="text-3xl md:text-5xl font-bold">Unlocking Potential Through Code.</h2>
                            <p className="text-lg text-gray-400 leading-relaxed font-light">
                                My journey began with a deep curiosity for how things work under the hood. Over the years, I have architected systems, optimized complex databases, and crafted pixel-perfect frontends. I believe in writing code that is not just functional, but maintainable and beautiful.
                            </p>

                            <div className="grid grid-cols-2 gap-6 pt-4">
                                {[
                                    { icon: <MdCode size={28} />, title: "Frontend", desc: "React, Next.js, UI/UX" },
                                    { icon: <MdMemory size={28} />, title: "Backend", desc: "Node.js, Go, Python" },
                                    { icon: <MdLanguage size={28} />, title: "Architecture", desc: "Microservices, AWS" },
                                    { icon: <MdCheckCircle size={28} />, title: "Performance", desc: "Optimization & Scale" },
                                ].map((skill, i) => (
                                    <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-violet-500/50 transition-colors">
                                        <div className="text-violet-400 mb-3">{skill.icon}</div>
                                        <h3 className="font-semibold text-white mb-1">{skill.title}</h3>
                                        <p className="text-sm text-gray-400">{skill.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square rounded-[3rem] overflow-hidden border border-white/10 relative group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/20 to-transparent mix-blend-overlay z-10" />
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out grayscale hover:grayscale-0" />
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full border border-violet-500/30 blur-sm" />
                            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full border border-fuchsia-500/30 blur-sm mix-blend-screen" />
                        </div>
                    </motion.div>
                </section>

                {/* Scrollytelling Timeline */}
                <section className="container mx-auto px-6 py-32 relative">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">The Journey So Far</h2>
                        <p className="text-gray-400 text-lg">A timeline of my professional growth.</p>
                    </div>

                    <div className="relative max-w-4xl mx-auto">
                        {/* Vertical line connecting nodes */}
                        <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-violet-500/40 to-transparent md:-translate-x-1/2" />

                        {/* Nodes */}
                        {[
                            { year: "2024", role: "Senior Software Engineer", company: "TechCorp", type: "work", desc: "Led the migration of the core monolith to a highly scalable microservices architecture." },
                            { year: "2022", role: "Fullstack Developer", company: "InnovateStudio", type: "work", desc: "Developed highly interactive real-time dashboards processing thousands of events per second." },
                            { year: "2020", role: "Frontend Developer", company: "Creative Agency", type: "work", desc: "Built award-winning web experiences for prominent international brands." },
                            { year: "2019", role: "Computer Science Degree", company: "University", type: "edu", desc: "Graduated with honors, specializing in distributed systems and algorithms." }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                className={`relative flex flex-col md:flex-row gap-8 mb-16 items-start ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                            >
                                <div className="hidden md:block w-1/2" />

                                {/* Icon Node */}
                                <div className="absolute left-0 md:left-1/2 w-14 h-14 rounded-full bg-black border-2 border-violet-500 flex items-center justify-center transform md:-translate-x-1/2 z-10 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                                    {item.type === 'work' ? <MdWorkOutline className="text-violet-400 text-xl" /> : <MdSchool className="text-fuchsia-400 text-xl" />}
                                </div>

                                <div className="w-full md:w-1/2 pl-20 md:pl-0 md:px-12 pt-2">
                                    <div className="inline-block px-3 py-1 rounded border border-white/20 text-xs font-mono text-gray-400 mb-3">{item.year}</div>
                                    <h3 className="text-2xl font-bold mb-1">{item.role}</h3>
                                    <div className="text-violet-400 font-medium mb-4">{item.company}</div>
                                    <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Github Projects Integration */}
                <section className="container mx-auto px-6 py-24">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">Open Source Repositories</h2>
                            <p className="text-gray-400 text-lg">Dynamic feed fetched directly from my GitHub profile.</p>
                        </div>
                        <a href="https://github.com/ak1458" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all font-medium">
                            View GitHub <MdArrowOutward className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </a>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {initialRepos && initialRepos.length > 0 ? (
                            initialRepos.map((repo, i) => (
                                <motion.a
                                    href={repo.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    key={repo.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: i * 0.05 }}
                                    className="block p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-violet-500/50 hover:bg-white/10 transition-all group"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-12 h-12 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center border border-violet-500/30">
                                            <MdCode size={24} />
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-gray-400 bg-black/50 px-3 py-1 rounded-full border border-white/10">
                                            <span>⭐</span> {repo.stargazers_count || 0}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-violet-300 transition-colors line-clamp-1">{repo.name}</h3>
                                    <p className="text-gray-400 text-sm mb-6 line-clamp-3 min-h-[60px]">
                                        {repo.description || 'No description provided for this repository.'}
                                    </p>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-violet-400 font-mono">{repo.language || 'Code'}</span>
                                        <span className="text-white/30 group-hover:text-white/70 transition-colors flex items-center gap-1">
                                            Open <MdArrowOutward />
                                        </span>
                                    </div>
                                </motion.a>
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center text-gray-500 border border-white/5 rounded-3xl bg-white/5">
                                Loading repositories...
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
            <BackToTop />
        </div>
    );
}
