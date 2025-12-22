import express from 'express';
import auth from '../middleware/auth.js';
import Job from '../models/Job.js';
import Contract from '../models/Contract.js';
import Bid from '../models/Bid.js';
import User from '../models/User.js';

const router = express.Router();

// Get Dashboard Stats
router.get('/stats', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;
        let stats = [];
        let activityData = [];

        if (role === 'freelancer') {
            // Freelancer Stats
            const user = await User.findById(userId);
            const activeContracts = await Contract.countDocuments({ freelancer: userId, status: 'Active' });
            const completedContracts = await Contract.countDocuments({ freelancer: userId, status: 'Completed' });

            // Calculate total earnings from completed contracts
            const earnings = await Contract.aggregate([
                { $match: { freelancer: userId, status: 'Completed' } }, // Match strictly by ID if possible, but aggregate needs ObjectId usually. 
                // However, Mongoose handles casting. Let's rely on that or use logic in js for simplicity if dataset is small, 
                // but aggregation is better.
                // Wait, Contract.freelancer is an ObjectId. aggregate pipeline might need casting if we pass string.
                // req.user.id is string from JWT usually.
            ]);

            // Re-fetching user to be sure of balance
            stats = [
                { label: 'Total Earnings', value: `$${user.balance?.toFixed(2) || '0.00'}`, icon: 'dollar', color: 'from-green-500 to-emerald-700' },
                { label: 'Active Jobs', value: activeContracts.toString(), icon: 'briefcase', color: 'from-blue-500 to-indigo-700' },
                { label: 'Completed Jobs', value: completedContracts.toString(), icon: 'check', color: 'from-purple-500 to-pink-700' },
                { label: 'Success Rate', value: '100%', icon: 'activity', color: 'from-orange-500 to-red-700' } // Placeholder for now
            ];

            // Mocking activity data for now - hard to aggregate daily earnings without transaction history
            activityData = [
                { name: 'Mon', amount: 0 },
                { name: 'Tue', amount: 0 },
                { name: 'Wed', amount: 0 },
                { name: 'Thu', amount: 0 },
                { name: 'Fri', amount: 0 },
                { name: 'Sat', amount: 0 },
                { name: 'Sun', amount: 0 },
            ];

        } else {
            // Client Stats
            const totalSpent = await Contract.aggregate([
                { $match: { client: userId, status: 'Completed' } },
                // We'll calculate mock sum in JS for now as user IDs might need casting for $match in aggregate
            ]);

            // Alternative: Fetch all completed contracts and sum in JS
            const completedContractsList = await Contract.find({ client: userId, status: 'Completed' });
            const totalSpentAmount = completedContractsList.reduce((acc, curr) => acc + curr.amount, 0);

            const activeContracts = await Contract.countDocuments({ client: userId, status: 'Active' });
            const postedJobs = await Job.countDocuments({ client: userId });
            const hires = await Contract.countDocuments({ client: userId });

            stats = [
                { label: 'Total Spent', value: `$${totalSpentAmount.toFixed(2)}`, icon: 'dollar', color: 'from-green-500 to-emerald-700' },
                { label: 'Active Contracts', value: activeContracts.toString(), icon: 'briefcase', color: 'from-blue-500 to-indigo-700' },
                { label: 'Total Hires', value: hires.toString(), icon: 'users', color: 'from-purple-500 to-pink-700' },
                { label: 'Jobs Posted', value: postedJobs.toString(), icon: 'trending', color: 'from-orange-500 to-red-700' }
            ];
            activityData = [
                { name: 'Mon', amount: 0 },
                { name: 'Tue', amount: 0 },
                { name: 'Wed', amount: 0 },
                { name: 'Thu', amount: 0 },
                { name: 'Fri', amount: 0 },
                { name: 'Sat', amount: 0 },
                { name: 'Sun', amount: 0 },
            ];
        }

        res.json({ stats, activityData });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
