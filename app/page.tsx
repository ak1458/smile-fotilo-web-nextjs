'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Footer } from './components/Footer';
import { BackToTop } from './components/BackToTop';
import Link from 'next/link';

const Hero = () => {
  return (
    <section id="home" className="relative pt-32 pb-12 lg:pt-40 lg:pb-20 overflow-hidden min-h-screen flex items-center bg-[#020617] text-white">
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
          <a href="#work" className="px-8 py-4 rounded-full bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-500 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] min-w-[180px]">
            View Our Work
          </a>
          <a href="#contact" className="px-8 py-4 rounded-full bg-transparent border border-slate-700 text-slate-300 font-medium text-lg hover:border-indigo-400 hover:text-indigo-400 transition-all min-w-[180px]">
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="p-8 border border-white/5 bg-[#0F172A]/50 rounded-3xl hover:border-indigo-500/30 hover:shadow-[0_10px_40px_-10px_rgba(99,102,241,0.2)] transition-all group backdrop-blur-sm"
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
            <Link href="/pricing" className="block w-full py-3 rounded-xl border border-white/10 text-center font-bold text-white hover:bg-indigo-500 hover:text-white transition-all">Get Started</Link>
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
            <Link href="/pricing" className="block w-full py-3 rounded-xl bg-indigo-600 text-center font-bold text-white hover:bg-indigo-500 transition-all">Choose Growth</Link>
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
            <a href="#contact" className="block w-full py-3 rounded-xl border border-emerald-500/30 text-center font-bold text-white hover:bg-emerald-500/20 hover:text-emerald-300 transition-all">Contact Sales</a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [status, setStatus] = React.useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const service = formData.get('service') as string;
    const budget = formData.get('budget') as string;
    const message = formData.get('message') as string;

    // Format for mailto
    const body = `Hi, I am ${name}.%0D%0A%0D%0AMy Service Interest: ${service}%0D%0AMy Budget Range: ${budget}%0D%0A%0D%0ADetails:%0D%0A${message}`;
    const mailtoLink = `mailto:ashrafkamal1458@gmail.com?subject=New Project Inquiry: ${service}&body=${body}`;

    window.location.href = mailtoLink;
    setStatus('Opening email client...');
    (event.target as HTMLFormElement).reset();
    setTimeout(() => setStatus(''), 4000);
  };

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
                Let's make it <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Real.</span>
              </h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed max-w-md">
                We help ambitious brands scale with design-driven digital solutions.
                Tell us about your project, and we'll get back to you within 24 hours.
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
                <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-violet-400">
                  <span className="material-symbols-rounded">mail</span>
                </div>
                <div>
                  <div className="text-sm text-slate-500">Email us</div>
                  <div className="font-medium text-white text-lg">ashrafkamal1458@gmail.com</div>
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

          {/* Right Column: Premium Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8 md:p-10 relative"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Name</label>
                  <input name="name" type="text" required placeholder="John Doe"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all hover:bg-white/10" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Email</label>
                  <input name="email" type="email" required placeholder="john@company.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all hover:bg-white/10" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Service Interest</label>
                <div className="relative">
                  <select name="service" required defaultValue="" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all appearance-none hover:bg-white/10 [&>option]:bg-[#0f0720] [&>option]:text-white cursor-pointer">
                    <option value="" disabled className="text-slate-500">Select a service</option>
                    <option value="Web Design">Web Design & CMS</option>
                    <option value="Branding">Brand Identity</option>
                    <option value="Marketing">Digital Marketing & SEO</option>
                    <option value="Full Package">Full Package (Web + Brand + Ads)</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Budget Range</label>
                <div className="relative">
                  <select name="budget" required defaultValue="" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all appearance-none hover:bg-white/10 [&>option]:bg-[#0f0720] [&>option]:text-white cursor-pointer">
                    <option value="" disabled>Select your budget</option>
                    <option value="<15k">Less than ₹15k</option>
                    <option value="15k-35k">₹15k - ₹35k</option>
                    <option value="35k-75k">₹35k - ₹75k</option>
                    <option value="75k+">₹75k+</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Project Details</label>
                <textarea name="message" required rows={4} placeholder="Tell us about your goals..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all resize-none hover:bg-white/10"></textarea>
              </div>

              <button type="submit" className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                Send Message
              </button>

              <AnimatePresence>
                {status && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 py-2 rounded-lg text-sm">
                    {status}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Portfolio = () => {
  const projects = [
    {
      title: "Neon Nexus",
      category: "Fintech App",
      description: "A futuristic dashboard for a crypto trading platform with real-time data visualization.",
      color: "from-cyan-500 to-blue-500",
      delay: 0
    },
    {
      title: "Velvet Vogue",
      category: "E-Commerce",
      description: "High-fashion minimalist store with immersive 3D product previews.",
      color: "from-fuchsia-500 to-rose-500",
      delay: 0.1
    },
    {
      title: "EcoSphere",
      category: "Sustainability",
      description: "Corporate identity for a green energy startup featuring organic motion design.",
      color: "from-emerald-400 to-teal-600",
      delay: 0.2
    },
    {
      title: "Orbit",
      category: "SaaS Platform",
      description: "Collaborative workspace tool designed for remote teams with dark mode UI.",
      color: "from-violet-500 to-indigo-500",
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
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: project.delay }}
              whileHover={{ y: -10 }}
              className="group relative h-[400px] rounded-[2rem] overflow-hidden cursor-pointer"
            >
              {/* Abstract Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
              <div className="absolute inset-0 bg-[#0f0720]/80 backdrop-blur-sm group-hover:bg-[#0f0720]/60 transition-colors duration-500" />

              {/* Glow Effect */}
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-r ${project.color} rounded-full blur-[80px] opacity-0 group-hover:opacity-40 transition-opacity duration-500 transform group-hover:scale-150`} />

              {/* Content */}
              <div className="absolute inset-0 p-10 flex flex-col justify-end">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className={`inline-block px-3 py-1 rounded-full border border-white/20 bg-white/5 text-xs font-bold uppercase tracking-wider text-white/80 mb-4 backdrop-blur-md`}>
                    {project.category}
                  </span>
                  <h3 className="text-3xl font-bold text-white mb-3">{project.title}</h3>
                  <p className="text-slate-300 text-lg leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 transform translate-y-4 group-hover:translate-y-0">
                    {project.description}
                  </p>
                </div>

                {/* Arrow Icon */}
                <div className="absolute top-8 right-8 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5 group-hover:bg-white group-hover:text-black transition-all duration-300 transform -rotate-45 group-hover:rotate-0">
                  <span className="material-symbols-rounded text-xl">arrow_outward</span>
                </div>
              </div>
            </motion.div>
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
      <Pricing />
      <Contact />
      <Footer />
      <BackToTop />
    </main>
  );
};
