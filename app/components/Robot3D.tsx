'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants, useSpring, useMotionValue, useTransform, useDragControls } from 'framer-motion';

export type Emotion = 'wave' | 'happy' | 'excited' | 'thinking' | 'smile' | 'cry' | 'angry' | 'sad' | 'idle' | 'laughing';

interface Robot3DProps {
    emotion?: Emotion;
    isOpen: boolean;
    onRobotClick?: () => void;
    isListening?: boolean;
}

export const Robot3D: React.FC<Robot3DProps> = ({
    emotion = 'idle',
    isOpen,
    onRobotClick,
    isListening = false
}) => {
    const [internalEmotion, setInternalEmotion] = useState<Emotion>(emotion);
    const [blink, setBlink] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const constraintsRef = useRef(null);

    // MOUSE TRACKING
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const rotateX = useSpring(useTransform(mouseY, [-500, 500], [12, -12]), { stiffness: 150, damping: 20 });
    const rotateY = useSpring(useTransform(mouseX, [-500, 500], [-12, 12]), { stiffness: 150, damping: 20 });
    const eyeX = useSpring(useTransform(mouseX, [-500, 500], [-3, 3]), { stiffness: 200, damping: 20 });
    const eyeY = useSpring(useTransform(mouseY, [-500, 500], [-2, 2]), { stiffness: 200, damping: 20 });

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
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

    useEffect(() => { setInternalEmotion(emotion); }, [emotion]);
    useEffect(() => {
        const interval = setInterval(() => setBlink(true), 3000 + Math.random() * 2000);
        return () => clearInterval(interval);
    }, []);
    useEffect(() => { if (blink) setTimeout(() => setBlink(false), 200); }, [blink]);

    const handleClick = () => {
        if (onRobotClick) onRobotClick();
        // SMILE when jumping/opening
        setInternalEmotion(isOpen ? 'idle' : 'smile');
        setTimeout(() => setInternalEmotion(emotion), 2000);
    };

    const containerVariants: Variants = {
        launcher: { y: 0, x: 0, scale: 1, transition: { type: "spring", stiffness: 400, damping: 12 } },
        hanging: { y: -515, x: -25, scale: 1.1, zIndex: 1000, transition: { type: "spring", stiffness: 300, damping: 15 } }
    };

    return (
        <motion.div
            ref={constraintsRef}
            className={`fixed ${isMobile ? 'bottom-20 right-4' : 'bottom-8 right-8'} z-[9999] cursor-pointer`}
            style={{ perspective: 1000 }}
            drag={isMobile}
            dragConstraints={{ top: -300, left: -200, right: 50, bottom: 50 }}
            dragElastic={0.1}
        >
            <motion.div
                animate={isOpen ? "hanging" : "launcher"}
                variants={containerVariants}
                onClick={handleClick}
                style={{ rotateX: isOpen ? 0 : rotateX, rotateY: isOpen ? 0 : rotateY, transformStyle: 'preserve-3d' }}
                whileHover={{ scale: 1.15, rotate: -2 }}
                whileTap={{ scale: 0.85, rotate: 5 }}
            >
                {/* Speech Bubble */}
                <AnimatePresence>
                    {!isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute -top-16 right-0 w-max bg-white text-slate-900 px-4 py-2 rounded-xl rounded-br-none shadow-[0_8px_30px_rgba(0,0,0,0.15)] text-xs font-bold border border-slate-100/50 z-[1000]"
                        >
                            Hi there! 👋
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ROBOT CONTAINER with 3D Depth */}
                <div className="w-20 h-24 relative" style={{ transformStyle: 'preserve-3d' }}>

                    {/* DROP SHADOW (3D Effect) */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-14 h-4 bg-black/20 blur-md rounded-full" />

                    {/* ANTENNA */}
                    <motion.div
                        className="absolute -top-3 left-1/2 -translate-x-1/2 w-1.5 h-5 bg-gradient-to-b from-slate-400 to-slate-300 rounded-full origin-bottom z-0"
                        style={{ boxShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}
                        animate={isListening ? { rotate: [0, 15, -15, 0], scaleY: 1.2 } : { scaleY: 1 }}
                        transition={isListening ? { repeat: Infinity, duration: 0.5 } : {}}
                    >
                        <motion.div
                            className={`absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full ${isListening ? 'bg-emerald-400' : 'bg-sky-400'}`}
                            style={{ boxShadow: isListening ? '0 0 15px #34d399' : '0 0 10px #38bdf8' }}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                        />
                    </motion.div>

                    {/* EARPHONES with 3D Shading */}
                    <motion.div
                        className="absolute top-8 -left-2.5 w-5 h-9 bg-gradient-to-br from-sky-400 to-sky-500 rounded-full border-2 border-white z-10"
                        style={{ boxShadow: '-2px 3px 8px rgba(0,0,0,0.25)' }}
                        animate={isListening ? { scale: 1.15 } : { scale: 1 }}
                    />
                    <motion.div
                        className="absolute top-8 -right-2.5 w-5 h-9 bg-gradient-to-bl from-sky-400 to-sky-500 rounded-full border-2 border-white z-10"
                        style={{ boxShadow: '2px 3px 8px rgba(0,0,0,0.25)' }}
                        animate={isListening ? { scale: 1.15 } : { scale: 1 }}
                    />

                    {/* HEAD with Realistic 3D Shading */}
                    <motion.div
                        className="absolute inset-x-0 top-0 h-[66px] bg-gradient-to-br from-white via-slate-50 to-slate-100 rounded-[1.8rem] z-20 border border-white/50 overflow-hidden"
                        style={{
                            boxShadow: `
                                inset -4px -4px 12px rgba(0,0,0,0.08),
                                inset 4px 4px 8px rgba(255,255,255,0.9),
                                0 12px 30px -5px rgba(0,0,0,0.3),
                                0 5px 15px -3px rgba(0,0,0,0.15)
                            `
                        }}
                    >
                        {/* Specular Highlight */}
                        <div className="absolute top-1.5 left-3 w-10 h-5 bg-white opacity-80 rounded-full blur-[3px]" />
                        <div className="absolute top-3 right-4 w-2 h-2 bg-white opacity-60 rounded-full" />
                    </motion.div>

                    {/* FACE with Eye Movement */}
                    <motion.div
                        className="absolute top-4 left-2 right-2 h-11 bg-gradient-to-b from-slate-800 to-slate-900 rounded-[1.2rem] z-30 flex items-center justify-center gap-3 overflow-hidden border border-slate-700/50"
                        style={{
                            x: eyeX, y: eyeY,
                            boxShadow: 'inset 0 3px 8px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.3)'
                        }}
                    >
                        <Eye blink={blink} emotion={internalEmotion} isListening={isListening} />
                        <Eye blink={blink} emotion={internalEmotion} isListening={isListening} />

                        {/* Blush */}
                        {(internalEmotion === 'happy' || internalEmotion === 'smile' || internalEmotion === 'excited') && (
                            <>
                                <div className="absolute bottom-1.5 left-1.5 w-3 h-1.5 bg-pink-400/40 rounded-full blur-[2px]" />
                                <div className="absolute bottom-1.5 right-1.5 w-3 h-1.5 bg-pink-400/40 rounded-full blur-[2px]" />
                            </>
                        )}

                        {/* Tears for Crying */}
                        {internalEmotion === 'cry' && (
                            <>
                                <motion.div
                                    className="absolute bottom-0 left-4 w-1.5 h-3 bg-sky-300 rounded-b-full"
                                    animate={{ y: [0, 8, 0], opacity: [1, 0, 1] }}
                                    transition={{ repeat: Infinity, duration: 1 }}
                                />
                                <motion.div
                                    className="absolute bottom-0 right-4 w-1.5 h-3 bg-sky-300 rounded-b-full"
                                    animate={{ y: [0, 8, 0], opacity: [1, 0, 1] }}
                                    transition={{ repeat: Infinity, duration: 1, delay: 0.3 }}
                                />
                            </>
                        )}
                    </motion.div>

                    {/* BODY with 3D Shading */}
                    <div
                        className="absolute top-[58px] left-3 right-3 h-11 bg-gradient-to-b from-white to-slate-100 rounded-b-[1.5rem] rounded-t-lg z-10 border-t border-white/50 flex justify-center"
                        style={{ boxShadow: '0 8px 20px -5px rgba(0,0,0,0.2), inset 0 -3px 6px rgba(0,0,0,0.05)' }}
                    >
                        <div className="mt-2.5 w-7 h-5 bg-gradient-to-b from-sky-100 to-sky-50 rounded-full shadow-inner flex items-center justify-center border border-sky-200/50">
                            <motion.div
                                className={`w-2.5 h-2.5 ${isListening ? 'bg-emerald-400' : 'bg-sky-400'} rounded-full`}
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                style={{ boxShadow: isListening ? '0 0 8px #34d399' : '0 0 6px #38bdf8' }}
                            />
                        </div>
                    </div>

                    {/* ARMS with Shading */}
                    <motion.div
                        className="absolute top-[70%] -left-1.5 w-7 h-9 bg-gradient-to-br from-sky-300 to-sky-400 rounded-full rounded-tr-none z-[15] border-2 border-white origin-top-right"
                        style={{ boxShadow: '-3px 4px 10px rgba(0,0,0,0.2)' }}
                        animate={
                            isOpen ? { rotate: 45, y: -5 } :
                                internalEmotion === 'wave' ? { rotate: [0, -35, 0, -35, 0] } :
                                    internalEmotion === 'excited' || internalEmotion === 'laughing' ? { rotate: [10, 30, 10] } :
                                        { rotate: 12 }
                        }
                        transition={{ duration: 0.5 }}
                    />
                    <motion.div
                        className="absolute top-[70%] -right-1.5 w-7 h-9 bg-gradient-to-bl from-sky-300 to-sky-400 rounded-full rounded-tl-none z-[15] border-2 border-white origin-top-left"
                        style={{ boxShadow: '3px 4px 10px rgba(0,0,0,0.2)' }}
                        animate={
                            isOpen ? { rotate: -45, y: -5 } :
                                internalEmotion === 'excited' || internalEmotion === 'laughing' ? { rotate: [-12, -40, -12] } :
                                    { rotate: -12 }
                        }
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </motion.div>
        </motion.div>
    );
};

const Eye = ({ blink, emotion, isListening }: { blink: boolean, emotion: Emotion, isListening: boolean }) => {
    const baseColor = isListening ? "bg-emerald-400" : "bg-cyan-400";
    const glow = isListening ? "shadow-[0_0_12px_#34d399]" : "shadow-[0_0_8px_#22d3ee]";
    const borderColor = isListening ? "border-emerald-400" : "border-cyan-400";

    if (blink) return <div className={`w-5 h-1 ${baseColor} rounded-full ${glow}`} />;

    // Happy emotions - curved eyes
    if (emotion === 'happy' || emotion === 'smile' || emotion === 'wave' || emotion === 'excited') {
        return <div className={`w-5 h-3 border-t-4 ${borderColor} rounded-full ${glow} mt-1`} />;
    }

    // Sad - droopy
    if (emotion === 'sad' || emotion === 'cry') {
        return <motion.div className={`w-4 h-4 ${baseColor} rounded-full ${glow} translate-y-1 opacity-70`} animate={{ y: [1, 3, 1] }} transition={{ repeat: Infinity, duration: 2 }} />;
    }

    // Angry - furrowed
    if (emotion === 'angry') {
        return (
            <div className="relative">
                <div className={`w-5 h-2.5 bg-red-400 rounded-t-full shadow-[0_0_8px_#f87171] mt-1`} />
                <div className="absolute -top-1 inset-x-0 h-1 bg-slate-800 transform -rotate-12" />
            </div>
        );
    }

    // Laughing - squinted
    if (emotion === 'laughing') {
        return <motion.div className={`w-5 h-1.5 ${baseColor} rounded-full ${glow}`} animate={{ scaleX: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.3 }} />;
    }

    // Thinking - looking up
    if (emotion === 'thinking') {
        return <motion.div className={`w-4 h-5 ${baseColor} rounded-full ${glow} relative -translate-y-1`}><div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-white rounded-full opacity-90" /></motion.div>;
    }

    // Default idle
    return (
        <motion.div
            className={`w-4 h-5 ${baseColor} rounded-full ${glow} relative transition-colors duration-300`}
            animate={isListening ? { scale: [1, 1.15, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1 }}
        >
            <div className="absolute top-1 right-0.5 w-1.5 h-1.5 bg-white rounded-full opacity-90" />
        </motion.div>
    );
};

