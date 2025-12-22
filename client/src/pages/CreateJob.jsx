import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Sparkles, X } from 'lucide-react';
import { API_URL } from '../config';

const CreateJob = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Development',
        budget: '',
        deadline: ''
    });
    const [generating, setGenerating] = useState(false);
    const [showKeyInput, setShowKeyInput] = useState(false);
    const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGenerate = async () => {
        if (!formData.title) {
            toast.error('Please enter a job title first');
            return;
        }
        if (!apiKey) {
            setShowKeyInput(true);
            return;
        }

        setGenerating(true);
        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const prompt = `Write a professional and detailed job description for a ${formData.category} job titled "${formData.title}". 
            Include sections for:
            - Job Overview
            - Key Responsibilities
            - Required Skills & Qualifications
            - Why Join Us
            Keep it engaging and professional. Format with clear headings.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            setFormData(prev => ({ ...prev, description: text }));
            toast.success('Description generated with AI!');
        } catch (error) {
            console.error('Gemini Error:', error);
            toast.error('Failed to generate. Check your API Key.');
            setShowKeyInput(true); // Show input if key might be wrong
        } finally {
            setGenerating(false);
        }
    };

    const saveKeyAndGenerate = () => {
        if (!apiKey.trim()) {
            toast.error('Please enter a valid API Key');
            return;
        }
        localStorage.setItem('gemini_api_key', apiKey);
        setShowKeyInput(false);
        handleGenerate();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please login to post a job');
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/jobs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('Job posted successfully!');
                navigate('/jobs');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error posting job:', error);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto glass-card"
            >
                <h2 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Post a New Job</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Job Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="glass-input w-full text-white"
                            placeholder="e.g. Build a React E-commerce Site"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="glass-input w-full text-white bg-dark/50"
                        >
                            <option value="Development">Development</option>
                            <option value="Design">Design</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Writing">Writing</option>
                            <option value="Video">Video</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="relative">
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-gray-400 text-sm">Description</label>
                            <button
                                type="button"
                                onClick={handleGenerate}
                                disabled={generating}
                                className="text-xs flex items-center gap-1 text-secondary hover:text-white transition-colors"
                            >
                                <Sparkles size={14} />
                                {generating ? 'Generating...' : 'Generate with AI'}
                            </button>
                        </div>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="glass-input w-full text-white h-64 resize-none"
                            placeholder="Describe your project details..."
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-400 text-sm mb-2">Budget ($)</label>
                            <input
                                type="number"
                                name="budget"
                                value={formData.budget}
                                onChange={handleChange}
                                className="glass-input w-full text-white"
                                placeholder="500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-2">Deadline</label>
                            <input
                                type="date"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleChange}
                                className="glass-input w-full text-white"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="glass-btn w-full py-3 text-lg mt-6">
                        Post Job
                    </button>
                </form>
            </motion.div>

            {/* API Key Modal */}
            <AnimatePresence>
                {showKeyInput && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-[#1e293b] p-6 rounded-2xl max-w-md w-full border border-white/10 relative"
                        >
                            <button
                                onClick={() => setShowKeyInput(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Sparkles className="text-secondary" />
                                Enter Gemini API Key
                            </h3>
                            <p className="text-gray-400 text-sm mb-4">
                                To use AI generation, please enter your Google Gemini API Key. It will be saved locally in your browser.
                            </p>
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="Paste your API Key here"
                                className="glass-input w-full mb-4"
                            />
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowKeyInput(false)}
                                    className="px-4 py-2 text-gray-300 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveKeyAndGenerate}
                                    className="glass-btn px-6 py-2"
                                >
                                    Save & Generate
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-4 text-center">
                                Don't have a key? <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Get one here</a>
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CreateJob;
