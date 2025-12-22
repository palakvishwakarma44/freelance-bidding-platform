import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Briefcase, Search, FileText, CheckCircle, DollarSign, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
    const [activeTab, setActiveTab] = useState('client');

    const clientSteps = [
        {
            icon: <FileText size={32} />,
            title: "1. Post a Job",
            description: "Create a detailed job posting describing your project requirements, budget, and deadline."
        },
        {
            icon: <User size={32} />,
            title: "2. Review Bids",
            description: "Receive proposals from talented freelancers. Check their profiles, ratings, and past work."
        },
        {
            icon: <MessageSquare size={32} />,
            title: "3. Chat & Hire",
            description: "Discuss details via real-time chat and accept the best bid to start the contract."
        },
        {
            icon: <CheckCircle size={32} />,
            title: "4. Approve & Pay",
            description: "Review the submitted work. Once satisfied, approve the milestone to release payment."
        }
    ];

    const freelancerSteps = [
        {
            icon: <Search size={32} />,
            title: "1. Find Work",
            description: "Browse thousands of job listings in categories like Development, Design, and Marketing."
        },
        {
            icon: <DollarSign size={32} />,
            title: "2. Place a Bid",
            description: "Submit a competitive proposal with your price and delivery time. Stand out with a good pitch."
        },
        {
            icon: <Briefcase size={32} />,
            title: "3. Do the Work",
            description: "Once hired, collaborate with the client and deliver high-quality work via the platform."
        },
        {
            icon: <DollarSign size={32} />,
            title: "4. Get Paid",
            description: "Get paid securely upon job completion. Build your reputation with every successful job."
        }
    ];

    return (
        <div className="min-h-screen pt-24 pb-12 px-6">
            <div className="container mx-auto max-w-5xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        How It Works
                    </h1>
                    <p className="text-xl text-gray-400">
                        Your guide to success on FreelanceHub
                    </p>
                </div>

                {/* Tab Switcher */}
                <div className="flex justify-center mb-12">
                    <div className="bg-white/5 p-1 rounded-full flex">
                        <button
                            onClick={() => setActiveTab('client')}
                            className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${activeTab === 'client'
                                    ? 'bg-primary text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            I want to Hire
                        </button>
                        <button
                            onClick={() => setActiveTab('freelancer')}
                            className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${activeTab === 'freelancer'
                                    ? 'bg-secondary text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            I want to Work
                        </button>
                    </div>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {(activeTab === 'client' ? clientSteps : freelancerSteps).map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card p-6 text-center relative group hover:border-primary/50 transition-colors"
                        >
                            <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform ${activeTab === 'client' ? 'bg-gradient-to-br from-primary to-purple-600' : 'bg-gradient-to-br from-secondary to-pink-600'
                                }`}>
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                {step.description}
                            </p>

                            {/* Connector Line (Desktop only, except last item) */}
                            {index < 3 && (
                                <div className="hidden lg:block absolute top-14 -right-4 w-8 h-0.5 bg-white/10 z-0" />
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-16 text-center"
                >
                    <h2 className="text-2xl font-bold mb-6">Ready to get started?</h2>
                    {activeTab === 'client' ? (
                        <Link to="/create-job" className="glass-btn px-8 py-4 text-lg">
                            Post a Job Now
                        </Link>
                    ) : (
                        <Link to="/jobs" className="glass-btn px-8 py-4 text-lg">
                            Find Work Now
                        </Link>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default HowItWorks;
