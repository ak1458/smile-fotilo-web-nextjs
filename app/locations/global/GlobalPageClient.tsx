/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Footer } from '../../components/Footer';
import { ConnectModal } from '../../components/ConnectModal';
import { OtherLocations } from '../../components/OtherLocations';
import { MdLocationOn, MdArrowForward, MdVisibility, MdCall, MdLanguage, MdAdsClick, MdDns, MdShoppingCart, MdSupportAgent, MdUpdate, MdCheckCircle, MdChat } from 'react-icons/md';

const projectColorClasses = {
    blue: {
        cardHover: 'hover:border-blue-500/30',
        imageGradient: 'from-blue-900/40 to-slate-900',
        locationBadge: 'bg-blue-500/20 border-blue-500/30 text-blue-200',
        serviceTag: 'bg-blue-500/10 border-blue-500/20 text-blue-300',
        actionButton: 'from-blue-600 to-blue-700',
    },
    emerald: {
        cardHover: 'hover:border-emerald-500/30',
        imageGradient: 'from-emerald-900/40 to-slate-900',
        locationBadge: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-200',
        serviceTag: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
        actionButton: 'from-emerald-600 to-emerald-700',
    },
} as const;

const serviceColorClasses = {
    blue: {
        iconBox: 'bg-blue-500/10',
        iconText: 'text-blue-400',
    },
    violet: {
        iconBox: 'bg-violet-500/10',
        iconText: 'text-violet-400',
    },
    emerald: {
        iconBox: 'bg-emerald-500/10',
        iconText: 'text-emerald-400',
    },
    orange: {
        iconBox: 'bg-orange-500/10',
        iconText: 'text-orange-400',
    },
    cyan: {
        iconBox: 'bg-cyan-500/10',
        iconText: 'text-cyan-400',
    },
    pink: {
        iconBox: 'bg-pink-500/10',
        iconText: 'text-pink-400',
    },
} as const;

// Real project data
const globalProjects = [
    {
        id: 'oregon-curbside',
        title: 'Oregon Curbside Services',
        location: 'Oregon, USA',
        category: 'Full-Stack Website',
        description: 'A fully functional website for Oregon residents to call and schedule curbside pickup services. Features real-time scheduling, service tracking, and instant call-to-action functionality.',
        services: ['Website Development', 'Call Integration', 'Booking System', 'Mobile Responsive'],
        color: 'blue',
        icon: 'local_shipping',
        image: '/project-oregon-curbside.png'
    },
    {
        id: 'digital-marketing-suite',
        title: 'Complete Digital Marketing Suite',
        location: 'Texas & Mexico',
        category: 'Digital Marketing Services',
        description: 'Comprehensive digital marketing services including Meta Ads, Google Ads management, hosting setup with SSH access, e-commerce website management, and daily content updates.',
        services: ['Meta Ads', 'Google Ads', 'Hosting & SSH Setup', 'E-commerce Management', 'Daily Updates'],
        color: 'emerald',
        icon: 'campaign',
        image: '/project-marketing-suite.png'
    }
];

export default function GlobalPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);

    const handleProjectInquiry = (projectId: string) => {
        setSelectedProject(projectId);
        setIsModalOpen(true);
    };

    return (
        <main className="min-h-screen relative text-slate-200 selection:bg-blue-500/30">
            <ConnectModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setSelectedProject(null); }}
                context={selectedProject ? `Global Project: ${globalProjects.find(p => p.id === selectedProject)?.title}` : "Global Page"}
            />

            {/* Global Animated Background */}
            <div className="fixed inset-0 z-[-2] animated-bg"></div>

            {/* Global Network Background Image */}
            <div className="fixed inset-0 z-[-1] opacity-30 pointer-events-none" style={{
                backgroundImage: `url('/global-bg-network.webp')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                maskImage: 'linear-gradient(to bottom, black 20%, transparent 90%)'
            }}></div>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden min-h-[85vh] flex items-center">

                {/* Blue Glow */}
                <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-blue-500/20 mb-8 backdrop-blur-md">
                            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_blue]"></span>
                            <span className="text-xs font-bold uppercase tracking-widest text-blue-200">US &amp; International Clients</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-8 tracking-tight">
                            Web development for <span className="text-blue-400">US businesses</span> <br />
                            <span className="text-indigo-300">without the big-agency price</span>.
                        </h1>

                        <p className="text-xl text-slate-300 mb-10 font-light leading-relaxed">
                            Custom websites, e-commerce, and SEO for US companies. I&apos;ve shipped real work for clients in <strong className="text-blue-200 font-medium">Oregon and Texas</strong> — React, Next.js, Shopify &amp; WordPress.
                            <span className="text-slate-400 block mt-2">Founder-led, fast delivery, US-friendly hours. Built from my studio in Gonda, India.</span>
                        </p>

                        <div className="flex flex-wrap justify-center gap-5">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="btn-primary flex items-center gap-2 group bg-blue-600 hover:bg-blue-500 shadow-blue-500/20"
                            >
                                <span>Discuss Your Project</span>
                                <MdArrowForward className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <Link
                                href="/work"
                                className="btn-secondary flex items-center gap-2 group"
                            >
                                <span>View Our Work</span>
                                <MdVisibility className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Global Projects Section */}
            <section className="py-20 relative" id="projects">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Global Projects</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">Real solutions delivered to international clients. Click to learn more or start your project.</p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {globalProjects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                viewport={{ once: true }}
                                className="group"
                            >
                                <div
                                    className={`glass-card p-0 overflow-hidden transition-all duration-500 ${projectColorClasses[project.color as keyof typeof projectColorClasses].cardHover}`}
                                >
                                    {/* Project Header with Image */}
                                    <div
                                        className={`aspect-[16/9] bg-gradient-to-br relative overflow-hidden ${projectColorClasses[project.color as keyof typeof projectColorClasses].imageGradient}`}
                                    >
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>

                                        {/* Location Badge */}
                                        <div className="absolute top-4 left-4 z-20">
                                            <span
                                                className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-2 backdrop-blur-sm border ${projectColorClasses[project.color as keyof typeof projectColorClasses].locationBadge}`}
                                            >
                                                <MdLocationOn className="text-sm" />
                                                {project.location}
                                            </span>
                                        </div>

                                        {/* Category Badge */}
                                        <div className="absolute top-4 right-4 z-20">
                                            <span className="text-xs font-medium bg-black/50 text-white px-3 py-1 rounded-full backdrop-blur-sm">
                                                {project.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Project Content */}
                                    <div className="p-6">
                                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all">
                                            {project.title}
                                        </h3>
                                        <p className="text-slate-400 leading-relaxed mb-6">
                                            {project.description}
                                        </p>

                                        {/* Services Tags */}
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {project.services.map((service) => (
                                                <span
                                                    key={service}
                                                    className={`text-xs px-3 py-1 rounded-full border ${projectColorClasses[project.color as keyof typeof projectColorClasses].serviceTag}`}
                                                >
                                                    {service}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleProjectInquiry(project.id)}
                                                className={`flex-1 px-5 py-3 rounded-xl bg-gradient-to-r text-white font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 group/btn ${projectColorClasses[project.color as keyof typeof projectColorClasses].actionButton}`}
                                            >
                                                <span>Get Similar Project</span>
                                                <MdArrowForward className="text-lg group-hover/btn:translate-x-1 transition-transform" />
                                            </button>
                                            <a
                                                href="tel:+919453878422"
                                                className="px-5 py-3 rounded-xl border border-white/10 text-white font-medium text-sm hover:bg-white/5 transition-all flex items-center gap-2"
                                            >
                                                <MdCall />
                                                Call Now
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Offered Globally */}
            <section className="py-20 relative bg-blue-900/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-blue-400 font-bold tracking-widest uppercase text-sm mb-4 block">What We Offer</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Global Services</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">Quality web services delivered worldwide from our base in India.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { icon: 'language', title: 'Website Development', desc: 'Full-stack websites, e-commerce, booking systems', color: 'blue' },
                            { icon: 'ads_click', title: 'Digital Advertising', desc: 'Meta Ads, Google Ads, campaign management', color: 'violet' },
                            { icon: 'dns', title: 'Hosting & SSH Setup', desc: 'Server configuration, SSL, domain management', color: 'emerald' },
                            { icon: 'shopping_cart', title: 'E-commerce Management', desc: 'Product updates, inventory, daily maintenance', color: 'orange' },
                            { icon: 'support_agent', title: '24/7 Support', desc: 'Round-the-clock assistance for global clients', color: 'cyan' },
                            { icon: 'update', title: 'Daily Updates', desc: 'Content updates, SEO optimization, monitoring', color: 'pink' },
                        ].map((service, index) => (
                            <motion.div
                                key={service.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="glass-card p-6 group hover:border-blue-500/20 transition-colors"
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${serviceColorClasses[service.color as keyof typeof serviceColorClasses].iconBox}`}>
                                    <span className={`text-2xl ${serviceColorClasses[service.color as keyof typeof serviceColorClasses].iconText}`}>
                                        {service.icon === 'language' ? <MdLanguage /> :
                                            service.icon === 'ads_click' ? <MdAdsClick /> :
                                                service.icon === 'dns' ? <MdDns /> :
                                                    service.icon === 'shopping_cart' ? <MdShoppingCart /> :
                                                        service.icon === 'support_agent' ? <MdSupportAgent /> : <MdUpdate />}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{service.title}</h3>
                                <p className="text-slate-400 text-sm">{service.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold hover:opacity-90 transition-all inline-flex items-center gap-2"
                        >
                            <span>Discuss Your Requirements</span>
                            <MdArrowForward />
                        </button>
                    </div>
                </div>
            </section>

            {/* The "Delivery Center" Connection */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/5 to-transparent"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-blue-400 font-bold tracking-widest uppercase text-sm mb-4 block">Our Origin</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Powered by Gonda (HQ)</h2>
                            <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                                While we operate globally, our heart beats in Gonda. Our Headquarters serves as the central command for development, ensuring 24/7 delivery cycles for our Western clients.
                            </p>
                            <Link
                                href="/locations/gonda"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-blue-500/30 text-blue-200 hover:bg-blue-500/10 transition-colors"
                            >
                                <span>Explore the HQ</span>
                                <MdArrowForward />
                            </Link>
                        </div>

                        <div className="glass-card p-8 group hover:border-blue-500/30 transition-colors">
                            <div className="flex gap-4 mb-6">
                                <div className="flex-1 text-center p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                                    <h3 className="text-2xl font-bold text-blue-400 mb-1">24/7</h3>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider">Delivery</p>
                                </div>
                                <div className="flex-1 text-center p-4 rounded-xl bg-violet-500/5 border border-violet-500/10">
                                    <h3 className="text-2xl font-bold text-violet-400 mb-1">Global</h3>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider">Reach</p>
                                </div>
                            </div>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-slate-300">
                                    <MdCheckCircle className="text-blue-400" />
                                    <span>Quality web solutions</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-300">
                                    <MdCheckCircle className="text-blue-400" />
                                    <span>Cost-effective development</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-300">
                                    <MdCheckCircle className="text-blue-400" />
                                    <span>Time-zone optimized support</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Contact CTA */}
            <section className="py-20 relative overflow-hidden flex items-center justify-center bg-gradient-to-b from-blue-900/10 to-violet-900/10">
                <div className="relative z-10 text-center max-w-2xl px-4">
                    <h2 className="text-3xl font-bold text-white mb-6">
                        Ready to Go Global?
                    </h2>
                    <p className="text-slate-400 mb-8">
                        Partner with us for modern, results-focused digital solutions delivered with Indian efficiency.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold hover:opacity-90 transition-all"
                        >
                            Start Your Project
                        </button>
                        <a
                            href="https://wa.me/919453878422?text=Hi,%20I%20am%20interested%20in%20your%20global%20services."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-3 rounded-full border border-[#25D366]/50 text-[#25D366] font-bold hover:bg-[#25D366]/10 transition-all flex items-center gap-2"
                        >
                            <MdChat />
                            WhatsApp Us
                        </a>
                        <a
                            href="tel:+919453878422"
                            className="px-8 py-3 rounded-full border border-orange-500/50 text-orange-400 font-bold hover:bg-orange-500/10 transition-all flex items-center gap-2"
                        >
                            <MdCall />
                            Call Now
                        </a>
                    </div>
                </div>
            </section>

            <OtherLocations currentLocation="global" />
            <Footer />
        </main>
    );
}
