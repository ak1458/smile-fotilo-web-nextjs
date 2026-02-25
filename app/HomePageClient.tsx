'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Footer } from './components/Footer';
import { BackToTop } from './components/BackToTop';
import Image from 'next/image';
import { MdCode, MdTrendingUp, MdPhotoCamera, MdSupportAgent, MdMail, MdSchedule, MdArrowOutward, MdArrowForward, MdPublic, MdPayments, MdLocalHospital } from 'react-icons/md';

import { ContactForm } from './components/ContactForm';
import { Testimonials } from './components/Testimonials';
import { AILocalBusinessOS } from './components/AILocalBusinessOS';
import { OpenChatButton } from './components/OpenChatButton';
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
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">🚀 Ready to Build Your Empire?</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-50 leading-[1.1] mb-6 tracking-tight"
        >
          Be Your Own Boss <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-400 to-purple-400">Powered by AI</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 font-light leading-relaxed"
        >
          Stop surviving. Start thriving. <br />
          We build <span className="text-indigo-400 font-semibold border-b border-indigo-400/30">digital empires</span> that print money while you sleep.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a href="#work" className="btn-primary px-8 py-4 text-lg min-w-[180px] text-center">
            <span>View Our Work</span>
          </a>
          <a href="tel:+919453878422" className="btn-secondary px-8 py-4 text-lg min-w-[180px] text-center">
            Book Strategy Call
          </a>
        </motion.div>
      </div>
    </section>
  );
};

const Services = () => {
  const services = [
    { icon: <MdCode />, title: 'Web Development', desc: 'Fast, secure, and SEO-optimized websites on WordPress & Custom Stacks.' },
    { icon: <MdTrendingUp />, title: 'Digital Growth', desc: 'Data-driven SEO and Google Ads strategies that bring customers.' },
    { icon: <MdPhotoCamera />, title: 'Creative Studio', desc: 'High-end product photography and brand identity design.' },
    { icon: <MdSupportAgent />, title: '24/7 Support', desc: 'Dedicated support team to help you grow your business.' },
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
      subtitle: 'One-time execution for websites and product builds.',
      plans: [
        {
          title: 'Starter',
          price: 'INR 15k',
          suffix: '/ project',
          description: 'For clinics and local businesses that need a premium online presence.',
          points: ['Responsive website', 'Core SEO setup', 'Lead-ready contact flow'],
          ctaLabel: 'Get Starter',
          href: '/pricing',
          featured: false,
        },
        {
          title: 'Growth',
          price: 'INR 35k+',
          suffix: '/ project',
          description: 'For brands that need dynamic pages, conversion UX, and scale-ready architecture.',
          points: ['Dynamic content blocks', 'Performance optimization', 'Analytics and tracking'],
          ctaLabel: 'Choose Growth',
          href: '/pricing',
          featured: true,
        },
        {
          title: 'Enterprise',
          price: 'Custom Scope',
          suffix: '',
          description: 'Complex system design, multi-role dashboards, and advanced integrations.',
          points: ['Architecture planning', 'Custom workflows', 'Delivery roadmap'],
          ctaLabel: 'Discuss Enterprise',
          prompt: 'I need enterprise project pricing and delivery scope.',
          featured: false,
        },
      ],
    },
    autopilot: {
      label: 'AI Growth Ops',
      subtitle: 'Monthly automation for followups, reminders, reviews, and support.',
      plans: [
        {
          title: 'Pilot Setup',
          price: 'INR 7,999',
          suffix: '/ one-time',
          description: 'Clinic-first setup with workflow mapping and automation configuration.',
          points: ['Business discovery', 'Prompt and workflow setup', 'Go-live checklist'],
          ctaLabel: 'Start Pilot',
          prompt: 'Start Growth Autopilot pilot setup for my business.',
          featured: false,
        },
        {
          title: 'Growth Autopilot',
          price: 'INR 3,999+',
          suffix: '/ month / location',
          description: 'Automates missed-call recovery, reminders, review responses, and bilingual support.',
          points: ['Missed-call recovery', 'Reminder workflows', 'Review response assistant'],
          ctaLabel: 'See Autopilot Plan',
          href: '/services/clinic-growth-autopilot',
          featured: true,
        },
        {
          title: 'Multi-Branch OS',
          price: 'INR 9,999+',
          suffix: '/ month',
          description: 'Scale AI operations across multiple branches with standardized SOPs and KPI tracking.',
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
          <h2 className="text-3xl md:text-5xl font-bold text-slate-50 mt-3">Dynamic Pricing</h2>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto">{activeMode.subtitle}</p>
        </motion.div>

        <div className="mx-auto mb-10 flex w-full max-w-xl rounded-2xl border border-white/10 bg-[#0F172A]/70 p-2">
          <button
            type="button"
            onClick={() => setMode('project')}
            className={`w-1/2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
              mode === 'project'
                ? 'bg-indigo-500 text-white'
                : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            Project Delivery
          </button>
          <button
            type="button"
            onClick={() => setMode('autopilot')}
            className={`w-1/2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
              mode === 'autopilot'
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
              className={`h-full rounded-3xl border p-6 md:p-8 backdrop-blur-sm flex flex-col ${
                plan.featured
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
                Let&apos;s make it <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Real.</span>
              </h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed max-w-md">
                We help ambitious brands scale with design-driven digital solutions.
                Tell us about your project, and we&apos;ll get back to you within 24 hours.
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
                <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-violet-400 flex-shrink-0 text-xl">
                  <MdMail />
                </div>
                <div>
                  <div className="text-sm text-slate-500">Email us</div>
                  <a href="mailto:ashrafkamal1458@gmail.com" className="font-medium text-white text-lg hover:text-indigo-400 transition-colors">
                    ashrafkamal1458@gmail.com
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
            loading={index < 2 ? 'eager' : 'lazy'}
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
            Product-first builds focused on real automation outcomes, scalable architecture, and clean user experience.
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
    <main className="min-h-screen font-sans selection:bg-indigo-500 selection:text-white bg-[#020617]">
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
      answer: "We offer Web Design & Development, Digital Marketing & SEO, Brand Identity Design, and Product Photography services tailored for global brands."
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
      answer: "Yes! We proudly serve enterprise clients in Texas (USA), Mexico, and across India. We handle timezone differences and work in English and Hindi."
    },
    {
      question: "What support do you provide after launch?",
      answer: "We provide 24/7 dedicated support including website maintenance, security updates, performance optimization, and ongoing SEO improvements."
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
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
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
                We don&apos;t just build websites; we engineer digital platforms for the global market.
                Proudly serving enterprise clients in <span className="text-slate-200 font-semibold underline underline-offset-4">Texas (USA)</span> and <span className="text-slate-200 font-semibold">Mexico</span> with the same dedication we bring to Gonda.
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
                  <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Logistics AI</div>
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
                  <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Fintech App</div>
                  <div className="text-xl font-bold text-slate-200">Mexico City</div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

