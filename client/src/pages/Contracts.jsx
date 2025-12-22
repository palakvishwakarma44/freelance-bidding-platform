import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileText, Check, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { API_URL } from '../config';

const Contracts = () => {
    const [contracts, setContracts] = useState([]);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [selectedContract, setSelectedContract] = useState(null);
    const [submissionData, setSubmissionData] = useState({ description: '', file: null });
    const [uploading, setUploading] = useState(false);
    const [reviewModal, setReviewModal] = useState({ isOpen: false, contractId: null, revieweeId: null, jobId: null });
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

    useEffect(() => {
        fetchContracts();
    }, []);

    const fetchContracts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/contracts`, {
                headers: { 'x-auth-token': token }
            });
            const data = await response.json();
            setContracts(data);
        } catch (error) {
            console.error('Error fetching contracts:', error);
        }
    };

    const handleStatusUpdate = async (contractId, action, payload = {}) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/contracts/${contractId}/${action}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                fetchContracts();
                if (action === 'approve') {
                    toast.success('Work approved! Payment released.');
                    triggerConfetti();
                }
            }
        } catch (error) {
            console.error('Error updating contract:', error);
        }
    };

    const triggerConfetti = () => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const random = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSubmissionData({ ...submissionData, file });
        }
    };

    const submitWork = async () => {
        if (!submissionData.description || !submissionData.file) {
            toast.error('Please provide a description and upload a file');
            return;
        }

        setUploading(true);

        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // In a real app, you'd upload the file to S3/Cloudinary here and get a URL
        // For this mock, we'll use a fake URL
        const mockUrl = `https://storage.freelancehub.com/${submissionData.file.name}`;

        await handleStatusUpdate(selectedContract, 'submit', {
            link: mockUrl,
            description: submissionData.description
        });

        setUploading(false);
        setSelectedContract(null);
        setSubmissionData({ description: '', file: null });
        toast.success('Work submitted successfully!');
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({
                    jobId: reviewModal.jobId,
                    revieweeId: reviewModal.revieweeId,
                    rating: reviewForm.rating,
                    comment: reviewForm.comment
                })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Review submitted successfully!');
                setReviewModal({ isOpen: false, contractId: null, revieweeId: null, jobId: null });
                setReviewForm({ rating: 5, comment: '' });
                fetchContracts(); // Refresh to potentially show "Reviewed" status if we were tracking it
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('Failed to submit review');
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-6">
            <div className="container mx-auto max-w-5xl">
                <h1 className="text-3xl font-bold mb-8">My Contracts</h1>

                <div className="grid gap-6">
                    {contracts.map((contract) => (
                        <motion.div
                            key={contract._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold mb-1">{contract.job.title}</h3>
                                    <p className="text-gray-400 text-sm">
                                        {user.role === 'client' ? `Freelancer: ${contract.freelancer.username}` : `Client: ${contract.client.username}`}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold 
                  ${contract.status === 'Active' ? 'bg-blue-500/20 text-blue-500' :
                                        contract.status === 'Submitted' ? 'bg-yellow-500/20 text-yellow-500' :
                                            contract.status === 'Completed' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-400'}`}>
                                    {contract.status}
                                </span>
                            </div>

                            <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-4">
                                <div className="text-sm text-gray-400">
                                    Amount: <span className="text-white font-bold">${contract.amount}</span>
                                </div>

                                <div className="space-x-4">
                                    {/* Freelancer Actions */}
                                    {user.role === 'freelancer' && contract.status === 'Active' && (
                                        <button
                                            onClick={() => setSelectedContract(contract._id)}
                                            className="glass-btn text-sm px-4 py-2 flex items-center gap-2"
                                        >
                                            <Upload size={16} /> Submit Work
                                        </button>
                                    )}

                                    {/* Client Actions */}
                                    {user.role === 'client' && contract.status === 'Submitted' && (
                                        <div className="flex items-center gap-4">
                                            <a href={contract.submission.link} target="_blank" rel="noreferrer" className="text-primary hover:underline text-sm">
                                                View Submission
                                            </a>
                                            <button
                                                onClick={() => handleStatusUpdate(contract._id, 'approve')}
                                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                                            >
                                                Approve & Pay
                                            </button>
                                        </div>
                                    )}

                                    {user.role === 'client' && contract.status === 'Completed' && (
                                        <button
                                            onClick={() => setReviewModal({
                                                isOpen: true,
                                                contractId: contract._id,
                                                revieweeId: contract.freelancer._id,
                                                jobId: contract.job._id
                                            })}
                                            className="glass-btn text-sm px-4 py-2 flex items-center gap-2"
                                        >
                                            <Star size={16} /> Leave Review
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {contracts.length === 0 && (
                        <p className="text-center text-gray-500 mt-10">No active contracts found.</p>
                    )}
                </div>
            </div>

            {/* Submission Modal */}
            <AnimatePresence>
                {selectedContract && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="glass-card w-full max-w-md p-6 relative"
                        >
                            <button
                                onClick={() => setSelectedContract(null)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                            >
                                <X size={24} />
                            </button>

                            <h2 className="text-2xl font-bold mb-6">Submit Your Work</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Description</label>
                                    <textarea
                                        value={submissionData.description}
                                        onChange={(e) => setSubmissionData({ ...submissionData, description: e.target.value })}
                                        className="glass-input w-full h-32 resize-none"
                                        placeholder="Describe what you've done..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Attach File</label>
                                    <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-primary/50 transition-colors relative">
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        {submissionData.file ? (
                                            <div className="flex flex-col items-center text-primary">
                                                <FileText size={32} className="mb-2" />
                                                <span className="text-sm font-medium">{submissionData.file.name}</span>
                                                <span className="text-xs text-gray-400">{(submissionData.file.size / 1024 / 1024).toFixed(2)} MB</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center text-gray-400">
                                                <Upload size={32} className="mb-2" />
                                                <span className="text-sm">Click or drag to upload file</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={submitWork}
                                    disabled={uploading}
                                    className="glass-btn w-full py-3 mt-4 flex items-center justify-center gap-2"
                                >
                                    {uploading ? (
                                        <>Uploading...</>
                                    ) : (
                                        <><Check size={18} /> Submit Work</>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Review Modal */}
            <AnimatePresence>
                {reviewModal.isOpen && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="glass-card w-full max-w-md p-6 relative"
                        >
                            <button
                                onClick={() => setReviewModal({ isOpen: false, contractId: null, revieweeId: null, jobId: null })}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                            >
                                <X size={24} />
                            </button>

                            <h2 className="text-2xl font-bold mb-6">Rate Freelancer</h2>

                            <form onSubmit={handleReviewSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                                className={`text-2xl transition-colors ${star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Comment</label>
                                    <textarea
                                        value={reviewForm.comment}
                                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                        className="glass-input w-full h-32 resize-none"
                                        placeholder="How was your experience?"
                                        required
                                    />
                                </div>

                                <button type="submit" className="glass-btn w-full py-3">Submit Review</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Contracts;
