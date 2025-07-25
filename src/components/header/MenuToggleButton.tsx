// components/MenuToggleButton.jsx
"use client";

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
                    rotate: isOpen ? 45 : 0,
                    y: isOpen ? 14 : 0,
                }}
                transition={{ duration: 0.2 }}
            ></motion.div>
            {/* Center Line */}
            <motion.div
                className="w-full h-1 bg-nivarana-blue rounded-full"
                animate={{
                    scale: isOpen ? 0 : 1,
                }}
                transition={{ duration: 0.2 }}
            ></motion.div>
            {/* Bottom Line */}
            <motion.div
                className="w-full h-1 bg-nivarana-blue rounded-full"
                animate={{
                    rotate: isOpen ? -45 : 0,
                    y: isOpen ? -14 : 0,
                }}
                transition={{ duration: 0.2 }}
            ></motion.div>
        </button>
    );
}
