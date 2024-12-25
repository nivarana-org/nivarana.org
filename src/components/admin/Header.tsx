import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/images/logo.png";

function Header({ email, picture }: { email: string; picture?: string }) {
    return (
        <header className="flex gap-1 items-center justify-center">
            <Link href="/admin">
                <Image
                    src={logo}
                    alt="logo"
                    className="md:w-[70px] w-20"
                    width={100}
                />
            </Link>
            <Link
                href="/"
                className="p-3 bg-cyan-100 hover:bg-cyan-300 text-black no-underline"
            >
                Public
            </Link>
            <Link href="/admin/profile">
                {email}{" "}
                {picture ? <img src="picture" alt="profile pic"></img> : null}
            </Link>
        </header>
    );
}

export default Header;
