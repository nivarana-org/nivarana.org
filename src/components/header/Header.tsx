import Link from "next/link";
import HeaderClient from "./Header-client";
import * as motion from "motion/react-client";
import Image from "next/image";
import SearchIcon from "./SearchButton";
import logo from "../../../public/assets/logo.png";

function LogoComponent() {
    return (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="z-10"
        >
            <Link href="/">
                <Image src={logo} alt="Nivarana Logo" className="w-48" />
            </Link>
        </motion.div>
    );
}

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

function DesktopMenuComponent({ categories }) {
    return (
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
    );
}

export default async function Header({ categories }) {
    return (
        <header className="p-4 shadow-md text-nivarana-charcoal bg-nivarana-white">
            <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between">
                <LogoComponent></LogoComponent>
                <HeaderClient categories={categories}></HeaderClient>
                <DesktopMenuComponent
                    categories={categories}
                ></DesktopMenuComponent>
            </div>
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="h-1 bg-nivarana-green mt-4"
            ></motion.div>
        </header>
    );
}
