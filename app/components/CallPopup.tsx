'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose, MdCall } from 'react-icons/md';

export const CallPopup = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 5000); // Show after 5 seconds

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="fixed bottom-8 left-8 z-50 max-w-sm"
                >
                    <div className="bg-[#1E293B] border border-indigo-500/30 p-4 rounded-2xl shadow-2xl relative">
                        <button
                            onClick={() => setIsVisible(false)}
                            className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors z-10 border-2 border-[#1E293B]"
                        >
                            <MdClose className="text-xs font-bold" />
                        </button>

                        <div className="flex items-center gap-4">
                            <div className="bg-indigo-500/10 p-3 rounded-full text-indigo-400 animate-pulse">
                                <MdCall className="text-2xl" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm">Ready to scale?</h4>
                                <p className="text-slate-400 text-xs mb-2">Book a free strategy call with us.</p>
                                <a href="tel:+919453878422" className="text-indigo-400 text-xs font-bold hover:underline">
                                    Call +91 9453878422
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
