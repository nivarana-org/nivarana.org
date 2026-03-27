"use server";

import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { getActiveSubscriptionByUserId } from "@/data/subscriptions";

export type UserAbility = "comment.write";

export async function setPasswordAction(formData: FormData) {
    const newPassword = formData.get("newPassword") as string;

    if (!newPassword || newPassword.length < 8) {
        return { error: "Password must be at least 8 characters" };
    }

    try {
        await auth.api.setPassword({
            body: {
                newPassword,
            },
            headers: await headers(),
        });
        return { message: "Password set successfully" };
    } catch (error) {
        console.error("Error setting password:", error);
        return { error: "Failed to set password" };
    }
}

export async function getUserAbilities(): Promise<{
    status: boolean;
    abilities?: UserAbility[];
}> {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
        return { status: false, abilities: [] };
    }

    const abilities: UserAbility[] = [];

    const subscription = await getActiveSubscriptionByUserId(session.user.id);
    if (subscription && subscription.status === "active") {
        abilities.push("comment.write");
    }

    return { status: true, abilities };
}
