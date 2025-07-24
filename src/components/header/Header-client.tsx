"use client";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import MenuToggleButton from "./MenuToggleButton";
import Search from "../search/sidebar-search";

const menuVariants = {
    hidden: {
        height: 0,
        opacity: 0,
        y: -20, // Start slightly above for the slide down effect
        transition: {
            duration: 0.3,
            ease: "easeOut",
        },
    },
    visible: {
        height: "auto",
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: "easeIn",
        },
    },
};

function HeaderClient({ categories }) {
    const [showCategories, setShowCategories] = useState(false);
    return (
        <>
            <motion.div
                initial={{ y: "50%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                className="self-end"
            >
                <MenuToggleButton
                    isOpen={showCategories}
                    toggleMenu={() => setShowCategories(!showCategories)}
                ></MenuToggleButton>
            </motion.div>

            {/* Mobile Menu - AnimatePresence for mount/unmount animations */}
            <AnimatePresence>
                {showCategories && (
                    <motion.ul
                        className="lg:hidden flex flex-col gap-4 mt-4 w-full"
                        variants={menuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden" // Define exit animation
                    >
                        {categories.map((c) => (
                            <li
                                key={c.path}
                                className="py-2 px-4 bg-white rounded-md shadow-sm uppercase"
                            >
                                <Link
                                    className="block"
                                    href={`/category/${c.path}`}
                                    onNavigate={() => setShowCategories(false)}
                                >
                                    {c.name}
                                </Link>
                            </li>
                        ))}
                        <li className="py-2 px-4 bg-white rounded-md shadow-sm uppercase">
                            <Link
                                onNavigate={() => setShowCategories(false)}
                                href="/hindi"
                                className="block"
                            >
                                हिंदी
                            </Link>
                        </li>
                        <Search
                            placeholder="Find articles"
                            postSubmit={() => setShowCategories(false)}
                        />
                    </motion.ul>
                )}
            </AnimatePresence>
        </>
    );
}

export default HeaderClient;
