"use client";

import Link from 'next/link';
import { MdLocationOn, MdArrowForward } from 'react-icons/md';

interface Location {
    id: string;
    name: string;
    tagline: string;
    path: string;
    color: string;
}

const locations: Location[] = [
    { id: 'ayodhya', name: 'Ayodhya', tagline: 'The Spiritual Capital', path: '/locations/ayodhya', color: 'text-orange-400' },
    { id: 'lucknow', name: 'Lucknow', tagline: 'City of Nawabs', path: '/locations/lucknow', color: 'text-amber-400' },
    { id: 'greater-noida', name: 'Gr. Noida & NCR', tagline: 'The Silicon Valley', path: '/locations/greater-noida', color: 'text-cyan-400' },
    { id: 'gonda', name: 'Gonda', tagline: 'Our Headquarters', path: '/locations/gonda', color: 'text-emerald-400' },
    { id: 'global', name: 'Global', tagline: 'Worldwide Operations', path: '/locations/global', color: 'text-blue-400' },
];

export const OtherLocations = ({ currentLocation }: { currentLocation: string }) => {
    const filteredLocations = locations.filter(loc => loc.id !== currentLocation);

    return (
        <section className="sf-other-locations py-20 relative border-t border-white/5 bg-black/40 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-2xl font-bold text-white mb-4">Explore Our Locations</h2>
                    <div className="h-1 w-20 bg-white/10 mx-auto rounded-full"></div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {filteredLocations.map((loc) => (
                        <Link key={loc.id} href={loc.path} className="group block">
                            <div className="glass p-6 rounded-xl hover:bg-white/5 transition-all h-full border border-white/5 hover:border-white/20 relative overflow-hidden">
                                <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${loc.color}`}>
                                    <MdLocationOn className="text-6xl" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-colors">
                                    {loc.name}
                                </h3>
                                <p className={`text-sm font-medium ${loc.color} uppercase tracking-wider mb-4`}>{loc.tagline}</p>
                                <div className="flex items-center text-slate-400 text-sm group-hover:text-white transition-colors">
                                    <span>Explore Location</span>
                                    <MdArrowForward className="ml-2 text-lg group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};
