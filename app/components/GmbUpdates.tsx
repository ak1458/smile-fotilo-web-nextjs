'use client';

import React from 'react';
import gmbData from '../data/gmb-feed.json';

interface GmbUpdate {
    id: string;
    location: string;
    date: string;
    title: string;
    text: string;
    link: string;
    image?: string;
}

export const GmbUpdates = ({ locationFilter }: { locationFilter: string }) => {
    const updates = gmbData.updates.filter(u => u.location === locationFilter);

    if (updates.length === 0) return null;

    return (
        <section className="py-20 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">Live from GMB</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                            Latest <span className="text-emerald-400">Updates</span> & Insights
                        </h2>
                    </div>
                    <a
                        href="https://www.google.com/search?q=Smile+Fotilo"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 text-sm font-medium flex items-center gap-2 group transition-colors"
                    >
                        Follow us on Google
                        <span className="material-symbols-rounded text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </a>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {updates.map((update) => (
                        <div key={update.id} className="glass-card group overflow-hidden hover:border-emerald-500/30 transition-all duration-500">
                            {update.image && (
                                <div className="aspect-video overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                                    <img
                                        src={update.image}
                                        alt={update.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute bottom-4 left-6 z-20">
                                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-500/20">
                                            {update.date}
                                        </span>
                                    </div>
                                </div>
                            )}
                            <div className="p-8">
                                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">
                                    {update.title}
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                                    {update.text}
                                </p>
                                <a
                                    href={update.link}
                                    className="inline-flex items-center gap-2 text-white text-xs font-bold uppercase tracking-wider group/link"
                                >
                                    Read Full Post
                                    <span className="w-8 h-[1px] bg-emerald-500/50 group-hover/link:w-12 transition-all"></span>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
