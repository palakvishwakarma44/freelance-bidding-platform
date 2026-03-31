const isProduction = import.meta.env.MODE === 'production';

// In production, we use the environment variable VITE_API_URL or fallback to relative path if served from same origin
// In development, we use localhost:5000
export const API_URL = import.meta.env.VITE_API_URL || (isProduction ? 'https://freelance-bidding-platform.onrender.com/api' : 'http://localhost:5000/api');

export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (isProduction ? 'https://freelance-bidding-platform.onrender.com' : 'http://localhost:5000');

// Helper to get full auth token header
export const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'x-auth-token': token, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
};
