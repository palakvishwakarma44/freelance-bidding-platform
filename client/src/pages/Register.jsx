import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Mail, Lock, User, Briefcase, Code, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';
import { API_URL } from '../config';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'client' // Default role
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
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
                toast.success('Registration successful! Welcome to the ecosystem.');
            } else {
                toast.error(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            toast.error('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-dark relative overflow-hidden text-white selection:bg-primary/30">
            {/* Left Branding Panel (Hidden on Mobile) */}
            <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative border-r border-white/5 bg-[#0a0a0a]">
                {/* Background effects */}
                <div className="absolute inset-0 bg-grid-white opacity-10"></div>
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                <motion.div 
                    initial={{ opacity: 0, x: -30 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    className="relative z-10"
                >
                    <Link to="/" className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary inline-block mb-12">
                        Freelance<span className="text-white">Hub</span>
                    </Link>
                    
                    <h1 className="text-5xl font-bold leading-tight mb-6">
                        Join the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-secondary">Future of Work</span>
                    </h1>
                    
                    <p className="text-gray-400 text-lg max-w-md mb-8">
                        The only platform that builds roadmaps for clients and enables interactive proof-of-concept bidding for freelancers.
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                                <Sparkles size={20} />
                            </div>
                            <p className="text-sm text-gray-300 font-medium">AI Project Blueprints inside every posting</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-purple-400">
                                <User size={20} />
                            </div>
                            <p className="text-sm text-gray-300 font-medium">Collaborative multi-user Squad Bids</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-secondary">
                                <Code size={20} />
                            </div>
                            <p className="text-sm text-gray-300 font-medium">Interactive code playgrounds for previewing skills</p>
                        </div>
                    </div>
                </motion.div>

                <div className="flex items-center gap-4 text-sm text-gray-500 relative z-10">
                    <span>© 2026 FreelanceHub Inc.</span>
                </div>
            </div>

            {/* Right Registration Panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10 overflow-y-auto">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none lg:hidden"></div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md py-8"
                >
                    <div className="text-center lg:text-left mb-8">
                        <Link to="/" className="lg:hidden text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary inline-block mb-6">
                            Freelance<span className="text-white">Hub</span>
                        </Link>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-3">Create an Account</h2>
                        <p className="text-gray-400 text-sm">Join thousands of professionals in the intelligent workspace.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        
                        {/* Role Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-white mb-3 tracking-wide uppercase">Select Your Role</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'client' })}
                                    className={`relative px-4 py-5 rounded-2xl border transition-all text-left overflow-hidden ${
                                        formData.role === 'client' 
                                            ? 'bg-primary/10 border-primary focus:ring-1 focus:ring-primary' 
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                    }`}
                                >
                                    {formData.role === 'client' && <div className="absolute top-0 right-0 w-16 h-16 bg-primary/20 blur-xl"></div>}
                                    <Briefcase size={24} className={`mb-3 ${formData.role === 'client' ? 'text-primary' : 'text-gray-500'}`} />
                                    <span className={`block font-bold text-lg mb-1 ${formData.role === 'client' ? 'text-white' : ''}`}>Client</span>
                                    <span className="block text-xs opacity-70">I need to hire talent</span>
                                </button>
                                
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'freelancer' })}
                                    className={`relative px-4 py-5 rounded-2xl border transition-all text-left overflow-hidden ${
                                        formData.role === 'freelancer' 
                                            ? 'bg-secondary/10 border-secondary focus:ring-1 focus:ring-secondary' 
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                    }`}
                                >
                                    {formData.role === 'freelancer' && <div className="absolute top-0 right-0 w-16 h-16 bg-secondary/20 blur-xl"></div>}
                                    <Code size={24} className={`mb-3 ${formData.role === 'freelancer' ? 'text-secondary' : 'text-gray-500'}`} />
                                    <span className={`block font-bold text-lg mb-1 ${formData.role === 'freelancer' ? 'text-white' : ''}`}>Freelancer</span>
                                    <span className="block text-xs opacity-70">I want to find work</span>
                                </button>
                            </div>
                        </div>

                        {/* Username */}
                        <div className="space-y-2 relative group">
                            <label className="text-sm font-medium text-gray-300">Username</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-white transition-colors">
                                    @
                                </div>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white hover:bg-white/10 focus:bg-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/30 outline-none transition-all"
                                    placeholder="johndoe"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2 relative group">
                            <label className="text-sm font-medium text-gray-300">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-white transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white hover:bg-white/10 focus:bg-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/30 outline-none transition-all"
                                    placeholder="elon@mars.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2 relative group">
                            <label className="text-sm font-medium text-gray-300">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-white transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-12 text-white hover:bg-white/10 focus:bg-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/30 outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                    minLength="6"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full py-4 mt-2 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Creating Workspace...' : 'Create Account'}
                            {!isSubmitting && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <p className="text-center text-gray-400 mt-8 text-sm">
                        Already have an account? <Link to="/login" className="text-white hover:text-primary font-bold transition-colors">Log in</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
