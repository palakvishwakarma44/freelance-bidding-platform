import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => {
    const ref = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    // Mouse position state
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth spring physics for rotation
    const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

    // Transform mouse position to rotation degrees
    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseXRel = e.clientX - rect.left;
        const mouseYRel = e.clientY - rect.top;

        const xPct = mouseXRel / width - 0.5;
        const yPct = mouseYRel / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            style={{
                perspective: 1000,
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            className="h-full"
        >
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                className="glass-card p-6 h-full border border-white/5 hover:border-primary/30 transition-colors group relative overflow-hidden"
            >
                {/* Glossy Reflection Gradient */}
                <div
                    className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                        background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.1) 0%, transparent 60%)'
                    }}
                />

                <div
                    className="p-4 rounded-xl bg-primary/10 w-fit text-primary mb-4 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 relative z-20"
                    style={{ transform: "translateZ(30px)" }}
                >
                    <Icon size={28} />
                </div>

                <h3
                    className="text-xl font-bold mb-3 text-white relative z-20"
                    style={{ transform: "translateZ(20px)" }}
                >
                    {title}
                </h3>

                <p
                    className="text-gray-400 leading-relaxed relative z-20"
                    style={{ transform: "translateZ(10px)" }}
                >
                    {description}
                </p>

                {/* Corner Decoration */}
                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-2 h-2 rounded-full bg-primary box-shadow-glow"></div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default FeatureCard;
