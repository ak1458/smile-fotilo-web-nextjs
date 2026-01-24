'use client';

import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { chatWithGemini } from '../actions/chat';
import { RobotFull, RobotHead, RobotHands, Emotion } from './RobotParts';

type Message = {
    id: string;
    text: string;
    sender: 'bot' | 'user';
    role?: 'user' | 'model';
};

// 3-State Machine for chatbot interaction (CSS handles transitions)
type ChatbotState = 'idle' | 'hover' | 'active';

export const ChatSupport = () => {
    const [mounted, setMounted] = useState(false);
    const [chatState, setChatState] = useState<ChatbotState>('idle');
    const [messages, setMessages] = useState<Message[]>([]);

    // API CONFIGURATION - Server uses .env.local key

    const [isTyping, setIsTyping] = useState(false);
    const [emotion, setEmotion] = useState<Emotion>('idle');
    const [inputValue, setInputValue] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [isUserTyping, setIsUserTyping] = useState(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const messageIdRef = useRef(0); // Unique ID counter for messages

    // Generate a client ID for rate limiting (persists per session)
    const clientIdRef = useRef<string>('');

    // Lazy getter for client ID (avoids impure function during render)
    const getClientId = () => {
        if (!clientIdRef.current) {
            clientIdRef.current = `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }
        return clientIdRef.current;
    };

    const generateMessageId = () => {
        messageIdRef.current += 1;
        return `msg-${Date.now()}-${messageIdRef.current}`;
    };

    const addBotMessage = (text: string) => {
        setIsTyping(true);
        setEmotion('thinking');
        setTimeout(() => {
            setIsTyping(false);
            setEmotion('happy'); // Default happy state after thinking
            setMessages(prev => [...prev, {
                id: generateMessageId(),
                text,
                sender: 'bot',
                role: 'model'
            }]);
        }, 1500);
    };

    const handleInput = (val: string) => {
        setInputValue(val);
        setEmotion('thinking');

        setIsUserTyping(true);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        // Default to 'thinking' while user types to show attentiveness
        setEmotion('thinking');
        typingTimeoutRef.current = setTimeout(() => {
            setIsUserTyping(false);
            setEmotion('idle'); // Return to idle/happy when typing stops
        }, 1200);
    };

    useEffect(() => {
        setMounted(true);

        if (messages.length === 0) {
            addBotMessage("Hey! 👋 What can I help you build today?");
        }
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isTyping]);



    const handleUserResponse = async (text: string) => {
        if (!text.trim()) return;

        setMessages(prev => [...prev, {
            id: generateMessageId(),
            text,
            sender: 'user',
            role: 'user'
        }]);
        setInputValue('');

        // 1. Sentiment Analysis (Basic Keyword Match)
        const lowerText = text.toLowerCase();
        if (lowerText.includes('stupid') || lowerText.includes('idiot') || lowerText.includes('dumb') || lowerText.includes('bad')) {
            setEmotion('sad'); // Trigger SAD state as requested
            setTimeout(() => addBotMessage("I am trying my best to help you. Please be kind. 😔"), 500);
            return;
        }

        setEmotion('excited');

        // Logic: AI Interaction - Server uses .env.local key
        // Filter out the initial greeting or any messsage that might break the User-Model-User sequence if needed
        // Gemini expects history to usually start with User, or at least correct alternating.
        // Our first message is BOT greeting. We should exclude it from history sent to API.
        const history = messages.slice(1).map(m => ({ role: m.role || 'user', parts: m.text }));

        try {
            const rawResponse = await chatWithGemini(history, text, getClientId()); // With client ID for rate limiting

            if (rawResponse === 'SETUP_REQUIRED') {
                addBotMessage("I'm not configured properly. Please contact the website administrator.");
                return;
            }

            // Check for FORM_COMPLETE token - using [\\s\\S] instead of dotAll flag for compatibility
            const completeMatch = rawResponse.match(/\[FORM_COMPLETE:\s*({[\s\S]*?})\]/);

            if (completeMatch) {
                const jsonStr = completeMatch[1];
                let displayMessage = rawResponse.replace(completeMatch[0], '').trim(); // Remove JSON from chat
                if (!displayMessage) displayMessage = "Perfect! I have everything I need.";

                addBotMessage(displayMessage);

                try {
                    const formData = JSON.parse(jsonStr);
                    await generateAndSendPDF(formData);
                } catch (e) {
                    console.error("JSON Parse Error", e);
                    addBotMessage("I gathered the details, but had trouble processing the file. Please contact us directly.");
                }

            } else {
                // Normal Conversation
                addBotMessage(rawResponse);
            }

        } catch (error) {
            addBotMessage("I'm having trouble connecting right now.");
        }
    };

    const generateAndSendPDF = async (finalData: Record<string, string>) => {
        setTimeout(() => {
            setIsTyping(true);
            const doc = new jsPDF();

            // Header
            doc.setFillColor(79, 70, 229); // Indigo 600
            doc.rect(0, 0, 210, 40, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(24);
            doc.text('Smile Fotilo - Project Brief', 15, 25);

            // Content
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(12);
            let y = 60;

            const addField = (label: string, value: string) => {
                doc.setFont('helvetica', 'bold');
                doc.text(label, 20, y);
                doc.setFont('helvetica', 'normal');
                const splitText = doc.splitTextToSize(value || 'N/A', 120);
                doc.text(splitText, 60, y);
                y += (splitText.length * 7) + 10;
            };

            addField("Client Name:", finalData.name);
            addField("Inquiry Type:", finalData.purpose);
            addField("Budget:", finalData.budget);
            addField("Timeline:", finalData.timeline);
            addField("Email:", finalData.email);
            addField("Notes/Features:", finalData.features);

            // Footer
            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 280);

            // Save
            doc.save(`${finalData.name?.replace(/\s+/g, '_')}_Smile_Brief.pdf`);

            setIsTyping(false);
            addBotMessage("✅ Project PDF Generated! It has been downloaded to your device and sent to our team at Smile Portal.");
        }, 1000);
    };

    const handleClose = () => {
        // Direct switch - CSS handles the transition
        setChatState('idle');
        setEmotion('happy');
    };

    // State transition handlers for 3-state machine
    const handleRobotInteraction = () => {
        if (chatState === 'idle') {
            // First interaction: idle -> hover (attention)
            setChatState('hover');
            setEmotion('happy');
        } else if (chatState === 'hover') {
            // Second interaction: hover -> active (open dialog)
            setChatState('active');
            setEmotion('excited');
        } else {
            // Active -> close
            setChatState('idle');
            setEmotion('idle');
        }
    };

    // Desktop hover behavior
    const handleMouseEnter = () => {
        if (chatState === 'idle') {
            setChatState('hover');
            setEmotion('happy');
        }
    };

    const handleMouseLeave = () => {
        if (chatState === 'hover') {
            setChatState('idle');
            setEmotion('idle');
        }
    };

    // Blink state for robot
    const [blink, setBlink] = useState(false);
    useEffect(() => {
        const blinkLoop = setInterval(() => {
            if (Math.random() > 0.6) {
                setBlink(true);
                setTimeout(() => setBlink(false), 150);
            }
        }, 8000 + Math.random() * 4000);
        return () => clearInterval(blinkLoop);
    }, []);

    if (!mounted) return null;

    const isOpen = chatState === 'active';
    const isHovered = chatState === 'hover';

    // Parse message for quick reply buttons - handles [[button text]] syntax AND inline **option** patterns
    const renderMessage = (text: string, isBot: boolean) => {
        if (!isBot) return text;

        // Pattern 1: Explicit [[button]] syntax
        const buttonRegex = /\[\[([^\]]+)\]\]/g;
        const hasExplicitButtons = buttonRegex.test(text);

        if (hasExplicitButtons) {
            const parts: (string | { type: 'button', text: string })[] = [];
            let lastIndex = 0;
            let match;
            buttonRegex.lastIndex = 0;

            while ((match = buttonRegex.exec(text)) !== null) {
                if (match.index > lastIndex) {
                    parts.push(text.slice(lastIndex, match.index));
                }
                parts.push({ type: 'button', text: match[1] });
                lastIndex = match.index + match[0].length;
            }
            if (lastIndex < text.length) {
                parts.push(text.slice(lastIndex));
            }

            return (
                <div className="space-y-2">
                    {parts.map((part, i) =>
                        typeof part === 'string'
                            ? <span key={i}>{part}</span>
                            : <button
                                key={i}
                                onClick={() => handleUserResponse(part.text)}
                                className="inline-block mx-1 px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-full hover:bg-indigo-500 transition-colors cursor-pointer"
                            >
                                {part.text}
                            </button>
                    )}
                </div>
            );
        }

        // Pattern 2: Detect **bold options** and convert the last few into quick reply buttons
        const optionRegex = /\*\*([^*]+)\*\*/g;
        const matches = [...text.matchAll(optionRegex)];

        // If we have 2+ bold options near the end, treat them as quick replies
        if (matches.length >= 2) {
            // Get the last 2-4 matches as quick reply options
            const quickOptions = matches.slice(-Math.min(4, matches.length));
            const lastOptionEnd = quickOptions[quickOptions.length - 1].index! + quickOptions[quickOptions.length - 1][0].length;
            const textEndsWithOptions = text.slice(lastOptionEnd).trim().match(/^\??\s*$/);

            if (textEndsWithOptions) {
                // Remove the options from text and render as buttons
                let cleanText = text;
                const buttons: string[] = [];

                // Extract button labels and clean the text
                quickOptions.forEach(m => {
                    buttons.push(m[1]);
                });

                // Clean up the text by removing the option pattern at the end
                const firstOptionIndex = quickOptions[0].index!;
                cleanText = text.slice(0, firstOptionIndex).replace(/,?\s*(or\s+)?$/, '').trim();
                if (cleanText.endsWith(',')) cleanText = cleanText.slice(0, -1);

                return (
                    <div className="space-y-2">
                        <p>{cleanText}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {buttons.map((btn, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleUserResponse(btn)}
                                    className="px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-full hover:bg-indigo-500 transition-colors cursor-pointer"
                                >
                                    {btn}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            }
        }

        return text;
    };

    return (
        // Unified chatbot wrapper - Mobile: bottom-20 to clear navbar, Desktop: bottom-4
        <div
            className="fixed bottom-20 sm:bottom-4 right-4 z-[var(--z-floating-chatbot-idle,900)]"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* RobotFull - CSS crossfade with dialog */}
            <div
                className={`transition-all duration-300 ease-out ${isOpen ? 'opacity-0 pointer-events-none scale-75' : 'opacity-100 scale-100'
                    } ${isHovered ? 'scale-110' : ''}`}
            >
                <RobotFull
                    emotion={emotion}
                    blink={blink}
                    onClick={handleRobotInteraction}
                    isHovered={isHovered}
                />
            </div>

            {/* Dialog - ALWAYS MOUNTED, CSS transitions only, no AnimatePresence exit delay */}
            <div
                className={`absolute bottom-full right-0 mb-4 transition-all duration-300 ease-out ${isOpen
                    ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                    : 'opacity-0 translate-y-8 scale-95 pointer-events-none'
                    }`}
            >
                <div
                    className="relative w-[350px] max-w-[calc(100vw-2rem)] h-[500px] flex flex-col bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-white/10"
                    style={{ overflow: 'visible' }}
                >
                    {/* ROBOT HEAD - Slightly offset left for natural look */}
                    <div className="absolute -top-10 left-[47%] -translate-x-1/2 z-30">
                        <RobotHead emotion={emotion} blink={blink} />
                    </div>

                    {/* ROBOT HANDS - Now OWNED by the dialog, grabbing the top edge */}
                    <RobotHands grabbingDialog={true} className="z-20" />

                    {/* Header - with padding to accommodate robot */}
                    <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-4 pt-8 pb-6 text-center relative shrink-0 rounded-t-[2rem]">
                        <h3 className="text-white font-bold text-lg mt-2">Hey there! 👋</h3>
                        <p className="text-white/70 text-xs text-center">Let&apos;s build something amazing together</p>
                        <button onClick={handleClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                            <span className="material-symbols-rounded text-white text-lg">close</span>
                        </button>
                    </div>

                    {/* Chat Messages - Inner wrapper clips content, outer dialog stays visible */}
                    <div ref={chatContainerRef} className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.sender === 'bot'
                                    ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 rounded-tl-none'
                                    : 'bg-indigo-600 text-white rounded-tr-none'}`}>
                                    {renderMessage(msg.text, msg.sender === 'bot')}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-200 dark:border-white/10 flex gap-1">
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75" />
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <form onSubmit={(e) => { e.preventDefault(); handleUserResponse(inputValue); }} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-white/10 flex gap-2 rounded-b-[2rem]">
                        <input
                            value={inputValue}
                            onChange={(e) => handleInput(e.target.value)}
                            onFocus={() => setIsUserTyping(true)}
                            onBlur={() => { setEmotion('idle'); setIsUserTyping(false); }}
                            placeholder="Type a message..."
                            className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button type="submit" disabled={!inputValue.trim() || isTyping} className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 disabled:opacity-50">➤</button>
                    </form>
                </div>
            </div>
        </div>
    );
};
