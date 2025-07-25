import { auth } from "@/auth";
import Header from "@/components/admin/Header";
import ClientRoot from "./client";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();
    return (
        <ClientRoot>
            <Header
                email={session?.user.email}
                picture={session?.user.picture}
            />
            <hr />
            {children}
        </ClientRoot>
    );
}
