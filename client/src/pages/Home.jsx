import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Briefcase, FileText, DollarSign, CheckCircle, Zap, Shield, Globe, Award, TrendingUp, Users, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts';
import { TypeAnimation } from 'react-type-animation';
import confetti from 'canvas-confetti';
import { API_URL } from '../config';
import FeatureCard from '../components/FeatureCard';
import SpotlightCursor from '../components/SpotlightCursor';
import ParallaxHero from '../components/ParallaxHero';
import AnimatedCounter from '../components/AnimatedCounter';
import MagneticButton from '../components/MagneticButton';
import ScrollProgress from '../components/ScrollProgress';

const Home = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [stats, setStats] = useState({
        activeJobs: 0,
        activeContracts: 0,
        completedContracts: 0,
        earnings: 0
    });

    // Mock Data for Home Chart
    const chartData = [
        { name: 'Mon', active: 4, completed: 2, earnings: 120 },
        { name: 'Tue', active: 3, completed: 1, earnings: 80 },
        { name: 'Wed', active: 7, completed: 3, earnings: 250 },
        { name: 'Thu', active: 2, completed: 1, earnings: 50 },
        { name: 'Fri', active: 6, completed: 4, earnings: 300 },
        { name: 'Sat', active: 1, completed: 0, earnings: 0 },
        { name: 'Sun', active: 3, completed: 1, earnings: 100 },
    ];

    useEffect(() => {
        if (user) {
            fetchStats();
        }
    }, [user]);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { 'x-auth-token': token };

            // Fetch Contracts
            const contractsRes = await fetch(`${API_URL}/contracts`, { headers });
            const contracts = await contractsRes.json();

            const activeContracts = contracts.filter(c => c.status === 'Active' || c.status === 'Submitted').length;
            const completedContracts = contracts.filter(c => c.status === 'Completed').length;
            const earnings = contracts
                .filter(c => c.status === 'Completed')
                .reduce((acc, curr) => acc + curr.amount, 0);

            let activeJobs = 0;
            if (user.role === 'client') {
                const jobsRes = await fetch(`${API_URL}/jobs/my/jobs`, { headers });
                const jobs = await jobsRes.json();
                activeJobs = jobs.filter(j => j.status === 'Open' || j.status === 'In Progress').length;
            }

            setStats({ activeJobs, activeContracts, completedContracts, earnings });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const StatCard = ({ icon: Icon, label, value, color, trend }) => (
        <motion.div
            whileHover={{ y: -5 }}
            className="glass-card p-6 flex items-center justify-between group overflow-hidden relative"
        >
            <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${color}-500/10 rounded-full blur-2xl group-hover:bg-${color}-500/20 transition-all`}></div>

            <div className="flex items-center space-x-4 z-10">
                <div className={`p-4 rounded-xl bg-${color}-500/20 text-${color}-400 group-hover:scale-110 transition-transform`}>
                    <Icon size={28} />
                </div>
                <div>
                    <p className="text-gray-400 text-sm mb-1">{label}</p>
                    <p className="text-3xl font-bold">{value}</p>
                </div>
            </div>

            {trend && (
                <div className="flex items-center text-emerald-400 text-sm font-semibold bg-emerald-500/10 px-2 py-1 rounded-full">
                    <TrendingUp size={14} className="mr-1" />
                    {trend}%
                </div>
            )}
        </motion.div>
    );

    // LOGGED IN DASHBOARD
    if (user) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-6 bg-grid-white">
                <div className="container mx-auto max-w-7xl">
                    <div className="mb-10 flex justify-between items-end">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">
                                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{user.username}</span>
                            </h1>
                            <p className="text-gray-400 text-lg">Here's your daily overview.</p>
                        </div>
                        <div className="text-right hidden md:block">
                            <p className="text-sm text-gray-400">Current Balance</p>
                            <p className="text-2xl font-bold text-white">${user.balance?.toFixed(2) || '0.00'}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {user.role === 'client' && (
                            <StatCard icon={Briefcase} label="Active Jobs" value={stats.activeJobs} color="blue" trend={12} />
                        )}
                        <StatCard icon={FileText} label="Active Contracts" value={stats.activeContracts} color="yellow" />
                        <StatCard icon={CheckCircle} label="Completed Jobs" value={stats.completedContracts} color="green" trend={8} />
                        <StatCard icon={DollarSign} label={user.role === 'client' ? 'Total Spent' : 'Total Earnings'} value={`$${stats.earnings}`} color="purple" trend={24} />
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Quick Actions & Profile */}
                        <div className="w-full lg:w-1/3 flex flex-col gap-8">
                            <div className="glass-card p-8">
                                <h3 className="text-xl font-bold mb-6 flex items-center">
                                    <Zap size={20} className="mr-2 text-yellow-400" /> Quick Actions
                                </h3>
                                <div className="space-y-4">
                                    {user.role === 'client' ? (
                                        <Link to="/create-job" className="glass-btn w-full block text-center py-4 text-lg shadow-lg shadow-primary/20">
                                            Post a New Job
                                        </Link>
                                    ) : (
                                        <Link to="/jobs" className="glass-btn w-full block text-center py-4 text-lg shadow-lg shadow-primary/20">
                                            Find Work
                                        </Link>
                                    )}
                                    <div className="grid grid-cols-2 gap-4">
                                        <Link to="/messages" className="bg-white/5 border border-white/10 text-white py-3 rounded-xl hover:bg-white/10 transition-colors text-center font-medium">
                                            Messages
                                        </Link>
                                        <Link to="/profile" className="bg-white/5 border border-white/10 text-white py-3 rounded-xl hover:bg-white/10 transition-colors text-center font-medium">
                                            Edit Profile
                                        </Link>
                                    </div>
                                    <Link to="/dashboard" className="flex items-center justify-center text-primary hover:text-white transition-colors text-sm mt-2 font-medium">
                                        View Full Dashboard <TrendingUp size={14} className="ml-1" />
                                    </Link>
                                </div>
                            </div>

                            {/* Mini Profile Summary */}
                            <div className="glass-card p-6 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary"></div>
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl font-bold text-white">
                                        {user.username[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">{user.username}</h4>
                                        <p className="text-sm text-gray-400 capitalize">{user.role}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between text-sm border-t border-white/10 pt-4 mt-2">
                                    <span className="text-gray-400">Response Rate</span>
                                    <span className="text-green-400 font-bold">98%</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Graphic with Recharts */}
                        <div className="w-full lg:w-2/3 glass-card p-8 flex flex-col">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-bold">Activity Overview</h3>
                                <select className="bg-black/30 border border-white/10 rounded-lg px-3 py-1 text-sm text-gray-300 outline-none focus:border-primary">
                                    <option>This Week</option>
                                    <option>Last Month</option>
                                </select>
                            </div>
                            <div className="flex-1 w-full min-h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                        <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px' }}
                                            cursor={{ stroke: '#ffffff20' }}
                                        />
                                        <Area type="monotone" dataKey="earnings" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" />
                                        <Area type="monotone" dataKey="active" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorActive)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // LANDING PAGE (NOT LOGGED IN)
    return (
        <div className="min-h-screen pt-20 overflow-hidden bg-dark relative selection:bg-primary/30">
            <SpotlightCursor />
            <ScrollProgress />

            {/* Background Grids */}
            <div className="absolute inset-0 bg-grid-white opacity-[0.02] z-0 pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6">
                {/* Hero Section */}
                <div className="min-h-[90vh] flex flex-col lg:flex-row items-center justify-between gap-12 pt-10 pb-20">

                    {/* Left Column: Text & CTA */}
                    <div className="w-full lg:w-1/2 text-left z-20">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-sm font-medium mb-8 backdrop-blur-sm animate-fade-up hover:bg-white/10 transition-colors cursor-default">
                                <Sparkles size={14} />
                                <span>The Intelligent Workspace (Freelance 3.0)</span>
                            </div>

                            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[1.1] tracking-tight">
                                Find <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-secondary relative">
                                    <TypeAnimation
                                        sequence={[
                                            'Architects', 2000,
                                            'Squads', 2000,
                                            'Innovation', 2000,
                                        ]}
                                        wrapper="span"
                                        speed={50}
                                        repeat={Infinity}
                                        cursor={true}
                                    />
                                </span>
                            </h1>

                             <p className="text-xl text-gray-400 mb-10 max-w-xl leading-relaxed">
                                Experience a workspace where AI builds your roadmaps, squads amplify your power, and every milestone is verified by code.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-5">
                                <MagneticButton
                                    to="/register"
                                    onClick={() => confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })}
                                    className="glass-btn text-lg px-8 py-4 min-w-[180px] shadow-lg shadow-primary/25 hover:shadow-primary/40 text-center flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    Get Started
                                </MagneticButton>
                                <MagneticButton
                                    to="/how-it-works"
                                    className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all min-w-[180px] flex items-center justify-center gap-2 group cursor-pointer"
                                >
                                    Demo Video <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </MagneticButton>
                            </div>

                            <div className="mt-12 flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-dark bg-gray-800 overflow-hidden">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                                        </div>
                                    ))}
                                </div>
                                <p>Joined by 10,000+ professionals</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Parallax Visuals */}
                    <div className="w-full lg:w-1/2 relative z-10">
                        <ParallaxHero />
                    </div>
                </div>

                {/* Features Section */}
                <div className="py-24 border-t border-white/5">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Redefining the <span className="text-gradient">Standard</span></h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">We provide the tools and security you need to focus on what you do best.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={Sparkles}
                            title="AI Project Architect"
                            description="Automatically generate technical roadmaps, milestones, and success strategies for every job posting."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={Users}
                            title="Squad Protocol"
                            description="Form instant collaborative teams to bid on complex projects that require multi-disciplinary talent."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={Zap}
                            title="PoC Bidding"
                            description="Freelancers can attach interactive 'Proof of Concept' snippets directly to their bids for instant validation."
                            delay={0.3}
                        />
                        <FeatureCard
                            icon={Award}
                            title="Quality Guaranteed"
                            description="Our rating system and portfolio verification ensure you work with the best."
                            delay={0.4}
                        />
                        <FeatureCard
                            icon={TrendingUp}
                            title="Analytics Dashboard"
                            description="Track your earnings, project success rates, and more with our advanced tools."
                            delay={0.5}
                        />
                        <FeatureCard
                            icon={Users}
                            title="24/7 Support"
                            description="Our dedicated support team is always available to help you resolve any issues."
                            delay={0.6}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Home;
