"use server";

import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { getActiveSubscriptionByUserId } from "@/data/subscriptions";

export type UserAbility = "comment.write";

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
