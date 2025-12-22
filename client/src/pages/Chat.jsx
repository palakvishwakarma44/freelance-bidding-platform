import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { API_URL, SOCKET_URL } from '../config';

const Chat = () => {
    const [socket, setSocket] = useState(null);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        if (user) {
            newSocket.emit('join_room', user.id);
        }

        return () => newSocket.close();
    }, [user]);

    useEffect(() => {
        const initChat = async () => {
            await fetchConversations();
            if (location.state?.userId) {
                // Check if conversation already exists
                const existing = conversations.find(c => c.user._id === location.state.userId);
                if (existing) {
                    setActiveChat(existing);
                } else {
                    // Fetch user details to create a temporary active chat object
                    // For now, let's assume we can get it or pass it fully in state
                    if (location.state.user) {
                        setActiveChat({ user: location.state.user, lastMessage: '', timestamp: Date.now() });
                    }
                }
            }
        };
        initChat();
    }, [location.state]);

    useEffect(() => {
        if (socket) {
            socket.on('receive_message', (message) => {
                if (activeChat && (message.sender === activeChat.user._id || message.sender === user.id)) {
                    setMessages((prev) => [...prev, message]);
                    scrollToBottom();
                }
                fetchConversations(); // Refresh list to show latest message
            });
        }
    }, [socket, activeChat]);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (activeChat) {
            fetchMessages(activeChat.user._id);
        }
    }, [activeChat]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchConversations = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/messages/conversations/recent`, {
                headers: { 'x-auth-token': token }
            });
            const data = await response.json();
            setConversations(data);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };

    const fetchMessages = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/messages/${userId}`, {
                headers: { 'x-auth-token': token }
            });
            const data = await response.json();
            setMessages(data);
            scrollToBottom();
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChat) return;

        const messageData = {
            sender: user.id,
            receiver: activeChat.user._id,
            content: newMessage
        };

        socket.emit('send_message', messageData);
        setNewMessage('');
    };

    return (
        <div className="min-h-screen pt-24 pb-6 px-6 h-screen flex flex-col">
            <div className="container mx-auto flex-1 flex gap-6 max-w-6xl h-full">
                {/* Sidebar - Conversations */}
                <div className="w-1/3 glass-card flex flex-col overflow-hidden">
                    <h2 className="text-xl font-bold p-4 border-b border-white/10">Messages</h2>
                    <div className="flex-1 overflow-y-auto">
                        {conversations.map((conv) => (
                            <div
                                key={conv.user._id}
                                onClick={() => setActiveChat(conv)}
                                className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${activeChat?.user._id === conv.user._id ? 'bg-white/10' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold">{conv.user.username}</h3>
                                    <span className="text-xs text-gray-500">{new Date(conv.timestamp).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-gray-400 truncate">{conv.lastMessage}</p>
                            </div>
                        ))}
                        {conversations.length === 0 && (
                            <p className="text-center text-gray-500 p-4">No conversations yet.</p>
                        )}
                    </div>
                </div>

                {/* Main Chat Window */}
                <div className="flex-1 glass-card flex flex-col overflow-hidden">
                    {activeChat ? (
                        <>
                            <div className="p-4 border-b border-white/10 bg-white/5">
                                <h2 className="text-xl font-bold">{activeChat.user.username}</h2>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.map((msg, index) => (
                                    <div key={index} className={`flex ${msg.sender === user.id ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] p-3 rounded-lg ${msg.sender === user.id ? 'bg-primary text-white rounded-br-none' : 'bg-white/10 text-gray-200 rounded-bl-none'}`}>
                                            <p>{msg.content}</p>
                                            <p className="text-xs opacity-50 mt-1 text-right">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 flex gap-4">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="glass-input flex-1"
                                    placeholder="Type a message..."
                                />
                                <button type="submit" className="glass-btn px-6">Send</button>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                            Select a conversation to start chatting
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;
