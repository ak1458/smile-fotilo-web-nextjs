'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Footer } from './components/Footer';
import { BackToTop } from './components/BackToTop';
import Image from 'next/image';
import { MdCode, MdTrendingUp, MdPhotoCamera, MdSupportAgent, MdMail, MdSchedule, MdArrowOutward, MdArrowForward, MdPublic, MdPayments, MdLocalHospital } from 'react-icons/md';
import dynamic from 'next/dynamic';

const ContactForm = dynamic(() => import('./components/ContactForm').then(mod => mod.ContactForm), { ssr: true });
const Testimonials = dynamic(() => import('./components/Testimonials').then(mod => mod.Testimonials), { ssr: true });
const AILocalBusinessOS = dynamic(() => import('./components/AILocalBusinessOS').then(mod => mod.AILocalBusinessOS), { ssr: true });
const OpenChatButton = dynamic(() => import('./components/OpenChatButton').then(mod => mod.OpenChatButton), { ssr: false });
import Link from 'next/link';

const Hero = () => {
  return (
    <section id="home" className="relative pt-32 pb-12 lg:pt-40 lg:pb-20 overflow-hidden min-h-screen flex items-center animated-bg text-white">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/global-bg-network.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0118] via-[#0a0118]/80 to-[#0a0118]" />
      </div>

      {/* Anti-Gravity Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[128px]"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[128px]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1E293B] border border-white/5 mb-8 shadow-none"
        >
          <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">★ 4.9 · 118 Google reviews · Gonda, UP</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-50 leading-[1.1] mb-6 tracking-tight"
        >
          Websites &amp; Local SEO that <br className="hidden md:block" />
          <span className="text-indigo-300">bring you customers</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 font-light leading-relaxed"
        >
          I&apos;m Ashraf Kamal. I build fast, SEO-ready <span className="text-indigo-400 font-semibold border-b border-indigo-400/30">websites, run local SEO, and set up AI automation</span> for clinics, e-commerce, and local businesses across Gonda, Lucknow &amp; Ayodhya — and for clients worldwide. Founder-led, same-day replies, Hindi &amp; English.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a href="https://wa.me/919453878422?text=Hi%20Smile%20Fotilo%2C%20I%20want%20a%20free%20quote%20for%20my%20website%2FSEO%20project." target="_blank" rel="noopener noreferrer" className="btn-primary px-8 py-4 text-lg min-w-[180px] text-center bg-green-600 hover:bg-green-500 shadow-[0_0_30px_rgba(22,163,74,0.3)] border-green-500">
            <span>Get a Free Quote</span>
          </a>
          <a href="#work" className="btn-secondary px-8 py-4 text-lg min-w-[180px] text-center">
            See Client Results
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-6 text-sm text-slate-400"
        >
          Websites from <span className="font-semibold text-slate-200">₹25,000</span> · Free quote in 24 hours · 100+ projects delivered
        </motion.p>
      </div>
    </section>
  );
};

const Services = () => {
  const services = [
    { icon: <MdCode />, title: 'Web Development', desc: 'Fast, secure, and SEO-optimized websites on WordPress & Custom Stacks.' },
    { icon: <MdTrendingUp />, title: 'Digital Growth', desc: 'Data-driven SEO and Google Ads strategies that bring customers.' },
    { icon: <MdPhotoCamera />, title: 'Content Creation', desc: 'AI-generated images, videos, product photography, and social media content.' },
    { icon: <MdSupportAgent />, title: 'Ongoing Support', desc: 'Direct communication with me for updates, fixes, and growth planning.' },
    { icon: <MdLocalHospital />, title: 'Growth Autopilot', desc: 'Clinic-first missed-call recovery, reminders, review workflows, and bilingual inquiry handling.' }
  ];

  return (
    <section id="services" className="py-20 relative overflow-hidden bg-[#020617] text-white">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-indigo-400 font-bold tracking-wider uppercase text-sm">Our Expertise</span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-50 mt-3">Digital Solutions</h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`h-full p-3 sm:p-8 border border-white/5 bg-[#0F172A]/50 rounded-2xl sm:rounded-3xl hover:border-indigo-500/30 hover:shadow-[0_10px_40px_-10px_rgba(99,102,241,0.2)] transition-all group backdrop-blur-sm flex flex-col ${index === services.length - 1 ? 'col-span-2 lg:col-span-1' : ''}`}
            >
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3 sm:mb-6 group-hover:scale-110 transition-transform text-xl sm:text-3xl">
                {service.icon}
              </div>
              <h3 className="text-sm sm:text-xl font-bold text-slate-50 mb-2 sm:mb-4">{service.title}</h3>
              <p className="text-slate-400 text-[11px] sm:text-sm leading-relaxed line-clamp-4 sm:line-clamp-none">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Pricing = () => {
  const [mode, setMode] = useState<'project' | 'autopilot'>('project');

  const pricingByMode = {
    project: {
      label: 'Project Delivery',
      subtitle: 'Fixed-scope websites. Transparent pricing, no surprises.',
      plans: [
        {
          title: 'Launch',
          price: '₹25,000',
          suffix: '/ project',
          description: 'For local businesses and clinics getting online the right way.',
          points: ['5-page responsive website', 'On-page SEO setup', 'Lead form + WhatsApp CTA', 'Google Business Profile optimization'],
          ctaLabel: 'Start with Launch',
          href: '/pricing',
          featured: false,
        },
        {
          title: 'Growth',
          price: '₹65,000',
          suffix: '/ project',
          description: 'For businesses and small e-commerce that need to convert and scale.',
          points: ['Dynamic pages or online store', 'Conversion-focused UX', 'Performance + analytics', '3 months support'],
          ctaLabel: 'Choose Growth',
          href: '/pricing',
          featured: true,
        },
        {
          title: 'Premium',
          price: '₹1,25,000+',
          suffix: '/ project',
          description: 'For custom builds with integrations, dashboards, and advanced SEO.',
          points: ['Custom architecture', 'Payments / CRM / AI integrations', 'Advanced SEO + roadmap'],
          ctaLabel: 'Discuss Premium',
          prompt: 'I need custom/premium project pricing and delivery scope.',
          featured: false,
        },
      ],
    },
    autopilot: {
      label: 'AI Growth Ops',
      subtitle: 'Monthly automation for followups, reminders, reviews, and support.',
      plans: [
        {
          title: 'Automation Setup',
          price: '₹20,000',
          suffix: '/ one-time',
          description: 'One-time build: workflow mapping, integrations, prompt design, and go-live.',
          points: ['Business discovery', 'Workflow + integration setup', 'Prompt tuning & go-live'],
          ctaLabel: 'Start Setup',
          prompt: 'I want the AI automation setup for my business.',
          featured: false,
        },
        {
          title: 'Growth Autopilot',
          price: '₹12,000',
          suffix: '/ month / location',
          description: 'Managed automation: missed-call recovery, reminders, review responses, and bilingual support — including AI usage and monitoring.',
          points: ['Missed-call recovery', 'Reminder workflows', 'Review response assistant'],
          ctaLabel: 'See Autopilot Plan',
          href: '/services/clinic-growth-autopilot',
          featured: true,
        },
        {
          title: 'Multi-Branch OS',
          price: '₹30,000',
          suffix: '/ month',
          description: 'Scale AI operations across multiple branches with standardized SOPs, KPI tracking, and priority support.',
          points: ['Branch-level reporting', 'Team approval controls', 'Weekly outcome tracking'],
          ctaLabel: 'Open AI OS Service',
          href: '/services/ai-growth-os',
          featured: false,
        },
      ],
    },
  } as const;

  const activeMode = pricingByMode[mode];

  return (
    <section id="pricing" className="py-16 bg-[#020617] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-indigo-400 font-bold tracking-wider uppercase text-sm">Packages</span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-50 mt-3">Simple, Transparent Pricing</h2>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto">{activeMode.subtitle}</p>
        </motion.div>

        <div className="mx-auto mb-10 flex w-full max-w-xl rounded-2xl border border-white/10 bg-[#0F172A]/70 p-2">
          <button
            type="button"
            onClick={() => setMode('project')}
            className={`w-1/2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${mode === 'project'
              ? 'bg-indigo-500 text-white'
              : 'text-slate-300 hover:bg-white/5'
              }`}
          >
            Project Delivery
          </button>
          <button
            type="button"
            onClick={() => setMode('autopilot')}
            className={`w-1/2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${mode === 'autopilot'
              ? 'bg-cyan-500 text-slate-950'
              : 'text-slate-300 hover:bg-white/5'
              }`}
          >
            AI Growth Ops
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {activeMode.plans.map((plan, index) => (
            <motion.div
              key={`${activeMode.label}-${plan.title}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className={`h-full rounded-3xl border p-6 md:p-8 backdrop-blur-sm flex flex-col ${plan.featured
                ? 'border-indigo-500/40 bg-[#0F172A]/80 shadow-[0_0_40px_rgba(99,102,241,0.18)]'
                : 'border-white/10 bg-[#0F172A]/55'
                }`}
            >
              {plan.featured && (
                <div className="mb-4 inline-flex w-fit rounded-full bg-indigo-500 px-3 py-1 text-xs font-bold uppercase">
                  Most Popular
                </div>
              )}
              <div className="text-indigo-300 font-bold uppercase text-xs tracking-widest mb-2">{plan.title}</div>
              <h3 className="text-2xl font-bold text-slate-50 mb-3">
                {plan.price}
                {plan.suffix && <span className="ml-1 text-sm text-slate-400 font-normal">{plan.suffix}</span>}
              </h3>
              <p className="text-sm text-slate-400 mb-5">{plan.description}</p>
              <ul className="space-y-2 mb-6 text-sm text-slate-300">
                {plan.points.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-300 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              {'prompt' in plan ? (
                <OpenChatButton
                  prompt={plan.prompt}
                  className="mt-auto w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-center"
                >
                  <span>{plan.ctaLabel}</span>
                </OpenChatButton>
              ) : (
                <Link
                  href={plan.href}
                  className="mt-auto w-full py-3 rounded-xl border border-white/20 hover:border-indigo-300 hover:bg-white/5 text-white font-semibold text-center transition-colors"
                  prefetch
                >
                  {plan.ctaLabel}
                </Link>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/pricing" className="btn-secondary px-8 py-3 text-center border border-white/20 rounded-xl">
            Compare Full Pricing
          </Link>
          <OpenChatButton
            prompt="Help me choose the right plan based on my business goals and monthly budget."
            className="btn-primary px-8 py-3 text-center"
          >
            <span>Get AI Plan Recommendation</span>
          </OpenChatButton>
        </div>
      </div>
    </section>
  );
};
const Contact = () => {
  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-[#0a0118] text-white">
      {/* Ambient Background Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Text & Info */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Got a vision? <br />
                Let&apos;s make it <span className="text-indigo-300">Real.</span>
              </h2>
                <p className="text-slate-400 text-lg mb-8 leading-relaxed max-w-md">
                I help businesses get online and grow with clean websites and practical digital marketing.
                Tell me about your project, and I&apos;ll get back to you within 24 hours.
              </p>
            </motion.div>

            <div className="space-y-6">
                <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-green-400 flex-shrink-0 text-xl bg-green-900/20 border border-green-500/30">
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157.1zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path></svg>
                </div>
                <div>
                  <div className="text-sm text-slate-500">WhatsApp Us</div>
                  <a href="https://wa.me/919453878422?text=Hi%20Smile%20Fotilo%2C%20I%20have%20an%20inquiry." target="_blank" rel="noopener noreferrer" className="font-medium text-white text-lg hover:text-green-400 transition-colors">
                    +91 94538 78422
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25 }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-violet-400 flex-shrink-0 text-xl">
                  <MdMail />
                </div>
                <div>
                  <div className="text-sm text-slate-500">Email us</div>
                  <a href="mailto:support@smilefotilo.com" className="font-medium text-white text-lg hover:text-indigo-400 transition-colors">
                    support@smilefotilo.com
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-violet-400 text-xl">
                  <MdSchedule />
                </div>

                <div>
                  <div className="text-sm text-slate-500">Response Time</div>
                  <div className="font-medium text-white text-lg">Within 24 Hours</div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Column: Form Component */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Portfolio = () => {
  const projects = [
    {
      title: 'PulseKart',
      href: '/work/pulsekart',
      category: 'Pharma POS System',
      description: 'Enterprise-grade Point of Sale with inventory management, billing, and prescription tracking for pharmacies.',
      image: '/project-pulsekart.png',
      color: 'from-teal-500 to-cyan-500',
      delay: 0,
    },
    {
      title: 'OrderFlow',
      href: '/work/orderflow',
      category: 'Logistics and Tracking',
      description: 'Daily order tracking and collection ecosystem with mobile app and Android tablet dashboard for delivery hubs.',
      image: '/project-orderflow.png',
      color: 'from-blue-500 to-indigo-500',
      delay: 0.1,
    },
    {
      title: 'Creator Agent Toolbox',
      href: 'https://github.com/ak1458/creator-agent-toolbox',
      category: 'GitHub Priority Project',
      description: 'AI-powered content creation toolbox with automated script generation, A/B testing, and competitor analysis.',
      image: '/project-marketing-suite.png',
      color: 'from-violet-500 to-fuchsia-500',
      external: true,
      delay: 0.2,
    },
    {
      title: 'AI Agent Marketplace',
      href: '/marketplace',
      category: 'AI Product Platform',
      description: 'Install-ready AI agent templates for clinics and local businesses with conversion-focused onboarding.',
      image: '/project-oregon-curbside.png',
      color: 'from-cyan-500 to-blue-500',
      delay: 0.3,
    },
  ];

  const renderCard = (project: typeof projects[number], index: number) => {
    const card = (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: project.delay }}
        whileHover={{ y: -10 }}
        className="group relative h-[250px] sm:h-[330px] md:h-[400px] rounded-3xl md:rounded-[2rem] overflow-hidden cursor-pointer border border-white/10"
      >
        <div className="absolute inset-0">
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0118] via-[#0a0118]/60 to-transparent" />
        </div>

        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-gradient-to-r ${project.color} rounded-full blur-[60px] opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />

        <div className="absolute inset-0 p-3 sm:p-6 md:p-8 flex flex-col items-center justify-end text-center z-10">
          <div className="w-full max-w-sm sm:transform sm:translate-y-4 sm:group-hover:translate-y-0 transition-transform duration-500">
            <span className="inline-flex px-2.5 py-1 sm:px-3 sm:py-1 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/90 mb-2 sm:mb-4">
              {project.category}
            </span>
            <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3 line-clamp-1 sm:line-clamp-none">{project.title}</h3>
            <p className="hidden sm:block text-slate-300 text-sm md:text-base leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-2 mx-auto">
              {project.description}
            </p>
          </div>

          <div className="absolute top-3 right-3 sm:top-6 sm:right-6 w-8 h-8 sm:w-11 sm:h-11 rounded-full border border-white/20 flex items-center justify-center bg-white/10 backdrop-blur-md group-hover:bg-white group-hover:text-black transition-all duration-300 transform sm:-rotate-45 sm:group-hover:rotate-0 text-sm sm:text-lg">
            <MdArrowOutward />
          </div>
        </div>
      </motion.div>
    );

    if (project.external) {
      return (
        <a key={`${project.title}-${index}`} href={project.href} target="_blank" rel="noopener noreferrer" className="block h-full">
          {card}
        </a>
      );
    }

    return (
      <Link key={`${project.title}-${index}`} href={project.href} className="block h-full">
        {card}
      </Link>
    );
  };

  return (
    <section id="work" className="py-24 bg-[#0a0118] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Featured <span className="text-indigo-400">Works</span></h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Real projects built for real businesses — each one linked to live code or a verifiable client.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-8">
          {projects.map((project, index) => renderCard(project, index))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Link href="/work" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors border-b border-white/10 hover:border-white pb-1">
            View All Projects <MdArrowForward className="text-sm" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
export default function Home() {
  return (
    <main className="sf-home-page min-h-screen bg-[#020617] font-sans selection:bg-indigo-500 selection:text-white">
      <Hero />
      <Services />
      <AILocalBusinessOS />
      <Portfolio />
      <Testimonials />
      <GlobalReach />
      <FAQ />
      <Pricing />
      <Contact />
      <Footer />
      <BackToTop />
    </main>
  );
};

const FAQ = () => {
  const faqs = [
    {
      question: "What services does Smile Fotilo offer?",
      answer: "I offer Web Development (WordPress and custom React/Next.js), Digital Marketing (SEO, social media, Amazon/Flipkart ads), AI-generated content and creatives, and e-commerce management."
    },
    {
      question: "How much does a website cost?",
      answer: "Our website packages start from INR 15,999. We offer Starter (INR 15k) for small businesses, Growth (INR 35k+) for expanding brands, and custom enterprise scopes."
    },
    {
      question: "How long does it take to build a website?",
      answer: "Typical websites take 2-4 weeks from concept to launch. Complex projects with custom features may take 4-8 weeks. We provide detailed timelines during your strategy call."
    },
    {
      question: "Do you work with international clients?",
      answer: "Yes! I work with clients internationally. I’ve built projects for businesses in the USA and serve clients across India. I handle timezone differences and communicate in English and Hindi."
    },
    {
      question: "What support do you provide after launch?",
      answer: "I provide responsive support during business hours (Mon-Sat, 9AM-6PM IST) including website maintenance, security updates, performance optimization, and ongoing SEO improvements. Urgent issues are handled same-day."
    },
    {
      question: "Do you offer AI automation services for local businesses?",
      answer: "Yes. Our flagship Growth Autopilot is clinic-first and helps automate followups, reminders, reviews, and patient inquiry workflows."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-[#0a0118] relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-violet-400 font-bold tracking-wider uppercase text-sm">Got Questions?</span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-50 mt-3">Frequently Asked Questions</h2>
        </motion.div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 border border-white/5 bg-[#0F172A]/50 rounded-2xl backdrop-blur-sm"
            >
              <h3 className="text-lg md:text-xl font-bold text-slate-50 mb-3">{faq.question}</h3>
              <p className="text-slate-400 leading-relaxed">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const GlobalReach = () => {
  return (
    <section className="py-24 bg-[#020617] relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="p-8 md:p-12 rounded-3xl border border-white/5 bg-[#0F172A]/30 backdrop-blur-md relative overflow-hidden">

          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                  Global Delivery
                </div>

                <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                  Built in India. <br />
                  <span className="text-indigo-300">
                    Deployed Worldwide.
                  </span>
                </h2>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg text-slate-400 leading-relaxed"
              >
                We don&apos;t just build websites; we help businesses get online and grow.
                Currently serving clients in <span className="text-slate-200 font-semibold underline underline-offset-4">India</span> and <span className="text-slate-200 font-semibold">the USA</span> with the same dedication from our base in Gonda.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Link href="/locations/global" className="inline-flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105 shadow-[0_0_20px_rgba(37,99,235,0.3)]" prefetch>
                  Explore International Services
                  <MdArrowForward />
                </Link>
              </motion.div>
            </div>

            <div className="md:w-1/2 w-full">
              <div className="grid grid-cols-2 gap-4">
                {/* Card 1: USA */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-2xl bg-[#020617]/50 border border-white/5 hover:border-blue-500/30 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-400 mb-4 text-xl">
                    <MdPublic />
                  </div>
                  <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Website Project</div>
                  <div className="text-xl font-bold text-slate-200">Texas, USA</div>
                </motion.div>

                {/* Card 2: Mexico */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-2xl bg-[#020617]/50 border border-white/5 hover:border-indigo-500/30 transition-all mt-8"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-900/30 flex items-center justify-center text-indigo-400 mb-4 text-xl">
                    <MdPayments />
                  </div>
                  <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Digital Marketing</div>
                  <div className="text-xl font-bold text-slate-200">India</div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

