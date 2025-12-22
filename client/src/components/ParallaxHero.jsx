import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, DollarSign, Star, Code, Coffee } from 'lucide-react';

const ParallaxHero = () => {
    return (
        <div className="relative w-full h-[500px] hidden lg:block">
            {/* Main Floating Card - Profile */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute top-1/4 left-1/4 z-20"
                style={{ translateX: '-50%', translateY: '-50%' }}
            >
                <div className="glass-card p-4 min-w-[280px] border border-primary/20 bg-dark/80 backdrop-blur-xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-secondary p-[2px]">
                            <div className="w-full h-full rounded-full bg-dark overflow-hidden">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Felix`} alt="Avatar" className="w-full h-full" />
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-white">Alex Morgan</h4>
                            <p className="text-xs text-gray-400">Senior Developer</p>
                        </div>
                        <div className="ml-auto flex gap-1">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />)}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-2 bg-white/10 rounded w-3/4"></div>
                        <div className="h-2 bg-white/10 rounded w-1/2"></div>
                    </div>
                    <div className="mt-4 flex justify-between items-center bg-white/5 rounded-lg p-2 px-3">
                        <span className="text-xs text-gray-400">Rate</span>
                        <span className="text-sm font-bold text-primary">$85/hr</span>
                    </div>
                </div>
            </motion.div>

            {/* Floating Element 1 - Payment Received */}
            <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[10%] right-[10%] z-10"
            >
                <div className="glass-premium p-3 rounded-xl flex items-center gap-3 pr-6 border border-green-500/20 shadow-lg shadow-green-500/10">
                    <div className="bg-green-500/20 p-2 rounded-lg text-green-400">
                        <DollarSign size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Payment Received</p>
                        <p className="font-bold text-white text-sm">+$1,500.00</p>
                    </div>
                </div>
            </motion.div>

            {/* Floating Element 2 - Code snippet */}
            <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-[20%] right-[20%] z-10"
            >
                <div className="glass-premium p-4 rounded-xl border border-secondary/20 shadow-lg">
                    <div className="flex items-center gap-2 text-secondary mb-2">
                        <Code size={16} />
                        <span className="text-xs font-mono">Project.tsx</span>
                    </div>
                    <div className="space-y-1.5 font-mono text-[10px] text-gray-500">
                        <div className="flex gap-2"><span className="text-purple-400">const</span> <span className="text-blue-400">Project</span> = () ={'>'} {'{'}</div>
                        <div className="pl-4 text-gray-400">return "Success";</div>
                        <div>{'}'}</div>
                    </div>
                </div>
            </motion.div>

            {/* Floating Element 3 - Success Badge */}
            <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[15%] left-[10%] z-30"
            >
                <div className="bg-white text-dark font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-xl shadow-white/10">
                    <CheckCircle size={16} className="text-green-600" />
                    <span>Job Complete</span>
                </div>
            </motion.div>

            {/* Decorative Blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/20 rounded-full blur-[80px] animate-pulse"></div>
        </div>
    );
};

export default ParallaxHero;
