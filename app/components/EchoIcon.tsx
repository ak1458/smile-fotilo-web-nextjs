'use client';

import React from 'react';

interface EchoIconProps {
    size?: number;
    onClick?: () => void;
    isHovered?: boolean;
    className?: string;
}

export const EchoIcon = ({ size = 56, onClick, isHovered = false, className = '' }: EchoIconProps) => {
    return (
        <button
            onClick={onClick}
            className={`relative group transition-transform duration-300 cursor-pointer ${isHovered ? 'scale-110' : 'scale-100'} ${className}`}
            aria-label="Open chat"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(120,160,255,0.25))' }}
        >
            <svg
                width={size}
                height={size}
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="echo-icon"
            >
                {/* Glass base */}
                <rect
                    x="1"
                    y="1"
                    width="38"
                    height="38"
                    rx="12"
                    fill="rgba(30,41,59,0.95)"
                    stroke="rgba(255,255,255,0.18)"
                    strokeWidth="1"
                />

                {/* Horizontal lines */}
                <path
                    d="M14 20H18M22 20H26"
                    stroke="url(#echoGrad)"
                    strokeWidth="2"
                    strokeLinecap="round"
                />

                {/* Vertical bars (eyes) with CSS blink animation */}
                <path
                    d="M16 16V24"
                    className="echo-eye echo-eye-left"
                    stroke="url(#echoGrad)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    style={{ transformOrigin: 'center' }}
                />
                <path
                    d="M24 16V24"
                    className="echo-eye echo-eye-right"
                    stroke="url(#echoGrad)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    style={{ transformOrigin: 'center' }}
                />

                <defs>
                    <linearGradient id="echoGrad" x1="14" y1="20" x2="26" y2="20">
                        <stop offset="0%" stopColor="#6EE7FF" />
                        <stop offset="100%" stopColor="#8B9EFF" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Pulse ring on hover */}
            <span className={`absolute inset-0 rounded-xl transition-all duration-300 ${isHovered
                    ? 'ring-2 ring-cyan-400/50 ring-offset-2 ring-offset-slate-900'
                    : ''
                }`} />

            {/* CSS Blink Animation */}
            <style jsx>{`
                .echo-eye {
                    animation: echoEyeBlink 4.5s infinite;
                }
                @keyframes echoEyeBlink {
                    0%, 96%, 100% { transform: scaleY(1); }
                    97%, 99% { transform: scaleY(0.1); }
                }
            `}</style>
        </button>
    );
};

export default EchoIcon;
