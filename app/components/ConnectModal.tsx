"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { sendContactEmail } from "../actions/contact";

interface ConnectModalProps {
    isOpen: boolean;
    onClose: () => void;
    context?: string;
}

type ConnectMethod = "call" | "message" | "email" | null;

export const ConnectModal = ({ isOpen, onClose, context = "General" }: ConnectModalProps) => {
    const [step, setStep] = useState<"method" | "form">("method");
    const [method, setMethod] = useState<ConnectMethod>(null);
    const isClient = useSyncExternalStore(
        () => () => { },
        () => true,
        () => false
    );

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
            setTimeout(() => {
                setStep("method");
                setMethod(null);
            }, 300);
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isClient) return null;
    if (!isOpen) return null;

    const handleMethodSelect = (selectedMethod: ConnectMethod) => {
        setMethod(selectedMethod);
        setStep("form");
    };

    const handleBack = () => {
        setStep("method");
        setMethod(null);
    };

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300" onClick={onClose}></div>

            <div className="relative w-full max-w-lg bg-[#0f0720] border border-violet-500/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-300" role="dialog" aria-modal="true">

                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0f0720]/95 backdrop-blur z-10">
                    <div>
                        <h3 className="text-xl font-bold text-white">
                            {step === "method" ? "How would you like to connect?" : `Connect via ${method === 'call' ? 'Callback' : method === 'email' ? 'Email' : 'Message'}`}
                        </h3>
                        <p className="text-sm text-slate-400">Re: {context}</p>
                    </div>
                    <button onClick={onClose} className="w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
                        <span className="material-symbols-rounded text-xl">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar">

                    {step === "method" && (
                        <div className="grid gap-4">

                            {/* Call Option - Direct Link */}
                            <a href="tel:+919453878422" className="group relative p-6 rounded-2xl border border-white/5 bg-white/5 hover:bg-orange-500/10 hover:border-orange-500/50 transition-all text-left flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-rounded text-2xl">call</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-lg">Request a Call</h4>
                                    <p className="text-slate-400 text-sm">Let&apos;s talk over the phone.</p>
                                </div>
                                <span className="material-symbols-rounded ml-auto text-slate-500 group-hover:text-orange-400 group-hover:translate-x-1 transition-all">arrow_forward</span>
                            </a>

                            {/* Message Option */}
                            <button onClick={() => handleMethodSelect("message")} className="group relative p-6 rounded-2xl border border-white/5 bg-white/5 hover:bg-blue-500/10 hover:border-blue-500/50 transition-all text-left flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-rounded text-2xl">chat</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-lg">Send a Message</h4>
                                    <p className="text-slate-400 text-sm">Chat via WhatsApp or Form.</p>
                                </div>
                                <span className="material-symbols-rounded ml-auto text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all">arrow_forward</span>
                            </button>

                            {/* Email Option */}
                            <button onClick={() => handleMethodSelect("email")} className="group relative p-6 rounded-2xl border border-white/5 bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all text-left flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-rounded text-2xl">mail</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-lg">Send an Email</h4>
                                    <p className="text-slate-400 text-sm">Drop us a detailed mail.</p>
                                </div>
                                <span className="material-symbols-rounded ml-auto text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all">arrow_forward</span>
                            </button>
                        </div>
                    )}

                    {step === "form" && (
                        <ContactForm method={method} onBack={handleBack} onClose={onClose} context={context} />
                    )}

                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

// --- Sub-Component for Form Handling ---

const ContactForm = ({ method, onBack, onClose, context }: { method: ConnectMethod, onBack: () => void, onClose: () => void, context: string }) => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null);

    // If "Message" selected -> Show WhatsApp Option + Form
    if (method === 'message') {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                    <span className="material-symbols-rounded text-sm">arrow_back</span> Back
                </button>

                <h4 className="text-white text-lg font-bold">Choose Platform</h4>
                <div className="grid gap-4">
                    <a href="https://wa.me/919453878422?text=Hi,%20I%20am%20interested%20in%20your%20services." target="_blank" rel="noopener noreferrer"
                        className="p-4 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 flex items-center gap-4 hover:bg-[#25D366]/20 transition-colors">
                        <span className="material-symbols-rounded text-[#25D366] text-3xl">chat</span>
                        <div>
                            <strong className="text-white block">WhatsApp</strong>
                            <span className="text-slate-400 text-sm">Instant Reply</span>
                        </div>
                    </a>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0f0720] px-2 text-slate-500">Or fill form</span></div>
                    </div>

                    <form className="space-y-4" action={async (formData) => {
                        setLoading(true);
                        // Add extra wait to simulate processing if needed
                        const data = {
                            name: formData.get('name') as string,
                            contact: formData.get('contact') as string,
                            message: formData.get('message') as string,
                            method: 'message' as const,
                            context
                        };
                        const result = await sendContactEmail(data);
                        setLoading(false);
                        if (result.success) {
                            setStatus({ success: true, message: 'Message sent! We will revert shortly.' });
                            setTimeout(onClose, 2000);
                        } else {
                            setStatus({ success: false, message: result.error });
                        }
                    }}>
                        <input name="name" placeholder="Name" className="w-full p-3 bg-white/5 rounded-lg border border-white/10 text-white focus:border-violet-500 outline-none" required />
                        <input name="contact" placeholder="Phone / Email" className="w-full p-3 bg-white/5 rounded-lg border border-white/10 text-white focus:border-violet-500 outline-none" required />
                        <textarea name="message" rows={3} placeholder="Message" className="w-full p-3 bg-white/5 rounded-lg border border-white/10 text-white focus:border-violet-500 outline-none resize-none" required />

                        <button disabled={loading} className="w-full py-3 bg-blue-600 rounded-lg text-white font-bold hover:bg-blue-500 transition-colors disabled:opacity-50">
                            {loading ? 'Sending...' : 'Send Message'}
                        </button>
                        {status && <p className={`text-center text-sm ${status.success ? 'text-green-400' : 'text-red-400'}`}>{status.message}</p>}
                    </form>
                </div>
            </div>
        )
    }

    // Default Form (Callback request, Email)
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-4"
            >
                <span className="material-symbols-rounded text-sm">arrow_back</span>
                Back to options
            </button>

            <form className="space-y-4" action={async (formData) => {
                setLoading(true);
                const data = {
                    name: formData.get('name') as string,
                    contact: formData.get('contact') as string,
                    message: formData.get('message') as string,
                    method: method || 'email',
                    context
                };
                const result = await sendContactEmail(data);
                setLoading(false);
                if (result.success) {
                    setStatus({ success: true, message: 'Request sent successfully!' });
                    setTimeout(onClose, 2000);
                } else {
                    setStatus({ success: false, message: result.error });
                }
            }}>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Name</label>
                    <input name="name" type="text" placeholder="John Doe" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-violet-500 outline-none text-white transition-all" required />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">
                        {method === 'email' ? 'Email Address' : 'Phone Number'}
                    </label>
                    <input
                        name="contact"
                        type={method === 'email' ? 'email' : 'tel'}
                        placeholder={method === 'email' ? 'john@example.com' : '+91 98765 43210'}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-violet-500 outline-none text-white transition-all"
                        required
                    />
                </div>

                {method !== 'call' && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Message</label>
                        <textarea
                            name="message"
                            rows={4}
                            placeholder="Tell us about your project..."
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-violet-500 outline-none text-white transition-all resize-none"
                            required
                        ></textarea>
                    </div>
                )}

                <button disabled={loading} type="submit" className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-violet-500/25 transition-all active:scale-[0.98] disabled:opacity-50">
                    {loading ? 'Processing...' : (method === 'call' ? 'Request Callback' : 'Send Request')}
                </button>

                {status && <p className={`text-center text-sm ${status.success ? 'text-green-400' : 'text-red-400'}`}>{status.message}</p>}
            </form>
        </div>
    );
};
