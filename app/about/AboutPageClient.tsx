'use client';

import React from 'react';
import { Footer } from '../components/Footer';

export default function AboutPage() {
    return (
        <main className="bg-[#0F172A] min-h-screen text-slate-200 font-sans selection:bg-sky-400 selection:text-[#0F172A]">

            <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="max-w-4xl mx-auto">
                    <header className="text-center mb-16">
                        <h1 className="text-4xl md:text-6xl font-bold text-slate-50 mb-6">
                            About Smile Fotilo
                        </h1>
                        <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
                            A solo web development and digital marketing studio run by Ashraf Kamal. Based in Gonda, India — working with clients worldwide.
                        </p>
                    </header>

                    {/* Who We Are */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-white mb-6">Who We Are</h2>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            Smile Fotilo is a solo web development and digital marketing studio. The name &quot;Fotilo&quot; (Camera) represents our roots in visual storytelling, while &quot;Smile&quot; represents the satisfaction of our clients. I handle everything from design and development to deployment and marketing — using AI-assisted workflows to deliver quality work efficiently.
                        </p>
                    </div>

                    {/* Founder's Note */}
                    <div className="mb-16 bg-[#0F172A] p-8 rounded-3xl border border-indigo-500/20 relative">
                        <span className="absolute -top-4 -left-4 text-6xl text-indigo-500 opacity-20">&ldquo;</span>
                        <h3 className="text-xl font-bold text-indigo-400 mb-4">The Founder&apos;s Note</h3>
                        <p className="text-slate-300 italic mb-4">
                            &ldquo;I started Smile Fotilo because I saw too many businesses struggling to get online. As someone who builds websites and manages digital marketing, I wanted to offer both&mdash;functional websites that look good and actually bring in customers.&rdquo;
                        </p>
                        <p className="text-slate-500 font-bold">&mdash; Ashraf Kamal, Founder</p>
                    </div>

                    {/* Why Choose Us */}
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-6">Why Choose Us?</h2>
                        <p className="text-slate-400 text-lg leading-relaxed mb-6">
                            You work directly with me — no middlemen, no account managers. I use React, Next.js, WordPress, and AI tools to build websites that actually work for your business. From local shops in Gonda to international clients, every project gets my full attention.
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
