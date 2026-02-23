'use client';

import React, { useState, useEffect, useRef } from 'react';
import { chatWithGemini } from '../actions/chat';
import { AI_MODELS } from '../data/aiModels';
import { EchoIcon } from './EchoIcon';
import { MdClose, MdSend } from 'react-icons/md';

type Message = {
    id: string;
    text: string;
    sender: 'bot' | 'user';
    role?: 'user' | 'model';
    quickReplies?: string[];
};

type ChatbotState = 'idle' | 'hover' | 'active';
type OpenChatEventDetail = { message?: string };

const OPEN_CHAT_EVENT = 'echo:open-chat';

export const ChatSupport = () => {
    const [mounted, setMounted] = useState(false);
    const [chatState, setChatState] = useState<ChatbotState>('idle');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [showTooltip, setShowTooltip] = useState(true);
    const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
    const [selectedModel, setSelectedModel] = useState(() => {
        if (typeof window !== 'undefined') return localStorage.getItem('echo_model') || 'auto';
        return 'auto';
    });
    const [showModelPicker, setShowModelPicker] = useState(false);

    const chatContainerRef = useRef<HTMLDivElement>(null);
    const messageIdRef = useRef(0);
    const clientIdRef = useRef<string>('');
    const initializedRef = useRef(false);
    const CLIENT_ID_STORAGE_KEY = 'echo_client_id';

    const getClientId = () => {
        if (!clientIdRef.current) {
            let stableId = '';
            if (typeof window !== 'undefined') {
                try {
                    const existing = localStorage.getItem(CLIENT_ID_STORAGE_KEY);
                    if (existing && /^client-[a-z0-9-]+$/i.test(existing)) {
                        stableId = existing;
                    } else {
                        stableId = `client-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
                        localStorage.setItem(CLIENT_ID_STORAGE_KEY, stableId);
                    }
                } catch {
                    stableId = '';
                }
            }
            clientIdRef.current = stableId || `client-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
        }
        return clientIdRef.current;
    };

    const generateMessageId = () => {
        messageIdRef.current += 1;
        return `msg-${Date.now()}-${messageIdRef.current}`;
    };

    // Parse AI response for quick replies - flexible to catch various AI formats
    const parseResponse = (response: string): { text: string; quickReplies?: string[] } => {
        // Try different patterns the AI might use
        // Pattern 1: [QUICK_REPLIES: Option1 | Option2]
        // Pattern 2: [Option1 | Option2]
        // Pattern 3: [OPTION1 | OPTION2]
        const patterns = [
            /\[QUICK_REPLIES:\s*([^\]]+)\]/i,
            /\[([A-Z0-9_\s🌐🎨📈💬🏢🛒📸🤷💵💰💎🏆🚨📅🗓️⏳📧📞🔄👋📄]+(?:\s*\|\s*[A-Z0-9_\s🌐🎨📈💬🏢🛒📸🤷💵💰💎🏆🚨📅🗓️⏳📧📞🔄👋📄]+)+)\]/i
        ];

        for (const pattern of patterns) {
            const match = response.match(pattern);
            if (match) {
                const text = response.replace(match[0], '').trim();
                const quickReplies = match[1]
                    .split('|')
                    .map(r => r.trim().replace(/_/g, ' '))
                    .filter(r => r && r.length > 0);
                if (quickReplies.length >= 2) {
                    return { text, quickReplies };
                }
            }
        }

        return { text: response };
    };

    // Client-side fallback when server action fails, so chat never dead-ends.
    const getClientFallbackReply = (raw: string): { text: string; quickReplies?: string[] } => {
        const text = raw.toLowerCase();

        if (text.includes('price') || text.includes('pricing') || text.includes('cost') || text.includes('budget')) {
            return {
                text: "Starter is INR 15k, Growth starts INR 35k, and Growth Autopilot starts INR 9,999 monthly.",
                quickReplies: ["Starter plan", "Growth plan", "Autopilot plan"]
            };
        }

        if (text.includes('autopilot') || text.includes('clinic') || text.includes('automation')) {
            return {
                text: "Growth Autopilot is clinic-first and automates followups, reminders, reviews, and bilingual support.",
                quickReplies: ["How it works", "Book pilot", "Pricing"]
            };
        }

        if (text.includes('service') || text.includes('offer')) {
            return {
                text: "We offer web development, SEO, branding, and Growth Autopilot automation.",
                quickReplies: ["Web Design", "SEO", "Growth Autopilot"]
            };
        }

        return {
            text: "I am in basic mode right now. Ask pricing, services, autopilot, or contact details.",
            quickReplies: ["Pricing", "Services", "Contact"]
        };
    };

    const addBotMessage = (text: string, quickReplies?: string[]) => {
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, {
                id: generateMessageId(),
                text,
                sender: 'bot',
                role: 'model',
                quickReplies
            }]);
        }, 700);
    };

    const addUserMessage = (text: string) => {
        setMessages(prev => [...prev, {
            id: generateMessageId(),
            text,
            sender: 'user',
            role: 'user'
        }]);
    };

    // Initial greeting - powered by AI
    const sendInitialGreeting = async () => {
        setIsTyping(true);
        try {
            const response = await chatWithGemini([], "Greet the user warmly and ask what kind of project they're thinking about.", getClientId());
            const parsed = parseResponse(response);
            setIsTyping(false);
            setMessages([{
                id: generateMessageId(),
                text: parsed.text,
                sender: 'bot',
                role: 'model',
                quickReplies: parsed.quickReplies
            }]);
        } catch {
            setIsTyping(false);
            setMessages([{
                id: generateMessageId(),
                text: "Hey! 👋 What kind of project are you thinking about?",
                sender: 'bot',
                role: 'model',
                quickReplies: undefined // No fallback - let user type
            }]);
        }
    };

    useEffect(() => {
        setMounted(true);
        if (!initializedRef.current && messages.length === 0) {
            initializedRef.current = true;
            sendInitialGreeting();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Open chatbot from any page CTA.
    useEffect(() => {
        const handleOpenChat = (event: Event) => {
            const customEvent = event as CustomEvent<OpenChatEventDetail>;
            const prompt = customEvent.detail?.message?.trim();

            setShowTooltip(false);
            setChatState('active');

            if (prompt) {
                setPendingPrompt(prompt);
            }
        };

        window.addEventListener(OPEN_CHAT_EVENT, handleOpenChat as EventListener);
        return () => window.removeEventListener(OPEN_CHAT_EVENT, handleOpenChat as EventListener);
    }, []);

    // If a CTA provided a prompt, send it automatically after chat opens.
    useEffect(() => {
        if (!pendingPrompt || isTyping) return;
        addUserMessage(pendingPrompt);
        void sendToAI(pendingPrompt);
        setPendingPrompt(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pendingPrompt, isTyping]);

    // Auto-scroll
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    // Auto-hide tooltip
    useEffect(() => {
        if (showTooltip) {
            const timer = setTimeout(() => setShowTooltip(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [showTooltip]);

    // Send message to AI and get response with dynamic quick replies
    const sendToAI = async (text: string) => {
        // Check for email - capture lead
        const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        if (emailMatch) {
            const summary = messages.map(m => `${m.sender === 'bot' ? 'Echo' : 'User'}: ${m.text}`).join('\n') + `\nUser: ${text}`;
            import('../actions/email').then(({ sendChatLeadEmail }) => {
                sendChatLeadEmail({ email: emailMatch[0], conversationSummary: summary });
            }).catch(console.error);
        }

        setIsTyping(true);

        try {
            const history = messages.map(m => ({ role: m.role || 'user', parts: m.text }));
            const response = await chatWithGemini(history, text, getClientId(), selectedModel);

            if (response === 'SETUP_REQUIRED') {
                addBotMessage("I'm having trouble connecting. Please try again or contact us at +91 9453878422!", ["🔄 Try again", "📞 Call us"]);
                return;
            }

            // Check for FORM_COMPLETE - offer PDF download
            const formMatch = response.match(/\[FORM_COMPLETE:\s*([\s\S]*?)\]/);
            if (formMatch) {
                try {
                    const formData = JSON.parse(formMatch[1]);
                    // Store form data for PDF generation
                    sessionStorage.setItem('chatFormData', JSON.stringify(formData));
                } catch (e) {
                    console.error('Form data parse error:', e);
                }
                const displayText = response.replace(formMatch[0], '').trim() || "Thanks! We have all your details!";
                addBotMessage(displayText, ["📄 Download Summary PDF", "🔄 Start new chat", "👋 Close"]);
                return;
            }

            // Parse response for quick replies
            const parsed = parseResponse(response);
            setIsTyping(false);
            setMessages(prev => [...prev, {
                id: generateMessageId(),
                text: parsed.text,
                sender: 'bot',
                role: 'model',
                quickReplies: parsed.quickReplies
            }]);

        } catch {
            const fallback = getClientFallbackReply(text);
            addBotMessage(fallback.text, fallback.quickReplies);
        }
    };

    // Handle quick reply click
    const handleQuickReply = (reply: string) => {
        if (reply === "👋 Close") {
            handleClose();
            return;
        }
        if (reply === "📞 Call us") {
            addUserMessage(reply);
            addBotMessage("Call us at +91 9453878422, Mon-Sat 9AM-6PM! 📞", ["🔄 Start over", "👋 Close"]);
            return;
        }
        if (reply === "🔄 Try again" || reply === "🔄 Start over" || reply === "🔄 Start new chat") {
            setMessages([]);
            initializedRef.current = false;
            sendInitialGreeting();
            return;
        }
        if (reply === "📄 Download Summary PDF") {
            // Generate and download PDF
            const storedData = sessionStorage.getItem('chatFormData');
            if (storedData) {
                import('../utils/generatePDF').then(({ downloadProjectSummary }) => {
                    downloadProjectSummary(JSON.parse(storedData));
                }).catch(() => {
                    addBotMessage("Sorry, couldn't generate PDF. Please contact us directly!", ["📞 Call us", "👋 Close"]);
                });
            } else {
                // Use conversation summary instead
                const summary = messages.filter(m => m.sender === 'user').map(m => m.text).join(', ');
                import('../utils/generatePDF').then(({ downloadProjectSummary }) => {
                    downloadProjectSummary({ purpose: summary, name: 'Visitor' });
                }).catch(() => {
                    addBotMessage("Sorry, couldn't generate PDF. Please contact us directly!", ["📞 Call us", "👋 Close"]);
                });
            }
            addBotMessage("PDF downloaded! Check your downloads folder. 📁", ["🔄 New conversation", "👋 Close"]);
            return;
        }

        addUserMessage(reply);
        sendToAI(reply);
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isTyping) return;

        const text = inputValue.trim();
        setInputValue('');
        addUserMessage(text);
        await sendToAI(text);
    };

    // State handlers
    const handleClose = () => setChatState('idle');
    const handleRobotInteraction = () => setChatState(chatState === 'active' ? 'idle' : 'active');
    const handleMouseEnter = () => { if (chatState === 'idle') setChatState('hover'); };
    const handleMouseLeave = () => { if (chatState === 'hover') setChatState('idle'); };

    if (!mounted) return null;
    const isOpen = chatState === 'active';
    const isHovered = chatState === 'hover';

    return (
        <div
            className="fixed bottom-20 sm:bottom-4 right-4 z-[900]"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Echo Icon */}
            <div className={`transition-all duration-300 ${isOpen ? 'opacity-0 pointer-events-none scale-75' : 'opacity-100 scale-100'}`}>
                {showTooltip && !isOpen && (
                    <div className="absolute bottom-full right-0 mb-2 whitespace-nowrap animate-fade-in">
                        <div className="relative bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm font-medium pl-3 pr-8 py-2 rounded-xl shadow-lg border border-slate-200 dark:border-white/10">
                            Need help? 💬
                            <button onClick={(e) => { e.stopPropagation(); setShowTooltip(false); }}
                                className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">×</button>
                            <div className="absolute bottom-0 right-6 translate-y-1/2 rotate-45 w-2 h-2 bg-white dark:bg-slate-800 border-r border-b border-slate-200 dark:border-white/10"></div>
                        </div>
                    </div>
                )}
                <EchoIcon size={56} onClick={handleRobotInteraction} isHovered={isHovered} />
            </div>

            {/* Chat Dialog */}
            <div className={`absolute bottom-full right-0 mb-4 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-8 scale-95 pointer-events-none'}`}>
                <div className="relative w-[360px] max-w-[calc(100vw-2rem)] h-[520px] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-4 text-center relative shrink-0">
                        <h3 className="text-white font-bold text-lg">Echo Assistant</h3>
                        <button
                            onClick={() => setShowModelPicker(!showModelPicker)}
                            className="text-white/70 text-xs hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-1 mx-auto"
                        >
                            {AI_MODELS.find(m => m.id === selectedModel)?.name || '⚡ Auto (Smart)'}
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={`transition-transform ${showModelPicker ? 'rotate-180' : ''}`}><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                        <button onClick={handleClose} className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                            <MdClose className="text-white text-lg" />
                        </button>
                    </div>

                    {/* Model Picker Dropdown */}
                    {showModelPicker && (
                        <div className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-2 max-h-[200px] overflow-y-auto shrink-0">
                            {AI_MODELS.map((model) => (
                                <button
                                    key={model.id}
                                    onClick={() => {
                                        setSelectedModel(model.id);
                                        localStorage.setItem('echo_model', model.id);
                                        setShowModelPicker(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${selectedModel === model.id
                                        ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300'
                                        : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                                        }`}
                                >
                                    <span className="font-medium">{model.name}</span>
                                    <span className="text-xs text-slate-400">{model.description}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Messages */}
                    <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-900/50">
                        {messages.map((msg) => (
                            <div key={msg.id} className="space-y-2">
                                <div className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.sender === 'bot'
                                        ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 rounded-tl-none'
                                        : 'bg-indigo-600 text-white rounded-tr-none'}`}>
                                        {msg.text}
                                    </div>
                                </div>

                                {/* Quick Reply Buttons - AI Generated */}
                                {msg.sender === 'bot' && msg.quickReplies && msg.quickReplies.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pl-2">
                                        {msg.quickReplies.map((reply, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleQuickReply(reply)}
                                                className="px-3 py-2 text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-full border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-100 dark:hover:bg-indigo-800/50 transition-all hover:scale-105 active:scale-95"
                                            >
                                                {reply}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-200 dark:border-white/10">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-white/10 flex gap-2">
                        <input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type a message..."
                            disabled={isTyping}
                            className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                        />
                        <button type="submit" disabled={!inputValue.trim() || isTyping} className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 disabled:opacity-50 transition-colors">
                            <MdSend className="text-lg" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
