import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, ArrowRight, Shield, Zap, Sparkles } from 'lucide-react';

const ProjectArchitect = ({ roadmap }) => {
    if (!roadmap) return null;

    const { milestones, techStack, strategy, edgeCases } = roadmap;

    return (
        <div className="space-y-8 animate-fade-up">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-6">
                <Sparkles className="text-primary animate-pulse" size={24} />
                <h3 className="text-2xl font-bold text-gradient">AI Technical Blueprint</h3>
            </div>

            {/* Milestones Timeline */}
            <div className="glass-premium rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Sparkles size={64} />
                </div>
                
                <h4 className="text-lg font-semibold mb-6 flex items-center">
                    <Zap size={18} className="mr-2 text-yellow-400" /> Success Roadmap
                </h4>
                
                <div className="space-y-6">
                    {milestones?.map((milestone, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start group"
                        >
                            <div className="flex flex-col items-center mr-4">
                                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold group-hover:scale-110 transition-transform">
                                    {index + 1}
                                </div>
                                {index !== milestones.length - 1 && (
                                    <div className="w-0.5 h-12 bg-white/10 my-1"></div>
                                )}
                            </div>
                            <div className="pt-1">
                                <h5 className="font-bold text-white group-hover:text-primary transition-colors">{milestone.title}</h5>
                                <p className="text-sm text-gray-400 max-w-lg">{milestone.description}</p>
                                <span className="text-xs text-primary/60 font-medium mt-1 inline-block">Estimated: {milestone.duration}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tech Stack */}
                <div className="glass-card">
                    <h4 className="text-lg font-semibold mb-4 flex items-center">
                        <ArrowRight size={18} className="mr-2 text-primary" /> Recommended Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {techStack?.map((tech, i) => (
                            <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition-colors">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Edge Cases / Risks */}
                <div className="glass-card border-red-500/20">
                    <h4 className="text-lg font-semibold mb-4 flex items-center text-red-400">
                        <Shield size={18} className="mr-2" /> Strategic Risks
                    </h4>
                    <ul className="space-y-2">
                        {edgeCases?.map((risk, i) => (
                            <li key={i} className="text-sm text-gray-400 flex items-start">
                                <span className="mr-2 mt-1.5 w-1 h-1 rounded-full bg-red-400"></span>
                                {risk}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* AI Strategy Note */}
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 italic text-sm text-gray-400 flex items-center">
                <Sparkles size={14} className="mr-3 text-primary shrink-0" />
                "This roadmap is algorithmically generated based on current industry standards and project requirements. Bidders are encouraged to refine this blueprint in their proposals."
            </div>
        </div>
    );
};

export default ProjectArchitect;
