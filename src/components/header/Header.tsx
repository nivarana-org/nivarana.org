import Link from "next/link";
import HeaderClient from "./Header-client";
import * as motion from "motion/react-client";
import Image from "next/image";
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

export default async function Header({ categories }) {
    return (
        <HeaderClient
            categories={categories}
            logoComponent={<LogoComponent></LogoComponent>}
        ></HeaderClient>
    );
}
