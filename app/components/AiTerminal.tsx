'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { executeTerminalAiCommand } from '../actions/terminalActions';
import { MdClose, MdTerminal, MdMinimize } from 'react-icons/md';

type Log = {
  id: string;
  type: 'system' | 'user' | 'ai' | 'error';
  content: string;
  timestamp: string;
};

export const AiTerminal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<Log[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addLog = (content: string, type: Log['type'] = 'system') => {
    const newLog: Log = {
      id: Math.random().toString(36).substring(7),
      type,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    setLogs((prev) => [...prev, newLog]);
  };

  useEffect(() => {
    if (isOpen) {
      if (logs.length === 0) {
        addLog('SF-OS [Version 16.2.3] Initialized.', 'system');
        addLog('AI Core: Online. Network: Encrypted.', 'system');
        addLog('Type "help" for a list of available commands.', 'system');
      }
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, logs.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCommand = async (cmd: string) => {
    const cleanCmd = cmd.trim().toLowerCase();
    if (!cleanCmd) return;

    addLog(`$ ${cmd}`, 'user');
    setHistory((prev) => [cmd, ...prev].slice(0, 50));
    setHistoryIndex(-1);
    setInput('');

    if (cleanCmd === 'clear') {
      setLogs([]);
      return;
    }

    if (cleanCmd === 'help') {
      addLog('Available Commands:', 'system');
      addLog('  help        - Display this menu', 'system');
      addLog('  status      - Check system health', 'system');
      addLog('  clear       - Wipe terminal output', 'system');
      addLog('  exit        - Terminate session', 'system');
      addLog('  ai <prompt> - Direct interface with Neural Core', 'system');
      return;
    }

    if (cleanCmd === 'status') {
      addLog('--- SYSTEM REPORT ---', 'system');
      addLog('CORE: Next.js 16.2.3 (AI-Native)', 'system');
      addLog('UI: Technical Layer v2.1 (Brutalist)', 'system');
      addLog('AGENT_CONTEXT: ACTIVE', 'system');
      addLog('MEMORY: 82.4% Optimal', 'system');
      return;
    }

    if (cleanCmd === 'exit') {
      onClose();
      return;
    }

    // AI Command (either prefixed with 'ai ' or everything else)
    const prompt = cleanCmd.startsWith('ai ') ? cmd.slice(3) : cmd;
    setIsProcessing(true);
    addLog('Querying Neural Core...', 'system');

    try {
      const response = await executeTerminalAiCommand(prompt);
      // Strip quick replies from terminal output if they exist
      const cleanResponse = response.split('[QUICK_REPLIES')[0].trim();
      addLog(cleanResponse, 'ai');
    } catch (err) {
      addLog('Error: Failed to reach Neural Core.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isProcessing) {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        setInput(history[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInput(history[nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8 pointer-events-none"
        >
          <div className="relative w-full max-w-4xl h-[600px] flex flex-col bg-black border border-[#00ff88]/30 shadow-[0_0_30px_rgba(0,255,136,0.1)] overflow-hidden pointer-events-auto rounded-lg">
            
            {/* CRT Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.03] select-none"
                 style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 4px, 3px 100%' }}></div>
            
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-[#00ff88]/20 bg-[#00ff88]/5">
              <div className="flex items-center gap-2 text-[#00ff88] text-xs font-mono uppercase tracking-widest animate-pulse">
                <MdTerminal className="text-sm" />
                <span>Neural_Terminal_v2.0</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={onClose}
                  className="p-1 text-[#00ff88]/50 hover:text-[#ff3333] transition-colors"
                >
                  <MdClose size={18} />
                </button>
              </div>
            </div>

            {/* Logs Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-2 custom-terminal-scrollbar"
            >
              {logs.map((log) => (
                <div key={log.id} className="flex gap-4">
                  <span className="text-[#00ff88]/30 shrink-0">[{log.timestamp}]</span>
                  <div className={`
                    ${log.type === 'user' ? 'text-white' : ''}
                    ${log.type === 'system' ? 'text-[#00ff88]/70' : ''}
                    ${log.type === 'ai' ? 'text-[#00ff88]' : ''}
                    ${log.type === 'error' ? 'text-red-500 font-bold' : ''}
                    whitespace-pre-wrap break-words
                  `}>
                    {log.content}
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex gap-4">
                  <span className="text-[#00ff88]/30 shrink-0">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                  <div className="text-[#00ff88] animate-pulse">Processing...</div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-[#00ff88]/20 bg-[#00ff88]/5 flex items-center gap-3">
              <span className="text-[#00ff88] font-bold">$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isProcessing}
                placeholder={isProcessing ? "Awaiting Core..." : "Type command or ai prompt..."}
                className="flex-1 bg-transparent border-none outline-none text-[#00ff88] font-mono text-sm placeholder:text-[#00ff88]/20"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
