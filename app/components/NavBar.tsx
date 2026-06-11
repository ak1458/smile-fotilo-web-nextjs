'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MdHome, MdWork, MdApps, MdArticle, MdLocationOn, MdInfo, MdChevronRight, MdLocalHospital, MdSearch, MdPayments, MdStars } from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';
import Image from 'next/image';

const WHATSAPP_HREF = 'https://wa.me/919453878422?text=Hi%20Smile%20Fotilo%2C%20I%20want%20a%20free%20quote%20for%20my%20project.';

export const NavBar = React.memo(() => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const hideOnAppShellRoutes = ['/admin', '/portal', '/login'].some(
        (route) => pathname === route || pathname.startsWith(`${route}/`),
    );

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';

        // Return focus to button when closed
        if (!isOpen && buttonRef.current) {
            buttonRef.current.focus();
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Focus Trap Logic
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen || !menuRef.current) return;

            if (e.key === 'Escape') {
                setIsOpen(false);
                return;
            }

            if (e.key === 'Tab') {
                const focusableElements = menuRef.current.querySelectorAll(
                    'a[href], button:not([disabled]), textarea, input, select'
                );
                const firstElement = focusableElements[0] as HTMLElement;
                const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement?.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement?.focus();
                    }
                }
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            // Auto focus first element on open
            setTimeout(() => {
                const firstLink = menuRef.current?.querySelector('a[href]') as HTMLElement;
                firstLink?.focus();
            }, 100);
        }

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    if (hideOnAppShellRoutes) {
        return null;
    }

    const handleLinkClick = () => {
        setIsOpen(false);
    };

    // Full list — shown in the mobile menu.
    const menuItems = [
        { href: '/', label: 'Home', icon: <MdHome /> },
        { href: '/services', label: 'Services', icon: <MdApps /> },
        { href: '/work', label: 'Our Work', icon: <MdWork /> },
        { href: '/pricing', label: 'Pricing', icon: <MdPayments /> },
        { href: '/services/clinic-growth-autopilot', label: 'Growth Autopilot', icon: <MdLocalHospital /> },
        { href: '/tools', label: 'Free Tools', icon: <MdSearch /> },
        { href: '/blog', label: 'Blog', icon: <MdArticle /> },
        { href: '/locations', label: 'Locations', icon: <MdLocationOn /> },
        { href: '/about', label: 'About', icon: <MdInfo /> },
        { href: '/portfolio', label: "Ashraf's Portfolio", icon: <MdStars /> },
    ];

    // Trimmed set for the desktop bar so it never wraps or feels cramped.
    const primaryNav = [
        { href: '/services', label: 'Services' },
        { href: '/work', label: 'Work' },
        { href: '/pricing', label: 'Pricing' },
        { href: '/tools', label: 'Tools' },
        { href: '/blog', label: 'Blog' },
        { href: '/about', label: 'About' },
    ];

    return (
        <nav className="sf-site-nav fixed top-0 z-50 w-full">
            {/* Main Nav Bar - Dark Mode Style */}
            <div className="sf-nav-shell glass border-b border-white/5 bg-[#0a0118]/80 backdrop-blur-xl transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <Link href="/" className="nav-logo flex items-center gap-2 group relative h-12 w-auto" onClick={handleLinkClick}>
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
                        <div className="nav-links hidden items-center gap-6 lg:flex xl:gap-8">
                            {primaryNav.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="sf-nav-link whitespace-nowrap text-[15px] font-medium text-slate-300 transition-colors duration-200 hover:text-white"
                                >
                                    {item.label}
                                </Link>
                            ))}

                            <a
                                href={WHATSAPP_HREF}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Chat with us on WhatsApp"
                                className="sf-nav-cta inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-bold text-[#05290f] shadow-[0_0_20px_rgba(37,211,102,0.35)] transition-all hover:scale-105 hover:bg-[#22c35e] hover:shadow-[0_0_30px_rgba(37,211,102,0.6)]"
                            >
                                <FaWhatsapp className="text-lg" /> Chat on WhatsApp
                            </a>
                        </div>

                        {/* Mobile / tablet: Hamburger */}
                        <div className="lg:hidden flex items-center gap-2">
                            <button
                                ref={buttonRef}
                                onClick={() => setIsOpen(!isOpen)}
                                aria-expanded={isOpen}
                                aria-controls="mobile-menu"
                                aria-label="Toggle menu"
                                className="sf-nav-menu-button relative -mr-2 flex h-12 w-12 items-center justify-center rounded-xl border border-violet-500/30 bg-gradient-to-br from-violet-600/20 to-purple-600/20"
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
                        className="sf-mobile-menu mobile-menu fixed inset-0 top-20 z-40 lg:hidden"
                    >
                        <div className="absolute inset-0 bg-[#0a0118]/98 backdrop-blur-2xl" />

                        <div
                            id="mobile-menu"
                            ref={menuRef}
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
                                            className="sf-mobile-link group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 transition-all hover:bg-violet-500/20"
                                        >
                                            <div className="sf-mobile-link-icon flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/30 bg-gradient-to-br from-violet-600/30 to-purple-600/30 text-xl text-violet-300">
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
                                <a
                                    href={WHATSAPP_HREF}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={handleLinkClick}
                                    aria-label="Chat with us on WhatsApp"
                                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-6 py-4 text-lg font-bold text-[#05290f] shadow-[0_0_30px_rgba(37,211,102,0.35)]"
                                >
                                    <FaWhatsapp className="text-2xl" /> Chat on WhatsApp
                                </a>
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
