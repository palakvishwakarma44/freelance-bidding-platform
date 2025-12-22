import express from 'express';
import Review from '../models/Review.js';
import User from '../models/User.js';
import Job from '../models/Job.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Create a Review
router.post('/', auth, async (req, res) => {
    try {
        const { revieweeId, jobId, rating, comment } = req.body;

        // Check if job exists and is completed
        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        // This check might be too strict if we allow reviews before "Completed" status in some flows, 
        // but generally reviews are after completion.
        if (job.status !== 'Completed') {
            return res.status(400).json({ message: 'Job must be completed to leave a review' });
        }

        // Verify the reviewer was actually involved? 
        // Client reviewing Freelancer: reviewer=Client, reviewee=Freelancer

        const newReview = new Review({
            reviewer: req.user.id,
            reviewee: revieweeId,
            job: jobId,
            rating,
            comment
        });

        await newReview.save();

        // Update User's Rating
        const user = await User.findById(revieweeId);
        if (user) {
            // Add review to user's reviews array
            user.profile.reviews.push(newReview._id);

            // Recalculate average rating
            // We need to fetch all reviews to calculate properly
            const reviews = await Review.find({ reviewee: revieweeId });
            const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
            user.profile.rating = totalRating / reviews.length;

            await user.save();
        }

        res.json(newReview);
    } catch (err) {
        console.error(err.message);
        if (err.code === 11000) {
            return res.status(400).json({ message: 'You have already reviewed this job' });
        }
        res.status(500).send('Server Error');
    }
});

// Get Reviews for a User
router.get('/user/:userId', async (req, res) => {
    try {
        const reviews = await Review.find({ reviewee: req.params.userId })
            .populate('reviewer', 'username profile')
            .populate('job', 'title')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
