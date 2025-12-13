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
    const session = await auth.api.getSession({headers: await headers()});
    if (!session) {
      redirect("/sign-in")
    }
    if (session && session.user.role !== "admin") {
      return (
        <div>
          Sorry, you're not allowed to log-in
        </div>
      )
    }
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
