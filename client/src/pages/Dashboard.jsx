import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Briefcase, Activity, Calendar, CheckCircle, Users } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { API_URL } from '../config';

const Dashboard = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

    // Mock Data for Stats
    const [stats, setStats] = useState([]);
    const [activityData, setActivityData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/dashboard/stats`, {
                    headers: { 'x-auth-token': token }
                });
                const data = await response.json();
                setStats(data.stats);
                setActivityData(data.activityData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const getIcon = (iconName) => {
        switch (iconName) {
            case 'dollar': return <DollarSign size={24} />;
            case 'briefcase': return <Briefcase size={24} />;
            case 'activity': return <Activity size={24} />;
            case 'trending': return <TrendingUp size={24} />;
            case 'check': return <CheckCircle size={24} />; // You might need to import CheckCircle
            case 'users': return <Users size={24} />; // You might need to import Users
            default: return <Activity size={24} />;
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-6">
            <div className="container mx-auto max-w-6xl">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
                    <p className="text-gray-400">Welcome back, {user.username}!</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="glass-card p-6 relative overflow-hidden group"
                                >
                                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-bl-full group-hover:opacity-20 transition-opacity`}></div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-xl bg-white/5 ${stat.color.replace('from-', 'text-').split(' ')[0]}`}>
                                            {getIcon(stat.icon)}
                                        </div>
                                        <span className="text-xs text-gray-400 font-mono">Last 30 Days</span>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                                    <p className="text-gray-400 text-sm">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Activity Chart Area */}
                            <div className="lg:col-span-2 glass-card p-8">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-xl font-bold">Earnings Overview</h3>
                                    <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm outline-none">
                                        <option>This Week</option>
                                        <option>Last Month</option>
                                    </select>
                                </div>

                                <div className="h-80 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={activityData}>
                                            <defs>
                                                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#ffffff20', borderRadius: '12px' }}
                                                itemStyle={{ color: '#fff' }}
                                            />
                                            <Area type="monotone" dataKey="amount" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Recent Projects List */}
                            <div className="glass-card p-8">
                                <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
                                <div className="space-y-6">
                                    {[1, 2, 3].map((item, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.5 + (i * 0.1) }}
                                            className="flex items-center gap-4 border-b border-white/5 pb-4 last:border-0 last:pb-0"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-primary">
                                                <Calendar size={18} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm">Website Redesign</h4>
                                                <p className="text-xs text-gray-400">Completed 2 hours ago</p>
                                            </div>
                                            <span className="ml-auto text-green-400 text-xs font-bold">+$250</span>
                                        </motion.div>
                                    ))}
                                </div>
                                <button className="w-full mt-8 py-3 rounded-xl border border-white/10 text-sm hover:bg-white/5 transition-colors">
                                    View All History
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
