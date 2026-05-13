/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaReact, FaNodeJs, FaAws, FaWordpress, FaPhp, FaStripe, FaCloudflare, FaCode } from 'react-icons/fa';
import { SiPostgresql, SiRedis, SiWoocommerce, SiMysql, SiMongodb, SiSocketdotio, SiGooglemaps, SiNextdotjs, SiTypescript, SiTailwindcss, SiVercel } from 'react-icons/si';
import { TbPalette } from 'react-icons/tb';
import { MdArrowBack, MdCheckCircle } from 'react-icons/md';

const getTechIcon = (tech: string) => {
    const normalized = tech.toLowerCase().replace(/\s+/g, '');
    if (normalized.includes('react')) return FaReact;
    if (normalized.includes('node')) return FaNodeJs;
    if (normalized.includes('postgres')) return SiPostgresql;
    if (normalized.includes('redis')) return SiRedis;
    if (normalized.includes('aws')) return FaAws;
    if (normalized.includes('wordpress')) return FaWordpress;
    if (normalized.includes('woo')) return SiWoocommerce;
    if (normalized.includes('php')) return FaPhp;
    if (normalized.includes('mysql')) return SiMysql;
    if (normalized.includes('mongo')) return SiMongodb;
    if (normalized.includes('socket')) return SiSocketdotio;
    if (normalized.includes('google')) return SiGooglemaps;
    if (normalized.includes('next')) return SiNextdotjs;
    if (normalized.includes('type')) return SiTypescript;
    if (normalized.includes('tailwind')) return SiTailwindcss;
    if (normalized.includes('vercel')) return SiVercel;
    if (normalized.includes('stripe')) return FaStripe;
    if (normalized.includes('cloud')) return FaCloudflare;
    if (normalized.includes('theme')) return TbPalette;
    return FaCode;
};

// Project data
const projectsData: Record<string, {
    title: string;
    category: string;
    description: string;
    fullDescription: string;
    image: string;
    features: string[];
    technologies: string[];
    color: string;
}> = {
    'pulsekart': {
        title: 'PulseKart',
        category: 'Pharma POS System',
        description: 'Enterprise-grade Point of Sale with inventory management, billing, and prescription tracking for pharmacies.',
        fullDescription: 'PulseKart is a comprehensive Point of Sale solution designed specifically for pharmacies and healthcare retail. It features real-time inventory tracking, automated reordering, prescription management, and integration with major payment gateways. The system is built for high scalability and can handle multiple store locations from a single dashboard.',
        image: '/project-pulsekart.png',
        features: ['Real-time Inventory Tracking', 'Prescription Management', 'Multi-store Support', 'Payment Gateway Integration', 'Automated Reordering', 'GST Compliant Billing'],
        technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Vercel'],
        color: 'from-teal-500 to-cyan-500'
    },
    'kapda-factory': {
        title: 'Kapda Factory',
        category: 'E-Commerce & ERP',
        description: 'End-to-end textile e-commerce with custom stitching services and manufacturing tracking.',
        fullDescription: 'Kapda Factory is a complete WordPress e-commerce solution for a men\'s fashion brand offering ready-made clothing and custom stitching services. The platform includes order management, payment tracking, delivery status updates, and a dedicated mobile app for real-time logistics monitoring.',
        image: '/project-kapdafactory.png',
        features: ['WordPress E-Commerce', 'Custom Stitching Orders', 'Payment Tracking', 'Delivery Management', 'Mobile App Integration', 'Order Analytics'],
        technologies: ['WordPress', 'WooCommerce', 'PHP', 'MySQL', 'React Native'],
        color: 'from-amber-500 to-orange-500'
    },
    'orderflow': {
        title: 'OrderFlow',
        category: 'Logistics & Tracking',
        description: 'Daily order tracking and collection ecosystem with mobile app and Android tablet dashboard.',
        fullDescription: 'OrderFlow is a comprehensive logistics solution that enables real-time tracking of daily orders and collections. It features a dedicated Android tablet dashboard for delivery hubs and a mobile app for delivery personnel. The system provides live route optimization, delivery confirmations, and payment collection tracking.',
        image: '/project-orderflow.png',
        features: ['Real-time GPS Tracking', 'Route Optimization', 'Delivery Confirmations', 'Payment Collection', 'Hub Dashboard', 'Driver Mobile App'],
        technologies: ['React Native', 'Node.js', 'MongoDB', 'Socket.io', 'Google Maps API'],
        color: 'from-blue-500 to-indigo-500'
    },
    'curbit': {
        title: 'Curbit',
        category: 'Smart City Solution',
        description: 'Website for a US-based company providing curb-related services.',
        fullDescription: 'Curbit is a professional corporate website for a US-based company specializing in smart city curb management solutions. The website showcases their services, provides a booking system, and includes a customer portal. Built with a clean, professional design that reflects the company\'s image.',
        image: '/project-curbit.png',
        features: ['Service Booking System', 'Customer Portal', 'SEO Optimized', 'Mobile Responsive', 'Contact Management', 'Analytics Dashboard'],
        technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel'],
        color: 'from-indigo-500 to-violet-500'
    },
    'veloria-vault': {
        title: 'Veloria Vault',
        category: 'Luxury E-Commerce',
        description: 'Complete WordPress website for a women\'s luxury fashion brand selling premium handbags.',
        fullDescription: 'Veloria Vault is a high-end WordPress e-commerce store for a premium women\'s fashion brand specializing in luxury leather handbags. The website features immersive product storytelling, high-quality imagery, and a seamless checkout experience. Every element is designed to reflect the luxury and exclusivity of the brand.',
        image: '/project-veloriavault.png',
        features: ['Luxury UI/UX Design', 'High-Quality Product Gallery', 'Secure Checkout', 'Wishlist Feature', 'Size Guide', 'Express Shipping Options'],
        technologies: ['WordPress', 'WooCommerce', 'Custom Theme', 'Stripe', 'Cloudflare'],
        color: 'from-rose-500 to-pink-500'
    },
    'storybook-weddings': {
        title: 'StoryBook Weddings',
        category: 'Wedding Photography',
        description: 'Professional website for Lucknow\'s premier wedding photography studio.',
        fullDescription: 'StoryBook Weddings is a beautiful portfolio website for a top wedding photography studio in Lucknow. The website showcases their work across engagement shoots, haldi ceremonies, pre-wedding sessions, and full wedding day coverage. Features a stunning gallery, easy-to-use contact forms, and optimized for mobile viewing.',
        image: '/project-storybook-weddings.png',
        features: ['Responsive Photo Gallery', 'Service Categories', 'Contact Forms', 'Mobile Optimized', 'Fast Loading', 'SEO Optimized'],
        technologies: ['WordPress', 'Custom Theme', 'Lightbox Gallery', 'Contact Form 7'],
        color: 'from-amber-500 to-rose-500'
    }
};

export function ProjectDetailClient({ slug }: { slug: string }) {
    const project = projectsData[slug];

    if (!project) {
        return (
            <main className="min-h-screen bg-[#0a0118] text-white pt-24 pb-20 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
                    <Link href="/work" className="text-indigo-400 hover:underline">Back to All Projects</Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#0a0118] text-white pt-24 pb-20">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className={`absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-to-r ${project.color} opacity-5 rounded-full blur-[150px]`} />
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Back Button */}
                <Link href="/work" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8">
                    <MdArrowBack /> Back to All Projects
                </Link>

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid lg:grid-cols-2 gap-12 items-center mb-20"
                >
                    <div>
                        <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r ${project.color} text-white mb-6`}>
                            {project.category}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">{project.title}</h1>
                        <p className="text-slate-400 text-lg leading-relaxed mb-8">
                            {project.fullDescription}
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link href="/#contact" className="btn-primary px-6 py-3">
                                <span>Get Similar Project</span>
                            </Link>
                            <a href="#features" className="btn-secondary px-6 py-3">
                                View Features
                            </a>
                        </div>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-r ${project.color} rounded-3xl blur-2xl opacity-20`} />
                        <img
                            src={project.image}
                            alt={project.title}
                            className="relative rounded-3xl shadow-2xl border border-white/10"
                        />
                    </motion.div>
                </motion.div>

                {/* Features Section */}
                <section id="features" className="mb-20">
                    <h2 className="text-3xl font-bold mb-8">Key Features</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {project.features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                            >
                                <MdCheckCircle className="text-2xl text-indigo-400 mb-3 block" />
                                <p className="font-medium">{feature}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Technologies */}
                <section className="mb-20">
                    <h2 className="text-3xl font-bold mb-8">Technologies Used</h2>
                    <div className="flex flex-wrap gap-6">
                        {project.technologies.map((tech, index) => {
                            const Icon = getTechIcon(tech);
                            return (
                                <div key={index} className="flex flex-col items-center gap-2 group">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 group-hover:border-indigo-500/50 group-hover:bg-indigo-500/10 flex items-center justify-center transition-all duration-300">
                                        <Icon className="text-3xl text-slate-400 group-hover:text-indigo-400 transition-colors" />
                                    </div>
                                    <span className="text-sm font-medium text-slate-400 group-hover:text-white transition-colors">{tech}</span>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="glass-card p-12 text-center">
                    <h2 className="text-3xl font-bold mb-4">Want a Similar Project?</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto mb-8">
                        We can build a custom solution tailored to your business needs. Contact us for a free consultation and quote.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/#contact" className="btn-primary px-8 py-4 text-lg">
                            <span>Contact Us</span>
                        </Link>
                        <Link href="/pricing" className="btn-secondary px-8 py-4 text-lg">
                            View Pricing
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}
