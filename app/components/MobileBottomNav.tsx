'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const MobileBottomNav = () => {
    const pathname = usePathname();

    const navItems = [
        { href: '/', icon: 'home', label: 'Home' },
        { href: '/locations', icon: 'location_on', label: 'Locations' },
        { href: 'tel:+919453878422', icon: 'call', label: 'Call', isCall: true },
        { href: '/#services', icon: 'apps', label: 'Services' },
        { href: '/#contact', icon: 'mail', label: 'Contact' },
    ];

    return (
        <nav className="md:hidden fixed bottom-4 left-4 right-4 z-[100]">
            <div className="glass rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] px-4 py-2 flex items-center justify-around backdrop-blur-xl">
                {navItems.map((item) => (
                    item.isCall ? (
                        // Call Button - Inline but Distinct
                        <a
                            key={item.href}
                            href={item.href}
                            className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:scale-110 transition-transform"
                            aria-label="Call Us"
                        >
                            <span className="material-symbols-rounded text-xl text-white">call</span>
                        </a>
                    ) : (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all ${pathname === item.href
                                ? 'text-white bg-white/10'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <span className={`material-symbols-rounded text-xl ${pathname === item.href ? 'fill-current' : ''}`}>{item.icon}</span>
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    )
                ))}
            </div>
        </nav>
    );
};
