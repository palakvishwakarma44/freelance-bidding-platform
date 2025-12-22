import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { API_URL } from '../config';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'client' // Default role
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = '/'; // Force reload to update Navbar
                toast.success('Registration successful!');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Registration error:', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl opacity-30 pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card w-full max-w-md relative z-10"
            >
                <h2 className="text-3xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Create Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="glass-input w-full text-white"
                            placeholder="johndoe"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="glass-input w-full text-white"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="glass-input w-full text-white"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">I want to...</label>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'client' })}
                                className={`flex-1 py-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${formData.role === 'client' ? 'bg-primary/20 border-primary text-white scale-105' : 'border-white/10 text-gray-400 hover:bg-white/5 opacity-70'}`}
                            >
                                <span className="text-2xl">👔</span>
                                <span className="font-bold">I want to Hire</span>
                                <span className="text-xs text-gray-400">(Client)</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'freelancer' })}
                                className={`flex-1 py-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${formData.role === 'freelancer' ? 'bg-secondary/20 border-secondary text-white scale-105' : 'border-white/10 text-gray-400 hover:bg-white/5 opacity-70'}`}
                            >
                                <span className="text-2xl">💻</span>
                                <span className="font-bold">I want to Work</span>
                                <span className="text-xs text-gray-400">(Freelancer)</span>
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="glass-btn w-full py-3 text-lg mt-4">
                        Sign Up
                    </button>
                </form>
                <p className="text-center text-gray-400 mt-6 text-sm">
                    Already have an account? <Link to="/login" className="text-primary hover:text-secondary transition-colors">Log In</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
