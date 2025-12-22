import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Briefcase, MapPin, Edit2, Save, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_URL } from '../config';

const Profile = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        bio: 'Passionate freelancer ready to work!',
        skills: 'React, Node.js, Design',
        location: 'Remote'
    });
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username,
                email: user.email,
                bio: user.profile?.bio || 'Passionate freelancer ready to work!',
                skills: user.profile?.skills?.join(', ') || 'React, Node.js, Design',
                location: user.profile?.location || 'Remote'
            });
            fetchReviews(user._id || user.id);
        }
    }, [user]);

    const fetchReviews = async (userId) => {
        try {
            const response = await fetch(`${API_URL}/reviews/user/${userId}`);
            const data = await response.json();
            setReviews(data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // In a real app, you would send a PUT request to update the user profile
        // For now, we'll just update local state and show a success message

        const updatedUser = {
            ...user,
            username: formData.username,
            profile: {
                bio: formData.bio,
                skills: formData.skills.split(',').map(s => s.trim()),
                location: formData.location
            }
        };

        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
    };

    if (!user) return <div className="pt-24 text-center">Please login to view profile.</div>;

    return (
        <div className="min-h-screen pt-24 pb-12 px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
            >
                <div className="glass-card p-8 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary/20 to-secondary/20"></div>

                    <div className="relative z-10 flex flex-col md:flex-row gap-8 mt-12">
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-primary to-secondary p-1">
                                <div className="w-full h-full rounded-full bg-dark flex items-center justify-center">
                                    <span className="text-4xl font-bold text-white">{user.username.charAt(0).toUpperCase()}</span>
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold mt-4">{user.username}</h2>
                            <span className="bg-white/10 px-3 py-1 rounded-full text-sm mt-2 capitalize">{user.role}</span>

                            <div className="flex items-center gap-1 mt-4 text-yellow-500">
                                <Star fill="currentColor" size={20} />
                                <span className="font-bold text-lg">
                                    {(reviews.reduce((acc, curr) => acc + curr.rating, 0) / (reviews.length || 1)).toFixed(1)}
                                </span>
                                <span className="text-gray-400 text-sm ml-1">({reviews.length} reviews)</span>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">Profile Details</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={async () => {
                                            const newRole = user.role === 'client' ? 'freelancer' : 'client';
                                            if (window.confirm(`Switch to ${newRole.charAt(0).toUpperCase() + newRole.slice(1)} view?`)) {
                                                try {
                                                    const token = localStorage.getItem('token');
                                                    const response = await fetch(`${API_URL}/auth/switch-role`, {
                                                        method: 'PUT',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                            'x-auth-token': token
                                                        },
                                                        body: JSON.stringify({ role: newRole })
                                                    });
                                                    const data = await response.json();
                                                    if (response.ok) {
                                                        localStorage.setItem('user', JSON.stringify(data));
                                                        window.location.reload();
                                                    }
                                                } catch (err) {
                                                    toast.error("Failed to switch role");
                                                }
                                            }
                                        }}
                                        className="bg-white/10 text-white px-3 py-2 rounded-lg text-sm hover:bg-white/20 transition-colors"
                                    >
                                        Switch to {user.role === 'client' ? 'Freelancer' : 'Client'}
                                    </button>
                                    <button
                                        onClick={() => isEditing ? document.getElementById('profile-form').requestSubmit() : setIsEditing(true)}
                                        className="glass-btn px-4 py-2 flex items-center gap-2"
                                    >
                                        {isEditing ? <><Save size={18} /> Save</> : <><Edit2 size={18} /> Edit</>}
                                    </button>
                                </div>
                            </div>

                            <form id="profile-form" onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2 flex items-center gap-2">
                                            <User size={16} /> Username
                                        </label>
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className={`glass-input w-full ${!isEditing && 'opacity-50 cursor-not-allowed'}`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2 flex items-center gap-2">
                                            <Mail size={16} /> Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            disabled
                                            className="glass-input w-full opacity-50 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Bio</label>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className={`glass-input w-full h-24 resize-none ${!isEditing && 'opacity-50 cursor-not-allowed'}`}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2 flex items-center gap-2">
                                            <Briefcase size={16} /> Skills
                                        </label>
                                        <input
                                            type="text"
                                            name="skills"
                                            value={formData.skills}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className={`glass-input w-full ${!isEditing && 'opacity-50 cursor-not-allowed'}`}
                                            placeholder="e.g. React, Node.js, Design"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2 flex items-center gap-2">
                                            <MapPin size={16} /> Location
                                        </label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className={`glass-input w-full ${!isEditing && 'opacity-50 cursor-not-allowed'}`}
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    {reviews.length > 0 && (
                        <div className="mt-12 border-t border-white/10 pt-8">
                            <h3 className="text-xl font-bold mb-6">Reviews</h3>
                            <div className="space-y-6">
                                {reviews.map((review) => (
                                    <div key={review._id} className="bg-white/5 p-6 rounded-xl">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold">
                                                    {review.reviewer.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold">{review.reviewer.username}</h4>
                                                    <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 text-yellow-500">
                                                <Star fill="currentColor" size={16} />
                                                <span className="font-bold">{review.rating}</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-300 italic">"{review.comment}"</p>
                                        <p className="text-xs text-gray-500 mt-2">Project: {review.job.title}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;
