import express from 'express';
import Contract from '../models/Contract.js';
import Job from '../models/Job.js';
import Notification from '../models/Notification.js';


const router = express.Router();

import auth from '../middleware/auth.js';

// Get My Contracts
router.get('/', auth, async (req, res) => {
    try {
        const contracts = await Contract.find({
            $or: [{ client: req.user.id }, { freelancer: req.user.id }]
        })
            .populate('job', 'title')
            .populate('client', 'username')
            .populate('freelancer', 'username')
            .sort({ createdAt: -1 });

        res.json(contracts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Submit Work (Freelancer)
router.put('/:id/submit', auth, async (req, res) => {
    try {
        const contract = await Contract.findById(req.params.id);
        if (!contract) return res.status(404).json({ message: 'Contract not found' });

        if (contract.freelancer.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { description, link } = req.body;

        contract.submission = {
            description,
            link,
            submittedAt: Date.now()
        };
        contract.status = 'Submitted';
        await contract.save();

        // Create Notification for Client
        const notification = new Notification({
            recipient: contract.client,
            sender: req.user.id,
            type: 'SYSTEM',
            message: `Work submitted for "${contract.job.title || 'Contract'}"`,
            relatedId: contract._id
        });
        await notification.save();

        // Emit Socket Event
        req.io.to(contract.client.toString()).emit('notification', notification);

        res.json(contract);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Approve Work (Client)
router.put('/:id/approve', auth, async (req, res) => {
    try {
        const contract = await Contract.findById(req.params.id);
        if (!contract) return res.status(404).json({ message: 'Contract not found' });

        if (contract.client.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        contract.status = 'Completed';
        await contract.save();

        // Update Job status
        const job = await Job.findById(contract.job);
        job.status = 'Completed';
        await job.save();

        // Increment Freelancer Balance
        const User = (await import('../models/User.js')).default;
        await User.findByIdAndUpdate(contract.freelancer, {
            $inc: { balance: contract.amount }
        });

        // Create Notification for Freelancer
        const notification = new Notification({
            recipient: contract.freelancer,
            sender: req.user.id,
            type: 'JOB_COMPLETED',
            message: `Contract "${contract.job.title || 'Contract'}" marked as completed!`,
            relatedId: contract._id
        });
        await notification.save();

        // Emit Socket Event
        req.io.to(contract.freelancer.toString()).emit('notification', notification);

        res.json(contract);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
