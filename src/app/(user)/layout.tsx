import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/assets/logo.png";
import { LogOut } from "@/components/admin/LogOut";

export default async function UserLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        redirect(`/sign-in?return=/profile`);
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-3 flex flex-row items-center justify-between">
                    <Link href="/">
                        <Image
                            src={logo}
                            alt="logo"
                            className="h-10 w-auto"
                            width={100}
                        />
                    </Link>
                    <nav className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                        >
                            Home
                        </Link>
                        <Link
                            href="/profile"
                            className="text-nivarana-blue font-medium px-3 py-2 rounded-md text-sm"
                        >
                            {session.user.name || session.user.email}
                        </Link>
                        <LogOut inline={true} />
                    </nav>
                </div>
            </header>
            <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
        </div>
    );
}
