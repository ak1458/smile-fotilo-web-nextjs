'use client';

import React from 'react';

interface Testimonial {
    name: string;
    role: string;
    company: string;
    text: string;
    rating: number;
    avatar?: string;
}

const testimonials: Testimonial[] = [
    {
        name: "Veloria Vault",
        role: "Luxury Leather Goods",
        company: "Lucknow, UP",
        text: "Ashraf built and manages our entire website, runs our Amazon and Flipkart ad campaigns, and creates all our social media content. He handles everything so I can focus on my product.",
        rating: 5
    },
    {
        name: "PulseKart",
        role: "Pharmacy POS System",
        company: "Gonda, UP",
        text: "The pharmacy billing system Ashraf built replaced our manual process completely. Inventory tracking, prescription records, GST billing — it all works from one dashboard.",
        rating: 5
    },
    {
        name: "StoryBook Weddings",
        role: "Photography Portfolio",
        company: "Lucknow, UP",
        text: "Clean portfolio site, delivered on time, looks great on mobile. Exactly what we needed to showcase our wedding photography work.",
        rating: 5
    },
    {
        name: "Curbit",
        role: "Service Website",
        company: "Oregon, USA",
        text: "Professional website that represents our company well. Good communication despite the timezone difference.",
        rating: 5
    },
    {
        name: "KapdaFactory",
        role: "Garment E-Commerce",
        company: "Gonda, UP",
        text: "Ashraf set up our WordPress store and manages product listings and payments. The site works well for our customers.",
        rating: 5
    }
];

const aiCapabilities = [
    { name: "AI Workflow Automation", icon: "AI" },
    { name: "Missed-Call Recovery", icon: "MC" },
    { name: "Review Intelligence", icon: "RV" },
    { name: "Multilingual Chat", icon: "ML" },
    { name: "Content Ops Engine", icon: "CO" },
    { name: "Growth Analytics", icon: "GA" }
];

export const Testimonials = () => {
    return (
        <section className="py-24 bg-[#020617] text-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Client <span className="text-indigo-400">Projects</span>
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        I work directly with business owners — no account managers, no handoffs.
                        Here&apos;s what that looks like in practice.
                    </p>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
                    {[
                        { stat: "10+", label: "Projects Delivered" },
                        { stat: "4.9", label: "Average Rating" },
                        { stat: "100%", label: "Direct Communication" },
                        { stat: "2", label: "Countries Served" }
                    ].map((item, i) => (
                        <div key={i} className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-indigo-400 mb-2">{item.stat}</div>
                            <div className="text-slate-400 text-sm">{item.label}</div>
                        </div>
                    ))}
                </div>

                {/* Capability Strip */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-20">
                    {aiCapabilities.map((capability, i) => (
                        <div key={i} className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
                            <span>{capability.icon}</span>
                            <span className="text-slate-300 text-xs md:text-sm font-medium">{capability.name}</span>
                        </div>
                    ))}
                </div>

                {/* Testimonials Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, i) => (
                        <div
                            key={i}
                            className="p-8 border border-white/10 rounded-2xl bg-[#0F172A]/50 hover:border-indigo-500/30 transition-colors flex flex-col"
                        >
                            {/* Stars */}
                            <div className="flex gap-1 mb-6">
                                {[...Array(testimonial.rating)].map((_, j) => (
                                    <span key={j} className="text-yellow-400">*</span>
                                ))}
                            </div>

                            {/* Quote */}
                            <p className="text-slate-300 mb-8 leading-relaxed flex-grow text-lg">
                                &quot;{testimonial.text}&quot;
                            </p>

                            {/* Author/Company Info */}
                            <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-white/10 flex items-center justify-center text-2xl">
                                    {/* Use first letter of company name */}
                                    {testimonial.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-bold text-white text-lg">{testimonial.name}</div>
                                    <div className="text-indigo-400 text-sm font-medium">{testimonial.role}</div>
                                    <div className="text-slate-500 text-xs mt-0.5">{testimonial.company}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

