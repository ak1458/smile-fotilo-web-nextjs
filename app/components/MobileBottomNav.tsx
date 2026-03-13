'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MdHome, MdLocationOn, MdCall, MdApps, MdEmail } from 'react-icons/md';

export const MobileBottomNav = React.memo(() => {
    const pathname = usePathname();
    const hideOnAppShellRoutes = ['/admin', '/portal', '/login'].some(
        (route) => pathname === route || pathname.startsWith(`${route}/`),
    );

    const navItems = [
        { href: '/', icon: <MdHome />, label: 'Home' },
        { href: '/locations', icon: <MdLocationOn />, label: 'Locations' },
        { href: 'tel:+919453878422', icon: <MdCall />, label: 'Call', isCall: true },
        { href: '/#services', icon: <MdApps />, label: 'Services' },
        { href: '/#contact', icon: <MdEmail />, label: 'Contact' },
    ];

    if (hideOnAppShellRoutes) {
        return null;
    }

    return (
        <nav className="md:hidden fixed bottom-3 left-3 right-3 z-[100]">
            <div className="glass rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] px-3 py-2.5 flex items-center justify-around backdrop-blur-xl">
                {navItems.map((item) => (
                    item.isCall ? (
                        // Call Button - Inline but Distinct
                        <a
                            key={item.href}
                            href={item.href}
                            className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:scale-110 transition-transform"
                            aria-label="Call Us"
                        >
                            <MdCall className="text-xl text-white" />
                        </a>
                    ) : (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex min-h-11 min-w-14 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 transition-all ${pathname === item.href
                                ? 'text-white bg-white/10'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <div className={`text-xl ${pathname === item.href ? 'text-white' : ''}`}>
                                {item.icon}
                            </div>
                            <span className="text-[11px] font-medium leading-none">{item.label}</span>
                        </Link>
                    )
                ))}
            </div>
        </nav>
    );
});

MobileBottomNav.displayName = 'MobileBottomNav';
