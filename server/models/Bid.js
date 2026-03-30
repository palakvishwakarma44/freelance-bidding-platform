import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    freelancer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    proposal: {
        type: String,
        required: true
    },
    deliveryTime: {
        type: Number, // In days
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    squad: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: { type: String }
    }],
    poc: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    }
});

const Bid = mongoose.model('Bid', bidSchema);

export default Bid;
