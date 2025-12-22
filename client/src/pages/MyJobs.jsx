import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { API_URL } from '../config';

const MyJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyJobs();
    }, []);

    const fetchMyJobs = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/jobs/my/jobs`, {
                headers: { 'x-auth-token': token }
            });
            const data = await response.json();
            setJobs(data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Open':
                return 'bg-green-500/20 text-green-500 border-green-500/20';
            case 'In Progress':
                return 'bg-blue-500/20 text-blue-500 border-blue-500/20';
            case 'Completed':
                return 'bg-purple-500/20 text-purple-500 border-purple-500/20';
            default:
                return 'bg-gray-500/20 text-gray-400 border-gray-500/20';
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-6">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10">
                    <h1 className="text-4xl font-bold mb-6 md:mb-0">My Posted Jobs</h1>
                    <Link to="/create-job" className="glass-btn flex items-center gap-2">
                        <Plus size={20} />
                        Post New Job
                    </Link>
                </div>

                {loading ? (
                    <LoadingSpinner />
                ) : jobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map((job, index) => (
                            <Link key={job._id} to={`/jobs/${job._id}`}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="glass-card hover:border-primary/50 transition-colors group cursor-pointer h-full"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="bg-primary/20 text-primary text-xs px-3 py-1 rounded-full border border-primary/20">
                                            {job.category}
                                        </span>
                                        <span className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(job.status)}`}>
                                            {job.status}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{job.title}</h3>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">{job.description}</p>
                                    <div className="flex justify-between items-center pt-4 border-t border-white/10">
                                        <div>
                                            <p className="text-xs text-gray-500">Budget</p>
                                            <p className="font-bold text-lg">${job.budget}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500">Posted</p>
                                            <p className="text-sm text-gray-300">{new Date(job.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        message="You haven't posted any jobs yet."
                        actionLabel="Post Your First Job"
                        onAction={() => window.location.href = '/create-job'}
                    />
                )}
            </div>
        </div>
    );
};

export default MyJobs;
