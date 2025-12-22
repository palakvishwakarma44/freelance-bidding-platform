import mongoose from 'mongoose';

const contractSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    freelancer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bid',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Submitted', 'Completed', 'Cancelled'],
        default: 'Active'
    },
    submission: {
        description: String,
        link: String,
        submittedAt: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Contract = mongoose.model('Contract', contractSchema);

export default Contract;
