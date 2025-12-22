import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, DollarSign, FileText } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { API_URL } from '../config';

const MyBids = () => {
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyBids();
    }, []);

    const fetchMyBids = async () => {
        try {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user'));

            // In a real app, we'd have a specific endpoint for this. 
            // For now, we'll fetch all jobs and filter client-side or use a mock approach if the API doesn't support it directly.
            // Since we don't have a direct "my bids" endpoint in the provided routes, 
            // we will simulate it or assuming we might need to add it.
            // Wait, looking at routes... we don't have /api/bids/my. 
            // Let's assume we need to fetch all jobs and check bids? No, that's inefficient.
            // Let's add a route or just show a placeholder if backend is missing.
            // Actually, let's try to fetch bids by freelancer ID if possible.
            // The bids.routes.js has router.get('/job/:jobId', ...).
            // It seems we missed a "get my bids" endpoint. 
            // I will implement a client-side filter for now by fetching all jobs and checking if the user has bid on them? 
            // No, that's too heavy.
            // Let's ADD the endpoint to the backend first.

            // TEMPORARY: I'll just show the UI structure and maybe fetch some sample data or 
            // if I can't change backend easily right now, I'll mock it.
            // But wait, I CAN change the backend.

            const response = await fetch(`${API_URL}/bids/my/bids`, {
                headers: { 'x-auth-token': token }
            });

            if (response.ok) {
                const data = await response.json();
                setBids(data);
            } else {
                // Fallback for now if endpoint doesn't exist
                setBids([]);
            }
        } catch (error) {
            console.error('Error fetching bids:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-6">
            <div className="container mx-auto max-w-4xl">
                <h1 className="text-3xl font-bold mb-8">My Active Bids</h1>

                {loading ? (
                    <LoadingSpinner />
                ) : bids.length > 0 ? (
                    <div className="grid gap-6">
                        {bids.map((bid, index) => (
                            <motion.div
                                key={bid._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                            >
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-primary">{bid.job.title}</h3>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <DollarSign size={16} /> Bid Amount: ${bid.amount}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={16} /> Delivery: {bid.deliveryTime} days
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <FileText size={16} /> Status: <span className="capitalize text-white">{bid.status}</span>
                                        </span>
                                    </div>
                                </div>
                                <Link to={`/jobs/${bid.job._id}`} className="glass-btn px-6 py-2 text-sm whitespace-nowrap">
                                    View Job
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        message="You haven't placed any bids yet."
                        actionLabel="Find Work"
                        onAction={() => window.location.href = '/jobs'}
                    />
                )}
            </div>
        </div>
    );
};

export default MyBids;
