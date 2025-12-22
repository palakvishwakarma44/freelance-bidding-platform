import express from 'express';
import Job from '../models/Job.js';
import User from '../models/User.js';


const router = express.Router();

import auth from '../middleware/auth.js';

// Create a Job
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'client') {
            return res.status(403).json({ message: 'Only clients can post jobs' });
        }

        const { title, description, category, budget, deadline } = req.body;

        const newJob = new Job({
            client: req.user.id,
            title,
            description,
            category,
            budget,
            deadline
        });

        const job = await newJob.save();
        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get All Jobs (with filters)
router.get('/', async (req, res) => {
    try {
        const { category, minBudget, maxBudget, search } = req.query;
        let query = { status: 'Open' };

        if (category) query.category = category;
        if (minBudget || maxBudget) {
            query.budget = {};
            if (minBudget) query.budget.$gte = minBudget;
            if (maxBudget) query.budget.$lte = maxBudget;
        }
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        const jobs = await Job.find(query).populate('client', 'username').sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get Job by ID
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('client', 'username profile');
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ message: 'Job not found' });
        res.status(500).send('Server Error');
    }
});

// Get My Jobs (Client)
router.get('/my/jobs', auth, async (req, res) => {
    try {
        const jobs = await Job.find({ client: req.user.id }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
