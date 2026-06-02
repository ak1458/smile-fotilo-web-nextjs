'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Footer } from '../components/Footer';
import Link from 'next/link';
import { MdArrowOutward, MdArrowBack, MdStar } from 'react-icons/md';
import { FaWhatsapp, FaGithub } from 'react-icons/fa';

interface Repo {
    id: number;
    name: string;
    description: string;
    html_url: string;
    language: string;
    stargazers_count: number;
}

const WHATSAPP_HREF = 'https://wa.me/919453878422?text=Hi%20Ashraf%2C%20I%20saw%20your%20portfolio%20and%20want%20to%20discuss%20a%20project.';

type Project = {
    name: string;
    category: string;
    summary: string;
    tech: string[];
    href?: string;
    github?: string;
    accent: string;
};

const CLIENT_WORK: Project[] = [
    { name: 'PulseKart', category: 'Pharmacy POS & Ordering', summary: 'Billing, inventory and online ordering system for a pharmacy in Gonda — replaced manual registers with one fast dashboard.', tech: ['Next.js', 'PostgreSQL', 'Tailwind'], href: '/work/pulsekart', accent: 'text-emerald-300' },
    { name: 'KapdaFactory', category: 'Garment E-commerce', summary: 'Online store for a clothing manufacturer — product catalog, cart and order flow built to convert browsers into buyers.', tech: ['Next.js', 'Commerce', 'SEO'], href: '/work/kapda-factory', accent: 'text-sky-300' },
    { name: 'StoryBook Weddings', category: 'Photography Portfolio', summary: 'A booking-focused portfolio for a Lucknow wedding photographer — gallery-first design that turns visits into enquiries.', tech: ['Next.js', 'Gallery', 'Local SEO'], href: '/work/storybook-weddings', accent: 'text-rose-300' },
    { name: 'Veloria Vault', category: 'Luxury Leather E-commerce', summary: 'Full digital presence for a leather-goods brand — store plus Amazon/Flipkart listings and content that sells.', tech: ['WordPress', 'WooCommerce', 'Marketplace'], accent: 'text-amber-300' },
    { name: 'OrderFlow', category: 'Logistics Dashboard', summary: 'Dispatch and order-tracking dashboard that gave a logistics operation real-time visibility over deliveries.', tech: ['React', 'Dashboard', 'API'], href: '/work/orderflow', accent: 'text-indigo-300' },
    { name: 'Curbit', category: 'Service Website (Oregon, USA)', summary: 'Clean lead-generating website for a US service business — fast, mobile-first and built to rank locally.', tech: ['Next.js', 'SEO', 'US client'], accent: 'text-teal-300' },
];

const PERSONAL_WORK: Project[] = [
    { name: 'Takhti', category: 'Tuition Management PWA', summary: 'Installable app for tuition centres — attendance, fee tracking and parent updates in one place.', tech: ['PWA', 'Next.js', 'Offline'], github: 'https://github.com/ak1458', accent: 'text-violet-300' },
    { name: 'Tuition Teacher', category: 'Tutor–Student Platform', summary: 'A platform to connect local tutors with students and manage classes and schedules.', tech: ['React', 'Auth', 'Supabase'], github: 'https://github.com/ak1458', accent: 'text-cyan-300' },
    { name: 'YouTube Optimizer', category: 'Browser Extension', summary: 'A Chrome extension that helps creators improve titles, tags and thumbnails for better reach.', tech: ['Extension', 'JS', 'YouTube API'], github: 'https://github.com/ak1458', accent: 'text-orange-300' },
];

const STACK = [
    { label: 'Frontend', items: 'React · Next.js · Tailwind' },
    { label: 'Backend', items: 'Node · PostgreSQL · WordPress' },
    { label: 'Deploy', items: 'Vercel · Netlify · cPanel' },
    { label: 'AI & Tooling', items: 'AI-assisted dev · Git · APIs' },
];

const TIMELINE = [
    { year: '2024 — now', role: 'Founder & Developer', org: 'Smile Fotilo', desc: 'Run a solo web + AI-automation studio: client discovery, design, development, deployment and ongoing support using AI-assisted workflows.' },
    { year: '2023', role: 'Web Developer', org: 'Client Projects', desc: 'Shipped full-stack apps for real businesses — PulseKart POS, Veloria Vault e-commerce, OrderFlow logistics, and the Takhti tuition PWA.' },
    { year: '2022', role: 'Digital Marketing', org: 'Veloria Vault', desc: 'Managed a leather brand end-to-end: website, marketplace listings, product optimization, content and AI-generated creatives.' },
];

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.5 },
};

function ProjectCard({ p }: { p: Project }) {
    const Wrapper: React.ElementType = p.href ? Link : p.github ? 'a' : 'div';
    const linkProps = p.href
        ? { href: p.href }
        : p.github
            ? { href: p.github, target: '_blank', rel: 'noopener noreferrer' }
            : {};
    return (
        <Wrapper
            {...linkProps}
            className="group flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-7 transition-all hover:border-white/25 hover:bg-white/[0.04]"
        >
            <div>
                <div className="mb-4 flex items-center justify-between">
                    <span className={`text-xs font-semibold uppercase tracking-widest ${p.accent}`}>{p.category}</span>
                    {(p.href || p.github) && (
                        <MdArrowOutward className="text-lg text-white/30 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/80" />
                    )}
                </div>
                <h3 className="mb-3 text-2xl font-semibold text-white">{p.name}</h3>
                <p className="text-[15px] leading-relaxed text-white/55">{p.summary}</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
                {p.tech.map((t) => (
                    <span key={t} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-white/60">{t}</span>
                ))}
            </div>
        </Wrapper>
    );
}

export default function PortfolioPageClient({ initialRepos }: { initialRepos: Repo[] }) {
    // Show one repo per project family — newest/best, no legacy/archive/empty dupes.
    const repos = (() => {
        const junk = /(\.github|original|souce|source|archive|legacy|backup|-old\b|\btest\b|template|\bconfig\b|dotfiles)/i;
        const list = (initialRepos || []).filter((r) => r && r.name && !junk.test(r.name));
        const groups = new Map<string, Repo[]>();
        for (const r of list) {
            const key = r.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 6); // family key
            const arr = groups.get(key) || [];
            arr.push(r);
            groups.set(key, arr);
        }
        const pickBest = (arr: Repo[]) =>
            arr.slice().sort(
                (a, b) =>
                    (Number(Boolean(b.description)) - Number(Boolean(a.description))) ||
                    ((b.stargazers_count || 0) - (a.stargazers_count || 0))
            )[0];
        return [...groups.values()].map(pickBest).slice(0, 6);
    })();

    return (
        <div className="min-h-screen bg-[#0a0a0b] font-sans text-white selection:bg-white/20">
            {/* Top bar */}
            <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#0a0a0b]/80 backdrop-blur-xl">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <Link href="/" className="group inline-flex items-center gap-2 text-sm text-white/60 hover:text-white">
                        <MdArrowBack className="transition-transform group-hover:-translate-x-1" /> Back to studio
                    </Link>
                    <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-bold text-[#05290f] transition-transform hover:scale-105">
                        <FaWhatsapp /> Chat on WhatsApp
                    </a>
                </div>
            </nav>

            <main className="mx-auto max-w-6xl px-6 pt-32">
                {/* Hero */}
                <section className="border-b border-white/10 pb-16">
                    <motion.p {...fadeUp} className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-white/40">
                        Ashraf Kamal — Web Developer & AI-Automation Builder
                    </motion.p>
                    <motion.h1 {...fadeUp} transition={{ duration: 0.5, delay: 0.05 }} className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl">
                        I build real websites & web apps that actually work.
                    </motion.h1>
                    <motion.p {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }} className="mt-6 max-w-2xl text-lg leading-relaxed text-white/55">
                        React, Next.js, WordPress and AI tools — shipping practical, business-focused projects for clients across India and the US. Every project below is real work, with live code on GitHub.
                    </motion.p>
                    <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.15 }} className="mt-8 flex flex-wrap items-center gap-4">
                        <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-bold text-[#05290f] transition-transform hover:scale-105">
                            <FaWhatsapp className="text-lg" /> Discuss your project
                        </a>
                        <a href="#work" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 font-semibold text-white/80 transition-colors hover:border-white/40 hover:text-white">
                            See selected work
                        </a>
                        <a href="https://github.com/ak1458" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white">
                            <FaGithub /> github.com/ak1458
                        </a>
                    </motion.div>
                    <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.2 }} className="mt-10 flex flex-wrap gap-x-10 gap-y-3 text-sm text-white/50">
                        <span><strong className="text-white">100+</strong> projects delivered</span>
                        <span className="inline-flex items-center gap-1"><MdStar className="text-amber-300" /> <strong className="text-white">4.9</strong> · 118 Google reviews</span>
                        <span><strong className="text-white">3</strong> studios in Uttar Pradesh + remote</span>
                    </motion.div>
                </section>

                {/* Stack */}
                <section className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-4 my-16">
                    {STACK.map((s) => (
                        <div key={s.label} className="bg-[#0a0a0b] p-6">
                            <div className="text-xs font-bold uppercase tracking-widest text-white/40">{s.label}</div>
                            <div className="mt-2 text-sm text-white/75">{s.items}</div>
                        </div>
                    ))}
                </section>

                {/* Selected work */}
                <section id="work" className="scroll-mt-24 py-8">
                    <div className="mb-10 flex items-end justify-between">
                        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Selected work</h2>
                        <span className="text-sm text-white/40">Client projects</span>
                    </div>
                    <div className="grid gap-5 md:grid-cols-2">
                        {CLIENT_WORK.map((p) => (
                            <motion.div key={p.name} {...fadeUp}><ProjectCard p={p} /></motion.div>
                        ))}
                    </div>
                </section>

                {/* Personal */}
                <section className="py-8">
                    <div className="mb-10 flex items-end justify-between">
                        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Personal & experimental</h2>
                        <span className="text-sm text-white/40">Things I build for fun & to learn</span>
                    </div>
                    <div className="grid gap-5 md:grid-cols-3">
                        {PERSONAL_WORK.map((p) => (
                            <motion.div key={p.name} {...fadeUp}><ProjectCard p={p} /></motion.div>
                        ))}
                    </div>
                </section>

                {/* Live GitHub */}
                {repos.length > 0 && (
                    <section className="py-8">
                        <div className="mb-10 flex items-end justify-between">
                            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Live from GitHub</h2>
                            <a href="https://github.com/ak1458?tab=repositories" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white">
                                All repos <MdArrowOutward />
                            </a>
                        </div>
                        <div className="grid gap-5 md:grid-cols-3">
                            {repos.map((repo) => (
                                <motion.a
                                    key={repo.id} {...fadeUp}
                                    href={repo.html_url} target="_blank" rel="noopener noreferrer"
                                    className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-all hover:border-white/25 hover:bg-white/[0.04]"
                                >
                                    <div>
                                        <div className="mb-3 flex items-center justify-between">
                                            <FaGithub className="text-white/40" />
                                            <span className="inline-flex items-center gap-1 text-xs text-white/40"><MdStar className="text-amber-300" /> {repo.stargazers_count || 0}</span>
                                        </div>
                                        <h3 className="mb-2 break-words text-lg font-semibold text-white">{repo.name}</h3>
                                        <p className="line-clamp-2 text-sm text-white/50">{repo.description || 'View the code on GitHub.'}</p>
                                    </div>
                                    {repo.language && <div className="mt-4 text-xs font-medium uppercase tracking-widest text-white/40">{repo.language}</div>}
                                </motion.a>
                            ))}
                        </div>
                    </section>
                )}

                {/* Track record */}
                <section className="py-8">
                    <h2 className="mb-10 text-3xl font-semibold tracking-tight md:text-4xl">Track record</h2>
                    <div className="space-y-4">
                        {TIMELINE.map((t) => (
                            <motion.div key={t.year} {...fadeUp} className="grid gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-7 md:grid-cols-[180px_1fr] md:gap-8">
                                <div>
                                    <div className="text-sm font-bold text-white/70">{t.role}</div>
                                    <div className="text-xs uppercase tracking-widest text-white/35">{t.org}</div>
                                    <div className="mt-1 text-xs text-white/35">{t.year}</div>
                                </div>
                                <p className="text-[15px] leading-relaxed text-white/55">{t.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="my-16 rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center md:p-16">
                    <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Have a project in mind?</h2>
                    <p className="mx-auto mt-4 max-w-xl text-white/55">Tell me what you&apos;re building. I reply the same day — in Hindi or English.</p>
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-7 py-3.5 font-bold text-[#05290f] transition-transform hover:scale-105">
                            <FaWhatsapp className="text-lg" /> Chat on WhatsApp
                        </a>
                        <Link href="/#contact" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 font-semibold text-white/80 transition-colors hover:border-white/40 hover:text-white">
                            Send a message
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
