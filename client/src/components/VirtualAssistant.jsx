import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Bot, User, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useLocation, useNavigate } from 'react-router-dom';

const VirtualAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Hello! I\'m your AI Assistant. I can help you write job descriptions, find work, or answer questions about the platform. How can I help?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
        setInput('');
        setIsLoading(true);

        try {
            const apiKey = localStorage.getItem('gemini_api_key');

            if (!apiKey) {
                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        type: 'bot',
                        text: 'I need a Gemini API key to function properly. Please go to the "Post a Job" page to set one up, or enter it here temporarily.'
                    }]);
                    setIsLoading(false);
                }, 1000);
                return;
            }

            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `You are a helpful AI assistant for a Freelance Platform. 
            The user is currently on the path: ${location.pathname}.
            
            Context about the platform:
            - Users can post jobs, bid on jobs, and manage contracts.
            - "Post a Job" is at /create-job.
            - "Find Work" is at /jobs.
            - "My Contracts" is at /contracts.
            
            User Query: ${userMessage}
            
            Keep your response concise, helpful, and friendly. Use emojis occasionally.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            setMessages(prev => [...prev, { type: 'bot', text: text }]);
        } catch (error) {
            console.error("AI Error:", error);
            setMessages(prev => [...prev, { type: 'bot', text: "I'm having trouble connecting to the AI right now. Please check your API key or try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickAction = (action) => {
        if (action.startsWith('/')) {
            navigate(action);
            setIsOpen(false);
        } else {
            setInput(action);
        }
    };

    const quickActions = [
        { label: 'Post a Job', action: '/create-job' },
        { label: 'Find Work', action: '/jobs' },
        { label: 'How does this work?', action: 'How does the bidding system work?' },
    ];

    return (
        <>
            {/* Floating Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-8 right-8 z-[60] w-16 h-16 bg-gradient-to-tr from-cyan-500 to-violet-600 rounded-full shadow-[0_0_30px_rgba(139,92,246,0.5)] flex items-center justify-center text-white border border-white/20"
            >
                {isOpen ? <X size={28} /> : <Sparkles size={28} className="animate-pulse" />}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9, rotateX: 10 }}
                        animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9, rotateX: 10 }}
                        className="fixed bottom-28 right-8 z-[60] w-[380px] h-[600px] glass-premium rounded-2xl flex flex-col overflow-hidden shadow-2xl border border-white/10"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-cyan-500/20 to-violet-600/20 backdrop-blur-md p-4 flex items-center gap-3 border-b border-white/10">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-violet-500 flex items-center justify-center shadow-lg">
                                <Bot size={20} className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">AI Assistant</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                    <p className="text-xs text-cyan-200">Online & Ready</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {messages.map((msg, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10, x: msg.type === 'user' ? 20 : -20 }}
                                    animate={{ opacity: 1, y: 0, x: 0 }}
                                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex gap-2 max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.type === 'user' ? 'bg-violet-600' : 'bg-cyan-600'
                                            }`}>
                                            {msg.type === 'user' ? <User size={14} /> : <Bot size={14} />}
                                        </div>
                                        <div className={`p-3 rounded-2xl ${msg.type === 'user'
                                                ? 'bg-violet-600/80 text-white rounded-tr-none'
                                                : 'bg-white/10 text-gray-100 rounded-tl-none border border-white/5'
                                            }`}>
                                            <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                    <div className="bg-white/5 rounded-2xl rounded-tl-none p-4 flex gap-2 items-center">
                                        <Loader2 size={16} className="animate-spin text-cyan-400" />
                                        <span className="text-xs text-gray-400">Thinking...</span>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Actions */}
                        <div className="px-4 py-2 border-t border-white/5 overflow-x-auto flex gap-2 no-scrollbar">
                            {quickActions.map((action, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleQuickAction(action.action)}
                                    className="whitespace-nowrap text-xs bg-white/5 hover:bg-white/10 active:bg-cyan-500/20 text-cyan-200 border border-cyan-500/30 rounded-full px-3 py-1.5 transition-colors"
                                >
                                    {action.label}
                                </button>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-white/10 bg-black/20">
                            <div className="flex gap-2 items-center bg-white/5 rounded-xl border border-white/10 p-1 pl-4 focus-within:border-cyan-500/50 focus-within:bg-white/10 transition-all">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask me anything..."
                                    className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={isLoading}
                                    className="p-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default VirtualAssistant;
