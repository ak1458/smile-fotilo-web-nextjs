import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MdCall, MdEmail, MdSchedule } from 'react-icons/md';

export const Footer = React.memo(() => (
    <footer className="sf-site-footer bg-[#0a0f1a] border-t border-white/5 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Main Footer Grid - Reorganized for better mobile layout */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

                {/* Brand - Full width on mobile, centered */}
                <div className="text-center md:text-left md:col-span-1">
                    <Image
                        src="/logo.png"
                        alt="Smile Fotilo"
                        width={160}
                        height={40}
                        className="h-10 w-auto brightness-0 invert mb-4 mx-auto md:mx-0"
                    />
                    <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
                        Web development and digital marketing studio — based in India, working worldwide.
                    </p>
                    <div className="flex gap-3 mt-6 justify-center md:justify-start">
                        <a href="https://www.instagram.com/ashrafkamal14/" target="_blank" rel="noopener noreferrer" aria-label="Instagram Profile" className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 transition-all">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                        </a>
                        <a href="https://www.linkedin.com/in/ashrafkamal14/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile" className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 transition-all">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" /></svg>
                        </a>
                        <a href="https://www.facebook.com/smilefotilo" target="_blank" rel="noopener noreferrer" aria-label="Facebook Page" className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 transition-all">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.641c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.513c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.737-.9 10.125-5.864 10.125-11.854z" /></svg>
                        </a>
                    </div>
                </div>

                {/* Links Row - Side by side on mobile */}
                <div className="grid grid-cols-2 gap-8 md:col-span-2">
                    {/* Quick Links */}
                    <div className="text-center md:text-left">
                        <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><Link href="/" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Home</Link></li>
                            <li><Link href="/services" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">All Services</Link></li>
                            <li><Link href="/services/web-design" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Web Design</Link></li>
                            <li><Link href="/services/seo" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">SEO Services</Link></li>
                            <li><Link href="/services/branding" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Branding</Link></li>
                            <li><Link href="/services/clinic-growth-autopilot" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Growth Autopilot</Link></li>
                            <li><Link href="/services/ai-growth-os" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">AI Local Business OS</Link></li>
                            <li><Link href="/pricing" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Pricing</Link></li>
                            <li><Link href="/work" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Our Work</Link></li>
                            <li><Link href="/portfolio" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Ashraf&apos;s Portfolio</Link></li>
                            <li><Link href="/tools" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Free Tools</Link></li>
                            <li><Link href="/blog" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Blog</Link></li>
                            <li><Link href="/about" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">About Us</Link></li>
                            <li><Link href="/contact" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Locations */}
                    <div className="text-center md:text-left">
                        <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Service Areas</h4>
                        <ul className="space-y-2">
                            <li><Link href="/locations/greater-noida" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Greater Noida</Link></li>
                            <li><Link href="/locations/lucknow" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Lucknow</Link></li>
                            <li><Link href="/locations/ayodhya" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Ayodhya</Link></li>
                            <li><Link href="/locations/gonda" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Gonda (HQ)</Link></li>
                            <li><Link href="/locations" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">All Locations</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Contact - Full width on mobile */}
                <div className="text-center md:text-left">
                    <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Get in Touch</h4>
                    <ul className="space-y-3">
                        <li>
                            <a href="tel:+919453878422" className="flex items-center gap-3 text-slate-400 text-sm justify-center md:justify-start hover:text-indigo-400 transition-colors">
                                <MdCall className="text-indigo-400 text-lg" />
                                <span>+91 9453878422</span>
                            </a>
                        </li>
                        <li>
                            <a href="mailto:support@smilefotilo.com" className="flex items-center gap-3 text-slate-400 text-sm justify-center md:justify-start hover:text-indigo-400 transition-colors">
                                <MdEmail className="text-indigo-400 text-lg" />
                                <span className="truncate">support@smilefotilo.com</span>
                            </a>
                        </li>
                        <li className="flex items-center gap-3 text-slate-400 text-sm justify-center md:justify-start">
                            <MdSchedule className="text-indigo-400 text-lg" />
                            <span>Mon - Sat: 9AM - 6PM</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-slate-500 text-sm">© {new Date().getFullYear()} Smile Fotilo. Crafted with passion in India.</p>
                <div className="flex gap-6 text-sm">
                    <Link href="/privacy" className="text-slate-500 hover:text-slate-300 transition-colors">Privacy Policy</Link>
                    <Link href="/terms" className="text-slate-500 hover:text-slate-300 transition-colors">Terms of Service</Link>
                </div>
            </div>
        </div>
    </footer>
));

Footer.displayName = 'Footer';
