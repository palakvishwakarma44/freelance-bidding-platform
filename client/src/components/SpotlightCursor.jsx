import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const SpotlightCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const updateMousePosition = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("mousemove", updateMousePosition);

        return () => {
            window.removeEventListener("mousemove", updateMousePosition);
        };
    }, []);

    return (
        <motion.div
            className="fixed top-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none z-0 mix-blend-screen"
            animate={{
                x: mousePosition.x - 250,
                y: mousePosition.y - 250,
            }}
            transition={{ type: "spring", damping: 30, stiffness: 200, mass: 0.5 }}
        />
    );
};

export default SpotlightCursor;
