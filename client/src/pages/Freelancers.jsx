import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const Freelancers = () => {
    const freelancers = [
        {
            id: 1,
            name: "Alex Johnson",
            title: "Senior Full Stack Cloud Developer",
            rating: 4.9,
            reviews: 120,
            rate: 65,
            skills: ["React", "Node.js", "AWS", "Python"],
            location: "New York, USA",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
        },
        {
            id: 2,
            name: "Sarah Smith",
            title: "UI/UX Designer & Brand Strategist",
            rating: 5.0,
            reviews: 85,
            rate: 55,
            skills: ["Figma", "Adobe XD", "Branding", "Webflow"],
            location: "London, UK",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
        },
        {
            id: 3,
            name: "Michael Chen",
            title: "Mobile App Developer (Flutter/iOS)",
            rating: 4.8,
            reviews: 93,
            rate: 70,
            skills: ["Flutter", "Dart", "Firebase", "iOS"],
            location: "Toronto, Canada",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael"
        },
        {
            id: 4,
            name: "Emily Davis",
            title: "SEO Specialist & Content Writer",
            rating: 4.7,
            reviews: 154,
            rate: 45,
            skills: ["SEO", "Content Writing", "Copywriting", "Marketing"],
            location: "Sydney, Australia",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily"
        },
        {
            id: 5,
            name: "David Lee",
            title: "DevOps Engineer & System Admin",
            rating: 4.9,
            reviews: 62,
            rate: 80,
            skills: ["Docker", "Kubernetes", "CI/CD", "Linux"],
            location: "Berlin, Germany",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David"
        },
        {
            id: 6,
            name: "Lisa Wong",
            title: "Video Editor & Motion Designer",
            rating: 4.8,
            reviews: 78,
            rate: 50,
            skills: ["After Effects", "Premiere Pro", "Animation", "Editing"],
            location: "Singapore",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa"
        }
    ];

    return (
        <div className="min-h-screen pt-24 pb-12 px-6">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        Top Rated Talent
                    </h1>
                    <p className="text-xl text-gray-400">
                        Work with the world's best professionals.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {freelancers.map((freelancer, index) => (
                        <motion.div
                            key={freelancer.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card p-6 flex flex-col hover:border-primary/50 transition-colors group"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <img
                                    src={freelancer.image}
                                    alt={freelancer.name}
                                    className="w-16 h-16 rounded-full border-2 border-primary/20"
                                />
                                <div>
                                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                                        {freelancer.name}
                                    </h3>
                                    <div className="flex items-center gap-1 text-sm text-yellow-400">
                                        <Star size={14} fill="currentColor" />
                                        <span>{freelancer.rating}</span>
                                        <span className="text-gray-500">({freelancer.reviews})</span>
                                    </div>
                                </div>
                            </div>

                            <h4 className="text-lg font-semibold mb-2 text-gray-200">{freelancer.title}</h4>

                            <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                                <MapPin size={14} />
                                {freelancer.location}
                            </div>

                            <div className="flex flex-wrap gap-2 mb-6 flex-grow">
                                {freelancer.skills.map((skill, i) => (
                                    <span key={i} className="text-xs px-2 py-1 rounded-full bg-white/5 text-secondary border border-secondary/20">
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
                                <span className="text-lg font-bold">${freelancer.rate}<span className="text-xs text-gray-500 font-normal">/hr</span></span>
                                <Link to="/messages" className="glass-btn px-4 py-2 text-sm flex items-center gap-2">
                                    <MessageSquare size={16} /> Hire
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Freelancers;
