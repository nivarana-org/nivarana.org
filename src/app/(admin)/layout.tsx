import Header from "@/components/admin/Header";
import ClientRoot from "./client";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        redirect("/sign-in");
    }
    if (session && session.user.role !== "admin") {
        return (
            <div>
                Sorry, you are not allowed to log-in. If this is a mistake, talk
                to you-know-who
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
