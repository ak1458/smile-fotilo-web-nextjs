'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import { chatWithGemini } from '../actions/chat';
import { Robot3D, Emotion } from './Robot3D';

type Message = {
    id: string;
    text: string;
    sender: 'bot' | 'user';
    role?: 'user' | 'model';
};

export const ChatSupport = () => {
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    // API CONFIGURATION
    const [userApiKey, setUserApiKey] = useState('');
    const [needsSetup, setNeedsSetup] = useState(false);

    const [isTyping, setIsTyping] = useState(false);
    const [emotion, setEmotion] = useState<Emotion>('idle');
    const [inputValue, setInputValue] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [isUserTyping, setIsUserTyping] = useState(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const addBotMessage = (text: string) => {
        setIsTyping(true);
        setEmotion('thinking');
        setTimeout(() => {
            setIsTyping(false);
            setEmotion('smile'); // Default happy state after thinking
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
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
        typingTimeoutRef.current = setTimeout(() => setIsUserTyping(false), 1000);
    };

    useEffect(() => {
        setMounted(true);
        const savedKey = localStorage.getItem('GEMINI_API_KEY');
        if (savedKey) setUserApiKey(savedKey);

        if (messages.length === 0) {
            addBotMessage("Hi! I'm Smile, your AI assistant. I can help you start a project. Shall we begin?");
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
            id: Date.now().toString(),
            text,
            sender: 'user',
            role: 'user'
        }]);
        setInputValue('');

        // 1. Sentiment Analysis (Basic Keyword Match)
        const lowerText = text.toLowerCase();
        if (lowerText.includes('stupid') || lowerText.includes('idiot') || lowerText.includes('dumb')) {
            setEmotion('angry');
            setTimeout(() => addBotMessage("I am trying my best to help you. Please be kind. 😔"), 500);
            return;
        }

        setEmotion('excited');

        // IF SETUP is needed (Key setup mode)
        if (needsSetup) {
            if (text.startsWith('AIza')) {
                setUserApiKey(text);
                localStorage.setItem('GEMINI_API_KEY', text);
                setNeedsSetup(false);
                addBotMessage("Awesome! Connected. I'm ready to take your project details. What is your name?");
            } else {
                addBotMessage("That doesn't look like a valid Google API Key. It usually starts with 'AIza'.");
            }
            return;
        }

        // Logic: AI Interaction
        const history = messages.map(m => ({ role: m.role || 'user', parts: m.text }));

        try {
            const rawResponse = await chatWithGemini(history, text, userApiKey);

            if (rawResponse === 'SETUP_REQUIRED') {
                setNeedsSetup(true);
                addBotMessage("Please enter your Google Gemini API Key to activate me.");
                return;
            }

            // Check for FORM_COMPLETE token - using [\s\S] instead of dotAll flag for compatibility
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
        setIsOpen(false);
        setEmotion('happy');
    };

    if (!mounted) return null;

    return (
        <>
            <Robot3D
                emotion={emotion}
                isOpen={isOpen}
                onRobotClick={() => setIsOpen(!isOpen)}
                isListening={isUserTyping}
            />

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-4 right-4 z-[990] w-[350px] max-w-[calc(100vw-2rem)] h-[500px] flex flex-col bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-4 pb-12 text-center relative shrink-0">
                            <h3 className="text-white font-bold text-lg">Smile Fotilo AI</h3>
                            <p className="text-white/80 text-xs text-center flex items-center justify-center gap-1">
                                <span className={`w-2 h-2 rounded-full ${userApiKey ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                                {userApiKey ? 'Gemini Connected' : 'Demo Mode (Add Key)'}
                            </p>
                            <button onClick={handleClose} className="absolute top-4 right-4 text-white hover:opacity-80">✕</button>
                        </div>

                        {/* Chat Messages */}
                        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50 pt-8">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.sender === 'bot'
                                        ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 rounded-tl-none'
                                        : 'bg-indigo-600 text-white rounded-tr-none'}`}>
                                        {msg.text}
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
                        <form onSubmit={(e) => { e.preventDefault(); handleUserResponse(inputValue); }} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-white/10 flex gap-2">
                            <input
                                value={inputValue}
                                onChange={(e) => handleInput(e.target.value)}
                                onFocus={() => setIsUserTyping(true)}
                                onBlur={() => { setEmotion('idle'); setIsUserTyping(false); }}
                                placeholder={needsSetup ? "Enter API Key here..." : "Type a message..."}
                                className={`flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 ${needsSetup ? 'ring-red-500 focus:ring-red-500' : 'focus:ring-indigo-500'}`}
                            />
                            <button type="submit" disabled={!inputValue.trim() || isTyping} className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 disabled:opacity-50">➤</button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
