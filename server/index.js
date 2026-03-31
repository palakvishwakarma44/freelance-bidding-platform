import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || ["http://localhost:5173", "http://localhost:5174"],
        methods: ["GET", "POST"],
        credentials: true
    }
});

import authRoutes from './routes/auth.routes.js';
import jobRoutes from './routes/jobs.routes.js';
import bidRoutes from './routes/bids.routes.js';
import contractRoutes from './routes/contracts.routes.js';
import notificationRoutes from './routes/notifications.routes.js';
import messageRoutes from './routes/messages.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import reviewRoutes from './routes/reviews.routes.js';

app.use(cors({
  origin: [process.env.CLIENT_URL],
  credentials: true
}));
app.use(express.json());

// Make io available in routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reviews', reviewRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

app.get('/', (req, res) => {
    res.send('Freelance Platform API');
});

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
