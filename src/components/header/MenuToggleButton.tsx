// components/MenuToggleButton.jsx
"use client"; // Required for client-side components in Next.js App Router

import { motion } from "framer-motion";

export default function MenuToggleButton({ isOpen, toggleMenu }) {
    return (
        <button
            onClick={toggleMenu}
            className="lg:hidden relative w-10 h-8 flex flex-col justify-between items-center z-20 focus:outline-none"
            aria-label={isOpen ? "Close menu" : "Open menu"}
        >
            {/* Top Line */}
            <motion.div
                className="w-full h-1 bg-nivarana-blue rounded-full"
                animate={{
                    rotate: isOpen ? 45 : 0, // Rotates 45 degrees when open
                    y: isOpen ? 14 : 0, // Moves down to cross with bottom line
                }}
                transition={{ duration: 0.2 }} // Smooth transition
            ></motion.div>
            {/* Center Line */}
            <motion.div
                className="w-full h-1 bg-nivarana-blue rounded-full"
                animate={{
                    // rotate: isOpen ? 45 : 0, // Rotates 45 degrees when open
                    scale: isOpen ? 0 : 1,
                    // y: isOpen ? 14 : 0,     // Moves down to cross with bottom line
                }}
                transition={{ duration: 0.2 }} // Smooth transition
            ></motion.div>
            {/* Bottom Line */}
            <motion.div
                className="w-full h-1 bg-nivarana-blue rounded-full"
                animate={{
                    rotate: isOpen ? -45 : 0, // Rotates -45 degrees when open
                    y: isOpen ? -14 : 0, // Moves up to cross with top line
                }}
                transition={{ duration: 0.2 }} // Smooth transition
            ></motion.div>
        </button>
    );
}
