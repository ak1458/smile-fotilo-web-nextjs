'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants, useSpring, useMotionValue, useTransform } from 'framer-motion';

export type Emotion = 'wave' | 'happy' | 'excited' | 'thinking' | 'smile' | 'cry' | 'angry' | 'sad' | 'idle';

interface Robot3DProps {
    emotion?: Emotion;
    isOpen: boolean;
    onRobotClick?: () => void;
    isListening?: boolean; // New prop for typing awareness
}

export const Robot3D: React.FC<Robot3DProps> = ({
    emotion = 'idle',
    isOpen,
    onRobotClick,
    isListening = false
}) => {
    const [internalEmotion, setInternalEmotion] = useState<Emotion>(emotion);
    const [blink, setBlink] = useState(false);

    // MOUSE TRACKING LOGIC
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(useTransform(mouseY, [-500, 500], [15, -15]), { stiffness: 150, damping: 20 });
    const rotateY = useSpring(useTransform(mouseX, [-500, 500], [-15, 15]), { stiffness: 150, damping: 20 });

    // Eye movement is more subtle
    const eyeX = useSpring(useTransform(mouseX, [-500, 500], [-3, 3]), { stiffness: 200, damping: 20 });
    const eyeY = useSpring(useTransform(mouseY, [-500, 500], [-2, 2]), { stiffness: 200, damping: 20 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Only track when near the corner or when chat is open
            if (isOpen || (window.innerWidth - e.clientX < 400 && window.innerHeight - e.clientY < 400)) {
                mouseX.set(e.clientX - window.innerWidth + 100);
                mouseY.set(e.clientY - window.innerHeight + 100);
            } else {
                mouseX.set(0);
                mouseY.set(0);
            }
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isOpen, mouseX, mouseY]);

    useEffect(() => {
        setInternalEmotion(emotion);
    }, [emotion]);

    useEffect(() => {
        const interval = setInterval(() => setBlink(true), 3000 + Math.random() * 2000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (blink) setTimeout(() => setBlink(false), 200);
    }, [blink]);

    const handleClick = () => {
        if (onRobotClick) onRobotClick();
        setInternalEmotion('excited');
        setTimeout(() => setInternalEmotion(emotion), 2000);
    };

    const containerVariants: Variants = {
        launcher: {
            y: 0,
            x: 0,
            scale: 1,
            transition: { type: "spring", stiffness: 400, damping: 12 } // High responsive bounce
        },
        hanging: {
            y: -515,
            x: -25,
            scale: 1.2,
            zIndex: 1000,
            transition: { type: "spring", stiffness: 300, damping: 15 }
        }
    };

    return (
        <motion.div
            className="fixed bottom-8 right-8 z-[9999] cursor-pointer perspective-1000"
            animate={isOpen ? "hanging" : "launcher"}
            variants={containerVariants}
            onClick={handleClick}
            style={{ rotateX: isOpen ? 0 : rotateX, rotateY: isOpen ? 0 : rotateY }} // 3D TILT
            whileHover={{ scale: 1.15, rotate: -2 }}
            whileTap={{ scale: 0.85, rotate: 5 }} // Juicy squash
        >
            {/* Speech Bubble */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute -top-16 right-0 w-max bg-white text-slate-900 px-4 py-2 rounded-xl rounded-br-none shadow-[0_4px_15px_rgba(0,0,0,0.1)] text-xs font-bold border border-slate-100/50 z-[1000]"
                    >
                        Hi! 👋
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ROBOT */}
            <div className="w-20 h-24 relative transform-style-3d">

                {/* ANTENNA - Reacts to Listening */}
                <motion.div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 w-1 h-4 bg-slate-300 rounded-full origin-bottom z-0"
                    animate={isListening ? { rotate: [0, 15, -15, 0], scaleY: 1.2 } : { scaleY: 1 }}
                    transition={isListening ? { repeat: Infinity, duration: 0.5 } : {}}
                >
                    <div className={`absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 ${isListening ? 'bg-emerald-400 box-shadow-[0_0_10px_#34d399]' : 'bg-sky-400'} rounded-full transition-colors duration-300`} />
                </motion.div>

                {/* EARPHONES */}
                <motion.div className="absolute top-8 -left-2 w-4 h-8 bg-sky-400 rounded-full border-2 border-white shadow-sm z-10" animate={isListening ? { scale: 1.2 } : { scale: 1 }} />
                <motion.div className="absolute top-8 -right-2 w-4 h-8 bg-sky-400 rounded-full border-2 border-white shadow-sm z-10" animate={isListening ? { scale: 1.2 } : { scale: 1 }} />


                {/* HEAD */}
                <motion.div
                    className="absolute inset-x-0 top-0 h-16 bg-gradient-to-tr from-slate-100 via-white to-white rounded-[1.8rem] shadow-[inset_-4px_-4px_10px_rgba(0,0,0,0.1),0_8px_20px_rgba(0,0,0,0.15)] z-20 border border-white overflow-hidden"
                >
                    <div className="absolute top-2 left-4 w-8 h-4 bg-white opacity-90 rounded-full blur-[2px]" />
                </motion.div>

                {/* FACE - MOVES With Mouse */}
                <motion.div
                    className="absolute top-4 left-2 right-2 h-10 bg-[#1e293b] rounded-[1.2rem] z-30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] flex items-center justify-center gap-3 overflow-hidden border border-slate-700/50"
                    style={{ x: eyeX, y: eyeY }} // EYES FOLLOW MOUSE
                >
                    <Eye blink={blink} emotion={internalEmotion} isListening={isListening} />
                    <Eye blink={blink} emotion={internalEmotion} isListening={isListening} />

                    <div className="absolute top-7 left-2 w-2 h-1 bg-pink-400/30 rounded-full blur-[1px]" />
                    <div className="absolute top-7 right-2 w-2 h-1 bg-pink-400/30 rounded-full blur-[1px]" />
                </motion.div>

                {/* BODY */}
                <div className="absolute top-14 left-4 right-4 h-10 bg-white rounded-b-[1.5rem] rounded-t-lg z-10 shadow-md border-t border-slate-100 flex justify-center">
                    <div className="mt-2 w-6 h-4 bg-sky-100 rounded-full shadow-inner flex items-center justify-center">
                        <div className={`w-2 h-2 ${isListening ? 'bg-emerald-400' : 'bg-sky-400'} rounded-full animate-pulse transition-colors`} />
                    </div>
                </div>

                {/* ARMS */}
                <motion.div
                    className="absolute top-[68%] -left-1 w-6 h-8 bg-gradient-to-b from-sky-300 to-sky-400 rounded-full rounded-tr-none z-15 border-2 border-white shadow-sm origin-top-right"
                    animate={
                        isOpen ? { rotate: 45, y: -5 } :
                            internalEmotion === 'wave' ? { rotate: [0, -30, 0, -30, 0] } :
                                { rotate: 10 }
                    }
                />
                <motion.div
                    className="absolute top-[68%] -right-1 w-6 h-8 bg-gradient-to-b from-sky-300 to-sky-400 rounded-full rounded-tl-none z-15 border-2 border-white shadow-sm origin-top-left"
                    animate={
                        isOpen ? { rotate: -45, y: -5 } :
                            internalEmotion === 'excited' ? { rotate: [-10, -40, -10] } :
                                { rotate: -10 }
                    }
                />
            </div>
        </motion.div>
    );
};

const Eye = ({ blink, emotion, isListening }: { blink: boolean, emotion: Emotion, isListening: boolean }) => {
    const EYE_COLOR = isListening ? "bg-emerald-400" : "bg-[#06b6d4]"; // Green when listening
    const GLOW = isListening ? "shadow-[0_0_12px_#34d399]" : "shadow-[0_0_8px_rgba(6,182,212,0.6)]";
    const BORDER_COLOR = isListening ? "border-emerald-400" : "border-[#06b6d4]";

    if (blink) return <div className={`w-4 h-1 ${EYE_COLOR} rounded-full ${GLOW}`} />;

    if (emotion === 'happy' || emotion === 'smile' || emotion === 'wave') {
        return <div className={`w-4 h-3 border-t-4 ${BORDER_COLOR} rounded-full ${GLOW} mt-1`} />;
    }

    if (emotion === 'sad') return <div className={`w-3 h-3 ${EYE_COLOR} rounded-full ${GLOW} translate-y-1 opacity-70`} />;
    if (emotion === 'angry') return <div className={`w-4 h-2 ${EYE_COLOR} rounded-t-full ${GLOW} mt-1`} />;

    return (
        <motion.div
            className={`w-3.5 h-4.5 ${EYE_COLOR} rounded-full ${GLOW} relative transition-colors duration-300`}
            animate={isListening ? { scale: [1, 1.2, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1 }}
        >
            <div className="absolute top-1 right-0.5 w-1.5 h-1.5 bg-white rounded-full opacity-90" />
        </motion.div>
    );
};
