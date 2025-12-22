import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Job from './models/Job.js';
import Bid from './models/Bid.js';
import Contract from './models/Contract.js';
import Notification from './models/Notification.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const categories = ['Development', 'Design', 'Marketing', 'Writing', 'Video', 'Other'];

const jobTitles = {
    Development: [
        "Build a Modern E-commerce Website", "React Native Mobile App", "Fix Bugs in Node.js API",
        "Full Stack Developer for SaaS", "WordPress Theme Customization", "Shopify Store Setup",
        "Python Script for Data Scraping", "AI Chatbot Integration", "Blockchain Smart Contract", "DevOps CI/CD Pipeline"
    ],
    Design: [
        "Logo Design for Tech Startup", "UI/UX Design for Mobile App", "Social Media Graphics Pack",
        "Brand Identity Guide", "Website Mockup in Figma", "3D Product Modeling",
        "Illustration for Blog Post", "Business Card Design", "Infographic Creation", "Packaging Design"
    ],
    Marketing: [
        "SEO Strategy for E-commerce", "Social Media Management", "Google Ads Campaign Setup",
        "Email Marketing Copywriting", "Instagram Influencer Outreach", "Content Marketing Plan",
        "Facebook Ad Creatives", "Market Research Report", "Community Manager Needed", "PR Outreach"
    ],
    Writing: [
        "Technical Blog Writing", "SEO Optimized Articles", "Copywriting for Landing Page",
        "Ghostwriter for E-book", "Product Descriptions", "Resume & Cover Letter Writing",
        "Script for YouTube Video", "Press Release Writing", "Translation (English to Spanish)", "Proofreading & Editing"
    ],
    Video: [
        "Explainer Video Production", "YouTube Video Editing", "TikTok/Reels Editor",
        "Motion Graphics Intro", "Corporate Training Video", "Wedding Video Editing",
        "Podcast Audio Editing", "Voice Over Artist", "Subtitles & Captions", "Animation for Social Media"
    ]
};

const generateJobs = (count) => {
    const jobs = [];
    for (let i = 0; i < count; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const titles = jobTitles[category] || jobTitles['Development'];
        const title = titles[Math.floor(Math.random() * titles.length)];

        jobs.push({
            title: `${title} - ${Math.floor(Math.random() * 1000)}`, // Unique-ish title
            description: `We are looking for an expert in ${category} to help us with "${title}". \n\nRequirements:\n- Proven experience in the field.\n- Good communication skills.\n- Ability to meet deadlines.\n\nThis is a great opportunity for long-term work if the initial project goes well.`,
            category: category,
            budget: Math.floor(Math.random() * 4500) + 500, // 500 - 5000
            deadline: new Date(Date.now() + Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000), // 1-60 days
            status: 'Open'
        });
    }
    return jobs;
};

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // 1. Create Demo Client
        let demoClient = await User.findOne({ email: 'client@demo.com' });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('demo123', salt);

        if (!demoClient) {
            demoClient = new User({
                username: 'DemoClient',
                email: 'client@demo.com',
                password: hashedPassword,
                role: 'client'
            });
            await demoClient.save();
            console.log('Demo client created');
        }

        // 2. Create Demo Freelancer
        let demoFreelancer = await User.findOne({ email: 'freelancer@demo.com' });
        if (!demoFreelancer) {
            demoFreelancer = new User({
                username: 'DemoFreelancer',
                email: 'freelancer@demo.com',
                password: hashedPassword,
                role: 'freelancer',
                profile: {
                    bio: 'Expert full-stack developer with 5 years of experience.',
                    skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
                    location: 'New York, USA'
                }
            });
            await demoFreelancer.save();
            console.log('Demo freelancer created');
        }

        // 3. Clear existing data
        await Job.deleteMany({});
        await Bid.deleteMany({});
        await Contract.deleteMany({});
        await Notification.deleteMany({});

        console.log('Cleared existing data');

        // 4. Create Jobs (50 random jobs)
        const sampleJobs = generateJobs(50);
        const createdJobs = [];

        for (const jobData of sampleJobs) {
            const job = new Job({
                ...jobData,
                client: demoClient._id
            });
            await job.save();
            createdJobs.push(job);
        }

        // 5. Create Bids & Contracts (Sample Data)
        // Bid 1: Pending
        const bid1 = new Bid({
            job: createdJobs[0]._id,
            freelancer: demoFreelancer._id,
            amount: createdJobs[0].budget - 100,
            proposal: "I can do this!",
            deliveryTime: 7,
            status: 'Pending'
        });
        await bid1.save();
        createdJobs[0].bids.push(bid1._id);
        await createdJobs[0].save();

        // Bid 2: Accepted -> Contract
        const bid2 = new Bid({
            job: createdJobs[1]._id,
            freelancer: demoFreelancer._id,
            amount: createdJobs[1].budget,
            proposal: "Let's start.",
            deliveryTime: 3,
            status: 'Accepted'
        });
        await bid2.save();
        createdJobs[1].bids.push(bid2._id);
        createdJobs[1].status = 'In Progress';
        await createdJobs[1].save();

        const contract1 = new Contract({
            job: createdJobs[1]._id,
            client: demoClient._id,
            freelancer: demoFreelancer._id,
            bid: bid2._id,
            amount: bid2.amount,
            status: 'Active'
        });
        await contract1.save();

        console.log(`✅ Successfully seeded ${sampleJobs.length} jobs!`);
        console.log('-----------------------------------');
        console.log('CLIENT LOGIN:');
        console.log('Email: client@demo.com');
        console.log('Password: demo123');
        console.log('-----------------------------------');
        console.log('FREELANCER LOGIN:');
        console.log('Email: freelancer@demo.com');
        console.log('Password: demo123');
        console.log('-----------------------------------');

        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
