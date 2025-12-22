import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { API_URL } from '../config';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: '',
        search: '',
        minBudget: '',
        maxBudget: ''
    });

    const categories = ['Development', 'Design', 'Marketing', 'Writing', 'Video', 'Other'];

    useEffect(() => {
        fetchJobs();
    }, [filters]);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            let query = new URLSearchParams();
            if (filters.category) query.append('category', filters.category);
            if (filters.search) query.append('search', filters.search);
            if (filters.minBudget) query.append('minBudget', filters.minBudget);
            if (filters.maxBudget) query.append('maxBudget', filters.maxBudget);

            const response = await fetch(`${API_URL}/jobs?${query.toString()}`);
            const data = await response.json();
            setJobs(data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-6">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10">
                    <h1 className="text-4xl font-bold mb-6 md:mb-0">Explore Jobs</h1>
                    <Link to="/create-job" className="glass-btn">
                        Post a Job
                    </Link>
                </div>

                {/* Filters */}
                {/* Filters */}
                <div className="glass-card mb-8 p-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                name="search"
                                placeholder="Search for jobs..."
                                className="glass-input w-full pl-10"
                                value={filters.search}
                                onChange={handleFilterChange}
                            />
                        </div>
                        <div className="flex gap-2 items-center w-full md:w-auto">
                            <input
                                type="number"
                                name="minBudget"
                                placeholder="Min $"
                                className="glass-input w-24"
                                value={filters.minBudget}
                                onChange={handleFilterChange}
                            />
                            <span className="text-gray-400">-</span>
                            <input
                                type="number"
                                name="maxBudget"
                                placeholder="Max $"
                                className="glass-input w-24"
                                value={filters.maxBudget}
                                onChange={handleFilterChange}
                            />
                        </div>
                    </div>

                    {/* Category Chips */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setFilters({ ...filters, category: '' })}
                            className={`px-4 py-2 rounded-full text-sm transition-all ${filters.category === ''
                                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            All
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilters({ ...filters, category: cat })}
                                className={`px-4 py-2 rounded-full text-sm transition-all ${filters.category === cat
                                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Job Grid */}
                {loading ? (
                    <LoadingSpinner />
                ) : jobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map((job, index) => (
                            <Link key={job._id} to={`/jobs/${job._id}`}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="glass-card hover:border-primary/50 transition-colors group cursor-pointer h-full"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="bg-primary/20 text-primary text-xs px-3 py-1 rounded-full border border-primary/20">
                                            {job.category}
                                        </span>
                                        <span className="text-gray-400 text-sm">
                                            {new Date(job.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{job.title}</h3>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">{job.description}</p>
                                    <div className="flex justify-between items-center pt-4 border-t border-white/10">
                                        <div>
                                            <p className="text-xs text-gray-500">Budget</p>
                                            <p className="font-bold text-lg">${job.budget}</p>
                                        </div>
                                        <span className="text-sm text-secondary group-hover:text-white transition-colors">
                                            View Details →
                                        </span>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <EmptyState message="No jobs found matching your criteria." />
                )}
            </div>
        </div>
    );
};

export default Jobs;
