import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Development', 'Design', 'Marketing', 'Writing', 'Video', 'Other']
    },
    budget: {
        type: Number,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Open'
    },
    bids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bid'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    roadmap: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    squadOnly: {
        type: Boolean,
        default: false
    }
});

const Job = mongoose.model('Job', jobSchema);

export default Job;
