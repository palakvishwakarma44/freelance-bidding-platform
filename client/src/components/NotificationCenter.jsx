import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import io from 'socket.io-client';
import { API_URL, SOCKET_URL } from '../config';

const NotificationCenter = ({ user }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const socketRef = useRef(null);

    useEffect(() => {
        // Fetch initial notifications
        fetchNotifications();

        // Setup Socket.io
        socketRef.current = io(SOCKET_URL);
        socketRef.current.emit('join', user._id);

        socketRef.current.on('notification', (newNotification) => {
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);

            // Play sound (optional)
            const audio = new Audio('/notification.mp3'); // Make sure this file exists or remove
            audio.play().catch(e => console.log('Audio play failed', e));
        });

        // Click outside to close
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            if (socketRef.current) socketRef.current.disconnect();
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/notifications`, {
                headers: { 'x-auth-token': token }
            });
            const data = await response.json();
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.isRead).length);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async () => {
        if (unreadCount === 0) return;

        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_URL}/notifications/mark-read`, {
                method: 'PUT',
                headers: { 'x-auth-token': token }
            });
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    };

    const toggleDropdown = () => {
        if (!isOpen) {
            markAsRead();
        }
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="relative p-2 text-gray-300 hover:text-white transition-colors"
            >
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-80 bg-[#1e293b] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                    >
                        <div className="p-4 border-b border-white/10 flex justify-between items-center">
                            <h3 className="font-bold text-white">Notifications</h3>
                            <span className="text-xs text-gray-400">{notifications.length} Recent</span>
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map((notification) => (
                                    <div
                                        key={notification._id}
                                        className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${!notification.isRead ? 'bg-primary/10' : ''}`}
                                    >
                                        <p className="text-sm text-gray-200 mb-1">{notification.message}</p>
                                        <span className="text-xs text-gray-500">
                                            {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-500">
                                    No notifications yet
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationCenter;
