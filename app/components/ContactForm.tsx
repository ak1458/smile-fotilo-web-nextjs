'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const ContactForm = () => {
    const [status, setStatus] = useState('');

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
        <form onSubmit={handleSubmit} className="space-y-6 p-8 border border-white/10 rounded-3xl bg-[#0F172A]/50 backdrop-blur-md">
            <div className="grid sm:grid-cols-2 gap-6">
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
                        <option value="Web Design">Web Design &amp; CMS</option>
                        <option value="Branding">Brand Identity</option>
                        <option value="Marketing">Digital Marketing &amp; SEO</option>
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
    );
};
