import express from 'express';
import Message from '../models/Message.js';
import User from '../models/User.js';


const router = express.Router();

// Middleware to verify token
import auth from '../middleware/auth.js';

// Get conversation with a specific user
router.get('/:userId', auth, async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user.id, receiver: req.params.userId },
                { sender: req.params.userId, receiver: req.user.id }
            ]
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get list of users I have chatted with (Recent Chats)
router.get('/conversations/recent', auth, async (req, res) => {
    try {
        // Find all messages where I am sender or receiver
        const messages = await Message.find({
            $or: [{ sender: req.user.id }, { receiver: req.user.id }]
        }).populate('sender', 'username profile').populate('receiver', 'username profile').sort({ createdAt: -1 });

        const users = new Map();
        messages.forEach(msg => {
            const otherUser = msg.sender._id.toString() === req.user.id ? msg.receiver : msg.sender;
            if (!users.has(otherUser._id.toString())) {
                users.set(otherUser._id.toString(), {
                    user: otherUser,
                    lastMessage: msg.content,
                    timestamp: msg.createdAt
                });
            }
        });

        res.json(Array.from(users.values()));
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
