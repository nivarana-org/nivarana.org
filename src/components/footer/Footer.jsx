import Link from "next/link";
import { NivaranaSocialMedia } from "../social";

const Footer = () => {
    return (
        <footer>
            <div className="p-2 flex flex-col space-x-4 items-center pb-18 justify-evenly bg-nivarana-charcoal text-nivarana-white">
                <div className="flex flex-col lg:flex-row space-x-4 mb-5">
                    <Link href="/contact" className="p-4">
                        Contact Us
                    </Link>
                    <Link href="/about" className="p-4">
                        About Us
                    </Link>
                    <Link href="/submission-guidelines" className="p-4">
                        Submission Guidelines
                    </Link>
                </div>
                <div className="flex space-x-4">
                    <NivaranaSocialMedia />
                </div>
                <div className="mr-2 mt-5 p-4">
                    © {new Date().getFullYear()} Nivarana. All Rights Reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
