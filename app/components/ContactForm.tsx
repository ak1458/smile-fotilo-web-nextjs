'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Custom glassmorphism dropdown
const GlassSelect = ({
    name,
    placeholder,
    options,
    required
}: {
    name: string;
    placeholder: string;
    options: { value: string; label: string }[];
    required?: boolean;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<{ value: string; label: string } | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Hidden input for form submission */}
            <input type="hidden" name={name} value={selected?.value || ''} required={required} />

            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-left flex items-center justify-between transition-all hover:bg-white/10 ${isOpen ? 'border-violet-500/50 bg-white/10' : ''
                    } ${selected ? 'text-white' : 'text-slate-400'}`}
            >
                <span>{selected?.label || placeholder}</span>
                <span className={`material-symbols-rounded text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    expand_more
                </span>
            </button>

            {/* Dropdown Menu with Glassmorphism */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 w-full mt-2 py-2 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                    >
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    setSelected(option);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-4 py-3 text-left transition-all flex items-center gap-3 ${selected?.value === option.value
                                    ? 'bg-violet-600/20 text-violet-300'
                                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <span className={`w-2 h-2 rounded-full ${selected?.value === option.value ? 'bg-violet-400' : 'bg-transparent'
                                    }`} />
                                {option.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const ContactForm = () => {
    const [status, setStatus] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setStatus('Sending...');

        const formData = new FormData(event.currentTarget);
        const data = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            service: formData.get('service') as string,
            budget: formData.get('budget') as string,
            message: formData.get('message') as string,
        };

        try {
            const { sendContactEmail } = await import('../actions/email');
            const result = await sendContactEmail(data);

            if (result.success) {
                setStatus('✅ Message sent! Check your email for confirmation.');
                (event.target as HTMLFormElement).reset();
            } else {
                setStatus('❌ ' + result.message);
            }
        } catch {
            setStatus('❌ Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setStatus(''), 5000);
        }
    };

    const serviceOptions = [
        { value: 'Web Design', label: 'Web Design & CMS' },
        { value: 'Branding', label: 'Brand Identity' },
        { value: 'Marketing', label: 'Digital Marketing & SEO' },
        { value: 'Full Package', label: 'Full Package (Web + Brand + Ads)' },
    ];

    const budgetOptions = [
        { value: '<15k', label: 'Less than ₹15k' },
        { value: '15k-35k', label: '₹15k - ₹35k' },
        { value: '35k-75k', label: '₹35k - ₹75k' },
        { value: '75k+', label: '₹75k+' },
    ];

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
                <GlassSelect
                    name="service"
                    placeholder="Select a service"
                    options={serviceOptions}
                    required
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Budget Range</label>
                <GlassSelect
                    name="budget"
                    placeholder="Select your budget"
                    options={budgetOptions}
                    required
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Project Details</label>
                <textarea name="message" required rows={4} placeholder="Tell us about your goals..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all resize-none hover:bg-white/10"></textarea>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                {isSubmitting ? 'Sending...' : 'Send Message'}
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
