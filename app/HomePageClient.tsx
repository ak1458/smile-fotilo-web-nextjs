'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Footer } from './components/Footer';
import { BackToTop } from './components/BackToTop';
import { ContactForm } from './components/ContactForm';
import { Testimonials } from './components/Testimonials';
import Link from 'next/link';

const Hero = () => {
  return (
    <section id="home" className="relative pt-32 pb-12 lg:pt-40 lg:pb-20 overflow-hidden min-h-screen flex items-center animated-bg text-white">
      {/* Anti-Gravity Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[128px]"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[128px]"
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
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Accepting Projects {new Date().getFullYear()}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-50 leading-[1.1] mb-6 tracking-tight"
        >
          We Build World-Class Digital Experiences for <br className="hidden md:block" />
          Global Brands
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 font-light leading-relaxed"
        >
          Web Design. SEO. Strategic Branding. <br />
          The agency behind <span className="text-indigo-400 font-semibold border-b border-indigo-400/30">successful digital brands</span>.
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
          <a href="#contact" className="btn-secondary px-8 py-4 text-lg min-w-[180px] text-center">
            Book Strategy Call
          </a>
        </motion.div>
      </div>
    </section>
  );
};

const Services = () => {
  const services = [
    { icon: 'code', title: 'Web Development', desc: 'Fast, secure, and SEO-optimized websites on WordPress & Custom Stacks.' },
    { icon: 'trending_up', title: 'Digital Growth', desc: 'Data-driven SEO and Google Ads strategies that bring customers.' },
    { icon: 'photo_camera', title: 'Creative Studio', desc: 'High-end product photography and brand identity design.' },
    { icon: 'support_agent', title: '24/7 Support', desc: 'Dedicated support team to help you grow your business.' }
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="p-4 sm:p-8 border border-white/5 bg-[#0F172A]/50 rounded-3xl hover:border-indigo-500/30 hover:shadow-[0_10px_40px_-10px_rgba(99,102,241,0.2)] transition-all group backdrop-blur-sm"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-rounded text-3xl">{service.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-50 mb-4">{service.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Pricing = () => {
  return (
    <section id="pricing" className="py-12 bg-[#020617] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-indigo-400 font-bold tracking-wider uppercase text-sm">Packages</span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-50 mt-3">Simple Pricing</h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 border border-white/5 bg-[#0F172A]/50 rounded-3xl backdrop-blur-sm group"
          >
            <div className="text-indigo-400 font-bold uppercase text-xs mb-2">The Starter</div>
            <h3 className="text-2xl font-bold text-slate-50 mb-4">₹15k <span className="text-sm text-slate-400 font-normal">/ project</span></h3>
            <p className="text-sm text-slate-400 mb-8">For doctors, clinics, or small shops needing a professional face.</p>
            <Link href="/pricing" className="btn-secondary block w-full py-3 text-center">Get Started</Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="p-8 border border-indigo-500/50 bg-[#0F172A]/80 rounded-3xl backdrop-blur-sm relative transform md:-translate-y-4 shadow-[0_0_40px_rgba(99,102,241,0.2)]"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase shadow-lg">Popular</div>
            <div className="text-indigo-400 font-bold uppercase text-xs mb-2">The Growth</div>
            <h3 className="text-2xl font-bold text-slate-50 mb-4">₹35k <span className="text-sm text-slate-400 font-normal">/ starting</span></h3>
            <p className="text-sm text-slate-400 mb-8">For retail brands ready to sell online. Dynamic content management.</p>
            <Link href="/pricing" className="btn-primary block w-full py-3 text-center">Choose Growth</Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-8 border border-white/5 bg-[#0F172A]/50 rounded-3xl backdrop-blur-sm group hover:border-emerald-500/30"
          >
            <div className="text-emerald-400 font-bold uppercase text-xs mb-2">The Domination</div>
            <h3 className="text-2xl font-bold text-slate-50 mb-4">Custom</h3>
            <p className="text-sm text-slate-400 mb-8">Full stack solution. From product photography to running ads.</p>
            <a href="#contact" className="btn-secondary block w-full py-3 text-center">Contact Sales</a>
          </motion.div>
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
                <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-violet-400 flex-shrink-0">
                  <span className="material-symbols-rounded">mail</span>
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
                <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-violet-400">
                  <span className="material-symbols-rounded">schedule</span>
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
      title: "PulseKart",
      slug: "pulsekart",
      category: "Pharma POS System",
      description: "Enterprise-grade Point of Sale with inventory management, billing, and prescription tracking for pharmacies.",
      image: "/project-pulsekart.png",
      color: "from-teal-500 to-cyan-500",
      delay: 0
    },
    {
      title: "Kapda Factory",
      slug: "kapda-factory",
      category: "Manufacturing ERP",
      description: "End-to-end textile manufacturing solution with order tracking, payment management, and delivery logistics.",
      image: "/project-kapdafactory.png",
      color: "from-amber-500 to-orange-500",
      delay: 0.1
    },
    {
      title: "OrderFlow",
      slug: "orderflow",
      category: "Logistics & Tracking",
      description: "Daily order tracking and collection ecosystem with mobile app and Android tablet dashboard for delivery hubs.",
      image: "/project-orderflow.png",
      color: "from-blue-500 to-indigo-500",
      delay: 0.2
    },
    {
      title: "Veloria Vault",
      slug: "veloria-vault",
      category: "Luxury E-Commerce",
      description: "Premium WordPress store for a luxury leather handbag brand with immersive product storytelling.",
      image: "/project-veloriavault.png",
      color: "from-rose-500 to-pink-500",
      delay: 0.3
    }
  ];

  return (
    <section id="work" className="py-24 bg-[#0a0118] relative overflow-hidden">
      {/* Background Decorative Elements */}
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
            A selection of our favorite projects. We craft digital experiences that combine
            <span className="text-white font-medium"> aesthetics</span> with <span className="text-white font-medium">performance</span>.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Link key={index} href={`/work/${project.slug}`}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: project.delay }}
                whileHover={{ y: -10 }}
                className="group relative h-[400px] rounded-[2rem] overflow-hidden cursor-pointer border border-white/5"
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0118] via-[#0a0118]/60 to-transparent" />
                </div>

                {/* Glow Effect */}
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-gradient-to-r ${project.color} rounded-full blur-[60px] opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />

                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="inline-block px-3 py-1 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-white/90 mb-4">
                      {project.category}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">{project.title}</h3>
                    <p className="text-slate-300 text-base leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  {/* Arrow Icon */}
                  <div className="absolute top-6 right-6 w-11 h-11 rounded-full border border-white/20 flex items-center justify-center bg-white/10 backdrop-blur-md group-hover:bg-white group-hover:text-black transition-all duration-300 transform -rotate-45 group-hover:rotate-0">
                    <span className="material-symbols-rounded text-lg">arrow_outward</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Link href="/work" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors border-b border-white/10 hover:border-white pb-1">
            View All Projects <span className="material-symbols-rounded text-sm">arrow_forward</span>
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
      answer: "Our website packages start from ₹15,999. We offer The Starter (₹15k) for small businesses, The Growth (₹35k+) for retail brands, and custom enterprise solutions."
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
                Proudly serving enterprise clients in <span className="text-slate-200 font-semibold under">Texas (USA)</span> and <span className="text-slate-200 font-semibold">Mexico</span> with the same dedication we bring to Gonda.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Link href="/locations/global" className="inline-flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                  Explore International Services
                  <span className="material-symbols-rounded">arrow_forward</span>
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
                  <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-400 mb-4">
                    <span className="material-symbols-rounded">public</span>
                  </div>
                  <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Logistics AI</div>
                  <div className="text-xl font-bold text-slate-200">Texas, USA</div>
                </motion.div>

                {/* Card 2: Mexico */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-2xl bg-[#020617]/50 border border-white/5 hover:border-indigo-500/30 transition-all mt-8"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-900/30 flex items-center justify-center text-indigo-400 mb-4">
                    <span className="material-symbols-rounded">payments</span>
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
  )
}
