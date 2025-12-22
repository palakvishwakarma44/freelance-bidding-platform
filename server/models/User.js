import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['client', 'freelancer'],
        required: true
    },
    profile: {
        bio: String,
        skills: [String],
        portfolio: [String], // URLs to portfolio items
        rating: {
            type: Number,
            default: 0
        },
        reviews: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    balance: {
        type: Number,
        default: 0
    }
});

const User = mongoose.model('User', userSchema);

export default User;
