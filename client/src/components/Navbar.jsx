import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, HelpCircle, Bell, User as UserIcon, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationCenter from './NotificationCenter';

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    const NavLink = ({ to, children }) => (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to={to} className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                {children}
            </Link>
        </motion.div>
    );

    const MobileNavLink = ({ to, children, onClick }) => (
        <Link
            to={to}
            onClick={onClick}
            className="block text-lg text-gray-300 hover:text-white hover:bg-white/5 px-4 py-3 rounded-xl transition-all"
        >
            {children}
        </Link>
    );

    return (
        <>
            <nav className="fixed top-0 left-0 w-full z-50 glass border-b border-white/10 backdrop-blur-xl bg-dark/80 supports-[backdrop-filter]:bg-dark/50">
                <div className="w-full max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">

                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary shrink-0 z-50 relative">
                        Freelance<span className="text-white">Hub</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center space-x-6">
                        <NavLink to="/jobs">Find Work</NavLink>
                        <NavLink to="/how-it-works">How It Works</NavLink>
                        <NavLink to="/learning">Academy</NavLink>
                        <NavLink to="/freelancers">Hire Talent</NavLink>

                        {user && (
                            <>
                                <div className="w-px h-6 bg-white/10"></div>
                                <NavLink to="/contracts">Contracts</NavLink>
                                <NavLink to="/dashboard">Dashboard</NavLink>
                                {user.role === 'freelancer' && <NavLink to="/my-bids">My Bids</NavLink>}
                                {user.role === 'client' && <NavLink to="/my-jobs">My Jobs</NavLink>}
                                <NavLink to="/messages">Messages</NavLink>
                            </>
                        )}
                    </div>

                    {/* Right Side Actions (Desktop) */}
                    <div className="hidden lg:flex items-center space-x-3">
                        {user ? (
                            <>
                                <button
                                    onClick={() => window.dispatchEvent(new Event('startTour'))}
                                    className="text-gray-400 hover:text-white transition-colors"
                                    title="Start Tour"
                                >
                                    <HelpCircle size={20} />
                                </button>

                                <NotificationCenter user={user} />

                                {user.role === 'client' ? (
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Link to="/create-job" className="bg-primary hover:bg-secondary text-white px-5 py-2.5 rounded-full font-bold transition-all shadow-lg shadow-primary/20 text-sm">
                                            Post a Job
                                        </Link>
                                    </motion.div>
                                ) : (
                                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                                        <span className="text-gray-400 text-xs">Balance:</span>
                                        <span className="text-emerald-400 font-bold text-sm">${user.balance?.toFixed(2) || '0.00'}</span>
                                    </div>
                                )}

                                <div className="relative group">
                                    <Link to="/profile" className="flex items-center gap-3 pl-3 pr-1 py-1 rounded-full hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                                        <span className="text-sm font-medium">{user.username}</span>
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-xs">
                                            {user.username?.[0]?.toUpperCase()}
                                        </div>
                                    </Link>

                                    {/* Dropdown for Logout */}
                                    <div className="absolute right-0 top-full mt-2 w-48 py-2 bg-[#111827] border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 flex items-center gap-2"
                                        >
                                            <LogOut size={16} /> Log Out
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-white hover:text-primary transition-colors font-medium text-sm">Log In</Link>
                                <Link to="/register" className="bg-white/10 hover:bg-white/20 text-white border border-white/10 px-5 py-2.5 rounded-xl font-medium transition-all text-sm">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden text-white p-2 z-50 relative"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay - Moved outside of nav wrapper to fix CSS Stacking context bug */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] lg:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-[300px] bg-[#111827] border-l border-white/10 z-[70] p-6 pt-24 shadow-2xl lg:hidden overflow-y-auto"
                        >
                            <button
                                className="absolute top-6 right-6 text-white p-2 z-50 bg-white/5 rounded-full hover:bg-white/10"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <X size={24} />
                            </button>

                            <div className="space-y-2">
                                <MobileNavLink to="/jobs">Find Work</MobileNavLink>
                                <MobileNavLink to="/how-it-works">How It Works</MobileNavLink>
                                <MobileNavLink to="/learning">Academy</MobileNavLink>
                                <MobileNavLink to="/freelancers">Hire Talent</MobileNavLink>

                                <div className="h-px bg-white/10 my-4"></div>

                                {user ? (
                                    <>
                                        <div className="flex items-center gap-3 mb-6 px-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold">
                                                {user.username?.[0]?.toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white">{user.username}</p>
                                                <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                                            </div>
                                        </div>

                                        <MobileNavLink to="/dashboard">Dashboard</MobileNavLink>
                                        <MobileNavLink to="/contracts">My Contracts</MobileNavLink>
                                        <MobileNavLink to="/messages">Messages</MobileNavLink>
                                        <MobileNavLink to="/profile">Profile</MobileNavLink>

                                        <div className="mt-6">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors"
                                            >
                                                <LogOut size={18} /> Log Out
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-3 mt-4">
                                        <Link onClick={() => setIsMobileMenuOpen(false)} to="/login" className="block w-full text-center py-3 rounded-xl border border-white/10 text-white hover:bg-white/5">
                                            Log In
                                        </Link>
                                        <Link onClick={() => setIsMobileMenuOpen(false)} to="/register" className="block w-full text-center py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90">
                                            Sign Up Free
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
