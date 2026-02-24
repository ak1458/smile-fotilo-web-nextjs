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
                            A hybrid creative studio where design meets engineering. Based in Gonda and Lucknow, serving clients worldwide.
                        </p>
                    </header>

                    {/* Who We Are */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-white mb-6">Who We Are</h2>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            Smile Fotilo is where creativity meets logic. The name &quot;Fotilo&quot; (Camera) represents our roots in visual storytelling, while &quot;Smile&quot; represents the satisfaction of our clients. We are a hybrid creative studio based in Gonda & Lucknow, dedicated to making the web a more beautiful place.
                        </p>
                    </div>

                    {/* Founder's Note */}
                    <div className="mb-16 bg-[#0F172A] p-8 rounded-3xl border border-indigo-500/20 relative">
                        <span className="absolute -top-4 -left-4 text-6xl text-indigo-500 opacity-20">&ldquo;</span>
                        <h3 className="text-xl font-bold text-indigo-400 mb-4">The Founder&apos;s Note</h3>
                        <p className="text-slate-300 italic mb-4">
                            &ldquo;I started Smile Fotilo because I saw too many businesses struggling to balance great aesthetics with technical functionality. As a developer and creative at heart, I wanted to build an agency that does both&mdash;creating websites that are visually stunning and technically robust.&rdquo;
                        </p>
                        <p className="text-slate-500 font-bold">&mdash; Ashraf Kamal, Founder</p>
                    </div>

                    {/* Why Choose Us */}
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-6">Why Choose Us?</h2>
                        <p className="text-slate-400 text-lg leading-relaxed mb-6">
                            We bring a unique perspective to web design. We don&apos;t just look at code; we look at composition, lighting, and user emotion. From dynamic WordPress development to engaging social media content, we ensure your brand looks as good as it works.
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
