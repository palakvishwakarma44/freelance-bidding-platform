import React from 'react';
import { motion } from 'framer-motion';
import { Code, Eye, Terminal, Zap } from 'lucide-react';

const PoCPreview = ({ poc }) => {
    if (!poc) return null;

    // Detect if POC is likely code or just text
    const isCode = poc.includes('{') || poc.includes('function') || poc.includes('<');

    return (
        <div className="mt-4 glass-premium rounded-xl overflow-hidden border border-primary/20">
            <div className="bg-primary/10 px-4 py-2 flex items-center justify-between border-b border-primary/20">
                <div className="flex items-center space-x-2 text-xs font-bold text-primary uppercase tracking-wider">
                    {isCode ? <Terminal size={14} /> : <Zap size={14} />}
                    <span>Interactive Proof of Concept</span>
                </div>
                <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                </div>
            </div>
            
            <div className="p-4 bg-black/40 font-mono text-sm overflow-x-auto">
                {isCode ? (
                    <pre className="text-emerald-400">
                        <code>{poc}</code>
                    </pre>
                ) : (
                    <p className="text-gray-300 italic">{poc}</p>
                )}
            </div>
            
            <div className="bg-white/5 py-2 px-4 text-[10px] text-gray-500 flex justify-between items-center">
                <span>Verified original submission</span>
                <span className="flex items-center gap-1"><Eye size={10} /> Preview Mode</span>
            </div>
        </div>
    );
};

export default PoCPreview;
