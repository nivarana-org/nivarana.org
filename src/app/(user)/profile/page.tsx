import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import ProfilePageClient from "./page-client";

export default async function ProfilePage() {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
        return <div>Loading...</div>;
    }

    return (
        <ProfilePageClient
            user={{
                id: session.user.id,
                email: session.user.email,
                name: session.user.name || "",
                image: session.user.image || null,
                emailVerified: !!session.user.emailVerified,
            }}
        />
    );
}
