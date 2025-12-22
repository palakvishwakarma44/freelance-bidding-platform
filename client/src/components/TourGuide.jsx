import React, { useState, useEffect } from 'react';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import { useLocation } from 'react-router-dom';

const TourGuide = () => {
    const location = useLocation();
    const [run, setRun] = useState(false);
    const [steps, setSteps] = useState([]);

    useEffect(() => {
        const handleStartTour = () => {
            setRun(true);
            setSteps([
                {
                    target: 'body',
                    content: 'Welcome to FreelanceHub! This demo will guide you through the main features.',
                    placement: 'center',
                },
                {
                    target: 'nav',
                    content: 'This is your main navigation bar. Access Jobs, Freelancers, and your Dashboard here.',
                    placement: 'bottom'
                },
                {
                    target: 'nav a[href="/jobs"]',
                    content: 'Click "Find Work" to browse available jobs posted by clients.',
                },
                {
                    target: 'nav a[href="/freelancers"]',
                    content: 'Clients can find top talent by browsing the "Hire Freelancers" section.',
                },
                {
                    target: 'button[aria-label="Notifications"]', // We need to add this aria-label to Nav's notification button
                    content: 'Check here for updates! You will be notified when you get a bid, or a contract is approved.',
                },
                {
                    target: '.glass-btn',
                    content: 'Look for these buttons to take primary actions like "Post a Job" or "View Details".',
                },
                {
                    target: 'button.fixed',
                    content: 'Need help? Our AI Assistant is always here to help you navigate or answer questions.',
                }
            ]);
        };

        window.addEventListener('startTour', handleStartTour);

        // Auto-start only if not seen
        if (location.pathname === '/') {
            const hasSeenTour = localStorage.getItem('hasSeenTour');
            if (!hasSeenTour) {
                // handleStartTour(); // Optional: Auto-start or just wait for user
                // Let's keep auto-start for first time
                handleStartTour();
            }
        }

        return () => window.removeEventListener('startTour', handleStartTour);
    }, [location]);

    const handleJoyrideCallback = (data) => {
        const { status, type } = data;

        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
            setRun(false);
            localStorage.setItem('hasSeenTour', 'true');
        }
    };

    return (
        <Joyride
            steps={steps}
            run={run}
            continuous
            showSkipButton
            showProgress
            styles={{
                options: {
                    primaryColor: '#8b5cf6',
                    textColor: '#333',
                    zIndex: 10000,
                },
                tooltipContainer: {
                    textAlign: 'left',
                },
                buttonNext: {
                    backgroundColor: '#8b5cf6',
                },
                buttonBack: {
                    color: '#8b5cf6',
                }
            }}
            callback={handleJoyrideCallback}
        />
    );
};

export default TourGuide;
