'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { MdHome, MdWork, MdApps, MdArticle, MdLocationOn, MdInfo, MdChevronRight, MdLocalHospital, MdSearch, MdPayments } from 'react-icons/md';
import Image from 'next/image';

export const NavBar = React.memo(() => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleLinkClick = () => {
        setIsOpen(false);
    };

    const menuItems = [
        { href: '/#home', label: 'Home', icon: <MdHome /> },
        { href: '/#work', label: 'Work', icon: <MdWork /> },
        { href: '/#services', label: 'Services', icon: <MdApps /> },
        { href: '/pricing', label: 'Pricing', icon: <MdPayments /> },
        { href: '/services/clinic-growth-autopilot', label: 'Growth AI', icon: <MdLocalHospital /> },
        { href: '/tools', label: 'Free Tools', icon: <MdSearch /> },
        { href: '/blog', label: 'Blog', icon: <MdArticle /> },
        { href: '/locations', label: 'Locations', icon: <MdLocationOn /> },
        { href: '/about', label: 'About', icon: <MdInfo /> },
    ];

    return (
        <nav className="fixed top-0 w-full z-50">
            {/* Main Nav Bar - Dark Mode Style */}
            <div className="glass border-b border-white/5 bg-[#0a0118]/80 backdrop-blur-xl transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group relative h-12 w-auto" onClick={handleLinkClick}>
                            <Image 
                                src="/logo.png" 
                                alt="Smile Fotilo Logo" 
                                width={168} 
                                height={48}
                                className="h-12 w-auto object-contain transition-all brightness-125 contrast-110" 
                                style={{ width: 'auto', height: '48px' }}
                                priority
                            />
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-8">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-sm font-medium text-slate-400 hover:text-violet-400 transition-all duration-300"
                                >
                                    {item.label}
                                </Link>
                            ))}

                            <Link href="/#contact" className="px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-sm hover:opacity-90 transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:scale-105 hover:shadow-[0_0_30px_rgba(139,92,246,0.6)]">
                                Start Project
                            </Link>
                        </div>

                        {/* Mobile: Hamburger Only */}
                        <div className="md:hidden flex items-center gap-2">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600/20 to-purple-600/20 border border-violet-500/30 flex items-center justify-center"
                            >
                                <div className="flex flex-col gap-1.5 items-center justify-center">
                                    <motion.span
                                        animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                                        className="block w-5 h-0.5 bg-white rounded-full"
                                    />
                                    <motion.span
                                        animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                                        className="block w-5 h-0.5 bg-white rounded-full"
                                    />
                                    <motion.span
                                        animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                                        className="block w-5 h-0.5 bg-white rounded-full"
                                    />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Full-Screen Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden fixed inset-0 top-20 z-40"
                    >
                        <div className="absolute inset-0 bg-[#0a0118]/98 backdrop-blur-2xl" />

                        <div
                            className="relative h-full min-h-0 max-h-[calc(100vh-5rem)] overflow-y-auto overscroll-contain px-6 py-8 pb-[calc(2rem+env(safe-area-inset-bottom))]"
                            style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
                        >
                            <div className="space-y-2">
                                {menuItems.map((item, index) => (
                                    <motion.div
                                        key={item.href}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Link
                                            href={item.href}
                                            onClick={handleLinkClick}
                                            className="flex items-center gap-4 px-4 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-violet-500/20 transition-all group"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600/30 to-purple-600/30 border border-violet-500/30 flex items-center justify-center text-xl text-violet-300">
                                                {item.icon}
                                            </div>
                                            <span className="text-lg font-medium text-white">{item.label}</span>
                                            <MdChevronRight className="text-xl text-slate-400 ml-auto group-hover:translate-x-1 transition-all" />
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="mt-8"
                            >
                                <Link
                                    href="/#contact"
                                    onClick={handleLinkClick}
                                    className="block w-full text-center px-6 py-4 text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl shadow-[0_0_30px_rgba(139,92,246,0.4)]"
                                >
                                    Start Project
                                </Link>
                            </motion.div>

                            <div className="mt-auto pt-8 border-t border-white/10">
                                <p className="text-slate-500 text-sm text-center">Web Design. SEO. Strategic Branding.</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
});

NavBar.displayName = 'NavBar';
