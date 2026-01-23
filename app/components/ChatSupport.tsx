'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import { chatWithGemini } from '../actions/chat';
import { logMissingKnowledge } from '../actions/log';
import { Robot3D, Emotion } from './Robot3D';

type Message = {
    id: string;
    text: string;
    sender: 'bot' | 'user';
    role?: 'user' | 'model';
};

type UserData = {
    name: string;
    service: string;
    email: string;
    phone: string;
    details: string;
};

const STEPS = [
    { key: 'name', prompt: "Hi! I'm your Smile Fotilo AI assistant. What's your name?" },
    { key: 'service', prompt: "Nice to meet you! What service are you looking for today? (e.g., Web Design, Marketing, Branding)" },
    { key: 'email', prompt: "Great! Please share your email address so we can send you the details." },
    { key: 'phone', prompt: "And your phone number for quick contact?" },
    { key: 'details', prompt: "Perfect. Tell me a bit more about your project needs." },
];

export const ChatSupport = () => {
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    // API CONFIGURATION
    const [userApiKey, setUserApiKey] = useState('');
    const [needsSetup, setNeedsSetup] = useState(false);

    // Data gathering state
    const [userData, setUserData] = useState<UserData>({
        name: '', service: '', email: '', phone: '', details: ''
    });
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isFlowComplete, setIsFlowComplete] = useState(false);

    const [isTyping, setIsTyping] = useState(false);
    const [emotion, setEmotion] = useState<Emotion>('idle');
    const [inputValue, setInputValue] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [isUserTyping, setIsUserTyping] = useState(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
            addBotMessage(STEPS[0].prompt);
        }
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

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
        if (lowerText.includes('stupid') || lowerText.includes('idiot') || lowerText.includes('dumb') || lowerText.includes('useless')) {
            setEmotion('angry');
            setTimeout(() => addBotMessage("Hey, that's not very nice! I'm doing my best here. 😤"), 500);
            return;
        }

        setEmotion('excited');

        // IF SETUP is needed (Key setup mode)
        if (needsSetup) {
            if (text.startsWith('AIza')) {
                setUserApiKey(text);
                localStorage.setItem('GEMINI_API_KEY', text);
                setNeedsSetup(false);
                addBotMessage("Awesome! API Key saved. connecting to my brain... 🧠. Ask me anything now!");
                setIsFlowComplete(true);
            } else {
                addBotMessage("That doesn't look like a valid Google API Key. It usually starts with 'AIza'. Try again?");
            }
            return;
        }

        // Logic: Flow Complete (Free Chat)
        if (isFlowComplete) {
            const history = messages.map(m => ({ role: m.role || 'user', parts: m.text }));
            const response = await chatWithGemini(history, text, userApiKey);

            if (response === 'SETUP_REQUIRED') {
                setNeedsSetup(true);
                addBotMessage("I'm not connected to the cloud yet! Please enter your Google Gemini API Key to activate my full intelligence. (It starts with 'AIza'...)");
            } else if (response.includes('IDK_RESPONSE')) {
                // Unknown Answer Handling
                setEmotion('sad');
                await logMissingKnowledge(text);
                addBotMessage("I'm sorry, I don't know the answer to that yet. 😔 I've logged this question for my human team to review and teach me later!");
            } else {
                addBotMessage(response);
            }
            return;
        }

        // Logic: Data Collection Flow
        const currentStep = STEPS[currentStepIndex];
        setUserData(prev => ({ ...prev, [currentStep.key]: text }));
        const nextIndex = currentStepIndex + 1;

        if (nextIndex < STEPS.length) {
            setCurrentStepIndex(nextIndex);
            addBotMessage(STEPS[nextIndex].prompt);
        } else {
            setIsFlowComplete(true);
            addBotMessage("Thank you! I've gathered all the details. Generating your project PDF now... 📄");
            await generateAndSendPDF({ ...userData, [currentStep.key]: text });
        }
    };

    const generateAndSendPDF = async (finalData: UserData) => {
        setIsTyping(true);
        const doc = new jsPDF();

        doc.setFontSize(22);
        doc.setTextColor(99, 102, 241);
        doc.text('Smile Fotilo - Project Request', 20, 20);

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Name: ${finalData.name}`, 20, 40);
        doc.text(`Service: ${finalData.service}`, 20, 50);
        doc.text(`Email: ${finalData.email}`, 20, 60);
        doc.text(`Phone: ${finalData.phone}`, 20, 70);
        doc.text('Details:', 20, 90);
        const details = doc.splitTextToSize(finalData.details, 170);
        doc.text(details, 20, 100);

        doc.save(`${finalData.name.replace(/\s+/g, '_')}_Project_Brief.pdf`);

        setTimeout(() => {
            setIsTyping(false);
            addBotMessage("PDF downloaded! I've also emailed our team. Now, feel free to chat with me about anything!");
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
