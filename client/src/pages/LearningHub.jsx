import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Code, PenTool, TrendingUp, PlayCircle, X } from 'lucide-react';

const LearningHub = () => {
    const [selectedVideo, setSelectedVideo] = useState(null);

    const resources = [
        {
            id: 1,
            title: "Freelancing 101: Upwork Guide",
            category: "Business",
            icon: <TrendingUp size={24} />,
            duration: "20 mins",
            description: "A complete guide on how to start freelancing on Upwork and get your first client.",
            level: "Beginner",
            videoUrl: "https://www.youtube.com/embed/HhwuNtO5y6k?autoplay=1" // Real Freelancing Guide
        },
        {
            id: 2,
            title: "React.js Crash Course 2024",
            category: "Development",
            icon: <Code size={24} />,
            duration: "1 hour",
            description: "Learn the fundamentals of React including Hooks, Props, and State Management.",
            level: "Intermediate",
            videoUrl: "https://www.youtube.com/embed/SqcY0GlETPk?autoplay=1" // Programming with Mosh React
        },
        {
            id: 3,
            title: "UI/UX Design Crash Course",
            category: "Design",
            icon: <PenTool size={24} />,
            duration: "30 mins",
            description: "Learn the basic principles of UI/UX design and how to design a website in Figma.",
            level: "Beginner",
            videoUrl: "https://www.youtube.com/embed/c9Wg6Cb_YlU?autoplay=1" // Gary Simon UI/UX
        },
        {
            id: 4,
            title: "Copywriting for Beginners",
            category: "Writing",
            icon: <BookOpen size={24} />,
            duration: "15 mins",
            description: "Learn the basics of copywriting and how to write persuasive text that sells.",
            level: "All Levels",
            videoUrl: "https://www.youtube.com/embed/MydN93pCkLI?autoplay=1" // Copywriting Guide
        }
    ];

    return (
        <div className="min-h-screen pt-24 pb-12 px-6">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        Learning Hub
                    </h1>
                    <p className="text-xl text-gray-400">
                        Upgrade your skills and earn more.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {resources.map((resource, index) => (
                        <motion.div
                            key={resource.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => setSelectedVideo(resource)}
                            className="glass-card p-6 flex flex-col hover:border-primary/50 transition-colors group cursor-pointer hover:scale-[1.02] transform duration-300"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 rounded-xl bg-white/5 text-secondary group-hover:bg-secondary/20 transition-colors">
                                    {resource.icon}
                                </div>
                                <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/5 text-gray-400">
                                    {resource.category}
                                </span>
                            </div>

                            <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                                {resource.title}
                            </h3>

                            <p className="text-gray-400 mb-6 flex-grow">
                                {resource.description}
                            </p>

                            <div className="flex items-center justify-between text-sm text-gray-500 border-t border-white/10 pt-4">
                                <div className="flex gap-4">
                                    <span>{resource.duration}</span>
                                    <span>•</span>
                                    <span>{resource.level}</span>
                                </div>
                                <button className="flex items-center gap-2 text-white hover:text-secondary transition-colors font-bold">
                                    Start Learning <PlayCircle size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Video Modal */}
            <AnimatePresence>
                {selectedVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
                        onClick={() => setSelectedVideo(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-[#1e293b] rounded-2xl max-w-4xl w-full overflow-hidden border border-white/10 relative shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
                                <h3 className="text-xl font-bold text-white">{selectedVideo.title}</h3>
                                <button
                                    onClick={() => setSelectedVideo(null)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="relative pt-[56.25%] bg-black">
                                <iframe
                                    src={selectedVideo.videoUrl}
                                    title={selectedVideo.title}
                                    className="absolute top-0 left-0 w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-300">{selectedVideo.description}</p>
                                <div className="flex gap-4 mt-4 text-sm text-gray-400">
                                    <span className="flex items-center gap-1"><TrendingUp size={16} /> {selectedVideo.level}</span>
                                    <span className="flex items-center gap-1"><PlayCircle size={16} /> {selectedVideo.duration}</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LearningHub;
