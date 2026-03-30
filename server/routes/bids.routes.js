import express from 'express';
import Bid from '../models/Bid.js';
import Job from '../models/Job.js';
import Notification from '../models/Notification.js';


const router = express.Router();

import auth from '../middleware/auth.js';

// Place a Bid
router.post('/:jobId', auth, async (req, res) => {
    try {
        if (req.user.role !== 'freelancer') {
            return res.status(403).json({ message: 'Only freelancers can place bids' });
        }

        const job = await Job.findById(req.params.jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        if (job.status !== 'Open') return res.status(400).json({ message: 'Job is not open for bidding' });

        // Check if already bid
        const existingBid = await Bid.findOne({ job: req.params.jobId, freelancer: req.user.id });
        if (existingBid) return res.status(400).json({ message: 'You have already placed a bid on this job' });

        const { amount, proposal, deliveryTime, squad, poc } = req.body;

        const newBid = new Bid({
            job: req.params.jobId,
            freelancer: req.user.id,
            amount,
            proposal,
            deliveryTime,
            squad,
            poc
        });

        const bid = await newBid.save();

        // Add bid to job
        job.bids.push(bid._id);
        await job.save();

        // Create Notification for Client
        const notification = new Notification({
            recipient: job.client,
            sender: req.user.id,
            type: 'BID_RECEIVED',
            message: `New bid of $${amount} on "${job.title}"`,
            relatedId: job._id
        });
        await notification.save();

        // Emit Socket Event
        req.io.to(job.client.toString()).emit('notification', notification);

        res.json(bid);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get Bids for a Job (Client only)
router.get('/job/:jobId', auth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        // Check if user is the owner of the job
        if (job.client.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to view bids for this job' });
        }

        const bids = await Bid.find({ job: req.params.jobId })
            .populate('freelancer', 'username profile')
            .populate('squad.user', 'username profile');
        res.json(bids);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Accept a Bid
router.put('/accept/:bidId', auth, async (req, res) => {
    try {
        const bid = await Bid.findById(req.params.bidId).populate('job');
        if (!bid) return res.status(404).json({ message: 'Bid not found' });

        const job = await Job.findById(bid.job._id);
        if (job.client.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to accept bids for this job' });
        }

        // Update bid status
        bid.status = 'Accepted';
        await bid.save();

        // Update job status
        job.status = 'In Progress';
        await job.save();

        // Create Contract
        const Contract = (await import('../models/Contract.js')).default;
        const newContract = new Contract({
            job: job._id,
            client: job.client,
            freelancer: bid.freelancer,
            bid: bid._id,
            amount: bid.amount
        });
        await newContract.save();

        // Create Notification for Freelancer
        const notification = new Notification({
            recipient: bid.freelancer,
            sender: req.user.id,
            type: 'BID_ACCEPTED',
            message: `Your bid on "${job.title}" has been accepted!`,
            relatedId: newContract._id
        });
        await notification.save();

        // Emit Socket Event
        req.io.to(bid.freelancer.toString()).emit('notification', notification);

        // Reject other bids? Optional logic here.

        res.json({ message: 'Bid accepted', bid });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get bids by freelancer
router.get('/my/bids', auth, async (req, res) => {
    try {
        const bids = await Bid.find({ freelancer: req.user.id })
            .populate('job', 'title budget status')
            .sort({ createdAt: -1 });
        res.json(bids);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
