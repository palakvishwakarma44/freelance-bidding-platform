import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { API_URL } from '../config';
import ProjectArchitect from '../components/ProjectArchitect';
import PoCPreview from '../components/PoCPreview';
import { Sparkles, Users, Code, Plus, Trash2, Zap, Shield, ArrowRight } from 'lucide-react';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [bids, setBids] = useState([]);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [bidForm, setBidForm] = useState({
        amount: '',
        deliveryTime: '',
        proposal: '',
        squad: [],
        poc: ''
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
                fetchJob();
                fetchBids();
            }
        } catch (error) {
            console.error('Error accepting bid:', error);
        }
    };

    const addSquadMember = () => {
        setBidForm({
            ...bidForm,
            squad: [...bidForm.squad, { user: '', role: '' }]
        });
    };

    const removeSquadMember = (index) => {
        const newSquad = [...bidForm.squad];
        newSquad.splice(index, 1);
        setBidForm({ ...bidForm, squad: newSquad });
    };

    const handleSquadChange = (index, field, value) => {
        const newSquad = [...bidForm.squad];
        newSquad[index][field] = value;
        setBidForm({ ...bidForm, squad: newSquad });
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
                        <p className="text-gray-300 whitespace-pre-wrap mb-10">{job.description}</p>
                        
                        {job.roadmap && (
                            <div className="mt-10 border-t border-white/5 pt-10">
                                <ProjectArchitect roadmap={job.roadmap} />
                            </div>
                        )}
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
                                    placeholder="Briefly explain your approach..."
                                    required
                                />
                            </div>

                            {/* Squad Bidding Section */}
                            <div className="pt-4 border-t border-white/5">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold flex items-center gap-2">
                                        <Users size={18} className="text-primary" /> Squad Members (Optional)
                                    </h4>
                                    <button 
                                        type="button" 
                                        onClick={addSquadMember}
                                        className="text-xs text-primary hover:text-white flex items-center gap-1"
                                    >
                                        <Plus size={14} /> Add Member
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {bidForm.squad.map((member, index) => (
                                        <div key={index} className="flex gap-3">
                                            <input
                                                type="text"
                                                placeholder="User ID/Username"
                                                value={member.user}
                                                onChange={(e) => handleSquadChange(index, 'user', e.target.value)}
                                                className="glass-input flex-1 text-sm"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Role (e.g. UI Designer)"
                                                value={member.role}
                                                onChange={(e) => handleSquadChange(index, 'role', e.target.value)}
                                                className="glass-input flex-1 text-sm"
                                            />
                                            <button 
                                                type="button" 
                                                onClick={() => removeSquadMember(index)}
                                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* PoC Section */}
                            <div className="pt-4 border-t border-white/5">
                                <label className="block font-bold mb-2 flex items-center gap-2">
                                    <Code size={18} className="text-secondary" /> Proof of Concept (Optional)
                                </label>
                                <p className="text-xs text-gray-500 mb-3">Add a logic snippet or interactive preview to showcase your vision.</p>
                                <textarea
                                    value={bidForm.poc}
                                    onChange={(e) => setBidForm({ ...bidForm, poc: e.target.value })}
                                    className="glass-input w-full text-white font-mono text-sm h-32"
                                    placeholder="Paste your logic or UI description here..."
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
                                        {bid.squad?.length > 0 && (
                                            <span className="inline-block mt-1 px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 text-[10px] font-bold uppercase">Squad Bid</span>
                                        )}
                                    </div>
                                </div>
                                
                                <p className="text-gray-300 mb-4">{bid.proposal}</p>
                                
                                {bid.squad?.length > 0 && (
                                    <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/5">
                                        <p className="text-xs font-bold text-gray-400 mb-2 flex items-center gap-1 uppercase tracking-tighter">
                                            <Users size={12} /> Squad Collaboration
                                        </p>
                                        <div className="flex flex-wrap gap-4">
                                            {bid.squad.map((m, i) => (
                                                <div key={i} className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-[10px] font-bold">
                                                        {m.user?.username ? m.user.username[0].toUpperCase() : '?'}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold">{m.user?.username || m.user}</p>
                                                        <p className="text-[10px] text-gray-500">{m.role}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {bid.poc && (
                                    <div className="mb-4">
                                        <PoCPreview poc={bid.poc} />
                                    </div>
                                )}
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
