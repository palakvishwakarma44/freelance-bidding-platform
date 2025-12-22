import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { API_URL } from '../config';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [bids, setBids] = useState([]);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [bidForm, setBidForm] = useState({
        amount: '',
        deliveryTime: '',
        proposal: ''
    });

    useEffect(() => {
        fetchJob();
        if (user && user.role === 'client') {
            fetchBids();
        }
    }, [id]);

    const fetchJob = async () => {
        try {
            const response = await fetch(`${API_URL}/jobs/${id}`);
            const data = await response.json();
            setJob(data);
        } catch (error) {
            console.error('Error fetching job:', error);
        }
    };

    const fetchBids = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/bids/job/${id}`, {
                headers: { 'x-auth-token': token }
            });
            const data = await response.json();
            setBids(data);
        } catch (error) {
            console.error('Error fetching bids:', error);
        }
    };

    const handleBidSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        try {
            const response = await fetch(`${API_URL}/bids/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(bidForm)
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('Bid placed successfully!');
                setBidForm({ amount: '', deliveryTime: '', proposal: '' });
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error placing bid:', error);
        }
    };

    const handleAcceptBid = async (bidId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_URL}/bids/accept/${bidId}`, {
                method: 'PUT',
                headers: { 'x-auth-token': token }
            });
            if (response.ok) {
                toast.success('Bid accepted! Contract started.');
                fetchJob(); // Refresh job status
                fetchBids(); // Refresh bids
            }
        } catch (error) {
            console.error('Error accepting bid:', error);
        }
    };

    if (!job) return <div className="pt-24"><LoadingSpinner /></div>;

    return (
        <div className="min-h-screen pt-24 pb-12 px-6">
            <div className="container mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card mb-8"
                >
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                            <p className="text-gray-400">Posted by {job.client.username} • {new Date(job.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className={`px-4 py-2 rounded-full text-sm font-bold ${job.status === 'Open' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-400'}`}>
                                {job.status}
                            </span>
                            {user && user.role === 'freelancer' && (
                                <button
                                    onClick={() => navigate('/messages', { state: { userId: job.client._id, user: job.client } })}
                                    className="text-primary hover:text-white text-sm transition-colors"
                                >
                                    Message Client
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 border-y border-white/10 py-6">
                        <div>
                            <p className="text-gray-400 text-sm">Budget</p>
                            <p className="text-xl font-bold">${job.budget}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Category</p>
                            <p className="text-xl font-bold">{job.category}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Deadline</p>
                            <p className="text-xl font-bold">{new Date(job.deadline).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-xl font-bold mb-4">Description</h3>
                        <p className="text-gray-300 whitespace-pre-wrap">{job.description}</p>
                    </div>
                </motion.div>

                {/* Freelancer View: Place Bid */}
                {user && user.role === 'freelancer' && job.status === 'Open' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card"
                    >
                        <h3 className="text-2xl font-bold mb-6">Place a Bid</h3>
                        <form onSubmit={handleBidSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Bid Amount ($)</label>
                                    <input
                                        type="number"
                                        value={bidForm.amount}
                                        onChange={(e) => setBidForm({ ...bidForm, amount: e.target.value })}
                                        className="glass-input w-full text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Delivery Time (Days)</label>
                                    <input
                                        type="number"
                                        value={bidForm.deliveryTime}
                                        onChange={(e) => setBidForm({ ...bidForm, deliveryTime: e.target.value })}
                                        className="glass-input w-full text-white"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Proposal</label>
                                <textarea
                                    value={bidForm.proposal}
                                    onChange={(e) => setBidForm({ ...bidForm, proposal: e.target.value })}
                                    className="glass-input w-full text-white h-32"
                                    placeholder="Why are you the best fit for this job?"
                                    required
                                />
                            </div>
                            <button type="submit" className="glass-btn w-full py-3">Submit Proposal</button>
                        </form>
                    </motion.div>
                )}

                {/* Helpful Message: Default State (Not logged in or Client) */}
                {(!user || user.role === 'client') && job.status === 'Open' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="glass-card text-center py-8"
                    >
                        <h3 className="text-xl font-bold mb-2">Want to apply for this job?</h3>
                        {!user ? (
                            <div>
                                <p className="text-gray-400 mb-4">You need to log in as a Freelancer to place a bid.</p>
                                <button onClick={() => navigate('/login')} className="glass-btn px-6 py-2">
                                    Log In Now
                                </button>
                            </div>
                        ) : (
                            <div>
                                <p className="text-red-400 font-bold mb-2">⚠️ Client Account Detected</p>
                                <p className="text-gray-400">Clients cannot bid on jobs. Please log out and sign in as a Freelancer.</p>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Client View: Review Bids */}
                {user && user.role === 'client' && user.id === job.client._id && (
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold mb-4">Received Bids ({bids.length})</h3>
                        {bids.map((bid) => (
                            <motion.div
                                key={bid._id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="glass-card border-l-4 border-l-primary"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="text-lg font-bold">{bid.freelancer.username}</h4>
                                        <p className="text-gray-400 text-sm">Reputation: New Seller</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-primary">${bid.amount}</p>
                                        <p className="text-sm text-gray-400">in {bid.deliveryTime} days</p>
                                    </div>
                                </div>
                                <p className="text-gray-300 mb-4">{bid.proposal}</p>
                                {job.status === 'Open' && (
                                    <button
                                        onClick={() => handleAcceptBid(bid._id)}
                                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
                                    >
                                        Accept Bid
                                    </button>
                                )}
                                {bid.status === 'Accepted' && (
                                    <span className="text-green-500 font-bold">✓ Accepted</span>
                                )}
                                <button
                                    onClick={() => navigate('/messages', { state: { userId: bid.freelancer._id, user: bid.freelancer } })}
                                    className="block mt-2 text-blue-400 hover:text-blue-300 text-sm transition-colors"
                                >
                                    Message Freelancer
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobDetails;
