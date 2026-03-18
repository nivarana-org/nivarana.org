import Header from "@/components/admin/Header";
import ClientRoot from "./client";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut } from "@/components/admin/LogOut";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        redirect(`/sign-in?return=/admin`);
    }
    if (session && session.user.role !== "admin") {
        return (
            <div>
                Sorry, you are not allowed to access the admin interface. If
                this is a mistake, talk to you-know-who. Or
                <LogOut inline={true}></LogOut>
                and sign-in with a different account.
            </div>
        );
    }
    return (
        <ClientRoot>
            <Header
                email={session?.user.email}
                picture={session?.user.image ?? undefined}
            />
            <hr />
            {children}
        </ClientRoot>
    );
}
