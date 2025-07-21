"use client";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/assets/logo.png";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import MenuToggleButton from "./MenuToggleButton";
import Search from "../search/sidebar-search";
import SearchIcon from "./SearchButton";

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

const desktopMenuVariants = {
    hidden: {
        x: "100%", // Start off-screen to the left
        opacity: 0,
    },
    visible: {
        x: "0%",
        opacity: 1,
        transition: {
            delay: 0.2, // Small delay after logo animation
            duration: 0.5,
            ease: "easeOut",
        },
    },
};

function Header({ categories }) {
    const [showCategories, setShowCategories] = useState(false);
    return (
        <header className="p-4 shadow-md text-nivarana-charcoal bg-nivarana-white">
            <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="z-10"
                >
                    <Link href="/">
                        <Image
                            src={logo}
                            alt="Nivarana Logo"
                            className="w-48"
                        />
                    </Link>
                </motion.div>

                <div className="self-end">
                    <MenuToggleButton
                        isOpen={showCategories}
                        toggleMenu={() => setShowCategories(!showCategories)}
                    ></MenuToggleButton>
                </div>

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
                                        onNavigate={() =>
                                            setShowCategories(false)
                                        }
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

                {/* Desktop Menu */}
                <motion.ul
                    className="hidden lg:flex lg:flex-row flex-nowrap gap-4 ml-auto" // ml-auto to push to the right
                    variants={desktopMenuVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {categories.map((c) => (
                        <li
                            key={c.path}
                            className="py-2 px-4 hover:text-nivarana-green hover:scale-110 transition-all uppercase"
                        >
                            <Link href={`/category/${c.path}`}>{c.name}</Link>
                        </li>
                    ))}
                    <li className="py-2 px-4 hover:text-nivarana-green hover:scale-110 transition-all uppercase">
                        <Link href="/hindi">हिंदी</Link>
                    </li>
                    <li className="py-2 px-4 hover:text-nivarana-green hover:scale-110 transition-all uppercase">
                        <Link href="/search">
                            <SearchIcon></SearchIcon>
                        </Link>
                    </li>
                </motion.ul>
            </div>
            <div className="h-1 bg-nivarana-green mt-4"></div>
        </header>
    );
}

export default Header;
