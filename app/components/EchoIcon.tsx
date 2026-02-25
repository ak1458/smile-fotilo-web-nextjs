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
        <div
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.(); }}
            className={`relative group transition-transform duration-300 cursor-pointer ${isHovered ? 'scale-110' : 'scale-100'} ${className}`}
            aria-label="Open chat"
            style={{ filter: 'drop-shadow(0 4px 16px rgba(110,231,255,0.4))' }}
        >
            <svg
                width={size}
                height={size}
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Glass base with gradient */}
                <rect
                    x="1"
                    y="1"
                    width="38"
                    height="38"
                    rx="12"
                    fill="#1E293B"
                    stroke="rgba(110,231,255,0.3)"
                    strokeWidth="1.5"
                />

                {/* Left eye - vertical bar */}
                <rect
                    x="13"
                    y="14"
                    width="4"
                    height="12"
                    rx="2"
                    fill="#6EE7FF"
                    className="echo-eye"
                />

                {/* Right eye - vertical bar */}
                <rect
                    x="23"
                    y="14"
                    width="4"
                    height="12"
                    rx="2"
                    fill="#6EE7FF"
                    className="echo-eye"
                />
            </svg>

            {/* Glow effect behind */}
            <div
                className={`absolute inset-0 rounded-xl bg-cyan-400/20 blur-md transition-opacity duration-300 -z-10 ${isHovered ? 'opacity-100' : 'opacity-50'}`}
            />

            {/* CSS Blink Animation */}
            <style jsx>{`
                .echo-eye {
                    transform-origin: center;
                    animation: echoEyeBlink 4s infinite;
                }
                @keyframes echoEyeBlink {
                    0%, 94%, 100% { transform: scaleY(1); }
                    96%, 98% { transform: scaleY(0.15); }
                }
            `}</style>
        </div>
    );
};

export default EchoIcon;
