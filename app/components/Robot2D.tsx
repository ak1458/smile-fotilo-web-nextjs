'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type Emotion = 'idle' | 'happy' | 'thinking' | 'wave' | 'laughing' | 'sad' | 'cry' | 'excited' | 'love' | 'angry' | 'sleepy' | 'confused' | 'alert';

interface Robot2DProps {
    emotion?: Emotion;
    isOpen: boolean;
    onRobotClick?: () => void;
    isListening?: boolean;
}

export const Robot2D: React.FC<Robot2DProps> = ({
    emotion = 'idle',
    isOpen,
    onRobotClick,
    isListening = false
}) => {
    // Mounted check for SSR safety
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    // Demo Mode: Allow cycling emotions by clicking for verification if not "Open"
    const [demoIndex, setDemoIndex] = useState(0);
    const emotionsList: Emotion[] = ['idle', 'happy', 'laughing', 'sad', 'angry', 'excited', 'thinking', 'confused', 'sleepy'];

    const handleRobotClick = () => {
        if (isOpen) {
            onRobotClick?.(); // Close if open
        } else {
            // Cycle to next emotion for demo purposes, BUT allow opening logic to proceed if connected
            const nextIndex = (demoIndex + 1) % emotionsList.length;
            setDemoIndex(nextIndex);

            // PRIORITY: Allow the robot to open the chat window as requested
            onRobotClick?.();
        }
    };

    const [isHovered, setIsHovered] = useState(false);

    // Auto-Blink Logic - Increased interval for performance (8-12s randomized)
    const [blink, setBlink] = useState(false);
    useEffect(() => {
        const blinkLoop = setInterval(() => {
            if (Math.random() > 0.6) { // Randomize blink holding
                setBlink(true);
                setTimeout(() => setBlink(false), 150);
            }
        }, 8000 + Math.random() * 4000); // 8-12 seconds
        return () => clearInterval(blinkLoop);
    }, []);

    // Emotions: Automatic trigger mix
    // Debug/Demo: Allow forcing emotion via prop unless we are cycling
    // Priority: Props (if wired) -> Demo Cycle (if clicked) -> Idle logic
    const currentDemoEmotion = emotionsList[demoIndex];
    const displayedEmotion = demoIndex > 0 ? currentDemoEmotion : (emotion === 'idle' ? (isHovered ? 'happy' : 'idle') : emotion);

    // SSR Safety: Don't render until mounted
    if (!mounted) return null;

    return (
        <motion.div
            drag
            dragMomentum={false}
            whileDrag={{ scale: 1.1, cursor: 'grabbing' }}
            dragConstraints={{ left: -500, right: 0, top: -500, bottom: 0 }}
            className={`fixed ${isOpen ? 'z-[900]' : 'z-[9999]'} transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) cursor-pointer group touch-none`}
            style={{
                // "Peeking" Design Spec (Fixed "Leg" look):
                // Open: Sink deep (440px) so body overlaps vertically behind the header.
                // Closed: 90px (Mobile Safe).
                // X-Axis: Shift -80px left to clear text.
                bottom: isOpen ? '410px' : '90px',
                right: isOpen ? '80px' : '20px',
                scale: isOpen ? 0.9 : 1,
            }}
            onTap={handleRobotClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* MESSAGE BUBBLE - Only show when NOT open (avoids clutter) */}
            <AnimatePresence>
                {
                    (displayedEmotion !== 'idle' || isListening) && !isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                            animate={{ opacity: 1, y: -10, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.8 }}
                            className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-slate-800 px-4 py-1.5 rounded-full shadow-lg border border-slate-100 text-xs font-bold whitespace-nowrap z-50"
                        >
                            {isListening ? 'Listening...' : getMessage(displayedEmotion)}
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45" />
                        </motion.div>
                    )
                }
            </AnimatePresence>

            {/* ROBOT CONTAINER (Bobbing Animation) */}
            <div className={`relative w-24 h-32 flex flex-col items-center justify-center transition-transform duration-300 ${displayedEmotion === 'laughing' ? 'animate-bounce' : 'animate-[float_6s_ease-in-out_infinite]'}`}>

                {/* HEAD (Floating) */}
                <div className="relative z-20 w-20 h-14 bg-gradient-to-b from-white to-slate-200 rounded-[50%] shadow-[0_5px_15px_rgba(0,0,0,0.1)] flex items-center justify-center border border-white/50 animate-[headFloat_4s_ease-in-out_infinite_reverse]">

                    {/* FACE MASK (Inset Black Glass) */}
                    <div className="w-[90%] h-[80%] bg-black rounded-[45%] flex items-center justify-center gap-3 overflow-hidden relative shadow-inner border border-slate-800">
                        {/* Eyes */}
                        <div className={`w-6 h-4 bg-cyan-400 rounded-[50%] shadow-[0_0_15px_#22d3ee] transition-all duration-300 ${getEyeStyle(displayedEmotion, 'left')} ${blink ? 'scale-y-[0.1]' : ''}`}>
                            <div className="w-full h-full bg-[repeating-linear-gradient(transparent,transparent_2px,rgba(0,0,0,0.3)_3px)] opacity-50" />
                        </div>
                        <div className={`w-6 h-4 bg-cyan-400 rounded-[50%] shadow-[0_0_15px_#22d3ee] transition-all duration-300 ${getEyeStyle(displayedEmotion, 'right')} ${blink ? 'scale-y-[0.1]' : ''}`}>
                            <div className="w-full h-full bg-[repeating-linear-gradient(transparent,transparent_2px,rgba(0,0,0,0.3)_3px)] opacity-50" />
                        </div>

                        {/* Reflections/Glint on Glass */}
                        <div className="absolute top-1 right-3 w-3 h-1.5 bg-white/20 rounded-full Rotate-[-15deg]" />
                    </div>
                </div>

                {/* NECK GAP (Invisible but spacing) */}
                <div className="h-1" />

                {/* BODY (Visible but positioned logically) */}
                <div className={`relative z-10 w-16 h-20 bg-gradient-to-tr from-slate-200 via-white to-slate-100 shadow-[0_10px_20px_rgba(0,0,0,0.15)] flex flex-col items-center transition-all duration-500
                    ${isOpen ? 'opacity-100 translate-y-2' : 'opacity-100 scale-100'}`} // Keep visible, slight shifting
                    style={{ borderRadius: '50% 50% 50% 50% / 15% 15% 85% 85%' }}>

                    {/* Chest Symbol */}
                    <div className="absolute top-4 flex gap-0.5 opacity-80">
                        <div className="w-1 h-2 bg-red-500 rounded-sm animate-pulse" />
                        <div className="w-1 h-3 bg-yellow-400 rounded-sm animate-pulse delay-75" />
                        <div className="w-1 h-1.5 bg-green-500 rounded-sm animate-pulse delay-150" />
                    </div>
                </div>

                {/* SHOULDER JOINTS (The "Photoshop" Fix - Physical Ball Connections) */}
                <div className="absolute top-[4.5rem] w-full flex justify-between px-0 z-10 pointer-events-none">
                    <div className="w-5 h-5 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full shadow-md border border-slate-500" />
                    <div className="w-5 h-5 bg-gradient-to-bl from-slate-400 to-slate-600 rounded-full shadow-md border border-slate-500" />
                </div>

                {/* ARMS (Attached to Ball Joints - Rotated for "Peeking" Rest) */}
                {/* Left Arm: Rotated 80deg to look like resting forearm, NOT leg */}
                <div className={`absolute w-4 h-14 bg-gradient-to-r from-slate-200 to-white rounded-full shadow-md origin-top-center transition-all duration-700
                    ${isOpen
                        ? 'top-[5rem] left-2 rotate-[80deg] z-20' // Peeking: Horizontal Arm
                        : `top-[5rem] -left-1 ${isListening ? 'rotate-[-20deg]' : 'rotate-[5deg]'} z-20`}
                    ${(!isOpen && displayedEmotion === 'wave') ? 'animate-[waveLeft_1000ms_ease-in-out_infinite]' : ''}
                    ${(!isOpen && displayedEmotion === 'idle') ? 'animate-[breathingArmLeft_4s_ease-in-out_infinite]' : ''}`}
                />

                {/* Right Arm */}
                <div className={`absolute w-4 h-14 bg-gradient-to-l from-slate-200 to-white rounded-full shadow-md origin-top-center transition-all duration-700
                    ${isOpen
                        ? 'top-[5rem] right-2 rotate-[-80deg] z-20' // Peeking: Horizontal Arm
                        : `top-[5rem] -right-1 ${isListening ? 'rotate-[20deg]' : 'rotate-[-5deg]'} z-20`}
                    ${(!isOpen && displayedEmotion === 'wave') ? 'animate-[waveRight_1s_ease-in-out_infinite]' : ''}
                    ${(!isOpen && displayedEmotion === 'idle') ? 'animate-[breathingArmRight_4s_ease-in-out_infinite_reverse]' : ''}`}
                />

                {/* SHADOW (Hidden when hanging to reduce "Flying" look) */}
                <div className={`absolute -bottom-6 w-16 h-4 bg-black/20 rounded-[50%] blur-sm animate-[shadowScale_6s_ease-in-out_infinite] transition-opacity duration-500 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
            </div>

            {/* CSS ANIMATIONS */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes headFloat {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-3px) rotate(2deg); }
                }
                @keyframes shadowScale {
                    0%, 100% { transform: scale(1); opacity: 0.2; }
                    50% { transform: scale(0.8); opacity: 0.1; }
                }
                @keyframes waveRight {
                    0% { transform: rotate(-10deg); }
                    50% { transform: rotate(-160deg) translateY(-5px); }
                    100% { transform: rotate(-10deg); }
                }
                @keyframes waveLeft {
                    0% { transform: rotate(10deg); }
                    50% { transform: rotate(160deg) translateY(-5px); }
                    100% { transform: rotate(10deg); }
                }
                @keyframes breathingArmLeft {
                    0%, 100% { transform: rotate(0deg); }
                    50% { transform: rotate(5deg); }
                }
                @keyframes breathingArmRight {
                    0%, 100% { transform: rotate(0deg); }
                    50% { transform: rotate(-5deg); }
                }
            `}</style>
        </motion.div>
    );
};

// Helper for Eye Styles
const getEyeStyle = (emotion: Emotion, side: 'left' | 'right') => {
    const base = "transform origin-center";
    switch (emotion) {
        case 'happy':
        case 'love':
            return `${base} scale-y-50 ${side === 'left' ? 'rotate-[-10deg]' : 'rotate-[10deg]'}`;
        case 'laughing':
            return `${base} scale-y-25 translate-y-1 ${side === 'left' ? 'rotate-[-15deg]' : 'rotate-[15deg]'}`; // Squint Step
        case 'sad':
        case 'cry':
            return `${base} scale-y-75 ${side === 'left' ? 'rotate-[20deg]' : 'rotate-[-20deg]'}`;
        case 'angry':
            return `${base} bg-red-500 h-2 rounded-sm ${side === 'left' ? 'rotate-[15deg]' : 'rotate-[-15deg]'}`;
        case 'excited':
            return `${base} scale-125 bg-cyan-300 shadow-[0_0_25px_#22d3ee] h-5`;
        case 'sleepy':
            return `${base} scale-y-[0.1] opacity-50`;
        case 'thinking':
            return `${base} ${side === 'left' ? 'scale-75' : 'scale-100'} animate-pulse`;
        case 'confused':
            return `${base} ${side === 'left' ? 'scale-125' : 'scale-75'}`;
        default:
            return base;
    }
};

// Helper for Messages
const getMessage = (emotion: Emotion) => {
    switch (emotion) {
        case 'happy': return 'Hi there!';
        case 'wave': return 'Hello!';
        case 'thinking': return 'Thinking...';
        case 'laughing': return 'Haha!';
        case 'sad': return 'Oh no...';
        case 'excited': return 'Awesome!';
        case 'love': return 'I love it!';
        case 'angry': return 'Hmph!';
        case 'sleepy': return 'Zzz...';
        case 'confused': return 'Hmm?';
        default: return '';
    }
};
