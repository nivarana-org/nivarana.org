import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/assets/logo.png";

function Header({ email, picture }: { email: string; picture?: string }) {
    return (
        <header className="flex flex-row gap-1 items-stretch justify-between max-w-(--breakpoint-md) mx-auto">
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
                <div className="flex flex-row items-center">
                    {email}{" "}
                    {picture ? (
                        <Image
                            src={picture}
                            alt="profile pic"
                            width={40}
                            height={40}
                        ></Image>
                    ) : null}
                </div>
            </Link>
        </header>
    );
}

export default Header;
