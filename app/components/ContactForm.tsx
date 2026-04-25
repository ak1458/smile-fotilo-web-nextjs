'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdExpandMore, MdChat } from 'react-icons/md';

const GlassSelect = ({
    name,
    placeholder,
    options,
    required,
    onSelect,
}: {
    name: string;
    placeholder: string;
    options: { value: string; label: string }[];
    required?: boolean;
    onSelect?: (option: { value: string; label: string }) => void;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<{ value: string; label: string } | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option: { value: string; label: string }) => {
        setSelected(option);
        setIsOpen(false);
        onSelect?.(option);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <input type="hidden" name={name} value={selected?.value || ''} required={required} />

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`sf-select-trigger w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-left flex items-center justify-between transition-all hover:bg-white/10 ${isOpen ? 'border-violet-500/50 bg-white/10' : ''
                    } ${selected ? 'text-white' : 'text-slate-400'}`}
            >
                <span>{selected?.label || placeholder}</span>
                <MdExpandMore className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="sf-select-menu absolute z-50 w-full mt-2 py-2 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                    >
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => handleSelect(option)}
                                className={`sf-select-option w-full px-4 py-3 text-left transition-all flex items-center gap-3 ${selected?.value === option.value
                                    ? 'bg-violet-600/20 text-violet-300'
                                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <span
                                    className={`w-2 h-2 rounded-full ${selected?.value === option.value ? 'bg-violet-400' : 'bg-transparent'
                                        }`}
                                />
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
    const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info' | 'redirect'; text: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showChatbotRedirect, setShowChatbotRedirect] = useState(false);

    const handleServiceSelect = (option: { value: string; label: string }) => {
        if (option.value === 'Custom') {
            setShowChatbotRedirect(true);
            setStatus({
                type: 'redirect',
                text: 'Custom projects are best discussed with Echo, our AI assistant.'
            });

            // Dispatch event to open chatbot with custom project context
            setTimeout(() => {
                const event = new CustomEvent('echo:open-chat', {
                    detail: {
                        message: 'I have a custom project that doesn\'t fit the standard options. I need to discuss my specific requirements with you.'
                    }
                });
                window.dispatchEvent(event);
            }, 1500);
        } else {
            setShowChatbotRedirect(false);
            setStatus(null);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: 'info', text: 'Sending...' });

        const formData = new FormData(event.currentTarget);
        const data = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            service: formData.get('service') as string,
            budget: formData.get('budget') as string,
            message: formData.get('message') as string,
        };

        if (!data.service || !data.budget) {
            setIsSubmitting(false);
            setStatus({ type: 'error', text: 'Please select service and budget before submitting.' });
            setTimeout(() => setStatus(null), 5000);
            return;
        }

        // If custom option is selected, don't submit form - chatbot handles it
        if (data.service === 'Custom') {
            setIsSubmitting(false);
            return;
        }

        try {
            const { sendContactEmail } = await import('../actions/email');
            const result = await sendContactEmail(data);

            if (result.success) {
                setStatus({ type: 'success', text: result.message || 'Message sent. Check your inbox for confirmation.' });
                (event.target as HTMLFormElement).reset();
                setShowChatbotRedirect(false);
            } else {
                setStatus({ type: 'error', text: result.message || 'Failed to send message. Please use the WhatsApp button instead.' });
            }
        } catch {
            setStatus({ type: 'error', text: 'Network Error. Please use the WhatsApp button instead.' });
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setStatus(null), 7000);
        }
    };

    const serviceOptions = [
        { value: 'Web Design', label: 'Web Design and CMS' },
        { value: 'Branding', label: 'Brand Identity' },
        { value: 'Marketing', label: 'Digital Marketing and SEO' },
        { value: 'Full Package', label: 'Full Package (Web + Brand + Ads)' },
        { value: 'Custom', label: 'Something Custom 💬' },
    ];

    const budgetOptions = [
        { value: '<15k', label: 'Less than INR 15k' },
        { value: '15k-35k', label: 'INR 15k - INR 35k' },
        { value: '35k-75k', label: 'INR 35k - INR 75k' },
        { value: '75k+', label: 'INR 75k+' },
    ];

    return (
        <form onSubmit={handleSubmit} className="sf-contact-form space-y-6 p-8 border border-white/10 rounded-3xl bg-[#0F172A]/50 backdrop-blur-md">
            <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-slate-400">Name</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="John Doe"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all hover:bg-white/10"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-slate-400">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="john@company.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all hover:bg-white/10"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Service Interest</label>
                <GlassSelect
                    name="service"
                    placeholder="Select a service"
                    options={serviceOptions}
                    required
                    onSelect={handleServiceSelect}
                />
                {showChatbotRedirect && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-sm text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-lg px-3 py-2"
                    >
                        <MdChat className="text-lg" />
                        <span>Echo will help you with custom requirements. Opening chatbot...</span>
                    </motion.div>
                )}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Budget Range</label>
                <GlassSelect name="budget" placeholder="Select your budget" options={budgetOptions} required />
            </div>

            <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-slate-400">Project Details</label>
                <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    placeholder="Tell us about your goals..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all resize-none hover:bg-white/10"
                ></textarea>
            </div>

            <div className="flex items-start gap-3 mt-4">
                <div className="flex items-center h-5">
                    <input
                        id="privacy-consent"
                        name="privacy-consent"
                        type="checkbox"
                        required
                        className="w-4 h-4 rounded border-white/10 bg-white/5 text-violet-500 focus:ring-violet-500/50 cursor-pointer"
                    />
                </div>
                <label htmlFor="privacy-consent" className="text-xs text-slate-400 cursor-pointer">
                    I agree to the <Link href="/privacy" className="text-violet-400 hover:text-violet-300 underline underline-offset-2">Privacy Policy</Link> and consent to Smile Fotilo processing my personal data to contact me regarding my inquiry. We never sell your data.
                </label>
            </div>

            <button
                type="submit"
                disabled={isSubmitting || showChatbotRedirect}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all relative overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                aria-busy={isSubmitting}
            >
                <div
                    className={`absolute inset-0 bg-white/20 transition-transform duration-300 pointer-events-none ${isSubmitting ? '' : 'translate-y-full group-hover:translate-y-0'
                        }`}
                />
                <span className="flex items-center justify-center gap-2">
                    {isSubmitting && (
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    )}
                    {isSubmitting ? 'Sending...' : showChatbotRedirect ? 'Opening Echo Chat...' : 'Send Message'}
                </span>
            </button>

            <AnimatePresence>
                {status && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`text-center py-2 rounded-lg text-sm ${status.type === 'success'
                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                            : status.type === 'error'
                                ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                                : status.type === 'redirect'
                                    ? 'bg-violet-500/10 border border-violet-500/20 text-violet-400'
                                    : 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-300'
                            }`}
                    >
                        {status.text}
                    </motion.div>
                )}
            </AnimatePresence>
        </form>
    );
};
