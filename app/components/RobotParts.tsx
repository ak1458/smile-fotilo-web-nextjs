'use client';

import React from 'react';
import { motion } from 'framer-motion';

export type Emotion = 'idle' | 'happy' | 'thinking' | 'wave' | 'laughing' | 'sad' | 'cry' | 'excited' | 'love' | 'angry' | 'sleepy' | 'confused' | 'alert';

// Eye style helper
const getEyeStyle = (emotion: Emotion, side: 'left' | 'right'): string => {
    const base = 'transition-all duration-300';
    switch (emotion) {
        case 'happy':
        case 'laughing':
            return `${base} scale-y-75 translate-y-0.5`;
        case 'sad':
        case 'cry':
            return `${base} scale-y-50 ${side === 'left' ? 'rotate-[10deg]' : 'rotate-[-10deg]'}`;
        case 'angry':
            return `${base} scale-y-75 ${side === 'left' ? 'rotate-[-15deg]' : 'rotate-[15deg]'}`;
        case 'excited':
            return `${base} scale-110`;
        case 'love':
            return `${base} bg-pink-400 shadow-[0_0_15px_#f472b6]`;
        case 'sleepy':
            return `${base} scale-y-[0.2]`;
        case 'confused':
            return `${base} ${side === 'left' ? 'scale-75' : 'scale-110'}`;
        case 'thinking':
            return `${base} ${side === 'left' ? 'translate-x-1' : 'translate-x-1'} translate-y-[-2px]`;
        case 'alert':
            return `${base} scale-125`;
        default:
            return base;
    }
};

interface RobotHeadProps {
    emotion: Emotion;
    blink?: boolean;
    className?: string;
}

// Exported RobotHead component - can be re-parented
export const RobotHead: React.FC<RobotHeadProps> = ({ emotion, blink = false, className = '' }) => {
    return (
        <div className={`relative z-20 w-20 h-14 bg-gradient-to-b from-white to-slate-200 rounded-[50%] shadow-[0_5px_15px_rgba(0,0,0,0.1)] flex items-center justify-center border border-white/50 ${className}`}>
            {/* FACE MASK (Inset Black Glass) */}
            <div className="w-[90%] h-[80%] bg-black rounded-[45%] flex items-center justify-center gap-3 overflow-hidden relative shadow-inner border border-slate-800">
                {/* Eyes */}
                <div className={`w-6 h-4 bg-cyan-400 rounded-[50%] shadow-[0_0_15px_#22d3ee] transition-all duration-300 ${getEyeStyle(emotion, 'left')} ${blink ? 'scale-y-[0.1]' : ''}`}>
                    <div className="w-full h-full bg-[repeating-linear-gradient(transparent,transparent_2px,rgba(0,0,0,0.3)_3px)] opacity-50" />
                </div>
                <div className={`w-6 h-4 bg-cyan-400 rounded-[50%] shadow-[0_0_15px_#22d3ee] transition-all duration-300 ${getEyeStyle(emotion, 'right')} ${blink ? 'scale-y-[0.1]' : ''}`}>
                    <div className="w-full h-full bg-[repeating-linear-gradient(transparent,transparent_2px,rgba(0,0,0,0.3)_3px)] opacity-50" />
                </div>
                {/* Reflections/Glint on Glass */}
                <div className="absolute top-1 right-3 w-3 h-1.5 bg-white/20 rounded-full rotate-[-15deg]" />
            </div>
        </div>
    );
};

interface RobotHandsProps {
    grabbingDialog?: boolean;
    className?: string;
}

// Exported RobotHands component - positioned relative to parent container
export const RobotHands: React.FC<RobotHandsProps> = ({ grabbingDialog = false, className = '' }) => {
    if (grabbingDialog) {
        // When grabbing dialog: hands positioned at dialog top edge, gripping
        // ASYMMETRIC: Left hand leads (higher, more rotation), right hand supports
        return (
            <div className={`absolute top-0 left-0 right-0 flex justify-between px-4 pointer-events-none ${className}`} style={{ transform: 'translateY(-50%)' }}>
                {/* Left hand - LEADS: grabbed higher, more rotation */}
                <motion.div
                    initial={{ rotate: 0, y: 20 }}
                    animate={{ rotate: 30, y: -2 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="w-4 h-11 bg-gradient-to-r from-slate-200 to-white rounded-full shadow-md origin-bottom"
                />
                {/* Right hand - SUPPORTS: slightly lower, less rotation */}
                <motion.div
                    initial={{ rotate: 0, y: 20 }}
                    animate={{ rotate: -22, y: 4 }}
                    transition={{ duration: 0.3, ease: 'easeOut', delay: 0.05 }}
                    className="w-4 h-10 bg-gradient-to-l from-slate-200 to-white rounded-full shadow-md origin-bottom"
                />
            </div>
        );
    }

    // Normal idle hands (not grabbing)
    return (
        <div className={`absolute w-full flex justify-between pointer-events-none ${className}`}>
            {/* Left arm */}
            <div className="w-4 h-14 bg-gradient-to-r from-slate-200 to-white rounded-full shadow-md animate-[breathingArmLeft_4s_ease-in-out_infinite]" />
            {/* Right arm */}
            <div className="w-4 h-14 bg-gradient-to-l from-slate-200 to-white rounded-full shadow-md animate-[breathingArmRight_4s_ease-in-out_infinite_reverse]" />
        </div>
    );
};

interface RobotBodyProps {
    className?: string;
}

// Exported RobotBody component - only shown in idle state
export const RobotBody: React.FC<RobotBodyProps> = ({ className = '' }) => {
    return (
        <div className={`relative z-10 w-16 h-20 bg-gradient-to-tr from-slate-200 via-white to-slate-100 shadow-[0_10px_20px_rgba(0,0,0,0.15)] flex flex-col items-center ${className}`}
            style={{ borderRadius: '50% 50% 50% 50% / 15% 15% 85% 85%' }}>
            {/* Chest Symbol */}
            <div className="absolute top-4 flex gap-0.5 opacity-80">
                <div className="w-1 h-2 bg-red-500 rounded-sm animate-pulse" />
                <div className="w-1 h-3 bg-yellow-400 rounded-sm animate-pulse delay-75" />
                <div className="w-1 h-1.5 bg-green-500 rounded-sm animate-pulse delay-150" />
            </div>

            {/* Shoulder joints */}
            <div className="absolute top-[1rem] w-full flex justify-between px-0">
                <div className="w-4 h-4 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full shadow-md border border-slate-500 -translate-x-2" />
                <div className="w-4 h-4 bg-gradient-to-bl from-slate-400 to-slate-600 rounded-full shadow-md border border-slate-500 translate-x-2" />
            </div>
        </div>
    );
};

interface RobotFullProps {
    emotion: Emotion;
    blink?: boolean;
    onClick?: () => void;
    isHovered?: boolean;
    className?: string;
}

// Full robot assembly for IDLE state (standalone floating robot)
export const RobotFull: React.FC<RobotFullProps> = ({ emotion, blink = false, onClick, isHovered = false, className = '' }) => {
    const displayedEmotion = isHovered && emotion === 'idle' ? 'happy' : emotion;

    return (
        <div
            onClick={onClick}
            className={`relative w-24 h-32 flex flex-col items-center justify-center cursor-pointer animate-[float_6s_ease-in-out_infinite] ${className}`}
        >
            <RobotHead emotion={displayedEmotion} blink={blink} />
            <div className="h-1" /> {/* Neck gap */}
            <RobotBody />

            {/* Arms attached to body */}
            <div className="absolute top-[4.5rem] w-full flex justify-between px-0">
                <div className="w-4 h-14 bg-gradient-to-r from-slate-200 to-white rounded-full shadow-md origin-top rotate-[5deg] animate-[breathingArmLeft_4s_ease-in-out_infinite] -translate-x-1" />
                <div className="w-4 h-14 bg-gradient-to-l from-slate-200 to-white rounded-full shadow-md origin-top rotate-[-5deg] animate-[breathingArmRight_4s_ease-in-out_infinite_reverse] translate-x-1" />
            </div>

            {/* Shadow */}
            <div className="absolute -bottom-6 w-16 h-4 bg-black/20 rounded-[50%] blur-sm" />

            {/* Keyframe animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes breathingArmLeft {
                    0%, 100% { transform: rotate(5deg); }
                    50% { transform: rotate(10deg); }
                }
                @keyframes breathingArmRight {
                    0%, 100% { transform: rotate(-5deg); }
                    50% { transform: rotate(-10deg); }
                }
            `}</style>
        </div>
    );
};
