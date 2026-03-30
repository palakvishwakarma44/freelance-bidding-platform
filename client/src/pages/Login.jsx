import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Mail, Lock, Sparkles, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { API_URL } from '../config';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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
            const response = await fetch(`${API_URL}/auth/login`, {
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
                toast.success('Welcome back!');
            } else {
                toast.error(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Network error. Is the server running?');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-dark relative overflow-hidden text-white selection:bg-primary/30">
            {/* Left Branding Panel (Hidden on Mobile) */}
            <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative border-r border-white/5">
                {/* Background effects for branding side */}
                <div className="absolute inset-0 bg-grid-white opacity-20"></div>
                <div className="absolute top-0 left-0 w-full h-[30%] bg-gradient-to-b from-primary/10 to-transparent"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                <motion.div 
                    initial={{ opacity: 0, x: -30 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    className="relative z-10"
                >
                    <Link to="/" className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary inline-block mb-12">
                        Freelance<span className="text-white">Hub</span>
                    </Link>
                    
                    <h1 className="text-5xl font-bold leading-tight mb-6">
                        The Intelligent <br />
                        <span className="text-primary italic">Workspace</span>
                    </h1>
                    
                    <p className="text-gray-400 text-lg max-w-md">
                        Log in to resume building teams, generating AI roadmaps, and submitting proof-of-concept bids.
                    </p>
                </motion.div>

                {/* Floating Showcase Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.2 }}
                    className="glass-card max-w-md relative z-10 border-primary/20 bg-black/40"
                >
                    <div className="flex items-center gap-3 mb-4 text-secondary">
                        <Sparkles size={20} className="animate-pulse" />
                        <span className="font-bold uppercase tracking-wider text-xs">AI Architect</span>
                    </div>
                    <p className="font-mono text-sm text-gray-300">
                        "Your squad just received a new milestone recommendation. Review it before the codebase starts compiling."
                    </p>
                    <div className="mt-4 flex gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-dark">JS</div>
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-white">AI</div>
                    </div>
                </motion.div>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 relative z-10">
                    <span>© 2026 FreelanceHub Inc.</span>
                </div>
            </div>

            {/* Right Login Panel (Full width on mobile) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
                {/* Mobile top gradient */}
                <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-primary/10 to-transparent lg:hidden pointer-events-none"></div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md"
                >
                    <div className="text-center lg:text-left mb-10">
                        <Link to="/" className="lg:hidden text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary inline-block mb-6">
                            Freelance<span className="text-white">Hub</span>
                        </Link>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-3">Welcome Back</h2>
                        <p className="text-gray-400">Enter your credentials to access your workspace.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Input */}
                        <div className="space-y-2 relative group">
                            <label className="text-sm font-medium text-gray-300">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white hover:bg-white/10 focus:bg-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-inner"
                                    placeholder="elon@mars.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2 relative group">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-gray-300">Password</label>
                                <Link to="#" className="text-xs text-primary hover:text-primary/80 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-12 text-white hover:bg-white/10 focus:bg-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-inner"
                                    placeholder="••••••••"
                                    required
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
                            className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-primary to-secondary hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Authenticating...' : 'Sign In'}
                            {!isSubmitting && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    {/* Divider & Social (Visual only for realism) */}
                    <div className="mt-8 relative flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <span className="relative bg-dark px-4 text-xs text-gray-500">OR CONTINUE WITH</span>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <button type="button" className="py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 flex justify-center items-center transition-colors">
                            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg>
                        </button>
                        <button type="button" className="py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 flex justify-center items-center transition-colors">
                           <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
                        </button>
                    </div>

                    <p className="text-center text-gray-400 mt-10 text-sm">
                        New to FreelanceHub? <Link to="/register" className="text-white hover:text-primary font-bold transition-colors">Create an account</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
