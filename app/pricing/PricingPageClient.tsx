'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Footer } from '../components/Footer';
import Link from 'next/link';
import { MdCheckCircle } from 'react-icons/md';

export default function PricingPage() {
  return (
    <main className="bg-[#0F172A] min-h-screen text-slate-200 font-sans selection:bg-sky-400 selection:text-[#0F172A]">
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-slate-50 mb-6">Transparent Pricing</h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Choose the right model for your business growth: project delivery or monthly AI operations.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="p-8 rounded-3xl bg-[#1E293B] border border-white/5 hover:border-sky-400 transition-all"
          >
            <div className="text-sky-400 font-bold uppercase text-xs mb-2">The Starter</div>
            <h2 className="text-3xl font-bold text-slate-50 mb-4">
              INR 15k <span className="text-sm text-slate-400 font-normal">/ project</span>
            </h2>
            <p className="text-slate-400 mb-8">
              Perfect for doctors, clinics, or small shops needing a professional digital presence.
            </p>

            <ul className="space-y-4 mb-8 text-slate-300">
              <li className="flex items-center gap-3">
                <MdCheckCircle className="text-emerald-400" />
                5 page professional website
              </li>
              <li className="flex items-center gap-3">
                <MdCheckCircle className="text-emerald-400" />
                Mobile responsive design
              </li>
              <li className="flex items-center gap-3">
                <MdCheckCircle className="text-emerald-400" />
                Basic SEO setup
              </li>
              <li className="flex items-center gap-3">
                <MdCheckCircle className="text-emerald-400" />
                Contact form integration
              </li>
              <li className="flex items-center gap-3">
                <MdCheckCircle className="text-emerald-400" />
                1 month support
              </li>
            </ul>

            <Link
              href="/#contact"
              className="block w-full py-3 rounded-xl border border-white/10 text-center font-bold text-slate-50 hover:bg-sky-400 hover:text-[#0F172A] transition-colors"
            >
              Get Started
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-8 rounded-3xl bg-[#1E293B] border border-sky-400 relative shadow-[0_0_30px_rgba(56,189,248,0.15)]"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-sky-400 text-[#0F172A] text-xs font-bold px-3 py-1 rounded-full uppercase">
              Most Popular
            </div>
            <div className="text-sky-400 font-bold uppercase text-xs mb-2">The Growth</div>
            <h2 className="text-3xl font-bold text-slate-50 mb-4">
              INR 35k <span className="text-sm text-slate-400 font-normal">/ starting</span>
            </h2>
            <p className="text-slate-400 mb-8">
              For retail brands ready to sell online with dynamic content and advanced performance setup.
            </p>

            <ul className="space-y-4 mb-8 text-slate-300">
              <li className="flex items-center gap-3">
                <MdCheckCircle className="text-emerald-400" />
                E-commerce functionality
              </li>
              <li className="flex items-center gap-3">
                <MdCheckCircle className="text-emerald-400" />
                Admin dashboard
              </li>
              <li className="flex items-center gap-3">
                <MdCheckCircle className="text-emerald-400" />
                Payment gateway integration
              </li>
              <li className="flex items-center gap-3">
                <MdCheckCircle className="text-emerald-400" />
                Advanced SEO and analytics
              </li>
              <li className="flex items-center gap-3">
                <MdCheckCircle className="text-emerald-400" />
                3 months support
              </li>
            </ul>

            <Link
              href="/#contact"
              className="block w-full py-3 rounded-xl bg-sky-400 text-center font-bold text-[#0F172A] hover:bg-white transition-colors"
            >
              Choose Growth
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="p-8 rounded-3xl bg-[#1E293B] border border-cyan-400/40 relative"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-cyan-400 text-[#082f49] text-xs font-bold px-3 py-1 rounded-full uppercase">
              Recurring SaaS
            </div>
            <div className="text-cyan-300 font-bold uppercase text-xs mb-2">Growth Autopilot</div>
            <h2 className="text-3xl font-bold text-slate-50 mb-4">
              INR 9,999 <span className="text-sm text-slate-400 font-normal">/ month / location</span>
            </h2>
            <p className="text-slate-400 mb-8">
              Clinic-first automation: missed-call followup, reminders, reviews, and bilingual inquiry handling.
            </p>

            <ul className="space-y-4 mb-8 text-slate-300">
              <li className="flex items-center gap-3">
                <MdCheckCircle className="text-cyan-300" />
                Missed-call to WhatsApp recovery
              </li>
              <li className="flex items-center gap-3">
                <MdCheckCircle className="text-cyan-300" />
                T-24h and T-2h reminder workflow
              </li>
              <li className="flex items-center gap-3">
                <MdCheckCircle className="text-cyan-300" />
                Review response assistant
              </li>
              <li className="flex items-center gap-3">
                <MdCheckCircle className="text-cyan-300" />
                Hindi + English patient assistant
              </li>
              <li className="flex items-center gap-3">
                <MdCheckCircle className="text-cyan-300" />
                Owner dashboard and weekly KPI report
              </li>
            </ul>

            <Link
              href="/services/clinic-growth-autopilot"
              className="block w-full py-3 rounded-xl bg-cyan-500 text-center font-bold text-[#082f49] hover:bg-cyan-300 transition-colors"
            >
              Explore Growth Autopilot
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
