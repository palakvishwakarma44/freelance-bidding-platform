import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

import Jobs from './pages/Jobs';
import CreateJob from './pages/CreateJob';

import JobDetails from './pages/JobDetails';
import Contracts from './pages/Contracts';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import MyBids from './pages/MyBids';
import MyJobs from './pages/MyJobs';
import HowItWorks from './pages/HowItWorks';
import LearningHub from './pages/LearningHub';
import Freelancers from './pages/Freelancers';
import Dashboard from './pages/Dashboard';
import { Toaster } from 'react-hot-toast';
import VirtualAssistant from './components/VirtualAssistant';
import TourGuide from './components/TourGuide';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark text-white font-sans selection:bg-primary/30 pt-24">
        <Navbar />
        <Toaster position="top-right" toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }} />
        <VirtualAssistant />
        <TourGuide />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/create-job" element={<CreateJob />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/messages" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-bids" element={<MyBids />} />
          <Route path="/my-jobs" element={<MyJobs />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/learning" element={<LearningHub />} />
          <Route path="/freelancers" element={<Freelancers />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
