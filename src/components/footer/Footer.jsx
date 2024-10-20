import Link from "next/link";
import { NivaranaSocialMedia } from "../social";

const Footer = () => {
    return (
        <footer>
            <div className='p-2 flex space-x-4 items-center mb-6 justify-evenly'>
                <div className="mr-2">© 2024 Nivarana. All Rights Reserved.</div>
                <div className="flex space-x-4">
                    <Link href="/contact">Contact Us</Link>
                    <Link href="/about">About Us</Link>
                    <Link href="/submission-guidelines">Submission Guidelines</Link>
                </div>
                <div className="flex space-x-4">
                    <NivaranaSocialMedia/>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
